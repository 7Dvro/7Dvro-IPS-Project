import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LogEntry } from '../types';
import { Terminal, Pause, Play, AlertTriangle, Lock, Wifi, Activity, ArrowDown, ArrowUp, Globe, Signal, MapPin, Settings, Filter, Layers, Unlock, Eye, Database, Server, Shield, X, ListFilter, RotateCcw, Check } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Extended Interface for Deep Packet Inspection
interface PacketData extends LogEntry {
  no: number;
  ipv6_src?: string;
  ipv6_dst?: string;
  length: number;
  info: string;
  encryption: 'TLSv1.3' | 'TLSv1.2' | 'SSHv2' | 'Plaintext' | 'QUIC' | 'Unknown';
  authHeader?: string; // Basic, Bearer, etc.
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

  // Network Interface Selection
  const [selectedInterface, setSelectedInterface] = useState('wlan0');
  
  // Filtering & Sorting State
  const [captureFilter, setCaptureFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof PacketData; direction: 'asc' | 'desc' }>({ key: 'no', direction: 'asc' });

  // Real Public IP State
  const [publicIpInfo, setPublicIpInfo] = useState<{ip: string, city: string, org: string} | null>(null);
  
  // Stats
  const [netStats, setNetStats] = useState({ ping: 0, downlink: 0, effectiveType: 'unknown', isOnline: true });
  
  // Counters
  const packetCounter = useRef(1);
  const lastResourceIndex = useRef(0);

  const isViewer = currentUser?.role === 'VIEWER';

  const interfaces = [
      { id: 'wlan0', name: 'Wi-Fi 6 (802.11ax)', ip: '192.168.1.15', mac: 'A0:B1:C2:D3:E4:F5' },
      { id: 'eth0', name: 'Ethernet (Gigabit)', ip: '10.0.0.5', mac: '00:1A:2B:3C:4D:5E' },
      { id: 'tun0', name: 'VPN Tunnel (OpenVPN)', ip: '10.8.0.2', mac: 'N/A' },
      { id: 'docker0', name: 'Docker Bridge', ip: '172.17.0.1', mac: '02:42:AC:11:00:02' },
      { id: 'lo', name: 'Loopback', ip: '127.0.0.1', mac: '00:00:00:00:00:00' },
  ];

  // Logic to measure "Real" Ping
  const measurePing = async () => {
    const start = performance.now();
    try {
        await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
        return Math.round(performance.now() - start);
    } catch (e) { return 999; }
  };

  useEffect(() => {
    // 1. Fetch Real Public IP
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => setPublicIpInfo({ ip: data.ip, city: data.city, org: data.org }))
        .catch(err => console.error("IP Fetch Error", err));

    // 2. Setup Telemetry
    if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        const updateConn = () => setNetStats(prev => ({ ...prev, downlink: conn.downlink || 0, effectiveType: conn.effectiveType || 'unknown' }));
        updateConn();
        conn.addEventListener('change', updateConn);
    }

    const interval = setInterval(async () => {
        const ping = await measurePing();
        setNetStats(prev => ({ ...prev, ping, isOnline: navigator.onLine }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- TRAFFIC ENGINE ---
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newPackets: PacketData[] = [];
      const now = new Date();
      
      // A. Real Browser Traffic (Resource Timing)
      const resources = performance.getEntriesByType('resource');
      if (resources.length > lastResourceIndex.current) {
          for (let i = lastResourceIndex.current; i < resources.length; i++) {
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
                  ipv6_src: `2001:0db8:${Math.floor(Math.random()*9999)}::1`,
                  ipv6_dst: `2607:f8b0:${Math.floor(Math.random()*9999)}::200e`,
                  protocol: res.initiatorType === 'xmlhttprequest' ? 'HTTP/JSON' : 'TLSv1.3',
                  length: Math.floor(res.transferSize || (Math.random() * 1500)),
                  severity: res.duration > 1000 ? 'WARNING' : 'INFO',
                  message: `${res.initiatorType.toUpperCase()} Request to ${domain}`,
                  target: 'General',
                  info: `Application Data [${Math.round(res.duration)}ms]`,
                  encryption: isSecure ? 'TLSv1.3' : 'Plaintext',
                  authHeader: isSecure ? 'Bearer eyJhbGciOiJIUzI1Ni...' : 'None',
                  hexDump: generateHexDump(domain)
              });
          }
          lastResourceIndex.current = resources.length;
      }

      // B. Simulated Low-Level Network Traffic (ARP, TCP Handshakes, SSH, QUIC)
      if (Math.random() > 0.5) {
          const protocols = ['TCP', 'UDP', 'QUIC', 'ARP', 'SSHv2', 'ICMPv6'];
          const proto = protocols[Math.floor(Math.random() * protocols.length)];
          const srcPort = Math.floor(Math.random() * 60000) + 1024;
          const dstPort = [80, 443, 22, 53, 3389][Math.floor(Math.random() * 5)];
          
          let info = "";
          let encryption: any = "Unknown";
          let auth = "N/A";

          if (proto === 'TCP') {
              info = `${srcPort} → ${dstPort} [SYN] Seq=0 Win=65535 Len=0 MSS=1460`;
              encryption = "Plaintext";
          } else if (proto === 'SSHv2') {
              info = "Server: Key Exchange Init";
              encryption = "SSHv2";
              auth = "Pubkey/Password";
          } else if (proto === 'QUIC') {
              info = "Initial, DCID=5a3b..., PKN=1";
              encryption = "QUIC";
          } else if (proto === 'ARP') {
              info = `Who has 192.168.1.1? Tell 192.168.1.15`;
              encryption = "Plaintext";
          }

          newPackets.push({
            no: packetCounter.current++,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: now.toISOString(),
            sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
            destIp: `10.0.0.${Math.floor(Math.random() * 255)}`,
            ipv6_src: `fe80::${Math.floor(Math.random()*9999)}:${Math.floor(Math.random()*9999)}`,
            ipv6_dst: `ff02::${Math.floor(Math.random()*9)}`,
            protocol: proto as any,
            length: Math.floor(Math.random() * 1514),
            severity: proto === 'SSHv2' ? 'WARNING' : 'INFO',
            message: info,
            target: 'General',
            info: info,
            encryption: encryption,
            authHeader: auth,
            hexDump: generateHexDump(info)
          });
      }

      if (newPackets.length > 0) {
         setPackets((prev) => [...prev.slice(-200), ...newPackets]); // Keep last 200 packets for better scrolling
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isPaused, publicIpInfo, selectedInterface]);

  // --- FILTERING & SORTING LOGIC ---
  const filteredAndSortedPackets = useMemo(() => {
    let result = [...packets];

    // 1. Apply Filter
    if (captureFilter.trim()) {
        const f = captureFilter.toLowerCase().trim();
        result = result.filter(p => {
             // Wireshark-like syntax logic
             if (f.startsWith('ip.addr')) {
                 const ip = f.split('==')[1]?.trim();
                 if (!ip) return true;
                 return p.sourceIp.includes(ip) || p.destIp.includes(ip);
             }
             if (f.startsWith('ip.src')) {
                 const ip = f.split('==')[1]?.trim();
                 if (!ip) return true;
                 return p.sourceIp.includes(ip);
             }
             if (f.startsWith('ip.dst')) {
                 const ip = f.split('==')[1]?.trim();
                 if (!ip) return true;
                 return p.destIp.includes(ip);
             }
             if (f.startsWith('protocol')) {
                const proto = f.split('==')[1]?.trim();
                if (!proto) return true;
                return p.protocol.toLowerCase() === proto;
             }
             
             // Free text fallback
             return (
                 p.protocol.toLowerCase().includes(f) ||
                 p.sourceIp.toLowerCase().includes(f) ||
                 p.destIp.toLowerCase().includes(f) ||
                 p.info.toLowerCase().includes(f) ||
                 p.no.toString() === f
             );
        });
    }

    // 2. Apply Sorting
    result.sort((a, b) => {
        let aVal: any = a[sortConfig.key];
        let bVal: any = b[sortConfig.key];

        // Specific handling for Time (ISO String)
        if (sortConfig.key === 'timestamp') {
            aVal = new Date(a.timestamp).getTime();
            bVal = new Date(b.timestamp).getTime();
        }
        // Handle Strings vs Numbers
        else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return result;
  }, [packets, captureFilter, sortConfig]);

  // Auto-scroll only if not paused and not sorting by old stuff
  useEffect(() => {
    if (packetListRef.current && !selectedPacket && !isPaused && sortConfig.key === 'no' && sortConfig.direction === 'asc') {
      packetListRef.current.scrollTop = packetListRef.current.scrollHeight;
    }
  }, [filteredAndSortedPackets, selectedPacket, isPaused, sortConfig]);

  const requestSort = (key: keyof PacketData) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const generateHexDump = (str: string) => {
      let hex = "";
      const header = "0000   00 1a 2b 3c 4d 5e a0 b1 c2 d3 e4 f5 08 00 45 00   ..+<M^........E.\n0010   05 dc 1a 2b 40 00 40 06 a2 b1 c0 a8 01 0f 0a 00   ...+@.@.........\n";
      for (let i = 0; i < str.length; i++) {
          hex += str.charCodeAt(i).toString(16).padStart(2, '0') + " ";
      }
      return header + "0020   " + hex.padEnd(48, '0 0 ');
  };

  const handlePacketSelect = async (packet: PacketData) => {
      setSelectedPacket(packet);
      setAnalysis('');
      if (isViewer) {
          setAnalysis(t('viewer_action_restricted'));
      } else {
          setAnalyzing(true);
          const context = `Deep Packet Inspection: ${packet.protocol} packet on interface ${selectedInterface}. Payload size: ${packet.length} bytes. Encryption: ${packet.encryption}.`;
          const result = await analyzeThreat(packet.info, context, language);
          setAnalysis(result);
          setAnalyzing(false);
      }
  };

  // Quick Filter Chips
  const quickFilters = [
      { label: 'HTTP/S', filter: 'http' },
      { label: 'TLS', filter: 'tls' },
      { label: 'TCP', filter: 'tcp' },
      { label: 'Errors', filter: 'warning' },
      { label: 'Clear', filter: '' }
  ];

  return (
    // Height adjusted to account for App header (~8rem) and padding (~4rem) -> 12rem safety margin
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] gap-4">
      
      {/* 1. Control Bar & Interface Selector */}
      <div className="theme-bg-card p-3 rounded-lg border theme-border flex flex-col gap-3 shadow-sm shrink-0">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="p-2 bg-blue-500/10 rounded border border-blue-500/30">
                    <Settings size={20} className="text-blue-400" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] theme-text-muted uppercase font-bold">Interface</span>
                    <select 
                        value={selectedInterface}
                        onChange={(e) => { setSelectedInterface(e.target.value); setPackets([]); packetCounter.current = 1; }}
                        className="bg-transparent text-sm font-bold theme-text-main outline-none cursor-pointer"
                    >
                        {interfaces.map(iface => (
                            <option key={iface.id} value={iface.id}>{iface.id}: {iface.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>

            <div className="flex-1 w-full relative group">
                <div className={`absolute left-3 top-2.5 transition-colors ${captureFilter ? 'text-green-500' : 'text-slate-500'}`}>
                    {captureFilter ? <Check size={16} /> : <Filter size={16} />}
                </div>
                <input 
                    type="text" 
                    placeholder="Apply display filter ... (e.g. ip.addr == 192.168.1.15 || tcp)"
                    className={`w-full bg-black/20 border rounded px-10 py-2 text-xs font-mono theme-text-main focus:ring-1 outline-none transition-all ${
                        captureFilter ? 'border-green-500/50 bg-green-500/5 focus:ring-green-500' : 'theme-border focus:ring-blue-500'
                    }`}
                    value={captureFilter}
                    onChange={(e) => setCaptureFilter(e.target.value)}
                />
                {captureFilter && (
                    <button 
                        onClick={() => setCaptureFilter('')}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className={`p-2 rounded flex items-center gap-2 text-xs font-bold transition-all ${isPaused ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                    {isPaused ? "Start" : "Stop"}
                </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 items-center overflow-x-auto pb-1">
              <span className="text-[10px] theme-text-muted font-bold uppercase mr-2 flex items-center gap-1">
                  <ListFilter size={12} /> Quick Filters:
              </span>
              {quickFilters.map((qf) => (
                  <button
                      key={qf.label}
                      onClick={() => setCaptureFilter(qf.filter)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                          captureFilter === qf.filter && qf.filter !== '' 
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)]' 
                          : 'theme-bg-input theme-text-muted border-slate-700 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                      {qf.label}
                  </button>
              ))}
          </div>
      </div>

      {/* 2. Main Workspace (Split View) */}
      <div className="flex flex-1 gap-4 overflow-hidden flex-col lg:flex-row min-h-0">
          
          {/* A. Packet List (Wireshark Style) */}
          <div className="flex-1 flex flex-col theme-bg-card rounded-lg border theme-border shadow-lg overflow-hidden min-h-0">
              {/* Table Header with Sorting */}
              <div className="bg-slate-900/80 border-b theme-border flex text-[10px] uppercase font-bold theme-text-muted p-2 select-none shrink-0 sticky top-0 z-10">
                  <div onClick={() => requestSort('no')} className="w-12 text-center cursor-pointer hover:text-white flex items-center justify-center gap-1 group">
                      No. {sortConfig.key === 'no' && (sortConfig.direction === 'asc' ? <ArrowDown size={10}/> : <ArrowUp size={10}/>)}
                  </div>
                  <div onClick={() => requestSort('timestamp')} className="w-20 cursor-pointer hover:text-white flex items-center gap-1 group">
                      Time {sortConfig.key === 'timestamp' && (sortConfig.direction === 'asc' ? <ArrowDown size={10}/> : <ArrowUp size={10}/>)}
                  </div>
                  <div onClick={() => requestSort('sourceIp')} className="w-32 cursor-pointer hover:text-white flex items-center gap-1 group">
                      Source {sortConfig.key === 'sourceIp' && (sortConfig.direction === 'asc' ? <ArrowDown size={10}/> : <ArrowUp size={10}/>)}
                  </div>
                  <div onClick={() => requestSort('destIp')} className="w-32 cursor-pointer hover:text-white flex items-center gap-1 group">
                      Destination {sortConfig.key === 'destIp' && (sortConfig.direction === 'asc' ? <ArrowDown size={10}/> : <ArrowUp size={10}/>)}
                  </div>
                  <div onClick={() => requestSort('protocol')} className="w-16 cursor-pointer hover:text-white flex items-center gap-1 group">
                      Proto {sortConfig.key === 'protocol' && (sortConfig.direction === 'asc' ? <ArrowDown size={10}/> : <ArrowUp size={10}/>)}
                  </div>
                  <div onClick={() => requestSort('length')} className="w-16 text-right pr-2 cursor-pointer hover:text-white flex items-center justify-end gap-1 group">
                      Len {sortConfig.key === 'length' && (sortConfig.direction === 'asc' ? <ArrowDown size={10}/> : <ArrowUp size={10}/>)}
                  </div>
                  <div onClick={() => requestSort('info')} className="flex-1 cursor-pointer hover:text-white flex items-center gap-1 group">
                      Info {sortConfig.key === 'info' && (sortConfig.direction === 'asc' ? <ArrowDown size={10}/> : <ArrowUp size={10}/>)}
                  </div>
              </div>
              
              {/* Packet Rows */}
              <div 
                  ref={packetListRef}
                  className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f111a]"
              >
                  {filteredAndSortedPackets.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center theme-text-muted gap-2 opacity-50">
                           {captureFilter ? (
                               <>
                                 <Filter size={32} />
                                 <p className="text-xs">No packets match filter "{captureFilter}"</p>
                                 <button onClick={() => setCaptureFilter('')} className="text-xs text-blue-400 underline">Clear Filter</button>
                               </>
                           ) : (
                               <>
                                 <Activity size={32} />
                                 <p className="text-xs">Listening on {selectedInterface}...</p>
                               </>
                           )}
                      </div>
                  ) : (
                      filteredAndSortedPackets.map((pkt) => (
                          <div 
                              key={pkt.no} 
                              onClick={() => handlePacketSelect(pkt)}
                              className={`flex items-center text-[11px] font-mono p-1 border-b border-white/5 cursor-pointer hover:bg-blue-500/20 transition-colors group ${
                                  selectedPacket?.no === pkt.no ? 'bg-blue-600/30 text-white' : 'theme-text-main'
                              }`}
                          >
                              <div className="w-12 text-center opacity-70 group-hover:opacity-100">{pkt.no}</div>
                              <div className="w-20 truncate opacity-80">{pkt.timestamp.split('T')[1].slice(0, 8)}</div>
                              <div className="w-32 truncate text-cyan-400 group-hover:text-cyan-300" title={pkt.ipv6_src}>{pkt.sourceIp}</div>
                              <div className="w-32 truncate text-purple-400 group-hover:text-purple-300" title={pkt.ipv6_dst}>{pkt.destIp}</div>
                              <div className={`w-16 font-bold ${pkt.protocol.includes('TLS') ? 'text-green-400' : pkt.protocol === 'TCP' ? 'text-blue-300' : 'text-orange-300'}`}>
                                  {pkt.protocol}
                              </div>
                              <div className="w-16 text-right pr-2 opacity-70">{pkt.length}</div>
                              <div className="flex-1 truncate opacity-90 flex items-center gap-2">
                                   {pkt.severity === 'WARNING' && <AlertTriangle size={10} className="text-yellow-500" />}
                                   {pkt.info}
                              </div>
                          </div>
                      ))
                  )}
              </div>
              
              {/* Status Bar */}
              <div className="bg-slate-900 border-t theme-border p-1 text-[10px] theme-text-muted flex justify-between px-3 shrink-0">
                  <span>Displayed: {filteredAndSortedPackets.length} / Total: {packets.length}</span>
                  <span>Interface: {selectedInterface} ({publicIpInfo?.ip})</span>
                  <span>Profile: Professional Analysis</span>
              </div>
          </div>

          {/* B. Deep Inspection Panel */}
          <div className="lg:w-[400px] flex flex-col gap-4 min-h-0 h-1/2 lg:h-auto">
              
              {/* Packet Details */}
              <div className="flex-1 theme-bg-card rounded-lg border theme-border overflow-hidden flex flex-col min-h-0">
                  <div className="p-3 border-b theme-border bg-slate-900/50 flex justify-between items-center shrink-0">
                      <h3 className="text-xs font-bold theme-text-main flex items-center gap-2">
                          <Eye size={14} className="theme-text-accent" />
                          Packet Details
                      </h3>
                      {selectedPacket && <span className="text-[10px] theme-text-muted">#{selectedPacket.no}</span>}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                      {!selectedPacket ? (
                          <div className="h-full flex flex-col items-center justify-center theme-text-muted opacity-50 text-center">
                              <Layers size={48} className="mb-2" />
                              <p className="text-xs">Select a packet to inspect headers, payload, and security details.</p>
                          </div>
                      ) : (
                          <div className="space-y-4">
                              {/* Layer 1: Frame */}
                              <div className="space-y-1">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                      <Globe size={10} /> Frame {selectedPacket.no}
                                  </div>
                                  <div className="text-xs theme-text-main pl-3 border-l-2 border-slate-700">
                                      {selectedPacket.length} bytes on wire ({selectedPacket.length * 8} bits)
                                  </div>
                              </div>

                              {/* Layer 2/3: IP */}
                              <div className="space-y-1">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                      <Server size={10} /> Internet Protocol
                                  </div>
                                  <div className="text-xs theme-text-main pl-3 border-l-2 border-slate-700 font-mono">
                                      <div className="flex justify-between"><span>Src:</span> <span className="text-cyan-400">{selectedPacket.sourceIp}</span></div>
                                      <div className="flex justify-between"><span>Dst:</span> <span className="text-purple-400">{selectedPacket.destIp}</span></div>
                                      <div className="flex justify-between mt-1 opacity-70"><span>IPv6 Src:</span> <span>{selectedPacket.ipv6_src}</span></div>
                                  </div>
                              </div>

                              {/* Layer 4: Transport/App */}
                              <div className="space-y-1">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                      <Database size={10} /> {selectedPacket.protocol}
                                  </div>
                                  <div className="text-xs theme-text-main pl-3 border-l-2 border-slate-700">
                                      <div className={`flex items-center gap-2 font-bold ${selectedPacket.encryption.includes('TLS') || selectedPacket.encryption.includes('SSH') ? 'text-green-400' : 'text-red-400'}`}>
                                          {selectedPacket.encryption.includes('TLS') || selectedPacket.encryption.includes('SSH') ? <Lock size={12} /> : <Unlock size={12} />}
                                          {selectedPacket.encryption}
                                      </div>
                                      <div className="mt-1">Auth Header: <span className="font-mono bg-white/10 px-1 rounded">{selectedPacket.authHeader}</span></div>
                                  </div>
                              </div>

                              {/* Payload Hex Dump */}
                              <div className="mt-4 pt-4 border-t theme-border">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Payload (Hex)</div>
                                  <pre className="text-[10px] font-mono bg-black/40 p-2 rounded text-slate-400 whitespace-pre-wrap break-all leading-tight">
                                      {selectedPacket.hexDump}
                                  </pre>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* AI Analysis (Mini) */}
              <div className="h-48 theme-bg-card rounded-lg border theme-border flex flex-col shrink-0">
                  <div className="p-2 border-b theme-border bg-purple-500/5 flex justify-between items-center shrink-0">
                       <h3 className="text-xs font-bold theme-text-main flex items-center gap-2">
                          <Shield size={14} className="text-purple-400" /> AI Inspector
                       </h3>
                       {analyzing && <span className="text-[10px] animate-pulse theme-text-accent">Analyzing...</span>}
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto text-xs theme-text-main">
                      {!selectedPacket ? (
                          <span className="theme-text-muted italic">Waiting for selection...</span>
                      ) : (
                          analyzing ? "Gemini AI is inspecting packet structure..." : (
                              analysis || "Select a packet to analyze threats."
                          )
                      )}
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};