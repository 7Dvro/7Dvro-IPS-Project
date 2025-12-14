import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
      <div className="p-8 space-y-8">
        <header className="text-center border-b border-slate-700 pb-6">
          <div className="text-slate-400 text-sm mb-2">بسم الله الرحمن الرحيم</div>
          <h1 className="text-2xl font-bold text-white mb-1">{t('university')}</h1>
          <h2 className="text-xl text-slate-300">{t('college')}</h2>
          <div className="mt-8 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <h3 className="text-lg font-bold text-blue-400 mb-2">{t('proposal_title')}</h3>
            <p className="text-xl font-bold text-white leading-relaxed">
              {t('proposal_name')}
            </p>
            <p className="text-sm text-slate-400 mt-2 font-mono" dir="ltr">
              Designing an Intelligent System for Cyber Attack Detection and Vulnerability Assessment in Sudan’s Critical Infrastructure
            </p>
            <p className="text-slate-400 mt-4 text-sm">{t('prepared_by')}</p>
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-blue-400 border-r-4 border-blue-500 pr-3">{t('intro')}</h3>
          <p className="text-slate-300 leading-relaxed text-lg">
            {t('intro_text')}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-blue-400 border-r-4 border-blue-500 pr-3">{t('problem')}</h3>
          <p className="text-slate-300 leading-relaxed text-lg">
            {t('problem_text')}
          </p>
        </section>
        
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-blue-400 border-r-4 border-blue-500 pr-3">{t('objectives')}</h3>
          <ul className="list-disc list-inside text-slate-300 leading-loose space-y-2 text-lg">
             <li>{t('obj_1')}</li>
             <li>{t('obj_2')}</li>
             <li>{t('obj_3')}</li>
             <li>{t('obj_4')}</li>
             <li>{t('obj_5')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-blue-400 border-r-4 border-blue-500 pr-3">{t('tools')}</h3>
          <div className="grid grid-cols-2 gap-4 text-slate-300" dir="ltr">
             <div className="bg-slate-900 p-3 rounded border border-slate-700">OS: Kali Linux, Ubuntu</div>
             <div className="bg-slate-900 p-3 rounded border border-slate-700">Network: Wireshark, tcpdump</div>
             <div className="bg-slate-900 p-3 rounded border border-slate-700">Pentest: Metasploit, Nmap</div>
             <div className="bg-slate-900 p-3 rounded border border-slate-700">AI: Python (Scikit-learn / TensorFlow)</div>
             <div className="bg-slate-900 p-3 rounded border border-slate-700">IDS: Snort, Suricata</div>
             <div className="bg-slate-900 p-3 rounded border border-slate-700">Sim: VirtualBox / VMware</div>
          </div>
        </section>
      </div>
    </div>
  );
};
