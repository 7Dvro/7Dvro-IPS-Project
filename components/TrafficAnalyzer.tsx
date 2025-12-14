import React, { useState } from 'react';
import { analyzeTrafficBatch } from '../services/geminiService';
import { FileSearch, Upload, FileText, Download, CheckCircle, Brain, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDashboard } from '../contexts/DashboardContext';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const TrafficAnalyzer: React.FC = () => {
  const { t, language } = useLanguage();
  const { updateDashboardStats } = useDashboard();
  const { trafficInput, setTrafficInput, trafficReport, setTrafficReport } = useSession();
  const { logAction, currentUser } = useAuth();
  const { currentTheme } = useTheme();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPdfPrompt, setShowPdfPrompt] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Authorization Check
  if (currentUser?.role === 'VIEWER') {
      return (
          <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
              <div className="text-center theme-bg-card p-8 rounded-lg border theme-border max-w-md">
                  <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold theme-text-main mb-2">{t('access_denied')}</h2>
                  <p className="theme-text-muted">{t('access_denied_desc')}</p>
              </div>
          </div>
      );
  }

  const handleAnalyze = async () => {
    if (!trafficInput.trim()) return;
    
    setIsAnalyzing(true);
    setTrafficReport(null);
    setShowPdfPrompt(false);

    // Pass language to service
    const result = await analyzeTrafficBatch(trafficInput, language);
    
    // Update global dashboard context with the new stats from AI
    updateDashboardStats(result);

    setTrafficReport(result);
    setIsAnalyzing(false);
    
    logAction('TRAFFIC_ANALYSIS', `Analyzed traffic batch (Length: ${trafficInput.length} chars)`);

    // Show PDF prompt after a short delay
    setTimeout(() => {
      setShowPdfPrompt(true);
    }, 1000);
  };

  const loadSampleData = () => {
    const sample = `TIMESTAMP,SOURCE_IP,DEST_IP,PROTOCOL,PAYLOAD
2023-10-15 14:01:22,192.168.1.55,10.0.0.5,TCP,"GET /admin/login HTTP/1.1"
2023-10-15 14:01:23,192.168.1.55,10.0.0.5,TCP,"POST /admin/login user=admin&pass=' OR '1'='1"
2023-10-15 14:01:25,192.168.1.55,10.0.0.5,TCP,"SELECT * FROM users"
2023-10-15 14:02:00,45.33.22.11,10.0.0.2,UDP,"Large Packet Size: 65500 bytes"
2023-10-15 14:02:01,45.33.22.11,10.0.0.2,UDP,"Large Packet Size: 65500 bytes"
2023-10-15 14:02:02,45.33.22.11,10.0.0.2,UDP,"Large Packet Size: 65500 bytes"
2023-10-15 14:05:00,10.0.0.105,8.8.8.8,DNS,"Standard Query"`;
    setTrafficInput(sample);
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    // Add small delay to allow UI to update before printing
    setTimeout(() => {
        window.print();
        setIsDownloading(false);
        setShowPdfPrompt(false);
        logAction('DOWNLOAD_REPORT', 'Downloaded Traffic Analysis PDF');
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="theme-bg-card p-6 rounded-lg border theme-border no-print">
        <h2 className="text-2xl font-bold theme-text-main flex items-center gap-2 mb-2">
          <FileSearch className="theme-text-accent" />
          {t('batch_title')}
        </h2>
        <p className="theme-text-muted text-sm">
          {t('batch_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="theme-bg-input p-6 rounded-lg border theme-border flex flex-col h-[600px] no-print">
          <div className="flex justify-between items-center mb-4">
            <label className="theme-text-muted font-bold text-sm flex items-center gap-2">
              <FileText size={16} />
              {t('input_logs')}
            </label>
            <button 
              onClick={loadSampleData}
              className="text-xs theme-text-accent hover:underline"
            >
              {t('load_sample')}
            </button>
          </div>
          
          <textarea
            value={trafficInput}
            onChange={(e) => setTrafficInput(e.target.value)}
            className="flex-1 w-full bg-black/20 theme-text-main font-mono text-xs p-4 rounded border theme-border theme-ring-focus outline-none resize-none mb-4"
            dir="ltr"
            placeholder={t('paste_placeholder')}
          ></textarea>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !trafficInput}
            className={`w-full py-3 rounded font-bold text-white flex justify-center items-center gap-2 transition-all ${
              isAnalyzing || !trafficInput 
              ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
              : 'theme-btn-primary'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Brain className="animate-pulse" />
                {t('analyzing_btn')}
              </>
            ) : (
              <>
                <Upload size={18} />
                {t('analyze_btn')}
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="theme-bg-card p-6 rounded-lg border theme-border flex flex-col h-[600px] overflow-hidden relative">
          <h3 className="text-lg font-bold theme-text-main mb-4 border-b theme-border pb-2 no-print">{t('analysis_report')}</h3>
          
          {/* Header visible ONLY in print */}
          <div className="hidden print:block mb-6 border-b border-black pb-4">
            <h1 className="text-2xl font-bold mb-2">{t('batch_title')}</h1>
            <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {!trafficReport ? (
              <div className="h-full flex flex-col items-center justify-center theme-text-muted space-y-4">
                <FileSearch size={64} className="opacity-20" />
                <p className="text-center text-sm max-w-xs">
                  {t('awaiting_data')}
                </p>
              </div>
            ) : (
              <div className={`prose prose-sm max-w-none ${currentTheme.type === 'dark' ? 'prose-invert' : ''}`}>
                 <div className="whitespace-pre-wrap theme-text-main leading-relaxed">
                   {trafficReport}
                 </div>
              </div>
            )}
          </div>

          {/* Persistent Download Button */}
          {trafficReport && (
            <div className="mt-4 pt-2 border-t theme-border flex justify-end no-print">
               <button 
                 onClick={() => window.print()}
                 className="px-4 py-2 theme-btn-primary rounded text-sm font-bold flex items-center gap-2 transition-colors"
               >
                 <Download size={16} />
                 {t('download_report')}
               </button>
            </div>
          )}

          {/* PDF Prompt Overlay */}
          {showPdfPrompt && trafficReport && (
            <div className="absolute bottom-4 left-4 right-4 theme-bg-card border border-[var(--accent)] p-4 rounded-lg shadow-2xl backdrop-blur-sm animate-fade-in flex flex-col items-center text-center space-y-3 no-print z-50">
                <div className="flex items-center gap-2 text-green-400 font-bold">
                    <CheckCircle size={20} />
                    <span>{t('analysis_complete')}</span>
                </div>
                <p className="text-sm theme-text-muted">
                    {t('download_pdf_prompt')}
                </p>
                <div className="flex gap-3 w-full justify-center">
                    <button 
                        onClick={() => setShowPdfPrompt(false)}
                        className="px-4 py-2 rounded theme-text-muted hover:bg-white/10 text-sm"
                    >
                        {t('close')}
                    </button>
                    <button 
                        onClick={handleDownloadPdf}
                        className="px-6 py-2 rounded theme-btn-primary font-bold text-sm flex items-center gap-2"
                    >
                        {isDownloading ? t('generating') : t('download_pdf')}
                        {!isDownloading && <Download size={16} />}
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};