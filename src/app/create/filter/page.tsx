  'use client';
  import { useSelector } from 'react-redux';
  import { useRouter } from 'next/navigation';
  import { ChevronLeft, ChevronRight } from 'lucide-react';
  import { useState } from 'react';

  export default function FilterPage() {
    const router = useRouter();
    const images = useSelector((state: any) => state.post.images) || [];
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'filters' | 'settings'>('settings');
    const [adjustments, setAdjustments] = useState(
      images.length > 0 ? images.map(() => ({
        brightness: 0, contrast: 0, fade: 0, saturate: 0, temperature: 0, vignette: 0, baseFilter: '' 
      })) : []
    );

    if (!images.length || !adjustments[activeIndex]) return null;

    const currentAdj = adjustments[activeIndex];
    
    const combinedFilter = `
      ${currentAdj.baseFilter} 
      brightness(${100 + currentAdj.brightness}%) 
      contrast(${100 + currentAdj.contrast}%) 
      saturate(${100 + currentAdj.saturate}%) 
      sepia(${currentAdj.fade}%)
    `;

    const updateAdj = (key: string, value: number) => {
      const newAdj = [...adjustments];
      newAdj[activeIndex] = { ...newAdj[activeIndex], [key]: value };
      setAdjustments(newAdj);
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-10 font-sans">
        <div className="bg-white w-full max-w-[1040px] h-[750px] rounded-xl overflow-hidden flex flex-col shadow-2xl">
          
          <div className="h-[43px] border-b border-[#dbdbdb] flex items-center justify-between px-4 shrink-0 bg-white">
            <button onClick={() => router.back()} className="hover:opacity-60 transition-opacity">
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <h1 className="text-[16px] font-semibold text-[#262626]">Редактировать</h1>
            <button 
              onClick={() => router.push('/create/final')} 
              className="text-[#0095f6] font-semibold text-[14px] hover:text-[#00376b] transition-colors"
            >
              Далее
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-[62%] bg-black flex items-center justify-center relative group">
              <img 
                src={images[activeIndex]} 
                style={{ filter: combinedFilter }}
                className="max-h-full max-w-full object-contain pointer-events-none" 
              />
              
              {images.length > 1 && (
                <div className="absolute bottom-6 flex gap-1.5">
                  {images.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${activeIndex === i ? 'bg-[#0095f6]' : 'bg-[#a8a8a8]'}`} />
                  ))}
                </div>
              )}

              {activeIndex < images.length - 1 && (
                <button 
                  onClick={() => setActiveIndex(activeIndex + 1)}
                  className="absolute right-4 p-1.5 bg-[#1a1a1acc] rounded-full text-white hover:bg-black transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            <div className="w-[38%] flex flex-col bg-white border-l border-[#dbdbdb]">
              <div className="flex border-b border-[#dbdbdb] shrink-0">
                <button 
                  onClick={() => setActiveTab('filters')} 
                  className={`flex-1 py-3 text-[14px] font-semibold transition-colors ${activeTab === 'filters' ? 'border-b border-black text-black' : 'text-[#8e8e8e]'}`}
                >
                  Фильтры
                </button>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`flex-1 py-3 text-[14px] font-semibold transition-colors ${activeTab === 'settings' ? 'border-b border-black text-black' : 'text-[#8e8e8e]'}`}
                >
                  Настройки
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {activeTab === 'settings' && (
                  <div className="space-y-8 py-2">
                    {[
                      { label: 'Яркость', key: 'brightness', min: -100, max: 100 },
                      { label: 'Контраст', key: 'contrast', min: -100, max: 100 },
                      { label: 'Выгорание', key: 'fade', min: 0, max: 100 },
                      { label: 'Насыщенность', key: 'saturate', min: -100, max: 100 },
                      { label: 'Температура', key: 'temperature', min: -100, max: 100 },
                      { label: 'Винньетка', key: 'vignette', min: 0, max: 100 },
                    ].map((item) => (
                      <div key={item.key} className="flex flex-col gap-5">
                        <span className="text-[16px] text-[#262626] font-normal">{item.label}</span>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min={item.min}
                            max={item.max}
                            value={(currentAdj as any)[item.key]}
                            onChange={(e) => updateAdj(item.key, Number(e.target.value))}
                            className="insta-slider flex-1"
                          />
                          <span className="text-[12px] text-[#8e8e8e] w-4 text-right">
                            {(currentAdj as any)[item.key]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          /* Стилизация скроллбара как на скриншоте */
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #dbdbdb; border-radius: 10px; }
          
          /* Кастомный слайдер Instagram */
          .insta-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 1px;
            background: #dbdbdb;
            outline: none;
          }
          
          /* Кружок слайдера */
          .insta-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: #000;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.1s ease;
          }

          .insta-slider::-webkit-slider-thumb:active {
            transform: scale(0.9);
          }
        `}</style>
      </div>
    );
  }