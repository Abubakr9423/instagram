"use client" // Ҳатман илова кунед

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './../../lib/store'
import { getChatById, Getchats } from '../../lib/features/messages/ApiMessages'
import { ImageDown, Info, Mic, Phone, Search, Send, Smile, SquarePen, Video } from 'lucide-react'
import Image from 'next/image'
import img from "../Muhsin-s-Img/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.avif"
import Link from 'next/link'

function page() {
    const dispatch = useDispatch<AppDispatch>()

    // Гирифтани маълумот аз Redux state
    const { data, loading, error } = useSelector((state: RootState) => state.messagesApi)
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([])

    useEffect(() => {
        dispatch(Getchats())
    }, [dispatch])

    useEffect(() => {
        const fetchMyMessages = async () => {
            if (selectedChat?.chatId) {
                try {
                    // 1. Гирифтани маълумот
                    const res = await dispatch(getChatById(selectedChat.chatId)).unwrap();

                    // 2. Swagger нишон медиҳад, ки массив дар дохили res.data аст
                    if (res && res.data) {
                        setMessages(res.data);
                    } else {
                        setMessages([]);
                    }
                } catch (err) {
                    console.error("Хатогӣ:", err);
                    setMessages([]); // Дар ҳолати хато массив холӣ мемонад
                }
            }
        };

        fetchMyMessages();
    }, [selectedChat, dispatch]);

    console.log(messages);



    return (
        <div>
            <section className='flex h-screen'>
                <aside className='px-4 border w-[30%]'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between pt-5'>
                            <h1 className='font-bold text-[20px] cursor-pointer'>_nazarov._011</h1>
                            <SquarePen className='text-black cursor-pointer dark:text-white' />
                        </div>
                        <div className='flex items-center relative'>
                            <Search className='absolute left-3 text-gray-500' />
                            <input className='bg-gray-100 dark:bg-[#1a1a1a] py-2 w-full pl-12 pr-3 rounded-2xl' placeholder='Search' type="search" />
                        </div>
                        <div className="relative flex flex-col items-center w-24 mt-5 mb-2">
                            <textarea
                                className="absolute -top-2 z-10 w-24 h-10 placeholder:text-gray-500 overflow-y-auto text-center font-semibold text-[10px] border dark:border-gray-800 border-gray-200 rounded-lg bg-white dark:bg-[#1a1a1a] shadow-md focus:outline-none resize-none p-1"
                                placeholder='New thought incoming'
                            />

                            <div className="w-20 h-20 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden  shadow-lg">
                                <Image
                                    className="w-full h-full object-cover"
                                    src={img}
                                    alt="Player"
                                />
                            </div>
                        </div>
                        <div className='flex justify-between pt-5'>
                            <h1 className='font-bold text-[16px]'>Messages</h1>
                            <p className='text-gray-500 '>Requests</p>
                        </div>
                        <div className='overflow-y-auto flex flex-col h-112.5 '>
                            {loading && <div className="h-screen flex justify-center items-center"><div className="w-12 h-12 border-4 border-transparent  border-t-gray-700 rounded-full animate-spin" /></div>}

                            {data?.length > 0 ? (
                                data.map((chat: any) => (
                                    <div key={chat.chatId} onClick={() => setSelectedChat(chat)} className='flex gap-2 items-center hover:bg-gray-100 dark:hover:bg-[#1a1a1a] py-2 px-1 rounded-sm duration-300 cursor-pointer'>
                                        <Image
                                            className='w-11 h-11 rounded-full object-cover'
                                            src={chat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${chat.receiveUserImage}` : img}
                                            alt="user"
                                            width={44}
                                            height={44}
                                        />
                                        <div className='text-sm overflow-hidden'>
                                            <h1 className='font-bold truncate'>{chat.receiveUserName}</h1>
                                            <p className='text-gray-500 truncate'>{chat.lastMessage || "No messages"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !loading && <div className='flex justify-center items-center h-screen'><p>Chats not found</p></div>
                            )
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
                                        className='w-11 h-11 rounded-full'
                                        src={selectedChat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${selectedChat.receiveUserImage}` : img}
                                        alt="" width={44} height={44}
                                    />
                                    <div>
                                        <h1 className='font-bold'>{selectedChat.receiveUserName}</h1>
                                        <p className='text-xs text-gray-500'>Active now</p>
                                    </div>
                                </div>
                                <div className='flex gap-4'><Phone size={25} /><Video size={30} /><Info size={30} /></div>
                            </div>

                            <div className='flex justify-center gap-1 items-center flex-col overflow-y-auto p-4'>
                                <Image
                                    className=' rounded-full'
                                    src={selectedChat.receiveUserImage ? `https://instagram-api.softclub.tj/images/${selectedChat.receiveUserImage}` : img}
                                    alt="" width={80} height={50}
                                />
                                <h1 className='text-2xl font-semibold'>{selectedChat.receiveUserName}</h1>
                                <p className=' text-gray-400 mb-2'>Instagram</p>
                                <button className='py-1 px-3 rounded-xl text-black bg-gray-200'>View profile</button>
                            </div>

                            <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3'>
                                {messages.map((msg: any) => (
                                    <div
                                        key={msg.messageId}
                                        className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.userName === "_nazarov._011" // Инҷо санҷ, ки номи худат дуруст аст ё не
                                            ? 'bg-blue-500 text-white self-end'
                                            : 'bg-gray-200 dark:bg-[#262626] self-start'
                                            }`}
                                    >
                                        <p>{msg.messageText}</p>
                                    </div>
                                ))
                                }

                            </div>

                            <div className='flex items-center gap-2 px-3 py-2 border-t bg-white dark:bg-[#1111]'>
                                <div className='relative flex items-center w-full border rounded-full px-4 py-1 focus-within:border-gray-400'>

                                    <Smile className='cursor-pointer text-gray-500 hover:text-gray-700' size={24} />

                                    <input
                                        className='w-full bg-transparent py-2 px-3 outline-none text-sm'
                                        type="text"
                                        placeholder="Message..."
                                    />
                                    <div className='flex items-center gap-3 text-gray-600'>
                                        <Mic className='cursor-pointer hover:text-black' size={20} />
                                        <ImageDown className='cursor-pointer hover:text-black' size={20} />
                                        <Send className='cursor-pointer text-blue-500 font-bold hover:text-blue-700' size={20} />
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
        </div>
    )
}

export default page