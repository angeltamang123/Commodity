import os
import asyncio
import json
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_ollama import ChatOllama
from langchain.prompts import PromptTemplate
from langgraph.prebuilt import create_react_agent
from langchain_core.tracers import ConsoleCallbackHandler
from langgraph.checkpoint.memory import MemorySaver
from contextlib import asynccontextmanager

# Load system prompt
with open("system_prompt.txt", "r") as f:
    SYSTEM_PROMPT = f.read()

llm = ChatOllama(model="commodity-ai", temperature=0, top_k=15, top_p=0.6, callbacks=[ConsoleCallbackHandler()])

mcp_client = MultiServerMCPClient({
    "ecommerce": {
        "command": "python",
        "args": ["mcp_server/mcp_server.py"], 
        "transport": "stdio",
    }
})

# LangGraph agent instance
agent_executor = None
@asynccontextmanager
async def lifespan(app: APIRouter):
    global agent_executor
    tools = await mcp_client.get_tools()
    agent_executor = create_react_agent(
        model=llm,
        tools=tools,
        prompt=PromptTemplate(template=SYSTEM_PROMPT, input_variables=["messages"]),
        checkpointer=MemorySaver(),
    )
    yield
    



# tools = []

# agent_executor = create_react_agent(
#     model=llm,
#     tools=tools,
#     prompt=PromptTemplate(template=SYSTEM_PROMPT, input_variables=["messages"]),
#     checkpointer=MemorySaver(),
# )

router = APIRouter(lifespan=lifespan)


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
        current_phase = "initial"
        buffer = ""

        def create_json_event(message, state):
            return f"data: {json.dumps({'message': message, 'state': state})}\n\n"

        async for token, metadata in agent_executor.astream(
            {"messages": [{"role": "user", "content": user_message}]},
            config,
            stream_mode="messages"
        ):  
            print(token)
            print("\n----\n")
            print(metadata)
            content = token.content
            buffer += content
            print(content)
            
            # Initial phase
            if current_phase == "initial":
                if "Thought:" in buffer:
                    current_phase = "tool_use"
                    yield create_json_event("Comma is thinking...", "thinking")
                    buffer = "" 
                elif "Action:" in buffer:
                    yield create_json_event("Comma is using a tool...", "using_tool")
                    buffer = "" 
                elif len(buffer) > 15: # Arbitrary threshold to detect non-tool-use
                    # If a certain amount of non-tool-use tokens have arrived,
                    # assume it's a direct answer and stream everything.
                    current_phase = "direct_answer"
                    yield create_json_event(buffer, "answering")
                    buffer = ""
            
            # Tool-use phase
            elif current_phase == "tool_use":
                if "Thought:" in buffer:
                    yield create_json_event("Comma is thinking...", "thinking")
                    buffer = "" 
                elif "Action:" in buffer:
                    yield create_json_event("Comma is using a tool...", "using_tool")
                    buffer = "" 
                elif "Final Answer:" in buffer:
                    current_phase = "direct_answer"
                    buffer = ""
            
            # Tokens Streamed to User
            elif current_phase == "direct_answer":
                yield create_json_event(content, "answering")

        yield create_json_event('[DONE]', "final")

    return StreamingResponse(event_generator(), media_type="text/event-stream")