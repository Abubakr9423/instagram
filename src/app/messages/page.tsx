"use client"
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './../../lib/store'
import { CreateChat, DeleteChatById, DeleteMessagesById, getChatById, Getchats, GetMyProfile, GetUsers, SendMessage } from '../../lib/features/messages/ApiMessages'
import { Bell, Copy, EllipsisVertical, ImageDown, Info, MessageSquareWarning, Mic, Phone, Reply, Search, Send, Smile, SquarePen, Trash2, Video } from 'lucide-react'
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from '@/components/ui/switch'
import ChatInput from '@/components/EmojiMessages'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function page() {
    const dispatch = useDispatch<AppDispatch>()
    const { chats, messages, loading, error, Users, myprofile } = useSelector((state: RootState) => state.messagesApi)
    const [selectedChat, setSelectedChatLocal] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    console.log(myprofile);

    useEffect(() => {
        dispatch(Getchats())
    }, [dispatch])


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(GetUsers(searchTerm));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    useEffect(() => {
        if (selectedChat?.chatId) {
            dispatch(getChatById(selectedChat.chatId))
        }
    }, [selectedChat, dispatch]);

    const handleChatClick = (chat: any) => {
        setSelectedChatLocal(chat);
        console.log(chat);
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleCreateChat = async (userId: string) => {
        const result = await dispatch(CreateChat(userId)).unwrap();
        dispatch(Getchats());
        setIsDialogOpen(false);
    };

    const [messageText, setMessageText] = useState("");
    const [searchUsersChat, setSearchUsersChat] = useState("");

    const handleSendMessage = async (file?: File) => {
        if (!messageText.trim() && !file && !selectedChat?.chatId) return;

        try {
            await dispatch(SendMessage({
                chatId: selectedChat.chatId.toString(),
                message: messageText || "",
                file: file
            })).unwrap();

            setMessageText("");
            if (fileInputRef.current) fileInputRef.current.value = "";

            dispatch(Getchats());
        } catch (err) {
            console.error("Failed to send:", err);
        }
    };

    useEffect(() => {
        dispatch(GetMyProfile());
    }, [dispatch]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleEmojiSelect = (emoji) => {
        setMessageText((prev) => prev + emoji);
    };

    return (
        <div>
            <section className='flex h-screen'>
                <aside className='px-4 border w-[30%]'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between pt-5'>
                            <h1 className='font-bold text-[20px] cursor-pointer'>{myprofile?.userName || "Loading..."}</h1>
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
                        <div className='flex items-center relative'>
                            <Search className='absolute left-3 text-gray-500' />
                            <input value={searchUsersChat} onChange={(e) => setSearchUsersChat(e.target.value)} className='bg-gray-100 dark:bg-[#1a1a1a] py-2 w-full pl-12 pr-3 rounded-2xl' placeholder='Search' type="search" />
                        </div>
                        <div className="relative flex flex-col items-center w-24 mt-5 mb-2">
                            <textarea
                                className="absolute -top-2 z-10 w-24 h-10 placeholder:text-gray-500 overflow-y-auto text-center font-semibold text-[10px] border dark:border-gray-800 border-gray-200 rounded-lg bg-white dark:bg-[#1a1a1a] shadow-md focus:outline-none resize-none p-1"
                                placeholder='New thought incoming'
                            />

                            <div className="w-20 h-20 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden  shadow-lg">
                                <Image
                                    className="w-full h-full object-cover"
                                    src={(myprofile?.image && myprofile.image !== "")
                                        ? `https://instagram-api.softclub.tj/images/${myprofile.image}`
                                        : img}
                                    alt="My Profile"
                                    width={80}
                                    height={80}
                                />
                            </div>
                        </div>
                        <div className='flex justify-between pt-5'>
                            <h1 className='font-bold text-[16px]'>Messages</h1>
                            <p className='text-gray-500 '>Requests</p>
                        </div>
                        <div className='overflow-y-auto flex flex-col h-112.5 '>
                            {/* {loading && <div className="h-screen flex justify-center items-center"><div className="w-12 h-12 border-4 border-transparent  border-t-gray-700 rounded-full animate-spin" /></div>} */}

                            {chats?.length > 0 && (
                                chats.filter((e) => e.receiveUserName.toLowerCase().includes(searchUsersChat.toLowerCase()))
                                    .map((chat: any) => (
                                        <div key={chat.chatId} onClick={() => handleChatClick(chat)} className='flex gap-2 items-center hover:bg-gray-100 dark:hover:bg-[#1a1a1a] py-2 px-1 rounded-sm duration-300 cursor-pointer'>
                                            <Image
                                                className='w-15 h-15 rounded-full object-cover'
                                                src={chat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == chat.receiveUserImage ? chat.sendUserImage : chat.receiveUserImage}` : img}
                                                alt={myprofile?.userName == chat.sendUserName ? chat.receiveUserName : chat.sendUserName}
                                                width={50}
                                                height={50}
                                            />
                                            <div className='text-sm overflow-hidden'>
                                                <h1 className='font-bold truncate'>{myprofile?.userName == chat.sendUserName ? chat.receiveUserName : chat.sendUserName}</h1>
                                            </div>
                                        </div>
                                    )))
                            }
                        </div>
                    </div>
                </aside>
                <aside className='border w-[70%] flex flex-col justify-between'>
                    {selectedChat ? (
                        <>
                            <div className='flex px-3 py-2 border-b justify-between items-center'>
                                <div className='flex gap-2 items-center'>
                                    <Image
                                        className='w-11 h-11 rounded-full object-cover'
                                        src={selectedChat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == selectedChat.receiveUserImage ? selectedChat.sendUserImage : selectedChat.receiveUserImage}` : img}
                                        alt="" width={40} height={40}
                                    />
                                    <div>
                                        <h1 className='font-bold'>{myprofile?.userName == selectedChat.sendUserName ? selectedChat.receiveUserName : selectedChat.sendUserName}</h1>
                                        <p className='text-xs text-gray-500'>Active now</p>
                                    </div>
                                </div>
                                <div className='flex gap-4'><Phone size={25} /><Link href="/messages/vidiocall"><Video size={30} /></Link>
                                    <Sheet>
                                        <SheetTrigger><Info size={30} /></SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle className='text-2xl'>Details</SheetTitle><br />
                                                <SheetDescription className='flex flex-col justify-between h-[85vh]'>
                                                    <div>
                                                        <div className='flex justify-between items-center '>
                                                            <Bell className='dark:text-white text-black' />
                                                            <h1 className='font-bold dark:text-white text-black text-[20px]'>Mute messages</h1>
                                                            <Switch />
                                                        </div><br />
                                                        <div>
                                                            <h1 className='dark:text-white text-black text-[20px] '>Members</h1><br />
                                                            <div className='flex gap-2 items-center'>
                                                                <Image
                                                                    className='w-11 h-11 rounded-full'
                                                                    src={selectedChat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == selectedChat.receiveUserImage ? selectedChat.sendUserImage : selectedChat.receiveUserImage}` : img}
                                                                    alt="" width={44} height={44}
                                                                />
                                                                <div>
                                                                    <h1 className='font-bold'>{myprofile?.userName == selectedChat.sendUserName ? selectedChat.receiveUserName : selectedChat.sendUserName}</h1>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col gap-2 items-start text-[18px] border-t pt-2 '>
                                                        <button className='cursor-pointer'>Nicknames</button>
                                                        <button className='text-red-600 cursor-pointer'>Report</button>
                                                        <button className='text-red-600 cursor-pointer'>Block</button>
                                                        <button onClick={() => { dispatch(DeleteChatById(selectedChat.chatId)); setSelectedChatLocal(null) }} className='text-red-600 cursor-pointer'>Delete chat</button>
                                                    </div>
                                                </SheetDescription>
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet></div>
                            </div>

                            <div className='flex-1 overflow-y-auto p-4 flex flex-col'>

                                <div className='flex justify-center gap-1 items-center flex-col py-8'>
                                    <Image
                                        className='w-25 h-25 rounded-full object-cover'
                                        src={selectedChat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == selectedChat.receiveUserImage ? selectedChat.sendUserImage : selectedChat.receiveUserImage}` : img}
                                        alt=""
                                        width={50}
                                        height={50}
                                    />
                                    <h1 className='text-2xl font-semibold'>{myprofile?.userName == selectedChat.sendUserName ? selectedChat.receiveUserName : selectedChat.sendUserName}</h1>
                                    <p className='text-gray-400 mb-2'>Instagram</p>
                                    <button className='py-1 px-3 rounded-xl text-black bg-gray-200'>View profile</button>
                                </div>

                                <div className='flex flex-col gap-3'>
                                    {Array.isArray(messages) && [...messages].reverse().map((msg) => {
                                        const isMe = msg.userName === myprofile?.userName;

                                        return (
                                            <div key={msg.messageId} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`} >
                                                <div className='flex items-end gap-2'>
                                                    {!isMe && (
                                                        <Image
                                                            width={10}
                                                            height={10}
                                                            className='w-8 h-8 rounded-full object-cover'
                                                            src={msg.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == msg.receiveUserImage ? msg.sendUserImage : msg.receiveUserImage}` : img}
                                                            alt=""
                                                        />
                                                    )}

                                                    <div key={msg.messageId} className={`flex items-center gap-2 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>

                                                        {
                                                            msg.messageText && (
                                                                <p className={`px-3 py-1 rounded-2xl text-sm ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-[#262626]'}`}>{msg.messageText}</p>
                                                            )
                                                        }

                                                        {msg.file && (
                                                            <div className="mb-2">
                                                                <Image
                                                                    src={`https://instagram-api.softclub.tj/images/${msg.file}`}
                                                                    alt="sent image"
                                                                    width={150}
                                                                    height={150}
                                                                    className="rounded-lg object-cover w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                                                />
                                                            </div>
                                                        )}

                                                        {!isMe && (
                                                            <div className="opacity-0 flex gap-1 items-center group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 ">
                                                                <Reply className='hover:text-blue-500' size={20} />

                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <EllipsisVertical className='hover:text-blue-500' size={20} />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <DropdownMenuGroup>
                                                                            <DropdownMenuLabel><span className={` text-[14px] opacity-70 block `}>
                                                                                {new Date(msg.sendMassageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </span></DropdownMenuLabel>
                                                                            <DropdownMenuItem onClick={() => dispatch(DeleteMessagesById(msg.messageId))} className='flex justify-between text-red-600'>Delete <Trash2 className='text-red-600' /></DropdownMenuItem>
                                                                            <DropdownMenuItem className='flex justify-between '>Copy <Copy /></DropdownMenuItem>
                                                                        </DropdownMenuGroup>
                                                                        <DropdownMenuGroup>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem className='flex justify-between text-red-600'>Report <MessageSquareWarning className='text-red-600' /></DropdownMenuItem>
                                                                        </DropdownMenuGroup>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        )}
                                                        {isMe && (
                                                            <div className="opacity-0 flex gap-1 items-center group-hover:opacity-100 transition-opacity cursor-pointer text-gray-500 ">
                                                                <Reply className='hover:text-blue-500' size={20} />
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <EllipsisVertical className='hover:text-blue-500' size={20} />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <DropdownMenuGroup>
                                                                            <DropdownMenuLabel><span className={` text-[14px] opacity-70 block `}>
                                                                                {new Date(msg.sendMassageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </span></DropdownMenuLabel>
                                                                            <DropdownMenuItem onClick={() => {
                                                                                if (msg?.messageId) {
                                                                                    dispatch(DeleteMessagesById(msg.messageId))
                                                                                        .unwrap()
                                                                                        .then(() => {
                                                                                            if (selectedChat?.chatId) {
                                                                                                dispatch(getChatById(selectedChat.chatId));
                                                                                            }
                                                                                        });
                                                                                }
                                                                            }} className='flex justify-between text-red-600'>Delete <Trash2 size={16} />
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className='flex justify-between '>Copy <Copy /></DropdownMenuItem>
                                                                        </DropdownMenuGroup>
                                                                        <DropdownMenuGroup>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem className='flex justify-between text-red-600'>Report <MessageSquareWarning className='text-red-600' /></DropdownMenuItem>
                                                                        </DropdownMenuGroup>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    }
                                </div>
                            </div>

                            <div className='flex items-center gap-2 px-3 py-2 border-t bg-white dark:bg-[#1111]'>
                                <div className='relative flex items-center w-full border rounded-full px-4 py-1 focus-within:border-gray-400'>

                                    {/* <Smile className='cursor-pointer text-gray-500 hover:text-gray-700' size={24} /> */}
                                    <ChatInput onEmojiSelect={handleEmojiSelect} />

                                    <input
                                        className='w-full bg-transparent py-2 px-3 outline-none text-sm text-black dark:text-white'
                                        type="text"
                                        name="message"
                                        placeholder="Message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <div className='flex items-center gap-3 text-gray-600'>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleSendMessage(file);
                                                }
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        <Mic className={`${messageText.length > 0 ? "hidden" : 'block'} cursor-pointer dark:text-white text-black dark:hover:text-blue-500 hover:text-blue-500`} size={20} />
                                        <ImageDown onClick={handleIconClick} className={`${messageText.length > 0 ? "hidden" : 'block'} cursor-pointer dark:text-white text-black dark:hover:text-blue-500 hover:text-blue-500`} size={20}
                                        />
                                        <Send onClick={handleSendMessage} className={`cursor-pointer font-bold ${messageText.trim() ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'}`} size={20} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center h-full'>
                            <div className='p-4 border-2 border-black dark:border-white rounded-full mb-4'><Send size={50} /></div>
                            <h1 className='text-xl font-bold'>Your messages</h1>
                            <p className='text-gray-500'>Send a message to start a chat.</p>
                        </div>
                    )}
                </aside>
            </section>
        </div >
    )
}

export default page