
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LIVE_MONITOR = 'LIVE_MONITOR',
  VULNERABILITY_SCAN = 'VULNERABILITY_SCAN',
  TRAFFIC_ANALYSIS = 'TRAFFIC_ANALYSIS',
  MALWARE_SCANNER = 'MALWARE_SCANNER',
  AI_ADVISOR = 'AI_ADVISOR',
  PROPOSAL_DOC = 'PROPOSAL_DOC',
  PROFILE = 'PROFILE'
}

export type UserRole = 'ADMIN' | 'ANALYST' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; 
  role: UserRole;
  avatar?: string; 
  department?: string;
  isCustomAvatar?: boolean;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string; 
  details: string;
  timestamp: string;
  ip: string; 
}

export interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'HTTP/API' | 'ERR' | 'TLSv1.3' | 'TLSv1.2' | 'SSHv2' | 'QUIC' | 'ARP' | 'ICMPv6' | 'HTTP/JSON';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  target: 'Airport' | 'Hospital' | 'Bank' | 'General';
}

export interface SystemStatus {
  name: string;
  status: 'SECURE' | 'UNDER_ATTACK' | 'VULNERABLE';
  uptime: string;
  threatLevel: number; 
}

export interface Vulnerability {
  id: string;
  cve: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  target: string;
}
