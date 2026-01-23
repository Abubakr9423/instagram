"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function EmojiMessages({
  onEmojiSelect,
}: {
  onEmojiSelect: (emoji: any) => void;
}) {
  return (
    <div className="shadow-xl rounded-xl overflow-hidden bg-white border border-gray-200">
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
        theme="light"
        previewPosition="none"
        skinTonePosition="none"
      />
    </div>
  );
}
