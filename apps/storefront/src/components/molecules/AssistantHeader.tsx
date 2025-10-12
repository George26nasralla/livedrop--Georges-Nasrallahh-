interface AssistantHeaderProps {
  onClose: () => void;
}

export function AssistantHeader({ onClose }: AssistantHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>💬</span>
          <span>Ask Support</span>
        </h2>
        <p className="text-white text-opacity-90 text-sm mt-1">
          How can we help you today?
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
        aria-label="Close assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}