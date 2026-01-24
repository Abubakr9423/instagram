"use client";

import { Smile } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function ChatInput({ onEmojiSelect }) {
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    onEmojiSelect(emojiData.emoji);
    setShowPicker(false); 
  };

  return (
    <div className="relative">
      <Smile
        className="cursor-pointer text-gray-500 hover:text-blue-600"
        onClick={() => setShowPicker(!showPicker)}
      />

      {showPicker && (
        <div className="absolute bottom-12 left-0 z-50">
          <Picker
            onEmojiClick={onEmojiClick}
            theme="auto"
            width={300}
            height={400}
          />
        </div>
      )}
    </div>
  );
}