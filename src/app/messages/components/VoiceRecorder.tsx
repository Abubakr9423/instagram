"use client";
import React, { useState, useRef } from "react";
import { Mic, Square, Send, Trash2 } from "lucide-react";

interface VoiceRecorderProps {
  onSend: (file: File) => void;
}

export default function VoiceRecorder({ onSend }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/mpeg" });
        const file = new File([audioBlob], "voice-message.mp3", { type: "audio/mpeg" });
        const url = URL.createObjectURL(audioBlob);
        
        setAudioUrl(url);
        setAudioFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Микрафон дастрас нест:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSend = () => {
    if (audioFile) {
      onSend(audioFile);
      setAudioUrl(null);
      setAudioFile(null);
    }
  };

  const handleCancel = () => {
    setAudioUrl(null);
    setAudioFile(null);
  };

  return (
    <div className="flex items-center gap-2">
      {!isRecording && !audioUrl && (
        <button onClick={startRecording} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-zinc-800">
          <Mic size={22} className="text-gray-500" />
        </button>
      )}

      {isRecording && (
        <button onClick={stopRecording} className="p-2 bg-red-100 rounded-full animate-pulse">
          <Square size={20} className="text-red-600" />
        </button>
      )}

      {audioUrl && (
        <div className="flex items-center gap-2 bg-blue-50 p-1 rounded-lg dark:bg-zinc-900">
          <audio src={audioUrl} controls className="h-8 w-40" />
          <button onClick={handleCancel} className="p-1 text-red-500">
            <Trash2 size={18} />
          </button>
          <button onClick={handleSend} className="p-1 text-blue-500">
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );
}