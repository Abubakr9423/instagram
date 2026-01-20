'use client'
import React, { useState } from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

const sampleData = [
  {
    id: 1,
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/400/400?1',
    likesCount: 120,
    commentsCount: 30,
  },
  {
    id: 2,
    mediaType: 'video',
    mediaUrl: 'https://picsum.photos/400/400?2',
    likesCount: 300,
    commentsCount: 50,
  },
  {
    id: 3,
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/400/400?3',
    likesCount: 45,
    commentsCount: 10,
  },
  {
    id: 4,
    mediaType: 'video',
    mediaUrl: 'https://picsum.photos/400/400?4',
    likesCount: 200,
    commentsCount: 40,
  },
  {
    id: 5,
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/400/400?5',
    likesCount: 75,
    commentsCount: 15,
  },
]

const ExploreDesign = () => {
  const [data] = useState(sampleData)

  return (
    <div className="min-h-screen p-[2px]">
      <div className="grid grid-cols-3 gap-[2px]">
        {data.map(item => (
          <div
            key={item.id}
            className={`relative group overflow-hidden cursor-pointer
              ${item.mediaType === 'video' ? 'row-span-2' : ''}
            `}
          >
            <img
              src={item.mediaUrl}
              alt=""
              className="w-full h-full object-cover"
            />

            {/* ▶ reels */}
            {item.mediaType === 'video' && (
              <PlayArrowIcon
                className="absolute top-2 right-2"
                sx={{ color: 'white', fontSize: 22 }}
              />
            )}

            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/50 
              flex items-center justify-center gap-6
              opacity-0 group-hover:opacity-100 transition"
            >
              <div className="flex items-center gap-1 text-white">
                <FavoriteIcon />
                <span>{item.likesCount}</span>
              </div>

              <div className="flex items-center gap-1 text-white">
                <ChatBubbleOutlineIcon />
                <span>{item.commentsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreDesign
