import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';
import { Terminal, Pause, Play, AlertTriangle, Lock } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const LiveMonitor: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { currentTheme } = useTheme();
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  const isViewer = currentUser?.role === 'VIEWER';

  // Simulation Data
  const sources = ['192.168.1.105', '10.0.0.5', '45.33.22.11', '172.16.0.4', '203.0.113.45'];
  const destinations = ['192.168.1.1 (Gateway)', '10.2.4.5 (DB_Server)', '10.2.4.6 (Web_App)'];
  const messages = [
    { msg: 'ET POLICY Python-urllib/3.x User-Agent', severity: 'INFO', target: 'General' },
    { msg: 'ET SCAN Nmap Scripting Engine User-Agent', severity: 'WARNING', target: 'Bank' },
    { msg: 'POTENTIAL SQL INJECTION ATTEMPT', severity: 'CRITICAL', target: 'Hospital' },
    { msg: 'SSH Failed Login Attempt (Brute Force)', severity: 'WARNING', target: 'Airport' },
    { msg: 'Outbound Traffic to Suspicious Domain', severity: 'CRITICAL', target: 'Bank' },
    { msg: 'ICMP Large Packet Detected (Possible DDoS)', severity: 'CRITICAL', target: 'Airport' },
    { msg: 'Port Scan Detected (TCP SYN)', severity: 'WARNING', target: 'Hospital' },
    { msg: 'Valid User Login: admin', severity: 'INFO', target: 'Bank' },
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        sourceIp: sources[Math.floor(Math.random() * sources.length)],
        destIp: destinations[Math.floor(Math.random() * destinations.length)],
        protocol: 'TCP',
        severity: randomMsg.severity as any,
        message: randomMsg.msg,
        target: randomMsg.target as any,
      };

      setLogs((prev) => [...prev.slice(-49), newLog]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleAnalyze = async (log: LogEntry) => {
    setSelectedLog(log);
    setAnalysis('');
    
    if (isViewer) {
        setAnalysis(t('viewer_action_restricted'));
        return;
    }

    setAnalyzing(true);
    // Pass current language to the service
    const result = await analyzeThreat(log.message, log.target, language);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Terminal View */}
      <div className="flex-1 flex flex-col theme-bg-card rounded-lg shadow-2xl overflow-hidden border theme-border">
        <div className="theme-bg-input p-3 flex justify-between items-center border-b theme-border">
          <div className="flex items-center gap-2 theme-text-accent" dir="ltr">
            <Terminal size={18} />
            <span className="font-mono text-sm font-bold">{t('terminal_title')}</span>
          </div>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="theme-text-muted hover:theme-text-main transition-colors"
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1"
          style={{ backgroundColor: currentTheme.colors.bgInput }}
          dir="ltr" 
        >
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`grid grid-cols-12 gap-2 p-1 hover:bg-white/5 cursor-pointer rounded ${log.id === selectedLog?.id ? 'bg-white/10 ring-1 ring-[var(--accent)]' : ''}`}
              onClick={() => handleAnalyze(log)}
            >
              <span className="col-span-2 theme-text-muted">{log.timestamp.split('T')[1].split('.')[0]}</span>
              <span className={`col-span-1 font-bold ${log.severity === 'CRITICAL' ? 'text-red-500' : log.severity === 'WARNING' ? 'text-yellow-500' : 'theme-text-accent'}`}>
                [{log.severity}]
              </span>
              <span className="col-span-2 text-purple-400">{log.sourceIp}</span>
              <span className="col-span-1 theme-text-muted">→</span>
              <span className="col-span-2 text-cyan-400">{log.target}</span>
              <span className="col-span-4 theme-text-main truncate">{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && <div className="theme-text-muted italic">{t('waiting_traffic')}</div>}
        </div>
      </div>

      {/* AI Analysis Side Panel */}
      <div className="w-1/3 theme-bg-card rounded-lg border theme-border flex flex-col">
        <div className="p-4 border-b theme-border theme-bg-input flex justify-between items-center">
          <h3 className="text-lg font-bold theme-text-main flex items-center gap-2">
            <span className="text-xl">✨</span> {t('ai_analysis_panel')}
          </h3>
          {isViewer && (
            <span className="text-xs theme-bg-input theme-text-muted px-2 py-1 rounded flex items-center gap-1">
                <Lock size={10} />
                {t('viewer_mode')}
            </span>
          )}
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {!selectedLog ? (
             <div className="h-full flex flex-col items-center justify-center theme-text-muted">
               <AlertTriangle size={48} className="mb-4 opacity-50" />
               <p className="text-center">{t('select_log')}</p>
             </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 theme-bg-input rounded border theme-border font-mono text-xs theme-text-main" dir="ltr">
                <p>{t('target')}: {selectedLog.target}</p>
                <p>{t('payload')}: {selectedLog.message}</p>
              </div>
              
              {analyzing ? (
                <div className="flex items-center gap-2 theme-text-accent animate-pulse">
                  <span>{t('analyzing')}</span>
                </div>
              ) : (
                <div className={`prose prose-sm ${currentTheme.type === 'dark' ? 'prose-invert' : ''} ${isViewer ? 'theme-text-muted italic' : 'theme-text-main'}`}>
                   <div className="whitespace-pre-wrap leading-relaxed">
                    {analysis}
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};