import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.operations import SearchIndexModel
import time

load_dotenv()

uri = f"mongodb+srv://{os.getenv("MONGODB_USER")}:{os.getenv("MONGODB_PASSWORD")}@{os.getenv("MONGODB_CLUSTER")}/?retryWrites=true&w=majority&appName=Cluster0" 

client = MongoClient(uri)

database = client[os.getenv("MONGODB_DB")]
collection_name = "products"
collection = database[collection_name]

# Ensuring collection exists 
if collection_name not in database.list_collection_names():
    print(f"Collection '{collection_name}' does not exist. Creating it...")
    collection.insert_one({"_init": True})
    print(f"Collection '{collection_name}' created.")

# Vector search index 
search_index_model = SearchIndexModel(
    definition={
        "fields": [
            {
                "type": "vector",
                "path": "embedding",
                "numDimensions": 384,
                "similarity": "cosine",
            }
        ]
    },
    name="vector_index",
    type="vectorSearch"
)

# Creating the search index 
result = collection.create_search_index(model=search_index_model)
print("New search index named " + result + " is building.")

print("Polling to check if the index is ready. This may take up to a minute.")
predicate = lambda index: index.get("queryable") is True

while True:
    indices = list(collection.list_search_indexes(result))
    if len(indices) and predicate(indices[0]):
        break
    time.sleep(5)

print(result + " is ready for querying.")

# Removing dummy doc if it was created 
if collection.count_documents({"_init": True}) > 0:
    collection.delete_one({"_init": True})
    print("Cleaned up dummy init document.")

client.close()
