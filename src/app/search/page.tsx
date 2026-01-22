"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { searchuser } from "@/src/lib/features/search/searchapi";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const data = useSelector((state) => state.search); // assume array of users
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      dispatch(searchuser(searchTerm));
    }
  }, [searchTerm, dispatch]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="flex h-screen bg-black text-white relative left-[-425px]">
      <main className="flex-grow max-w-xl w-full border-l border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-5">Search</h1>

        {/* Search Input */}
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
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Results */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-sm">Results</h2>
            {data?.length > 0 && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={handleClear}
              >
                Clear All
              </button>
            )}
          </div>

          {data && data.length > 0 ? (
            data.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm">{user.username}</p>
                    <p className="text-xs text-gray-400">
                      {user.name} · {user.status || "Following"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Remove recent search"
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