import React, { useState, useEffect } from 'react';
import { SystemStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldCheck, ShieldAlert, Activity, Server, Cpu, HardDrive, Monitor, Globe, Clock, Zap, Wifi, Signal, ArrowDown } from 'lucide-react';
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
      cores: 2,
      publicIp: 'Loading...'
  });

  // Real Network Stats (Telemetry)
  const [netStats, setNetStats] = useState({
    ping: 0,
    downlink: 0,
    effectiveType: 'unknown',
    isOnline: true
  });

  // Resource Simulation
  const [resources, setResources] = useState({
      cpu: 15,
      ram: 40,
      net: 20
  });

  // Dynamic System Status
  const [dynamicSystems, setDynamicSystems] = useState(initialSystems);

  // Measure Ping Logic
  const measurePing = async () => {
    const start = performance.now();
    try {
        await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
        const end = performance.now();
        return Math.round(end - start);
    } catch (e) {
        return 999;
    }
  };

  useEffect(() => {
    // Get Real Public IP
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
             setHostInfo(prev => ({ ...prev, publicIp: data.ip || 'Unknown' }));
        })
        .catch(() => setHostInfo(prev => ({ ...prev, publicIp: 'Hidden/Local' })));

    // Get Real Host Info
    const userAgent = window.navigator.userAgent;
    let os = "Unknown OS";
    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
    if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    if (userAgent.indexOf("Android") !== -1) os = "Android";
    if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

    setHostInfo(prev => ({
        ...prev,
        os: os,
        browser: navigator.userAgent.split(') ')[1]?.split(' ')[0] || 'Modern Browser',
        screen: `${window.screen.width} x ${window.screen.height}`,
        cores: navigator.hardwareConcurrency || 4
    }));

    // Network Stats Update Loop
    if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        setNetStats(prev => ({
            ...prev,
            downlink: conn.downlink || 0,
            effectiveType: conn.effectiveType || 'unknown'
        }));
        conn.addEventListener('change', () => {
             setNetStats(prev => ({
                ...prev,
                downlink: conn.downlink,
                effectiveType: conn.effectiveType
            }));
        });
    }

    const netInterval = setInterval(async () => {
        const ping = await measurePing();
        setNetStats(prev => ({
            ...prev,
            ping: ping,
            isOnline: navigator.onLine
        }));
    }, 2000);

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
        clearInterval(netInterval);
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
                      { icon: Globe, label: 'Public IP', value: hostInfo.publicIp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
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

      {/* ROW 1.5: Real-time Device Network Status (NEW) */}
      <div className="theme-bg-card rounded-lg p-4 shadow-lg border-l-4 border-l-[var(--accent)] border theme-border">
          <h3 className="text-sm font-bold theme-text-main mb-3 flex items-center gap-2">
              <Wifi size={16} className="theme-text-accent" />
              {t('real_network_monitor')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* Online Status */}
               <div className="theme-bg-input p-3 rounded border theme-border flex items-center justify-between">
                  <div>
                      <div className="text-[10px] theme-text-muted uppercase font-bold">{t('online_status')}</div>
                      <div className={`text-sm font-bold flex items-center gap-1 ${netStats.isOnline ? 'text-green-400' : 'text-red-500'}`}>
                          {netStats.isOnline ? t('connected') : t('disconnected')}
                      </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${netStats.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
               </div>

               {/* Latency */}
               <div className="theme-bg-input p-3 rounded border theme-border flex items-center justify-between">
                  <div>
                      <div className="text-[10px] theme-text-muted uppercase font-bold">{t('latency')}</div>
                      <div className={`text-sm font-bold flex items-center gap-1 ${netStats.ping < 100 ? 'theme-text-accent' : 'text-yellow-500'}`}>
                          {netStats.ping} ms
                      </div>
                  </div>
                  <Activity size={16} className="text-slate-600" />
               </div>

               {/* Bandwidth */}
               <div className="theme-bg-input p-3 rounded border theme-border flex items-center justify-between">
                  <div>
                      <div className="text-[10px] theme-text-muted uppercase font-bold">{t('bandwidth')}</div>
                      <div className="text-sm font-bold flex items-center gap-1 text-cyan-400">
                          {netStats.downlink} Mbps
                      </div>
                  </div>
                  <ArrowDown size={16} className="text-slate-600" />
               </div>

               {/* Type */}
               <div className="theme-bg-input p-3 rounded border theme-border flex items-center justify-between">
                  <div>
                      <div className="text-[10px] theme-text-muted uppercase font-bold">{t('connection_type')}</div>
                      <div className="text-sm font-bold flex items-center gap-1 text-purple-400">
                          {netStats.effectiveType.toUpperCase()}
                      </div>
                  </div>
                  <Signal size={16} className="text-slate-600" />
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
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${sys.threatLevel > 70 ? 'bg-red-500' : sys.threatLevel > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} 
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
         {/* Attack Vectors Bar Chart */}
         <div className="theme-bg-card p-6 rounded-lg shadow-lg border theme-border">
            <h3 className="text-lg font-bold theme-text-main mb-6">{t('attack_vector_dist')}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackVectorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.colors.border} vertical={false} />
                  <XAxis dataKey="name" stroke={currentTheme.colors.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={currentTheme.colors.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: currentTheme.colors.bgCard, borderColor: currentTheme.colors.border, color: currentTheme.colors.textMain }}
                    itemStyle={{ color: currentTheme.colors.textMain }}
                  />
                  <Bar dataKey="count" fill={currentTheme.colors.accent} radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Traffic Stats Pie Chart */}
         <div className="theme-bg-card p-6 rounded-lg shadow-lg border theme-border">
            <h3 className="text-lg font-bold theme-text-main mb-6">{t('traffic_analysis_chart')}</h3>
            <div className="h-[300px] w-full flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={trafficStatsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {trafficStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={currentTheme.colors.chartColors[index % currentTheme.colors.chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: currentTheme.colors.bgCard, borderColor: currentTheme.colors.border, borderRadius: '8px' }}
                        itemStyle={{ color: currentTheme.colors.textMain }}
                    />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {trafficStatsData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs theme-text-muted">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.colors.chartColors[index % currentTheme.colors.chartColors.length] }}></div>
                        {entry.name}
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* ROW 4: System Logs / Activity */}
      <div className="theme-bg-card rounded-lg border theme-border overflow-hidden">
           <div className="p-4 border-b theme-border bg-slate-900/10">
               <h3 className="font-bold theme-text-main text-sm uppercase tracking-wider">{t('recent_system_activity')}</h3>
           </div>
           <div className="max-h-[300px] overflow-y-auto">
               <table className="w-full text-left" dir={t('dir') as string}>
                   <thead className="theme-bg-input theme-text-muted text-xs uppercase font-medium sticky top-0">
                       <tr>
                           <th className="px-6 py-3">{t('user')}</th>
                           <th className="px-6 py-3">{t('action')}</th>
                           <th className="px-6 py-3">{t('details')}</th>
                           <th className="px-6 py-3 text-right">{t('timestamp')}</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y theme-border theme-bg-card">
                       {activityLogs.slice(0, 10).map((log) => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-3 theme-text-main font-medium text-xs">
                                  {log.userName}
                              </td>
                              <td className="px-6 py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-mono 
                                      ${log.action.includes('DELETE') || log.action.includes('BLOCK') ? 'bg-red-500/20 text-red-400' : 
                                        log.action.includes('ADD') || log.action.includes('LOGIN') ? 'bg-green-500/20 text-green-400' : 
                                        'theme-bg-input theme-text-accent'}`}>
                                      {log.action}
                                  </span>
                              </td>
                              <td className="px-6 py-3 theme-text-muted text-xs">{log.details}</td>
                              <td className="px-6 py-3 text-right theme-text-muted text-xs font-mono">
                                  {new Date(log.timestamp).toLocaleString()}
                              </td>
                          </tr>
                       ))}
                   </tbody>
               </table>
           </div>
      </div>

    </div>
  );
};