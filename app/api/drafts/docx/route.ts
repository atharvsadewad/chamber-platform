import { NextResponse } from "next/server";

const MAX_CONTENT_LENGTH = 120_000;
const MAX_TITLE_LENGTH = 120;

type ZipEntry = {
  name: string;
  data: Buffer;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeLine(line: string) {
  return line
    .replace(/^#{1,6}\s+/, "")
    .replace(/^\s*[-*]\s+/, "• ");
}

function buildDocumentXml(content: string) {
  const paragraphs = content.split(/\r?\n/);

  const body = paragraphs
    .map((line) => {
      const normalized = normalizeLine(line);

      if (!normalized.trim()) {
        return "<w:p/>";
      }

      const escaped = escapeXml(normalized);

      return `
        <w:p>
          <w:pPr>
            <w:spacing w:after="140"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:sz w:val="24"/>
              <w:szCs w:val="24"/>
            </w:rPr>
            <w:t xml:space="preserve">${escaped}</w:t>
          </w:r>
        </w:p>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
>
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar
        w:top="1440"
        w:right="1440"
        w:bottom="1440"
        w:left="1440"
        w:header="720"
        w:footer="720"
        w:gutter="0"
      />
    </w:sectPr>
  </w:body>
</w:document>`;
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;

  for (let i = 0; i < buffer.length; i += 1) {
  const byte = buffer[i] ?? 0;

  crc ^= byte;

  for (let bit = 0; bit < 8; bit += 1) {
    crc =
      (crc >>> 1) ^
      (crc & 1
        ? 0xedb88320
        : 0);
  }
}

  return (crc ^ 0xffffffff) >>> 0;
}

function u16(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function u32(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function buildZip(entries: ZipEntry[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];

  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = entry.data;
    const checksum = crc32(data);

    const localHeader = Buffer.concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(checksum),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      name,
    ]);

    localParts.push(localHeader, data);

    const centralHeader = Buffer.concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(checksum),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);

    centralParts.push(centralHeader);

    offset += localHeader.length + data.length;
  }

  const centralDirectory = Buffer.concat(
    centralParts,
  );

  const localData = Buffer.concat(
    localParts,
  );

  const endOfCentralDirectory =
    Buffer.concat([
      u32(0x06054b50),
      u16(0),
      u16(0),
      u16(entries.length),
      u16(entries.length),
      u32(centralDirectory.length),
      u32(localData.length),
      u16(0),
    ]);

  return Buffer.concat([
    localData,
    centralDirectory,
    endOfCentralDirectory,
  ]);
}

function sanitizeFilename(value: string) {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);

  return cleaned || "legal-draft";
}

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const title =
      typeof body?.title === "string"
        ? body.title.trim()
        : "Legal Draft";

    const content =
      typeof body?.content === "string"
        ? body.content.trim()
        : "";

    if (!content) {
      return NextResponse.json(
        {
          error:
            "Draft content is required.",
        },
        { status: 400 },
      );
    }

    if (
      content.length >
      MAX_CONTENT_LENGTH
    ) {
      return NextResponse.json(
        {
          error:
            "Draft is too large to export.",
        },
        { status: 413 },
      );
    }

    const safeTitle = title.slice(
      0,
      MAX_TITLE_LENGTH,
    );

    const entries: ZipEntry[] = [
      {
        name: "[Content_Types].xml",
        data: Buffer.from(
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`,
          "utf8",
        ),
      },
      {
        name: "_rels/.rels",
        data: Buffer.from(
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship
    Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="word/document.xml"
  />
</Relationships>`,
          "utf8",
        ),
      },
      {
        name: "word/document.xml",
        data: Buffer.from(
          buildDocumentXml(content),
          "utf8",
        ),
      },
      {
        name: "word/_rels/document.xml.rels",
        data: Buffer.from(
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`,
          "utf8",
        ),
      },
      {
        name: "word/styles.xml",
        data: Buffer.from(
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`,
          "utf8",
        ),
      },
      {
        name: "docProps/core.xml",
        data: Buffer.from(
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties
  xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
  <dc:title>${escapeXml(safeTitle)}</dc:title>
  <dc:creator>Laws &amp; Judgments AI Draft Assistant</dc:creator>
  <cp:lastModifiedBy>Laws &amp; Judgments</cp:lastModifiedBy>
</cp:coreProperties>`,
          "utf8",
        ),
      },
      {
        name: "docProps/app.xml",
        data: Buffer.from(
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>Laws &amp; Judgments</Application>
</Properties>`,
          "utf8",
        ),
      },
    ];

    const docx = buildZip(entries);

    return new NextResponse(
      new Uint8Array(docx),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${sanitizeFilename(
            safeTitle,
          )}.docx"`,
          "Content-Length":
            String(docx.length),
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "DOCX generation error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate the DOCX file.",
      },
      { status: 500 },
    );
  }
}
