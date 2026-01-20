"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Home, MessageCircleMoreIcon, PlusSquareIcon, Search, User } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { instagramFont } from "@/src/app/font";

export function Sidebar() {
    const pathname = usePathname();

    if (pathname === "/") return null;

    return (
        <div className="flex flex-col justify-between h-screen w-64 border-r border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-black">
            <div className="flex flex-col justify-between h-screen w-64 border-r border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-black">
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

                <div className="flex flex-col gap-4 font-medium text-gray-800 dark:text-gray-200">
                    <Link href="/home" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <Home className="w-6 h-6" />
                        <span>Home</span>
                    </Link>
                    <Link href="/search" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <Search className="w-6 h-6" />
                        <span>Search</span>
                    </Link>
                    <Link href="/explore" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <svg aria-label="Explore" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <title>Explore</title>
                            <polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                            <polygon fillRule="evenodd" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"></polygon>
                            <circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                        </svg>
                        <span>Explore</span>
                    </Link>
                    <Link href="/reels" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            <path d="M5.795 12.456A.5.5 0 0 1 5.5 12V4a.5.5 0 0 1 .832-.374l4.5 4a.5.5 0 0 1 0 .748l-4.5 4a.5.5 0 0 1-.537.082" />
                        </svg>
                        <span>Reels</span>
                    </Link>
                    <Link href="/messages" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <MessageCircleMoreIcon className="w-6 h-6" />
                        <span>Messages</span>
                    </Link>
                    <Link href="/notiflications" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <Heart className="w-6 h-6" />
                        <span>Notifications</span>
                    </Link>
                    <Link href="/create" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <PlusSquareIcon className="w-6 h-6" />
                        <span>Create</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <User className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600" />
                        <span>Profile</span>
                    </Link>
                </div>

                <div className="flex flex-col gap-4 mt-6 text-gray-800 dark:text-gray-200">
                    <Link href="/more" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <span className="text-xl">☰</span>
                        <span>More</span>
                    </Link>
                    <Link href="/also" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <span className="grid grid-cols-2 gap-0.5 w-6 h-6 text-gray-600 dark:text-gray-400">
                            <span className="bg-gray-400 dark:bg-gray-600"></span>
                            <span className="bg-gray-400 dark:bg-gray-600"></span>
                            <span className="bg-gray-400 dark:bg-gray-600"></span>
                            <span className="bg-gray-400 dark:bg-gray-600"></span>
                        </span>
                        <span>Also from Meta</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
