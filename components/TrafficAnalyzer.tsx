import React, { useState } from 'react';
import { analyzeTrafficBatch } from '../services/geminiService';
import { FileSearch, Upload, FileText, Download, CheckCircle, Brain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const TrafficAnalyzer: React.FC = () => {
  const { t, language } = useLanguage();
  const [inputData, setInputData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [showPdfPrompt, setShowPdfPrompt] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleAnalyze = async () => {
    if (!inputData.trim()) return;
    
    setIsAnalyzing(true);
    setReport(null);
    setShowPdfPrompt(false);

    // Pass language to service
    const result = await analyzeTrafficBatch(inputData, language);
    
    setReport(result);
    setIsAnalyzing(false);
    
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
    setInputData(sample);
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
        window.print();
        setIsDownloading(false);
        setShowPdfPrompt(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
          <FileSearch className="text-blue-500" />
          {t('batch_title')}
        </h2>
        <p className="text-slate-400 text-sm">
          {t('batch_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-slate-300 font-bold text-sm flex items-center gap-2">
              <FileText size={16} />
              {t('input_logs')}
            </label>
            <button 
              onClick={loadSampleData}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              {t('load_sample')}
            </button>
          </div>
          
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="flex-1 w-full bg-[#0c0c0c] text-slate-300 font-mono text-xs p-4 rounded border border-slate-800 focus:ring-1 focus:ring-blue-500 outline-none resize-none mb-4"
            dir="ltr"
            placeholder={t('paste_placeholder')}
          ></textarea>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputData}
            className={`w-full py-3 rounded font-bold text-white flex justify-center items-center gap-2 transition-all ${
              isAnalyzing || !inputData 
              ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
              : 'bg-blue-600 hover:bg-blue-500'
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
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col h-[600px] overflow-hidden relative">
          <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">{t('analysis_report')}</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {!report ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <FileSearch size={64} className="opacity-20" />
                <p className="text-center text-sm max-w-xs">
                  {t('awaiting_data')}
                </p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                 <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                   {report}
                 </div>
              </div>
            )}
          </div>

          {/* PDF Prompt Overlay/Section */}
          {showPdfPrompt && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-blue-500/50 p-4 rounded-lg shadow-2xl backdrop-blur-sm animate-fade-in flex flex-col items-center text-center space-y-3">
                <div className="flex items-center gap-2 text-green-400 font-bold">
                    <CheckCircle size={20} />
                    <span>{t('analysis_complete')}</span>
                </div>
                <p className="text-sm text-slate-300">
                    {t('download_pdf_prompt')}
                </p>
                <div className="flex gap-3 w-full justify-center">
                    <button 
                        onClick={() => setShowPdfPrompt(false)}
                        className="px-4 py-2 rounded text-slate-400 hover:bg-slate-800 text-sm"
                    >
                        {t('close')}
                    </button>
                    <button 
                        onClick={handleDownloadPdf}
                        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2"
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
