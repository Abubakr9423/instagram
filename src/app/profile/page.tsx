"use client";
import { jwtDecode } from "jwt-decode";
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
  FaUserCheck,
  FaUserPlus,
} from "react-icons/fa";
import { MdGridOn, MdPlayArrow, MdPersonOutline } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { FiShare2 } from "react-icons/fi";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, User } from "lucide-react";
import { toast } from "sonner";

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

type Follower = {
  id: number;
  userShortInfo: {
    userId: string;
    userName: string;
    userPhoto: string;
    fullname: string;
  };
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
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [fullPostData, setFullPostData] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingFullPost, setLoadingFullPost] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deletePostAlertOpen, setDeletePostAlertOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [deleteAvatarAlertOpen, setDeleteAvatarAlertOpen] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [followersTab, setFollowersTab] = useState<"followers" | "following">(
    "followers",
  );

  const imageObserver = useRef<IntersectionObserver | null>(null);
  const observedImages = useRef<Set<Element>>(new Set());

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: any) => {
      setImages(acceptedFiles);
    },
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: true,
  });

  let jwtToken: any
  let jwtDecoded: any
  let userId: any
  function getID() {
    jwtToken = localStorage.getItem("token") || "";
    jwtDecoded = jwtDecode(jwtToken);
    userId = jwtDecoded.sid;
  }
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    return {
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    };
  };

  const getAvatarUrl = (imagePath: any) => {
    if (!imagePath || imagePath === "null" || imagePath === "undefined")
      return "https://via.placeholder.com/150?text=Avatar";
    return `https://instagram-api.softclub.tj/images/${imagePath}`;
  };

  const fetchFollowers = async () => {
    try {
      setLoadingFollowers(true);
      const res = await fetch(
        `https://instagram-api.softclub.tj/FollowingRelationShip/get-subscribers?UserId=${userId}`,
        { headers: getAuthHeader() },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setFollowers(result?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Не удалось загрузить подписчиков");
      setFollowers([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      setLoadingFollowing(true);
      const res = await fetch(
        `https://instagram-api.softclub.tj/FollowingRelationShip/get-subscriptions?UserId=${userId}`,
        { headers: getAuthHeader() },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setFollowing(result?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Не удалось загрузить подписки");
      setFollowing([]);
    } finally {
      setLoadingFollowing(false);
    }
  };

  const openFollowersModal = () => {
    setFollowersModalOpen(true);
    setFollowersTab("followers");
    fetchFollowers();
  };

  const openFollowingModal = () => {
    setFollowingModalOpen(true);
    setFollowersTab("following");
    fetchFollowing();
  };

  useEffect(() => {
    fetchData();
    fetchPosts();
    getID()
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

  const getImageUrl = (imagePath: any) => {
    if (!imagePath || imagePath === "null" || imagePath === "undefined")
      return "https://via.placeholder.com/400?text=Post+Image";
    return `https://instagram-api.softclub.tj/images/${imagePath}`;
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
      toast.error("Не удалось загрузить профиль");
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
      toast.error("Не удалось загрузить посты");
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
      toast.error("Не удалось загрузить сохранённые посты");
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
      toast.error("Не удалось загрузить пост");
    } finally {
      setLoadingFullPost(false);
    }
  };

  const handleAddPost = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Заполните заголовок и описание");
      return;
    }
    if (images.length === 0) {
      toast.error("Выберите хотя бы одно фото/видео");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      images.forEach((image) => formData.append("images", image));

      const res = await fetch(
        "https://instagram-api.softclub.tj/Post/add-post",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Failed to add post");
      toast.success("Пост добавлен");
      setModalAdd(false);
      setTitle("");
      setContent("");
      setImages([]);
      await fetchPosts();
    } catch (err: any) {
      toast.error(err.message || "Ошибка при добавлении поста");
    } finally {
      setUploading(false);
      fetchPosts();
    }
  };

  const handleDeletePost = async (postId: any) => {
    setPostToDelete(postId);
    setDeletePostAlertOpen(true);
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
      toast.error("Не удалось поставить лайк");
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
      toast.success("Добавлено в избранное");
    } catch (err) {
      toast.error("Не удалось добавить в избранное");
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
      setNewComment("");
      toast.success("Комментарий добавлен");
    } catch (err: any) {
      toast.error(err.message || "Ошибка добавления комментария");
    } finally {
      setSubmittingComment(false);
      fetchFullPostData(postId);
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
      if (fullPostData?.postId) await fetchPosts();
      toast.success("Комментарий удалён");
    } catch (err: any) {
      toast.error("Не удалось удалить комментарий");
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
      toast.success("Профиль обновлён");
      setIsEditing(false);
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || "Ошибка обновления профиля");
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
      toast.success("Аватар обновлён");
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || "Ошибка загрузки аватара");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarDelete = async () => {
    setDeleteAvatarAlertOpen(true);
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
      <div className="min-h-screen dark:bg-black dark:text-white flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen dark:bg-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Button onClick={fetchData}>Повторить</Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen dark:bg-black dark:text-white">
      <header className="sticky top-0 z-50 dark:bg-black/95 backdrop-blur-sm border-b dark:border-gray-800">
        <div className="max-w-[935px] mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {data?.userName || "Profile"}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalAdd(true)}
              className="p-2 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaPlus className="text-lg" />
            </button>
            <button className="p-2 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <FiShare2 className="text-lg" />
            </button>
            <button className="p-2 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <FaCog className="text-lg" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-233.75 mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative group">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-0.5 bg-gradient-to-r from-purple-500 to-pink-500">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src={getAvatarUrl(data?.image)}
                    className="border-4 border-black rounded-full"
                  />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                {uploadingAvatar && (
                  <div className="absolute inset-0 dark:bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="text-white text-2xl animate-spin" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleAvatarUpload(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <FaCamera className="text-sm" />
                </label>
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
            <div className="flex flex-col gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-light">
                {data?.userName || "User"}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 dark:bg-gray-800 dark:hover:bg-gray-700 bg-gray-50 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
                <button className="px-4 py-2 dark:bg-gray-800 dark:hover:bg-gray-700 bg-gray-50 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                  <FaArchive /> View Archive
                </button>
              </div>
            </div>

            <div className="flex gap-8 text-base">
              <div className="text-center">
                <div className="font-bold text-lg">{posts.length}</div>
                <div className="text-gray-400 text-sm">posts</div>
              </div>
              <div
                className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={openFollowersModal}
              >
                <div className="font-bold text-lg">
                  {data?.subscribersCount || 0}
                </div>
                <div className="text-gray-400 text-sm">followers</div>
              </div>
              <div
                className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={openFollowingModal}
              >
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
                  <Textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full bg-gray-900 border-gray-700 text-white"
                    rows={3}
                    placeholder="Tell your story..."
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleBioSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="bg-gray-800 hover:bg-gray-700 border-gray-700"
                    >
                      Cancel
                    </Button>
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
                <Skeleton className="h-8 w-8 rounded-full" />
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
                <Button
                  onClick={() => setModalAdd(true)}
                  className="mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  Share your first post
                </Button>
              </div>
            ))}

          {activeTab === "saved" &&
            (loadingSaved ? (
              <div className="min-h-[40vh] flex items-center justify-center">
                <Skeleton className="h-8 w-8 rounded-full" />
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

      <Dialog open={modalAdd} onOpenChange={setModalAdd}>
        <DialogContent className="sm:max-w-[600px] bg-black border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              Create New Post
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Share your moments with the world
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Title
              </Label>
              <Input
                id="title"
                placeholder="What's this post about?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-white">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Tell your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="bg-gray-900 border-gray-700 text-white"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Images/Videos</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-600"
                  }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-400">
                  {isDragActive
                    ? "Drop files here..."
                    : "Drag & drop files or click to select"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports images and videos
                </p>
              </div>
              {images.length > 0 && (
                <div className="text-sm text-gray-400 mt-2">
                  Selected: {images.length} file(s)
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setModalAdd(false);
                setTitle("");
                setContent("");
                setImages([]);
              }}
              disabled={uploading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPost}
              disabled={
                uploading ||
                !title.trim() ||
                !content.trim() ||
                images.length === 0
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletePostAlertOpen}
        onOpenChange={setDeletePostAlertOpen}
      >
        <AlertDialogContent className="bg-black border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!postToDelete) return;
                try {
                  const token = localStorage.getItem("token");
                  if (!token) throw new Error("No token found");
                  const res = await fetch(
                    `https://instagram-api.softclub.tj/Post/delete-post?id=${postToDelete}`,
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    },
                  );
                  if (!res.ok) throw new Error("Failed to delete post");
                  toast.success("Post deleted");
                  setPosts(posts.filter((p) => p.postId !== postToDelete));
                  setSavedPosts(
                    savedPosts.filter((p) => p.postId !== postToDelete),
                  );
                  if (
                    isPostModalOpen &&
                    (selectedPost?.postId === postToDelete ||
                      fullPostData?.postId === postToDelete)
                  ) {
                    setIsPostModalOpen(false);
                    setSelectedPost(null);
                    setFullPostData(null);
                  }
                } catch (err: any) {
                  toast.error(err.message || "Failed to delete post");
                } finally {
                  setPostToDelete(null);
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteAvatarAlertOpen}
        onOpenChange={setDeleteAvatarAlertOpen}
      >
        <AlertDialogContent className="bg-black border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Avatar
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete your avatar image?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  const res = await fetch(
                    "https://instagram-api.softclub.tj/UserProfile/delete-user-image-profile",
                    {
                      method: "DELETE",
                      headers: getAuthHeader(),
                    },
                  );
                  if (!res.ok) throw new Error("Failed to delete avatar");
                  toast.success("Avatar deleted");
                  await fetchData();
                } catch (err: any) {
                  toast.error(err.message || "Failed to delete avatar");
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="max-w-6xl m-auto h-[90vh] p-0 bg-black border-none [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>
          <div className="flex h-full justify-center ">
            <div className="flex-1 relative w-125 bg-black flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={closePostModal}
              >
                <FaTimes className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-red-600/80 hover:bg-red-700 text-white"
                onClick={() => handleDeletePost(selectedPost?.postId)}
              >
                <FaTrash className="h-5 w-5" />
              </Button>

              {selectedPost?.images && selectedPost.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={prevImage}
                  >
                    <FaChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={nextImage}
                  >
                    <FaChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : (
                <>
                  {selectedPost?.images?.[currentImageIndex]?.endsWith(
                    ".mp4",
                  ) ? (
                    <video
                      src={getImageUrl(selectedPost.images[currentImageIndex])}
                      controls
                      className="max-h-full max-w-125"
                      autoPlay
                      loop
                    />
                  ) : (
                    <img
                      src={getImageUrl(
                        selectedPost?.images?.[currentImageIndex],
                      )}
                      alt={selectedPost?.title || "Post"}
                      className="w-122 object-contain"
                    />
                  )}
                </>
              )}
            </div>

            <div className="w-96 border-l border-gray-800 flex flex-col bg-black">
              <div className="p-4  border-b border-gray-800 flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={getAvatarUrl(selectedPost?.userImage || "")}
                    alt={selectedPost?.userName}
                  />
                  <AvatarFallback>
                    {selectedPost?.userName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {selectedPost?.userName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(selectedPost?.datePublished || "")}
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 text-white">
                    {selectedPost?.title}
                  </h3>
                  <p className="text-gray-300 whitespace-pre-line">
                    {selectedPost?.content}
                  </p>
                </div>

                <Separator className="my-4 bg-gray-800" />

                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleLikePost(selectedPost?.postId || 0)
                        }
                        className="text-white hover:bg-gray-800"
                      >
                        {selectedPost?.postLike ? (
                          <FaHeart className="h-5 w-5 text-red-500" />
                        ) : (
                          <FaRegHeart className="h-5 w-5" />
                        )}
                      </Button>
                      <span className="text-white">
                        {selectedPost?.postLikeCount || 0} likes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaComment className="h-5 w-5 text-gray-400" />
                      <span className="text-white">
                        {selectedPost?.commentCount || 0} comments
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye className="h-5 w-5 text-gray-400" />
                      <span className="text-white">
                        {selectedPost?.postView || 0} views
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Comments</h4>
                    {(() => {
                      const comments =
                        selectedPost?.comments || fullPostData?.comments || [];
                      return comments.length > 0 ? (
                        <div className="space-y-4">
                          {comments.map((comment: any, i: number) => (
                            <div
                              key={comment.postCommentId || i}
                              className="space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={`https://instagram-api.softclub.tj/images/${comment.userImage}`}
                                    />
                                    <AvatarFallback>
                                      {comment.userName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-semibold text-sm text-white">
                                      {comment.userName}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {formatDate(comment.dateCommented)}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteComment(comment.postCommentId)
                                  }
                                  className="text-red-500 hover:text-red-400"
                                >
                                  Delete
                                </Button>
                              </div>
                              <p className="text-sm pl-10 text-gray-300">
                                {comment.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-400 py-4">
                          No comments yet
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLikePost(selectedPost?.postId || 0)}
                      className="text-white hover:bg-gray-800"
                    >
                      {selectedPost?.postLike ? (
                        <FaHeart className="h-5 w-5 text-red-500" />
                      ) : (
                        <FaRegHeart className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800"
                    >
                      <FaComment className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800"
                    >
                      <FaShare className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleAddToFavorites(selectedPost?.postId || 0)
                    }
                    className="text-white hover:bg-gray-800"
                  >
                    {selectedPost?.postFavorite ? (
                      <FaBookmark className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <FaRegBookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-900 border-gray-700 text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(selectedPost?.postId || 0);
                      }
                    }}
                    disabled={submittingComment}
                  />
                  <Button
                    onClick={() => handleAddComment(selectedPost?.postId || 0)}
                    disabled={!newComment.trim() || submittingComment}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {submittingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={followersModalOpen} onOpenChange={setFollowersModalOpen}>
        <DialogContent className="sm:max-w-md bg-black border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {data?.userName || "User"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => {
                setFollowersTab("followers");
                fetchFollowers();
              }}
              className={`flex-1 py-3 font-semibold ${followersTab === "followers" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
            >
              Followers
            </button>
            <button
              onClick={() => {
                setFollowersTab("following");
                fetchFollowing();
              }}
              className={`flex-1 py-3 font-semibold ${followersTab === "following" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
            >
              Following
            </button>
          </div>
          <ScrollArea className="h-96">
            {loadingFollowers || loadingFollowing ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : followersTab === "followers" ? (
              followers.length > 0 ? (
                <div className="space-y-3">
                  {followers.map((follower) => (
                    <div
                      key={follower.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-900 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={getAvatarUrl(
                              follower.userShortInfo.userPhoto,
                            )}
                            alt={follower.userShortInfo.userName}
                          />
                          <AvatarFallback>
                            {follower.userShortInfo.userName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white">
                            {follower.userShortInfo.userName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {follower.userShortInfo.fullname}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        <FaUserCheck className="mr-2 h-3 w-3" />
                        Following
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32">
                  <FaUserPlus className="h-12 w-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">No followers yet</p>
                </div>
              )
            ) : following.length > 0 ? (
              <div className="space-y-3">
                {following.map((follow) => (
                  <div
                    key={follow.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-900 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={getAvatarUrl(follow.userShortInfo.userPhoto)}
                          alt={follow.userShortInfo.userName}
                        />
                        <AvatarFallback>
                          {follow.userShortInfo.userName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white">
                          {follow.userShortInfo.userName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {follow.userShortInfo.fullname}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gray-800 hover:bg-gray-700 text-white"
                    >
                      <FaUserCheck className="mr-2 h-3 w-3" />
                      Following
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col min-h-[35vh] items-center justify-center h-32">
                <FaUserPlus className="h-12 w-12 text-gray-600 mb-3" />
                <p className="text-gray-400">Not following anyone yet</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={followingModalOpen} onOpenChange={setFollowingModalOpen}>
        <DialogContent className="sm:max-w-md bg-black border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {data?.userName || "User"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => {
                setFollowersTab("followers");
                fetchFollowers();
              }}
              className={`flex-1 py-3 font-semibold ${followersTab === "followers" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
            >
              Followers
            </button>
            <button
              onClick={() => {
                setFollowersTab("following");
                fetchFollowing();
              }}
              className={`flex-1 py-3 font-semibold ${followersTab === "following" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
            >
              Following
            </button>
          </div>
          <ScrollArea className="h-96">
            {loadingFollowers || loadingFollowing ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : followersTab === "followers" ? (
              followers.length > 0 ? (
                <div className="space-y-3">
                  {followers.map((follower) => (
                    <div
                      key={follower.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-900 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={getAvatarUrl(
                              follower.userShortInfo.userPhoto,
                            )}
                            alt={follower.userShortInfo.userName}
                          />
                          <AvatarFallback>
                            {follower.userShortInfo.userName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white">
                            {follower.userShortInfo.userName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {follower.userShortInfo.fullname}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        <FaUserCheck className="mr-2 h-3 w-3" />
                        Following
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32">
                  <FaUserPlus className="h-12 w-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">No followers yet</p>
                </div>
              )
            ) : following.length > 0 ? (
              <div className="space-y-3">
                {following.map((follow) => (
                  <div
                    key={follow.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-900 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={getAvatarUrl(follow.userShortInfo.userPhoto)}
                          alt={follow.userShortInfo.userName}
                        />
                        <AvatarFallback>
                          {follow.userShortInfo.userName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white">
                          {follow.userShortInfo.userName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {follow.userShortInfo.fullname}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gray-800 hover:bg-gray-700 text-white"
                    >
                      <FaUserCheck className="mr-2 h-3 w-3" />
                      Following
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <FaUserPlus className="h-12 w-12 text-gray-600 mb-3" />
                <p className="text-gray-400">Not following anyone yet</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default Profile;