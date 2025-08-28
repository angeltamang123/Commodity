import os
import asyncio
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_ollama import ChatOllama
from langchain.prompts import PromptTemplate
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from contextlib import asynccontextmanager

# # LangGraph agent instance
# agent_executor = None
# @asynccontextmanager
# async def lifespan(app: APIRouter):
#     global agent_executor
#     tools = await mcp_client.get_tools()
#     agent_executor = create_react_agent(
#         model=llm,
#         tools=tools,
#         prompt=PromptTemplate(template=SYSTEM_PROMPT, input_variables=["messages"]),
#         checkpointer=MemorySaver(),
#     )
#     yield

router = APIRouter()

# --- Agent Initialization (Simplified for this example) ---
# In a production app, you'd use a dependency injection system for the agent
# and its tools to manage resources more effectively.

# Load system prompt
with open("system_prompt.txt", "r") as f:
    SYSTEM_PROMPT = f.read()

# Initialize LLM
llm = ChatOllama(model="commodity-ai", temperature=0, top_k=15, top_p=0.6)

# # Connect to the FastMCP server, ensuring the path is correct
# mcp_client = MultiServerMCPClient({
#     "ecommerce": {
#         "command": "python",
#         "args": ["./mcp_server/mcp_server.py"], # Path relative to the main.py file
#         "transport": "stdio",
#     }
# })

tools = []

agent_executor = create_react_agent(
    model=llm,
    tools=tools,
    prompt=PromptTemplate(template=SYSTEM_PROMPT, input_variables=["messages"]),
    checkpointer=MemorySaver(),
)



# The core streaming endpoint
@router.post("/stream")
async def chat_stream(request: Request):
    """Streams responses from the LangGraph agent using Server-Sent Events (SSE)."""
    body = await request.json()
    user_message = body.get("message")
    session_id = body.get("sessionId", "default")
    
    if not user_message:
        raise HTTPException(status_code=400, detail="Message content is required.")

    config = {"configurable": {"thread_id": session_id}}
    
    async def event_generator():
        async for token, metadata in agent_executor.astream(
            {"messages": [{"role": "user", "content": user_message}]}, config, stream_mode="messages"
        ):
            if hasattr(token, "content"):  # it's a BaseMessage
                yield f"data: {token.content}\n\n"
            elif isinstance(token, dict):
                # fallback if it's a dict
                messages = token.get("messages", [])
                if messages:
                    yield f"data: {messages[-1].content}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")