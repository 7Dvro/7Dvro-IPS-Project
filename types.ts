export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LIVE_MONITOR = 'LIVE_MONITOR',
  VULNERABILITY_SCAN = 'VULNERABILITY_SCAN',
  TRAFFIC_ANALYSIS = 'TRAFFIC_ANALYSIS',
  AI_ADVISOR = 'AI_ADVISOR',
  PROPOSAL_DOC = 'PROPOSAL_DOC',
  PROFILE = 'PROFILE'
}

export type UserRole = 'ADMIN' | 'ANALYST' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used for verification/creation, not stored in plain text in real app (simulated here)
  role: UserRole;
  avatar?: string; // Can be Initials (string) or Base64 Image URL
  department?: string;
  isCustomAvatar?: boolean;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string; // e.g., 'LOGIN', 'SCAN_STARTED', 'USER_ADDED'
  details: string;
  timestamp: string;
  ip: string; // Simulated
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