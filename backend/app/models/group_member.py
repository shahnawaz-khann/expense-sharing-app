from sqlalchemy import Column, Integer, ForeignKey, Date
from app.database import Base

class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)

    group_id = Column(Integer, ForeignKey("groups.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    join_date = Column(Date)
    leave_date = Column(Date, nullable=True)