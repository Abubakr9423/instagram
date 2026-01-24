'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Users, ChevronRight, Smile } from 'lucide-react';
import { useState } from 'react';
import { addPostToServer, setCaption } from '@/src/lib/features/CreatePost/postSlice';

 const EMOJIS = ['😂', '😮', '😍', '😢', '👏', '🔥', '🎉', '💯', '❤️', '🤣', '🥰', '😘', '😭', '😊'];

export default function FinalPage() {
  const router = useRouter();
  const dispatch = useDispatch();

   const postData = useSelector((state: any) => state.post);
  const images = postData.images || [];
  const caption = postData.caption || '';
  const editSettings = postData.editSettings || {};
  const loading = postData.loading || false;
  const error = postData.error || '';

   const [showEmojis, setShowEmojis] = useState(false);

   const currentMedia = images[0];
  const isVideo = currentMedia?.includes('data:video') || currentMedia?.includes('.mp4');

   if (!currentMedia) return null;

   const getImageStyle = () => {
    if (isVideo || !editSettings.adjustments) return {};
    
    const { brightness = 0, contrast = 0, saturation = 0 } = editSettings.adjustments;
    
    return {
      filter: `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%)`
    };
  };

   const handleShare = async () => {
    if (loading) return;
    
    try {
       const formData = new FormData();
      
       formData.append('Title', caption.substring(0, 30) || "New Post");
      formData.append('Content', caption);
      
       for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileType = isVideo ? 'video/mp4' : 'image/jpeg';
        const fileName = `media_${i}_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
        const file = new File([blob], fileName, { type: fileType });
        formData.append('Images', file);
      }

       await dispatch(addPostToServer(formData));

       router.push('/home');
      
    } catch (err) {
      console.error('Error sending:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      
       <div className="w-full max-w-[940px] h-[600px] border-4 rounded-xl overflow-hidden flex flex-col">
        
         <div className="h-[43px] border-b border-gray-300 flex items-center justify-between px-4">
          <button onClick={() => router.back()} className="hover:opacity-60">
            <ChevronLeft size={28} />
          </button>
          
          <span className="text-[16px] font-semibold">New Post</span>
          
          <button 
            onClick={handleShare} 
            disabled={loading}
            className="text-blue-500 font-semibold hover:text-black disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Share'}
          </button>
        </div>

         <div className="flex flex-1 overflow-hidden">
          
           <div className="w-[650px] flex items-center justify-center border-r border-gray-300">
            {isVideo ? (
              <video 
                src={currentMedia} 
                className="w-full h-full object-contain" 
                muted 
                autoPlay 
                loop 
              />
            ) : (
              <img 
                src={currentMedia} 
                style={getImageStyle()} 
                className="w-full h-full object-contain" 
                alt="Preview" 
              />
            )}
          </div>

           <div className="flex-1 flex flex-col overflow-y-auto">
            
             <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                <div className="w-full h-full rounded-full" />
              </div>
              <span className="font-semibold">hoshimjjon</span>
            </div>

             <div className="p-4 border-b border-gray-100">
              <textarea
                className="w-full h-[140px] outline-none resize-none text-[15px] placeholder:text-gray-400"
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => dispatch(setCaption(e.target.value))}
                maxLength={2200}
              />
              
              <div className="flex items-center justify-between pt-3">
                <button 
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="hover:text-black"
                >
                  <Smile size={22} />
                </button>
                
                <span className="text-[12px]">
                  {caption.length}/2,200
                </span>
              </div>
            </div>

             <div className="flex flex-col border-b border-gray-100">
              <MenuItem label="Tag people" hasArrow />
              <MenuItem label="Add location" icon={<MapPin size={20} />} />
              <MenuItem label="Add collaborators" icon={<Users size={20} />} />
            </div>

             <div className="flex flex-col">
              <MenuItem label="Accessibility" hasArrow />
              <MenuItem label="Advanced settings" hasArrow />
            </div>

             <div className="p-4 mt-auto">
              <p className="text-[12px] text-gray-500 leading-[1.4]">
                Your post will be shown to your followers. It may also appear 
                in some public sections.
              </p>
            </div>

             {error && (
              <div className="p-4 text-red-500 text-[12px]">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

       {showEmojis && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end justify-center pb-20">
          <div className="rounded-xl p-4 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold">Select emoji</p>
              <button 
                onClick={() => setShowEmojis(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-3">
              {EMOJIS.map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => {
                    dispatch(setCaption(caption + emoji));
                    setShowEmojis(false);
                  }}
                  className="text-[24px] hover:scale-125 transition-transform p-2"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

 function MenuItem({ icon, label, hasArrow = false }: { icon?: any, label: string, hasArrow?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-800 cursor-pointer">
      <span className="text-[15px]">{label}</span>
      
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {hasArrow && <ChevronRight size={20} className="text-gray-400" />}
      </div>
    </div>
  );
}