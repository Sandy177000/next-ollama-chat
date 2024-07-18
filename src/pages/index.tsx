import { useState, useEffect, useCallback } from "react";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";

type Message = {
  role: string;
  content: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsStreaming(true);
    setIsLoading(true);

    try {
      const apiUrl = 'https://next-ollama-chat.vercel.app/api/chat';

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      setIsLoading(false);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullContent = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              fullContent += data.message.content;
              setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                if (newMessages[newMessages.length - 1].role === "assistant") {
                  newMessages[newMessages.length - 1].content = fullContent;
                } else {
                  newMessages.push({
                    role: "assistant",
                    content: fullContent,
                  });
                }
                return newMessages;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsStreaming(false);
    }
  }, [messages]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  }, []);

  return (
    <>
      <div className="mx-auto p-4 relative">
        <MessageList messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} disabled={isStreaming} />
        <button
          onClick={handleClearChat}
          className="mt-4 bg-red-500 text-white p-2"
          disabled={isStreaming}
        >
          Clear Chat
        </button>
      </div>
      {isLoading && (
        <div className="flex w-full h-full absolute z-10 bg-[rgba(0,0,0,0.03)] top-0 justify-center items-center">
          <div className="absolute border-lime-400 border-5 w-10 h-10  animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default Chat;
