# Laws & Judgments
## Search Architecture v1.0

---

# Vision

Search is the heart of Laws & Judgments.

Every module should use the same search engine.

Modules include:

- Research
- Bare Acts
- Judgments
- Dictionary
- AI
- Drafts

The user should never need to know where the information comes from.

---

# Search Flow

User

↓

Search Query

↓

Query Parser

↓

Filters

↓

Search Service

↓

Ranking Engine

↓

Unified Results

↓

Frontend

---

# Search Sources

Search should retrieve information from:

Legal Documents

Legal Document Parts

Judgments

Judgment Paragraphs

Dictionary

Draft Templates

Future AI Index

---

# Query Types

The search engine must identify user intent.

Examples

302

↓

Section Search

---

Article 21

↓

Article Search

---

Murder

↓

Keyword Search

---

Right to Privacy

↓

Concept Search

---

Kesavananda Bharati

↓

Judgment Search

---

Criminal Law

↓

Category Search

---

# Search Modes

1.

Exact Search

2.

Partial Search

3.

Phrase Search

4.

Full Text Search

5.

Semantic Search (Future)

6.

AI Assisted Search (Future)

---

# Search Ranking

Priority

Exact Section Number

↓

Exact Article Number

↓

Exact Rule Number

↓

Exact Title

↓

Exact Citation

↓

Partial Title

↓

Keywords

↓

Content

↓

Semantic Similarity

---

# Filters

Jurisdiction

Court

Document Type

Year

Subject

Status

Language

Ministry

Judge

Bench

Date Range

---

# Unified Search Result

Every search result should follow one interface.

Result

↓

Type

↓

Title

↓

Subtitle

↓

Description

↓

Source

↓

Relevance Score

↓

URL

The frontend should never care whether the result came from:

Act

Judgment

Dictionary

AI

---

# Search Suggestions

Support

Recent Searches

Trending Searches

Popular Acts

Popular Judgments

AI Suggestions (Future)

Autocomplete

---

# Autocomplete

While typing

Show

Section Numbers

Act Names

Judgment Titles

Case Numbers

Legal Terms

---

# Advanced Search

Support

AND

OR

NOT

Quotation Search

Filters

Nested Filters

---

# Citation Search

Support

AIR

SCC

CriLJ

All India Reporter

Official Gazette

Neutral Citation

---

# AI Search

Future

User asks

"Explain Section 302"

↓

Search

↓

Retrieve

↓

AI

↓

Answer with citations

The AI must never answer without references.

---

# Search Analytics

Store

Query

Timestamp

Filters

Clicked Result

Duration

Purpose

Improve ranking

Trending searches

Recommendations

---

# Search Engine

Current

PostgreSQL Full Text Search

Future

pgvector

Hybrid Search

Embedding Search

The frontend should never know which engine is being used.

---

# Performance Goals

Autocomplete

<100 ms

Search

<300 ms

AI Retrieval

<1 second

---

# Future

Natural Language Search

Voice Search

OCR Search

Image Search

Multi-language Search

Cross-document Search

Knowledge Graph Search

---

END OF DOCUMENT