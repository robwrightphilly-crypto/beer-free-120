import React, { useState } from 'react';

// Constants
const GOAL_YEAR = 2026;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({ logs, onToggleDay }) => {
  // Initialize to current month if we are in 2026, otherwise start at January
  const now = new Date();
  const initialMonth = now.getFullYear() === GOAL_YEAR ? now.getMonth() : 0;
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const days = getDaysInMonth(currentMonth, GOAL_YEAR);
  const firstDay = getFirstDayOfMonth(currentMonth, GOAL_YEAR);
  const blanks = Array(firstDay).fill(null);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);

  const isNoBeer = (day) => {
    const dateStr = `${GOAL_YEAR}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return logs.find(l => l.date === dateStr)?.isNoBeerDay;
  };

  const isFutureDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const cellDate = new Date(GOAL_YEAR, currentMonth, day);
    return cellDate > today;
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-slide-up">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <h3 className="text-xl font-black tracking-tight">{MONTHS[currentMonth]} {GOAL_YEAR}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-20"
            disabled={currentMonth === 0}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button 
            onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-20"
            disabled={currentMonth === 11}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
      
      <div className="p-5 sm:p-8">
        <div className="grid grid-cols-7 gap-1 mb-6">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2.5">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {daysArray.map(day => {
            const dateStr = `${GOAL_YEAR}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const active = isNoBeer(day);
            const future = isFutureDate(day);
            
            return (
              <button
                key={day}
                type="button"
                onClick={() => !future && onToggleDay(dateStr)}
                disabled={future}
                className={`
                  relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform 
                  ${future ? 'opacity-20 cursor-not-allowed grayscale' : 'active:scale-90 cursor-pointer'}
                  ${active 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 animate-pop' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'}
                `}
              >
                <span className={`text-sm font-black ${active ? 'text-white' : 'text-slate-600'}`}>{day}</span>
                {active && (
                  <div className="animate-zoom-in mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  </div>
                )}
                {future && (
                   <div className="absolute inset-0 flex items-center justify-center opacity-10">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                   </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-400 font-bold text-center tracking-tight uppercase">
        Success is built one day at a time
      </div>
    </div>
  );
};

export default Calendar;