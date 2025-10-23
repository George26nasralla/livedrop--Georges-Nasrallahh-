import { useState } from 'react';
import { AssistantHeader } from '../molecules/AssistantHeader';
import { ChatMessageList } from '../molecules/ChatMessageList';
import { ChatInput } from '../atoms/ChatInput';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citation?: string;
  citations?: string[];  // ← ADD THIS for multiple citations
  intent?: string;       // ← ADD THIS
  timestamp: Date;
}

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantPanel({ isOpen, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      content: "Hi! I'm Alex from LiveDrop customer support. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // ✅ NEW: Call intelligent assistant API
      const response = await fetch('http://localhost:5000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() })
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.message,
          citations: data.citations,  // ✅ Array of citations
          intent: data.intent,        // ✅ Intent type
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '0',
      type: 'assistant',
      content: "Hi! I'm Alex from LiveDrop customer support. How can I help you today?",
      timestamp: new Date()
    }]);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Slide-over Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <AssistantHeader onClose={onClose} />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 h-[calc(100vh-240px)]">
          <ChatMessageList messages={messages} isLoading={isLoading} />
        </div>

        {/* Clear Chat Button */}
        {messages.length > 0 && (
          <div className="px-6 pb-2">
            <button
              onClick={clearChat}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
            >
              Clear conversation
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </>
  );
}