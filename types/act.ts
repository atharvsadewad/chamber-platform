/* -------------------------------------------------------------------------- */
/*                                   Acts                                     */
/* -------------------------------------------------------------------------- */

export type ActStatus =
  | "active"
  | "repealed"
  | "amended"
  | "draft";

export type InstrumentType =
  | "constitution"
  | "act"
  | "ordinance"
  | "rule"
  | "regulation"
  | "notification"
  | "order"
  | "treaty"
  | "convention";

export interface Act {

  id: string;

  slug: string;

  shortTitle: string;

  longTitle: string;

  actNumber?: string;

  year: number;

  instrument: InstrumentType;

  status: ActStatus;

  jurisdiction: string;

  subject: string;

  chapter?: string;

  section?: string;

  title: string;

  description?: string;

  content: string;

  source?: string;

  language: string;

  lastUpdated?: string;

  createdAt: string;

  updatedAt: string;
}