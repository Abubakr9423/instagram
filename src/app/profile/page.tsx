"use client";
import {
  FaPlus,
  FaCog,
  FaEdit,
  FaArchive,
  FaLink,
  FaCamera,
} from "react-icons/fa";
import { MdGridOn, MdPlayArrow, MdPersonOutline } from "react-icons/md";
import React, { useState } from "react";
import { FiShare2 } from "react-icons/fi";
const Profile = () => {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">(
    "posts",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  React.useEffect(() => {
    fetchData();
  }, []);
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
                    <div className="font-bold text-lg">{data.postCount}</div>
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
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <FaLink /> {data.website}
                    </a>
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
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: data.postCount || 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-900 hover:opacity-90 transition-opacity cursor-pointer relative group"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-gray-600">Post {i + 1}</div>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center group-hover:border-gray-400">
                      <FaPlus className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">New</p>
                  </div>
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
    </div>
  );
};
export default Profile;
