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
  AlertCircle,
  X,
  Coins
} from 'lucide-react';
import { COUNTRIES, INITIAL_CHECKLIST } from './constants';
import { AppView, CountryInfo, ChecklistItem } from './types';
import { analyzeChecklist } from './services/geminiService';

export default function App() {
  const [view, setView] = useState<AppView>('countries');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  
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

  useEffect(() => {
    localStorage.setItem('tripChecklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('emergencyPhone', emergencyPhone);
  }, [emergencyPhone]);

  useEffect(() => {
    localStorage.setItem('passportRef', passportRef);
  }, [passportRef]);

  const resetChecklist = () => {
    if (confirm('모든 체크리스트 진행 상황을 초기화할까요?')) {
      setChecklist(INITIAL_CHECKLIST);
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

  const filteredCountries = COUNTRIES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = [
    { name: 'All', icon: '🌎', label: '전체' },
    { name: 'Asia', icon: '🌏', label: '아시아' },
    { name: 'Europe', icon: '🌍', label: '유럽' },
    { name: 'North America', icon: '🏔️', label: '북미' },
    { name: 'Oceania', icon: '🏝️', label: '대양주' }
  ];

  const handleCountrySelect = (country: CountryInfo) => {
    setSelectedCountry(country);
    setView('details');
  };

  const currentCategoryCount = (category: string) => {
    const items = checklist.filter(i => i.category === category);
    const completed = items.filter(i => i.completed).length;
    return `${completed}/${items.length}`;
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
          const result = await analyzeChecklist(base64Content, file.type, checklist);
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

  return (
    <div className="min-h-screen max-w-md mx-auto relative overflow-hidden flex flex-col bg-[#FDFCFB]">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-blue-100/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-rose-100/50 blur-[120px] rounded-full" />
      </div>

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
          {view === 'details' && (
            <button 
              onClick={() => setView('checklist')}
              className="p-2 bg-white/40 rounded-full hover:bg-white/80 transition-all border border-slate-100 shadow-sm"
              id="checklist-nav"
            >
              <ShieldCheck size={20} className="text-emerald-500" />
            </button>
          )}
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
              className="space-y-6"
            >
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">출장 목적지 선택</span>
                <h2 className="text-2xl font-bold mt-1 text-slate-800">곧 떠날 국가를<br />선택해주세요</h2>
                
                <div className="mt-6 relative">
                  <input 
                    type="text"
                    placeholder="국가 이름 검색..."
                    className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:border-blue-200 transition-all text-sm font-semibold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Region Selector */}
                <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {regions.map((region) => (
                    <button
                      key={region.name}
                      onClick={() => setSelectedRegion(region.name)}
                      className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border transition-all shrink-0 ${
                        selectedRegion === region.name
                          ? 'bg-slate-900 border-slate-900 shadow-lg shadow-slate-200 -translate-y-1'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-xl">{region.icon}</span>
                      <span className={`text-[10px] font-black uppercase tracking-tight ${
                        selectedRegion === region.name ? 'text-white' : 'text-slate-900/40'
                      }`}>
                        {region.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {filteredCountries.map((country, idx) => (
                  <button
                    key={country.id}
                    onClick={() => handleCountrySelect(country)}
                    className={`glass p-5 rounded-[2.5rem] flex items-center gap-4 card-hover text-left shadow-sm ${
                      idx % 4 === 0 ? 'bg-blue-50/50' : 
                      idx % 4 === 1 ? 'bg-emerald-50/50' : 
                      idx % 4 === 2 ? 'bg-amber-50/50' : 'bg-purple-50/50'
                    }`}
                    id={`country-${country.id}`}
                  >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-3xl shadow-sm">
                      {country.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800">{country.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-400">{country.nameEn}</p>
                        <span className="text-[10px] bg-white/60 px-2 py-0.5 rounded-full text-slate-400 font-bold border border-slate-100 italic">
                          {country.currency.symbol}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-200" />
                  </button>
                ))}
              </div>

              <div className="mt-12 glass p-6 rounded-[2rem] bg-amber-50/50 border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Info size={18} className="text-amber-600" />
                  </div>
                  <span className="font-bold text-sm text-amber-900">출장 준비 팁</span>
                </div>
                <p className="text-sm text-amber-800/70 leading-relaxed">
                  항공권 예약 시 출장 증명서를 지참하시면 추가 수하물 혜택을 받을 수 있는 항공사가 많습니다. 확인해 보세요!
                </p>
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
                <h2 className="text-3xl font-display font-bold text-slate-800">{selectedCountry.name}</h2>
                <p className="text-slate-400">{selectedCountry.nameEn}</p>
              </div>

              {/* Weather, Voltage & Info Cards */}
              <div className="space-y-4">
                {/* Weather Forecast Card */}
                <div className="glass bg-sky-50/60 p-6 rounded-[2.5rem] shadow-sm border border-sky-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <CloudSun size={28} className="text-sky-500" />
                      </div>
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-sky-600/60 font-bold mb-0.5">현지 날씨</h4>
                        <p className="text-sm font-bold text-sky-900 leading-snug">{selectedCountry.weatherSummary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 bg-white/40 p-3 rounded-[1.5rem] border border-sky-100/50">
                    {selectedCountry.forecast.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 py-2">
                        <span className="text-[10px] font-bold text-sky-400">{day.day}</span>
                        <span className="text-xl">{day.condition}</span>
                        <span className="text-[11px] font-black text-sky-900">{day.temp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass bg-amber-50/60 p-6 rounded-[2.5rem] aspect-square flex flex-col justify-between shadow-sm border border-amber-100">
                    <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
                      <Zap size={28} className="text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-amber-600/60 font-bold mb-1">사용 전압</h4>
                      <p className="text-2xl font-bold text-amber-900">{selectedCountry.voltage}</p>
                      <p className="text-[10px] text-amber-900/50 font-medium leading-tight mt-1">{selectedCountry.plugType}</p>
                    </div>
                  </div>

                  <div className="glass bg-emerald-50/60 p-6 rounded-[2.5rem] aspect-square flex flex-col justify-between shadow-sm border border-emerald-100">
                    <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
                      <Coins size={28} className="text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-emerald-600/60 font-bold mb-1">현지 통화</h4>
                      <p className="text-2xl font-bold text-emerald-900">{selectedCountry.currency.symbol}</p>
                      <p className="text-[10px] text-emerald-900/50 font-medium leading-tight mt-1">{selectedCountry.currency.code}</p>
                    </div>
                  </div>
                </div>

                <div className="glass bg-indigo-50/60 p-6 rounded-[2rem] flex items-center justify-between shadow-sm border border-indigo-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                      <ShieldCheck size={24} className="text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-indigo-600/60 font-bold mb-0.5">준비 가이드</h4>
                      <p className="text-[11px] font-bold text-indigo-900">범용 멀티 어댑터와 현지 화폐 환전이 필요할 수 있습니다.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setView('checklist')}
                className="w-full py-5 bg-slate-900 text-white font-bold rounded-[2rem] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                id="start-checklist"
              >
                체크리스트 열기 <ChevronRight size={20} />
              </button>
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
              <div className="flex items-end justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">마이 리스트</span>
                  <h2 className="text-2xl font-bold mt-1 text-slate-800">준비물 체크</h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm text-xs border border-slate-50">
                  <span className="text-emerald-500 font-extrabold text-sm">
                    {checklist.filter(i => i.completed).length}
                  </span>
                  <span className="text-slate-300 font-medium italic">/ {checklist.length}</span>
                </div>
              </div>

              {/* Progress Summary Section */}
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                {['필수', '전자기기', '의류', '세면/위생', '식량/상비약'].map((cat, idx) => {
                  const colors = [
                    'bg-rose-50 text-rose-600',
                    'bg-blue-50 text-blue-600',
                    'bg-slate-50 text-slate-600',
                    'bg-emerald-50 text-emerald-600',
                    'bg-amber-50 text-amber-600'
                  ];
                  return (
                    <div key={cat} className={`glass px-5 py-2.5 rounded-2xl whitespace-nowrap flex items-center gap-2 shadow-sm ${colors[idx % colors.length]}`}>
                      <span className="text-[10px] font-bold uppercase opacity-60">{cat}</span>
                      <span className="text-xs font-black">{currentCategoryCount(cat)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-10">
                {Array.from(new Set(checklist.map(i => i.category))).map((category: string) => {
                  const categoryIcons: Record<string, string> = {
                    '필수': '⭐',
                    '전자기기': '🔌',
                    '의류': '👕',
                    '세면/위생': '🧼',
                    '식량/상비약': '💊',
                    '기타/가방': '🎒'
                  };

                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-3 pl-2">
                        <span className="text-2xl">{categoryIcons[category] || '📦'}</span>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                          {category}
                        </h3>
                      </div>
                      <div className="grid gap-3">
                        {checklist.filter(item => item.category === category).map(item => (
                          <div key={item.id} className="group relative">
                            <button
                              onClick={() => toggleCheck(item.id)}
                              className={`w-full flex items-center gap-4 py-4.5 px-5 rounded-[1.5rem] transition-all border ${
                                item.completed 
                                ? 'bg-slate-50 border-slate-100 opacity-40 shadow-none' 
                                : 'bg-white border-slate-50 shadow-sm hover:border-slate-200'
                              }`}
                              id={`item-${item.id}`}
                            >
                              <div className={`shrink-0 transition-all ${item.completed ? 'scale-90 opacity-50' : 'scale-100'} flex items-center gap-3`}>
                                {item.completed ? (
                                  <CheckCircle2 size={24} className="text-emerald-500" />
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <Circle size={24} className="text-slate-200" />
                                    <span className="text-xl">{item.icon}</span>
                                  </div>
                                )}
                              </div>
                              <span className={`text-[15px] flex-1 text-left ${item.completed ? 'line-through text-slate-400' : 'font-semibold text-slate-700'}`}>
                                {item.name}
                              </span>
                            </button>
                            <button 
                              onClick={(e) => removeItem(item.id, e)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                        
                        {activeCategoryInput === category ? (
                          <div className="flex gap-2 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-top-2">
                            <input 
                              autoFocus
                              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none font-medium"
                              placeholder="새 준비물 입력..."
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addItem(newItemName, category);
                                  setNewItemName('');
                                  setActiveCategoryInput(null);
                                }
                                if (e.key === 'Escape') setActiveCategoryInput(null);
                              }}
                            />
                            <button 
                              onClick={() => {
                                addItem(newItemName, category);
                                setNewItemName('');
                                setActiveCategoryInput(null);
                              }}
                              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                            >
                              추가
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setActiveCategoryInput(category)}
                            className="w-full py-3 border-2 border-dashed border-slate-100 rounded-[1.5rem] flex items-center justify-center gap-2 text-slate-300 hover:text-slate-400 hover:border-slate-200 transition-all text-xs font-bold"
                          >
                            + 항목 추가
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-10 mb-12">
                <div className="relative glass bg-[#F3E5F5]/30 p-8 rounded-[3rem] border border-fuchsia-100 flex flex-col items-center gap-6 shadow-sm text-center overflow-hidden">
                  {/* Decorative AI Sparkle */}
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-fuchsia-200/30 blur-2xl rounded-full" />
                  
                  <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-sm relative z-10">
                    <Camera size={36} className="text-fuchsia-400" />
                  </div>
                  
                  <div className="relative z-10">
                    <h4 className="text-xl font-black text-slate-800">최종 점검 & AI 조언</h4>
                    <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                      짐을 다 싸셨나요? <br />
                      사진 한 장이면 <span className="text-fuchsia-600 font-bold">AI 전문가</span>가 <br />
                      빠진 물건과 현지 팁을 조언해드립니다.
                    </p>
                  </div>

                  <label className="w-full relative z-10 py-5 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-[2rem] text-sm font-black cursor-pointer transition-all hover:opacity-90 active:scale-95 shadow-xl shadow-fuchsia-100/50 flex items-center justify-center gap-2 group">
                    <Zap size={18} className="group-hover:animate-pulse shrink-0" />
                    AI 스마트 점검 시작
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
          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">앱 설정</span>
                <h2 className="text-2xl font-bold mt-1 text-slate-800">도움이 되는 정보</h2>
              </div>

              <div className="space-y-6">
                {/* Emergency Info section */}
                <div className="glass bg-rose-50/50 p-6 rounded-[2.5rem] border border-rose-100 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <AlertCircle size={18} className="text-rose-600" />
                    </div>
                    <span className="font-bold text-sm text-rose-900">비상 연락망 & 정보</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest pl-1">비상 연락처</label>
                      <input 
                        className="w-full bg-white/60 border border-rose-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white transition-all"
                        placeholder="예: 010-0000-0000"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest pl-1">여권 번호 (참고용)</label>
                      <input 
                        className="w-full bg-white/60 border border-rose-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white transition-all"
                        placeholder="예: M12345678"
                        value={passportRef}
                        onChange={(e) => setPassportRef(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-rose-400 mt-2 px-1">
                    * 위 정보는 브라우저에만 안전하게 저장되며 서버로 전송되지 않습니다.
                  </p>
                </div>

                {/* Checklist Control */}
                <div className="glass bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">데이터 관리</h4>
                  <button 
                    onClick={resetChecklist}
                    className="w-full py-4 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                  >
                    체크리스트 초기화하기
                  </button>
                </div>

                {/* Helpful Links/Info */}
                <div className="glass bg-blue-50/50 p-6 rounded-[2.5rem] border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-900 mb-4">해외 출장 필수 링크</h4>
                  <div className="grid gap-2">
                    {[
                      { name: '외교부 해외안전여행', url: 'https://www.0404.go.kr' },
                      { name: '인천공항 운항현황', url: 'https://www.airport.kr' },
                      { name: '세계 기상 기구', url: 'https://worldweather.wmo.int' }
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
                    앱으로 사용하기 (설치 방법)
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-white/60 p-4 rounded-2xl text-[11px] leading-relaxed text-slate-600">
                      <p className="font-bold text-slate-800 mb-2">iPhone (Safari)</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>하단 중앙의 [공유] 아이콘을 누르세요.</li>
                        <li>스크롤을 내려 [홈 화면에 추가]를 선택하세요.</li>
                      </ol>
                    </div>
                    <div className="bg-white/60 p-4 rounded-2xl text-[11px] leading-relaxed text-slate-600">
                      <p className="font-bold text-slate-800 mb-2">Android (Chrome)</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>우측 상단의 점 3개 아이콘을 누르세요.</li>
                        <li>[홈 화면에 추가] 또는 [앱 설치]를 선택하세요.</li>
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
                <h3 className="text-xl font-bold font-display text-slate-800">AI 분석 리포트</h3>
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
                  <p className="text-sm font-bold text-slate-500 animate-pulse">이미지를 꼼꼼하게 대조 중입니다...</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-8">
                  {analysisResult.missingItems.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-amber-500 bg-amber-50 p-4 rounded-2xl">
                        <AlertCircle size={22} className="shrink-0" />
                        <span className="text-sm font-black italic">! 누락 품목 의심 리스트</span>
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
                        <p className="text-lg font-bold text-emerald-900">완벽한 준비!</p>
                        <p className="text-xs text-emerald-700/60 mt-1">AI가 분석한 결과, 모든 품목이 잘 챙겨진 것 같습니다.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">전문가의 조언</h4>
                    <div className="bg-slate-50/50 p-5 rounded-2xl text-[14px] leading-relaxed text-slate-600 font-medium">
                      {analysisResult.suggestions}
                    </div>
                  </div>

                  <button 
                    onClick={() => setAnalysisModalOpen(false)}
                    className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl mt-4 shadow-xl shadow-slate-100 transition-all hover:bg-slate-800"
                  >
                    확인
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-300">
                  <Info size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">분석 중 오류가 발생했습니다.<br /><span className="text-xs font-medium">네트워크 상태를 확인 후 다시 시도해주세요.</span></p>
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
          <span className="text-[9px] font-black uppercase tracking-widest">Dest</span>
        </button>
        <button 
          onClick={() => selectedCountry && setView('details')}
          disabled={!selectedCountry}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'details' ? 'text-slate-900 scale-110' : 'text-slate-300'} ${!selectedCountry ? 'opacity-20' : ''}`}
          id="nav-details"
        >
          <Briefcase size={22} strokeWidth={view === 'details' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Info</span>
        </button>
        <button 
          onClick={() => setView('checklist')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'checklist' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}
          id="nav-checklist"
        >
          <ShieldCheck size={22} strokeWidth={view === 'checklist' ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">List</span>
        </button>
      </nav>

      {/* Styles for scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
