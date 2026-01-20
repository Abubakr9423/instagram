'use client'

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaHeart, FaRegCommentDots, FaShare, FaBookmark } from "react-icons/fa";
import { AppDispatch, RootState } from "@/src/lib/store"; // путь к store
import { getReels } from "@/src/lib/features/reels/reelsapi"; // путь к thunk

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const { reels, loading, error } = useSelector((state: RootState) => state.reels);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getReels(token));
    } else {
      console.warn("Token not found in localStorage!");
    }
  }, [dispatch]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full h-screen bg-black flex justify-center">
      <div className="w-[390px] h-screen bg-black border-x border-neutral-800">
        <Swiper direction="vertical" className="h-full">
          {reels.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative w-full h-full bg-black">
                <video src={item.videoUrl} autoPlay muted loop className="w-full h-full object-cover" />
                <div className="absolute right-3 bottom-24 flex flex-col gap-6 text-white">
                  <FaHeart size={26} />
                  <FaRegCommentDots size={26} />
                  <FaShare size={24} />
                  <FaBookmark size={24} />
                </div>
                <div className="absolute bottom-4 left-3 text-white text-sm">
                  <p className="font-semibold">@{item.user.username}</p>
                  <p className="text-neutral-300 text-xs">{item.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
