"use client"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../lib/store'
import { CreateChat, Getchats, GetMyProfile, GetUsers } from '../../lib/features/messages/ApiMessages'
import { Search, SquarePen } from 'lucide-react'
import Image from 'next/image'
import img from "../Muhsin-s-Img/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.avif"
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>()
    const { chats, myprofile, loading, Users } = useSelector((state: RootState) => state.messagesApi)
    const [searchUsersChat, setSearchUsersChat] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(Getchats())
        dispatch(GetMyProfile())
    }, [dispatch])

    const handleCreateChat = async (userId: string) => {
        const result = await dispatch(CreateChat(userId)).unwrap();
        dispatch(Getchats());
        setIsDialogOpen(false);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(GetUsers(searchTerm));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    return (
        <section className='flex h-screen overflow-hidden'>
            <aside className='px-4 border-r w-[30%]  flex flex-col bg-white dark:bg-black'>
                <div className='flex justify-between py-5 items-center'>
                    <h1 className='font-bold text-[20px] truncate'>{myprofile?.userName || "Messages"}</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <SquarePen className='text-black cursor-pointer dark:text-white' />
                        </DialogTrigger>

                        <DialogContent className='w-95 max-h-[80vh] flex flex-col'>
                            <DialogHeader>
                                <DialogTitle>New message</DialogTitle>
                            </DialogHeader>

                            <div className='flex flex-col h-full'>
                                <div className='flex items-center border-b pb-2 mb-2'>
                                    <label className='font-bold mr-2 text-black dark:text-white'>To:</label>
                                    <input
                                        placeholder='Search...'
                                        className='bg-transparent py-2 px-1 outline-none w-full text-black dark:text-white'
                                        type="search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className='grid grid-cols-1 gap-1 overflow-y-auto max-h-[400px]'>
                                    {loading ? (
                                        <p className="text-center py-4 text-xs">Searching...</p>
                                    ) : (
                                        Users?.map((user: any) => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleCreateChat(user.id)}
                                                className='flex gap-3 items-center hover:bg-gray-100 dark:hover:bg-[#1a1a1a] py-2 px-2 rounded-md cursor-pointer'
                                            >
                                                <Image
                                                    className='w-10 h-10 rounded-full object-cover border'
                                                    src={user.avatar ? `https://instagram-api.softclub.tj/images/${user.avatar}` : img}
                                                    alt="user" width={40} height={40}
                                                />
                                                <h1 className='font-semibold text-sm text-black dark:text-white'>
                                                    {user.userName}
                                                </h1>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className='relative mb-4'>
                    <Search className='absolute left-3 top-2.5 text-gray-500' size={18} />
                    <input
                        value={searchUsersChat}
                        onChange={(e) => setSearchUsersChat(e.target.value)}
                        className='bg-gray-100 dark:bg-[#1a1a1a] py-2 w-full pl-10 pr-3 rounded-xl outline-none'
                        placeholder='Search'
                        type="search"
                    />
                </div>

                <div className='flex flex-col gap-1 overflow-y-auto'>
                    <h1 className='font-bold text-[16px] mb-2'>Messages</h1>
                    {chats?.filter(c => c.receiveUserName.toLowerCase().includes(searchUsersChat.toLowerCase()))
                        .map((chat: any) => (
                            <Link
                                key={chat.chatId}
                                href={`/messages/${chat.chatId}`}
                                className='flex gap-3 items-center hover:bg-gray-100 dark:hover:bg-zinc-900 p-2 rounded-lg transition-all'
                            >
                                <div className="relative w-12 h-12">
                                    <Image
                                        src={chat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == chat.receiveUserImage ? chat.sendUserImage : chat.receiveUserImage}` : img}
                                        alt="user" fill className="rounded-full object-cover"
                                    />
                                </div>
                                <div className='flex flex-col overflow-hidden'>
                                    <span className='font-medium truncate'>{myprofile?.userName == chat.sendUserName ? chat.receiveUserName : chat.sendUserName}</span>
                                    <span className='text-xs text-gray-500 truncate'>Sent a message</span>
                                </div>
                            </Link>
                        ))}
                </div>
            </aside>

            <main className='w-[70%] h-full bg-white dark:bg-black'>
                {children}
            </main>
        </section>
    )
}