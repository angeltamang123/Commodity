import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_huggingface import HuggingFaceEmbeddings
from typing import Dict, Any

load_dotenv()

MONGO_URI = f"mongodb+srv://{os.getenv('MONGODB_USER')}:{os.getenv('MONGODB_PASSWORD')}@{os.getenv('MONGODB_CLUSTER')}/?retryWrites=true&w=majority&appName={os.getenv('MONGODB_CLUSTER')[:8].capitalize()}" 

client = MongoClient(MONGO_URI)
db = client[os.getenv("MONGODB_DB")]
products_collection = db["products"]

# Embedding model
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2",
                                         encode_kwargs={'normalize_embeddings': True},
                                         show_progress=True)

def ingest_existing_products():
    """
    Iterates through all products and creates 'embedding' and 'search_text' 
    fields if they are missing.
    """
    print("Starting data ingestion...")
    
    products_to_ingest = products_collection.find({
        "$or": [
            {"embedding": {"$exists": False}},
            {"search_text": {"$exists": False}}
        ]
    })
    
    count = 0
    for product in products_to_ingest:
        try:
            name = product.get('name', '')
            description = product.get('description', '')
            
            # Combine the name and description into a single string for embedding and storage.
            text_to_embed = f"{name} {description}"
            
            if not text_to_embed.strip():
                print(f"Skipping product {product.get('_id')} due to missing name/description.")
                continue

            # Generate the embedding
            embedding_vector = embedding_model.embed_documents([text_to_embed])[0]
            
            # Prepare the update document
            update_data: Dict[str, Any] = {
                "embedding": embedding_vector,
                "search_text": text_to_embed  # Add the new search_text field
            }
            
            # Update the MongoDB document with the new fields
            products_collection.update_one(
                {"_id": product["_id"]},
                {"$set": update_data}
            )
            count += 1
            print(f"Ingested product {product['_id']}. Total ingested: {count}")
            
        except Exception as e:
            print(f"Error ingesting product {product.get('_id')}: {e}")
            
    print(f"Ingestion complete. Total products ingested: {count}")

if __name__ == "__main__":
    ingest_existing_products()