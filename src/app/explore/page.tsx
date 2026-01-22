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

  const openModal = (post: Post, index: number) => {
    setSelectedPost(post);
    setSelectedMediaIndex(index);
  };

  const closeModal = () => setSelectedPost(null);

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

      {selectedPost && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative flex max-w-[90%] max-h-[90%] bg-black rounded-md overflow-hidden shadow-lg">
            <div className="relative flex-1 bg-black flex items-center justify-center">
              <button
                onClick={prevMedia}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-3xl px-4 py-2 hover:bg-black/40 transition"
              >
                ‹
              </button>

              <button
                onClick={nextMedia}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-3xl px-4 py-2 hover:bg-black/40 transition"
              >
                ›
              </button>

              {(() => {
                const mediaArray = (selectedPost.images || []).concat(selectedPost.mediaUrl ? [selectedPost.mediaUrl] : []);
                const media = mediaArray[selectedMediaIndex];
                const isVideo = media.endsWith(".mp4");
                const finalURL = media.startsWith("http") ? media : `${baseURL}${media}`;

                return isVideo ? (
                  <video src={finalURL} autoPlay controls className="max-h-[90vh] max-w-[70vw]" />
                ) : (
                  <img src={finalURL} alt={selectedPost.caption || "media"} className="max-h-[90vh] max-w-[70vw]" />
                );
              })()}
            </div>

            <div className="w-[350px] bg-black text-white flex flex-col">
              <div className="p-4 flex justify-between items-center border-b border-gray-700">
                <div className="font-semibold">User Name</div>
                <button onClick={closeModal} className="text-xl font-bold">×</button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex gap-4 items-center mb-4">
                  <FavoriteIcon /> {selectedPost.likesCount || 0}
                  <ChatBubbleOutlineIcon /> {selectedPost.commentsCount || 0}
                </div>
                <p>{selectedPost.caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
