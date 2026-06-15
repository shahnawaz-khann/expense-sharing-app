from pydantic import BaseModel
from datetime import date

class SplitItem(BaseModel):
    user_id: int
    share_amount: float

class ExpenseCreate(BaseModel):
    group_id: int

    description: str

    amount: float

    currency: str

    exchange_rate: float = 1

    expense_date: date

    paid_by: int

    split_type: str

    splits: list[SplitItem]