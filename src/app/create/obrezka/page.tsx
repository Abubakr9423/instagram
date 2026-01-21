'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Button, Popover, Slider } from 'antd';
import { ChevronLeft, Maximize, ZoomIn, Copy, Plus, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { addImage, removeImage } from '@/src/lib/features/CreatePost/postSlice';

export default function EditPostPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = useSelector((state: any) => state.post.images) || [];
  const [activeIndex, setActiveIndex] = useState(images.length > 0 ? images.length - 1 : 0);
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('1/1');

  const currentPreview = images[activeIndex];

  const handleAddNewPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!window.originalFiles) window.originalFiles = [];
      window.originalFiles.push(file);
      const url = URL.createObjectURL(file);
      dispatch(addImage(url));
      setActiveIndex(images.length); 
    }
  };

  return (
     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-10 backdrop-blur-sm">
      
       <button 
        onClick={() => router.push('/')} 
        className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

       <div className="bg-white w-full max-w-[800px] h-[600px] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
         <div className="h-[43px] border-b border-[#dbdbdb] flex items-center justify-between px-4 shrink-0 bg-white">
          <button onClick={() => router.back()} className="hover:opacity-60 transition-opacity">
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>
          <h1 className="text-[16px] font-semibold text-[#262626]">Обрезать</h1>
          <button 
            onClick={() => router.push('/create/filter')} 
            className="text-[#0095f6] font-semibold text-[14px] hover:text-[#00376b] transition-colors"
          >
            Далее
          </button>
        </div>

         <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden select-none">
          {currentPreview ? (
            <>
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img 
                  key={currentPreview}  
                  src={currentPreview} 
                  style={{ 
                    transform: `scale(${zoom})`, 
                    aspectRatio: aspectRatio,
                  }}
                  className="max-h-full max-w-full object-cover transition-transform duration-200 ease-out" 
                />
              </div>

               <div className="absolute bottom-4 left-4 flex gap-3 z-20">
                 <Popover 
                  content={
                    <div className="flex flex-col w-32 bg-[#262626] rounded-md overflow-hidden">
                      <Button type="text" className="text-white hover:bg-white/10 text-left border-b border-white/10 rounded-none h-10" onClick={() => setAspectRatio('auto')}>Оригинал</Button>
                      <Button type="text" className="text-white hover:bg-white/10 text-left border-b border-white/10 rounded-none h-10" onClick={() => setAspectRatio('1/1')}>1:1</Button>
                      <Button type="text" className="text-white hover:bg-white/10 text-left border-b border-white/10 rounded-none h-10" onClick={() => setAspectRatio('4/5')}>4:5</Button>
                      <Button type="text" className="text-white hover:bg-white/10 text-left rounded-none h-10" onClick={() => setAspectRatio('16/9')}>16:9</Button>
                    </div>
                  } 
                  trigger="click" 
                  placement="top"
                  styles={{ content: { padding: 0, backgroundColor: 'transparent', border: 'none' }}}
                >
                  <button className="bg-[#1a1a1acc] p-2.5 rounded-full text-white hover:bg-black transition-colors">
                    <Maximize size={18} />
                  </button>
                </Popover>

                 <Popover 
                  content={<div className="w-40 px-2 py-4 bg-[#262626] rounded-lg"><Slider min={1} max={3} step={0.01} value={zoom} onChange={setZoom} tooltip={{ open: false }} trackStyle={{ backgroundColor: '#fff' }} handleStyle={{ borderColor: '#fff' }} /></div>} 
                  trigger="click" 
                  placement="top"
                  styles={{ content: { padding: 0, backgroundColor: 'transparent', border: 'none' }}}
                >
                  <button className="bg-[#1a1a1acc] p-2.5 rounded-full text-white hover:bg-black transition-colors">
                    <ZoomIn size={18} />
                  </button>
                </Popover>
              </div>

               <div className="absolute bottom-4 right-4 z-20">
                <Popover 
                  trigger="click" 
                  placement="topRight"
                  styles={{ content: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: 0 } }}
                  content={
                    <div className="flex items-center gap-3 p-3 bg-[#1a1a1acc] backdrop-blur-md rounded-xl border border-white/20">
                      {images.map((img: string, idx: number) => (
                        <div key={idx} className="relative w-20 h-20 group cursor-pointer shadow-lg">
                          <img 
                            src={img} 
                            onClick={() => setActiveIndex(idx)}
                            className={`w-full h-full object-cover rounded-md transition-all ${activeIndex === idx ? 'ring-2 ring-white scale-95' : 'opacity-60 hover:opacity-100'}`} 
                          />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();  
                              dispatch(removeImage(idx));
                              if (activeIndex >= idx) setActiveIndex(Math.max(0, activeIndex - 1));
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                       <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="w-20 h-20 border-2 border-dashed border-white/40 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus size={24} strokeWidth={1} />
                      </button>
                    </div>
                  }
                >
                  <button className="bg-[#1a1a1acc] p-2.5 rounded-full text-white hover:bg-black transition-colors">
                    <Copy size={18} />
                  </button>
                </Popover>
              </div>

               <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAddNewPhoto} />
            </>
          ) : (
            <div className="text-white flex flex-col items-center gap-4">
              <p className="text-gray-400">Нет выбранных изображений</p>
              <Button onClick={() => router.push('/create')}>Вернуться к выбору</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}