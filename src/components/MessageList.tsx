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
    <div className="mb-4 h-96 overflow-y-auto border p-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
        >
          <span
            className={`inline-block p-2 rounded-lg ${
              msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {msg.content}
          </span>
        </div>
      ))}
    </div>
  );
}
