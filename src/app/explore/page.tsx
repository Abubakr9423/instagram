'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { fetchPosts, Post } from "@/src/lib/features/explore/api";

export default function ExplorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const baseURL = "https://instagram-api.softclub.tj/images/";

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-500">Ошибка: {error}</div>;

  // Открыть модалку
  const openModal = (post: Post, index: number) => {
    setSelectedPost(post);
    setSelectedMediaIndex(index);
  };

  // Закрыть модалку
  const closeModal = () => setSelectedPost(null);

  // Навигация по медиа в модалке
  const nextMedia = () => {
    if (!selectedPost) return;
    const mediaArray = (selectedPost.images || []).concat(selectedPost.mediaUrl ? [selectedPost.mediaUrl] : []);
    setSelectedMediaIndex((prev) => (prev + 1) % mediaArray.length);
  };
  const prevMedia = () => {
    if (!selectedPost) return;
    const mediaArray = (selectedPost.images || []).concat(selectedPost.mediaUrl ? [selectedPost.mediaUrl] : []);
    setSelectedMediaIndex((prev) => (prev - 1 + mediaArray.length) % mediaArray.length);
  };

  return (
    <div className="min-h-screen p-2">
      {/* Сетка постов */}
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post: Post, postIndex: number) => {
          const mediaArray: string[] = (post.images || []).concat(post.mediaUrl ? [post.mediaUrl] : []);

          return mediaArray.map((media, mediaIndex) => {
            const isVideo = media.endsWith(".mp4");
            const finalURL = media.startsWith("http") ? media : `${baseURL}${media}`;

            return (
              <div
                key={`${post._id ?? postIndex}-${mediaIndex}`}
                className="relative group overflow-hidden rounded-md cursor-pointer"
                onClick={() => openModal(post, mediaIndex)}
              >
                {isVideo ? (
                  <video
                    src={finalURL}
                    muted
                    loop
                    className="w-full h-full object-cover"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={finalURL}
                    alt={post.caption || "post image"}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex gap-6 items-center justify-center transition-opacity">
                  <div className="flex gap-1 text-white">
                    <FavoriteIcon /> {post.likesCount || 0}
                  </div>
                  <div className="flex gap-1 text-white">
                    <ChatBubbleOutlineIcon /> {post.commentsCount || 0}
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>

      {/* Модалка */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full bg-black rounded-md p-2">
            <button
              className="absolute top-2 right-2 text-white text-xl font-bold"
              onClick={closeModal}
            >
              ×
            </button>

            {/* Текущее медиа */}
            <div className="w-full h-[500px] flex items-center justify-center">
              {(() => {
                const mediaArray = (selectedPost.images || []).concat(selectedPost.mediaUrl ? [selectedPost.mediaUrl] : []);
                const media = mediaArray[selectedMediaIndex];
                const isVideo = media.endsWith(".mp4");
                const finalURL = media.startsWith("http") ? media : `${baseURL}${media}`;

                return isVideo ? (
                  <video src={finalURL} controls className="max-h-full max-w-full" />
                ) : (
                  <img src={finalURL} alt={selectedPost.caption || "media"} className="max-h-full max-w-full" />
                );
              })()}
            </div>

            {/* Навигация */}
            <div className="flex justify-between mt-2">
              <button
                className="text-white px-4 py-2 bg-gray-700 rounded"
                onClick={prevMedia}
              >
                Prev
              </button>
              <button
                className="text-white px-4 py-2 bg-gray-700 rounded"
                onClick={nextMedia}
              >
                Next
              </button>
            </div>

            {/* Лайки, комменты, подпись */}
            <div className="text-white mt-2">
              <div className="flex gap-4">
                <div className="flex gap-1"><FavoriteIcon /> {selectedPost.likesCount || 0}</div>
                <div className="flex gap-1"><ChatBubbleOutlineIcon /> {selectedPost.commentsCount || 0}</div>
              </div>
              <p className="mt-2">{selectedPost.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
