import React, { useState, useEffect } from 'react';
import { SystemStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldCheck, ShieldAlert, Activity, Server, Cpu, HardDrive, Monitor, Globe, Clock, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDashboard } from '../contexts/DashboardContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  systems: SystemStatus[];
}

export const Dashboard: React.FC<DashboardProps> = ({ systems: initialSystems }) => {
  const { t } = useLanguage();
  const { attackVectorData, trafficStatsData } = useDashboard();
  const { activityLogs } = useAuth();
  const { currentTheme } = useTheme();
  
  // Real Host Info
  const [hostInfo, setHostInfo] = useState({
      os: 'Unknown',
      browser: 'Unknown',
      screen: 'Unknown',
      cores: 2
  });

  // Resource Simulation
  const [resources, setResources] = useState({
      cpu: 15,
      ram: 40,
      net: 20
  });

  // Dynamic System Status
  const [dynamicSystems, setDynamicSystems] = useState(initialSystems);

  useEffect(() => {
    // Get Real Host Info
    const userAgent = window.navigator.userAgent;
    let os = "Unknown OS";
    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
    if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    if (userAgent.indexOf("Android") !== -1) os = "Android";
    if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

    setHostInfo({
        os: os,
        browser: navigator.userAgent.split(') ')[1]?.split(' ')[0] || 'Modern Browser',
        screen: `${window.screen.width} x ${window.screen.height}`,
        cores: navigator.hardwareConcurrency || 4
    });

    // Simulate Resource Usage Fluctuation
    const resourceInterval = setInterval(() => {
        setResources(prev => ({
            cpu: Math.min(99, Math.max(5, prev.cpu + (Math.random() * 20 - 10))),
            ram: Math.min(90, Math.max(20, prev.ram + (Math.random() * 5 - 2))),
            net: Math.min(100, Math.max(0, prev.net + (Math.random() * 30 - 15)))
        }));
    }, 1500);

    // Simulate Threat Level Fluctuation
    const sysInterval = setInterval(() => {
        setDynamicSystems(prevSystems => prevSystems.map(sys => {
            const change = Math.floor(Math.random() * 5) - 2; 
            let newLevel = sys.threatLevel + change;
            newLevel = Math.max(0, Math.min(100, newLevel));
            return { ...sys, threatLevel: newLevel };
        }));
    }, 3000);

    return () => {
        clearInterval(resourceInterval);
        clearInterval(sysInterval);
    };
  }, []);

  // Helper for Circular Progress
  const CircularProgress = ({ value, color, icon: Icon, label }: { value: number, color: string, icon: any, label: string }) => {
      const radius = 30;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (value / 100) * circumference;

      return (
          <div className="flex flex-col items-center gap-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r={radius} stroke={currentTheme.colors.border} strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="40" cy="40" r={radius} 
                        stroke={color} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-in-out"
                      />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center theme-text-main font-bold text-sm">
                      {Math.round(value)}%
                  </div>
              </div>
              <div className="flex items-center gap-1 theme-text-muted text-xs font-bold uppercase">
                  <Icon size={12} />
                  {label}
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* ROW 1: Host Info & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Host Info Card */}
          <div className="theme-bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-bold theme-text-main mb-4 flex items-center gap-2 border-b theme-border pb-2">
                  <Monitor className="theme-text-accent" size={20} />
                  {t('host_info')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                  {[
                      { icon: Monitor, label: t('os_platform'), value: hostInfo.os, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                      { icon: Globe, label: t('browser_agent'), value: hostInfo.browser, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                      { icon: Monitor, label: t('screen_res'), value: hostInfo.screen, color: 'text-green-400', bg: 'bg-green-500/10' },
                      { icon: Cpu, label: t('logical_cores'), value: `${hostInfo.cores} Cores`, color: 'text-orange-400', bg: 'bg-orange-500/10' }
                  ].map((item, i) => (
                    <div key={i} className="theme-bg-input p-3 rounded border theme-border flex items-center gap-3">
                        <div className={`${item.bg} p-2 rounded ${item.color}`}><item.icon size={18} /></div>
                        <div>
                            <div className="text-xs theme-text-muted uppercase">{item.label}</div>
                            <div className="text-sm font-bold theme-text-main font-mono truncate">{item.value}</div>
                        </div>
                    </div>
                  ))}
              </div>
          </div>

          {/* System Resources Card */}
          <div className="theme-bg-card rounded-lg p-6 shadow-lg">
               <h3 className="text-lg font-bold theme-text-main mb-4 flex items-center gap-2 border-b theme-border pb-2">
                  <Zap className="text-yellow-500" size={20} />
                  {t('system_resources')}
              </h3>
              <div className="flex justify-around items-center h-full pb-4">
                  <CircularProgress value={resources.cpu} color="#ef4444" icon={Cpu} label={t('cpu_usage')} />
                  <CircularProgress value={resources.ram} color={currentTheme.colors.accent} icon={HardDrive} label={t('ram_usage')} />
                  <CircularProgress value={resources.net} color="#10b981" icon={Activity} label={t('net_load')} />
              </div>
          </div>
      </div>

      {/* ROW 2: Infrastructure Status (Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dynamicSystems.map((sys) => (
          <div key={sys.name} className={`p-6 rounded-lg border shadow-md transition-all duration-500 theme-bg-card ${sys.status === 'SECURE' ? 'border-green-500/30' : sys.status === 'UNDER_ATTACK' ? 'border-red-500/30' : 'border-yellow-500/30'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold theme-text-main flex items-center gap-2">
                <Server size={18} />
                {sys.name}
              </h3>
              {sys.status === 'SECURE' ? <ShieldCheck className="text-green-400" /> : <ShieldAlert className="text-red-400 animate-pulse" />}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm theme-text-muted">
                <span>{t('status')}</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${sys.status === 'SECURE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{sys.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm theme-text-muted">
                <span>{t('uptime')}</span>
                <span className="font-mono theme-text-main">{sys.uptime}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t('threat_level')}</span>
                  <span className={`${sys.threatLevel > 70 ? 'text-red-400 font-bold' : 'theme-text-muted'}`}>{sys.threatLevel}%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5 border theme-border">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ${sys.threatLevel > 70 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : sys.threatLevel > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${sys.threatLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="theme-bg-card p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold theme-text-main mb-4 flex items-center gap-2">
            <Activity size={18} className="theme-text-accent" />
            {t('attack_vector_dist')}
          </h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackVectorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.colors.border} vertical={false} />
                  <XAxis dataKey="name" stroke={currentTheme.colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={currentTheme.colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: currentTheme.colors.border, opacity: 0.2}}
                    contentStyle={{ backgroundColor: currentTheme.colors.bgCard, borderColor: currentTheme.colors.border, color: currentTheme.colors.textMain, borderRadius: '8px' }}
                    itemStyle={{ color: currentTheme.colors.textMain }}
                  />
                  <Bar dataKey="count" fill={currentTheme.colors.accent} radius={[4, 4, 0, 0]} barSize={40}>
                    {attackVectorData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.count > 100 ? '#ef4444' : currentTheme.colors.chartColors[index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="theme-bg-card p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold theme-text-main mb-4 flex items-center gap-2">
            <Globe size={18} className="text-purple-400" />
            {t('traffic_analysis_chart')}
          </h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficStatsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                  stroke="none"
                >
                  {trafficStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={currentTheme.colors.chartColors[index % currentTheme.colors.chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: currentTheme.colors.bgCard, borderColor: currentTheme.colors.border, color: currentTheme.colors.textMain, borderRadius: '8px' }}
                />
              </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 4: Real Activity Logs */}
      <div className="theme-bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 theme-bg-input border-b theme-border flex justify-between items-center">
              <h3 className="text-lg font-bold theme-text-main flex items-center gap-2">
                  <Clock size={18} className="theme-text-muted" />
                  {t('recent_system_activity')}
              </h3>
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] text-green-400 font-bold uppercase">Live Feed</span>
              </div>
          </div>
          <div className="divide-y theme-border">
              {activityLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs 
                                ${log.action.includes('LOGIN') ? 'bg-blue-500/20 text-blue-400' : 
                                  log.action.includes('SCAN') ? 'bg-orange-500/20 text-orange-400' :
                                  log.action.includes('DELETE') ? 'bg-red-500/20 text-red-400' :
                                  'theme-bg-input theme-text-muted'
                                }`}>
                                {log.action.substring(0,1)}
                           </div>
                           <div>
                               <div className="text-sm font-bold theme-text-main">{log.action.replace('_', ' ')}</div>
                               <div className="text-xs theme-text-muted">{log.details} - by <span className="theme-text-accent">{log.userName}</span></div>
                           </div>
                      </div>
                      <div className="text-xs font-mono theme-text-muted text-right">
                          {new Date(log.timestamp).toLocaleTimeString()}
                          <div className="text-[10px] opacity-50">{new Date(log.timestamp).toLocaleDateString()}</div>
                      </div>
                  </div>
              ))}
              {activityLogs.length === 0 && (
                  <div className="p-8 text-center theme-text-muted text-sm italic">
                      No recent activity recorded in current session.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};