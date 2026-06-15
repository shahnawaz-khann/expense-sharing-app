# AI_USAGE.md

# AI Usage Disclosure

Project: Expense Sharing App

Author: Mazid Khan

---

# Purpose

This document describes the AI tools used during development, how they were used, prompts provided, and examples where AI-generated suggestions were incorrect and required manual correction.

The final implementation was reviewed, modified, tested, and validated manually before inclusion in the project.

---

# AI Tools Used

## ChatGPT

Usage:

* Architecture brainstorming
* Database design discussion
* API design suggestions
* Documentation drafting
* Code review assistance

---

# How AI Was Used

AI was used as a development assistant rather than an implementation replacement.

The responsibilities of AI included:

* Explaining concepts
* Reviewing architecture choices
* Suggesting API structures
* Generating documentation drafts
* Discussing edge cases

All production code, validation logic, database design decisions, and final implementation choices were reviewed manually.

---

# Example Prompts

## Prompt 1

Design a FastAPI-based expense sharing application that supports groups, expenses, settlements, and CSV imports.

Purpose:

Used to brainstorm initial architecture.

---

## Prompt 2

Suggest database tables for an expense sharing application with import anomaly tracking.

Purpose:

Used during schema planning.

---

## Prompt 3

How can duplicate expenses be detected during CSV import?

Purpose:

Used to evaluate duplicate detection strategies.

---

## Prompt 4

Suggest approaches for balance calculation and settlement generation.

Purpose:

Used during settlement logic design.

---

# AI Mistakes and Corrections

The following examples demonstrate situations where AI suggestions were not adopted directly.

---

## Case 1: Storing Calculated Balances in Database

### AI Suggestion

Store user balances permanently in a balances table.

### Problem

Balances are derived values and can become inconsistent when expenses are edited or deleted.

### Correction

Balances are calculated dynamically from expense records.

### Reason

Ensures consistency and prevents stale financial data.

---

## Case 2: Automatic Deletion of Duplicate Expenses

### AI Suggestion

Delete duplicate expenses immediately when detected.

### Problem

Legitimate expenses can have identical values, dates, and descriptions.

Example:

Two members paying the same amount for similar purchases on the same day.

### Correction

Duplicates are flagged and reviewed manually.

### Reason

Prevents accidental loss of valid financial records.

---

## Case 3: Automatic Currency Conversion

### AI Suggestion

Automatically convert foreign currencies to INR during import.

### Problem

Requires reliable exchange rates and conversion dates.

Incorrect conversion may produce inaccurate balances.

### Correction

Currency mismatches are logged for manual review.

### Reason

Financial accuracy is more important than automation.

---

## Case 4: Reject Entire CSV File When Errors Exist

### AI Suggestion

Reject the entire import if any row contains an error.

### Problem

One invalid record should not prevent hundreds of valid records from being imported.

### Correction

Valid rows are imported while problematic rows are recorded in import_issues.

### Reason

Improves usability without compromising data quality.

---

# Validation Process

All AI-generated suggestions were subjected to:

1. Manual review
2. Technical evaluation
3. Testing against project requirements
4. Comparison with assignment objectives

Only validated solutions were incorporated into the final implementation.

---

# Final Statement

AI was used as a productivity and learning tool to assist with brainstorming, documentation, and design discussions.

All final architectural decisions, implementation choices, validations, and testing were performed manually by the developer.