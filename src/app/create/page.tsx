'use client';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Upload } from 'antd';
import createimage from '@/public/createimage.png';  
import { addImage } from '@/src/lib/features/CreatePost/postSlice';
import { SquarePlay, X } from 'lucide-react';
import { Image ,PlaySquare} from 'lucide-react';

export default function CreatePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSelect = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      
       reader.readAsDataURL(file);
      
      reader.onload = () => {
        const base64String = reader.result as string;
        
         dispatch(addImage(base64String));
        
         router.push('/create/obrezka');
      };
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-100/3 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <button 
        onClick={() => router.push('/home')} 
        className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      <div className="w-full max-w-[580px] h-[580px] rounded-xl border-2 overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="h-[43px] border-b flex items-center justify-center shrink-0">
          <h1 className="text-[16px] font-semibold">Create New Post</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-12">
          <div className="mb-4 flex">
            <div className="relative w-10 h-10">
              <Image 
                className="absolute bottom-0 right-0 rounded-sm" 
                size={94} 
              />
              <PlaySquare 
                className="absolute -mt-7 -left-2" 
                size={94} 
              />
            </div>
          </div>

          <h2 className="text-[20px] font-normal mt-10 mb-6">Drag photos and videos here</h2>

          <Upload 
            showUploadList={false} 
            beforeUpload={() => false} 
            onChange={handleSelect}
            accept="image/*,video/*"
          >
            <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold py-[7px] px-4 rounded-lg">
              Select from computer
            </button>
          </Upload>
        </div>
      </div>
    </div>
  );
}