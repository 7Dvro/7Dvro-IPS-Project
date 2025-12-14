import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SessionContextType {
  // Traffic Analyzer State
  trafficInput: string;
  setTrafficInput: (val: string) => void;
  trafficReport: string | null;
  setTrafficReport: (val: string | null) => void;

  // Vulnerability Scanner State
  vulnMode: 'SIMULATION' | 'FILE';
  setVulnMode: (val: 'SIMULATION' | 'FILE') => void;
  vulnTarget: string;
  setVulnTarget: (val: string) => void;
  vulnFileContent: string | null;
  setVulnFileContent: (val: string | null) => void;
  vulnReport: string | null;
  setVulnReport: (val: string | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Traffic Analyzer Defaults
  const [trafficInput, setTrafficInput] = useState('');
  const [trafficReport, setTrafficReport] = useState<string | null>(null);

  // Vulnerability Scanner Defaults
  const [vulnMode, setVulnMode] = useState<'SIMULATION' | 'FILE'>('SIMULATION');
  const [vulnTarget, setVulnTarget] = useState('Hospital Infrastructure (Sudan - Khartoum)');
  const [vulnFileContent, setVulnFileContent] = useState<string | null>(null);
  const [vulnReport, setVulnReport] = useState<string | null>(null);

  return (
    <SessionContext.Provider value={{
      trafficInput, setTrafficInput,
      trafficReport, setTrafficReport,
      vulnMode, setVulnMode,
      vulnTarget, setVulnTarget,
      vulnFileContent, setVulnFileContent,
      vulnReport, setVulnReport
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
