import {   CameraOff, Mic, Video } from 'lucide-react'
import Image from 'next/image'
import img from '../../favicon.ico'
import Camera from '@/components/CameraVidioCall'

function page() {
  return (
    <section className=''>
        <div className='flex justify-center h-screen items-center gap-1 ' >
            <div className='flex flex-col gap-0.5'>
                <Camera />
                <div className='flex gap-5 py-2 px-3 justify-center bg-gray-50 dark:bg-black items-center'>
                    <Video />
                    <Mic />
                    <CameraOff />
                </div>
            </div>
            <div className='dark:bg-[#1111] flex flex-col items-center gap-2 border w-80 py-13.5 rounded-sm'>
                <Image className='w-20 h-20' src={img} alt="" />
                <h1 className='text-[20px] font-bold'>_nazarov._011</h1>
                <p>Ready to Call</p>
                <button className='bg-blue-600 py-1 px-4 rounded-2xl text-white'>Start Call</button>
            </div>
        </div>
    </section>
  )
}

export default page