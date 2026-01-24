'use client' // Инро ҳатман дар аввал мон

import { useSearchParams } from 'next/navigation'
import { CameraOff, Mic, Video as VideoIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import img from '../../Muhsin-s-Img/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.avif';

function callUser() {
    const searchParams = useSearchParams()
    const userName = searchParams.get('name')
    const id = searchParams.get('id')

    return (
        <section className=''>
            <div className='flex justify-center h-screen items-center gap-10 ' >
                <div className='flex flex-col items-center gap-0.5'>
                    <Image className='rounded-full ' src={img} alt="" />
                    <div className='flex gap-5 py-2 px-3 justify-center bg-gray-50 dark:bg-black items-center'>
                        <Link href={`/messages/${id}`}>
                            <VideoIcon />
                        </Link>
                        <Mic />
                        <CameraOff />
                    </div>
                </div>
                <div className='dark:bg-[#1111] flex flex-col items-center gap-2 border w-80 py-13.5 rounded-sm'>
                    <Image className='w-20 h-20 rounded-full' src={img} alt="User" />
                    <h1 className='text-[20px] font-bold'>{userName}</h1>
                    <p>Ready to Call</p>
                    <button className='bg-blue-600 py-1 px-4 rounded-2xl text-white'>Start Call</button>
                </div>
            </div>
        </section>
    )
}

export default callUser