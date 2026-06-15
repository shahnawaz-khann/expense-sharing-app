# SCOPE.md

# Expense Sharing App

## Anomaly Log and Database Schema

Author: Mazid Khan

Project: Expense Sharing Application

Tech Stack: FastAPI, SQLAlchemy, MySQL, Pandas

---

# 1. Objective

The objective of this document is to describe:

* Data anomalies identified during CSV ingestion.
* The approach taken to handle each anomaly.
* Assumptions made while processing imported data.
* Database schema used for persistence.
* Data quality decisions made during implementation.

The application imports expense data from CSV files and converts it into structured records while preserving data integrity and auditability.

---

# 2. CSV Data Analysis

The provided expense dataset may contain incomplete, inconsistent, duplicated, or ambiguous records.

Instead of rejecting the entire file when a problem is detected, the system records anomalies in a dedicated table called `import_issues`.

This enables users to review, approve, reject, or manually resolve problematic records.

---

# 3. Anomalies Detected

## 3.1 Missing Payer

### Example

| Date       | Description | Amount | Payer |
| ---------- | ----------- | ------ | ----- |
| 2025-01-10 | Dinner      | 1500   | NULL  |

### Problem

The payer is responsible for funding the expense.

Without a payer:

* ownership cannot be established
* balances cannot be calculated

### Handling Strategy

* Expense is not imported automatically.
* Issue stored in import_issues table.
* Status set to PENDING.

### Reason

Financial ownership should never be guessed.

---

## 3.2 Missing Currency

### Example

| Amount | Currency |
| ------ | -------- |
| 500    | NULL     |

### Problem

Expense value becomes ambiguous.

### Handling Strategy

* Default currency assigned as INR.
* Warning generated.
* Issue logged.

### Reason

Most records are assumed to be local transactions.

However, manual review remains possible.

---

## 3.3 Currency Mismatch

### Example

| Amount | Currency |
| ------ | -------- |
| 50     | USD      |

### Problem

Balances may become inaccurate when multiple currencies are mixed.

### Handling Strategy

* Expense imported.
* Issue recorded.
* Marked for currency review.

### Reason

Exchange rates change over time.

Automatic conversion may introduce inaccuracies.

---

## 3.4 Negative Amount

### Example

| Amount |
| ------ |
| -200   |

### Problem

May represent:

* refund
* reversal
* correction

### Handling Strategy

* Imported as anomaly.
* Logged for review.

### Reason

Negative expenses are not always invalid.

They require human verification.

---

## 3.5 Zero Amount

### Example

| Amount |
| ------ |
| 0      |

### Problem

A zero-value expense usually has no financial impact.

### Handling Strategy

* Stored as warning.
* User review required.

### Reason

May indicate incomplete data entry.

---

## 3.6 Duplicate Expense

Duplicate criteria:

Same:

* payer
* amount
* date
* description

### Example

Expense A:

Rohan, 500, Food, 2025-01-10

Expense B:

Rohan, 500, Food, 2025-01-10

### Problem

Duplicate imports inflate balances.

### Handling Strategy

* Flagged as duplicate.
* Not removed automatically.
* Requires approval workflow.

### Reason

Legitimate identical expenses can occur.

---

## 3.7 Invalid Date

### Example

45/15/2025

### Problem

Date cannot be parsed.

### Handling Strategy

* Record rejected.
* Logged as error.

### Reason

Expense chronology cannot be determined.

---

## 3.8 Future Date

### Example

2035-05-01

### Problem

Expense may be accidental.

### Handling Strategy

* Imported with warning.
* Logged for review.

### Reason

Could represent scheduled expenses.

---

## 3.9 Unknown Member

### Example

Participant:

John

System User:

Not Found

### Problem

Expense shares cannot be assigned.

### Handling Strategy

* Issue recorded.
* Manual mapping required.

### Reason

Avoids accidental creation of incorrect users.

---

## 3.10 Settlement Transaction Found

### Example

Description:

"Paid back to Rohan"

### Problem

May not be a genuine expense.

### Handling Strategy

* Marked as settlement candidate.
* User review required.

### Reason

Settlement transactions should not affect expense totals.

---

# 4. Import Workflow

Step 1

Upload CSV file.

Step 2

Parse records using Pandas.

Step 3

Validate:

* payer
* amount
* currency
* date
* participants

Step 4

Generate anomaly records.

Step 5

Store valid expenses.

Step 6

Store anomalies in import_issues table.

Step 7

Generate import report.

Step 8

Allow review through approval workflow.

---

# 5. Database Schema

## users

Purpose:

Stores registered users.

| Column        | Type      |
| ------------- | --------- |
| id            | Integer   |
| username      | String    |
| email         | String    |
| password_hash | String    |
| created_at    | Timestamp |

---

## groups

Purpose:

Stores expense groups.

| Column     | Type      |
| ---------- | --------- |
| id         | Integer   |
| name       | String    |
| created_at | Timestamp |

---

## group_members

Purpose:

Tracks membership history.

| Column    | Type    |
| --------- | ------- |
| id        | Integer |
| group_id  | Integer |
| user_id   | Integer |
| joined_at | Date    |
| left_at   | Date    |

---

## expenses

Purpose:

Stores expense records.

| Column       | Type      |
| ------------ | --------- |
| id           | Integer   |
| group_id     | Integer   |
| payer_id     | Integer   |
| amount       | Decimal   |
| currency     | String    |
| description  | String    |
| expense_date | Date      |
| created_at   | Timestamp |

---

## expense_splits

Purpose:

Stores allocation of expenses.

| Column       | Type    |
| ------------ | ------- |
| id           | Integer |
| expense_id   | Integer |
| user_id      | Integer |
| share_amount | Decimal |

---

## import_issues

Purpose:

Stores all detected anomalies.

| Column            | Type      |
| ----------------- | --------- |
| id                | Integer   |
| row_number        | Integer   |
| issue_type        | String    |
| issue_description | Text      |
| status            | Enum      |
| resolution_notes  | Text      |
| created_at        | Timestamp |

---

# 6. Assumptions

1. Users may join and leave groups over time.

2. Only active members participate in new expenses.

3. Duplicate expenses require human review.

4. Currency mismatches are not auto-converted.

5. Financial records should remain auditable.

6. Invalid records must never impact settlement calculations.

7. All anomaly decisions should be traceable.

---

# 7. Future Improvements

* Automatic exchange-rate integration.
* AI-assisted duplicate detection.
* Advanced anomaly classification.
* Bulk anomaly resolution.
* Interactive import dashboard.
* Audit trail reporting.
* Multi-currency balance engine.

---

# Conclusion

The import subsystem prioritizes correctness, auditability, and data quality over aggressive automation. Every detected anomaly is preserved and tracked through a review workflow, ensuring that financial calculations remain transparent and trustworthy.