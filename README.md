# Rule-Based Content Filter

A full-stack web application .

The application allows users to define reusable text-processing rules, store them in a SQL database, and apply those rules to user-provided text. Matched text is returned with visual metadata and displayed in the frontend using highlights or tooltip/tag indicators.

---

## Purpose

The purpose of this project is to demonstrate a complete rule-based text processing flow using:

- A React frontend
- A .NET Web API backend
- A SQL Server database
- REST API communication
- Reusable rule definitions
- Visual rendering of matched text

The focus of the implementation is correctness, maintainability, and clear separation of responsibilities between the frontend, backend, and database.

---

## Core Functionality

The application supports two main areas:

### 1. Rule Management

Users can create and manage rules that define how text should be matched and displayed.

Each rule contains:

- Keyword or phrase
- Match type
- Action type
- Highlight color or tooltip/tag value
- Active/inactive status

Supported match types:

- `contains`
- `startsWith`
- `exact`

Supported action types:

- `highlight`
- `tooltip`

The rules are stored in the database and reused when processing text.

---

### 2. Text Processing

Users can enter a block of text and submit it for processing.

The backend retrieves all active rules from the database, evaluates them against the input text, and returns the matched results.

The frontend displays:

- Highlighted matches
- Tooltip/tag labels
- Matched rule indicators
- Match summary

---

## Application Flow

```txt
User creates rule
        ↓
Frontend sends rule to API
        ↓
Backend validates and stores rule
        ↓
Rule is saved in SQL Server
        ↓
User submits text for processing
        ↓
Backend loads active rules
        ↓
Backend evaluates text against rules
        ↓
API returns processed result
        ↓
Frontend renders highlights and tags

---

## Project Structure

RuleBasedContentFilter/
│
├── backend/
│   ├── RuleFilter.api/
│   ├── RuleFilter.Business/
│   ├── RuleFilter.DataAccess/
│   ├── RuleFilter.Entities/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
└── README.md

Database

Rules are persisted in SQL Server.

Example table structure:

| Field      | Description                              |
| ---------- | ---------------------------------------- |
| Id         | Primary key                              |
| Keyword    | Text or phrase to match                  |
| MatchType  | Matching strategy                        |
| ActionType | Display action                           |
| Color      | Highlight color                          |
| Tag        | Tooltip/tag label                        |
| IsActive   | Determines whether the rule is processed |

## How to Run

Follow the steps below to run the project locally.

---

## Prerequisites

Before running the project, make sure you have installed:

- .NET SDK
- Node.js
- SQL Server
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/arber-halimi/rule-based-content-filter
cd <project-folder>

## 2. Run the backend api

## 3. Run the front end


