from fastapi.middleware.cors import CORSMiddleware
from app.routers.group import router as group_router
from fastapi import FastAPI
from app.models.user import User
from app.models.group import Group
from app.models.group_member import GroupMember
from app.routers.import_csv import router as import_router
from app.routers import group
from app.database import Base, engine
from app.models.user import User
from app.routers.user import router as user_router
from app.models.expense import Expense
from app.routers.expense import router as expense_router
from app.models.expense_split import ExpenseSplit
from app.models.import_issue import ImportIssue



Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://expense-sharing-app-nine.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)

@app.get("/")
def home():
    return {"message": "Expense Tracker API Running"}
Base.metadata.create_all(bind=engine)

app.include_router(group_router)
app.include_router(expense_router)
app.include_router(import_router)
app.include_router(group.router)