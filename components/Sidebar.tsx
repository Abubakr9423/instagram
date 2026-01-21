"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Home,
  InstagramIcon,
  MessageCircleMoreIcon,
  PlusSquareIcon,
  Search,
  SquarePlay,
  User,
} from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { instagramFont } from "@/src/app/font";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/explore", label: "Explore", icon: SquarePlay },
  { href: "/reels", label: "Reels", icon: SquarePlay },
  { href: "/messages", label: "Messages", icon: MessageCircleMoreIcon },
  { href: "/notifications", label: "Notifications", icon: Heart },
  { href: "/create", label: "Create", icon: PlusSquareIcon },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/register") return null;

  const showText = pathname === "/home";

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: showText ? 260 : 80 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
    >
      <div className="flex h-full flex-col justify-between px-3 py-4">

        {/* Logo */}
        <div className="mb-10 flex items-center gap-3 px-2">
          <AnimatePresence mode="wait">
            {showText ? (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className={clsx(
                  instagramFont.className,
                  "text-[30px] tracking-tight text-gray-900 dark:text-white select-none"
                )}
              >
                Instagram
              </motion.span>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
              >
                <InstagramIcon className="h-7 w-7" />
              </motion.div>
            )}
          </AnimatePresence>

          {showText && <AnimatedThemeToggler />}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "group relative flex items-center gap-4 rounded-xl px-3 py-3 text-[15px] font-medium transition-all",
                  active
                    ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                )}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-black dark:bg-white" />
                )}

                <motion.div
                  whileHover={{ x: 2 }}
                  className="flex items-center"
                >
                  <Icon
                    className={clsx(
                      "h-6 w-6 transition-transform",
                      active && "scale-110"
                    )}
                  />
                </motion.div>

                {showText && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-1">
          <Link
            href="/more"
            className="flex items-center gap-4 rounded-xl px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <span className="text-xl">☰</span>
            {showText && <span>More</span>}
          </Link>

          <Link
            href="/also"
            className="flex items-center gap-4 rounded-xl px-3 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <span className="grid h-6 w-6 grid-cols-2 gap-0.5">
              <span className="bg-gray-400 dark:bg-gray-600" />
              <span className="bg-gray-400 dark:bg-gray-600" />
              <span className="bg-gray-400 dark:bg-gray-600" />
              <span className="bg-gray-400 dark:bg-gray-600" />
            </span>
            {showText && <span>Also from Meta</span>}
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}
