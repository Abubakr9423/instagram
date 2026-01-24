import { Send } from 'lucide-react'
import React from 'react'

function NotFoundchat() {
    return (
        <div className='flex flex-col items-center justify-center h-full'>
            <div className='p-4 border-2 border-black dark:border-white rounded-full mb-4'><Send size={50} /></div>
            <h1 className='text-xl font-bold'>Your messages</h1>
            <p className='text-gray-500'>Send a message to start a chat.</p>
        </div>
    )
}

export default NotFoundchat