'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Maximize, ZoomIn, Copy, Plus, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { addImage, removeImage } from '@/src/lib/features/CreatePost/postSlice';
import { Upload } from 'antd';

export default function EditPostPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const images = useSelector((state: any) => state.post.images) || [];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [showGallery, setShowGallery] = useState(false);
  const [showZoomSlider, setShowZoomSlider] = useState(false);
  const [showAspectMenu, setShowAspectMenu] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentImage = images[activeIndex];

  const renderMedia = (src: string, className = '') => {
    if (src.includes('data:video') || src.includes('.mp4')) {
      return <video src={src} autoPlay loop muted className={className} />;
    }
    return <img src={src} className={className} />;
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(addImage(reader.result as string));
      setActiveIndex(images.length);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    dispatch(removeImage(index));
    if (activeIndex >= index) {
      setActiveIndex(Math.max(0, activeIndex - 1));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-10 backdrop-blur-sm">
      <button 
        onClick={() => router.push('/home')} 
        className="absolute top-5 right-5 hover:text-gray-300"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      <div className="w-full max-w-[800px] h-[600px] rounded-xl overflow-hidden flex flex-col shadow-2xl">
        
        <div className="h-[43px] border-b flex items-center justify-between px-4 border-3">
          <button onClick={() => router.back()}>
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-[16px] font-semibold">Crop</h1>
          <button 
            onClick={() => router.push('/create/filter')} 
            className="text-[#0095f6] font-semibold"
          >
            Next
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {currentImage ? (
            <>
              <div 
                className="h-full max-w-full transition-transform"
                style={{ 
                  transform: `scale(${zoom})`,
                  aspectRatio: aspectRatio === 'auto' ? 'unset' : aspectRatio 
                }}
              >
                {renderMedia(currentImage, "h-full max-w-full object-cover")}
              </div>

              <div className="absolute bottom-4 left-4 flex gap-3 z-20">
                
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowAspectMenu(!showAspectMenu);
                      setShowZoomSlider(false);
                      setShowGallery(false);
                    }}
                    className="bg-[#1a1a1acc] p-2.5 rounded-full text-white"
                  >
                    <Maximize size={18} />
                  </button>
                  
                  {showAspectMenu && (
                    <div className="absolute bottom-full mb-2 left-0 flex flex-col w-32 rounded-md overflow-hidden bg-[#1a1a1acc] backdrop-blur-md border border-white/20">
                      {['auto', '1/1', '4/5', '16/9'].map(ratio => (
                        <button 
                          key={ratio}
                          onClick={() => {
                            setAspectRatio(ratio);
                            setShowAspectMenu(false);
                          }}
                          className="p-2 hover:bg-white/10 text-left border-b border-white/10 text-white"
                        >
                          {ratio === 'auto' ? 'Original' : ratio}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowZoomSlider(!showZoomSlider);
                      setShowAspectMenu(false);
                      setShowGallery(false);
                    }}
                    className="bg-[#1a1a1acc] p-2.5 rounded-full text-white"
                  >
                    <ZoomIn size={18} />
                  </button>
                  
                  {showZoomSlider && (
                    <div className="absolute bottom-full mb-2 left-0 w-40 px-2 py-3 rounded-lg bg-[#1a1a1acc] backdrop-blur-md border border-white/20">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">1x</span>
                        <input 
                          type="range" 
                          min="1" 
                          max="3" 
                          step="0.01" 
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="flex-1"
                          style={{
                            background: `linear-gradient(to right, #fff 0%, #fff ${((zoom-1)/2)*100}%, #444 ${((zoom-1)/2)*100}%, #444 100%)`
                          }}
                        />
                        <span className="text-white text-sm">3x</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-4 right-4 z-20">
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowGallery(!showGallery);
                      setShowZoomSlider(false);
                      setShowAspectMenu(false);
                    }}
                    className="bg-[#1a1a1acc] p-2.5 rounded-full text-white"
                  >
                    <Copy size={18} />
                  </button>
                  
                  {showGallery && (
                    <div className="absolute bottom-full mb-2 right-0 p-3 rounded-xl bg-[#1a1a1acc] backdrop-blur-md border border-white/20">
                      <div className="flex items-center gap-3">
                        {images.map((img: string, idx: number) => (
                          <div 
                            key={idx} 
                            className="relative w-20 h-20 group cursor-pointer"
                            onClick={() => {
                              setActiveIndex(idx);
                              setShowGallery(false);
                            }}
                          >
                            <div className={`w-full h-full rounded-md overflow-hidden ${activeIndex === idx ? 'ring-2 ring-white' : 'opacity-60'}`}>
                              {renderMedia(img, "w-full h-full object-cover")}
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto(idx);
                              }}
                              className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 border-2 border-dashed border-white/40 rounded-md flex items-center justify-center text-white hover:border-white/60"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*,video/*" 
                onChange={handleAddPhoto} 
              />
            </>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-gray-500">No File selected.</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Add Photo or Video
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                hidden 
                accept="image/*,video/*" 
                onChange={handleAddPhoto} 
              />
            </div>

          )}
        </div>
      </div>

      {(showGallery || showZoomSlider || showAspectMenu) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowGallery(false);
            setShowZoomSlider(false);
            setShowAspectMenu(false);
          }}
        />
      )}
    </div>
  );
}