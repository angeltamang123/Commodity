import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

MONGO_URI = f"mongodb+srv://{os.getenv("MONGODB_USER")}:{os.getenv("MONGODB_PASSWORD")}@{os.getenv("MONGODB_CLUSTER")}/?retryWrites=true&w=majority&appName=Cluster0" 

client = MongoClient(MONGO_URI)
db = client[os.getenv("MONGODB_DB")]
products_collection = db["products"]

# Embedding model
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2",
                                         encode_kwargs={'normalize_embeddings': True},
                                         show_progress= True)

def ingest_existing_products():
    """
    Iterates through all products without an 'embedding' field and generates one.
    """
    print("Starting data ingestion...")
    
    products_to_ingest = products_collection.find({"embedding": {"$exists": False}})
    
    count = 0
    for product in products_to_ingest:
        try:
            text_to_embed = f"{product.get('name', '')} {product.get('description', '')}"
            if not text_to_embed.strip():
                print(f"Skipping product {product.get('_id')} due to missing name/description.")
                continue

            # Generating vector embedding
            embedding_vector = embedding_model.embed_documents([text_to_embed])[0]
            
            # Updating the MongoDB document with the new vector
            products_collection.update_one(
                {"_id": product["_id"]},
                {"$set": {"embedding": embedding_vector}}
            )
            count += 1
            print(f"Ingested product {product['_id']}. Total ingested: {count}")
            
        except Exception as e:
            print(f"Error ingesting product {product.get('_id')}: {e}")
            
    print(f"Ingestion complete. Total products ingested: {count}")

if __name__ == "__main__":
    ingest_existing_products()