# Laws & Judgments
## Software Architecture v1.0

---

# Vision

Laws & Judgments is a production-grade legal research platform for India.

The platform is designed to provide:

- Legal Research
- Bare Acts
- Judgments
- Legal Drafting
- AI Assistance
- Legal Dictionary
- Bookmarks
- Personalized Workspace

The architecture prioritizes:

- Scalability
- Maintainability
- Separation of Concerns
- Reusability
- Backend Independence

---

# Core Principles

## 1. UI never knows where data comes from.

React components must never communicate directly with:

- Supabase
- Gemini
- External APIs
- Database queries

Instead they communicate only through Hooks.

---

## 2. Hooks never contain business logic.

Hooks manage:

- loading
- errors
- state
- cache
- pagination

Nothing else.

---

## 3. Services contain business logic.

Services are responsible for:

- querying data
- filtering
- sorting
- validation
- combining multiple providers

Services never contain UI.

---

## 4. Providers communicate with external systems.

Providers are the only layer allowed to access:

- Supabase
- Gemini
- Government APIs
- Indian Kanoon
- Storage

Providers should never know anything about React.

---

## 5. Types are shared contracts.

Every module must expose TypeScript interfaces.

UI and backend communicate only through those contracts.

---

# Architecture

Frontend

↓

Pages

↓

Components

↓

Hooks

↓

Services

↓

Providers

↓

Database / APIs

---

# Folder Structure

app/

components/

config/

constants/

hooks/

providers/

services/

types/

lib/

public/

---

# Providers

providers/

database/

ai/

api/

Purpose:

Connect external systems.

Examples:

database/

supabase.ts

storage.ts

ai/

gemini.ts

api/

indian-kanoon.ts

ecourts.ts

india-code.ts

Providers should never contain business logic.

---

# Services

Services implement application logic.

Example:

acts.service.ts

Responsibilities:

- search
- filtering
- ranking
- pagination
- validation

Services may call multiple providers.

Example:

Acts Service

↓

Supabase

↓

India Code API

↓

merge results

↓

return unified object

---

# Hooks

Hooks exist only for React.

Example:

useActs()

Responsibilities:

- loading state
- error state
- pagination state
- cache interaction

Hooks never build SQL.

Hooks never know API keys.

---

# Components

Components render UI.

Responsibilities:

- render
- user interaction
- accessibility

Components never fetch data.

Forbidden:

Component

↓

Supabase

Correct:

Component

↓

Hook

↓

Service

---

# Config

Config stores static configuration.

Examples:

Navigation

Feature cards

Categories

Filter definitions

Routes

Config must never contain fetch logic.

---

# Constants

Constants store reusable values.

Examples:

Roles

Permissions

Limits

Routes

Feature flags

---

# Types

Every domain owns its types.

Example:

types/

act.ts

judgment.ts

search.ts

user.ts

draft.ts

No component should invent data structures.

---

# Search Architecture

Search should support:

Exact Section

↓

Section Prefix

↓

Exact Title

↓

Partial Title

↓

Description

↓

Content

Search ranking belongs inside Services.

Never inside Components.

Future:

PostgreSQL Full Text Search

pgvector

Semantic Search

Hybrid Search

The frontend should never change when search technology changes.

---

# AI Architecture

Component

↓

useAI()

↓

AI Service

↓

Gemini Provider

Future providers:

OpenAI

Claude

Groq

Switching providers must not require UI changes.

---

# Authentication

Component

↓

useAuth()

↓

Auth Service

↓

Supabase Auth

Future providers should be replaceable.

---

# Bare Acts

Structure:

Bare Acts

↓

Category

↓

Act

↓

Chapter

↓

Section

Categories are configuration driven.

No duplicated pages.

---

# Judgments

Structure:

Court

↓

Bench

↓

Judgment

↓

Paragraph

↓

Citation

The architecture should support:

Supreme Court

High Courts

Tribunals

District Courts

without duplication.

---

# Data Rules

Never duplicate:

queries

interfaces

business logic

validation

All shared logic belongs inside Services.

---

# Error Handling

Providers throw typed errors.

Services normalize errors.

Hooks expose errors.

Components display errors.

---

# Environment Variables

No API keys inside source code.

Use:

NEXT_PUBLIC_

for safe public values.

Private keys stay server-side.

---

# Naming Convention

Components

PascalCase

Hooks

useSomething

Services

something.service.ts

Providers

provider.ts

Types

singular

Examples:

act.ts

judgment.ts

search.ts

---

# Coding Rules

No any

Strict TypeScript

Reusable functions

Small components

Single responsibility

Readable code before clever code

Prefer composition over duplication.

---

# Future Modules

Research

Bare Acts

Judgments

Draft Generator

AI

Dictionary

Bookmarks

Workspace

Analytics

Admin

The architecture should support adding new modules without restructuring the project.

---

# Philosophy

Build the platform so that changing:

Database

AI Provider

Search Engine

Authentication

Storage

should require changing only the Provider layer.

Everything else should continue working unchanged.

---

END OF DOCUMENT