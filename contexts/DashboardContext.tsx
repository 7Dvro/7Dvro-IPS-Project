import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ChartData {
  name: string;
  count: number;
}

interface DashboardContextType {
  attackVectorData: ChartData[];
  trafficStatsData: ChartData[];
  updateDashboardStats: (aiResponse: string) => void;
}

const defaultAttackVectors = [
  { name: 'DDoS', count: 120 },
  { name: 'SQL Injection', count: 85 },
  { name: 'Brute Force', count: 90 },
  { name: 'Malware', count: 45 },
  { name: 'Phishing', count: 30 },
];

const defaultTrafficStats = [
  { name: 'HTTP/HTTPS', count: 450 },
  { name: 'DNS', count: 120 },
  { name: 'TCP', count: 300 },
  { name: 'UDP', count: 150 },
  { name: 'ICMP', count: 80 },
];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attackVectorData, setAttackVectorData] = useState<ChartData[]>(defaultAttackVectors);
  const [trafficStatsData, setTrafficStatsData] = useState<ChartData[]>(defaultTrafficStats);

  const updateDashboardStats = (aiResponse: string) => {
    try {
      // Extract JSON block from AI response (looking for ```json ... ```)
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      
      if (jsonMatch && jsonMatch[1]) {
        const parsedData = JSON.parse(jsonMatch[1]);
        
        if (parsedData.attack_vectors) {
          const newVectors = Object.entries(parsedData.attack_vectors).map(([name, count]) => ({
            name,
            count: Number(count),
          }));
          if (newVectors.length > 0) setAttackVectorData(newVectors);
        }

        if (parsedData.traffic_stats) {
          const newStats = Object.entries(parsedData.traffic_stats).map(([name, count]) => ({
            name,
            count: Number(count),
          }));
          if (newStats.length > 0) setTrafficStatsData(newStats);
        }
      }
    } catch (e) {
      console.error("Failed to parse AI stats:", e);
    }
  };

  return (
    <DashboardContext.Provider value={{ attackVectorData, trafficStatsData, updateDashboardStats }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
