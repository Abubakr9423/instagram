'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CollectionsIcon from "@mui/icons-material/Collections";
import { fetchPosts, Post } from "@/src/lib/features/explore/api";

export default function ExplorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((s: RootState) => s.posts);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);

  const baseURL = "https://instagram-api.softclub.tj/images/";

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <div className="p-4 text-center">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  const openModal = (post: Post, index: number) => {
    setSelectedPost(post);
    setMediaIndex(index);
  };

  const closeModal = () => setSelectedPost(null);

  const nextMedia = () => {
    if (!selectedPost) return;
    const mediaArray = (selectedPost.images || []).concat(selectedPost.mediaUrl ? [selectedPost.mediaUrl] : []);
    setMediaIndex((prev) => (prev + 1) % mediaArray.length);
  };

  const prevMedia = () => {
    if (!selectedPost) return;
    const mediaArray = (selectedPost.images || []).concat(selectedPost.mediaUrl ? [selectedPost.mediaUrl] : []);
    setMediaIndex((prev) => (prev - 1 + mediaArray.length) % mediaArray.length);
  };

  return (
    <div className="min-h-screen p-2">
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post, postIndex) => {
          const mediaArray = (post.images || []).concat(post.mediaUrl ? [post.mediaUrl] : []);
          return mediaArray.map((media, mediaIdx) => {
            const isVideo = media.endsWith(".mp4");
            const finalURL = media.startsWith("http") ? media : `${baseURL}${media}`;

            return (
              <div
                key={`${post._id ?? postIndex}-${mediaIdx}`}
                className="relative group cursor-pointer overflow-hidden rounded-md"
                onClick={() => openModal(post, mediaIdx)}
              >
                {isVideo ? (
                  <video
                    src={finalURL}
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={finalURL}
                    alt={post.caption || "post image"}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlay как в Instagram */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <FavoriteIcon fontSize="small" /> {post.likesCount || 0}
                  </div>
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <ChatBubbleOutlineIcon fontSize="small" /> {post.commentsCount || 0}
                  </div>
                  {isVideo && <PlayArrowIcon className="absolute top-2 left-2 text-white" />}
                  {post.images?.length && post.mediaUrl && <CollectionsIcon className="absolute top-2 left-2 text-white" />}
                </div>
              </div>
            );
          });
        })}
      </div>

      {/* ===== MODAL ===== */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative flex max-w-[90%] max-h-[90%] bg-black rounded-md overflow-hidden shadow-xl">
            {/* MEDIA */}
            <div className="relative flex-1 flex items-center justify-center bg-black">
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
                const media = mediaArray[mediaIndex];
                const isVideo = media.endsWith(".mp4");
                const finalURL = media.startsWith("http") ? media : `${baseURL}${media}`;
                return isVideo ? (
                  <video src={finalURL} autoPlay controls className="max-h-[90vh] max-w-[70vw]" />
                ) : (
                  <img src={finalURL} alt={selectedPost.caption || "media"} className="max-h-[90vh] max-w-[70vw]" />
                );
              })()}
            </div>

            {/* INFO PANEL */}
            <div className="w-[350px] bg-black text-white flex flex-col">
              <div className="p-4 flex justify-between items-center border-b border-gray-700 font-semibold">
                username
                <button onClick={closeModal} className="text-xl font-bold">×</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <div className="flex gap-4 items-center">
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
