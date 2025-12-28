from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.dependency import get_db

load_dotenv()

app = FastAPI()

@app.get("/")
async def root():
    return {
        "root": "welcome to Free-Flow SafeCollab API"
    }

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "api": "running successfully",
            "db_status": "database connection successful"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")
