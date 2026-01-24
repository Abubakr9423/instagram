'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { setEditSettings } from '@/src/lib/features/CreatePost/postSlice'; 

export default function FilterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const images = useSelector((state: any) => state.post.images) || [];
  
  const [activeTab, setActiveTab] = useState<'filters' | 'settings'>('filters');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [currentPos, setCurrentPos] = useState(0); 
  const [selectedCover, setSelectedCover] = useState(0);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const [customCover, setCustomCover] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMedia = images[0];
  const isVideo = currentMedia?.includes('data:video') || currentMedia?.includes('.mp4');

  const filters = [
    { name: 'Original', value: 'original', css: '' },
    { name: 'Aden', value: 'aden', css: 'sepia(0.2) brightness(1.15) saturate(1.4)' },
    { name: 'Clarendon', value: 'clarendon', css: 'contrast(1.2) saturate(1.35)' },
    { name: 'Crema', value: 'crema', css: 'sepia(0.5) contrast(1.25)' },
    { name: 'Gingham', value: 'gingham', css: 'contrast(1.1) brightness(1.1)' },
    { name: 'Juno', value: 'juno', css: 'sepia(0.35) contrast(1.15)' },
    { name: 'Lark', value: 'lark', css: 'saturate(1.4)' },
  ];

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    
    const video = videoRef.current;
    
    const updateTime = () => {
      const duration = video.duration || 1;
      const timePercent = (video.currentTime / duration) * 100;
      setCurrentPos(timePercent);
      
      if (video.currentTime >= (duration * trimEnd) / 100) {
        video.currentTime = (duration * trimStart) / 100;
      }
    };
    
    video.addEventListener('timeupdate', updateTime);
    return () => video.removeEventListener('timeupdate', updateTime);
  }, [isVideo, trimStart, trimEnd]);

  const handleNext = () => {
    const settings = {
      filter: selectedFilter,
      adjustments: { brightness, contrast, saturation },
      trim: { start: trimStart, end: trimEnd },
      cover: customCover || selectedCover,
      isMuted
    };
    
    dispatch(setEditSettings(settings));
    router.push('/create/final');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    
    if (isDragging === 'start') {
      setTrimStart(Math.min(percent, trimEnd - 10));
    } else {
      setTrimEnd(Math.max(percent, trimStart + 10));
    }
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!sliderRef.current || !videoRef.current) return;
    
    const slider = sliderRef.current;
    const video = videoRef.current;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    
    video.currentTime = (video.duration * percent) / 100;
  };

  const getMediaStyle = () => {
    const filter = filters.find(f => f.value === selectedFilter);
    const filterCss = filter ? filter.css : '';
    
    return {
      filter: `${filterCss} brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%)`
    };
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomCover(event.target?.result as string);
      setSelectedCover(-1);
    };
    reader.readAsDataURL(file);
  };

  if (!currentMedia) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(null)}
      onMouseLeave={() => setIsDragging(null)}>
      
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />

      <div className="w-full max-w-[1040px] h-[650px] border-3 rounded-xl overflow-hidden flex flex-col shadow-2xl">
        
        <div className="h-[44px] border-t border-2 flex items-center justify-between px-4">
          <button onClick={() => router.back()}>
            <ChevronLeft size={28} />
          </button>
          <span className="text-[16px] font-semibold">Edit</span>
          <button onClick={handleNext} className="text-[#0095f6] font-semibold text-[14px]">
            Next
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          <div className="flex-1 flex items-center justify-center bg-black">
            {isVideo ? (
              <video
                ref={videoRef}
                src={currentMedia}
                autoPlay
                loop
                muted={isMuted}
                className="h-full max-w-full object-contain"
                style={getMediaStyle()}
              />
            ) : (
              <img
                src={currentMedia}
                className="h-full max-w-full object-contain"
                style={getMediaStyle()}
              />
            )}
          </div>

          <div className="w-[280px] border-l border-[#dbdbdb] flex flex-col">
            
            {isVideo ? (
              <div className="p-5 space-y-8 overflow-y-auto">
                
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-bold text-[14px]">Cover Photo</span>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#0095f6] text-[12px] font-semibold"
                    >
                      Choose from computer
                    </button>
                  </div>
                  
                  <div className="flex gap-[2px] h-[85px] border border-[#dbdbdb] rounded-md overflow-hidden">
                    {customCover && (
                      <div 
                        onClick={() => { setSelectedCover(-1); setCustomCover(null); }}
                        className={`flex-1 relative ${selectedCover === -1 ? 'ring-2 ring-inset ring-black z-10' : 'opacity-50'}`}
                      >
                        <img src={customCover} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    {[0, 1, 2, 3].map((index) => (
                      <div 
                        key={index}
                        onClick={() => { setSelectedCover(index); setCustomCover(null); }}
                        className={`flex-1 relative ${selectedCover === index ? 'ring-2 ring-inset ring-black z-10' : 'opacity-50'}`}
                      >
                        <video src={currentMedia} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[14px] block mb-3">Trim</span>
                  
                  <div className="relative pt-2 pb-8">
                    <div 
                      ref={sliderRef}
                      onClick={handleTimelineClick}
                      className="relative h-[60px] rounded-lg border-[3px] border-white shadow-[0_0_0_1px_#dbdbdb] flex items-center overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 flex opacity-60">
                        {[...Array(5)].map((_, i) => (
                          <video key={i} src={currentMedia} className="h-full w-full object-cover" />
                        ))}
                      </div>
                      
                      <div className="absolute inset-y-0 left-0 bg-white/60" style={{ width: `${trimStart}%` }} />
                      <div className="absolute inset-y-0 right-0 bg-white/60" style={{ width: `${100 - trimEnd}%` }} />
                      
                      <div 
                        className="absolute top-[-6px] bottom-[-6px] w-[6px] bg-white rounded-full shadow-md z-20"
                        style={{ left: `${currentPos}%`, transform: 'translateX(-50%)' }}
                      />
                      
                      <div 
                        onMouseDown={(e) => { e.stopPropagation(); setIsDragging('start'); }}
                        className="absolute inset-y-0 w-[10px] border-x border-gray-200 z-10 cursor-ew-resize flex items-center justify-center"
                        style={{ left: `${trimStart}%` }}
                      >
                        <div className="w-[1px] h-3 bg-gray-400" />
                      </div>
                      
                      <div 
                        onMouseDown={(e) => { e.stopPropagation(); setIsDragging('end'); }}
                        className="absolute inset-y-0 w-[10px] bg-white border-x border-gray-200 z-10 cursor-ew-resize flex items-center justify-center"
                        style={{ left: `${trimEnd}%`, transform: 'translateX(-100%)' }}
                      >
                        <div className="w-[1px] h-3 bg-gray-400" />
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between px-1">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        ))}
                      </div>
                      <div className="flex justify-between text-[12px] text-gray-400 mt-2">
                        <span>0s</span>
                        <span>3s</span>
                        <span>5s</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-[#dbdbdb]">
                  <span className="font-semibold text-[15px]">Audio {isMuted ? 'off' : 'on'}</span>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-[40px] h-[24px] rounded-full relative transition-colors ${!isMuted ? 'bg-black' : 'bg-gray-300'}`}
                  >
                    <div 
                      className={`absolute top-[4px] w-[16px] h-[16px] bg-white rounded-full transition-all ${!isMuted ? 'left-[20px]' : 'left-[4px]'}`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex border-b border-[#dbdbdb]">
                  <button 
                    onClick={() => setActiveTab('filters')}
                    className={`flex-1 py-3 text-[14px] font-semibold ${activeTab === 'filters' ? 'border-b border-black text-black' : 'text-[#8e8e8e]'}`}
                  >
                    Filters
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-3 text-[14px] font-semibold ${activeTab === 'settings' ? 'border-b border-black text-black' : 'text-[#8e8e8e]'}`}
                  >
                    Settings
                  </button>
                </div>

                <div className="p-4 overflow-y-auto">
                  {activeTab === 'filters' ? (
                    <div className="grid grid-cols-3 gap-4">
                      {filters.map((filter) => (
                        <button 
                          key={filter.name}
                          onClick={() => setSelectedFilter(filter.value)}
                          className="flex flex-col items-center gap-2"
                        >
                          <span className={`text-[11px] ${selectedFilter === filter.value ? 'text-black font-bold' : 'text-[#8e8e8e]'}`}>
                            {filter.name}
                          </span>
                          <div className={`w-full aspect-square rounded-sm overflow-hidden ${selectedFilter === filter.value ? 'ring-2 ring-black' : 'border'}`}>
                            <img 
                              src={currentMedia} 
                              style={{ filter: filter.css }}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-10 pt-4 px-2">
                      <div>
                        <div className="flex justify-between text-[12px] uppercase mb-4 text-[#8e8e8e]">
                          <span>Brightness</span>
                          <span className="text-black">{brightness}</span>
                        </div>
                        <input 
                          type="range" 
                          min="-100" 
                          max="100" 
                          value={brightness}
                          onChange={(e) => setBrightness(parseInt(e.target.value))}
                          className="insta-slider"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-[12px] uppercase mb-4 text-[#8e8e8e]">
                          <span>Contrast</span>
                          <span className="text-black">{contrast}</span>
                        </div>
                        <input 
                          type="range" 
                          min="-100" 
                          max="100" 
                          value={contrast}
                          onChange={(e) => setContrast(parseInt(e.target.value))}
                          className="insta-slider"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-[12px] uppercase mb-4 text-[#8e8e8e]">
                          <span>Saturation</span>
                          <span className="text-black">{saturation}</span>
                        </div>
                        <input 
                          type="range" 
                          min="-100" 
                          max="100" 
                          value={saturation}
                          onChange={(e) => setSaturation(parseInt(e.target.value))}
                          className="insta-slider"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`.insta-slider { -webkit-appearance: none; width: 100%;height: 1px;background: #262626;outline: none;   }
        .insta-slider::-webkit-slider-thumb {-webkit-appearance: none; width: 14px;height: 14px; background: #262626;border-radius: 50%;border: 2px solid white; cursor: pointer;} `}</style>
    </div>
  );
}