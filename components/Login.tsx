import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Lock, User, AlertCircle, Loader, Globe, Clock, Cpu } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t, dir, language, setLanguage } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError(t('login_error'));
      }
    } catch (err) {
      setError('System Error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 font-sans relative overflow-hidden flex flex-col" dir={dir}>
      
      {/* Background Cyber Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{
             backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#3b82f6 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             backgroundPosition: '0 0, 20px 20px'
           }}>
      </div>
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>

      {/* Professional Header */}
      <header className="relative z-10 w-full px-8 py-6 flex flex-col md:flex-row justify-between items-center border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">CyberShield AI</h1>
            <p className="text-[10px] text-blue-400 tracking-wider">SUDAN CRITICAL INFRASTRUCTURE DEFENSE</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-mono">
           <div className="flex flex-col items-end hidden md:flex">
             <div className="flex items-center gap-2 text-blue-300 font-bold">
               <Clock size={14} />
               <span>{formatTime(currentTime)}</span>
             </div>
             <span className="text-xs text-slate-500">{formatDate(currentTime)}</span>
           </div>

           <div className="h-8 w-px bg-slate-700 hidden md:block"></div>

           <button 
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-all text-xs font-bold text-slate-300 hover:text-white"
            >
              <Globe size={14} />
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-xl">
          
          {/* Left Side: Branding / Visuals */}
          <div className="relative hidden md:flex flex-col justify-between p-12 bg-slate-900/60 border-r border-slate-700/50">
             <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-900/90 z-0"></div>
             
             <div className="relative z-10 space-y-6 mt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  SYSTEM SECURE & ONLINE
                </div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  {language === 'ar' ? 'الجيل القادم من الحماية السيبرانية' : 'Next-Gen Cyber Infrastructure Protection'}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                   {language === 'ar' 
                    ? 'نظام ذكي مدعوم بالذكاء الاصطناعي لحماية المطارات، المستشفيات، والقطاعات المصرفية في السودان من التهديدات المتقدمة.'
                    : 'AI-powered intelligent system protecting Sudan\'s airports, hospitals, and banking sectors from advanced persistent threats.'}
                </p>
             </div>

             <div className="relative z-10 mt-12 grid grid-cols-2 gap-4">
               <div className="p-4 rounded bg-slate-800/50 border border-slate-700/50">
                  <Cpu className="text-blue-500 mb-2" size={20} />
                  <div className="text-xs text-slate-500 uppercase font-bold">AI Engine</div>
                  <div className="text-lg font-bold text-white">Active</div>
               </div>
               <div className="p-4 rounded bg-slate-800/50 border border-slate-700/50">
                  <Shield className="text-purple-500 mb-2" size={20} />
                  <div className="text-xs text-slate-500 uppercase font-bold">Firewall</div>
                  <div className="text-lg font-bold text-white">Enhanced</div>
               </div>
             </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-900/80">
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">{t('login_title')}</h3>
              <p className="text-slate-400 text-sm">{t('login_subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block ml-1">{t('email_label')}</label>
                <div className="relative group">
                  <User className={`absolute top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors ${dir === 'rtl' ? 'right-3' : 'left-3'}`} size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-[#0b1121] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${dir === 'rtl' ? 'pr-10' : 'pl-10'}`}
                    placeholder="analyst@scicds.sd"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block ml-1">{t('password_label')}</label>
                <div className="relative group">
                  <Lock className={`absolute top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors ${dir === 'rtl' ? 'right-3' : 'left-3'}`} size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-[#0b1121] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${dir === 'rtl' ? 'pr-10' : 'pl-10'}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 animate-fade-in">
                  <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    {t('logging_in')}
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    {t('sign_in')}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
               <p className="text-[10px] text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
                 <Shield size={10} />
                 {t('restricted_access')}
               </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-[10px] text-slate-600 border-t border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-md">
        © 2025 Sudan Cyber Defense Command. All rights reserved. System Ver. 1.0.4-beta
      </footer>
    </div>
  );
};