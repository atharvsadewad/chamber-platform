# Laws & Judgments
## Database Schema v1.0

---

# Philosophy

The database is document-centric.

The platform should support every legal instrument without changing the schema.

Examples:

- Constitution
- Bare Acts
- Rules
- Regulations
- Notifications
- Circulars
- Ordinances
- Treaties
- Conventions
- Government Orders

Every one of them is treated as a Legal Document.

---

# Core Entities

User

Legal Document

Legal Document Part

Judgment

Judgment Paragraph

Bookmark

Annotation

Draft

Search History

AI Conversation

---

# Entity Relationship

User

├── Bookmarks

├── Drafts

├── Search History

├── AI Conversations

└── Annotations


Legal Document

└── Legal Document Parts


Judgment

└── Judgment Paragraphs

---

# Table

legal_documents

Purpose:

Stores one complete legal instrument.

Examples:

Bharatiya Nyaya Sanhita

Constitution of India

Companies Act

Income Tax Act

Motor Vehicles Act

Environmental Protection Rules

---

Columns

id (UUID)

slug

short_title

long_title

year

document_number

instrument_type

status

jurisdiction

subject

language

ministry

effective_date

repealed_date

source

official_url

version

created_at

updated_at

---

instrument_type

Possible values

Constitution

Act

Rule

Regulation

Notification

Order

Circular

Treaty

Convention

Ordinance

Bill

Guideline

Manual

---

status

Draft

Active

Repealed

Amended

Archived

---

# Table

legal_document_parts

Purpose

Stores every readable portion of a document.

Examples

Section

Article

Rule

Clause

Schedule

Chapter

Appendix

Explanation

Illustration

Proviso

---

Columns

id (UUID)

document_id (FK)

parent_part_id (nullable)

part_type

part_number

heading

content

search_vector

sort_order

created_at

updated_at

---

Examples

Constitution

Article 14

↓

part_type = Article

---

BNS

Section 302

↓

part_type = Section

---

Companies Act

Rule 17

↓

part_type = Rule

---

Benefits

One viewer

One search engine

One AI pipeline

One citation engine

---

# Table

judgments

Purpose

Stores metadata for judgments.

Columns

id

court

bench

case_number

case_title

citation

decision_date

judge_names

jurisdiction

keywords

summary

source

official_url

created_at

updated_at

---

# Table

judgment_paragraphs

Purpose

Stores judgment text paragraph-wise.

Columns

id

judgment_id

paragraph_number

content

search_vector

created_at

---

Benefits

AI can cite paragraph numbers.

Search becomes paragraph level.

No huge blobs.

---

# Table

users

Purpose

Application users.

Authentication handled by Supabase Auth.

Additional profile information stored here.

---

# Table

bookmarks

Stores

User

↓

Document

↓

Specific Part

---

Columns

id

user_id

document_id

part_id

created_at

---

# Table

annotations

Stores notes.

User

↓

Document

↓

Part

↓

Comment

---

# Table

drafts

Stores generated legal drafts.

Petitions

Applications

Notices

Replies

Contracts

---

# Table

search_history

Stores

User

↓

Query

↓

Filters

↓

Timestamp

Useful for

Analytics

Recommendations

Recent Searches

---

# Table

ai_conversations

Stores

Chat history

Prompt

Response

Referenced documents

Timestamp

---

# Search Strategy

The frontend never performs ranking.

Ranking belongs to backend.

Priority

Exact Section

↓

Exact Article

↓

Exact Title

↓

Partial Title

↓

Keywords

↓

Content

↓

Semantic Search (future)

---

Future Search Engine

PostgreSQL Full Text Search

↓

pgvector

↓

Hybrid Search

No frontend changes required.

---

# Relationships

legal_documents

1

↓

N

legal_document_parts

---

judgments

1

↓

N

judgment_paragraphs

---

users

1

↓

N

bookmarks

annotations

drafts

search_history

ai_conversations

---

# Design Rules

Never duplicate

Sections

Articles

Rules

Notifications

They all belong inside

legal_document_parts

---

Never store

Entire judgment as one blob.

Store paragraphs.

---

Never write

BNS specific tables.

Everything should remain generic.

---

# Future Modules Supported

Bare Acts

Research

Judgments

Dictionary

AI

Draft Generator

Workspace

Bookmarks

Annotations

Recommendations

Analytics

without database redesign.

---

END OF DOCUMENT