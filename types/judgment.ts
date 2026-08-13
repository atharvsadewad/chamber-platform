export interface Judgment {
  id: string;

  title: string;

  court: string;

  date: string;

  judges: string[];

  summary?: string;

  citation?: string;

  citationCount?: number;

  documentId?: string;

  reportable?: boolean;

  tags?: string[];

  acts?: string[];
}