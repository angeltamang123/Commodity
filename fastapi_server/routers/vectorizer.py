import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from langchain_huggingface import HuggingFaceEmbeddings
from bson.objectid import ObjectId

router = APIRouter()

# Request body schema
class ProductData(BaseModel):
    productId: str
    name: str
    description: str

# MongoDB connection
MONGO_URI = f"mongodb+srv://{os.getenv("MONGODB_USER")}:{os.getenv("MONGODB_PASSWORD")}@{os.getenv("MONGODB_CLUSTER")}/?retryWrites=true&w=majority&appName={os.getenv("MONGODB_CLUSTER")[:8].capitalize()}" 

client = MongoClient(MONGO_URI)
db = client[os.getenv("MONGODB_DB")]
collection_name = "products"
products_collection = db[collection_name]

# Embedding model
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2",
                                         encode_kwargs={'normalize_embeddings': True},
                                         show_progress= True)

@router.post("/vectorize")
def create_embedding_for_product(data: ProductData):
    """
    Creates a vector embedding for a product and saves it to MongoDB.
    """
    try:
        text_to_embed = f"{data.name} {data.description}"
        embedding_vector = embedding_model.embed_documents([text_to_embed])[0]
        
        result = products_collection.update_one(
            {"_id": ObjectId(data.productId)},
            {"$set": {"embedding": embedding_vector}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Product not found or not modified.")
            
        return {"message": "Product vectorized successfully.", "productId": data.productId}
        
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))