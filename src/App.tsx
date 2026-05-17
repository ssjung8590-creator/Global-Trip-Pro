/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Home,
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
    northAmerica: '미주',
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
    navHome: '홈',
    navDest: '나라 정보',
    navInfo: '정보',
    navCheck: '체크리스트'
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
    americas: 'Americas',
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
    addItem: 'Add Item',
    navDest: 'Explore',
    navInfo: 'Info',
    navCheck: 'Checklist'
  }
};

export default function App() {
  const [view, setView] = useState<AppView>('home');
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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedChecklistCategory, setSelectedChecklistCategory] = useState<string>('필수');

  const filteredCountries = COUNTRIES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !selectedRegion || c.region === selectedRegion;
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
    { id: '필수', label: t.catEssential, icon: '⭐', color: '#FF3B30', bg: 'bg-[#FFF2F2]', activeBg: 'bg-[#FF3B30]', activeText: 'text-white' },
    { id: '전자기기', label: t.catElectronics, icon: '🔌', color: '#5856D6', bg: 'bg-[#F2F2FF]', activeBg: 'bg-[#5856D6]', activeText: 'text-white' },
    { id: '의류', label: t.catClothes, icon: '👕', color: '#007AFF', bg: 'bg-[#F2F8FF]', activeBg: 'bg-[#007AFF]', activeText: 'text-white' },
    { id: '세면/위생', label: t.catToiletries, icon: '🧼', color: '#34C759', bg: 'bg-[#F2FFF5]', activeBg: 'bg-[#34C759]', activeText: 'text-white' },
    { id: '식량/상비약', label: t.catFood, icon: '💊', color: '#FF9500', bg: 'bg-[#FFF9F2]', activeBg: 'bg-[#FF9500]', activeText: 'text-white' },
    { id: '기타', label: t.catOthers, icon: '🎒', color: '#8E8E93', bg: 'bg-[#F2F2F7]', activeBg: 'bg-[#8E8E93]', activeText: 'text-white' }
  ];

  const renderChecklistUI = () => {
    const completedCount = checklist.filter(i => i.completed).length;
    const progress = (completedCount / checklist.length) * 100;

    return (
      <>
        <div className="space-y-4">
          {/* iOS Style Progress Card */}
          <div className="bg-white p-6 rounded-[2rem] ios-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  🧳
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">{t.checklist}</h2>
                  <p className="text-xs font-semibold text-gray-400">{completedCount} / {checklist.length} {t.done}</p>
                </div>
              </div>
              <button 
                onClick={() => setChecklist(INITIAL_CHECKLIST.map(item => ({ ...item })))}
                className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
              >
                <RotateCcw size={12} /> {lang === 'ko' ? '초기화' : 'Reset'}
              </button>
            </div>
            
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-3 gap-3">
            {checklistCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedChecklistCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-3xl transition-all duration-300 ${
                  selectedChecklistCategory === cat.id
                    ? `${cat.activeBg} ${cat.activeText} scale-105 ios-shadow-lg`
                    : `${cat.bg} text-slate-900 border border-transparent`
                }`}
              >
                <span className={`text-2xl ${selectedChecklistCategory === cat.id ? 'brightness-200' : ''}`}>{cat.icon}</span>
                <div className="text-center">
                  <span className="text-[14px] font-bold block">{cat.label}</span>
                  <span className={`text-[10px] font-semibold opacity-60 ${selectedChecklistCategory === cat.id ? 'text-white' : 'text-slate-500'}`}>
                    {checklist.filter(i => i.category === cat.id).length}개
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="bg-white rounded-[2.5rem] ios-shadow border border-gray-100 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedChecklistCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="divide-y divide-gray-50"
              >
                {checklist.filter(item => item.category === selectedChecklistCategory).length === 0 ? (
                  <div className="py-12 text-center text-gray-300 font-bold text-sm">
                    {t.noItemsInCategory}
                  </div>
                ) : (
                  checklist.filter(item => item.category === selectedChecklistCategory).map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-4 px-6 active:bg-gray-50 transition-colors" onClick={() => toggleCheck(item.id)}>
                      <div className="shrink-0">
                        {item.completed ? (
                          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <CheckCircle2 size={18} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-gray-200 bg-white" />
                        )}
                      </div>
                      <span className={`text-[17px] font-medium flex-1 ${item.completed ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                        {lang === 'ko' ? item.name : (item.nameEn || item.name)}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeItem(item.id, e); }}
                        className="text-gray-200 hover:text-rose-400 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
            
            <button 
              onClick={() => setActiveCategoryInput(selectedChecklistCategory)}
              className="w-full py-5 bg-gray-50 text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <Plus size={18} strokeWidth={3} /> {t.addItem}
            </button>
          </div>

          {activeCategoryInput === selectedChecklistCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-xs p-8 rounded-[3rem] shadow-2xl space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                    📝
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t.addItem}</h3>
                  <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">{selectedChecklistCategory}</p>
                </div>
                <input 
                  autoFocus
                  className="w-full bg-gray-50 px-6 py-4 text-[15px] outline-none font-bold text-gray-900 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-100 transition-all text-center"
                  placeholder={t.addPlaceholder}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addItem(newItemName, selectedChecklistCategory);
                      setNewItemName('');
                      setActiveCategoryInput(null);
                    }
                  }}
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveCategoryInput(null)}
                    className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold active:scale-95 transition-all"
                  >
                    {lang === 'ko' ? '취소' : 'Cancel'}
                  </button>
                  <button 
                    onClick={() => {
                      addItem(newItemName, selectedChecklistCategory);
                      setNewItemName('');
                      setActiveCategoryInput(null);
                    }}
                    className="flex-1 py-4 bg-blue-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all"
                  >
                    {t.add}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* AI Smart Check Section */}
        <div className="pt-10 mb-12 px-2">
          <div className="relative bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center overflow-hidden">
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
      </>
    );
  };

  const regionData = [
    { 
      name: 'Asia', 
      label: t.asia, 
      count: 12, 
      icon: '⛩️', 
      gradient: 'from-[#4C1D95] via-[#7C3AED] to-[#DB2777]', 
      shadow: 'shadow-purple-200/50' 
    },
    { 
      name: 'Europe', 
      label: t.europe, 
      count: 17, 
      icon: '🏰', 
      gradient: 'from-[#1E1B4B] via-[#312E81] to-[#4F46E5]', 
      shadow: 'shadow-indigo-300/50' 
    },
    { 
      name: 'Americas', 
      label: (t as any).americas || (lang === 'ko' ? '미주' : 'Americas'), 
      count: 5, 
      icon: '🗽', 
      gradient: 'from-[#0F172A] via-[#1E3A8A] to-[#2563EB]', 
      shadow: 'shadow-blue-200/50' 
    },
    { 
      name: 'Oceania', 
      label: t.oceania, 
      count: 2, 
      icon: '🦘', 
      gradient: 'from-[#064E3B] via-[#065F46] to-[#0D9488]', 
      shadow: 'shadow-teal-200/50' 
    }
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto relative overflow-hidden flex flex-col bg-[#F9FBFF]">
      {/* Removed background decor circles */}

      {/* Header */}
      <header className="relative z-10 px-4 py-2 flex justify-between items-center text-slate-800">
        <div>
          {view !== 'home' ? (
            <button 
              onClick={() => setView('home')}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-800 transition-colors"
              id="back-button"
            >
              <ArrowLeft size={24} />
            </button>
          ) : (
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2.5 text-left"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-[#0055FF] via-[#00A2FF] to-[#00E5BC] rounded-[1rem] flex items-center justify-center shadow-lg shadow-blue-200/50 relative overflow-hidden shrink-0">
                <Globe className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <span className="font-display text-[20px] font-[900] tracking-tight text-[#0A1F44]">TripReady</span>
            </button>
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
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Premium Hero Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1F44] to-[#1E3A8A] rounded-[2.5rem] p-8 text-white ios-shadow-lg">
                <div className="absolute inset-0 opacity-10" 
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
                />
                <div className="relative z-10 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 opacity-60">Next Trip</span>
                  <h1 className="text-3xl font-bold leading-tight break-keep">
                    {lang === 'ko' ? '어디로 떠나시나요?' : 'Where are you heading?'}
                  </h1>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['☀️', '💱', '🔌', '✈️'].map((icon, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                        <span className="text-xs">{icon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1 pl-2">
                  <h2 className="text-2xl font-black text-[#0A1F44] tracking-tight">어디로 떠나시나요?</h2>
                  <p className="text-[13px] font-bold text-slate-400">지역을 선택하면 나라 목록이 나와요</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {regionData.map((region) => (
                    <button
                      key={region.name}
                      onClick={() => {
                        setSelectedRegion(region.name === 'Americas' ? 'North America' : region.name);
                        setView('countries');
                      }}
                      className={`relative overflow-hidden aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br ${region.gradient} p-6 flex flex-col justify-between text-white active:scale-95 transition-all text-left shadow-xl ${region.shadow}`}
                    >
                      <div className="relative z-10 flex flex-col gap-1">
                        <span className="text-[11px] font-black opacity-60 tracking-wider">
                          {region.count}{lang === 'ko' ? '개국' : ' Countries'}
                        </span>
                        <span className="text-2xl font-black tracking-tight">{region.label}</span>
                      </div>
                      
                      <div className="absolute top-6 right-6 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <ChevronRight size={14} className="text-white" strokeWidth={3} />
                      </div>
                      
                      <div className="absolute bottom-[-10px] right-[-10px] scale-[2.2] opacity-20 pointer-events-none grayscale brightness-150">
                        <span className="text-6xl">{region.icon}</span>
                      </div>

                      {/* Accent highlight */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Checklist */}
              {renderChecklistUI()}
            </motion.div>
          )}

          {view === 'countries' && (
            <motion.div
              key="countries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {!selectedRegion ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 pl-2">
                    <h2 className="text-2xl font-black text-[#0A1F44] tracking-tight">{lang === 'ko' ? '어디로 떠나시나요?' : 'Where are you heading?'}</h2>
                    <p className="text-[13px] font-bold text-slate-400">{lang === 'ko' ? '지역을 선택하면 나라 목록이 나와요' : 'Select a region to see countries'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {regionData.map((region) => (
                      <button
                        key={region.name}
                        onClick={() => {
                          setSelectedRegion(region.name === 'Americas' ? 'North America' : region.name);
                        }}
                        className={`relative overflow-hidden aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br ${region.gradient} p-6 flex flex-col justify-between text-white active:scale-95 transition-all text-left shadow-xl ${region.shadow}`}
                      >
                        <div className="relative z-10 flex flex-col gap-1">
                          <span className="text-[11px] font-black opacity-60 tracking-wider">
                            {region.count}{lang === 'ko' ? '개국' : ' Countries'}
                          </span>
                          <span className="text-2xl font-black tracking-tight">{region.label}</span>
                        </div>
                        <div className="absolute top-6 right-6 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                          <ChevronRight size={14} className="text-white" strokeWidth={3} />
                        </div>
                        <div className="absolute bottom-[-10px] right-[-10px] scale-[2.2] opacity-20 pointer-events-none grayscale brightness-150">
                          <span className="text-6xl">{region.icon}</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1 pl-2">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest uppercase tracking-[0.2em]">{lang === 'ko' ? '🌍 지역별 탐색' : '🌍 Explore by Region'}</h3>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                      {[
                        { name: null, label: lang === 'ko' ? '전체 지역' : 'All Regions', icon: '🌎' },
                        ...regionData.map(r => ({ name: r.name === 'Americas' ? 'North America' : r.name, label: r.label, icon: r.icon }))
                      ].map((region) => (
                        <button
                          key={region.name || 'null'}
                          type="button"
                          onClick={() => setSelectedRegion(region.name)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all active:scale-95 shrink-0 whitespace-nowrap ${
                            selectedRegion === region.name
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                              : 'bg-white border-gray-100 text-slate-400'
                          }`}
                        >
                          <span className="text-lg">{region.icon}</span>
                          <span className="text-[13px] font-bold">{region.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 min-h-[300px]">
                    {filteredCountries.length === 0 ? (
                      <div className="col-span-2 py-20 text-center text-slate-300 font-bold">
                          {lang === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
                      </div>
                    ) : (
                      filteredCountries.map((country) => (
                        <button
                          key={country.id}
                          onClick={() => handleCountrySelect(country)}
                          className="bg-white p-4 rounded-3xl border border-gray-100 ios-shadow flex items-center gap-3 text-left active:scale-95 transition-all h-fit"
                        >
                          <span className="text-2xl">{country.emoji}</span>
                          <span className="text-sm font-bold text-gray-900 truncate">
                            {lang === 'ko' ? country.name : country.nameEn}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
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
                              {lang === 'ko' 
                                ? (selectedCountry.currency.code === 'JPY' ? '현지 환율 (1000단위 기준)' : '현지 환율 (1단위 기준)') 
                                : (selectedCountry.currency.code === 'JPY' ? 'Exchange Rate (per 1000 units)' : 'Exchange Rate (per 1 unit)')}
                            </p>
                            <p className="text-sm font-black text-emerald-900 flex items-center gap-1">
                              {selectedCountry.currency.symbol} {selectedCountry.currency.code === 'JPY' ? '1000' : '1'} = {((selectedCountry.currency.code === 'JPY' ? 1000 : 1) / exchangeRates[selectedCountry.currency.code]).toLocaleString(undefined, { maximumFractionDigits: 1 })}{lang === 'ko' ? '원' : ' KRW'}
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

      {/* Blur Style Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass ios-shadow-lg rounded-[2.5rem] px-8 py-4 z-50 flex justify-around items-center">
        <button 
          onClick={() => {
            setSelectedRegion(null);
            setView('home');
          }}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'home' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <Home size={20} strokeWidth={view === 'home' ? 3 : 2} />
          <span className="text-[10px] font-bold tracking-tight">{(t as any).navHome}</span>
        </button>
        <button 
          onClick={() => {
            setSelectedRegion(null);
            setView('countries');
          }}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'countries' || (view === 'details' && selectedCountry) ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <Globe size={20} strokeWidth={view === 'countries' || view === 'details' ? 3 : 2} />
          <span className="text-[10px] font-bold tracking-tight">{t.navDest}</span>
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'settings' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <Info size={20} strokeWidth={view === 'settings' ? 3 : 2} />
          <span className="text-[10px] font-bold tracking-tight">{t.navInfo}</span>
        </button>
        <button 
          onClick={() => setView('checklist')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'checklist' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <ShieldCheck size={20} strokeWidth={view === 'checklist' ? 3 : 2} />
          <span className="text-[10px] font-bold tracking-tight">{t.navCheck}</span>
        </button>
      </nav>
    </div>
  );
}
