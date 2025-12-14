import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Sidebar
    'dashboard': 'Dashboard',
    'live_monitor': 'Live IDS Monitor',
    'traffic_analysis': 'Batch Traffic Analysis',
    'vuln_scanner': 'Vuln. Scanner',
    'research_doc': 'Research Doc',
    'system_status': 'System Status',
    'ai_online': 'AI Engine Online',
    
    // Header
    'operational_overview': 'Operational Overview',
    'realtime_intrusion': 'Real-Time Intrusion Detection',
    'batch_forensics': 'Batch Data Forensics',
    'vuln_assessment': 'Vulnerability Assessment',
    'project_doc': 'Project Documentation',
    'subtitle': 'Sudan Critical Infrastructure Cyber Defense System',
    'demo_mode': 'Demo Mode: API Key Missing',
    'admin_user': 'Admin User',

    // Dashboard
    'status': 'Status',
    'uptime': 'Uptime',
    'threat_level': 'Threat Level',
    'attack_vector_dist': 'Attack Vector Distribution (Last 24h)',
    'traffic_analysis_chart': 'Traffic Analysis',

    // Live Monitor
    'terminal_title': 'IDS_TERMINAL_V1 (Snort/Suricata Stream)',
    'waiting_traffic': 'Waiting for traffic...',
    'ai_analysis_panel': 'AI Threat Analysis',
    'select_log': 'Select a log entry from the terminal to analyze it with Gemini AI.',
    'analyzing': 'Analyzing threat pattern...',
    'target': 'TARGET',
    'payload': 'PAYLOAD',

    // Traffic Analyzer
    'batch_title': 'Batch Traffic Analysis',
    'batch_desc': 'Upload or paste network logs (CSV, JSON, Plain Text) for deep-dive AI forensics.',
    'input_logs': 'Input Logs / Traffic Data',
    'load_sample': 'Load Sample Malicious Data',
    'paste_placeholder': 'Paste logs here...\nExample:\n2023-10-15 10:00:01, 192.168.1.100, 10.0.0.5, TCP, SYN\n...',
    'analyze_btn': 'Analyze Batch',
    'analyzing_btn': 'Analyzing Patterns...',
    'analysis_report': 'Analysis Report',
    'awaiting_data': 'Awaiting data. The AI will generate a detailed forensic report here.',
    'analysis_complete': 'Analysis Complete',
    'download_pdf_prompt': 'Would you like to download this report as a PDF document?',
    'close': 'No, close',
    'download_pdf': 'Yes, Download PDF',
    'generating': 'Generating...',

    // Vuln Scanner
    'scanner_title': 'Vulnerability Assessment Scanner',
    'target_infra': 'Target Infrastructure',
    'hospital_option': 'Hospital Infrastructure (Sudan - Khartoum)',
    'airport_option': 'International Airport (Network Segment A)',
    'bank_option': 'Central Bank (Payment Gateway)',
    'start_scan': 'Start Assessment',
    'scanning': 'Scanning...',
    'report_generated': 'Assessment Report Generated',
    'critical_found': 'CRITICAL VULNERABILITIES FOUND',
    'download_report': 'Download PDF Report',
    'mode_simulated': 'Simulated Infrastructure Scan',
    'mode_file': 'Analyze Traffic/Log File',
    'upload_label': 'Upload Wireshark Log / Network Scan (.txt, .log, .csv)',
    'analyze_file': 'Analyze File for Vulnerabilities',
    'analyzing_file': 'Analyzing File...',

    // About
    'university': 'International University of Africa',
    'college': 'Faculty of Graduate Studies - Master Program (Computer Science)',
    'proposal_title': 'Research Proposal',
    'proposal_name': 'Designing an Intelligent System for Cyber Attack Detection and Vulnerability Assessment in Sudan’s Critical Infrastructure',
    'prepared_by': 'Prepared by / Mohammed Muzamil Al-Rayyes Ahmed',
    'intro': '1. Introduction',
    'problem': '2. Problem Statement',
    'objectives': '3. Objectives',
    'tools': '6. Tools & Technologies',
    'intro_text': 'With the rapid digital transformation in Sudan, critical infrastructures such as airports, hospitals, and banks have become attractive targets for cyberattacks. The weakness of traditional protection systems, along with limited technical capabilities in many of these institutions, increases the risk of these attacks, which can lead to the disruption of essential services or the leakage of sensitive data. In contrast, Artificial Intelligence and ethical hacking techniques are among the most effective tools to counter these threats, as they can detect security vulnerabilities and provide early detection of malicious activities within networks.',
    'problem_text': 'Critical infrastructures in Sudan suffer from significant weaknesses in cyberattack detection mechanisms and a lack of periodic vulnerability assessment plans. Current security solutions rely on traditional tools incapable of detecting advanced attacks. Therefore, there is a need to develop an intelligent system combining vulnerability assessment and early attack detection to help raise the protection level of these vital facilities.',
    'obj_1': 'Identify and analyze security vulnerabilities in simulated environments for critical infrastructure (Airports - Hospitals - Banks).',
    'obj_2': 'Develop an AI system capable of monitoring cyberattacks in real-time.',
    'obj_3': 'Conduct ethical penetration tests to simulate actual attack scenarios.',
    'obj_4': 'Develop a protection plan and proposed security policies to reduce risks.',
    'obj_5': 'Provide a practical model applicable in Sudanese institutions.'
  },
  ar: {
    // Sidebar
    'dashboard': 'لوحة القيادة',
    'live_monitor': 'مراقبة الشبكة الحية',
    'traffic_analysis': 'تحليل البيانات المجمع',
    'vuln_scanner': 'فحص الثغرات',
    'research_doc': 'وثيقة البحث',
    'system_status': 'حالة النظام',
    'ai_online': 'محرك الذكاء الاصطناعي متصل',
    
    // Header
    'operational_overview': 'نظرة عامة على العمليات',
    'realtime_intrusion': 'كشف التسلل في الوقت الحقيقي',
    'batch_forensics': 'التحليل الجنائي للبيانات',
    'vuln_assessment': 'تقييم الثغرات الأمنية',
    'project_doc': 'وثائق المشروع',
    'subtitle': 'نظام الدفاع السيبراني للبنى التحتية الحرجة في السودان',
    'demo_mode': 'وضع تجريبي: مفتاح API مفقود',
    'admin_user': 'مدير النظام',

    // Dashboard
    'status': 'الحالة',
    'uptime': 'وقت التشغيل',
    'threat_level': 'مستوى التهديد',
    'attack_vector_dist': 'توزيع متجهات الهجوم (آخر 24 ساعة)',
    'traffic_analysis_chart': 'تحليل حركة المرور',

    // Live Monitor
    'terminal_title': 'محطة كشف التسلل (بث Snort/Suricata)',
    'waiting_traffic': 'في انتظار حركة المرور...',
    'ai_analysis_panel': 'تحليل التهديدات بالذكاء الاصطناعي',
    'select_log': 'حدد سجلاً من المحطة لتحليله باستخدام Gemini AI.',
    'analyzing': 'جاري تحليل نمط التهديد...',
    'target': 'الهدف',
    'payload': 'الحمولة',

    // Traffic Analyzer
    'batch_title': 'تحليل حزم البيانات والترافيك',
    'batch_desc': 'قم بتحميل أو لصق سجلات الشبكة (CSV, JSON, نص) للتحليل الجنائي العميق بالذكاء الاصطناعي.',
    'input_logs': 'سجلات الإدخال / بيانات المرور',
    'load_sample': 'تحميل عينة بيانات خبيثة',
    'paste_placeholder': 'الصق السجلات هنا...\nمثال:\n2023-10-15 10:00:01, 192.168.1.100, 10.0.0.5, TCP, SYN\n...',
    'analyze_btn': 'تحليل الحزمة',
    'analyzing_btn': 'جاري تحليل الأنماط...',
    'analysis_report': 'تقرير التحليل',
    'awaiting_data': 'بانتظار البيانات. سيقوم الذكاء الاصطناعي بإنشاء تقرير جنائي مفصل هنا.',
    'analysis_complete': 'اكتمل التحليل',
    'download_pdf_prompt': 'هل ترغب في تحميل هذا التقرير كملف PDF؟',
    'close': 'لا، إغلاق',
    'download_pdf': 'نعم، تحميل PDF',
    'generating': 'جاري الإنشاء...',

    // Vuln Scanner
    'scanner_title': 'ماسح تقييم الثغرات الأمنية',
    'target_infra': 'البنية التحتية المستهدفة',
    'hospital_option': 'البنية التحتية للمستشفى (السودان - الخرطوم)',
    'airport_option': 'المطار الدولي (قطاع الشبكة أ)',
    'bank_option': 'البنك المركزي (بوابة الدفع)',
    'start_scan': 'بدء التقييم',
    'scanning': 'جاري الفحص...',
    'report_generated': 'تم إنشاء تقرير التقييم',
    'critical_found': 'تم اكتشاف ثغرات حرجة',
    'download_report': 'تحميل التقرير PDF',
    'mode_simulated': 'فحص بنية تحتية (محاكاة)',
    'mode_file': 'تحليل ملف ترافيك',
    'upload_label': 'رفع ملف Wireshark / سجل شبكة (.txt, .log, .csv)',
    'analyze_file': 'تحليل الملف للكشف عن الثغرات',
    'analyzing_file': 'جاري تحليل الملف...',

    // About
    'university': 'جامعة إفريقيا العالمية',
    'college': 'كلية الدراسات العليا - برنامج الماجستير (علوم الحاسوب)',
    'proposal_title': 'بحث مقترح (Research Proposal)',
    'proposal_name': 'تصميم نظام ذكي لتقييم وكشف الهجمات السيبرانية على البنى التحتية الحرجة في السودان',
    'prepared_by': 'إعداد / محمد مزمل الريس أحمد',
    'intro': '1. مقدمة (Introduction)',
    'problem': '2. مشكلة البحث (Problem Statement)',
    'objectives': '3. أهداف البحث (Objectives)',
    'tools': '6. أدوات البحث (Tools & Technologies)',
    'intro_text': 'مع التحول المتسارع نحو الرقمنة في السودان، أصبحت البنى التحتية الحرجة مثل المطارات، المستشفيات، والبنوك أهدافًا مغرية للهجمات السيبرانية. ضعف نظم الحماية التقليدية، إلى جانب محدودية القدرات التقنية في كثير من هذه المؤسسات، يزيد من خطورة هذه الهجمات التي يمكن أن تؤدي إلى تعطيل خدمات أساسية أو تسريب بيانات حساسة. في المقابل، تُعد تقنيات الذكاء الاصطناعي واختبارات الاختراق الأخلاقي من أكثر الأدوات فاعلية لمواجهة هذه التهديدات، إذ يمكن من خلالها رصد الثغرات الأمنية والكشف المبكر عن الأنشطة الضارة داخل الشبكات.',
    'problem_text': 'تعاني البنى التحتية الحرجة في السودان من ضعف كبير في آليات اكتشاف الهجمات الإلكترونية، ومن غياب خطط دورية لتقييم الثغرات الأمنية. الحلول الأمنية الحالية تعتمد على أدوات تقليدية غير قادرة على اكتشاف الهجمات المتقدمة. وبالتالي، هناك حاجة إلى تطوير نظام ذكي يجمع بين تقييم نقاط الضعف والكشف المبكر عن الهجمات للمساهمة في رفع مستوى الحماية لهذه المنشآت الحيوية.',
    'obj_1': 'تحديد وتحليل الثغرات الأمنية في بيئات محاكاة للبنى التحتية الحرجة (مطارات – مستشفيات – بنوك).',
    'obj_2': 'تطوير نظام ذكاء اصطناعي قادر على رصد الهجمات السيبرانية في الزمن الحقيقي.',
    'obj_3': 'إجراء اختبارات اختراق أخلاقية لمحاكاة سيناريوهات الهجمات الفعلية.',
    'obj_4': 'وضع خطة حماية وسياسات أمنية مقترحة للتقليل من المخاطر.',
    'obj_5': 'تقديم نموذج عملي قابل للتطبيق في المؤسسات السودانية.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};