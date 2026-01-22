"use client";

import React from "react";
import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main search content right next to sidebar */}
      <main className="flex-grow max-w-xl w-full border-l border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-5">Search</h1>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-gray-900 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Recent Searches */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-sm">Recent</h2>
            <button className="text-blue-500 text-sm hover:underline">Clear All</button>
          </div>

          {/* Example item */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <img
                src="https://pbs.twimg.com/profile_images/1641178634988158976/Sc-WuWUV_400x400.jpg"
                alt="lavash_tj"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">lavash._tj</p>
                <p className="text-xs text-gray-400">LAVASH · Following</p>
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
        </section>
      </main>
    </div>
  );
}
