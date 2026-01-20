"use client" // Ҳатман илова кунед

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './../../lib/store'
import { Getchats } from '../../lib/features/messages/ApiMessages'
import { ImageDown, Info, Mic, Phone, Search, Send, Smile, SquarePen, Video } from 'lucide-react'
import Image from 'next/image'
import img from '../favicon.ico'
import Link from 'next/link'

function page() {
    const dispatch = useDispatch<AppDispatch>()

    // Гирифтани маълумот аз Redux state
    const { data, loading, error } = useSelector((state: RootState) => state.messagesApi)

    useEffect(() => {
        dispatch(Getchats())
    }, [dispatch])

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
                        {/* <div className='overflow-y-auto flex flex-col h-112.5 pr-2'>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                                <div key={item} className='flex gap-2 items-center hover:bg-gray-100 dark:hover:bg-[#1a1a1a] py-2 px-1 rounded-sm duration-300 cursor-pointer'>
                                    <Image className='w-11 h-11 rounded-full' src={img} alt="user" />
                                    <div className='text-sm'>
                                        <h1 className='font-bold'>_nazarov._011</h1>
                                        <p className='text-gray-500'>You: Salom Maleykum</p>
                                    </div>
                                </div>
                            ))}
                        </div> */}
                        <div className='overflow-y-auto flex flex-col h-112.5 pr-2'>
                            {loading && <div className="h-screen flex justify-center items-center"><div className="w-12 h-12 border-4 border-transparent  border-t-gray-700 rounded-full animate-spin" /></div>}
                            {error && <p className="text-red-500">{error}</p>}

                            {data && data.length > 0 ? (
                                data.map((chat: any) => (
                                    <div key={chat.id} className='flex gap-2 items-center hover:bg-gray-100 dark:hover:bg-[#1a1a1a] py-2 px-1 rounded-sm duration-300 cursor-pointer'>
                                        <Image
                                            className='w-11 h-11 rounded-full'
                                            src={chat.userImage || img}
                                            alt="user"
                                            width={44}
                                            height={44}
                                        />
                                        <div className='text-sm'>
                                            <h1 className='font-bold'>{chat.userName || "Username"}</h1>
                                            <p className='text-gray-500'>{chat.lastMessage || "No messages yet"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !loading && <div className='flex justify-center items-center h-screen'><p>Chats not found</p></div>
                            )}
                        </div>
                    </div>
                </aside>
                <aside className=' border w-[70%] flex flex-col justify-between'>
                    <div className='flex px-3 gap-2 items-center border-b justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] py-2 rounded-sm duration-300'>
                        <div className='flex gap-2 items-center'>
                            <Image className='w-11 h-11' src={img} alt="" />
                            <div>
                                <h1 className='font-bold'>MUHAMMAD</h1>
                                <p>solievvvv77</p>
                            </div>
                        </div>
                        <div className='flex gap-4 items-center '>
                            <Phone className=' cursor-pointer' size={25} />
                            <Link href="/messages/vidiocall">
                                <Video className=' cursor-pointer' size={30} />
                            </Link>
                            <Info className=' cursor-pointer' size={30} />
                        </div>
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
                </aside>
            </section>
        </div>
    )
}

export default page