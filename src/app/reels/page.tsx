"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { FaRegCommentDots, FaShare, FaBookmark } from "react-icons/fa";
import { Heart, Volume2, VolumeX } from "lucide-react";

import type { AppDispatch, RootState } from "@/src/lib/store";
import { getReels, Postlike } from "@/src/lib/features/reels/reelsapi";

function ReelItem({ item }: { item: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={`https://instagram-api.softclub.tj/images/${item.images}`}
        autoPlay
        muted={muted}
        loop
        playsInline
        className="w-full h-full object-cover"
      />

      <button
        onClick={toggleSound}
        className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="absolute right-3 bottom-24 flex flex-col gap-6 text-white">
        <button
          onClick={() => dispatch(Postlike(item.postId))}
          className="flex flex-col items-center gap-1"
        >
          <Heart
            className={`w-7 h-7 transition-all ${
              item.isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "text-white"
            }`}
          />
          <span className="text-[12px]">{item.postLikeCount}</span>
        </button>

        <FaRegCommentDots size={26} />
        <FaShare size={24} />
        <FaBookmark size={24} />
      </div>

      <div className="absolute bottom-4 left-3 text-white text-sm">
        <p className="font-semibold">@{item.userName}</p>
        <p className="text-neutral-300 text-xs">{item.content}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const { reels, loading, error } = useSelector(
    (state: RootState) => state.reels,
  );

  useEffect(() => {
    dispatch(getReels());
  }, [dispatch]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-[390px] h-screen bg-black border-x border-neutral-800">
        <Swiper direction="vertical" className="h-full">
          {reels.map((item) => (
            <SwiperSlide key={item.postId}>
              <ReelItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
