import React from 'react';
import { SystemStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldCheck, ShieldAlert, Activity, Server } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  systems: SystemStatus[];
}

const data = [
  { name: 'DDoS', count: 400 },
  { name: 'SQL Injection', count: 300 },
  { name: 'Brute Force', count: 300 },
  { name: 'Malware', count: 200 },
  { name: 'Phishing', count: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC<DashboardProps> = ({ systems }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {systems.map((sys) => (
          <div key={sys.name} className={`p-6 rounded-lg border ${sys.status === 'SECURE' ? 'border-green-500/30 bg-green-500/10' : sys.status === 'UNDER_ATTACK' ? 'border-red-500/30 bg-red-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Server size={20} />
                {sys.name}
              </h3>
              {sys.status === 'SECURE' ? <ShieldCheck className="text-green-400" /> : <ShieldAlert className="text-red-400 animate-pulse" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>{t('status')}</span>
                <span className={`font-mono font-bold ${sys.status === 'SECURE' ? 'text-green-400' : 'text-red-400'}`}>{sys.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>{t('uptime')}</span>
                <span className="font-mono text-white">{sys.uptime}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t('threat_level')}</span>
                  <span>{sys.threatLevel}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${sys.threatLevel > 70 ? 'bg-red-500' : 'bg-blue-500'}`} 
                    style={{ width: `${sys.threatLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={18} />
            {t('attack_vector_dist')}
          </h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">{t('traffic_analysis_chart')}</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                />
              </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
