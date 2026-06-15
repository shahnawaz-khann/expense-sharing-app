from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.expense import Expense

from app.database_session import get_db

from app.models.expense import Expense
from app.models.expense_split import ExpenseSplit
from app.models.group import Group
from app.models.user import User

from app.schemas.expense import ExpenseCreate

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

@router.post("/")
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db)
):

    group = db.query(Group).filter(
        Group.id == expense_data.group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    payer = db.query(User).filter(
        User.id == expense_data.paid_by
    ).first()

    if not payer:
        raise HTTPException(
            status_code=404,
            detail="Payer not found"
        )

    total_split = sum(
        split.share_amount
        for split in expense_data.splits
    )

    if abs(total_split - expense_data.amount) > 0.01:
        raise HTTPException(
            status_code=400,
            detail="Split amounts do not match expense amount"
        )

    expense = Expense(
        group_id=expense_data.group_id,
        description=expense_data.description,
        amount=expense_data.amount,
        currency=expense_data.currency,
        exchange_rate=expense_data.exchange_rate,
        expense_date=expense_data.expense_date,
        paid_by=expense_data.paid_by,
        split_type=expense_data.split_type
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    for split in expense_data.splits:

        expense_split = ExpenseSplit(
            expense_id=expense.id,
            user_id=split.user_id,
            share_amount=split.share_amount
        )

        db.add(expense_split)

    db.commit()

    return {
        "message": "Expense created",
        "expense_id": expense.id
    }

@router.get("/")
def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()

    result = []

    for expense in expenses:

        splits = db.query(ExpenseSplit).filter(
            ExpenseSplit.expense_id == expense.id
        ).all()

        result.append({
            "id": expense.id,
            "group_id": expense.group_id,
            "paid_by": expense.paid_by,
            "description": expense.description,
            "amount": float(expense.amount),
            "splits": [
                {
                    "user_id": split.user_id,
                    "share_amount": float(split.share_amount)
                }
                for split in splits
            ]
        })

    return result