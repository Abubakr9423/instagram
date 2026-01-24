"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { FaRegCommentDots, FaShare, FaBookmark } from "react-icons/fa";
import { Heart, MessageCircle, Volume2, VolumeX } from "lucide-react";

import type { AppDispatch, RootState } from "@/src/lib/store";
import { getReels } from "@/src/lib/features/reels/reelsapi";

import { postComment, postLike } from "../../lib/features/home/homeslice";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function ReelItem({ item }: { item: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [openStories, setOpenStories] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activePostId, setActivePostId] = useState<number | null>(null);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  return (
    <div className="relative w-full h-screen">
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
          onClick={() => dispatch(postLike(item.postId))}
          className="flex flex-col items-center gap-1"
        >
          <Heart
                    onClick={() => dispatch(postLike(item.postId))}
                    className={`w-6 h-6 transition-all ${
                      item.postLike ? "fill-red-500 text-red-500" : "text-black"
                    }`}
                  />
          <span className="text-[12px]">{item.postLikeCount}</span>
        </button>

        <Dialog>
          <DialogTrigger onClick={() => setActivePostId(item.postId)}>
            <MessageCircle />
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <div className="flex items-center gap-[40px]">
                <div className="num1 flex items-center gap-[10px]">
                  <Input
                    type="text"
                    placeholder="Comment"
                    value={commentText}
                    className="w-[300px]"
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        if (!activePostId || !commentText.trim()) return;
                        dispatch(
                          postComment({
                            id: activePostId,
                            comment: commentText,
                          }),
                        );
                        setCommentText("");
                      }}
                    >
                      Send
                    </Button>
                  </DialogFooter>
                </div>
              </div>
              <div className="comment">
                {item.comments?.map((c: any) => (
                  <div key={c.postCommentId} className="flex gap-2 mt-2">
                    <Image
                      src={
                        item.userImage
                          ? `https://instagram-api.softclub.tj/images/${c.userImage}`
                          : "/avatar.png"
                      }
                      alt={c.userName}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />

                    <div>
                      <p className="text-sm">
                        <span className="font-[700] mr-1">{c.userName}</span>
                        {c.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
