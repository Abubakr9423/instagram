"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import { Switch } from "antd";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { instagramFont } from "@/src/app/font";

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
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pathname === "/" || pathname === "/register") return null;

  const showText = pathname === "/home";

  useEffect(() => {
    document.body.style.setProperty("--sidebar-width", showText ? "260px" : "80px");
  }, [showText]);

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: showText ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex-shrink-0"
    >
      <div className="flex h-full flex-col bg-white justify-between px-3 py-4">
        <div className="mb-10 flex items-center gap-3 px-2">
          <AnimatePresence mode="wait">
            {showText ? (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <InstagramIcon className="h-7 w-7" />
              </motion.div>
            )}
          </AnimatePresence>
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
                  "group relative flex items-center gap-4 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors",
                  active
                    ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-black dark:bg-white" />
                )}

                <Icon className={clsx("h-6 w-6 transition-transform", active && "scale-110")} />

                {showText && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer / More menu */}
        <div className="mt-6 flex flex-col gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="flex items-center gap-4 rounded-xl px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                <span className="text-xl">☰</span>
                {showText && <span>More</span>}
              </p>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-xl shadow-lg p-2 animate-in fade-in zoom-in-95
                bg-white border border-gray-200 dark:bg-neutral-900 dark:border-neutral-800"
              align="start"
            >
              {/* My Account */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs uppercase tracking-wide px-2 text-gray-500 dark:text-neutral-400">
                  My Account
                </DropdownMenuLabel>

                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 text-gray-900 dark:hover:bg-neutral-800 dark:text-white transition">
                  <span>👤</span> Profile
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 text-gray-900 dark:hover:bg-neutral-800 dark:text-white transition">
                  <span>⚙️</span> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-2 border-t border-gray-200 dark:border-neutral-800" />

              {/* Appearance */}
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 text-gray-900 dark:hover:bg-neutral-800 dark:text-white transition">
                    <span>🌗</span> Switch Appearance
                  </DropdownMenuSubTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuSubContent
                      className="rounded-lg shadow-md p-2 bg-white border border-gray-200 dark:bg-neutral-900 dark:border-neutral-800"
                    >
                      {mounted && (
                        <DropdownMenuItem>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={theme === "dark"}
                              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                            />
                            <span>Dark Mode</span>
                          </div>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 text-gray-900 dark:hover:bg-neutral-800 dark:text-white transition">
                  <span>👥</span> New Team
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-2 border-t border-gray-200 dark:border-neutral-800" />

              {/* Other Links */}
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 text-gray-900 dark:hover:bg-neutral-800 dark:text-white transition">
                  <span>💻</span> GitHub
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 text-gray-900 dark:hover:bg-neutral-800 dark:text-white transition">
                  <span>🛟</span> Support
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-2 border-t border-gray-200 dark:border-neutral-800" />

              {/* Logout */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-red-50 text-red-600 dark:hover:bg-red-950 dark:text-red-500 transition"
                >
                  <span>🚪</span> Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.aside>
  );
}
