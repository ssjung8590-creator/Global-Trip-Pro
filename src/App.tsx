/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X
} from 'lucide-react';
import { COUNTRIES, INITIAL_CHECKLIST } from './constants';
import { AppView, CountryInfo, ChecklistItem } from './types';
import { analyzeChecklist } from './services/geminiService';

export default function App() {
  const [view, setView] = useState<AppView>('countries');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ missingItems: string[]; suggestions: string } | null>(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);

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
          <button className="p-2 bg-white/40 rounded-full border border-slate-100 shadow-sm" id="settings">
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
              </div>

              <div className="grid gap-4">
                {COUNTRIES.map((country, idx) => (
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
                      <p className="text-sm text-slate-400">{country.nameEn}</p>
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

              {/* Weather & Voltage Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass bg-sky-50/60 p-6 rounded-[2.5rem] aspect-square flex flex-col justify-between shadow-sm">
                  <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
                    <CloudSun size={28} className="text-sky-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-sky-600/60 font-bold mb-1">현지 날씨</h4>
                    <p className="text-sm font-bold text-sky-900 line-clamp-2">{selectedCountry.weatherSummary}</p>
                  </div>
                </div>

                <div className="glass bg-amber-50/60 p-6 rounded-[2.5rem] aspect-square flex flex-col justify-between shadow-sm">
                  <div className="p-3 bg-white rounded-2xl w-fit shadow-sm">
                    <Zap size={28} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-amber-600/60 font-bold mb-1">사용 전압</h4>
                    <p className="text-2xl font-bold text-amber-900">{selectedCountry.voltage}</p>
                    <p className="text-[9px] text-amber-900/40 uppercase tracking-tighter mt-1">{selectedCountry.plugType}</p>
                  </div>
                </div>
              </div>

              <div className="glass bg-white/70 p-6 rounded-[2.5rem] overflow-hidden relative shadow-sm border-slate-50">
                <div className="absolute right-[-10%] top-[-10%] p-4 opacity-[0.03] text-slate-900">
                  <Globe size={180} />
                </div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">준비물 가이드</h4>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Zap size={28} className="text-indigo-400" />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-bold text-indigo-600">{selectedCountry.voltage}</span>와 <span className="font-bold text-indigo-600">{selectedCountry.plugType}</span>를 지원하는 범용 변환 어댑터가 필수입니다.
                  </p>
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
                {Array.from(new Set(checklist.map(i => i.category))).map(category => {
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
