from .database import sessionLocal
#dependency

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

