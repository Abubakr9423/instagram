"use client";
import { CiNoWaitingSign } from "react-icons/ci";
import {
  FaPlus,
  FaCog,
  FaEdit,
  FaArchive,
  FaLink,
  FaCamera,
  FaHeart,
  FaComment,
  FaTimes,
  FaBookmark,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaEye,
  FaRegHeart,
  FaRegBookmark,
} from "react-icons/fa";
import { MdGridOn, MdPlayArrow, MdPersonOutline } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { FiShare2 } from "react-icons/fi";
import Link from "next/link";
import { Modal, message, Spin, Upload, Button, Input } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

type Comment = {
  commentId: number;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  createdAt: string;
};

type Post = {
  postId: number;
  userId: string;
  userName: string;
  userImage: string;
  datePublished: string;
  images: string[];
  postLike: boolean;
  postLikeCount: number;
  commentCount: number;
  comments: Comment[];
  postView: number;
  postFavorite: boolean;
  title: string;
  content: string;
};

const Profile = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">(
    "posts",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [fullPostData, setFullPostData] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingFullPost, setLoadingFullPost] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const imageObserver = useRef<IntersectionObserver | null>(null);
  const observedImages = useRef<Set<Element>>(new Set());

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    return {
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    };
  };

  useEffect(() => {
    fetchData();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (activeTab === "saved" && savedPosts.length === 0) fetchSavedPosts();
  }, [activeTab]);

  useEffect(() => {
    imageObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) img.src = src;
            imageObserver.current?.unobserve(img);
            observedImages.current.delete(img);
          }
        });
      },
      { rootMargin: "50px" },
    );
    return () => imageObserver.current?.disconnect();
  }, []);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imagePath === "null" || imagePath === "undefined")
      return "https://via.placeholder.com/400?text=Post+Image";
    return `https://instagram-api.softclub.tj/images/${imagePath}`;
  };

  const getAvatarUrl = (imagePath: string) => {
    if (!imagePath || imagePath === "null" || imagePath === "undefined")
      return "https://via.placeholder.com/150?text=Avatar";
    return `https://instagram-api.softclub.tj/images/${imagePath}`;
  };

  const showMessage = (type: "success" | "error" | "info", content: string) => {
    message[type](content);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://instagram-api.softclub.tj/UserProfile/get-my-profile",
        { headers: getAuthHeader() },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result?.data) {
        setData(result.data);
        setEditedBio(result.data.about || "");
      } else {
        throw new Error("No data in response");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load profile");
      showMessage("error", "Не удалось загрузить профиль");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await fetch(
        "https://instagram-api.softclub.tj/Post/get-my-posts",
        { headers: getAuthHeader() },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setPosts(Array.isArray(result) ? result : result?.data || []);
    } catch (err) {
      console.error(err);
      showMessage("error", "Не удалось загрузить посты");
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      setLoadingSaved(true);
      const url = new URL(
        "https://instagram-api.softclub.tj/UserProfile/get-post-favorites",
      );
      url.searchParams.append("PageNumber", "1");
      url.searchParams.append("PageSize", "50");
      const res = await fetch(url.toString(), { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setSavedPosts(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      console.error(err);
      showMessage("error", "Не удалось загрузить сохранённые посты");
      setSavedPosts([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  const fetchFullPostData = async (postId: number) => {
    try {
      setLoadingFullPost(true);
      const res = await fetch(
        `https://instagram-api.softclub.tj/Post/get-post-by-id?id=${postId}`,
        { headers: getAuthHeader() },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setFullPostData(result?.data || result || null);
    } catch (err) {
      console.error(err);
      showMessage("error", "Не удалось загрузить пост");
    } finally {
      setLoadingFullPost(false);
    }
  };

  const handleAddPost = async () => {
    if (!title.trim() || !content.trim())
      return showMessage("error", "Заполните заголовок и описание");
    if (!images || images.length === 0)
      return showMessage("error", "Выберите хотя бы одно фото/видео");

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      Array.from(images).forEach((image) => formData.append("images", image));

      const res = await fetch(
        "https://instagram-api.softclub.tj/Post/add-post",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Failed to add post");
      showMessage("success", "Пост добавлен");
      setModalAdd(false);
      setTitle("");
      setContent("");
      setImages(null);
      await fetchPosts();
    } catch (err: any) {
      showMessage("error", err.message || "Ошибка при добавлении поста");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    Modal.confirm({
      title: "Удалить пост",
      content: "Вы уверены? Действие нельзя отменить.",
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      async onOk() {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");
          const res = await fetch(
            `https://instagram-api.softclub.tj/Post/delete-post?id=${postId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (!res.ok) throw new Error("Failed to delete post");
          showMessage("success", "Пост удалён");
          setPosts(posts.filter((p) => p.postId !== postId));
          setSavedPosts(savedPosts.filter((p) => p.postId !== postId));
          if (
            isPostModalOpen &&
            (selectedPost?.postId === postId || fullPostData?.postId === postId)
          ) {
            setIsPostModalOpen(false);
            setSelectedPost(null);
            setFullPostData(null);
          }
        } catch (err: any) {
          showMessage("error", err.message || "Ошибка удаления");
        }
      },
    });
  };

  const handleLikePost = async (postId: number) => {
    try {
      const res = await fetch(
        `https://instagram-api.softclub.tj/Post/like-post?postId=${postId}`,
        {
          method: "POST",
          headers: getAuthHeader(),
        },
      );
      if (!res.ok) throw new Error("Failed to like");
      await fetchFullPostData(postId);
    } catch (err) {
      showMessage("error", "Не удалось поставить лайк");
    }
  };

  const handleAddToFavorites = async (postId: number) => {
    try {
      const res = await fetch(
        "https://instagram-api.softclub.tj/Post/add-post-favorite",
        {
          method: "POST",
          headers: { ...getAuthHeader(), "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        },
      );
      if (!res.ok) throw new Error("Failed to favorite");
      await fetchFullPostData(postId);
      showMessage("success", "Добавлено в избранное");
    } catch (err) {
      showMessage("error", "Не удалось добавить в избранное");
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(
        "https://instagram-api.softclub.tj/Post/add-comment",
        {
          method: "POST",
          headers: { ...getAuthHeader(), "Content-Type": "application/json" },
          body: JSON.stringify({ comment: newComment, postId }),
        },
      );
      if (!res.ok) throw new Error("Failed to add comment");

      // Fetch updated post data
      await fetchFullPostData(postId);

      // ALSO update the selectedPost state immediately for better UX
      if (selectedPost?.postId === postId) {
        const updatedComments = [
          ...(selectedPost.comments || []),
          {
            commentId: Date.now(), // Temporary ID
            userId: data?.userId || "",
            userName: data?.userName || "You",
            userImage: data?.image || "",
            content: newComment,
            createdAt: new Date().toISOString(),
          },
        ];

        setSelectedPost((prev) =>
          prev
            ? {
                ...prev,
                comments: updatedComments,
                commentCount: (prev.commentCount || 0) + 1,
              }
            : null,
        );
      }

      setNewComment("");
      showMessage("success", "Комментарий добавлен");
    } catch (err: any) {
      showMessage("error", err.message || "Ошибка добавления комментария");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const res = await fetch(
        `https://instagram-api.softclub.tj/Post/delete-comment?commentId=${commentId}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        },
      );
      if (!res.ok) throw new Error("Failed to delete comment");

      // Update selectedPost state immediately
      if (selectedPost?.comments) {
        setSelectedPost((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.filter(
                  (c) => c.commentId !== commentId,
                ),
                commentCount: Math.max((prev.commentCount || 1) - 1, 0),
              }
            : null,
        );
      }

      // Also update fullPostData if it exists
      if (fullPostData?.comments) {
        setFullPostData((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.filter(
                  (c) => c.commentId !== commentId,
                ),
                commentCount: Math.max((prev.commentCount || 1) - 1, 0),
              }
            : null,
        );
      }

      showMessage("success", "Комментарий удалён");
    } catch (err: any) {
      showMessage("error", "Не удалось удалить комментарий");
    }
  };

  const handleViewPost = async (postId: number) => {
    try {
      await fetch(
        `https://instagram-api.softclub.tj/Post/view-post?postId=${postId}`,
        {
          method: "POST",
          headers: getAuthHeader(),
        },
      );
    } catch (err) {
      console.error("View error:", err);
    }
  };

  const handleBioSave = async () => {
    try {
      const res = await fetch(
        "https://instagram-api.softclub.tj/UserProfile/update-user-profile",
        {
          method: "PUT",
          headers: { ...getAuthHeader(), "Content-Type": "application/json" },
          body: JSON.stringify({ about: editedBio, gender: 0 }),
        },
      );
      if (!res.ok) throw new Error("Failed to update bio");
      showMessage("success", "Профиль обновлён");
      setIsEditing(false);
      await fetchData();
    } catch (err: any) {
      showMessage("error", err.message || "Ошибка обновления профиля");
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const formData = new FormData();
      formData.append("imageFile", file);
      const res = await fetch(
        "https://instagram-api.softclub.tj/UserProfile/update-user-image-profile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Failed to upload avatar");
      showMessage("success", "Аватар обновлён");
      await fetchData();
    } catch (err: any) {
      showMessage("error", err.message || "Ошибка загрузки аватара");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarDelete = async () => {
    Modal.confirm({
      title: "Удалить аватар",
      content: "Вы уверены?",
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      async onOk() {
        try {
          const res = await fetch(
            "https://instagram-api.softclub.tj/UserProfile/delete-user-image-profile",
            {
              method: "DELETE",
              headers: getAuthHeader(),
            },
          );
          if (!res.ok) throw new Error("Failed to delete avatar");
          showMessage("success", "Аватар удалён");
          await fetchData();
        } catch (err: any) {
          showMessage("error", err.message || "Ошибка удаления аватара");
        }
      },
    });
  };

  const openPostModal = async (post: Post) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
    setIsPostModalOpen(true);
    await handleViewPost(post.postId);
    await fetchFullPostData(post.postId);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
    setFullPostData(null);
    setNewComment("");
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    const post = fullPostData || selectedPost;
    if (post?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === post.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    const post = fullPostData || selectedPost;
    if (post?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? post.images.length - 1 : prev - 1,
      );
    }
  };

  const renderPostsGrid = (postsToRender: Post[], showAddButton = true) => (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3">
      {postsToRender.map((post) => (
        <div
          key={post.postId}
          className="aspect-square relative group cursor-pointer"
          onClick={() => openPostModal(post)}
        >
          {post.images?.[0] && (
            <img
              data-src={getImageUrl(post.images[0])}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://via.placeholder.com/400?text=Post+Image")
              }
              ref={(el) => {
                if (
                  el &&
                  imageObserver.current &&
                  !observedImages.current.has(el)
                ) {
                  imageObserver.current.observe(el);
                  observedImages.current.add(el);
                }
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
            <div className="flex items-center gap-1 text-white">
              <FaHeart
                className={`text-lg ${post.postLike ? "text-red-500" : ""}`}
              />
              <span className="font-semibold">{post.postLikeCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <FaComment className="text-lg" />
              <span className="font-semibold">{post.commentCount || 0}</span>
            </div>
          </div>
          {post.images?.length > 1 && (
            <div className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
              </svg>
            </div>
          )}
        </div>
      ))}
      {showAddButton && (
        <div
          onClick={() => setModalAdd(true)}
          className="aspect-square bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 border border-gray-800 rounded-lg"
        >
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors">
            <FaPlus className="text-2xl text-gray-400" />
          </div>
          <p className="text-sm text-gray-400 font-medium">New Post</p>
        </div>
      )}
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, color: "#fff" }} spin />
          }
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Button onClick={fetchData} type="primary">
            Повторить
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-[935px] mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {data?.userName || "Profile"}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalAdd(true)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
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
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative group">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-0.5 bg-gradient-to-r from-purple-500 to-pink-500">
                <img
                  src={getAvatarUrl(data?.image)}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-black"
                  loading="eager"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/150?text=Avatar")
                  }
                />
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <LoadingOutlined className="text-white text-2xl" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleAvatarUpload(file);
                    return false;
                  }}
                  accept="image/*"
                >
                  <button className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100">
                    <FaCamera className="text-sm" />
                  </button>
                </Upload>
                {data?.image && (
                  <button
                    onClick={handleAvatarDelete}
                    className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-light">
                {data?.userName || "User"}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
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
                  {data?.subscribersCount || 0}
                </div>
                <div className="text-gray-400 text-sm">followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">
                  {data?.subscriptionsCount || 0}
                </div>
                <div className="text-gray-400 text-sm">following</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold">
                {data?.fullName || data?.userName || "User"}
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
                  {data?.about || "No bio yet. Tell your story..."}
                </p>
              )}
              {data?.website && (
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
              <MdGridOn size={30} />
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 py-4 border-t ${activeTab === "saved" ? "border-white text-white" : "border-transparent text-gray-400"} transition-all`}
            >
              <MdPlayArrow size={30} />
            </button>
            <button
              onClick={() => setActiveTab("tagged")}
              className={`flex items-center gap-2 py-4 border-t ${activeTab === "tagged" ? "border-white text-white" : "border-transparent text-gray-400"} transition-all`}
            >
              <MdPersonOutline size={30} />
            </button>
          </div>
        </div>

        <div className="py-8">
          {activeTab === "posts" &&
            (loadingPosts ? (
              <div className="min-h-[40vh] flex items-center justify-center">
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 32, color: "#fff" }}
                      spin
                    />
                  }
                />
              </div>
            ) : posts.length > 0 ? (
              renderPostsGrid(posts, true)
            ) : (
              <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center mb-6">
                  <MdGridOn className="text-4xl text-gray-600" />
                </div>
                <h3 className="text-2xl font-light mb-2">No Posts Yet</h3>
                <p className="text-gray-400 max-w-md">
                  When you share photos or videos, they'll appear on your
                  profile.
                </p>
                <button
                  onClick={() => setModalAdd(true)}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Share your first post
                </button>
              </div>
            ))}

          {activeTab === "saved" &&
            (loadingSaved ? (
              <div className="min-h-[40vh] flex items-center justify-center">
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 32, color: "#fff" }}
                      spin
                    />
                  }
                />
              </div>
            ) : savedPosts.length > 0 ? (
              renderPostsGrid(savedPosts, false)
            ) : (
              <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center mb-6">
                  <FaBookmark className="text-4xl text-gray-600" />
                </div>
                <h3 className="text-2xl font-light mb-2">No Saved Posts</h3>
                <p className="text-gray-400 max-w-md">
                  Save photos and videos that you want to see again.
                </p>
              </div>
            ))}

          {activeTab === "tagged" && (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center mb-6 mx-auto">
                  <MdPersonOutline className="text-4xl text-gray-600" />
                </div>
                <h3 className="text-2xl font-light mb-2">No Tagged Posts</h3>
                <p className="text-gray-400 max-w-md">
                  Photos and videos you're tagged in will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modalAdd}
        onCancel={() => {
          setModalAdd(false);
          setTitle("");
          setContent("");
          setImages(null);
        }}
        onOk={handleAddPost}
        okText={uploading ? "Uploading..." : "Post"}
        okButtonProps={{ disabled: uploading }}
        cancelButtonProps={{ disabled: uploading }}
        width={600}
      >
        <div className="space-y-4 py-4">
          <h2 className="text-xl font-semibold text-white">Create New Post</h2>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
            disabled={uploading}
            size="large"
          />
          <Input.TextArea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="bg-gray-900 border-gray-700 text-white"
            disabled={uploading}
            size="large"
          />
          <Upload
            multiple
            beforeUpload={(file) => {
              setImages((prev) => {
                const dt = new DataTransfer();
                if (prev) Array.from(prev).forEach((f) => dt.items.add(f));
                dt.items.add(file);
                return dt.files;
              });
              return false;
            }}
            showUploadList={false}
            accept="image/*,video/*"
            disabled={uploading}
          >
            <Button
              icon={<UploadOutlined />}
              className="w-full"
              size="large"
              disabled={uploading}
            >
              Select Images/Videos
            </Button>
          </Upload>
          {images && images.length > 0 && (
            <div className="text-gray-400 text-sm">
              Selected: {images.length} file(s)
            </div>
          )}
        </div>
      </Modal>

      {isPostModalOpen && selectedPost && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90">
          <div className="relative w-full max-w-6xl h-[90vh] bg-black rounded-lg overflow-hidden flex">
            <div className="flex-1 relative bg-black flex items-center justify-center">
              <button
                onClick={closePostModal}
                className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              {selectedPost.userId === data?.userId && (
                <button
                  onClick={() => handleDeletePost(selectedPost.postId)}
                  className="absolute top-4 right-4 z-10 p-2 bg-red-600/80 rounded-full hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="text-lg" />
                </button>
              )}

              {selectedPost.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <FaChevronLeft className="text-xl" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <FaChevronRight className="text-xl" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {selectedPost.images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i === currentImageIndex ? "bg-white" : "bg-gray-500"}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {loadingFullPost ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 32, color: "#fff" }}
                      spin
                    />
                  }
                />
              ) : (
                <>
                  {selectedPost.images?.[currentImageIndex]?.endsWith(
                    ".mp4",
                  ) ? (
                    <video
                      src={getImageUrl(selectedPost.images[currentImageIndex])}
                      controls
                      className="max-h-full max-w-full"
                      autoPlay
                      loop
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/600?text=Video+Error")
                      }
                    />
                  ) : (
                    <img
                      src={getImageUrl(
                        selectedPost.images?.[currentImageIndex],
                      )}
                      alt={selectedPost?.title || "Post"}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/600?text=Image+Error")
                      }
                    />
                  )}
                </>
              )}
            </div>

            <div className="w-96 border-l border-gray-800 flex flex-col bg-black">
              <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                <img
                  src={getAvatarUrl(selectedPost?.userImage)}
                  alt={selectedPost?.userName || ""}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/40?text=User")
                  }
                />
                <div className="flex-1">
                  <div className="font-semibold">{selectedPost?.userName}</div>
                  <div className="text-sm text-gray-400">
                    {formatDate(selectedPost?.datePublished || "")}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">
                    {selectedPost?.title}
                  </h3>
                  <p className="text-gray-300 whitespace-pre-line">
                    {selectedPost?.content}
                  </p>
                </div>

                <div className="flex items-center gap-6 py-4 border-y border-gray-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLikePost(selectedPost?.postId || 0)}
                      className="p-1"
                    >
                      {selectedPost?.postLike ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-400 hover:text-red-400" />
                      )}
                    </button>
                    <span>{selectedPost?.postLikeCount || 0} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaComment className="text-gray-400" />
                    <span>{selectedPost?.commentCount || 0} comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye className="text-gray-400" />
                    <span>{selectedPost?.postView || 0} views</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-3">Comments</h4>
                  {(() => {
                    const comments =
                      selectedPost?.comments || fullPostData?.comments || [];
                        const commentId = comment.commentId || comment.postCommentId || i;
                    return comments.length > 0 ? (
                      <div className="space-y-3">
                        {comments.map((comment: any, i: number) => {
                          const avatarSrc = comment.userImage
                            ? `https://instagram-api.softclub.tj/images/${comment.userImage}`
                            : "https://via.placeholder.com/40?text=User";

                          return (
                            <div
                              key={comment.postCommentId || i}
                              className="flex gap-3 group"
                            >
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 shrink-0">
                                <img
                                  src={avatarSrc}
                                  alt={comment.userName || "User"}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/40?text=User";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">
                                      {comment.userName || "Unknown User"}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                      {formatDate(comment.dateCommented)}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(commentId)
                                    }
                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:text-red-400"
                                  >
                                    Delete
                                  </button>
                                </div>
                                <p className="text-gray-300 text-sm mt-1">
                                  {comment.comment}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4 text-sm">
                        No comments yet
                      </p>
                    );
                  })()}
                </div>
              </div>

              <div className="p-4 border-t border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikePost(selectedPost?.postId || 0)}
                      className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                      {selectedPost?.postLike ? (
                        <FaHeart className="text-xl text-red-500" />
                      ) : (
                        <FaRegHeart className="text-xl text-gray-400 hover:text-red-400" />
                      )}
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                      <FaComment className="text-xl text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                      <FaShare className="text-xl text-gray-400" />
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      handleAddToFavorites(selectedPost?.postId || 0)
                    }
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    {selectedPost?.postFavorite ? (
                      <FaBookmark className="text-xl text-yellow-500" />
                    ) : (
                      <FaRegBookmark className="text-xl text-gray-400 hover:text-yellow-400" />
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-900 border-gray-700 text-white"
                    onPressEnter={() =>
                      handleAddComment(selectedPost?.postId || 0)
                    }
                    disabled={submittingComment}
                    size="large"
                  />
                  <Button
                    onClick={() => handleAddComment(selectedPost?.postId || 0)}
                    loading={submittingComment}
                    disabled={!newComment.trim()}
                    type="primary"
                    size="large"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
