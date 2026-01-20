'use client'

import { useRef } from 'react'
import Image from 'next/image'
import img from '../../../public/image.png'
import img1 from '../../../public/image copy.png'
import img2 from '../../../public/image copy 2.png'
import img3 from '../../../public/image copy 3.png'
import img4 from '../../../public/image copy 4.png'
import { Bookmark, BookMarked, Heart, MessageCircle, Send } from 'lucide-react'

const stories = [
  { id: 1, name: 'sabinakh', avatar: img },
  { id: 2, name: '23ag', avatar: img },
  { id: 3, name: 'safaralizo', avatar: img },
  { id: 4, name: 'nurulloew', avatar: img },
  { id: 5, name: 'investment', avatar: img },
  { id: 6, name: 'briusartem', avatar: img },
  { id: 7, name: 'briusartem', avatar: img },
  { id: 8, name: 'briusartem', avatar: img },
  { id: 9, name: 'briusartem', avatar: img },
  { id: 10, name: 'briusartem', avatar: img },
  { id: 11, name: 'briusartem', avatar: img },
  { id: 12, name: 'briusartem', avatar: img },
  { id: 13, name: 'briusartem', avatar: img }
]

export default function Stories() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -120, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' })
  }

  return (
    <div className="ml-[40px] flex gap-[40px]">
      <div className="relative max-w-[620px]">
        <button
          onClick={scrollLeft}
          className="absolute left-[-16px]  top-[35px] z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/40 text-white"
        >
          ‹
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-[-16px] top-[35px] z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/40 text-white"
        >
          ›
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {stories.map(story => (
            <div
              key={story.id}
              className="flex w-[72px] flex-shrink-0 flex-col items-center"
            >
              <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px]">
                <div className="rounded-full bg-white p-[2px]">
                  <Image
                    src={story.avatar}
                    alt={story.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="mt-1 w-full truncate text-center text-xs">
                {story.name}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-[40px]">
          <div className="flex items-center gap-[20px]">
            <Image src={img3} alt='' />
            <div>
              <p className='font-[700]'>terrylucas</p>
              <p className='text-[#475569]'>Profile</p>
            </div>
          </div>
        </div>

        <Image src={img4} alt='' className='mt-[10px]' />
        <div className="flex items-end justify-between w-[620px]">
          <div className="num1 flex items-center gap-[20px] mt-[20px]">
            <div className="flex items-center gap-[8px]">
          <Heart />
          <p className='text-[16px] font-[650]'>3</p>
            </div>
            <div className="flex items-center gap-[8px]">
          <MessageCircle />
          <p className='text-[16px] font-[650]'>47</p>
            </div>
          <Send />
          </div>
          <Bookmark />
        </div>
        <p><span className='font-[700]'>terrylucas</span> Imperdiet in sit rhoncus, eleifend tellus augue lectus potenti pellentesque... </p>

      </div>

      <div className="w-[300px]">
        <div className="flex items-center gap-4">
          <Image src={img1} alt="" width={48} height={48} />
          <div>
            <p className="font-[700]">terrylucas</p>
            <p className="text-[#64748B] text-sm">Terry Lucas</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm">
          <p className="text-[#64748B]">Suggested for you</p>
          <p className="font-[600] cursor-pointer">See all</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src={img2} alt="" width={40} height={40} />
            <div>
              <p className="font-[700] text-sm">terrylucas</p>
              <p className="text-[#64748B] text-xs">Follows you</p>
            </div>
          </div>
          <button className="text-[#3B82F6] text-sm font-[600]">
            Follow
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src={img2} alt="" width={40} height={40} />
            <div>
              <p className="font-[700] text-sm">terrylucas</p>
              <p className="text-[#64748B] text-xs">Follows you</p>
            </div>
          </div>
          <button className="text-[#3B82F6] text-sm font-[600]">
            Follow
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src={img2} alt="" width={40} height={40} />
            <div>
              <p className="font-[700] text-sm">terrylucas</p>
              <p className="text-[#64748B] text-xs">Follows you</p>
            </div>
          </div>
          <button className="text-[#3B82F6] text-sm font-[600]">
            Follow
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src={img2} alt="" width={40} height={40} />
            <div>
              <p className="font-[700] text-sm">terrylucas</p>
              <p className="text-[#64748B] text-xs">Follows you</p>
            </div>
          </div>
          <button className="text-[#3B82F6] text-sm font-[600]">
            Follow
          </button>
        </div>
      </div>
    </div>
  )
}