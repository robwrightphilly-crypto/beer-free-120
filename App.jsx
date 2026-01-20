import React, { useState, useEffect, useMemo } from 'react';
import Calendar from './components/Calendar.jsx';
import StatsCard from './components/StatsCard.jsx';
import ProgressChart from './components/ProgressChart.jsx';
import { getCoachAdvice } from './services/geminiService.jsx';

// Constants
const STORAGE_KEY = 'beer-free-120-logs';
const TARGET_DAYS = 120;
const GOAL_YEAR = 2026;

// ViewMode enum replacement
const ViewMode = {
  DASHBOARD: 'DASHBOARD',
  CALENDAR: 'CALENDAR',
  COACH: 'COACH'
};

const App = () => {
  const [logs, setLogs] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.DASHBOARD);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const toggleDay = (date) => {
    setLogs(prev => {
      const existing = prev.find(l => l.date === date);
      if (existing) {
        return prev.filter(l => l.date !== date);
      }
      return [...prev, { date, isNoBeerDay: true }];
    });
  };

  const stats = useMemo(() => {
    const completed = logs.filter(l => l.isNoBeerDay).length;
    const percentage = Math.round((completed / TARGET_DAYS) * 100);
    
    let streak = 0;
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    
    if (sortedLogs.length > 0) {
      streak = 0;
      let lastDate = null;
      for (const log of sortedLogs) {
        const d = new Date(log.date);
        if (!lastDate) {
          lastDate = d;
          streak = 1;
        } else {
          const diff = Math.floor((lastDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streak++;
            lastDate = d;
          } else {
            break;
          }
        }
      }
    }

    return { completed, percentage, streak };
  }, [logs]);

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;
    
    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    
    const aiResponse = await getCoachAdvice(logs, userMsg);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-safe pb-40">
      <header className="mb-10 text-center pt-10 animate-fade-in">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-100 shadow-sm">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Challenge Year {GOAL_YEAR}</span>
        </div>
        <h1 className="text-5xl font-[900] text-slate-900 mb-2 tracking-tighter">Beer-Free 120</h1>
        <p className="text-slate-400 font-bold tracking-tight">120 Days of Sobriety Milestone</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 animate-slide-up delay-1">
        <StatsCard 
          label="Progress" 
          value={`${stats.completed}/${TARGET_DAYS}`}
          subValue={`${stats.percentage}% to goal`}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
          colorClass="bg-indigo-500 text-indigo-600"
        />
        <StatsCard 
          label="Streak" 
          value={`${stats.streak} Days`}
          subValue="Momentum built"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>}
          colorClass="bg-orange-500 text-orange-600"
        />
        <StatsCard 
          label="Remaining" 
          value={Math.max(0, TARGET_DAYS - stats.completed)}
          subValue="Days to go"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          colorClass="bg-emerald-500 text-emerald-600"
        />
      </div>

      <main className="animate-slide-up delay-2">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Timeline</h2>
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl backdrop-blur-sm border border-white/50">
             <button 
              onClick={() => setViewMode(ViewMode.CALENDAR)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === ViewMode.CALENDAR ? 'bg-white shadow-md text-slate-900 scale-100' : 'text-slate-400 scale-95'}`}
             >
               CALENDAR
             </button>
             <button 
              onClick={() => setViewMode(ViewMode.DASHBOARD)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === ViewMode.DASHBOARD ? 'bg-white shadow-md text-slate-900 scale-100' : 'text-slate-400 scale-95'}`}
             >
               ANALYTICS
             </button>
          </div>
        </div>
        
        {viewMode === ViewMode.CALENDAR ? (
          <Calendar logs={logs} onToggleDay={toggleDay} />
        ) : (
          <div className="space-y-8">
            <ProgressChart logs={logs} />
            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-3">AI Support</h3>
                <p className="text-slate-400 mb-8 max-w-sm font-medium leading-relaxed">Having a rough night? Talk to your sobriety coach for mocktail ideas or motivation.</p>
                <button 
                  onClick={() => setViewMode(ViewMode.COACH)}
                  className="bg-emerald-500 text-white px-10 py-4 rounded-[1.2rem] font-black hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-900/40 active:scale-95 text-sm tracking-tight"
                >
                  GET MOTIVATED
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
            </div>
          </div>
        )}
      </main>

      {viewMode === ViewMode.COACH && (
        <section className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-zoom-in">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center pt-safe">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Coach</h3>
                <p className="text-[10px] text-emerald-500 font-black tracking-[0.3em] uppercase">Powered by Gemini</p>
              </div>
              <button 
                onClick={() => setViewMode(ViewMode.CALENDAR)}
                className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all active:scale-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              {chatHistory.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transform rotate-6 animate-zoom-in">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3">One day at a time.</h4>
                  <p className="text-slate-400 font-medium text-sm max-w-[260px] mx-auto leading-relaxed italic">Ask for distraction techniques, mocktail recipes, or motivation.</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-6 py-4 rounded-[1.8rem] text-[15px] font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 px-6 py-5 rounded-[1.8rem] rounded-tl-none flex space-x-2 border border-slate-100">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-50 mb-safe">
              <div className="relative group">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Need advice?"
                  className="w-full bg-slate-50 border-transparent rounded-[1.8rem] py-6 pl-8 pr-24 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 outline-none transition-all placeholder:text-slate-300 font-bold text-lg"
                />
                <button 
                  onClick={handleSendChat}
                  className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-8 rounded-[1.5rem] hover:bg-black transition-all active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md glass border border-white/50 rounded-[2.5rem] shadow-2xl flex justify-between p-3 z-40 mb-safe animate-slide-up delay-3 backdrop-blur-2xl">
        <button 
          onClick={() => setViewMode(ViewMode.CALENDAR)}
          className={`flex-1 py-5 rounded-[2rem] flex flex-col items-center space-y-1 transition-all ${viewMode === ViewMode.CALENDAR ? 'bg-slate-900 text-white shadow-xl scale-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-[0.1em]">CALENDAR</span>
        </button>
        <button 
          onClick={() => setViewMode(ViewMode.DASHBOARD)}
          className={`flex-1 py-5 rounded-[2rem] flex flex-col items-center space-y-1 transition-all ${viewMode === ViewMode.DASHBOARD ? 'bg-slate-900 text-white shadow-xl scale-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-[0.1em]">STATS</span>
        </button>
        <button 
          onClick={() => setViewMode(ViewMode.COACH)}
          className={`flex-1 py-5 rounded-[2rem] flex flex-col items-center space-y-1 transition-all ${viewMode === ViewMode.COACH ? 'bg-slate-900 text-white shadow-xl scale-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-[0.1em]">COACH</span>
        </button>
      </nav>
    </div>
  );
};

export default App;