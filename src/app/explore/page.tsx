'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CollectionsIcon from "@mui/icons-material/Collections";
import { fetchPosts, Post } from "@/src/lib/features/explore/api";
import { Heart } from "lucide-react";
import { likePostById } from "@/src/lib/features/explore/thunks";

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

  const getPostId = (post: Post) => post.postId ?? post._id;

  return (
    <div className="min-h-screen p-2">
      {/* GRID POSTS */}
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
                  <video src={finalURL} muted loop className="w-full h-full object-cover" />
                ) : (
                  <img src={finalURL} alt={post.caption || "post image"} className="w-full h-full object-cover" />
                )}

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <Heart
                      onClick={(e) => {
                        e.stopPropagation();
                        const id = getPostId(post);
                        if (id) dispatch(likePostById({ postId: id }));
                      }}
                      className={`w-6 h-6 transition-all ${post.postLike ? "fill-red-500 text-red-500" : "text-white"}`}
                    />
                    {post.likesCount || 0}
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

        {selectedPost && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative flex max-w-[90%] max-h-[90%] bg-black rounded-md overflow-hidden shadow-xl">
            
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

            <div className="w-[400px] max-h-[90vh] flex flex-col bg-white rounded-r-md overflow-hidden">
              
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold text-black">{selectedPost.userName || "username"}</span>
                <button onClick={closeModal} className="text-xl font-bold">×</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                <div className="flex items-start gap-3">
                  <span className="font-semibold">{selectedPost.userName || "username"}</span>
                  <p>{selectedPost.caption}</p>
                </div>

                {selectedPost.comments?.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="font-semibold">{c.userName}</span>
                    <p>{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Heart
                    onClick={() => {
                      const id = getPostId(selectedPost);
                      if (id) dispatch(likePostById({ postId: id }));
                    }}
                    className={`w-6 h-6 cursor-pointer ${selectedPost.postLike ? "fill-red-500 text-red-500" : "text-gray-800"}`}
                  />
                  <span>{selectedPost.postLikeCount || 0} likes</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const newComment = { userName: "You", text: e.currentTarget.value };
                        if (!selectedPost.comments) selectedPost.comments = [];
                        selectedPost.comments.push(newComment);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <button
                    className="text-blue-500 font-semibold"
                    onClick={() => {}}
                  >
                    Post
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
