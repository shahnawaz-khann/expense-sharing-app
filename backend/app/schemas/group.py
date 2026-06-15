from pydantic import BaseModel
from datetime import date

class GroupCreate(BaseModel):
    name: str
    created_by: int

class GroupMemberCreate(BaseModel):
    user_id: int
    join_date: date
    leave_date: date | None = None