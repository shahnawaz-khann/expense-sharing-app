# Expense Sharing App

## Overview

Expense Sharing App is a backend system built using FastAPI and MySQL that helps groups manage shared expenses, balances, settlements, and CSV imports with data validation.

The application was designed to solve real-world shared expense management problems, including:

* Dynamic group membership (members can join and leave)
* Expense tracking and splitting
* Balance calculation
* Settlement recommendations
* CSV import with issue detection and review workflow
* Multi-currency support awareness

---

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* Pydantic

### Database

* MySQL

### Data Processing

* Pandas

---

## Features

### Authentication

* User Registration
* User Login

### Group Management

* Create Groups
* Add Members
* Support Join Date
* Support Leave Date

### Expense Management

* Create Expenses
* Multiple Split Types
* Expense Split Tracking
* Group-wise Balance Calculation

### Settlement Suggestions

* Calculate net balances
* Generate simplified settlements
* Determine who should pay whom

### CSV Import System

* Upload CSV directly through API
* Parse expense records
* Detect data quality issues
* Store detected issues for review
* Approval/Rejection workflow

---

## Database Tables

### users

Stores user information.

### groups

Stores expense groups.

### group_members

Tracks group membership history.

### expenses

Stores expense records.

### expense_splits

Stores split details for expenses.

### import_issues

Stores issues detected during CSV import.

---

## Import Validation Rules

The application detects and stores the following issues during CSV import:

| Issue Type          | Handling Policy                     |
| ------------------- | ----------------------------------- |
| Missing Payer       | Requires manual review              |
| Missing Currency    | Defaults to INR and flags warning   |
| USD Expense         | Requires currency conversion review |
| Negative Amount     | Treated as possible refund          |
| Zero Amount         | Flagged for review                  |
| Settlement Detected | Converted into settlement candidate |
| Duplicate Expense   | Requires approval before removal    |
| Invalid Date        | Requires manual correction          |
| Unknown Member      | Requires manual mapping             |

All detected issues are stored in the `import_issues` table with statuses:

* PENDING
* APPROVED
* REJECTED

---

## API Endpoints

### Authentication

POST /users/register

POST /users/login

---

### Groups

POST /groups

POST /groups/{group_id}/members

GET /groups/{group_id}/balances

GET /groups/{group_id}/settlements

---

### Expenses

POST /expenses

---

### CSV Import

POST /import

GET /import/issues

POST /import/issues/{issue_id}/approve

POST /import/issues/{issue_id}/reject

---

## Settlement Logic

The application calculates net balances for all group members and generates simplified settlement recommendations.

Example:

Balances:

Aisha: +1600

Rohan: -800

Priya: -800

Settlement Output:

Rohan → Aisha : ₹800

Priya → Aisha : ₹800

---

## Assumptions

* Users can join and leave groups over time.
* Expenses should only affect active members.
* Duplicate expenses are not automatically deleted.
* Currency mismatches require manual review.
* All import corrections are auditable through approval workflows.

---

## Future Improvements

* React Frontend
* Exchange Rate Integration
* Role-Based Access Control
* Expense Editing Workflow
* Email Notifications
* Advanced Settlement Optimization

---

## Author

Developed as part of a Software Engineering Internship Assignment using FastAPI, MySQL, SQLAlchemy, and Pandas.