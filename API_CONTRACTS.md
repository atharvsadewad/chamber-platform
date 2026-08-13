# Laws & Judgments
## API Contracts v1.0

---

# Purpose

This document defines every public service contract used by the frontend.

The frontend must never communicate directly with:

- Supabase
- Gemini
- External APIs

All communication happens through Services.

Changing providers must never require changes to the frontend.

---

# Architecture

Component

↓

Hook

↓

Service

↓

Provider

↓

Database / API

---

# Research Service

Responsibilities

- Global Search
- Filters
- Suggestions
- Trending Searches

Methods

search()

searchAdvanced()

getSuggestions()

getTrending()

getRecent()

---

search()

Input

query

filters

page

limit

Returns

SearchResult[]

Pagination

Total Count

Execution Time

---

# Acts Service

Responsibilities

Retrieve legal documents.

Methods

getDocuments()

getDocument()

getPart()

getByInstrument()

getBySubject()

getRecent()

searchWithinDocument()

---

Example

getDocument(slug)

↓

Returns

Complete Legal Document

+

Metadata

+

Table of Contents

---

# Judgments Service

Responsibilities

Retrieve judgments.

Methods

getJudgment()

getParagraph()

searchJudgments()

getByCitation()

getRelatedJudgments()

getBench()

---

# Dictionary Service

Methods

search()

getDefinition()

getRelatedTerms()

getPopularTerms()

---

# AI Service

Responsibilities

Legal AI Assistant

Methods

ask()

summarize()

explain()

compare()

generateDraft()

translate()

extractCitations()

---

Every AI response should return

Answer

Sources

Confidence

Referenced Documents

---

# Draft Service

Methods

generate()

save()

update()

delete()

exportPDF()

exportDOCX()

getTemplates()

---

# Bookmark Service

Methods

add()

remove()

list()

move()

createCollection()

---

# Annotation Service

Methods

create()

update()

delete()

list()

highlight()

---

# User Service

Methods

getProfile()

updateProfile()

getWorkspace()

getPreferences()

---

# Authentication Service

Methods

signIn()

signOut()

signUp()

resetPassword()

refreshSession()

---

# Analytics Service

Methods

trackSearch()

trackView()

trackBookmark()

trackAI()

trackDocument()

---

# Search Result Contract

Every search result should expose

id

type

title

subtitle

description

url

score

source

highlights

metadata

---

# Error Contract

Every service should return

Success

↓

Data

or

Error

↓

Code

↓

Message

↓

Details

Never throw raw provider errors.

---

# Pagination Contract

All list endpoints support

page

limit

sort

order

filters

search

---

# Provider Independence

Services must never expose

Supabase

Gemini

Indian Kanoon

Implementation details.

The frontend should never know which provider is being used.

---

# Versioning

Future API versions

v1

v2

v3

should not break the frontend.

Breaking changes require new service contracts.

---

# Naming Convention

Services

acts.service.ts

judgments.service.ts

research.service.ts

Hooks

useActs()

useResearch()

useJudgments()

Providers

supabase.ts

gemini.ts

indian-kanoon.ts

---

END OF DOCUMENT