"use client"
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { AppDispatch, RootState } from '../../../lib/store'
import { getChatById, SendMessage, DeleteMessagesById, DeleteChatById } from '../../../lib/features/messages/ApiMessages'
import { Phone, Video, Info, Send, Mic, ImageDown, Bell, Reply, EllipsisVertical, Trash2, Copy, MessageSquareWarning } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ChatInput from '@/components/EmojiMessages'
import img from "../../Muhsin-s-Img/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.avif"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from '@/components/ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import VoiceRecorder from '../components/VoiceRecorder'

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const chatbyid = params?.chatbyid as string;
    const dispatch = useDispatch<AppDispatch>();
    const { messages, myprofile, chats } = useSelector((state: RootState) => state.messagesApi);

    const selectedChat = chats?.find((c) => c.chatId.toString() === chatbyid || c.receiveUserId.toString() === chatbyid);

    const [messageText, setMessageText] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (chatbyid) {
            dispatch(getChatById(chatbyid))
        }
    }, [chatbyid, dispatch]);

    const handleSendMessage = async (file?: File) => {
        if (!messageText.trim() && !file) return;
        await dispatch(SendMessage({
            chatId: chatbyid as string,
            message: messageText,
            file: file
        }));
        setMessageText("");
    };

    const handleSendVoice = async (file: File) => {
        await dispatch(SendMessage({
            chatId: chatbyid,
            message: "Voice message",
            file: file
        }));
    };

    const handleEmojiSelect = (emoji: string) => {
        setMessageText(prev => prev + emoji);
    };

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    if (!selectedChat) return <div className="p-10 text-center h-screen">Loading chat...</div>;
    console.log(selectedChat);


    return (
        <div className='flex flex-col h-full bg-white dark:bg-black w-full'>
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
                <div className='flex gap-4 items-center'>
                    <Phone size={25} className="cursor-pointer" />
                    <Link href="/messages/vidiocall"><Video size={30} /></Link>
                    <Sheet>
                        <SheetTrigger><Info size={30} className="cursor-pointer" /></SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle className='text-2xl'>Details</SheetTitle>
                                <SheetDescription className='flex flex-col justify-between h-[85vh]'>
                                    <div>
                                        <div className='flex justify-between items-center mt-4'>
                                            <Bell className='dark:text-white text-black' />
                                            <h1 className='font-bold dark:text-white text-black text-[20px]'>Mute messages</h1>
                                            <Switch />
                                        </div><br />
                                        <div>
                                            <h1 className='dark:text-white text-black text-[20px]'>Members</h1><br />
                                            <div className='flex gap-2 items-center'>
                                                <Image
                                                    className='w-11 h-11 rounded-full'
                                                    src={selectedChat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == selectedChat.receiveUserImage ? selectedChat.sendUserImage : selectedChat.receiveUserImage}` : img}
                                                    alt="" width={44} height={44}
                                                />
                                                <h1 className='font-bold text-black dark:text-white'>{myprofile?.userName == selectedChat.sendUserName ? selectedChat.receiveUserName : selectedChat.sendUserName}</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 items-start text-[18px] border-t pt-2 '>
                                        <button className='cursor-pointer text-black dark:text-white'>Nicknames</button>
                                        <button className='text-red-600 cursor-pointer'>Report</button>
                                        <button className='text-red-600 cursor-pointer'>Block</button>
                                        <button onClick={async () => {
                                            await dispatch(DeleteChatById(selectedChat.chatId)).unwrap();
                                            router.push('/messages');
                                        }}
                                            className='text-red-600 cursor-pointer'
                                        >
                                            Delete chat
                                        </button>
                                    </div>
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4 flex flex-col'>
                <div className='flex justify-center gap-1 items-center flex-col py-8'>
                    <Image
                        className='w-24 h-24 rounded-full object-cover'
                        src={selectedChat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == selectedChat.receiveUserImage ? selectedChat.sendUserImage : selectedChat.receiveUserImage}` : img}
                        alt="" width={96} height={96}
                    />
                    <h1 className='text-2xl font-semibold mt-2'>{myprofile?.userName == selectedChat.sendUserName ? selectedChat.receiveUserName : selectedChat.sendUserName}</h1>
                    <p className='text-gray-400 mb-2'>Instagram</p>
                    <button onClick={() => {
                        const targetId = myprofile?.userName === selectedChat.sendUserName
                            ? selectedChat.receiveUserId
                            : selectedChat.sendUserId;
                        if (targetId) {
                            router.push(`/profile/${targetId}`);
                        }
                    }}
                        className='py-1 px-4 rounded-lg text-sm font-semibold text-black bg-gray-200 hover:bg-gray-300'
                    >
                        View profile
                    </button>
                </div>

                <div className='flex flex-col gap-3'>
                    {Array.isArray(messages) && [...messages].reverse().map((msg) => {
                        const isMe = msg.userName === myprofile?.userName;
                        return (
                            <div key={msg.messageId} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className='flex items-end gap-2 max-w-[80%]'>
                                    {!isMe && (
                                        <Image
                                            width={32} height={32}
                                            className='w-8 h-8 rounded-full object-cover mb-1'
                                            src={msg.receiveUserImage ? `https://instagram-api.softclub.tj/images/${myprofile?.image == msg.receiveUserImage ? msg.sendUserImage : msg.receiveUserImage}` : img}
                                            alt=""
                                        />
                                    )}
                                    <div className={`flex items-center gap-2 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {msg.messageText && (
                                            <p className={`px-3 py-2  text-sm ${isMe ? 'bg-blue-500 text-white rounded-bl-2xl rounded-t-2xl' : 'bg-gray-200 dark:bg-[#262626] rounded-br-2xl rounded-t-2xl dark:text-white'}`}>
                                                {msg.messageText}
                                            </p>
                                        )}
                                        {msg.file && (
                                            <div className="mb-2 max-w-62.5">
                                                {msg.file.endsWith('.mp4') ? (
                                                    <video width={150} height={150} src={`https://instagram-api.softclub.tj/images/${msg.file}`} controls className="rounded-lg w-full" />
                                                ) : (
                                                    <Image src={`https://instagram-api.softclub.tj/images/${msg.file}`} alt="file" width={200} height={200} className="rounded-lg object-cover cursor-pointer" />
                                                )}
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
                                                            <DropdownMenuItem onClick={async () => {
                                                                if (msg?.messageId && chatbyid) {
                                                                    try {
                                                                        await dispatch(DeleteMessagesById({
                                                                            MessId: msg.messageId,
                                                                            chatId: chatbyid
                                                                        })).unwrap();
                                                                    } catch (error) {
                                                                        console.error(error);
                                                                    }
                                                                }
                                                            }} className='flex justify-between text-red-600'>Delete <Trash2 className='text-red-600' /></DropdownMenuItem>
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
                                                            <DropdownMenuItem
                                                                onClick={async () => {
                                                                    if (msg?.messageId && chatbyid) {
                                                                        try {
                                                                            await dispatch(DeleteMessagesById({
                                                                                MessId: msg.messageId,
                                                                                chatId: chatbyid
                                                                            })).unwrap();
                                                                        } catch (error) {
                                                                            console.error(error);
                                                                        }
                                                                    }
                                                                }}
                                                                className='flex justify-between text-red-600'
                                                            >
                                                                Delete <Trash2 size={16} />
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
                    })}
                </div>
            </div>

            <div className='flex items-center gap-2 px-3 py-3 border-t bg-white dark:bg-black'>
                <div className='relative flex items-center w-full border rounded-full px-4 py-1 focus-within:border-gray-400 dark:border-zinc-800'>
                    <ChatInput onEmojiSelect={handleEmojiSelect} />
                    <input
                        className='w-full bg-transparent py-2 px-3 outline-none text-sm text-black dark:text-white'
                        placeholder="Message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <div className='flex items-center gap-3'>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && handleSendMessage(e.target.files[0])} />
                        {/* <Mic className={`${messageText.length > 0 ? "hidden" : 'block'} cursor-pointer dark:text-white text-black`} size={20} /> */}
                        <VoiceRecorder onSend={handleSendVoice} />
                        <ImageDown onClick={handleIconClick} className={`${messageText.length > 0 ? "hidden" : 'block'} cursor-pointer dark:text-white text-black`} size={20} />
                        <Send onClick={() => handleSendMessage()} className={`cursor-pointer font-bold ${messageText.trim() ? 'text-blue-500' : 'text-gray-300 pointer-events-none'}`} size={20} />
                    </div>
                </div>
            </div>
        </div >
    );
}