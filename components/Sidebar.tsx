import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Activity, ScanLine, FileText, BrainCircuit, FileSearch } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { t, dir } = useLanguage();

  const menuItems = [
    { id: ViewState.DASHBOARD, label: t('dashboard'), icon: LayoutDashboard },
    { id: ViewState.LIVE_MONITOR, label: t('live_monitor'), icon: Activity },
    { id: ViewState.TRAFFIC_ANALYSIS, label: t('traffic_analysis'), icon: FileSearch },
    { id: ViewState.VULNERABILITY_SCAN, label: t('vuln_scanner'), icon: ScanLine },
    { id: ViewState.PROPOSAL_DOC, label: t('research_doc'), icon: FileText },
  ];

  return (
    <div className={`w-64 bg-slate-900 border-slate-800 flex flex-col h-screen fixed top-0 ${dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'}`}>
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-blue-500 mb-1">
          <BrainCircuit size={32} />
          <h1 className="text-xl font-bold tracking-tighter text-white">SCICDS <span className="text-xs font-normal text-slate-400 block">Sudan Cyber AI</span></h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === item.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} className={dir === 'rtl' ? 'ml-0' : ''} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded p-3 text-xs text-slate-400">
          <p className="font-bold text-white mb-1">{t('system_status')}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{t('ai_online')}</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-600">v1.1.0-i18n</div>
        </div>
      </div>
    </div>
  );
};
