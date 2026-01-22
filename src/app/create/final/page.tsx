'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FinalStepPage() {
  const router = useRouter();
  const images = useSelector((state: any) => state.post.images) || [];
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');

   const previewImage = images[0];

  const handleShare = () => {
    console.log('Публикация отправлена:', { caption, location, images });
     router.push('/'); 
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-10 font-sans backdrop-blur-sm">
      <div className="bg-white w-full max-w-[1040px] h-[750px] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
         <div className="h-[43px] border-b border-[#dbdbdb] flex items-center justify-between px-4 shrink-0 bg-white">
          <button onClick={() => router.back()} className="hover:opacity-60 transition-opacity">
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>
          <h1 className="text-[16px] font-semibold text-[#262626]">Создание публикации</h1>
          <button 
            onClick={handleShare} 
            className="text-[#0095f6] font-semibold text-[14px] hover:text-[#00376b] transition-colors"
          >
            Поделиться
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
           <div className="w-[62%] bg-black flex items-center justify-center relative">
            <img 
              src={previewImage} 
              className="max-h-full max-w-full object-contain" 
              alt="Final Preview"
            />
          </div>

           <div className="w-[38%] flex flex-col bg-white border-l border-[#dbdbdb] overflow-y-auto custom-scrollbar">
            
             <div className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img src="/api/placeholder/32/32" alt="Avatar" />
              </div>
              <span className="text-[14px] font-semibold text-[#262626]">your_username</span>
            </div>

             <div className="px-4 pb-4">
              <textarea
                placeholder="Добавьте подпись..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full h-40 text-[16px] outline-none resize-none placeholder:text-[#c7c7c7]"
                maxLength={2200}
              />
              <div className="flex justify-between items-center mt-2">
                <button className="text-[20px] grayscale hover:grayscale-0 transition-all">😊</button>
                <span className="text-[12px] text-[#c7c7c7]">{caption.length}/2,200</span>
              </div>
            </div>

            <div className="border-t border-[#dbdbdb]">
               <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                <input 
                  type="text" 
                  placeholder="Добавьте местоположение" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent outline-none text-[16px] w-full"
                />
                <MapPin size={20} className="text-[#262626]" />
              </div>

               <div className="border-t border-[#dbdbdb] p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <span className="text-[16px] text-[#262626]">Доступность</span>
                <ChevronDown size={20} className="text-[#8e8e8e]" />
              </div>

              <div className="border-t border-[#dbdbdb] p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <span className="text-[16px] text-[#262626]">Расширенные настройки</span>
                <ChevronDown size={20} className="text-[#8e8e8e]" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dbdbdb; border-radius: 10px; }
      `}</style>
    </div>
  );
}