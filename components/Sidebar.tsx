"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart, Home, MessageCircleMoreIcon, PlusSquareIcon, Search, SquarePlay, User } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { instagramFont } from "@/src/app/font";

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/register") return null;

  const showText = pathname === "/home"; // full sidebar only on home

  return (
    <div
      className={`flex flex-col justify-between h-screen 
        ${showText ? "w-64 p-4" : "w-20 p-2"} 
        border-r border-gray-200 dark:border-gray-700 
        bg-white dark:bg-black`}
    >
      <div className="flex flex-col justify-between h-full">
        
        {/* Logo only on home */}
        {showText && (
          <div className="flex items-center mb-8 gap-5">
            <p
              className={`
                ${instagramFont.className}
                text-[52px]
                text-[#262626]
                dark:text-white
                tracking-[-0.06em]
                leading-none
                antialiased
                select-none
                scale-x-[1.03]
              `}
            >
              Instagram
            </p>
            <AnimatedThemeToggler />
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col gap-4 font-medium text-gray-800 dark:text-gray-200">
          <Link href="/home" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Home className="w-6 h-6" />
            {showText && <span>Home</span>}
          </Link>
          <Link href="/search" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Search className="w-6 h-6" />
            {showText && <span>Search</span>}
          </Link>
          <Link href="/explore" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <SquarePlay className="w-6 h-6" />
            {showText && <span>Explore</span>}
          </Link>
          <Link href="/reels" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <SquarePlay className="rounded-sm" />
            {showText && <span>Reels</span>}
          </Link>
          <Link href="/messages" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <MessageCircleMoreIcon className="w-6 h-6" />
            {showText && <span>Messages</span>}
          </Link>
          <Link href="/notiflications" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Heart className="w-6 h-6" />
            {showText && <span>Notifications</span>}
          </Link>
          <Link href="/create" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <PlusSquareIcon className="w-6 h-6" />
            {showText && <span>Create</span>}
          </Link>
          <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <User className="w-6 h-6 rounded-full border border-gray-50 dark:border-white dark:border-2" />
            {showText && <span>Profile</span>}
          </Link>
        </div>

        {/* Footer links */}
        <div className="flex flex-col gap-4 mt-6 text-gray-800 dark:text-gray-200">
          <Link href="/more" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <span className="text-xl">☰</span>
            {showText && <span>More</span>}
          </Link>
          <Link href="/also" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <span className="grid grid-cols-2 gap-0.5 w-6 h-6 text-gray-600 dark:text-gray-400">
              <span className="bg-gray-400 dark:bg-gray-600"></span>
              <span className="bg-gray-400 dark:bg-gray-600"></span>
              <span className="bg-gray-400 dark:bg-gray-600"></span>
              <span className="bg-gray-400 dark:bg-gray-600"></span>
            </span>
            {showText && <span>Also from Meta</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}