
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Activity, ScanLine, FileText, FileSearch, LogOut, Settings, Bug, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const { t, dir } = useLanguage();
  const { logout, currentUser } = useAuth();

  const menuItems = [
    { 
        id: ViewState.DASHBOARD, 
        label: t('dashboard'), 
        icon: LayoutDashboard,
        allowedRoles: ['ADMIN', 'ANALYST', 'VIEWER'] 
    },
    { 
        id: ViewState.LIVE_MONITOR, 
        label: t('live_monitor'), 
        icon: Activity,
        allowedRoles: ['ADMIN', 'ANALYST', 'VIEWER'] 
    },
    { 
        id: ViewState.TRAFFIC_ANALYSIS, 
        label: t('traffic_analysis'), 
        icon: FileSearch,
        allowedRoles: ['ADMIN', 'ANALYST'] 
    },
    { 
        id: ViewState.VULNERABILITY_SCAN, 
        label: t('vuln_scanner'), 
        icon: ScanLine,
        allowedRoles: ['ADMIN', 'ANALYST'] 
    },
    {
        id: ViewState.MALWARE_SCANNER,
        label: t('malware_scanner'),
        icon: Bug,
        allowedRoles: ['ADMIN', 'ANALYST']
    },
    { 
        id: ViewState.PROPOSAL_DOC, 
        label: t('research_doc'), 
        icon: FileText,
        allowedRoles: ['ADMIN', 'ANALYST', 'VIEWER']
    },
  ];

  const sidebarClasses = `
    fixed inset-y-0 z-50 w-64 theme-bg-sidebar flex flex-col transition-transform duration-300 ease-in-out border-slate-700
    ${dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'} 
    ${isOpen ? 'translate-x-0' : (dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')}
    md:relative md:translate-x-0 no-print
  `;

  return (
    <div className={sidebarClasses}>
      <div className="p-6 flex items-center justify-between border-b theme-border">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg theme-btn-primary">
              <ShieldIcon />
            </div>
            <h1 className="theme-text-main font-bold text-lg tracking-tight">CyberShield</h1>
        </div>
        <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-white/10 theme-text-muted">
            <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems
          .filter(item => currentUser && item.allowedRoles.includes(currentUser.role))
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                  ? 'theme-btn-primary shadow-xl' 
                  : 'theme-text-muted hover:bg-white/5 hover:theme-text-main'
                }`}
              >
                <Icon size={18} />
                <span className="truncate">{item.label}</span>
              </button>
            );
        })}
      </nav>

      <div className="p-4 border-t theme-border space-y-1">
        <button
            onClick={() => onNavigate(ViewState.PROFILE)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            currentView === ViewState.PROFILE 
            ? 'theme-bg-card theme-text-main border theme-border' 
            : 'theme-text-muted hover:bg-white/5 hover:theme-text-main'
            }`}
        >
            <Settings size={18} />
            <span className="truncate">{t('profile_settings')}</span>
        </button>

        <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
            <LogOut size={18} />
            <span className="truncate">{t('logout')}</span>
        </button>
        
        <div className="mt-4 flex items-center gap-3 px-2 bg-white/5 p-2 rounded-lg">
            <div className="w-8 h-8 shrink-0 rounded-full theme-bg-input flex items-center justify-center text-[10px] theme-text-main font-bold border theme-border">
                {currentUser?.avatar || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold theme-text-main truncate">{currentUser?.name}</span>
                <span className="text-[10px] theme-text-muted uppercase truncate">{currentUser?.role}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
