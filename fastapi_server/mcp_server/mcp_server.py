import os
import requests
import asyncio
from playwright.async_api import async_playwright
from dotenv import load_dotenv
from bson.objectid import ObjectId
from bs4 import BeautifulSoup
from fastmcp import FastMCP
from typing import List, Dict, Any
from pymongo import MongoClient
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

WEBSITE_URL = os.getenv("CLIENT_URL")

MONGO_URI = f"mongodb+srv://{os.getenv("MONGODB_USER")}:{os.getenv("MONGODB_PASSWORD")}@{os.getenv("MONGODB_CLUSTER")}/?retryWrites=true&w=majority&appName={os.getenv("MONGODB_CLUSTER")[:8].capitalize()}" 
DB_NAME = os.getenv("MONGODB_DB")
COLLECTION_NAME = "products"
ATLAS_VECTOR_SEARCH_INDEX_NAME = "vector_index"

mcp = FastMCP("EcommerceTools")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
products_collection = db[COLLECTION_NAME]

# Embedding model
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2",
                                         encode_kwargs={'normalize_embeddings': True},
                                         )

product_vector_store = MongoDBAtlasVectorSearch(
    collection=products_collection,
    embedding=embedding_model,
    index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
    text_key="search_text"
)


@mcp.tool()
async def website_page_resource(page_name: str) -> str:
    """
    Provides the text content of a specific website page by scraping it.
    Pages include: 'about', 'faq', 'privacy-policy', and 'terms-and-conditions'.
    """
    url_to_scrape = f"{WEBSITE_URL}/{page_name}"
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
 
            await page.goto(url_to_scrape)
            
            if page_name == 'about':
                await page.wait_for_selector('h1.text-3xl.md\\:text-4xl')
            else:
                await page.wait_for_selector('h1.text-4xl.md\\:text-5xl')
            
            rendered_content = await page.content()
            await browser.close()
            
        soup = BeautifulSoup(rendered_content, "html.parser")
            
        text_chunks = []
        for tag in soup.find_all(["h1", "h2", "h3", "p", "li"]):
            text_chunks.append(tag.get_text(" ", strip=True))
        main_content = " ".join(text_chunks)

        
        if not main_content:
            return f"No content found on the page at {url_to_scrape}"
        
        return main_content
        
    except requests.exceptions.RequestException as e:
        return f"Error scraping page from {url_to_scrape}: {e}"

@mcp.tool()
async def product_lookup_tool(product_id: str) -> Dict[str, Any]:
    """Retrieves the most recent, structured data for a product by its ID."""
    product = products_collection.find_one({"_id": ObjectId(product_id)},
                                 {"name": 1, "price": 1, "stock": 1, "discountPrice": 1, "discountTill": 1, "rating": 1, "category": 1})
    if product:
        product["_id"] = str(product["_id"])
        return product
    return {"error": "Product not found."}

@mcp.tool()
async def semantic_product_search_tool(query: str) -> List[Dict[str, Any]]:
    """Performs a semantic search for products based on a natural language query."""
    docs = await product_vector_store.asimilarity_search(query, k=5)
    print(docs)
    
    products = []
    for doc in docs:
        products.append({
            "id": str(doc.metadata.get("_id")),
            "name": doc.metadata.get("name"),
            "description": doc.page_content,
        })
    return products

if __name__ == "__main__":
    mcp.run()
    