import { ChatMessage } from '../atoms/Chatmessage';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citation?: string;
  timestamp: Date;
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12">
        <div className="text-6xl mb-4">🤖</div>
        <p className="text-lg font-semibold mb-2">Welcome to GEORGEous Shop Support!</p>
        <p className="text-sm">Ask me anything about:</p>
        <div className="mt-4 space-y-2 text-left max-w-xs mx-auto">
          <div className="text-xs bg-purple-50 p-2 rounded">📦 Order tracking</div>
          <div className="text-xs bg-pink-50 p-2 rounded">💳 Payment methods</div>
          <div className="text-xs bg-blue-50 p-2 rounded">🔄 Returns & refunds</div>
          <div className="text-xs bg-green-50 p-2 rounded">🛍️ Shopping help</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          content={message.content}
          type={message.type}
          citation={message.citation}
          timestamp={message.timestamp}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-2xl p-4">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}