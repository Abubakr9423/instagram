'use client'

import { useEffect, useRef, useState } from 'react'
import img from '../../../public/image.png'
import img1 from '../../../public/image copy.png'
import img2 from '../../../public/image copy 2.png'
import img3 from '../../../public/image copy 3.png'
import img4 from '../../../public/image copy 4.png'
import img5 from '../../../public/image copy 5.png'
import img6 from '../../../public/image copy 6.png'
import { Bookmark, Heart, MessageCircle, Send, Volume2, VolumeX } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/src/lib/store'
import { getFollowing, getPost, getProduct, postComment, postLike } from '@/src/lib/features/home/homeslice'
import Image from 'next/image'
import Stories from 'react-insta-stories';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map())
  const [mutedMap, setMutedMap] = useState<Record<number, boolean>>({})
  const [pausedMap, setPausedMap] = useState<Record<number, boolean>>({})
  const dispatch = useDispatch<AppDispatch>()
  const data = useSelector((state: RootState) => state.home.data)
  const post = useSelector((state: RootState) => state.home.post)
  const follow = useSelector((state: RootState) => state.home.follow)
  
  const [openStories, setOpenStories] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [activePostId, setActivePostId] = useState<number | null>(null)
  const storyItems = post?.map((p: any) => ({
url: `https://instagram-api.softclub.tj/images/${p.images[0]}`
}))


  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -120, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' })
  }

  const toggleSound = (id: number) => {
    const video = videoRefs.current.get(id)
    if (!video) return
    const next = !(mutedMap[id] ?? true)
    video.muted = next
    setMutedMap(p => ({ ...p, [id]: next }))
  }

  const togglePlay = (id: number) => {
    const video = videoRefs.current.get(id)
    if (!video) return
    if (video.paused) {
      video.play()
      setPausedMap(p => ({ ...p, [id]: false }))
    } else {
      video.pause()
      setPausedMap(p => ({ ...p, [id]: true }))
    }
  }

  const initVideoObserver = (videos: HTMLVideoElement[]) => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            if (!pausedMap[Number(video.dataset.id)]) {
              video.play()
            }
          } else {
            video.pause()
            video.currentTime = 0
          }
        })
      },
      { threshold: 0.6 }
    )



    videos.forEach(v => observer.observe(v))

    return () => {
      videos.forEach(v => observer.unobserve(v))
    }
  }

  useEffect(() => {
    const videos = Array.from(videoRefs.current.values())
    if (!videos.length) return
    return initVideoObserver(videos)
  }, [data, pausedMap])

  useEffect(() => {
    dispatch(getProduct()),
    dispatch(getFollowing()),
    dispatch(getPost())
  }, [dispatch])

  return (
    <div className="flex ml-[-12%] gap-[40px]">
      <div className="relative max-w-[65%] w-full">
        
        <button
          onClick={scrollLeft}
          className="absolute left-[-16px] top-[35px] z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/40 text-white"
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
          {post.map((story:any) => (
            <div
              key={story.postId}
              className="flex w-[12%] min-w-[72px] flex-shrink-0 flex-col items-center"
            >
              <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px]">
                <div className="rounded-full bg-white p-[2px]">
                  <Image
  onClick={() => setOpenStories(true)}
  src={`https://instagram-api.softclub.tj/images/${story.images[0]}`}
  alt={story.userName}
  width={64}
  height={64}
  className="rounded-full w-[64px] h-[64px] object-cover cursor-pointer"
/>

{openStories && (
  <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
    <Stories
      stories={storyItems}
      defaultInterval={1500}
      width={432}
      height={768}
    />
    <div
      onClick={() => setOpenStories(false)}
      className="absolute inset-0"
    />
  </div>
)}

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
            <Image src={img3} alt="" />
            <div>
              <p className="font-[700]">terrylucas</p>
              <p className="text-[#475569]">Profile</p>
            </div>
          </div>
        </div>

        <Image src={img4} alt="" className="mt-[10px]" />

        {data.map((e: any) => (
          <div key={e.postId} className="mt-[20px]">
            <div className="flex items-center gap-[20px]">
              <Image
                src={`https://instagram-api.softclub.tj/images/${e.userImage}`}
                alt=""
                className="rounded-[20px] w-[40px] h-[40px] rounded-[50%]"
                width={40}
                height={40}
              />
              <div>
                <p className="font-[700]">{e.userName}</p>
                <p className="text-[#475569]">Profile</p>
              </div>
            </div>

            <div className="relative mt-[10px]">
              <video
                data-id={e.postId}
                muted={mutedMap[e.postId] ?? true}
                ref={el => {
                  if (el) videoRefs.current.set(e.postId, el)
                }}
              onDoubleClick={() => dispatch(postLike(e.postId))}
                src={`https://instagram-api.softclub.tj/images/${e.images}`}
                playsInline
                loop
                
                onClick={() => togglePlay(e.postId)}
                className="w-full h-[80vh] object-cover rounded-[10px]"
              />

              <button
                onClick={() => toggleSound(e.postId)}
                className="absolute bottom-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white"
              >
                {mutedMap[e.postId] ?? true ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
            </div>

            <div className="flex items-end justify-between w-full mt-[15px]">
              <div className="flex items-center gap-[20px]">
                <div
  onClick={() => dispatch(postLike(e.postId))}
  className="flex items-center gap-[8px] cursor-pointer"
>
  <Heart
  onClick={() => dispatch(postLike(e.postId))}
  className={`w-6 h-6 transition-all ${
    e.postLike ? 'fill-red-500 text-red-500' : 'text-black'
  }`}
/>

  <p className="text-[16px] font-[650]">{e.postLikeCount}</p>
</div>

                <div className="flex items-center gap-[8px]">
                <Dialog>
  <DialogTrigger onClick={() => setActivePostId(e.postId)}>
  <MessageCircle /> 
</DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <div className="flex items-center gap-[40px]">
        <div className="num1 flex items-center gap-[10px]">
      <Input
  type="text"
  placeholder="Comment"
  value={commentText}
  className='w-[300px]'
  onChange={e => setCommentText(e.target.value)}
/>
<DialogFooter>
  <Button
    onClick={() => {
      if (!activePostId || !commentText.trim()) return
      dispatch(postComment({ id: activePostId, comment: commentText }))
      setCommentText('')
    }}
    >
    Send
  </Button>
</DialogFooter>
      </div>
    </div>
    <div className="comment">
  {e.comments?.map((c: any) => (
    <div key={c.postCommentId} className="flex gap-2 mt-2">
      <Image
        src={
          c.userImage
            ? `https://instagram-api.softclub.tj/images/${c.userImage}`
            : '/avatar.png'
        }
        alt={c.userName}
        width={28}
        height={28}
        className="rounded-full"
      />

      <div>
        <p className="text-sm">
          <span className="font-[700] mr-1">{c.userName}</span>
          {c.comment}
        </p>
      </div>
    </div>
  ))}
</div>
    </DialogHeader>
  </DialogContent>
</Dialog>
                  
                  <p className="text-[16px] font-[650]">{e.commentCount}</p>
                </div>
<Send />
              </div>
              <Bookmark />
            </div>

            <p>
              <span className="font-[700]">{e.userName}</span> {e.content}
            </p>
          </div>
        ))}
      </div>

      <div className="w-[32%] min-w-[280px]">
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
              <Image src={img5} className='rounded-[50%]' alt="" width={40} height={40} />
              <div>
                <p className="font-[700] text-sm">alijon</p>
                <p className="text-[#64748B] text-xs">Follows you</p>
              </div>
            </div>
            <button className="text-[#3B82F6] text-sm font-[600]">
              Follow
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src={img6} className='rounded-[50%] w-[40px] h-[40px]' alt="" width={40} height={40} />
              <div>
                <p className="font-[700] text-sm">ismoil_dev</p>
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
