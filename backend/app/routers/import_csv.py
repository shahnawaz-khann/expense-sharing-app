from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from io import StringIO
import pandas as pd

from app.database_session import get_db
from app.models.import_issue import ImportIssue

router = APIRouter(
    prefix="/import",
    tags=["CSV Import"]
)

ALLOWED_MEMBERS = [
    "aisha",
    "rohan",
    "priya",
    "meera",
    "sam",
    "dev"
]


@router.post("/")
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Clear previous issues
    db.query(ImportIssue).delete()
    db.commit()

    content = await file.read()

    csv_data = StringIO(
        content.decode("utf-8")
    )

    df = pd.read_csv(csv_data)

    issues_found = 0

    # Normalize description for duplicate detection
    df["desc_normalized"] = (
        df["description"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    for index, row in df.iterrows():

        row_number = index + 2

        # ------------------------
        # Amount Parsing
        # ------------------------

        amount_str = str(
            row.get("amount", "")
        ).replace(",", "").strip()

        try:
            amount = float(amount_str)
        except:
            amount = 0

        # ------------------------
        # Missing Payer
        # ------------------------

        if pd.isna(row.get("paid_by")) or str(
            row.get("paid_by")
        ).strip() == "":

            db.add(
                ImportIssue(
                    row_number=row_number,
                    issue_type="MISSING_PAYER",
                    description="Payer is missing",
                    severity="HIGH"
                )
            )

            issues_found += 1

        # ------------------------
        # Missing Currency
        # ------------------------

        if pd.isna(row.get("currency")) or str(
            row.get("currency")
        ).strip() == "":

            db.add(
                ImportIssue(
                    row_number=row_number,
                    issue_type="MISSING_CURRENCY",
                    description="Currency is missing",
                    severity="MEDIUM"
                )
            )

            issues_found += 1

        # ------------------------
        # Negative Amount
        # ------------------------

        if amount < 0:

            db.add(
                ImportIssue(
                    row_number=row_number,
                    issue_type="NEGATIVE_AMOUNT",
                    description="Negative amount detected (possible refund)",
                    severity="MEDIUM"
                )
            )

            issues_found += 1

        # ------------------------
        # Zero Amount
        # ------------------------

        if amount == 0:

            db.add(
                ImportIssue(
                    row_number=row_number,
                    issue_type="ZERO_AMOUNT",
                    description="Amount is zero",
                    severity="LOW"
                )
            )

            issues_found += 1

        # ------------------------
        # Invalid Date
        # ------------------------

        try:
            pd.to_datetime(row["date"])
        except:

            db.add(
                ImportIssue(
                    row_number=row_number,
                    issue_type="INVALID_DATE",
                    description="Invalid date format",
                    severity="HIGH"
                )
            )

            issues_found += 1

        # ------------------------
        # Unknown Member
        # ------------------------

        split_with = str(row.get("split_with", ""))

        people = split_with.replace(";", ",").split(",")

        for person in people:

            person = person.strip().lower()

            if (
                person
                and person not in ALLOWED_MEMBERS
            ):
                db.add(
                    ImportIssue(
                        row_number=row_number,
                        issue_type="UNKNOWN_MEMBER",
                        description=f"Unknown member: {person}",
                        severity="HIGH"
                    )
                )

                issues_found += 1

        # ------------------------
        # Settlement Detection
        # ------------------------

        notes = str(
            row.get("notes", "")
        ).lower()

        description = str(
            row.get("description", "")
        ).lower()

        settlement_keywords = [
            "settlement",
            "paid back",
            "reimbursement",
            "returned",
            "transfer"
        ]

        if any(
            keyword in notes
            or keyword in description
            for keyword in settlement_keywords
        ):

            db.add(
                ImportIssue(
                    row_number=row_number,
                    issue_type="SETTLEMENT_DETECTED",
                    description="Looks like a settlement rather than an expense",
                    severity="HIGH"
                )
            )

            issues_found += 1

        # ------------------------
        # USD Detection
        # ------------------------

        currency = str(
            row.get("currency", "")
        ).upper()

        if currency == "USD":

            db.add(
                ImportIssue(
                    row_number=row_number,
                    issue_type="USD_EXPENSE",
                    description="USD expense requires conversion",
                    severity="MEDIUM"
                )
            )

            issues_found += 1

    # ------------------------
    # Duplicate Detection
    # ------------------------

    duplicates = df.duplicated(
        subset=[
            "date",
            "desc_normalized",
            "amount"
        ],
        keep=False
    )

    duplicate_rows = df[duplicates]

    for index, row in duplicate_rows.iterrows():

        db.add(
            ImportIssue(
                row_number=index + 2,
                issue_type="DUPLICATE_EXPENSE",
                description="Possible duplicate expense detected",
                severity="HIGH"
            )
        )

        issues_found += 1

    db.commit()

    return {
        "message": "CSV processed successfully",
        "rows": len(df),
        "issues_found": issues_found
    }


@router.get("/issues")
def get_import_issues(
    db: Session = Depends(get_db)
):

    issues = db.query(
        ImportIssue
    ).all()

    return {
        "total_issues": len(issues),
        "issues": [
            {
                "id": issue.id,
                "row_number": issue.row_number,
                "issue_type": issue.issue_type,
                "description": issue.description,
                "severity": issue.severity,
                "status": issue.status
            }
            for issue in issues
        ]
    }

from fastapi import HTTPException

@router.post("/issues/{issue_id}/approve")
def approve_issue(issue_id: int, db: Session = Depends(get_db)):

    issue = db.query(ImportIssue).filter(
        ImportIssue.id == issue_id
    ).first()

    if not issue:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    issue.status = "APPROVED"

    db.commit()

    return {
        "message": "Issue approved"
    }


@router.post("/issues/{issue_id}/reject")
def reject_issue(issue_id: int, db: Session = Depends(get_db)):

    issue = db.query(ImportIssue).filter(
        ImportIssue.id == issue_id
    ).first()

    if not issue:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    issue.status = "REJECTED"

    db.commit()

    return {
        "message": "Issue rejected"
    }
