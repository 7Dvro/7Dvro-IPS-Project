
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Cpu, Shield, Settings, CheckCircle, Target, FileText, Info, Zap, Layers, Database, BarChart3, ArrowRight, ArrowLeft } from 'lucide-react';

export const About: React.FC = () => {
  const { t, language, dir } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div className="theme-bg-card rounded-2xl shadow-2xl overflow-hidden border theme-border">
        {/* Academic Header */}
        <header className="p-10 text-center border-b theme-border bg-slate-900/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
          <div className="theme-text-muted text-xs mb-4 font-mono tracking-widest uppercase">بسم الله الرحمن الرحيم</div>
          <h1 className="text-2xl font-bold theme-text-main mb-2 tracking-tight">{t('university')}</h1>
          <h2 className="text-lg theme-text-muted mb-8">{t('college')}</h2>
          
          <div className="p-6 theme-bg-input rounded-xl border theme-border shadow-inner max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform">
            <h3 className="text-sm font-bold theme-text-accent mb-3 uppercase tracking-widest flex items-center justify-center gap-2">
                <BookOpen size={16} /> {t('proposal_title')}
            </h3>
            <p className="text-2xl font-black theme-text-main leading-snug">
              {t('proposal_name')}
            </p>
            <p className="theme-text-muted mt-4 text-sm font-medium">{t('prepared_by')}</p>
          </div>
        </header>

        <div className="p-10 space-y-12">
          {/* Introduction & Problem */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="space-y-4">
              <h3 className="text-xl font-bold theme-text-accent flex items-center gap-2">
                <Info size={20} /> {t('intro')}
              </h3>
              <p className="theme-text-main leading-relaxed text-justify opacity-90">
                {t('intro_text')}
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold theme-text-accent flex items-center gap-2">
                <Shield size={20} className="text-red-500" /> {t('problem')}
              </h3>
              <p className="theme-text-main leading-relaxed text-justify opacity-90">
                {t('problem_text')}
              </p>
            </section>
          </div>

          {/* SYSTEM DIAGRAM SECTION (NEW) */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold theme-text-accent flex items-center gap-2 border-b theme-border pb-2">
              <Layers size={20} /> {t('diagram_label')}
            </h3>
            
            <div className="py-10 theme-bg-input rounded-2xl border theme-border shadow-inner relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                {/* Step 1: Input */}
                <div className="flex flex-col items-center text-center space-y-3 z-10 w-48">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border theme-border flex items-center justify-center theme-text-accent shadow-lg">
                        <Database size={32} />
                    </div>
                    <span className="text-xs font-bold theme-text-main uppercase tracking-tighter">{t('diag_input')}</span>
                </div>

                {/* Arrow */}
                <div className="theme-text-muted opacity-30 hidden md:block">
                   {dir === 'rtl' ? <ArrowLeft size={32} /> : <ArrowRight size={32} />}
                </div>

                {/* Step 2: AI Core */}
                <div className="flex flex-col items-center text-center space-y-3 z-10 w-48 relative">
                    <div className="absolute inset-0 bg-[var(--accent)]/20 blur-[30px] rounded-full animate-pulse"></div>
                    <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-[var(--accent)] flex items-center justify-center theme-text-accent shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] relative z-10">
                        <Zap size={40} className="animate-bounce" />
                    </div>
                    <span className="text-xs font-bold theme-text-accent uppercase tracking-tighter relative z-10">{t('diag_ai_core')}</span>
                </div>

                {/* Arrow */}
                <div className="theme-text-muted opacity-30 hidden md:block">
                   {dir === 'rtl' ? <ArrowLeft size={32} /> : <ArrowRight size={32} />}
                </div>

                {/* Step 3: Output */}
                <div className="flex flex-col items-center text-center space-y-3 z-10 w-48">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border theme-border flex items-center justify-center text-green-500 shadow-lg">
                        <BarChart3 size={32} />
                    </div>
                    <span className="text-xs font-bold theme-text-main uppercase tracking-tighter">{t('diag_output')}</span>
                </div>

                {/* Connecting Line (Background) */}
                <div className="absolute h-1 bg-slate-700/30 left-1/4 right-1/4 top-[4.5rem] hidden md:block"></div>
            </div>
          </section>

          {/* AI ANALYSIS MODELS SECTION (NEW) */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold theme-text-accent flex items-center gap-2 border-b theme-border pb-2">
              <Zap size={20} /> {t('analysis_models')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3 p-6 theme-bg-input rounded-2xl border theme-border hover:border-blue-500/50 transition-colors">
                  <h4 className="font-bold theme-text-main flex items-center gap-2 text-lg">
                    <Activity size={20} className="text-blue-500" />
                    {t('traffic_engine_title')}
                  </h4>
                  <p className="text-sm theme-text-muted leading-relaxed text-justify">
                    {t('traffic_engine_desc')}
                  </p>
               </div>
               <div className="space-y-3 p-6 theme-bg-input rounded-2xl border theme-border hover:border-purple-500/50 transition-colors">
                  <h4 className="font-bold theme-text-main flex items-center gap-2 text-lg">
                    <Search size={20} className="text-purple-500" />
                    {t('scan_logic_title')}
                  </h4>
                  <p className="text-sm theme-text-muted leading-relaxed text-justify">
                    {t('scan_logic_desc')}
                  </p>
               </div>
            </div>
          </section>

          {/* Detailed System Architecture */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold theme-text-accent flex items-center gap-2 border-b theme-border pb-2">
              <Cpu size={20} /> {t('system_architecture')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { key: 'arch_dashboard', icon: Target },
                 { key: 'arch_ids', icon: Activity },
                 { key: 'arch_malware', icon: Bug },
                 { key: 'arch_batch', icon: FileSearch }
               ].map((item, idx) => (
                 <div key={idx} className="p-5 theme-bg-input rounded-xl border theme-border hover:border-[var(--accent)] transition-colors group">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-800 rounded-lg theme-text-accent group-hover:scale-110 transition-transform">
                            <item.icon size={24} />
                        </div>
                        <p className="text-sm theme-text-main leading-relaxed">
                            {t(item.key)}
                        </p>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* Objectives */}
          <section className="space-y-4 bg-black/5 p-8 rounded-2xl border theme-border">
            <h3 className="text-xl font-bold theme-text-accent flex items-center gap-2">
              <CheckCircle size={20} /> {t('objectives')}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[1,2,3,4,5].map(num => (
                 <li key={num} className="flex gap-3 text-sm theme-text-main">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[10px] font-bold mt-0.5">0{num}</span>
                    <span>{t(`obj_${num}`)}</span>
                 </li>
               ))}
            </ul>
          </section>

          {/* Tools & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="space-y-4">
              <h3 className="text-xl font-bold theme-text-accent flex items-center gap-2">
                <Settings size={20} /> {t('tools')}
              </h3>
              <p className="text-sm theme-text-main leading-relaxed">
                {t('tools_text')}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                 {['React 19', 'Gemini 3 Pro AI', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Performance APIs'].map(tag => (
                   <span key={tag} className="px-2 py-1 bg-slate-800 rounded border theme-border text-[10px] font-mono text-slate-400">{tag}</span>
                 ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold theme-text-accent flex items-center gap-2">
                <Target size={20} /> {t('benefits')}
              </h3>
              <p className="text-sm theme-text-main leading-relaxed whitespace-pre-line">
                {t('benefits_text')}
              </p>
            </section>
          </div>
        </div>
        
        {/* Footer info */}
        <footer className="p-6 bg-slate-900/20 border-t theme-border text-center">
            <p className="text-[10px] theme-text-muted uppercase tracking-[0.2em]">CyberShield AI Framework - Academic Version 1.0</p>
        </footer>
      </div>
    </div>
  );
};

// Mock local icon components
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const Bug = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bug"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>;
const FileSearch = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-search"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="8" cy="14" r="4"/><path d="m11 17 3 3"/></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
