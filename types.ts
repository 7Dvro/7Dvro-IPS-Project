export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LIVE_MONITOR = 'LIVE_MONITOR',
  VULNERABILITY_SCAN = 'VULNERABILITY_SCAN',
  TRAFFIC_ANALYSIS = 'TRAFFIC_ANALYSIS',
  AI_ADVISOR = 'AI_ADVISOR',
  PROPOSAL_DOC = 'PROPOSAL_DOC'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  target: 'Airport' | 'Hospital' | 'Bank' | 'General';
}

export interface SystemStatus {
  name: string;
  status: 'SECURE' | 'UNDER_ATTACK' | 'VULNERABLE';
  uptime: string;
  threatLevel: number; // 0-100
}

export interface Vulnerability {
  id: string;
  cve: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  target: string;
}
