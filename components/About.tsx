import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto theme-bg-card rounded-lg shadow-xl overflow-hidden border theme-border">
      <div className="p-8 space-y-8">
        <header className="text-center border-b theme-border pb-6">
          <div className="theme-text-muted text-sm mb-2">بسم الله الرحمن الرحيم</div>
          <h1 className="text-2xl font-bold theme-text-main mb-1">{t('university')}</h1>
          <h2 className="text-xl theme-text-muted">{t('college')}</h2>
          <div className="mt-8 p-4 theme-bg-input rounded-lg border theme-border">
            <h3 className="text-lg font-bold theme-text-accent mb-2">{t('proposal_title')}</h3>
            <p className="text-xl font-bold theme-text-main leading-relaxed">
              {t('proposal_name')}
            </p>
            <p className="text-sm theme-text-muted mt-2 font-mono" dir="ltr">
              Designing an Intelligent System for Cyber Attack Detection and Vulnerability Assessment in Sudan’s Critical Infrastructure
            </p>
            <p className="theme-text-muted mt-4 text-sm">{t('prepared_by')}</p>
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold theme-text-accent border-r-4 border-[var(--accent)] pr-3">{t('intro')}</h3>
          <p className="theme-text-main leading-relaxed text-lg">
            {t('intro_text')}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold theme-text-accent border-r-4 border-[var(--accent)] pr-3">{t('problem')}</h3>
          <p className="theme-text-main leading-relaxed text-lg">
            {t('problem_text')}
          </p>
        </section>
        
        <section className="space-y-4">
          <h3 className="text-xl font-bold theme-text-accent border-r-4 border-[var(--accent)] pr-3">{t('objectives')}</h3>
          <ul className="list-disc list-inside theme-text-main leading-loose space-y-2 text-lg">
             <li>{t('obj_1')}</li>
             <li>{t('obj_2')}</li>
             <li>{t('obj_3')}</li>
             <li>{t('obj_4')}</li>
             <li>{t('obj_5')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold theme-text-accent border-r-4 border-[var(--accent)] pr-3">{t('tools')}</h3>
          <div className="grid grid-cols-2 gap-4 theme-text-main" dir="ltr">
             <div className="theme-bg-input p-3 rounded border theme-border">OS: Kali Linux, Ubuntu</div>
             <div className="theme-bg-input p-3 rounded border theme-border">Network: Wireshark, tcpdump</div>
             <div className="theme-bg-input p-3 rounded border theme-border">Pentest: Metasploit, Nmap</div>
             <div className="theme-bg-input p-3 rounded border theme-border">AI: Python (Scikit-learn / TensorFlow)</div>
             <div className="theme-bg-input p-3 rounded border theme-border">IDS: Snort, Suricata</div>
             <div className="theme-bg-input p-3 rounded border theme-border">Sim: VirtualBox / VMware</div>
          </div>
        </section>
      </div>
    </div>
  );
};