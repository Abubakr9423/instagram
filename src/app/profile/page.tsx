"use client";
import {
  FaPlus,
  FaCog,
  FaEdit,
  FaArchive,
  FaLink,
  FaCamera,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import { MdGridOn, MdPlayArrow, MdPersonOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import { FiShare2 } from "react-icons/fi";
import Link from "next/link";
import { Modal } from "antd";
type Post = {
  postId: number;
  userId: string;
  userName: string;
  userImage: string;
  datePublished: string;
  images: string[];
  postLike: boolean;
  postLikeCount: number;
  userLikes: string[];
  commentCount: number;
  comments: any[];
  postView: number;
  userViews: any[];
  postFavorite: boolean;
  userFavorite: any[];
  title: string;
  content: string;
};
const Profile = () => {
  const [data, setData] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  useEffect(() => {
    fetchData();
    fetchPosts();
  }, []);
  async function addData(){
    try {
      await fetch("https://instagram-api.softclub.tj/Post/add-post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: (() => {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("content", content);
          if (images) {
            Array.from(images).forEach((image) => {
              formData.append("images", image);
            });
          }
          return formData;
        })(),
      });
      setModalAdd(false);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  }
  async function fetchData() {
    try {
      const res = await fetch(
        "https://instagram-api.softclub.tj/UserProfile/get-my-profile",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const result = await res.json();
      setData(result.data);
      setEditedBio(result.data.about || "");
    } catch (error) {
      console.error(error);
    }
  }
  async function fetchPosts() {
    setLoadingPosts(true);
    try {
      const res = await fetch(
        "https://instagram-api.softclub.tj/Post/get-my-posts",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const result = await res.json();
      setPosts(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPosts(false);
    }
  }
  const handleBioSave = async () => {
    setIsEditing(false);
    await fetch(
      "https://instagram-api.softclub.tj/UserProfile/update-user-profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ about: editedBio, gender: 0 }),
      },
    );
    fetchData();
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  const handleLikePost = async (postId: number) => {
    try {
      await fetch(`https://instagram-api.softclub.tj/Post/like-post?postId=${postId}`, {
        method: "POST",
        
      });
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-[935px] mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {data?.userName || "Profile"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <FaPlus className="text-lg" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <FiShare2 className="text-lg" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <FaCog className="text-lg" />
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-[935px] mx-auto px-4 py-6">
        {data ? (
          <>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-10">
              <div className="flex flex-col items-center md:items-start">
                <div className="relative group">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-0.5 bg-gradient-to-r from-purple-500 to-pink-500">
                    <img
                      src={`https://instagram-api.softclub.tj/images/${data.image}`}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-black"
                    />
                  </div>
                  <button className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100">
                    <FaCamera className="text-sm" />
                  </button>
                </div>
              </div>
              <div className="flex-1 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-light">
                    {data.userName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-gray-800 cursor-pointer hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                      <FaArchive /> View Archive
                    </button>
                  </div>
                </div>
                <div className="flex gap-8 text-base">
                  <div className="text-center">
                    <div className="font-bold text-lg">{posts.length}</div>
                    <div className="text-gray-400 text-sm">posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">
                      {data.subscribersCount}
                    </div>
                    <div className="text-gray-400 text-sm">followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">
                      {data.subscriptionsCount}
                    </div>
                    <div className="text-gray-400 text-sm">following</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">
                    {data.fullName || data.userName}
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-600"
                        rows={3}
                        placeholder="Tell your story..."
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleBioSave}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {data.about || "No bio yet. Tell your story..."}
                    </p>
                  )}
                  {data.website && (
                    <Link
                      href={data.website}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <FaLink /> {data.website}
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800">
              <div className="flex justify-center gap-16">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex items-center gap-2 py-4 border-t ${activeTab === "posts" ? "border-white text-white" : "border-transparent text-gray-400"} transition-all`}
                >
                  <MdGridOn size={30} className="text-lg" />
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center gap-2 py-4 border-t ${activeTab === "saved" ? "border-white text-white" : "border-transparent text-gray-400"} transition-all`}
                >
                  <MdPlayArrow size={30} className="text-lg" />
                </button>
                <button
                  onClick={() => setActiveTab("tagged")}
                  className={`flex items-center gap-2 py-4 border-t ${activeTab === "tagged" ? "border-white text-white" : "border-transparent text-gray-400"} transition-all`}
                >
                  <MdPersonOutline size={30} className="text-lg" />
                </button>
              </div>
            </div>
            <div className="py-8">
              {activeTab === "posts" && (
                <>
                  {loadingPosts ? (
                    <div className="min-h-[40vh] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-gray-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading posts...</p>
                      </div>
                    </div>
                  ) : posts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3">
                      {posts.map((post) => (
                        <div
                          key={post.postId}
                          className="aspect-square relative group cursor-pointer"
                        >
                          <img
                            src={`https://instagram-api.softclub.tj/images/${post.images[0]}`}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Post+Image';
                            }}
                          />
                          
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                            <div className="flex items-center gap-1 text-white">
                              <FaHeart onClick={() => handleLikePost(post.postId)} className="text-lg" />
                              <span className="font-semibold">{post.postLikeCount}</span>
                            </div>
                            <div className="flex items-center gap-1 text-white">
                              <FaComment className="text-lg" />
                              <span className="font-semibold">{post.commentCount}</span>
                            </div>
                          </div>
                          
                          {post.images.length > 1 && (
                            <div className="absolute top-3 right-3">
                              <div className="w-6 h-6 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
                                  <path d="M0 0h24v24H0z" fill="none"/>
                                  <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
                                </svg>
                              </div>
                            </div>
                          )}
                          
                          {post.images[0]?.endsWith('.mp4') && (
                            <div className="absolute top-3 right-3">
                              <div className="w-6 h-6 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
                                  <path d="M0 0h24v24H0z" fill="none"/>
                                  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div onClick={() => setModalAdd(true)}   className="aspect-square bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 border border-gray-800 rounded-lg">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors">
                          <FaPlus className="text-2xl text-gray-400" />
                        </div>
                        <p  className="text-sm text-gray-400 font-medium">New Post</p>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center mb-6">
                        <MdGridOn className="text-4xl text-gray-600" />
                      </div>
                      <h3 className="text-2xl font-light mb-2">No Posts Yet</h3>
                      <p className="text-gray-400 max-w-md">
                        When you share photos or videos, they'll appear on your profile.
                      </p>
                      <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors">
                        Share your first post
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === "saved" && (
                <div className="min-h-[40vh] flex items-center justify-center">
                  <p className="text-gray-400">No saved posts yet</p>
                </div>
              )}
              
              {activeTab === "tagged" && (
                <div className="min-h-[40vh] flex items-center justify-center">
                  <p className="text-gray-400">No tagged posts yet</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-gray-800 border-t-white animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-900"></div>
                </div>
              </div>
              <p className="text-gray-400">Loading profile...</p>
            </div>
          </div>
        )}
      </div>
      <Modal open={modalAdd} onCancel={() => setModalAdd(false)} onOk={addData}>
        <div className="space-y-4 h-full w-full ">
          <h2 className="text-xl font-semibold">Add New Post</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-lg "
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-lg "
            rows={4}
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="w-full border border-gray-700 rounded-lg p-2 text-sm"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;