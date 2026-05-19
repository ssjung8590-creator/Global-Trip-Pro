import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  ClipboardCheck, 
  Settings as SettingsIcon, 
  ChevronRight, 
  ArrowLeft,
  RotateCcw,
  Trash2,
  Plus,
  X,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
  Bell,
  Vibrate,
  Moon,
  ExternalLink,
  Sparkles,
  Camera,
  Loader2,
  ArrowDown,
  TrendingUp
} from 'lucide-react';
import { REGIONS, COUNTRIES, CHECKLIST, UI_STRINGS } from './constants';
import { Language, AppView } from './types';
import { analyzeChecklist } from './services/geminiService';

/* ── ATOMS ─────────────────────────────────────────── */
function Orbs({ accent, n = 4 }: { accent: string; n?: number }) {
  const pts = [
    { w: 130, top: "8%", right: "4%", op: 0.15 },
    { w: 90, top: "38%", right: "58%", op: 0.09 },
    { w: 70, top: "62%", right: "10%", op: 0.17 },
    { w: 100, top: "18%", right: "28%", op: 0.07 }
  ];
  return (
    <>
      {pts.slice(0, n).map((o, i) => (
        <div 
          key={i} 
          style={{ 
            position: "absolute", 
            width: o.w, 
            height: o.w, 
            borderRadius: "50%", 
            background: accent, 
            opacity: o.op, 
            top: o.top, 
            right: o.right, 
            filter: "blur(26px)", 
            pointerEvents: "none" 
          }} 
        />
      ))}
    </>
  );
}

const glassStyle = (accent?: string) => ({
  background: accent ? `${accent}12` : "var(--glass-bg)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: `1px solid ${accent ? accent + "28" : "var(--glass-border)"}`,
  borderRadius: 22,
});

function Divider() { 
  return <div style={{ height: "0.5px", background: "var(--glass-border)", marginLeft: 20, opacity: 0.5 }} />; 
}

/* ── HOME ───────────────────────────────────────────── */
function HomeScreen({ onSelectRegion, lang }: { onSelectRegion: (region: any) => void; lang: string }) {
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;
  return (
    <div className="animate-slide-up font-sans pb-2">
      <div className="px-5 pt-1 pb-4">
        <h1 className="font-display text-[26px] md:text-[28px] font-extrabold tracking-[-0.04em] leading-[1.1] mb-2 bg-gradient-to-br from-white via-white/80 to-white/60 bg-clip-text text-transparent">
          {t.whereTo}
        </h1>
        <p className="text-[13px] md:text-[14px] text-white/50 font-medium tracking-tight leading-relaxed max-w-[90%]">{t.regionSelectDesc}</p>
      </div>
      
      <div className="px-4 grid grid-cols-2 gap-4">
        {REGIONS.map((r, i) => (
          <div 
            key={r.id} 
            onClick={() => onSelectRegion(r)}
            className="relative overflow-hidden cursor-pointer border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] active:scale-95 transition-all animate-scale-in h-[165px]"
            style={{ 
              borderRadius: 32, 
              animationDelay: `${i * 0.07}s`
            }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${r.imageUrl})` }}
            />
            {/* Gradient Overlay for labels */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
            
            <div className="absolute top-4 left-4">
              <p className="text-[10px] font-black tracking-[1.5px] uppercase mb-1" style={{ color: r.accent }}>
                {lang === 'en' ? r.descEn : r.desc}
              </p>
              <h3 className="font-display text-[22px] font-black text-white tracking-[-0.5px] leading-tight drop-shadow-md">
                {lang === 'en' ? r.labelEn : r.label}
              </h3>
            </div>
            
            <div className="absolute bottom-4 left-4 text-[24px]">
              {r.emoji}
            </div>

            <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              <ChevronRight size={16} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── COUNTRY LIST ───────────────────────────────────── */
function CountryListScreen({ region, onSelectCountry, lang }: { region: any; onSelectCountry: (country: any) => void; lang: string }) {
  const countries = COUNTRIES.filter(c => c.region === region.id);
  const featured = countries[0];
  const rest = countries.slice(1);

  return (
    <div className="animate-slide-right font-sans px-4 pt-2 pb-10">
      {featured && (
        <div 
          onClick={() => onSelectCountry(featured)}
          className="relative h-[240px] rounded-[32px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] mb-6 animate-scale-in transition-all active:scale-[0.99] group"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-110"
            style={{ backgroundImage: `url(${featured.imageUrl})` }}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="font-display text-[34px] font-black tracking-[-1px] text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {featured.name} <span className="text-white/60 font-medium ml-1.5">({featured.nameEn})</span>
            </h2>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        {rest.map((c, i) => (
          <div 
            key={c.id} 
            onClick={() => onSelectCountry(c)}
            className="relative h-[120px] rounded-[24px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.4)] animate-slide-up transition-all active:scale-[0.97] group"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${c.imageUrl})` }}
            />
            {/* Overlay Gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
            
            <div className="absolute top-4.5 left-5 right-12">
              <h3 className="font-display text-[22px] font-black text-white tracking-[-0.5px] leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {c.name} <span className="text-white/60 font-medium ml-1">({c.nameEn})</span>
              </h3>
            </div>

            <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all group-hover:bg-white/20">
              <ChevronRight size={16} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── COUNTRY DETAIL ─────────────────────────────────── */
function CountryDetailScreen({ country: c, lang }: { country: any; lang: string }) {
  const [subTab, setSubTab] = useState<'weather' | 'finance' | 'entry'>('weather');
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;

  return (
    <div className="animate-slide-right font-sans pb-12">
      {/* Hero */}
      <div 
        className="mx-4 mt-2 mb-6 h-[240px] rounded-[36px] overflow-hidden relative border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] group-hover:scale-105"
          style={{ backgroundImage: `url(${c.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        
        <div className="absolute bottom-7 left-8 right-8">
          <h2 className="font-display text-[42px] font-black tracking-[-1.5px] text-white leading-tight drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
            {c.name} <span className="text-white/60 font-medium text-[28px] ml-2">({c.nameEn})</span>
          </h2>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="px-4 mb-6 flex gap-2">
        <button 
          onClick={() => setSubTab('weather')}
          className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-full border transition-all duration-300 font-bold text-[13px] ${
            subTab === 'weather' 
            ? 'bg-foreground/10 border-pink-500/50 text-[#D946EF] shadow-lg shadow-pink-500/20' 
            : 'bg-foreground/5 border-foreground/10 text-foreground/40'
          }`}
        >
          <span className="text-[14px]">☀️</span> {t.weather}
        </button>
        <button 
          onClick={() => setSubTab('finance')}
          className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-full border transition-all duration-300 font-bold text-[13px] ${
            subTab === 'finance' 
            ? 'bg-foreground/10 border-emerald-500/50 text-emerald-500 shadow-lg shadow-emerald-500/20' 
            : 'bg-foreground/5 border-foreground/10 text-foreground/40'
          }`}
        >
          <span className="text-[14px]">💸</span> {t.exchangeVoltage}
        </button>
        <button 
          onClick={() => setSubTab('entry')}
          className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-full border transition-all duration-300 font-bold text-[13px] ${
            subTab === 'entry' 
            ? 'bg-foreground/10 border-blue-500/50 text-blue-500 shadow-lg shadow-blue-500/20' 
            : 'bg-foreground/5 border-foreground/10 text-foreground/40'
          }`}
        >
          <span className="text-[14px]">🛡️</span> {t.entryProcedure}
        </button>
      </div>

      {/* Content based on subTab */}
      <div className="px-4 pb-12 overflow-hidden">
        {subTab === 'weather' && (
          <div className="flex flex-col gap-4 animate-slide-up">
            <WeatherPanel c={c} lang={lang} />
            <div className="bg-[#1A1A1E] border border-white/5 rounded-[28px] p-6 shadow-2xl">
              <p className="text-[11px] font-black text-foreground/40 tracking-[1.5px] uppercase mb-5">{t.weeklyForecast}</p>
              <div className="flex justify-between items-end gap-1">
                {c.week.map((day: any, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-2.5 flex-1">
                    <span className="text-[11px] font-bold text-foreground/40">{day.d}</span>
                    <span className="text-[24px] pointer-events-none drop-shadow-md">{day.i}</span>
                    <span className="text-[15px] font-black text-foreground">{day.t}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {subTab === 'finance' && (
          <div className="flex flex-col gap-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <VoltageCard c={c} lang={lang} />
              <CurrencyCard c={c} lang={lang} />
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[28px] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner">✅</div>
              <div>
                <p className="text-[14px] font-black text-emerald-500 uppercase tracking-tight">
                  {t.visaFree} {c.visaDays || (lang === 'ko' ? "90일" : "90 Days")}
                </p>
                <p className="text-[11px] text-emerald-500/60 font-bold">{t.koreanPassport}</p>
              </div>
            </div>

            <EntryPanel c={c} lang={lang} isCompact />
          </div>
        )}

        {subTab === 'entry' && (
          <div className="animate-slide-up">
            <EntryPanel c={c} lang={lang} />
          </div>
        )}
      </div>
    </div>
  );
}

function WeatherPanel({ c, lang }: { c: any; lang: string }) {
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;
  
  return (
    <div className="bg-[#1A1A1E] border border-white/5 rounded-[28px] p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="flex gap-5 items-start relative z-10">
        <div 
          className="w-16 h-16 rounded-[22px] flex-shrink-0 flex items-center justify-center text-[32px] shadow-lg border"
          style={{ background: `${c.accent}15`, borderColor: `${c.accent}25` }}
        >
          {c.weatherIcon}
        </div>
        <div className="pt-1">
          <p className="text-[11px] font-black tracking-[1.5px] uppercase mb-1.5" style={{ color: c.accent }}>{t.currentWeather}</p>
          <p className="text-[17px] font-bold text-foreground leading-[1.35] tracking-tight break-keep text-left">
            {lang === 'ko' ? c.weatherSummary : c.weatherSummaryEn}
          </p>
        </div>
      </div>
    </div>
  );
}

function VoltageCard({ c, lang }: { c: any; lang: string }) {
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;
  return (
    <div className="bg-[#1A000A] border border-[#FF5E5E20] rounded-[28px] p-6 flex flex-col gap-6 min-h-[180px] shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-[16px] bg-[#FF5E5E20] border border-[#FF5E5E30] flex items-center justify-center text-xl">⚡</div>
        <p className="text-[11px] font-black text-[#FF5E5E] tracking-[1px] uppercase">{t.voltageLabel}</p>
      </div>
      <div>
        <p className="text-[42px] font-black text-foreground tracking-tighter leading-none mb-1.5">{c.voltage}</p>
        <p className="text-[12px] text-foreground/40 font-bold leading-tight">
          {lang === 'ko' ? c.voltageType : c.voltageTypeEn || c.voltageType}
        </p>
      </div>
    </div>
  );
}

function CurrencyCard({ c, lang }: { c: any; lang: string }) {
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;
  return (
    <div className="bg-[#001A0D] border border-emerald-500/10 rounded-[28px] p-6 flex flex-col gap-6 min-h-[180px] shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-[16px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-xl font-bold">💰</div>
        <p className="text-[11px] font-black text-emerald-400 tracking-[1px] uppercase">{t.currencyLabel}</p>
      </div>
      <div>
        <p className="text-[34px] font-black text-foreground tracking-tight leading-none mb-1">
          {lang === 'ko' ? c.currency : c.currencyEn}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[14px] font-bold text-white/50">{`${c.currencySymbol} · ${c.currencyCode}`}</p>
          <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-2 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-emerald-400 font-black">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EntryPanel({ c, lang, isCompact }: { c: any; lang: string; isCompact?: boolean }) {
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;
  
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className={`rounded-[32px] p-7 shadow-2xl flex flex-col gap-7 transition-all duration-300 bg-[#1A1A1E] border border-white/5`}>
        <div className="flex gap-5 items-start">
          <div className="w-14 h-14 rounded-[22px] flex-shrink-0 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/5">🛡️</div>
          <div className="pt-1 flex-1">
            <p className="text-[11px] font-black text-purple-400 tracking-[1.5px] uppercase mb-2">{t.entryProcedure}</p>
            {!isCompact ? (
              <p className="text-[16px] font-bold text-foreground/90 leading-[1.55] tracking-tight break-keep">
                {lang === 'ko' ? c.entry : c.entryEn}
              </p>
            ) : (
               <p className="text-[14px] font-bold text-foreground/40 leading-tight">
                 {lang === 'ko' ? "상세 입국 규정 및 절차 확인하기" : "Check detailed entry rules & procedures"}
               </p>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => { if(c.entryUrl) window.open(c.entryUrl, "_blank"); }}
          className="w-full h-15 active:scale-[0.98] transition-all rounded-[22px] flex items-center justify-center gap-3 font-black text-[16px] bg-foreground/5 border border-foreground/10 text-foreground group"
        >
          <span className="group-hover:text-purple-400 transition-colors">{t.officialSite}</span>
          <ExternalLink size={18} className="text-foreground/30 group-hover:text-purple-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}



/* ── CHECKLIST ──────────────────────────────────────── */
function ChecklistScreen({ lang }: { lang: string }) {
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;
  const [activeCat, setActiveCat] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('tripReadyChecks');
    return saved ? JSON.parse(saved) : {};
  });
  const [customItems, setCustomItems] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('tripReadyCustoms');
    return saved ? JSON.parse(saved) : {};
  });
  const [removedItems, setRemovedItems] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('tripReadyRemoved');
    return saved ? JSON.parse(saved) : {};
  });
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    localStorage.setItem('tripReadyChecks', JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem('tripReadyCustoms', JSON.stringify(customItems));
  }, [customItems]);

  useEffect(() => {
    localStorage.setItem('tripReadyRemoved', JSON.stringify(removedItems));
  }, [removedItems]);

  const allDisplayItems = CHECKLIST.map(c => {
    const dItems = c.items.filter(item => !(removedItems[c.label] || []).includes(item));
    const cItems = customItems[c.label] || [];
    return { ...c, displayItems: [...dItems, ...cItems] };
  });

  const totalItems = allDisplayItems.reduce((a, cat) => a + cat.displayItems.length, 0);
  const totalDone = allDisplayItems.reduce((a, cat) => 
    a + cat.displayItems.filter(item => checked[`${cat.label}-${item}`]).length, 0
  );
  
  const toggle = (k: string) => setChecked(p => ({ ...p, [k]: !p[k] }));
  
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [adding]);

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    const catLabel = CHECKLIST[activeCat].label;
    setCustomItems(p => {
      const current = p[catLabel] || [];
      if (current.includes(trimmed)) return p; 
      return { ...p, [catLabel]: [...current, trimmed] };
    });
    setNewItem("");
    setAdding(false);
  };

  const removeItem = (item: string) => {
    const cat = CHECKLIST[activeCat];
    const key = `${cat.label}-${item}`;
    const isDefault = cat.items.includes(item);
    
    if (isDefault) {
      setRemovedItems(p => ({ ...p, [cat.label]: [...(p[cat.label] || []), item] }));
    } else {
      setCustomItems(p => ({ ...p, [cat.label]: (p[cat.label] || []).filter(x => x !== item) }));
    }

    setChecked(p => {
      const n = { ...p };
      delete n[key];
      return n;
    });
  };

  const handleReset = () => {
    // Instant reset as requested - totally silent
    setChecked({});
    setCustomItems({});
    setRemovedItems({});
    localStorage.removeItem('tripReadyChecks');
    localStorage.removeItem('tripReadyCustoms');
    localStorage.removeItem('tripReadyRemoved');
  };

  return (
    <div className="animate-slide-up font-sans px-5 pt-3 pb-8">
      {/* Header Card */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-5 mb-5 text-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[14px] bg-[#FFB000] flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">🧳</div>
            <div>
              <h1 className="text-[19px] font-black tracking-tight leading-none mb-1">{t.checklist}</h1>
              <p className="text-[12px] font-bold text-gray-400">{totalDone} / {totalItems} {lang === 'ko' ? '완료' : 'Done'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleReset}
            className="bg-[#FFF1F1] border border-[#FFE4E4] rounded-[14px] px-3.5 py-2 text-[#FF5252] text-[13px] font-black cursor-pointer active:scale-95 transition-all flex items-center gap-1"
          >
            <RotateCcw size={14} /> {t.reset}
          </button>
        </div>
        <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${totalItems > 0 ? (totalDone / totalItems) * 100 : 0}%` }}
            className="h-full bg-[#FFB000] rounded-full shadow-[0_0_10px_rgba(255,176,0,0.3)]"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {allDisplayItems.map((c, i) => {
          const on = activeCat === i;
          const tot = c.displayItems.length;

          return (
            <button 
              key={c.label}
              onClick={() => setActiveCat(i)}
              className={`flex flex-col items-center justify-center h-[105px] rounded-[24px] border transition-all duration-200 active:scale-95 ${on ? "shadow-lg shadow-black/5" : "bg-white border-gray-100"}`}
              style={{
                borderColor: on ? c.accent : "transparent",
                background: on ? c.accent : "white",
                color: on ? "white" : "inherit"
              }}
            >
              <span className={`text-[28px] mb-1.5 ${on ? "brightness-110" : ""}`} style={{ filter: on ? "drop-shadow(0 2px 8px rgba(0,0,0,0.2))" : "none" }}>{c.emoji}</span>
              <span className={`text-[12px] font-black leading-none mb-1 ${on ? "text-white" : "text-gray-900"}`}>{lang === 'en' ? c.labelEn : c.label}</span>
              <span className={`text-[11px] font-bold ${on ? "text-white/80" : "text-gray-300"}`}>{tot}개</span>
            </button>
          );
        })}
      </div>

      {/* Item List */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        {allDisplayItems[activeCat].displayItems.map((item, i, arr) => {
          const catLabel = allDisplayItems[activeCat].label;
          const key = `${catLabel}-${item}`;
          const isDone = checked[key];
          
          return (
            <div key={item}>
              <div 
                onClick={() => toggle(key)}
                className="flex items-center gap-4 px-6 py-4.5 cursor-pointer active:bg-gray-50 transition-colors"
                style={{ opacity: isDone ? 0.45 : 1 }}
              >
                <div 
                  className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center transition-all ${isDone ? "bg-[#FFB000] border-[#FFB000]" : "border-gray-200"}`}
                >
                  {isDone && <span className="text-white text-[12px] font-black">✓</span>}
                </div>
                <span className={`flex-1 text-[16px] font-bold tracking-tight text-gray-900 ${isDone ? "line-through text-gray-400" : ""}`}>
                  {item}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeItem(item); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-400 transition-all active:scale-90"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {i < arr.length - 1 && <div className="h-[1px] bg-gray-50 mx-6" />}
            </div>
          );
        })}

        <div className="p-4 border-t border-gray-50 bg-gray-50/30">
          {adding ? (
            <form 
              onSubmit={(e) => { e.preventDefault(); addItem(); }}
              className="flex gap-2"
            >
              <input 
                ref={inputRef}
                type="text"
                value={newItem} 
                onChange={e => setNewItem(e.target.value)}
                placeholder={t.enterItem}
                className="flex-1 bg-white border border-gray-300 rounded-[16px] px-4 py-3 text-[14px] outline-none font-bold text-gray-900 placeholder:text-gray-500"
              />
              <button 
                type="submit"
                className="bg-[#FFB000] rounded-[16px] px-5 py-3 text-white text-[13px] font-black cursor-pointer shadow-lg shadow-orange-500/10 active:scale-95 transition-all"
              >
                {t.add}
              </button>
              <button 
                type="button"
                onClick={() => { setAdding(false); setNewItem(""); }} 
                className="p-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setAdding(true)}
              className="w-full text-center py-2 text-[14px] font-black text-[#FFB000] cursor-pointer active:opacity-60 transition-all"
            >
              + {t.addCategoryItem}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── AI SCREEN ────────────────────────────────────────── */
function AIScreen({ lang }: { lang: string }) {
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ missingItems: string[]; suggestions: string } | null>(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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
          // Get current checklist from localStorage for context
          const savedChecks = localStorage.getItem('tripReadyChecks');
          const checked = savedChecks ? JSON.parse(savedChecks) : {};
          
          // Reconstruct checklist items for AI
          const currentItems = CHECKLIST.flatMap(c => (lang === 'en' ? c.itemsEn : c.items).map(name => ({
            id: name,
            name,
            nameEn: name,
            category: c.label,
            completed: !!checked[`${c.label}-${name}`]
          })));

          const result = await analyzeChecklist(base64Content, file.type, currentItems, lang as any);
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
    <div className="animate-slide-up font-sans px-4 pt-2.5 pb-8">
      <div className="px-1 pb-5">
        <p className="text-[11px] font-semibold text-foreground/28 tracking-[2px] uppercase mb-1.5">{t.aiSmartPacking}</p>
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.6px] bg-gradient-to-br from-foreground via-foreground/50 to-foreground/50 bg-clip-text text-transparent">{t.aiTitle}</h1>
      </div>

      <div className="relative bg-foreground/5 p-10 rounded-[3rem] border border-foreground/10 flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <button 
          onClick={() => {
            setShowGuide(true);
            setTimeout(() => setShowGuide(false), 3000);
          }}
          className="w-24 h-24 rounded-full bg-foreground/5 flex items-center justify-center relative z-10 shadow-sm border border-foreground/10 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-full border-2 border-foreground/5 flex items-center justify-center">
            <Camera size={36} className="text-[#D946EF]" />
          </div>
        </button>

        {showGuide && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-[135px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[#D946EF]"
            >
              <ArrowDown size={28} strokeWidth={3} />
            </motion.div>
            <div className="bg-[#D946EF] text-white px-4 py-2 rounded-full text-[13px] font-black shadow-lg shadow-purple-500/30">
              {lang === 'en' ? "Tap the button below to start!" : "아래 버튼을 눌러 점검을 시작하세요!"}
            </div>
          </motion.div>
        )}

        <div className="relative z-10 space-y-2">
          <h4 className="text-[22px] font-black text-foreground tracking-tight">{t.aiSub}</h4>
          <p className="text-[14px] text-foreground/40 font-bold leading-relaxed px-4 break-keep">
            {t.aiDesc}
          </p>
        </div>
        <label className="w-full relative z-10 py-5 bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-white rounded-full text-[16px] font-black cursor-pointer transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3">
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

      {analysisModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-background rounded-[2.5rem] p-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-foreground/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold font-display text-foreground">{t.aiReport}</h3>
              <button onClick={() => setAnalysisModalOpen(false)} className="p-2 bg-foreground/5 rounded-full text-foreground/40">
                <X size={20} />
              </button>
            </div>

            {isAnalyzing ? (
              <div className="py-16 flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl animate-pulse rounded-full" />
                  <Loader2 size={48} className="text-blue-400 animate-spin relative" />
                </div>
                <p className="text-sm font-bold text-foreground/50 animate-pulse">{t.aiAnalyzing}</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-8 text-foreground">
                {analysisResult.missingItems.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-amber-500 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                      <AlertCircle size={22} className="shrink-0" />
                      <span className="text-sm font-black italic">{t.aiMissingItems}</span>
                    </div>
                    <div className="flex flex-col gap-2 mx-auto max-w-[280px]">
                      {analysisResult.missingItems.map((item, idx) => (
                        <div key={idx} className="bg-foreground/5 px-4 py-2.5 rounded-xl text-xs font-semibold opacity-80 flex items-center gap-3 border border-foreground/5">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-emerald-400">{t.aiPerfect}</p>
                      <p className="text-xs text-emerald-400/60 mt-1">{t.aiPerfectDesc}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-foreground/40 tracking-[0.2em] text-center">{t.aiExpertAdvice}</h4>
                  <div className="bg-foreground/8 p-7 rounded-[2rem] text-[15px] leading-relaxed opacity-90 font-medium whitespace-pre-line break-keep text-center shadow-inner border border-foreground/5">
                    {analysisResult.suggestions}
                  </div>
                </div>

                <button 
                  onClick={() => setAnalysisModalOpen(false)}
                  className="w-full py-5 bg-foreground text-background font-bold rounded-2xl mt-4 shadow-xl shadow-black/20"
                >
                  {t.confirm}
                </button>
              </div>
            ) : (
              <div className="py-20 text-center text-foreground/30">
                <Info size={40} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold">{t.aiAnalysisFailed}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SETTINGS ───────────────────────────────────────── */
function SettingsScreen({ lang, setLang, theme, setTheme, visitedCount }: { lang: string; setLang: (l: string) => void; theme: string; setTheme: (t: string) => void; visitedCount: number }) {
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;
  const [notif, setNotif] = useState(true);
  const [haptic, setHaptic] = useState(true);

  const Tog = ({ on, toggle, accent = "#00E87A" }: { on: boolean; toggle: () => void; accent?: string }) => (
    <div 
      onClick={toggle}
      className={`w-[48px] h-[26px] rounded-[13px] cursor-pointer relative transition-all duration-200 flex-shrink-0 ${on ? "" : "bg-[#2A2A2E] border-white/5"}`}
      style={{
        background: on ? accent : "#2A2A2E",
        border: on ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div 
        className="absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all duration-200"
        style={{ 
          left: on ? "25px" : "4px",
          background: "#000",
        }}
      />
    </div>
  );

  const Row = ({ icon, ac, label, sub, right }: any) => (
    <div className="flex items-center gap-4 px-5 py-4">
      <div 
        className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-[20px] flex-shrink-0"
        style={{ background: `${ac}15`, border: `1px solid ${ac}30` }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[15px] font-bold text-white tracking-tight leading-none mb-1">{label}</p>
        {sub && <p className="text-[12px] text-white/40 font-medium tracking-tight">{sub}</p>}
      </div>
      {right}
    </div>
  );

  const Sep = () => <div className="h-[1px] bg-white/5 ml-[70px]" />;
  const Sec = ({ title, children }: any) => (
    <div className="mb-9 last:mb-4">
      <div className="flex items-center gap-3 px-1 mb-3.5">
        <div className="w-1 h-3.5 rounded-full bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
        <h3 className="text-[13.5px] font-black text-white/60 tracking-tight">
          {title}
        </h3>
      </div>
      <div className="bg-[#1A1A1E] border border-white/5 rounded-[32px] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.45)]">
        {children}
      </div>
    </div>
  );

  return (
    <div className="animate-slide-up font-sans px-5 pt-4 pb-12">
      <Sec title={t.language || "언어"}>
        <Row icon="🌐" ac="#3B82F6" label={t.language || "언어"} sub={t.languageDesc || "표시 언어를 선택하세요"} 
          right={
            <div className="flex gap-1.5 p-1 bg-black/40 rounded-[14px]">
              {["KO", "EN"].map(l => (
                <button 
                  key={l} 
                  onClick={() => setLang(l.toLowerCase())}
                  className={`px-3 py-1.5 rounded-[10px] text-[11px] font-black cursor-pointer transition-all ${lang.toUpperCase() === l ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20" : "text-white/30 hover:text-white/50"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          }
        />
      </Sec>

      <Sec title={lang === 'ko' ? "해외 출장 필수 링크" : "Essential Travel Links"}>
        {[
          { label: "외교부 해외안전여행", url: "https://www.0404.go.kr/", icon: "🛡️", ac: "#3B82F6" },
          { label: "인천공항 운항현황", url: "https://www.airport.kr/ap/ko/dep/depPassportMain.do", icon: "🛫", ac: "#10B981" },
          { label: "세계 기상 기구", url: "https://worldweather.wmo.int/en/home.html", icon: "🌤️", ac: "#F97316" }
        ].map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <div 
              onClick={() => window.open(item.url, '_blank')}
              className="cursor-pointer active:opacity-60 transition-opacity"
            >
              <Row 
                icon={item.icon} 
                ac={item.ac} 
                label={item.label} 
                right={<ChevronRight size={18} className="text-white/20" />} 
              />
            </div>
            {i < arr.length - 1 && <Sep />}
          </React.Fragment>
        ))}
      </Sec>

      <Sec title={t.notificationFeedback || "알림 및 피드백"}>
        <Row icon="🔔" ac="#10B981" label={t.pushNotif || "푸시 알림"} sub={t.pushNotifDesc || "출발 전 체크리스트 알림"} right={<Tog on={notif} toggle={() => setNotif(!notif)} accent="#10B981" />} />
      </Sec>

      <Sec title={t.appInfo || "앱 정보"}>
        {[
          { icon: "ℹ️", ac: "#3B82F6", label: t.version || "버전 정보", val: "v2.0.5" },
          { icon: "👥", ac: "#10B981", label: t.developer || "함께하는 사람들", val: "정성순" },
          { icon: "📧", ac: "#F97316", label: t.contact || "문의하기", val: "support@tripready.app" }
        ].map(({ icon, ac, label, val }, i, arr) => (
          <React.Fragment key={label}>
            <Row icon={icon} ac={ac} label={label} right={<span className="text-[13px] font-bold text-white/70">{val}</span>} />
            {i < arr.length - 1 && <Sep />}
          </React.Fragment>
        ))}
      </Sec>
      
      <p className="text-center text-[12px] font-bold text-white/40 mt-8 mb-4 tracking-widest uppercase">TripReady · Made with ❤️</p>
    </div>
  );
}

/* ── ROOT APP ───────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("home");
  const [page, setPage] = useState("home");
  const [selReg, setSelReg] = useState<any>(null);
  const [selCtry, setSelCtry] = useState<any>(null);
  const [lang, setLang] = useState("ko");
  const [visited, setVisited] = useState<string[]>(() => {
    const saved = localStorage.getItem('tripReadyVisited');
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('tripReadyTheme') || 'auto');
  const [ready, setReady] = useState(false);
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.ko;

  useEffect(() => {
    localStorage.setItem('tripReadyTheme', theme);
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.body.classList.toggle('light', !isDark);
      
      // Update ambient background for consistent experience
      document.body.style.backgroundColor = isDark ? "#080810" : "#F7F9FC";
    };

    applyTheme();
    
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (theme === 'auto') applyTheme();
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [theme]);

  useEffect(() => {
    setTimeout(() => setReady(true), 80);
  }, []);

  const goRegion = (r: any) => { setSelReg(r); setPage("list"); };
  const goCountry = (c: any) => { 
    setSelCtry(c); 
    setPage("detail"); 
    if (!visited.includes(c.name)) {
      const nv = [...visited, c.name];
      setVisited(nv);
      localStorage.setItem('tripReadyVisited', JSON.stringify(nv));
    }
  };
  const goBack = () => {
    if (page === "detail") setPage("list");
    else if (page === "list") setPage("home");
  };
  
  const handleTab = (k: string) => {
    setTab(k);
    if (k === "home") {
      setPage("home");
      setSelReg(null);
      setSelCtry(null);
    } else {
      setPage(k);
    }
  };

  const showBack = tab === "home" && (page === "list" || page === "detail");
  const headerTitle = page === "list" ? `${selReg?.emoji} ${lang === 'en' ? selReg?.labelEn : selReg?.label}` : page === "detail" ? (lang === 'en' ? selCtry?.nameEn : selCtry?.name) : tab === "check" ? t.checklist : tab === "settings" ? t.settings : "TripReady";

  const NAV = [
    { key: "home", icon: <Globe size={22} />, label: t.home },
    { key: "check", icon: <ClipboardCheck size={22} />, label: t.checklist },
    { key: "ai", icon: <Sparkles size={22} />, label: t.ai },
    { key: "settings", icon: <SettingsIcon size={22} />, label: t.settings }
  ];

  return (
    <div className="font-sans bg-[#080810] min-h-screen max-w-[430px] mx-auto text-white relative shadow-[0_0_100px_rgba(0,0,0,1)] ring-1 ring-white/10 transition-all duration-500 overflow-x-hidden">
      {/* 앰비언트 */}
      <div className="fixed inset-0 z-0 pointer-events-none max-w-[430px] mx-auto overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full top-[-100px] right-[-100px] filter blur-[80px]" style={{ background: "radial-gradient(circle,rgba(168,85,247,0.15) 0%,transparent 70%)" }} />
        <div className="absolute w-[360px] h-[360px] rounded-full bottom-[100px] left-[-80px] filter blur-[70px]" style={{ background: "radial-gradient(circle,rgba(59,158,247,0.12) 0%,transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-[24px] border-b border-white/5 pt-5 md:pt-6 px-6 pb-3 md:pb-4 flex items-center justify-between transition-all duration-300" style={{ opacity: ready ? 1 : 0 }}>
        <div className="flex items-center gap-3">
          {showBack ? (
            <button 
              onClick={goBack} 
              className="bg-foreground/5 border border-foreground/10 rounded-[20px] px-4 py-2 text-foreground/90 text-[14px] font-bold cursor-pointer flex items-center gap-2 transition-all active:scale-95 hover:bg-foreground/10"
            >
              <ArrowLeft size={18} /> {t.back}
            </button>
          ) : (
            <div className="w-[38px] h-[38px] rounded-[12px] bg-gradient-to-br from-purple-500/40 to-blue-500/40 border border-white/10 flex items-center justify-center text-[20px] shadow-[0_4px_20px_rgba(168,85,247,0.25)]">
              <Globe size={20} className="text-white" />
            </div>
          )}
          <span className="font-display text-[22px] font-black tracking-[-0.03em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {headerTitle}
          </span>
        </div>
        <button 
          onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
          className="bg-white/10 border border-white/10 rounded-[22px] px-5 py-2 text-white text-[14px] font-black cursor-pointer active:scale-95 transition-all hover:bg-white/15 shadow-sm"
        >
          {lang === 'ko' ? 'EN' : 'KO'}
        </button>
      </header>

      {/* Body */}
      <div className="relative z-10 pb-[92px]">
        {tab === "home" && page === "home" && <HomeScreen onSelectRegion={goRegion} lang={lang} />}
        {tab === "home" && page === "list" && <CountryListScreen region={selReg} onSelectCountry={goCountry} lang={lang} />}
        {tab === "home" && page === "detail" && <CountryDetailScreen country={selCtry} lang={lang} />}
        {tab === "check" && <ChecklistScreen lang={lang} />}
        {tab === "ai" && <AIScreen lang={lang} />}
        {tab === "settings" && <SettingsScreen lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} visitedCount={visited.length} />}
      </div>

      {/* Tab bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#080810]/95 backdrop-blur-[32px] border-t border-white/10 pt-3 px-6 pb-[34px] flex justify-around z-[120] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        {NAV.map(n => {
          const on = tab === n.key;
          return (
            <button 
              key={n.key} 
              onClick={() => handleTab(n.key)} 
              className="bg-transparent border-none flex flex-col items-center gap-1.5 cursor-pointer px-4 py-1 relative group w-full transition-all active:scale-90"
            >
              {on && (
                <motion.div 
                  layoutId="navTab"
                  className="absolute -top-[12px] left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-[#A855F7] to-[#3B9EFF] shadow-[0_0_12px_rgba(168,85,247,0.7)]" 
                />
              )}
              <div 
                className={`relative transition-all duration-300 flex items-center justify-center w-10 h-10 rounded-2xl ${on ? "text-[#A855F7] bg-[#A855F7]/12 shadow-[inset_0_0_15px_rgba(168,85,247,0.15)] scale-110" : "text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5"}`}
              >
                {on && (
                  <div className="absolute inset-0 bg-[#A855F7]/10 blur-xl rounded-full animate-pulse" />
                )}
                <div className="relative z-10">
                  {React.cloneElement(n.icon as React.ReactElement, { size: 24, strokeWidth: on ? 2.5 : 2 })}
                </div>
              </div>
              <span className={`text-[11px] tracking-tight transition-all duration-300 ${on ? "font-black text-[#A855F7] translate-y-[-1px]" : "font-semibold text-foreground/35"}`}>
                {n.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
