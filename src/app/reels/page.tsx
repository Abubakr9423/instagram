"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaHeart, FaRegCommentDots, FaShare, FaBookmark } from "react-icons/fa";

import type { AppDispatch, RootState } from "@/src/lib/store";
import { getReels, Postlike } from "@/src/lib/features/reels/reelsapi";
import { Heart } from "lucide-react";

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
    <div className="w-full h-screen bg-black flex justify-center">
      <div className="w-[390px] h-screen bg-black border-x border-neutral-800">
        <Swiper direction="vertical" className="h-full">
          {reels.map((item) => (
            <SwiperSlide key={item.postId}>
              <div className="relative w-full h-full bg-black">
                <video
                  src={`https://instagram-api.softclub.tj/images/${item.images}`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute right-3 bottom-24 flex flex-col gap-6 text-white">
                  <button
                    onClick={() => dispatch(Postlike(item.postId))}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <Heart
                      className={`w-7 h-7 transition-all duration-300 ${
                        item.isLiked
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-white hover:text-gray-300"
                      }`}
                    />
                    <span className="text-[12px] font-qsemibold">
                      {item.postLikeCount}
                    </span>
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
