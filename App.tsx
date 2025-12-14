import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LiveMonitor } from './components/LiveMonitor';
import { VulnerabilityScanner } from './components/VulnerabilityScanner';
import { TrafficAnalyzer } from './components/TrafficAnalyzer';
import { About } from './components/About';
import { ViewState, SystemStatus } from './types';
import { Bell, Globe } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const { t, language, setLanguage, dir } = useLanguage();
  
  const [systems] = useState<SystemStatus[]>([
    { name: 'Khartoum Airport', status: 'SECURE', uptime: '99.98%', threatLevel: 12 },
    { name: 'Omdurman Hospital', status: 'VULNERABLE', uptime: '98.50%', threatLevel: 45 },
    { name: 'Bank of Khartoum (Sim)', status: 'UNDER_ATTACK', uptime: '92.10%', threatLevel: 88 },
  ]);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard systems={systems} />;
      case ViewState.LIVE_MONITOR:
        return <LiveMonitor />;
      case ViewState.TRAFFIC_ANALYSIS:
        return <TrafficAnalyzer />;
      case ViewState.VULNERABILITY_SCAN:
        return <VulnerabilityScanner />;
      case ViewState.PROPOSAL_DOC:
        return <About />;
      default:
        return <Dashboard systems={systems} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return t('operational_overview');
      case ViewState.LIVE_MONITOR: return t('realtime_intrusion');
      case ViewState.TRAFFIC_ANALYSIS: return t('batch_forensics');
      case ViewState.VULNERABILITY_SCAN: return t('vuln_assessment');
      case ViewState.PROPOSAL_DOC: return t('project_doc');
      default: return t('operational_overview');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans" dir={dir}>
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className={`p-8 min-h-screen transition-all ${dir === 'rtl' ? 'mr-64' : 'ml-64'}`}>
        {/* Top Header Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {getTitle()}
            </h2>
            <p className="text-slate-400 text-sm">{t('subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Fake API Key Warning if not present */}
             {!process.env.API_KEY && (
               <div className="bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded border border-red-500/30">
                 {t('demo_mode')}
               </div>
             )}
            
            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              <Globe size={16} />
              {language === 'ar' ? 'English' : 'العربية'}
            </button>

            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
              <span className="text-sm font-medium">{t('admin_user')}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
