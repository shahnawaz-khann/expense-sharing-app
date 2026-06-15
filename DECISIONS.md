# DECISIONS.md

# Architectural and Design Decisions

Project: Expense Sharing App

Author: Mazid Khan

Tech Stack: FastAPI, SQLAlchemy, MySQL, Pandas

---

# Decision 1: Backend Framework

## Problem

Select a backend framework for building REST APIs.

## Options Considered

### Option A: Flask

Pros:

* Lightweight
* Large ecosystem

Cons:

* Requires additional libraries for validation and API documentation.

### Option B: FastAPI

Pros:

* Automatic OpenAPI documentation
* Built-in request validation using Pydantic
* Better type safety
* Modern asynchronous support

Cons:

* Slightly steeper learning curve

## Decision

FastAPI was selected.

## Reason

FastAPI provides automatic API documentation, request validation, and better developer productivity for REST-based applications.

---

# Decision 2: Database Selection

## Problem

Select a relational database.

## Options Considered

### SQLite

Pros:

* Easy setup
* No server required

Cons:

* Limited scalability
* Not ideal for concurrent access

### MySQL

Pros:

* Production-ready
* Better relational support
* Strong ecosystem

Cons:

* Requires configuration

## Decision

MySQL was selected.

## Reason

The application manages users, groups, expenses, settlements, and import workflows which fit naturally into a relational database model.

---

# Decision 3: Store Import Issues Separately

## Problem

How should CSV anomalies be handled?

## Options Considered

### Reject Entire File

Pros:

* Simple implementation

Cons:

* Good records are lost

### Ignore Errors

Pros:

* Fast import

Cons:

* Data quality issues remain hidden

### Store Issues Separately

Pros:

* Preserves valid records
* Allows review workflow
* Maintains auditability

Cons:

* Additional database table required

## Decision

Store anomalies in a dedicated import_issues table.

## Reason

Users can review and resolve problems without losing valid data.

---

# Decision 4: Manual Review Workflow

## Problem

Should anomalies be corrected automatically?

## Options Considered

### Automatic Correction

Pros:

* Faster imports

Cons:

* Risk of incorrect financial data

### Manual Review

Pros:

* Human verification
* Better data accuracy

Cons:

* Additional review step

## Decision

Manual review workflow implemented.

## Reason

Financial records should never be modified automatically without user confirmation.

---

# Decision 5: Duplicate Expense Handling

## Problem

How should duplicate expenses be treated?

## Options Considered

### Auto Delete

Pros:

* Prevents duplicates

Cons:

* Legitimate expenses may be removed

### Flag For Review

Pros:

* User retains control

Cons:

* Requires manual action

## Decision

Duplicates are flagged for review.

## Reason

Two identical expenses can legitimately occur and should not be removed automatically.

---

# Decision 6: Settlement Calculation Strategy

## Problem

Generate settlement recommendations.

## Options Considered

### Pairwise Settlement

Every debtor pays every creditor.

Pros:

* Simple

Cons:

* Too many transactions

### Net Balance Settlement

Calculate net balances and minimize transfers.

Pros:

* Fewer transactions
* Easier to understand

Cons:

* Slightly more complex logic

## Decision

Net balance settlement approach selected.

## Reason

Produces simpler settlement recommendations and reduces transaction count.

---

# Decision 7: Currency Handling

## Problem

How should multiple currencies be handled?

## Options Considered

### Automatic Conversion

Pros:

* Immediate calculations

Cons:

* Requires exchange rates
* Potential inaccuracies

### Manual Review

Pros:

* Transparent
* Accurate

Cons:

* Additional user involvement

## Decision

Manual review required.

## Reason

Currency conversion should not occur without reliable exchange-rate information.

---

# Decision 8: Auditability

## Problem

How should anomaly decisions be tracked?

## Decision

Every anomaly receives:

* Status
* Description
* Resolution Action

## Reason

Ensures traceability and accountability for imported financial data.

---

# Summary

The primary design goal of this project is correctness and auditability rather than aggressive automation. All major decisions were made to ensure financial data remains accurate, reviewable, and transparent.