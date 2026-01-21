'use client';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Upload } from 'antd';
import Image from 'next/image';
import createimage from '@/public/createimage.png';  
import { addImage } from '@/src/lib/features/CreatePost/postSlice';
import { X } from 'lucide-react';

export default function CreatePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSelect = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      if (!window.originalFiles) window.originalFiles = [];
      window.originalFiles = [file];
      const imageUrl = URL.createObjectURL(file);
      dispatch(addImage(imageUrl));
      router.push('/create/obrezka');
    }
  };

  return (
     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      
       <button 
        onClick={() => router.push('/')} 
        className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

       <div className="bg-white w-full max-w-[580px] h-[580px] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
         <div className="h-[43px] border-b border-[#dbdbdb] flex items-center justify-center shrink-0">
          <h1 className="text-[16px] font-semibold text-[#262626]">Создание публикации</h1>
        </div>

         <div className="flex-1 flex flex-col items-center justify-center px-12">
           <div className="mb-4">
            <Image 
              src={createimage} 
              alt="Upload placeholder" 
              className="w-[96px] h-auto select-none"
              priority
            />
          </div>

           <h2 className="text-[20px] font-normal text-[#262626] mb-6">
            Перетащите сюда фото и видео
          </h2>

           <Upload 
            showUploadList={false} 
            beforeUpload={() => false} 
            onChange={handleSelect}
            className="w-auto"
          >
            <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold py-[7px] px-4 rounded-lg transition-colors active:opacity-80">
              Выбрать на компьютере
            </button>
          </Upload>
        </div>

      </div>
    </div>
  );
}