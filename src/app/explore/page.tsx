"use client";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, Post } from "@/src/lib/features/explore/api";
import { AppDispatch, RootState } from "@/src/lib/store";

export default function ExplorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-500">Ошибка: {error}</div>;

  return (
    <div className="min-h-screen p-2">
      <div className="columns-3 gap-2 space-y-2">
        {posts.map((item: Post) => (
          <div
            key={item._id}
            className="relative group break-inside-avoid overflow-hidden rounded-md cursor-pointer"
          >
            {item.mediaUrl?.endsWith(".mp4") ? (
              <video
                src={item.mediaUrl}
                muted
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={item.mediaUrl || item.image} className="w-full object-cover" />
            )}

            {item.mediaUrl?.endsWith(".mp4") && (
              <PlayArrowIcon className="absolute top-2 right-2 text-white" />
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex gap-6 items-center justify-center">
              <div className="flex gap-1 text-white">
                <FavoriteIcon /> {item.likesCount || 0}
              </div>
              <div className="flex gap-1 text-white">
                <ChatBubbleOutlineIcon /> {item.commentsCount || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
