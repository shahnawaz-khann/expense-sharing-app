import pandas as pd

def validate_row(row, index):
    issues = []

    if pd.isna(row["paid_by"]):
        issues.append(
            ("MISSING_PAYER",
             "No payer specified")
        )

    if pd.isna(row["currency"]):
        issues.append(
            ("MISSING_CURRENCY",
             "Currency missing")
        )

    return issues