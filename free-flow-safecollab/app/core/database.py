import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

database_host:str | None = os.getenv("DB_HOST")
database_port:str | None = os.getenv("DB_PORT")
database_name: str | None = os.getenv("DB_NAME")
database_user: str | None = os.getenv("DB_USER")
database_pass: str | None = os.getenv("DB_PASS")

DATABASE_URL: str = f"postgresql://{database_user}:{database_pass}@{database_host}:{database_port}/{database_name}"

engine = create_engine(DATABASE_URL)

sessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

Base = declarative_base()