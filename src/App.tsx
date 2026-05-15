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
  Camera,
  ArrowLeft,
  Settings,
  Info,
  Loader2,
  RotateCcw,
  AlertCircle,
  X,
  Plus,
  Coins
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
    aiTitle: '최종 점검 & AI 조언',
    aiDescription: '짐을 다 싸셨나요? 사진 한 장이면 AI 전문가가 빠진 물건과 현지 팁을 조언해드립니다.',
    aiStart: 'AI 스마트 점검 시작',
    analysisError: '분석 중 오류가 발생했습니다. 네트워크 상태를 확인 후 다시 시도해주세요.',
    navDest: '여행지',
    navInfo: '정보',
    navCheck: '준비물',
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
    aiTitle: 'Final Check & AI Advice',
    aiDescription: 'Packed everything? Take a photo and our AI will spot missing items and give local tips.',
    aiStart: 'Start AI Smart Check',
    analysisError: 'Analysis failed. Please check connection and try again.',
    navDest: 'Dest',
    navInfo: 'Info',
    navCheck: 'List',
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
      const merged = [...migrated];
      INITIAL_CHECKLIST.forEach(initialItem => {
        const existing = merged.find(i => i.id === initialItem.id);
        if (!existing) {
          merged.push({ ...initialItem });
        } else {
          // Sync missing fields like nameEn
          if (!existing.nameEn) {
            existing.nameEn = initialItem.nameEn;
          }
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

  const resetChecklist = () => {
    if (confirm(t.resetChecklist)) {
      setChecklist(INITIAL_CHECKLIST.map(item => ({ ...item })));
    }
  };

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
    { id: '필수', labelSize: 'text-[14px]', label: t.catEssential, icon: '⭐', bg: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-100', active: 'bg-pink-400 text-white border-pink-400', shadow: 'shadow-pink-100' },
    { id: '전자기기', labelSize: 'text-[13px]', label: t.catElectronics, icon: '🔌', bg: 'bg-sky-50', text: 'text-sky-500', border: 'border-sky-100', active: 'bg-sky-300 text-white border-sky-300', shadow: 'shadow-sky-100' },
    { id: '의류', labelSize: 'text-[14px]', label: t.catClothes, icon: '👕', bg: 'bg-indigo-50', text: 'text-indigo-500', border: 'border-indigo-100', active: 'bg-indigo-300 text-white border-indigo-300', shadow: 'shadow-indigo-100' },
    { id: '세면/위생', labelSize: 'text-[12px]', label: t.catToiletries, icon: '🧼', bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-100', active: 'bg-emerald-300 text-white border-emerald-300', shadow: 'shadow-emerald-100' },
    { id: '식량/상비약', labelSize: 'text-[12px]', label: t.catFood, icon: '💊', bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100', active: 'bg-orange-300 text-white border-orange-300', shadow: 'shadow-orange-100' },
    { id: '기타', labelSize: 'text-[14px]', label: t.catOthers, icon: '🎒', bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100', active: 'bg-slate-400 text-white border-slate-400', shadow: 'shadow-slate-100' }
  ];

  const renderChecklistUI = () => (
    <div className="space-y-6">
      <div className="bg-white px-5 py-4 rounded-[2rem] border border-slate-100 shadow-sm mt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            📋 {t.checklist}
          </h2>
          <button 
            onClick={resetChecklist}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-400 rounded-full hover:text-rose-500 transition-all border border-slate-100 group active:scale-95"
            title={t.resetBtn}
          >
            <RotateCcw size={12} className="group-active:rotate-[-120deg] transition-transform duration-500" />
            <span className="text-[10px] font-bold">{t.resetBtn}</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 rounded-full border border-emerald-100">
          <span className="text-emerald-600 font-extrabold text-sm">
            {checklist.filter(i => i.completed).length}
          </span>
          <span className="text-emerald-300 font-bold text-[10px]">/ {checklist.length}</span>
          <span className="text-emerald-600 font-black text-[10px] ml-0.5">{t.done}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-1">
        {checklistCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedChecklistCategory(cat.id)}
            className={`flex flex-col items-center gap-2 py-4 rounded-3xl border transition-all ${
              selectedChecklistCategory === cat.id
                ? `${cat.active} shadow-lg scale-95`
                : `${cat.bg} ${cat.text} ${cat.border} shadow-sm active:scale-95`
            }`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className={`${cat.labelSize ? cat.labelSize.replace('text-[', 'text-[').replace('px]', 'px]') : 'text-[14px]'} font-black tracking-tight leading-none text-center ${
              selectedChecklistCategory === cat.id ? 'text-white' : ''
            }`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedChecklistCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 px-2 pt-4">
              <div className="w-1.5 h-5 bg-slate-900 rounded-full" />
              <h3 className="text-lg font-black text-slate-800">
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

            <div className="grid gap-3">
              {checklist.filter(item => item.category === selectedChecklistCategory).length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-4 bg-white rounded-[1.5rem] border border-dashed border-slate-100">
                  <span className="text-4xl opacity-20">📭</span>
                  <p className="text-xs font-bold text-slate-300">{t.noItemsInCategory}</p>
                  <button 
                    onClick={resetChecklist}
                    className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline"
                  >
                    {lang === 'ko' ? '기본 목록으로 복구' : 'Recover Default List'}
                  </button>
                </div>
              ) : (
                checklist.filter(item => item.category === selectedChecklistCategory).map(item => (
                  <div key={item.id} className="group relative">
                    <button
                      onClick={() => toggleCheck(item.id)}
                      className={`w-full flex items-center gap-4 py-4 px-5 rounded-3xl transition-all border ${
                        item.completed 
                        ? 'bg-slate-50 border-slate-100 opacity-40 shadow-none' 
                        : 'bg-white border-slate-50 shadow-sm hover:border-slate-200 active:scale-[0.98]'
                      }`}
                    >
                      <div className="shrink-0 flex items-center gap-4">
                        <div className="relative">
                          {item.completed ? (
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 animate-in zoom-in duration-300">
                              <CheckCircle2 size={16} className="text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-indigo-200 bg-white" />
                          )}
                        </div>
                        <div className={`p-2 rounded-xl flex items-center justify-center bg-indigo-50/50`}>
                          <span className={`text-xl transition-all ${item.completed ? 'opacity-10 grayscale' : ''}`}>
                            {item.icon}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-start justify-center overflow-hidden">
                        <span className={`text-[16px] text-left truncate w-full ${item.completed ? 'line-through text-slate-400 font-medium' : 'font-bold text-slate-800'}`}>
                          {lang === 'ko' ? item.name : (item.nameEn || item.name)}
                        </span>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => removeItem(item.id, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-rose-300 hover:text-rose-500 active:scale-90"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))
              )}

              
              <button 
                onClick={() => setActiveCategoryInput(selectedChecklistCategory)}
                className="w-full py-5 bg-blue-400 text-white rounded-[2rem] flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-500 transition-all active:scale-95 mt-2"
              >
                <Plus size={20} /> <span className="font-bold">{t.addItem}</span>
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

      <div className="pt-10 mb-12">
        <div className="relative glass bg-[#F3E5F5]/30 p-8 rounded-[3rem] border border-fuchsia-100 flex flex-col items-center gap-6 shadow-sm text-center overflow-hidden">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-fuchsia-200/30 blur-2xl rounded-full" />
          <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-sm relative z-10">
            <Camera size={36} className="text-fuchsia-400" />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-black text-slate-800">{t.aiTitle}</h4>
            <p className="text-[13px] text-slate-500 mt-2 leading-relaxed whitespace-pre-line">
              {t.aiDescription}
            </p>
          </div>
          <label className="w-full relative z-10 py-5 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-[2rem] text-sm font-black cursor-pointer transition-all hover:opacity-90 active:scale-95 shadow-xl shadow-fuchsia-100/50 flex items-center justify-center gap-2 group">
            <Zap size={18} className="group-hover:animate-pulse shrink-0" />
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
    { name: 'North America', icon: '🏔️', label: t.northAmerica, color: 'bg-rose-500', textColor: 'text-rose-700', pastel: 'bg-rose-50', border: 'border-rose-200' },
    { name: 'Oceania', icon: '🏝️', label: t.oceania, color: 'bg-teal-500', textColor: 'text-teal-700', pastel: 'bg-teal-50', border: 'border-teal-200' }
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto relative overflow-hidden flex flex-col bg-[#FDFCFB]">
      {/* Removed background decor circles */}

      {/* Header */}
      <header className="relative z-10 px-6 py-8 flex justify-between items-center text-slate-800">
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
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-800">GlobalTrip</h1>
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

      <main className="relative z-10 flex-1 px-6 pb-24 text-slate-800">
        <AnimatePresence mode="wait">
          {view === 'countries' && (
            <motion.div
              key="countries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Destinations Section */}
              <section>
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">{t.destinations}</h2>
                  <Globe size={20} className="text-slate-300" />
                </div>
                
                {/* Region Icons Container */}
                <div className="grid grid-cols-5 gap-2">
                  {regionData.map((region) => (
                    <button
                      key={region.name}
                      type="button"
                      onClick={() => setSelectedRegion(selectedRegion === region.name ? 'All' : region.name)}
                      className={`flex flex-col items-center gap-3 py-5 rounded-3xl border-2 transition-all active:scale-95 ${region.pastel} ${
                        selectedRegion === region.name
                          ? 'shadow-lg -translate-y-1.5 border-slate-800'
                          : `${region.border} shadow-sm`
                      }`}
                    >
                      <span className="text-3xl">{region.icon}</span>
                      <span className={`text-[13px] font-black uppercase tracking-tight ${region.textColor} opacity-100`}>
                        {region.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Conditional Country Grid */}
                <div className="mt-6 min-h-[100px]">
                  <AnimatePresence mode="wait">
                    {selectedRegion === 'All' ? (
                      <motion.div
                        key="region-prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-[2rem] p-8 text-center border-2 border-dashed border-slate-200 shadow-inner"
                      >
                        <p className="text-[14px] font-black text-slate-800 whitespace-pre-line leading-relaxed">{t.regionPrompt}</p>
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
              </section>

              {/* Checklist Section */}
              <div className="pt-4">
                {renderChecklistUI()}
              </div>

              {/* AI Check Promo Card */}
              <div className="pt-8 mt-8 border-t border-slate-100">
                <div className="relative glass bg-[#F3E5F5]/30 p-8 rounded-[3rem] border border-fuchsia-100 flex flex-col items-center gap-6 shadow-sm text-center overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-fuchsia-200/30 blur-2xl rounded-full" />
                  
                  <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-sm relative z-10">
                    <Camera size={36} className="text-fuchsia-400" />
                  </div>
                  
                  <div className="relative z-10">
                    <h4 className="text-xl font-black text-slate-800">{t.aiTitle}</h4>
                    <p className="text-[13px] text-slate-500 mt-2 leading-relaxed whitespace-pre-line">
                      {t.aiDescription}
                    </p>
                  </div>

                  <label className="w-full relative z-10 py-5 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-[2rem] text-sm font-black cursor-pointer transition-all hover:opacity-90 active:scale-95 shadow-xl shadow-fuchsia-100/50 flex items-center justify-center gap-2 group">
                    <Zap size={18} className="group-hover:animate-pulse shrink-0" />
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
            </motion.div>
          )}

          {view === 'details' && selectedCountry && (
            <motion.div
              key="details"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="text-center py-6">
                <div className="text-7xl mb-4 drop-shadow-sm">{selectedCountry.emoji}</div>
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

              {/* Integrated Checklist Section */}
              <div className="mt-6">
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

      {/* Navigation Rail / Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/70 backdrop-blur-xl border-t border-slate-50 px-8 py-5 z-50 flex justify-around items-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setView('countries')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'countries' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}
          id="nav-countries"
        >
          <Globe size={22} strokeWidth={view === 'countries' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">{t.navDest}</span>
        </button>
        <button 
          onClick={() => selectedCountry && setView('details')}
          disabled={!selectedCountry}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'details' ? 'text-slate-900 scale-110' : 'text-slate-300'} ${!selectedCountry ? 'opacity-20' : ''}`}
          id="nav-details"
        >
          <Briefcase size={22} strokeWidth={view === 'details' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">{t.navInfo}</span>
        </button>
        <button 
          onClick={() => setView('checklist')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'checklist' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}
          id="nav-checklist"
        >
          <ShieldCheck size={22} strokeWidth={view === 'checklist' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">{t.navCheck}</span>
        </button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
