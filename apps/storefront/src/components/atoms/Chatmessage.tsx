interface ChatMessageProps {
  content: string;
  type: 'user' | 'assistant';
  citation?: string;
  timestamp: Date;
}

export function ChatMessage({ content, type, citation, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
          type === 'user'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {citation && citation !== 'N/A' && (
          <div className="mt-2 pt-2 border-t border-gray-300 border-opacity-30">
            <p className="text-xs opacity-75">
              📚 Source: {citation}
            </p>
          </div>
        )}
        <p className="text-xs opacity-60 mt-2">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}