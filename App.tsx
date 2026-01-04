
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LiveMonitor } from './components/LiveMonitor';
import { VulnerabilityScanner } from './components/VulnerabilityScanner';
import { TrafficAnalyzer } from './components/TrafficAnalyzer';
import { MalwareScanner } from './components/MalwareScanner';
import { About } from './components/About';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { ViewState, SystemStatus } from './types';
import { Bell, Globe, Palette, X, Menu } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { SessionProvider } from './contexts/SessionContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const { isAuthenticated, currentUser } = useAuth();
  const { currentTheme, setTheme, themes } = useTheme();
  
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const [systems] = useState<SystemStatus[]>([
    { name: 'Khartoum Airport', status: 'SECURE', uptime: '99.98%', threatLevel: 12 },
    { name: 'Omdurman Hospital', status: 'VULNERABLE', uptime: '98.50%', threatLevel: 45 },
    { name: 'Bank of Khartoum (Sim)', status: 'UNDER_ATTACK', uptime: '92.10%', threatLevel: 88 },
  ]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <Dashboard systems={systems} />;
      case ViewState.LIVE_MONITOR: return <LiveMonitor />;
      case ViewState.TRAFFIC_ANALYSIS: return <TrafficAnalyzer />;
      case ViewState.VULNERABILITY_SCAN: return <VulnerabilityScanner />;
      case ViewState.MALWARE_SCANNER: return <MalwareScanner />;
      case ViewState.PROPOSAL_DOC: return <About />;
      case ViewState.PROFILE: return <Profile />;
      default: return <Dashboard systems={systems} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return t('operational_overview');
      case ViewState.LIVE_MONITOR: return t('realtime_intrusion');
      case ViewState.TRAFFIC_ANALYSIS: return t('batch_forensics');
      case ViewState.VULNERABILITY_SCAN: return t('vuln_assessment');
      case ViewState.MALWARE_SCANNER: return t('malware_analysis_title');
      case ViewState.PROPOSAL_DOC: return t('project_doc');
      case ViewState.PROFILE: return t('profile_title');
      default: return t('operational_overview');
    }
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden theme-bg-app theme-text-main font-sans transition-colors duration-300" dir={dir}>
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar 
        currentView={currentView} 
        onNavigate={navigateTo} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth">
        {/* STICKY HEADER CONTAINER */}
        <div className="sticky top-0 z-30 w-full no-print">
            <div className="glass-effect bg-[var(--bg-app)]/80 border-b theme-border px-4 py-4 md:px-8 md:py-5 flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded md:hidden theme-bg-card theme-border border theme-text-main"
                    >
                    <Menu size={20} />
                    </button>
                    <div className="hidden sm:block">
                    <h2 className="text-xl md:text-2xl font-bold theme-text-main tracking-tight leading-tight">
                        {getTitle()}
                    </h2>
                    <p className="theme-text-muted text-[10px] md:text-xs truncate max-w-[200px] md:max-w-none">{t('subtitle')}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    {!process.env.API_KEY && (
                    <div className="hidden lg:block bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded border border-red-500/30 font-bold">
                        {t('demo_mode')}
                    </div>
                    )}
                    
                    <div className="relative">
                        <button 
                        onClick={() => setShowThemeSelector(!showThemeSelector)}
                        className="p-2 rounded theme-bg-card theme-text-muted hover:theme-text-accent border theme-border transition-colors"
                        >
                            <Palette size={18} />
                        </button>

                        {showThemeSelector && (
                            <div className={`absolute top-12 ${dir === 'rtl' ? 'left-0' : 'right-0'} z-50 p-4 rounded-lg theme-bg-card theme-border border shadow-2xl w-64 animate-fade-in glass-effect`}>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold theme-text-main uppercase">{t('select_theme')}</span>
                                    <button onClick={() => setShowThemeSelector(false)}><X size={14} className="theme-text-muted" /></button>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {themes.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setTheme(theme.id)}
                                            className={`w-full aspect-square rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${currentTheme.id === theme.id ? 'border-[var(--accent)]' : 'border-transparent'}`}
                                            style={{ backgroundColor: theme.colors.bgApp }}
                                        >
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                    onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 theme-bg-card rounded border theme-border hover:opacity-80 theme-text-main text-[10px] md:text-xs font-bold transition-all"
                    >
                    <Globe size={14} />
                    <span className="hidden xs:inline">{t('lang_toggle')}</span>
                    </button>

                    <button className="relative p-2 theme-text-muted hover:theme-text-main transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>
                    
                    <div className="flex items-center gap-2 theme-bg-card py-1 px-2 md:px-3 rounded-full border theme-border cursor-pointer" onClick={() => navigateTo(ViewState.PROFILE)}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg" style={{ background: 'var(--accent)' }}>
                        {currentUser?.avatar || 'U'}
                    </div>
                    <span className="hidden md:inline text-xs font-bold theme-text-main">{currentUser?.name?.split(' ')[0]}</span>
                    </div>
                </div>
            </div>
            
            {/* Dynamic Title for very small screens (Mobile Only) */}
            <div className="sm:hidden px-4 py-2 bg-[var(--bg-app)]/90 border-b theme-border">
                <h2 className="text-lg font-bold theme-text-main leading-tight">{getTitle()}</h2>
            </div>
        </div>

        {/* PAGE CONTENT CONTAINER */}
        <div className="p-4 md:p-8 pb-24 md:pb-8">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <SessionProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </SessionProvider>
      </DashboardProvider>
    </AuthProvider>
  );
}
