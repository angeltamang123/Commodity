"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";

const CHATBOT_API_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/chat/stream`;

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef(null);
  const [status, setStatus] = useState("");
  const [streaming, setStreaming] = useState(false);

  // Ref to store the cumulative streaming text
  const streamingTextRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: "user" };
    const botMessagePlaceholder = { text: "", sender: "bot" };
    // Optimistic UI update: add both messages to the state at once
    setMessages((prev) => [...prev, userMessage, botMessagePlaceholder]);
    const currentInput = inputMessage;
    setInputMessage("");
    setStatus("...");

    // Reset the ref at the start of a new stream
    streamingTextRef.current = "";

    try {
      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, sessionId: sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setStreaming(true);

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setStreaming(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const sseMessages = chunk.split("\n\n").filter(Boolean);

        for (const sseMessage of sseMessages) {
          if (sseMessage.startsWith("data: ")) {
            try {
              const data = JSON.parse(sseMessage.substring(5));

              if (data.state === "thinking" || data.state === "using_tool") {
                setStatus(data.message);
              } else if (data.state === "answering") {
                // Append to the ref, not the state
                streamingTextRef.current += data.message;
                // Update the state with the cumulative content
                setMessages((prevMessages) => {
                  const newMessages = [...prevMessages];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.sender === "bot") {
                    // This is the key fix: update with the complete accumulated text
                    lastMessage.text = streamingTextRef.current;
                  }
                  return newMessages;
                });
                setStatus("");
              } else if (data.state === "final") {
                setStatus("");
              }
            } catch (e) {
              console.error("Failed to parse JSON:", e);
              setStatus("An error occurred during streaming.");
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming failed:", error);
      setStatus("Sorry, an error occurred. Please try again.");
      setStreaming(false);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === "bot") {
          lastMessage.text = "Sorry, an error occurred. Please try again.";
        }
        return newMessages;
      });
    } finally {
      scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-gray-100">
      <div className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-xl font-bold">Commodity Chatbot</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-sm ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {status && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg max-w-sm bg-gray-300 text-gray-800 animate-pulse">
              <p>{status}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-200 flex space-x-2"
      >
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={streaming}
          placeholder="Type your message..."
          className="flex-1 p-3 border h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="submit"
          className="p-3 bg-blue-500 h-full text-white rounded-lg hover:bg-blue-600 transition-colors"
          disabled={streaming}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
