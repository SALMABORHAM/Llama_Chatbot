"use client";

import { useState, useEffect, FormEvent, useRef } from "react";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      if (response.ok) {
        const botMessage: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.error || "Something went wrong.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
     } catch (error) {
      console.error("Error fetching chat:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "An unexpected error occurred.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow px-4 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Chat With Llama
        </h1>
      </header>

 {/* ChatBox */}
 <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xl ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
        
        {msg.text}
        </div>
        </div>
    ))}
    {loading && (
      <div className="flex justify-start mb-4">
        <div className="flex space-x-1">
          <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
          <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
          <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></span>
        </div>
      </div>
      )}  
       <div ref={messagesEndRef} />
      </div>

        {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex p-4 bg-white shadow">
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
        />
     <button
          type="submit"
          className="ml-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
          disabled={loading}
        >
     <svg
     xmlns="http://www.w3.org/2000/svg"
     className="h-6 w-6"
     fill="none"
     viewBox="0 0 24 24"
     stroke="currentColor"
     >
     <path
     strokeLinecap="round"
     strokeLinejoin="round"
     strokeWidth={2}
     d="M3 8l7.89 2.632a3 3 0 001.11 0L21 8M5 19h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 00-2 2z"
     />
     </svg>
     </button>
     </form>
     </div>
      );
      };

      export default ChatPage;
