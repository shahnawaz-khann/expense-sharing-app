from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey

from app.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    group_id = Column(Integer, ForeignKey("groups.id"))

    description = Column(String(255))

    amount = Column(Float)

    currency = Column(String(10))

    exchange_rate = Column(Float, default=1)

    expense_date = Column(Date)

    paid_by = Column(Integer, ForeignKey("users.id"))

    split_type = Column(String(20))