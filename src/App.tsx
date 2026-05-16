/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  CloudSun, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  MapPin, 
  CheckCircle2, 
  Circle,
  Briefcase,
  Luggage,
  Camera,
  ArrowLeft,
  Settings,
  Info,
  Loader2,
  RotateCcw,
  AlertCircle,
  Trash2,
  X,
  Plus,
  Coins,
  Plane
} from 'lucide-react';
import { COUNTRIES, INITIAL_CHECKLIST } from './constants';
import { Language, AppView, CountryInfo, ChecklistItem } from './types';
import { analyzeChecklist } from './services/geminiService';

const translations = {
  ko: {
    destinations: '여행지 국가',
    checklist: '체크리스트',
    settings: '앱 설정',
    info: '도움이 되는 정보',
    done: '완료',
    totalProgress: '전체 진행률',
    resetChecklist: '모든 체크리스트 진행 상황을 초기화할까요?',
    addPlaceholder: '새 준비물 입력...',
    add: '추가',
    resetRecovery: '초기화하여 전체 복구하기',
    noItemsInCategory: '이 카테고리에 항목이 없습니다',
    openChecklist: '체크리스트 열기',
    manageChecklist: '메인 체크리스트 편집',
    analysisReport: 'AI 분석 리포트',
    analyzing: '이미지를 꼼꼼하게 대조 중입니다...',
    perfectPreparation: '완벽한 준비!',
    perfectPrepSub: 'AI가 분석한 결과, 모든 품목이 잘 챙겨진 것 같습니다.',
    missingItems: '! 누락 품목 의심 리스트',
    expertAdvice: '전문가의 조언',
    confirm: '확인',
    emergencyInfo: '비상 연락망 & 정보',
    emergencyPhone: '비상 연락처',
    passportRef: '여권 번호 (참고용)',
    passportTip: '💡 여권 사본을 스마트폰의 암호화된 폴더나 클라우드에 업로드해 두면 분실 시 매우 유용하게 쓰입니다.',
    dataManagement: '데이터 관리',
    resetBtn: '초기화',
    helpfulLinks: '해외 출장 필수 링크',
    installGuide: '앱으로 사용하기 (설치 방법)',
    localWeather: '현지 날씨',
    voltage: '사용 전압',
    currency: '현지 통화',
    entryProcedure: '입국 절차 방법',
    officialSite: '공식 사이트 연결',
    all: '전체',
    asia: '아시아',
    europe: '유럽',
    northAmerica: '북미',
    oceania: '대양주',
    regionPrompt: '🌍 국가를 선택하면\n실시간 날씨 · 환율 · 전압 · 입국 절차를 알 수 있어요',
    selectCountryNotice: '국가를 선택하면',
    realtimeInfoNotice: '실시간 정보를 바로 확인할 수 있어요',
    weatherLabel: '날씨',
    ratesLabel: '환율',
    voltageLabel: '전압',
    entryLabel: '입국절차',
    aiTitle: '최종 점검 & AI 조언',
    aiDescription: '짐을 다 싸셨나요? 사진 한 장이면 AI 전문가가 빠진 물건과 현지 팁을 조언해드립니다.',
    aiStart: 'AI 스마트 점검 시작',
    analysisError: '분석 중 오류가 발생했습니다. 네트워크 상태를 확인 후 다시 시도해주세요.',
    catEssential: '필수',
    catElectronics: '전자기기',
    catClothes: '의류',
    catToiletries: '세면/위생',
    catFood: '식량/상비약',
    catOthers: '기타',
    itemsIn: '내역',
    addItem: '항목 추가'
  },
  en: {
    destinations: 'Destinations',
    checklist: 'Checklist',
    settings: 'Settings',
    info: 'Helpful Info',
    done: 'Done',
    totalProgress: 'Total Progress',
    resetChecklist: 'Reset all checklist progress?',
    addPlaceholder: 'New item...',
    add: 'Add',
    resetRecovery: 'Reset to recover all',
    noItemsInCategory: 'No items in this category',
    openChecklist: 'Open Checklist',
    manageChecklist: 'Edit Main Checklist',
    analysisReport: 'AI Analysis Report',
    analyzing: 'Analyzing image carefully...',
    perfectPreparation: 'Perfect Prep!',
    perfectPrepSub: 'AI analysis suggests all items are well-packed.',
    missingItems: '! Possible Missing Items',
    expertAdvice: 'Expert Advice',
    confirm: 'Confirm',
    emergencyInfo: 'Emergency & Info',
    emergencyPhone: 'Emergency Phone',
    passportRef: 'Passport # (Ref)',
    passportTip: '💡 Uploading a copy of your passport to an encrypted folder or cloud is very useful in case of loss.',
    dataManagement: 'Data Management',
    resetBtn: 'Reset',
    helpfulLinks: 'Essential Travel Links',
    installGuide: 'App Install Guide',
    localWeather: 'Local Weather',
    voltage: 'Voltage',
    currency: 'Currency',
    entryProcedure: 'Entry Procedures',
    officialSite: 'Official Entry Site',
    all: 'All',
    asia: 'Asia',
    europe: 'Europe',
    northAmerica: 'N. America',
    oceania: 'Oceania',
    regionPrompt: '🌍 Select a country to see\nweather, rates, voltage, and entry procedures',
    selectCountryNotice: 'Select a country',
    realtimeInfoNotice: 'to see real-time information',
    weatherLabel: 'Weather',
    ratesLabel: 'Rates',
    voltageLabel: 'Voltage',
    entryLabel: 'Entry',
    aiTitle: 'Final Check & AI Advice',
    aiDescription: 'Packed everything? Take a photo and our AI will spot missing items and give local tips.',
    aiStart: 'Start AI Smart Check',
    analysisError: 'Analysis failed. Please check connection and try again.',
    catEssential: 'Essential',
    catElectronics: 'Electronics',
    catClothes: 'Clothes',
    catToiletries: 'Toiletries',
    catFood: 'Food/Med',
    catOthers: 'Others',
    itemsIn: 'Items',
    addItem: 'Add Item'
  }
};

export default function App() {
  const [view, setView] = useState<AppView>('countries');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('appLang');
    return (saved as Language) || 'ko';
  });

  const t = translations[lang];
  
  // Load checklist from localStorage if available
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('tripChecklist');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ missingItems: string[]; suggestions: string } | null>(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);

  const [emergencyPhone, setEmergencyPhone] = useState(localStorage.getItem('emergencyPhone') || '');
  const [passportRef, setPassportRef] = useState(localStorage.getItem('passportRef') || '');

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [lastRateUpdate, setLastRateUpdate] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/KRW');
        const data = await response.json();
        if (data && data.rates) {
          setExchangeRates(data.rates);
          setLastRateUpdate(new Date().toLocaleTimeString(lang === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchExchangeRates();
    // Fetch every hour
    const interval = setInterval(fetchExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    // Sync existing checklist with INITIAL_CHECKLIST and migrate old categories
    setChecklist(prev => {
      const migrated = prev.map(item => {
        // Migrate old category name
        if (item.category === '기타/가방') {
          return { ...item, category: '기타' };
        }
        return item;
      });

      // Also ensure all INITIAL_CHECKLIST items exist (if not already deleted or if they are new)
      const initialIds = INITIAL_CHECKLIST.map(i => i.id);
      
      // Filter out items that are numeric IDs (system items) but no longer in INITIAL_CHECKLIST
      const filtered = migrated.filter(item => {
        const isSystemItem = /^\d+$/.test(item.id);
        if (isSystemItem) {
          return initialIds.includes(item.id);
        }
        return true; // Keep user-added items
      });

      const merged = [...filtered];
      INITIAL_CHECKLIST.forEach(initialItem => {
        const existingIdx = merged.findIndex(i => i.id === initialItem.id);
        if (existingIdx === -1) {
          merged.push({ ...initialItem });
        } else {
          // Sync fields to reflect visual and structural improvements from constants.ts
          const existing = merged[existingIdx];
          existing.name = initialItem.name;
          existing.nameEn = initialItem.nameEn;
          existing.icon = initialItem.icon;
        }
      });

      return merged;
    });

    // Migrate the active category state if it's pointing to the old name
    setSelectedChecklistCategory(prev => prev === '기타/가방' ? '기타' : prev);
  }, []);

  useEffect(() => {
    localStorage.setItem('tripChecklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('emergencyPhone', emergencyPhone);
  }, [emergencyPhone]);

  useEffect(() => {
    localStorage.setItem('passportRef', passportRef);
  }, [passportRef]);

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const addItem = (name: string, category: string) => {
    if (!name.trim()) return;
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      nameEn: name, 
      category,
      completed: false,
      icon: '📦'
    };
    setChecklist(prev => [...prev, newItem]);
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const [newItemName, setNewItemName] = useState('');
  const [activeCategoryInput, setActiveCategoryInput] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedChecklistCategory, setSelectedChecklistCategory] = useState<string>('필수');

  const filteredCountries = COUNTRIES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleCountrySelect = (country: CountryInfo) => {
    setSelectedCountry(country);
    setView('details');
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisModalOpen(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        try {
          const result = await analyzeChecklist(base64Content, file.type, checklist, lang);
          setAnalysisResult(result);
        } catch (error) {
          console.error("Analysis failed", error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File reading failed", error);
      setIsAnalyzing(false);
    }
  };

  const checklistCategories = [
    { id: '필수', label: t.catEssential, icon: '⭐', bg: 'bg-[#FFF0F5]', text: 'text-[#FF4D8D]', border: 'border-[#FFD1E1]', active: 'border-[#0A1F44] border-2 shadow-md', shadow: 'shadow-pink-100' },
    { id: '전자기기', label: t.catElectronics, icon: '🔌', bg: 'bg-[#F0F4FF]', text: 'text-[#4D7CFF]', border: 'border-[#D1E0FF]', active: 'border-[#0A1F44] border-2 shadow-md', shadow: 'shadow-blue-100' },
    { id: '의류', label: t.catClothes, icon: '👕', bg: 'bg-[#F0F9FF]', text: 'text-[#0091FF]', border: 'border-[#B3E1FF]', active: 'border-[#0A1F44] border-2 shadow-md', shadow: 'shadow-sky-100' },
    { id: '세면/위생', label: t.catToiletries, icon: '🧼', bg: 'bg-[#F0FFFA]', text: 'text-[#00C2A0]', border: 'border-[#B3F5E1]', active: 'border-[#0A1F44] border-2 shadow-md', shadow: 'shadow-teal-100' },
    { id: '식량/상비약', label: t.catFood, icon: '💊', bg: 'bg-[#FFF9F0]', text: 'text-[#FF9F00]', border: 'border-[#FFEBC2]', active: 'border-[#0A1F44] border-2 shadow-md', shadow: 'shadow-orange-100' },
    { id: '기타', label: t.catOthers, icon: '🎒', bg: 'bg-[#F8F9FA]', text: 'text-[#6C757D]', border: 'border-[#DEE2E6]', active: 'border-[#0A1F44] border-2 shadow-md', shadow: 'shadow-slate-100' }
  ];

  const renderChecklistUI = () => (
    <div className="space-y-2">
      <div className="bg-white px-4 py-2.5 rounded-[1.2rem] border border-slate-100 shadow-sm mt-1 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 bg-[#F0F4FF] rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Suitcase Body */}
              <rect x="6" y="8" width="20" height="18" rx="3" fill="#0088FF" />
              {/* Suitcase Top Handle */}
              <path d="M12 8V6C12 5.44772 12.4477 5 13 5H19C19.5523 5 20 5.44772 20 6V8" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
              {/* Suitcase Details/Lines */}
              <rect x="8" y="10" width="16" height="14" rx="1.5" stroke="white" strokeOpacity="0.2" fill="white" fillOpacity="0.1" />
              {/* Stickers */}
              <circle cx="11" cy="14" r="2.5" fill="#FFD600" /> {/* Yellow Sticker */}
              <circle cx="21" cy="19" r="2" fill="#00DDAA" /> {/* Green Sticker */}
              <circle cx="14" cy="20" r="1.5" fill="#FF4D8D" /> {/* Pink Sticker */}
              {/* Wheels */}
              <rect x="8" y="26" width="3" height="2" rx="1" fill="#334155" />
              <rect x="21" y="26" width="3" height="2" rx="1" fill="#334155" />
            </svg>
          </div>
          <h2 className="text-[20px] font-black text-[#0A1F44] tracking-tight whitespace-nowrap">
            {t.checklist}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-[#EFF6FF] rounded-full shrink-0 whitespace-nowrap">
            <span className="text-[#0055FF] font-black text-[13px]">
              {checklist.filter(i => i.completed).length} / {checklist.length} 완료
            </span>
          </div>

          <button 
            onClick={() => setChecklist(INITIAL_CHECKLIST.map(item => ({ ...item })))}
          className="flex items-center gap-1 text-pink-500 transition-all active:scale-95 shrink-0 whitespace-nowrap"
        >
          <RotateCcw size={14} className="font-bold" />
          <span className="text-[13px] font-black">{t.resetBtn}</span>
        </button>
      </div>
    </div>

      <div className="grid grid-cols-3 gap-2.5 px-1">
        {checklistCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedChecklistCategory(cat.id)}
            className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border transition-all ${
              selectedChecklistCategory === cat.id
                ? `${cat.active} ${cat.bg} ${cat.text}`
                : `${cat.bg} ${cat.text} ${cat.border} shadow-sm active:scale-95`
            }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className={`text-[13px] font-black tracking-tight leading-none text-center`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedChecklistCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 px-1 pt-2">
              <div className="w-1.5 h-4.5 bg-[#0055FF] rounded-full" />
              <h3 className="text-[17px] font-black text-[#0A1F44] tracking-tight">
                {translations[lang][(Object.entries({
                  '필수': 'catEssential',
                  '전자기기': 'catElectronics',
                  '의류': 'catClothes',
                  '세면/위생': 'catToiletries',
                  '식량/상비약': 'catFood',
                  '기타': 'catOthers'
                }) as [string, keyof typeof translations.ko][]).find(([k]) => k === selectedChecklistCategory)?.[1] || 'itemsIn']} {t.itemsIn}
              </h3>
            </div>

            <div className="grid gap-2.5">
              {checklist.filter(item => item.category === selectedChecklistCategory).length === 0 ? (
                <div className="py-8 flex flex-col items-center gap-3 bg-white rounded-[1.5rem] border border-dashed border-slate-100">
                  <span className="text-3xl opacity-20">📭</span>
                  <p className="text-[10px] font-bold text-slate-300 tracking-tight">{t.noItemsInCategory}</p>
                </div>
              ) : (
                checklist.filter(item => item.category === selectedChecklistCategory).map(item => (
                  <div key={item.id} className="group relative">
                    <button
                      onClick={() => toggleCheck(item.id)}
                      className={`w-full flex items-center gap-3.5 py-4 px-5 rounded-[1.2rem] transition-all border ${
                        item.completed 
                        ? 'bg-[#F0F7FF] border-[#E0EFFF] shadow-none' 
                        : 'bg-white border-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-blue-100 active:scale-[0.98]'
                      }`}
                    >
                      <div className="shrink-0">
                        {item.completed ? (
                          <div className="w-6 h-6 bg-[#0088FF] rounded-full flex items-center justify-center shadow-md shadow-blue-100 animate-in zoom-in duration-300">
                            <CheckCircle2 size={16} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-[#D1E0FF] bg-white transition-colors group-hover:border-blue-200" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <span className={`text-xl ${item.completed ? 'opacity-30 grayscale' : ''}`}>
                          {item.icon}
                        </span>
                        <span className={`text-[15px] text-left truncate font-bold ${item.completed ? 'line-through text-slate-300' : 'text-[#0A1F44]'}`}>
                          {lang === 'ko' ? item.name : (item.nameEn || item.name)}
                        </span>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => removeItem(item.id, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-rose-200 hover:text-rose-400 active:scale-90 transition-colors"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                ))
              )}

              <button 
                onClick={() => setActiveCategoryInput(selectedChecklistCategory)}
                className="w-full py-4 bg-[#4A90FF] text-white rounded-[1.2rem] flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:opacity-90 transition-all active:scale-95 mt-1"
              >
                <Plus size={18} /> <span className="font-bold text-sm tracking-tight">{t.addItem}</span>
              </button>


              {activeCategoryInput === selectedChecklistCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white w-full max-w-xs p-8 rounded-[3rem] shadow-2xl space-y-6"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-black text-slate-800">{t.addItem}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedChecklistCategory}</p>
                    </div>
                    <input 
                      autoFocus
                      className="w-full bg-slate-50 px-6 py-4 text-[15px] outline-none font-bold text-slate-800 rounded-2xl border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      placeholder={t.addPlaceholder}
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setActiveCategoryInput(null)}
                        className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-sm font-bold active:scale-95 transition-all"
                      >
                        {lang === 'ko' ? '취소' : 'Cancel'}
                      </button>
                      <button 
                        onClick={() => {
                          addItem(newItemName, selectedChecklistCategory);
                          setNewItemName('');
                          setActiveCategoryInput(null);
                        }}
                        className="flex-1 py-4 bg-blue-400 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all"
                      >
                        {t.add}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pt-10 mb-12 px-2">
        <div className="relative bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center relative z-10 shadow-sm border border-slate-50">
            <div className="w-16 h-16 rounded-full border-2 border-slate-50 flex items-center justify-center">
              <Camera size={36} className="text-[#D946EF]" />
            </div>
          </div>
          <div className="relative z-10 space-y-2">
            <h4 className="text-[22px] font-black text-[#0A1F44] tracking-tight">{t.aiTitle}</h4>
            <p className="text-[14px] text-slate-400 font-bold leading-relaxed px-4 break-keep">
              {t.aiDescription}
            </p>
          </div>
          <label className="w-full relative z-10 py-5 bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-white rounded-full text-[16px] font-black cursor-pointer transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-purple-100 flex items-center justify-center gap-3 group">
            <Zap size={20} className="fill-white" />
            {t.aiStart}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload} 
            />
          </label>
        </div>
      </div>
    </div>
  );

  const regionData = [
    { name: 'All', icon: '🌎', label: t.all, color: 'bg-slate-900', textColor: 'text-slate-900', pastel: 'bg-slate-100', border: 'border-slate-200' },
    { name: 'Asia', icon: '🏯', label: t.asia, color: 'bg-amber-500', textColor: 'text-amber-700', pastel: 'bg-amber-50', border: 'border-amber-200' },
    { name: 'Europe', icon: '🏰', label: t.europe, color: 'bg-blue-500', textColor: 'text-blue-700', pastel: 'bg-blue-50', border: 'border-blue-200' },
    { name: 'North America', icon: '🗽', label: t.northAmerica, color: 'bg-rose-500', textColor: 'text-rose-700', pastel: 'bg-rose-50', border: 'border-rose-200' },
    { name: 'Oceania', icon: '🏝️', label: t.oceania, color: 'bg-teal-500', textColor: 'text-teal-700', pastel: 'bg-teal-50', border: 'border-teal-200' }
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto relative overflow-hidden flex flex-col bg-[#F9FBFF]">
      {/* Removed background decor circles */}

      {/* Header */}
      <header className="relative z-10 px-4 py-2 flex justify-between items-center text-slate-800">
        <div>
          {view !== 'countries' ? (
            <button 
              onClick={() => setView('countries')}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-800 transition-colors"
              id="back-button"
            >
              <ArrowLeft size={24} />
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-[#0055FF] via-[#00A2FF] to-[#00E5BC] rounded-[1rem] flex items-center justify-center shadow-lg shadow-blue-200/50 relative overflow-hidden shrink-0">
                {/* Globe Line */}
                <div className="absolute inset-0 border-[1.5px] border-white/20 rounded-full scale-75 rotate-[-20deg]" />
                <div className="absolute inset-0 border-[1px] border-white/10 rounded-full scale-50 rotate-[45deg]" />
                
                {/* Airplane Trail */}
                <div className="absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-[-30deg] translate-y-1" />
                
                <div className="relative z-10 flex items-center justify-center">
                  <Globe className="text-white" size={18} strokeWidth={2.5} />
                  {/* Pin Dot */}
                  <div className="absolute w-1 h-1 bg-white rounded-full translate-y-1 translate-x-1 shadow-sm" />
                </div>
                
                {/* Shiny Plane */}
                <div className="absolute top-1 right-1">
                  <Plane size={9} className="text-white fill-white transform rotate-[-45deg]" />
                </div>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[20px] font-[900] tracking-tight text-[#0A1F44] leading-none">
                  TripReady
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="w-10 h-10 flex items-center justify-center bg-indigo-400 text-white rounded-full hover:bg-indigo-500 transition-all shadow-md shadow-indigo-100 active:scale-95 border-2 border-white"
          >
            <span className="text-[11px] font-black">{lang === 'ko' ? 'EN' : 'KO'}</span>
          </button>
          <button 
            onClick={() => setView('settings')}
            className="p-2 bg-white/40 rounded-full border border-slate-100 shadow-sm" 
            id="settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 pb-12 text-slate-800">
        <AnimatePresence mode="wait">
          {view === 'countries' && (
            <motion.div
              key="countries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Region Icons Container */}
                <div className="grid grid-cols-5 gap-2 px-1 py-4">
                  {regionData.map((region) => (
                    <button
                      key={region.name}
                      type="button"
                      onClick={() => setSelectedRegion(selectedRegion === region.name ? 'All' : region.name)}
                      className={`flex flex-col items-center gap-2 py-4 rounded-[1.5rem] border-2 transition-all active:scale-95 ${region.pastel} ${
                        selectedRegion === region.name
                          ? 'shadow-lg -translate-y-1 border-[#0A1F44]'
                          : `${region.border} shadow-sm`
                      }`}
                    >
                      <span className="text-3xl">{region.icon}</span>
                      <span className={`text-[12px] font-black uppercase tracking-tight ${region.textColor} opacity-100`}>
                        {region.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Conditional Country Grid */}
                <div className="mt-8 min-h-[40px]">
                  <AnimatePresence mode="wait">
                    {selectedRegion === 'All' ? (
                      <motion.div
                        key="region-prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-[1.2rem] p-5 text-center border-2 border-dashed border-[#DEE5F5] shadow-inner flex flex-col items-center"
                      >
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <div className="w-5 h-5 bg-[#F0F4FF] rounded-full flex items-center justify-center">
                            <Globe className="text-[#0088FF]" size={12} />
                          </div>
                          <h3 className="text-[13px] font-black text-[#0A1F44] truncate">{(t as any).selectCountryNotice}</h3>
                        </div>
                        <p className="text-[12px] font-bold text-slate-400 mb-3">{(t as any).realtimeInfoNotice}</p>
                        
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {[
                            { label: (t as any).weatherLabel, icon: '☀️', bg: 'bg-[#FFF9EB]' },
                            { label: (t as any).ratesLabel, icon: '💱', bg: 'bg-[#F0FFF4]' },
                            { label: (t as any).voltageLabel, icon: '🔌', bg: 'bg-[#F5F3FF]' },
                            { label: (t as any).entryLabel, icon: '✈️', bg: 'bg-[#EFF6FF]' }
                          ].map(item => (
                            <div key={item.label} className={`flex items-center gap-1 px-2 py-1 ${item.bg} rounded-full border border-white/50 shadow-sm`}>
                              <span className="text-xs">{item.icon}</span>
                              <span className="text-[10px] font-black text-slate-600 tracking-tight">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key={selectedRegion}
                        initial={{ height: 0, opacity: 0, scale: 0.95 }}
                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.95 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-3 pb-2 transition-all">
                          {filteredCountries.map((country) => {
                            const regionInfo = regionData.find(r => r.name === country.region) || regionData[0];
                            
                            return (
                              <button
                                key={country.id}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className={`flex items-center gap-4 p-4 ${regionInfo.pastel} border-2 ${regionInfo.border} rounded-2xl shadow-sm text-left hover:brightness-95 transition-all active:scale-95 group`}
                              >
                                <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{country.emoji}</span>
                                <div className="min-w-0">
                                  <p className="text-[15px] font-black text-slate-800 truncate">{lang === 'ko' ? country.name : country.nameEn}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              {/* Checklist Section Integration */}
              <div className="pt-6">
                {renderChecklistUI()}
              </div>
            </motion.div>
          )}

          {view === 'details' && selectedCountry && (
            <motion.div
              key="details"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6"
            >
              <div className="text-center py-4">
                <div className="text-6xl mb-2 drop-shadow-sm">{selectedCountry.emoji}</div>
                <h2 className="text-3xl font-display font-bold text-slate-800">{lang === 'ko' ? selectedCountry.name : selectedCountry.nameEn}</h2>
                <p className="text-slate-400">{lang === 'ko' ? selectedCountry.nameEn : selectedCountry.name}</p>
              </div>

              {/* Weather, Voltage & Info Cards */}
              <div className="space-y-4">
                {/* 1. Weather Card (Soft Blue) */}
                <div className="bg-blue-50/70 p-6 rounded-[2.5rem] shadow-sm border border-blue-100/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <CloudSun size={28} className="text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-blue-600/60 font-bold mb-0.5">{t.localWeather}</h4>
                        <p className="text-sm font-bold text-blue-900 leading-snug">{selectedCountry.weatherSummary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 bg-white/50 p-3 rounded-[1.5rem] border border-blue-100/30">
                    {selectedCountry.forecast.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 py-2">
                        <span className="text-[10px] font-bold text-blue-400">{day.day}</span>
                        <span className="text-xl">{day.condition}</span>
                        <span className="text-[11px] font-black text-blue-900">{day.temp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 2. Voltage Card (Soft Rose) */}
                  <div className="bg-rose-50/70 p-6 rounded-[2.5rem] aspect-square flex flex-col justify-between shadow-sm border border-rose-100/50">
                    <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
                      <Zap size={28} className="text-rose-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-rose-600/60 font-bold mb-1">{t.voltage}</h4>
                      <p className="text-2xl font-bold text-rose-900">{selectedCountry.voltage}</p>
                      <p className="text-[10px] text-rose-900/50 font-medium leading-tight mt-1">{selectedCountry.plugType}</p>
                    </div>
                  </div>

                  {/* 3. Currency Card (Soft Emerald) */}
                  <div className="bg-emerald-50/70 p-6 rounded-[2.5rem] aspect-square flex flex-col justify-between shadow-sm border border-emerald-100/50">
                    <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
                      <Coins size={28} className="text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-emerald-600/60 font-bold mb-1">{t.currency}</h4>
                      <p className="text-xl font-black text-emerald-900">{lang === 'ko' ? selectedCountry.currency.name : selectedCountry.currency.nameEn}</p>
                      <div className="mt-1">
                        <p className="text-[11px] text-emerald-900/60 font-bold leading-tight">
                          {selectedCountry.currency.symbol} · {selectedCountry.currency.code}
                        </p>
                        {exchangeRates[selectedCountry.currency.code] ? (
                          <div className="mt-2 pt-2 border-t border-emerald-100/50">
                            <p className="text-[10px] font-black text-emerald-600 leading-none mb-1">
                              {lang === 'ko' ? '현지 환율 (1단위 기준)' : 'Exchange Rate (per 1 unit)'}
                            </p>
                            <p className="text-sm font-black text-emerald-900 flex items-center gap-1">
                              {selectedCountry.currency.symbol} 1 = {(1 / exchangeRates[selectedCountry.currency.code]).toLocaleString(undefined, { maximumFractionDigits: 1 })}{lang === 'ko' ? '원' : ' KRW'}
                            </p>
                            {lastRateUpdate && (
                              <p className="text-[9px] text-emerald-400 font-medium mt-1">
                                {lang === 'ko' ? `갱신: ${lastRateUpdate}` : `Updated: ${lastRateUpdate}`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 pt-2 border-t border-emerald-100/50 animate-pulse">
                            <p className="text-[10px] font-black text-emerald-600/40 leading-none mb-1">
                              {lang === 'ko' ? '환율 정보 로딩 중...' : 'Loading exchange rates...'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Entry Procedure Card (Soft Violet) */}
                <div className="bg-violet-50/70 p-6 rounded-[2.5rem] flex flex-col gap-4 shadow-sm border border-violet-100/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0">
                      <ShieldCheck size={28} className="text-violet-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-violet-600/60 font-bold mb-1">{(translations[lang] as any).entryProcedure}</h4>
                      <p className="text-xs font-bold text-violet-900 leading-relaxed">
                        {lang === 'ko' 
                          ? (selectedCountry.entryProcedure || "90일 이내 무비자 입국이 가능합니다. 유효기간 6개월 이상의 여권을 권장합니다.") 
                          : (selectedCountry.entryProcedureEn || "Visa-free entry for up to 90 days. Passport with 6-month validity recommended.")}
                      </p>
                    </div>
                  </div>
                  
                  {selectedCountry.entryUrl && (
                    <a 
                      href={selectedCountry.entryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-4 bg-white/60 hover:bg-white rounded-2xl text-[11px] font-black text-violet-600 transition-all border border-violet-100 shadow-sm group"
                    >
                      {(translations[lang] as any).officialSite}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>

                <div className="mt-8">
                  {renderChecklistUI()}
                </div>
              </motion.div>
            )}

          {view === 'checklist' && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pb-12"
            >
              {renderChecklistUI()}
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t.settings}</span>
                <h2 className="text-2xl font-bold mt-1 text-slate-800">{t.info}</h2>
              </div>

              <div className="space-y-6">
                {/* Emergency Info section */}
                <div className="glass bg-rose-50/50 p-6 rounded-[2.5rem] border border-rose-100 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <AlertCircle size={18} className="text-rose-600" />
                    </div>
                    <span className="font-bold text-sm text-rose-900">{t.emergencyInfo}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest pl-1">{t.emergencyPhone}</label>
                      <input 
                        className="w-full bg-white/60 border border-rose-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white transition-all"
                        placeholder="예: 010-0000-0000"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest pl-1">{t.passportRef}</label>
                      <input 
                        className="w-full bg-white/60 border border-rose-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white transition-all"
                        placeholder="예: M12345678"
                        value={passportRef}
                        onChange={(e) => setPassportRef(e.target.value)}
                      />
                      <p className="mt-2 text-[10px] text-rose-500/70 font-bold leading-relaxed px-1 whitespace-pre-line">
                        {t.passportTip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Helpful Links/Info */}
                <div className="glass bg-blue-50/50 p-6 rounded-[2.5rem] border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-900 mb-4">{t.helpfulLinks}</h4>
                  <div className="grid gap-2">
                    {[
                      { name: lang === 'ko' ? '외교부 해외안전여행' : 'Safe Travel (MOFA)', url: 'https://www.0404.go.kr' },
                      { name: lang === 'ko' ? '인천공항 운항현황' : 'Incheon Airport Status', url: 'https://www.airport.kr' },
                      { name: lang === 'ko' ? '세계 기상 기구' : 'World Weather Info', url: 'https://worldweather.wmo.int' }
                    ].map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white/60 rounded-2xl text-sm font-semibold text-blue-800 hover:bg-white transition-all shadow-sm"
                      >
                        {link.name}
                        <ChevronRight size={16} className="opacity-40" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Mobile Installation Guide */}
                <div className="glass bg-slate-900/5 p-6 rounded-[2.5rem] border border-slate-200/50">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Globe size={16} className="text-slate-400" />
                    {t.installGuide}
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-white/60 p-4 rounded-2xl text-[11px] leading-relaxed text-slate-600">
                      <p className="font-bold text-slate-800 mb-2">iPhone (Safari)</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>{lang === 'ko' ? '하단 중앙의 [공유] 아이콘을 누르세요.' : 'Tap Share icon at the bottom.'}</li>
                        <li>{lang === 'ko' ? '스크롤을 내려 [홈 화면에 추가]를 선택하세요.' : 'Tap Add to Home Screen.'}</li>
                      </ol>
                    </div>
                    <div className="bg-white/60 p-4 rounded-2xl text-[11px] leading-relaxed text-slate-600">
                      <p className="font-bold text-slate-800 mb-2">Android (Chrome)</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>{lang === 'ko' ? '우측 상단의 점 3개 아이콘을 누르세요.' : 'Tap 3-dots menu icon.'}</li>
                        <li>{lang === 'ko' ? '[홈 화면에 추가] 또는 [앱 설치]를 선택하세요.' : 'Tap Add to Home Screen or Install App.'}</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

                <div className="mt-8">
                  {renderChecklistUI()}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {analysisModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/20 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white rounded-[2.5rem] p-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold font-display text-slate-800">{t.analysisReport}</h3>
                <button 
                  onClick={() => setAnalysisModalOpen(false)}
                  className="p-2 bg-slate-50 rounded-full text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {isAnalyzing ? (
                <div className="py-16 flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 blur-xl animate-pulse rounded-full" />
                    <Loader2 size={48} className="text-blue-500 animate-spin relative" />
                  </div>
                  <p className="text-sm font-bold text-slate-500 animate-pulse">{t.analyzing}</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-8">
                  {analysisResult.missingItems.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-amber-500 bg-amber-50 p-4 rounded-2xl">
                        <AlertCircle size={22} className="shrink-0" />
                        <span className="text-sm font-black italic">{t.missingItems}</span>
                      </div>
                      <div className="grid gap-2">
                        {analysisResult.missingItems.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex flex-col items-center gap-3 text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <CheckCircle2 size={32} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-900">{t.perfectPreparation}</p>
                        <p className="text-xs text-emerald-700/60 mt-1">{t.perfectPrepSub}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{t.expertAdvice}</h4>
                    <div className="bg-slate-50/50 p-5 rounded-2xl text-[14px] leading-relaxed text-slate-600 font-medium">
                      {analysisResult.suggestions}
                    </div>
                  </div>

                  <button 
                    onClick={() => setAnalysisModalOpen(false)}
                    className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl mt-4 shadow-xl shadow-slate-100 transition-all hover:bg-slate-800"
                  >
                    {t.confirm}
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-300">
                  <Info size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">{t.analysisError}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
