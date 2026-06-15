from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class ImportIssue(Base):
    __tablename__ = "import_issues"

    id = Column(Integer, primary_key=True)

    row_number = Column(Integer)

    issue_type = Column(String(100))

    description = Column(Text)

    severity = Column(String(20))

    status = Column(String(20), default="PENDING")