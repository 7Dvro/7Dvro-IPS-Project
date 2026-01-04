
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LogEntry } from '../types';
import { Terminal, Pause, Play, AlertTriangle, Lock, Wifi, Activity, ArrowDown, ArrowUp, Globe, Signal, MapPin, Settings, Filter, Layers, Unlock, Eye, Database, Server, Shield, X, ListFilter, RotateCcw, Check, Menu } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface PacketData extends LogEntry {
  no: number;
  ipv6_src?: string;
  ipv6_dst?: string;
  length: number;
  info: string;
  encryption: 'TLSv1.3' | 'TLSv1.2' | 'SSHv2' | 'Plaintext' | 'QUIC' | 'Unknown';
  authHeader?: string;
  hexDump?: string;
}

export const LiveMonitor: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { currentTheme } = useTheme();
  
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const packetListRef = useRef<HTMLDivElement>(null);

  const [selectedInterface, setSelectedInterface] = useState('wlan0');
  const [captureFilter, setCaptureFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof PacketData; direction: 'asc' | 'desc' }>({ key: 'no', direction: 'asc' });
  const [publicIpInfo, setPublicIpInfo] = useState<{ip: string, city: string, org: string} | null>(null);
  
  const packetCounter = useRef(1);
  const lastResourceIndex = useRef(0);
  const isViewer = currentUser?.role === 'VIEWER';

  const interfaces = [
      { id: 'wlan0', name: 'Wi-Fi 6', ip: '192.168.1.15' },
      { id: 'eth0', name: 'Ethernet', ip: '10.0.0.5' },
      { id: 'tun0', name: 'VPN', ip: '10.8.0.2' },
  ];

  useEffect(() => {
    const fetchIp = async () => {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            if (res.ok) {
                const data = await res.json();
                setPublicIpInfo({ ip: data.ip, city: 'Khartoum', org: 'Local ISP' });
            }
        } catch (e) {
            setPublicIpInfo({ ip: '196.1.200.1', city: 'Sudan', org: 'Telecom' });
        }
    };
    fetchIp();
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newPackets: PacketData[] = [];
      const now = new Date();
      
      const resources = performance.getEntriesByType('resource');
      if (resources.length > lastResourceIndex.current) {
          const start = lastResourceIndex.current;
          const end = Math.min(resources.length, start + 3); // Take few at a time
          for (let i = start; i < end; i++) {
              const res = resources[i] as PerformanceResourceTiming;
              let domain = 'unknown';
              try { domain = new URL(res.name).hostname; } catch(e) {}
              const isSecure = res.name.startsWith('https');
              
              newPackets.push({
                  no: packetCounter.current++,
                  id: Math.random().toString(36).substr(2, 9),
                  timestamp: now.toISOString(),
                  sourceIp: publicIpInfo?.ip || '192.168.1.15',
                  destIp: domain,
                  protocol: res.initiatorType === 'xmlhttprequest' ? 'HTTP/JSON' : 'TLSv1.3',
                  length: Math.floor(res.transferSize || (Math.random() * 1500)),
                  severity: 'INFO',
                  message: `${res.initiatorType.toUpperCase()} Request`,
                  target: 'General',
                  info: `Application Data [${Math.round(res.duration)}ms]`,
                  encryption: isSecure ? 'TLSv1.3' : 'Plaintext',
                  hexDump: "0000 00 1a 2b 3c..."
              });
          }
          lastResourceIndex.current = resources.length;
      }

      if (Math.random() > 0.6) {
          newPackets.push({
            no: packetCounter.current++,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: now.toISOString(),
            sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
            destIp: `10.0.0.${Math.floor(Math.random() * 255)}`,
            protocol: 'TCP',
            length: Math.floor(Math.random() * 1500),
            severity: 'INFO',
            message: 'TCP Control',
            target: 'General',
            info: `SYN ACK win=65535`,
            encryption: 'Plaintext',
            hexDump: "0000 00 1a 2b 3c..."
          });
      }

      if (newPackets.length > 0) {
         setPackets((prev) => [...prev.slice(-100), ...newPackets]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, publicIpInfo]);

  const filteredAndSortedPackets = useMemo(() => {
    let result = [...packets];
    if (captureFilter.trim()) {
        const f = captureFilter.toLowerCase().trim();
        result = result.filter(p => p.protocol.toLowerCase().includes(f) || p.sourceIp.includes(f) || p.destIp.includes(f) || p.info.toLowerCase().includes(f));
    }
    result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
    return result;
  }, [packets, captureFilter, sortConfig]);

  useEffect(() => {
    if (packetListRef.current && !selectedPacket && !isPaused) {
      packetListRef.current.scrollTop = packetListRef.current.scrollHeight;
    }
  }, [filteredAndSortedPackets, selectedPacket, isPaused]);

  const handlePacketSelect = async (packet: PacketData) => {
      setSelectedPacket(packet);
      setAnalysis('');
      if (isViewer) {
          setAnalysis(t('viewer_action_restricted'));
      } else {
          setAnalyzing(true);
          const result = await analyzeThreat(packet.info, `Protocol: ${packet.protocol}, Length: ${packet.length}`, language);
          setAnalysis(result);
          setAnalyzing(false);
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] md:h-[calc(100vh-12rem)] gap-4 overflow-hidden">
      
      {/* Control Bar */}
      <div className="theme-bg-card p-2 md:p-3 rounded-lg border theme-border flex flex-col gap-2 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
                <select 
                    value={selectedInterface}
                    onChange={(e) => { setSelectedInterface(e.target.value); setPackets([]); }}
                    className="bg-transparent text-[10px] md:text-xs font-bold theme-text-main outline-none border theme-border rounded px-2 py-1"
                >
                    {interfaces.map(iface => <option key={iface.id} value={iface.id}>{iface.id}</option>)}
                </select>
                <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className={`p-1.5 rounded transition-all ${isPaused ? 'bg-green-600 text-white' : 'bg-red-500/20 text-red-400'}`}
                >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                </button>
            </div>

            <div className="flex-1 relative">
                <input 
                    type="text" 
                    placeholder="Filter..."
                    className="w-full bg-black/20 border theme-border rounded px-3 py-1 text-[10px] md:text-xs font-mono theme-text-main outline-none"
                    value={captureFilter}
                    onChange={(e) => setCaptureFilter(e.target.value)}
                />
            </div>
          </div>
      </div>

      {/* Main split view */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 min-h-0 overflow-hidden">
          
          <div className="flex-1 flex flex-col theme-bg-card rounded-lg border theme-border overflow-hidden min-h-[300px]">
              <div className="bg-slate-900 border-b theme-border flex text-[9px] uppercase font-bold theme-text-muted p-2 sticky top-0 z-10">
                  <div className="w-10 text-center">No.</div>
                  <div className="w-24 px-2">Source</div>
                  <div className="w-24 px-2">Dest</div>
                  <div className="w-12">Proto</div>
                  <div className="flex-1">Info</div>
              </div>
              
              <div ref={packetListRef} className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f111a]">
                  {filteredAndSortedPackets.map((pkt) => (
                      <div 
                          key={pkt.no} 
                          onClick={() => handlePacketSelect(pkt)}
                          className={`flex items-center text-[10px] font-mono p-1.5 border-b border-white/5 cursor-pointer hover:bg-blue-500/10 transition-colors ${selectedPacket?.no === pkt.no ? 'bg-blue-600/20 text-white' : 'theme-text-main'}`}
                      >
                          <div className="w-10 text-center opacity-60">{pkt.no}</div>
                          <div className="w-24 px-2 truncate text-cyan-400">{pkt.sourceIp}</div>
                          <div className="w-24 px-2 truncate text-purple-400">{pkt.destIp}</div>
                          <div className="w-12 font-bold">{pkt.protocol}</div>
                          <div className="flex-1 truncate opacity-80">{pkt.info}</div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="lg:w-[350px] flex flex-col gap-4 shrink-0 h-[40%] lg:h-full">
              <div className="flex-1 theme-bg-card rounded-lg border theme-border overflow-hidden flex flex-col min-h-0">
                  <div className="p-2 border-b theme-border bg-slate-900/50 flex justify-between items-center shrink-0">
                      <h3 className="text-[10px] font-bold theme-text-main flex items-center gap-2 uppercase tracking-wider">
                          <Eye size={12} className="theme-text-accent" />
                          Packet Detail
                      </h3>
                      {selectedPacket && <button onClick={() => setSelectedPacket(null)} className="lg:hidden p-1 rounded hover:bg-white/10"><X size={12} /></button>}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 text-[10px] md:text-xs theme-text-main">
                      {!selectedPacket ? (
                          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-2">
                              <Layers size={32} />
                              <p>Select a packet</p>
                          </div>
                      ) : (
                          <div className="space-y-4">
                              <div className="p-2 bg-black/20 rounded border theme-border font-mono space-y-1">
                                  <div className="flex justify-between"><span>Source:</span> <span className="text-cyan-400">{selectedPacket.sourceIp}</span></div>
                                  <div className="flex justify-between"><span>Destination:</span> <span className="text-purple-400">{selectedPacket.destIp}</span></div>
                                  <div className="flex justify-between"><span>Protocol:</span> <span className="text-yellow-400 font-bold">{selectedPacket.protocol}</span></div>
                                  <div className="flex justify-between"><span>Length:</span> <span>{selectedPacket.length} bytes</span></div>
                              </div>
                              <div className="space-y-1">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase">AI Security Verdict:</div>
                                  <div className="p-2 bg-purple-500/5 border border-purple-500/20 rounded min-h-[60px]">
                                      {analyzing ? <Activity className="animate-spin text-purple-400 mx-auto" size={16} /> : analysis || "Analyzing..."}
                                  </div>
                              </div>
                              <div className="space-y-1">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase">Payload (Hex View):</div>
                                  <pre className="p-2 bg-black rounded text-[9px] font-mono text-slate-400 leading-tight whitespace-pre-wrap truncate">
                                      {selectedPacket.hexDump}
                                  </pre>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};
