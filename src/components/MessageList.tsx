type Message = {
  role: string;
  content?: string;
};

type MessageListProps = {
  messages: Array<Message>;
};

export default function MessageList({ messages }: MessageListProps) {

  console.log(messages);
  
  return (
    <div className="mb-4 h-[80vh] overflow-y-auto border p-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2   ${msg.role === "user" ? "text-right" : "text-left"}`}
        >
          <span
            className={`inline-block p-2  max-w-[90%]  ${
              msg.role === "user" ? " text-white" : "text-[#48ff00] "
            }`}
          >
            {msg.content}
          </span>
        </div>
      ))}
    </div>
  );
}
