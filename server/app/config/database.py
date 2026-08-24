from pymongo import MongoClient
from app.config.config import Config


client = MongoClient(Config.MONGO_URI)

db = client[Config.DB_NAME]


def get_db():
    return db