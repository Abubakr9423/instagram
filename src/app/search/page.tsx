"use client";

import React, { useEffect, useState } from "react";
import { Search, SquarePen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { GetUsers } from "@/src/lib/features/messages/ApiMessages";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { Users, loading } = useSelector((state: RootState) => state.messagesApi);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        dispatch(GetUsers(searchTerm));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    if (Users && Users.length > 0) {
      setSearchedUsers(Users);
    }
  }, [Users]);

  const handleClearInput = () => {
    setSearchTerm(""); 
  };

  const handleRemoveUser = (id: string) => {
    setSearchedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleClearAll = () => {
    setSearchedUsers([]);
    setSearchTerm("");
  };

  const handleCreateChat = (userId: string) => {
    console.log("Create chat with:", userId);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <main className="flex-grow max-w-xl w-full border-l border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-5">Search</h1>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full bg-gray-900 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClearInput}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-sm">Results</h2>
            {searchedUsers?.length > 0 && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm">Searching...</p>
          ) : searchedUsers && searchedUsers.length > 0 ? (
            searchedUsers.map((user: any) => (
              <div
                key={user.id}
                onClick={() => redirect(`/profile/${user.id}`)}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={
                      user.avatar
                        ? `https://instagram-api.softclub.tj/images/${user.avatar}`
                        : "/default-avatar.png"
                    }
                    alt={user.userName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-semibold text-sm">{user.userName}</p>
                    <p className="text-xs text-gray-400">
                      {user.name} · {user.status || "Following"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Remove recent search"
                  onClick={() => handleRemoveUser(user.id)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No users found</p>
          )}
        </section>
      </main>
    </div>
  );
}