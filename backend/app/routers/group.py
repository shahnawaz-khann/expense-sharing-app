from app.models.group import Group
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.expense import Expense
from app.models.expense_split import ExpenseSplit
from app.database_session import get_db
from app.models.group import Group
from app.models.group_member import GroupMember
from app.models.user import User


from app.schemas.group import (
    GroupCreate,
    GroupMemberCreate
)

router = APIRouter(
    prefix="/groups",
    tags=["Groups"]
)

@router.post("/")
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == group.created_by
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    new_group = Group(
        name=group.name,
        created_by=group.created_by
    )

    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    return {
        "message": "Group created",
        "group_id": new_group.id
    }

@router.post("/{group_id}/members")
def add_member(
    group_id: int,
    member: GroupMemberCreate,
    db: Session = Depends(get_db)
):
    group = db.query(Group).filter(
        Group.id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    user = db.query(User).filter(
        User.id == member.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    group_member = GroupMember(
        group_id=group_id,
        user_id=member.user_id,
        join_date=member.join_date,
        leave_date=member.leave_date
    )

    db.add(group_member)
    db.commit()

    return {
        "message": "Member added"
    }

@router.get("/{group_id}/balances")
def get_balances(
    group_id: int,
    db: Session = Depends(get_db)
):
    balances = {}

    expenses = db.query(Expense).filter(
        Expense.group_id == group_id
    ).all()

    for expense in expenses:

        payer_id = expense.paid_by

        balances[payer_id] = balances.get(
            payer_id,
            0
        ) + expense.amount

        splits = db.query(
            ExpenseSplit
        ).filter(
            ExpenseSplit.expense_id == expense.id
        ).all()

        for split in splits:

            balances[split.user_id] = balances.get(
                split.user_id,
                0
            ) - split.share_amount

    result = {}

    for user_id, balance in balances.items():

        user = db.query(User).filter(
            User.id == user_id
        ).first()

        result[user.name] = round(balance, 2)

    return result

@router.get("/{group_id}/settlements")
def get_settlements(
    group_id: int,
    db: Session = Depends(get_db)
):
    balances = {}

    expenses = db.query(Expense).filter(
        Expense.group_id == group_id
    ).all()

    # Calculate balances
    for expense in expenses:

        payer_id = expense.paid_by

        balances[payer_id] = balances.get(
            payer_id,
            0
        ) + float(expense.amount)

        splits = db.query(
            ExpenseSplit
        ).filter(
            ExpenseSplit.expense_id == expense.id
        ).all()

        for split in splits:

            balances[split.user_id] = balances.get(
                split.user_id,
                0
            ) - float(split.share_amount)

    debtors = []
    creditors = []

    for user_id, balance in balances.items():

        if balance < 0:
            debtors.append(
                [user_id, abs(balance)]
            )

        elif balance > 0:
            creditors.append(
                [user_id, balance]
            )

    settlements = []

    i = 0
    j = 0

    while i < len(debtors) and j < len(creditors):

        debtor_id, debt = debtors[i]
        creditor_id, credit = creditors[j]

        amount = min(debt, credit)

        debtor = db.query(User).filter(
            User.id == debtor_id
        ).first()

        creditor = db.query(User).filter(
            User.id == creditor_id
        ).first()

        settlements.append({
            "from": debtor.name,
            "to": creditor.name,
            "amount": round(amount, 2)
        })

        debtors[i][1] -= amount
        creditors[j][1] -= amount

        if debtors[i][1] == 0:
            i += 1

        if creditors[j][1] == 0:
            j += 1

    return settlements


@router.get("/")
def get_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).all()

    return [
        {
            "id": group.id,
            "name": group.name,
            "created_by": group.created_by
        }
        for group in groups
    ]