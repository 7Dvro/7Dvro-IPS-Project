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
    'malware_scanner': 'Malware & Exploit Scan',
    'research_doc': 'Research Doc',
    'profile_settings': 'Profile & Users',
    'logout': 'Logout',
    'system_status': 'System Status',
    'ai_online': 'AI Engine Online',
    
    // Header
    'operational_overview': 'Operational Overview',
    'realtime_intrusion': 'Real-Time Intrusion Detection',
    'batch_forensics': 'Batch Data Forensics',
    'vuln_assessment': 'Vulnerability Assessment',
    'malware_analysis_title': 'Malware Artifact Analysis',
    'project_doc': 'Project Documentation',
    'subtitle': 'Sudan Critical Infrastructure Cyber Defense System',
    'demo_mode': 'Demo Mode: API Key Missing',
    'admin_user': 'Admin User',

    // Network Telemetry (New)
    'net_telemetry': 'Host Network Telemetry',
    'real_network_monitor': 'Real-time Device Network Status',
    'latency': 'Latency (Ping)',
    'bandwidth': 'Est. Bandwidth',
    'connection_type': 'Conn. Type',
    'online_status': 'Network Status',
    'connected': 'Connected',
    'disconnected': 'Disconnected',

    // Login
    'login_title': 'Secure Login',
    'login_subtitle': 'Sudan Cyber Defense Command',
    'email_label': 'Email Address',
    'password_label': 'Password',
    'sign_in': 'Sign In',
    'logging_in': 'Authenticating...',
    'login_error': 'Invalid credentials. Access denied.',
    'restricted_access': 'Restricted Access Area. Authorized Personnel Only.',

    // Permissions & RBAC
    'access_denied': 'Access Denied',
    'access_denied_desc': 'You do not have permission to access this tool. Please contact an Administrator.',
    'viewer_mode': 'Read-Only Mode',
    'viewer_action_restricted': 'Action restricted for Viewer role.',

    // Profile & Settings
    'profile_title': 'Profile & User Management',
    'user_info': 'User Information',
    'role': 'Role',
    'department': 'Department',
    'admin_panel': 'Administration Panel',
    'user_management': 'User Management',
    'add_user': 'Add New User',
    'full_name': 'Full Name',
    'select_role': 'Select Role',
    'create_user': 'Create User',
    'existing_users': 'Existing Users',
    'delete': 'Delete',
    'edit': 'Edit',
    'cant_delete_self': 'Current User',
    'edit_user': 'Edit User Details',
    'leave_blank_pass': 'Leave blank to keep current password',
    'save_changes': 'Save Changes',
    'cancel': 'Cancel',
    
    'tab_overview': 'Overview',
    'tab_security': 'Security',
    'tab_activity': 'My Activity',
    'tab_system_logs': 'System Logs',
    'upload_photo': 'Upload Photo',
    'change_password': 'Change Password',
    'current_password': 'Current Password',
    'new_password': 'New Password',
    'confirm_password': 'Confirm Password',
    'update_password': 'Update Password',
    'password_success': 'Password updated successfully',
    'password_fail': 'Incorrect current password or mismatch',
    'activity_history': 'Recent Activity History',
    'action': 'Action',
    'details': 'Details',
    'timestamp': 'Timestamp',
    'user': 'User',
    
    'export_logs': 'Export Logs (JSON)',
    'import_logs': 'Import Logs (JSON)',
    'logs_imported': 'Logs imported successfully',

    // Dashboard & Resources
    'status': 'Status',
    'uptime': 'Uptime',
    'threat_level': 'Threat Level',
    'attack_vector_dist': 'Attack Vector Distribution (Last 24h)',
    'traffic_analysis_chart': 'Traffic Analysis',
    'host_info': 'Host Machine Information',
    'system_resources': 'System Resources Load',
    'cpu_usage': 'CPU Usage',
    'ram_usage': 'Memory (RAM)',
    'net_load': 'Network Load',
    'os_platform': 'OS / Platform',
    'browser_agent': 'User Agent',
    'screen_res': 'Screen Resolution',
    'logical_cores': 'Logical Cores',
    'recent_system_activity': 'Recent System Activity (Real-time)',

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
    'capture_local': 'Capture Device Traffic (Real-time)',
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
    'local_network_option': 'Local Network (Host Device Scan)',
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
    
    // Malware Scanner
    'malware_title': 'Malware & Exploit Scanner',
    'malware_desc': 'Deep static analysis for Trojans, Metasploit payloads, and obfuscated shellcodes.',
    'drop_file': 'Drop suspicious file here or click to upload',
    'supported_files': 'Supports: .exe, .bin, .py, .sh, .vbs, .pdf, .docx',
    'file_info': 'File Information',
    'file_name': 'Name',
    'file_size': 'Size',
    'file_type': 'Type',
    'hex_dump': 'Hex Dump / Header Analysis',
    'scan_file': 'Scan for Malware',
    'scanning_malware': 'Checking Signatures...',
    'verdict_safe': 'CLEAN',
    'verdict_infected': 'INFECTED',
    'verdict_suspicious': 'SUSPICIOUS',
    'detection_details': 'Detection Details',
    'ai_verdict': 'AI Analysis Verdict',
    
    // Malware Table & VirusTotal
    'file_properties': 'File Properties & Classification',
    'table_status': 'Status',
    'table_category': 'Category / Family',
    'table_language': 'Programming Language',
    'vt_score': 'VirusTotal Detection',
    'community_score': 'Community Score',
    'security_score': 'Security Score',
    'behavior_report': 'Behavioral Analysis Report',

    // Local Network Scanner
    'net_monitor': 'Network Traffic Monitor',
    'device_discovery': 'Discovered Devices (ARP/LAN)',
    'packet_rate': 'Packets/sec',
    'scanning_network': 'Scanning Local Subnet...',
    'device_name': 'Device Name',
    'ip_address': 'IP Address',
    'mac_address': 'MAC Address',
    'status_active': 'Active',
    'this_device': 'This Device',
    'gateway': 'Gateway',
    'this_device_warning': 'THIS IS YOUR ACTIVE DEVICE',
    'threat_intel': 'Live Threat Intelligence',
    'export_pcap': 'Export Traffic (CSV)',
    'generate_pdf': 'Generate PDF Report',
    'no_threats': 'No active threats detected at this moment.',
    'threat_high': 'HIGH RISK',
    'threat_med': 'MEDIUM',
    'threat_low': 'LOW',
    'live_alerts': 'Live Security Alerts',

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
    'malware_scanner': 'فحص الملفات الملغمة',
    'research_doc': 'وثيقة البحث',
    'profile_settings': 'الملف الشخصي والمستخدمين',
    'logout': 'تسجيل الخروج',
    'system_status': 'حالة النظام',
    'ai_online': 'محرك الذكاء الاصطناعي متصل',
    
    // Header
    'operational_overview': 'نظرة عامة على العمليات',
    'realtime_intrusion': 'كشف التسلل في الوقت الحقيقي',
    'batch_forensics': 'التحليل الجنائي للبيانات',
    'vuln_assessment': 'تقييم الثغرات الأمنية',
    'malware_analysis_title': 'تحليل الملفات الخبيثة (Static Analysis)',
    'project_doc': 'وثائق المشروع',
    'subtitle': 'نظام الدفاع السيبراني للبنى التحتية الحرجة في السودان',
    'demo_mode': 'وضع تجريبي: مفتاح API مفقود',
    'admin_user': 'مدير النظام',

    // Network Telemetry (New)
    'net_telemetry': 'قياسات الشبكة (الجهاز المضيف)',
    'real_network_monitor': 'حالة شبكة الجهاز الفعلية',
    'latency': 'زمن الاستجابة (Ping)',
    'bandwidth': 'عرض النطاق التقديري',
    'connection_type': 'نوع الاتصال',
    'online_status': 'حالة الاتصال',
    'connected': 'متصل',
    'disconnected': 'غير متصل',

    // Login
    'login_title': 'تسجيل الدخول الآمن',
    'login_subtitle': 'قيادة الدفاع السيبراني السوداني',
    'email_label': 'البريد الإلكتروني',
    'password_label': 'كلمة المرور',
    'sign_in': 'تسجيل الدخول',
    'logging_in': 'جاري التحقق...',
    'login_error': 'بيانات الاعتماد غير صحيحة. تم رفض الوصول.',
    'restricted_access': 'منطقة محظورة. للأفراد المصرح لهم فقط.',

    // Permissions & RBAC
    'access_denied': 'تم رفض الوصول',
    'access_denied_desc': 'ليس لديك الصلاحية للوصول إلى هذه الأداة. يرجى التواصل مع المسؤول.',
    'viewer_mode': 'وضع المشاهدة فقط',
    'viewer_action_restricted': 'الإجراء مقيد لصلاحية المشاهد.',

    // Profile & Settings
    'profile_title': 'إدارة الملف الشخصي والمستخدمين',
    'user_info': 'معلومات المستخدم',
    'role': 'الصلاحية',
    'department': 'القسم',
    'admin_panel': 'لوحة الإدارة',
    'user_management': 'إدارة المستخدمين',
    'add_user': 'إضافة مستخدم جديد',
    'full_name': 'الاسم الكامل',
    'select_role': 'اختر الصلاحية',
    'create_user': 'إنشاء مستخدم',
    'existing_users': 'المستخدمين الحاليين',
    'delete': 'حذف',
    'edit': 'تعديل',
    'cant_delete_self': 'المستخدم الحالي',
    'edit_user': 'تعديل بيانات المستخدم',
    'leave_blank_pass': 'اتركه فارغاً للإبقاء على كلمة المرور الحالية',
    'save_changes': 'حفظ التعديلات',
    'cancel': 'إلغاء',
    
    'tab_overview': 'نظرة عامة',
    'tab_security': 'الأمان وكلمة المرور',
    'tab_activity': 'سجل نشاطي',
    'tab_system_logs': 'سجلات النظام (Admin)',
    'upload_photo': 'رفع صورة',
    'change_password': 'تغيير كلمة المرور',
    'current_password': 'كلمة المرور الحالية',
    'new_password': 'كلمة المرور الجديدة',
    'confirm_password': 'تأكيد كلمة المرور',
    'update_password': 'تحديث كلمة المرور',
    'password_success': 'تم تحديث كلمة المرور بنجاح',
    'password_fail': 'كلمة المرور الحالية غير صحيحة أو غير متطابقة',
    'activity_history': 'سجل النشاطات الحديثة',
    'action': 'الإجراء',
    'details': 'التفاصيل',
    'timestamp': 'التوقيت',
    'user': 'المستخدم',
    
    'export_logs': 'تصدير السجلات (JSON)',
    'import_logs': 'استيراد سجلات (JSON)',
    'logs_imported': 'تم استيراد السجلات بنجاح',

    // Dashboard & Resources
    'status': 'الحالة',
    'uptime': 'وقت التشغيل',
    'threat_level': 'مستوى التهديد',
    'attack_vector_dist': 'توزيع متجهات الهجوم (آخر 24 ساعة)',
    'traffic_analysis_chart': 'تحليل حركة المرور',
    'host_info': 'معلومات الجهاز المستضيف',
    'system_resources': 'ضغط موارد النظام',
    'cpu_usage': 'استهلاك المعالج',
    'ram_usage': 'الذاكرة (RAM)',
    'net_load': 'حمل الشبكة',
    'os_platform': 'نظام التشغيل / المنصة',
    'browser_agent': 'وكيل المستخدم (Browser)',
    'screen_res': 'دقة الشاشة',
    'logical_cores': 'الأنوية المنطقية',
    'recent_system_activity': 'نشاط النظام الأخير (فعلي)',

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
    'capture_local': 'جلب سجلات الجهاز الحالية',
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
    'local_network_option': 'الشبكة المحلية (فحص الجهاز الحالي)',
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

    // Malware Scanner
    'malware_title': 'فحص الملفات الملغمة وحصان طروادة',
    'malware_desc': 'تحليل ثابت عميق (Static Analysis) لكشف ملفات Metasploit, Trojans, Shellcodes.',
    'drop_file': 'أفلت الملف المشبوه هنا أو اضغط للرفع',
    'supported_files': 'يدعم: .exe, .bin, .py, .sh, .vbs, .pdf, .docx',
    'file_info': 'معلومات الملف',
    'file_name': 'الاسم',
    'file_size': 'الحجم',
    'file_type': 'النوع',
    'hex_dump': 'عرض Hex / تحليل الترويسة',
    'scan_file': 'فحص الملف الآن',
    'scanning_malware': 'جاري مطابقة التواقيع...',
    'verdict_safe': 'نظيف / آمن',
    'verdict_infected': 'ملف خبيث (Infected)',
    'verdict_suspicious': 'مشبوه (Suspicious)',
    'detection_details': 'تفاصيل الكشف',
    'ai_verdict': 'رأي الذكاء الاصطناعي',

    // Malware Table & VirusTotal
    'file_properties': 'خصائص الملف وتصنيفه',
    'table_status': 'الحالة (Status)',
    'table_category': 'الفئة (Category)',
    'table_language': 'لغة البرمجة (Language)',
    'vt_score': 'نتيجة كشف VirusTotal',
    'community_score': 'نتيجة المجتمع',
    'security_score': 'الدرجة الأمنية',
    'behavior_report': 'تقرير تحليل السلوكيات',

    // Local Network Scanner
    'net_monitor': 'مراقب حركة الشبكة',
    'device_discovery': 'الأجهزة المكتشفة (ARP/LAN)',
    'packet_rate': 'حزمة/ثانية',
    'scanning_network': 'جاري فحص الشبكة المحلية...',
    'device_name': 'اسم الجهاز',
    'ip_address': 'عنوان IP',
    'mac_address': 'عنوان MAC',
    'status_active': 'نشط',
    'this_device': 'هذا الجهاز',
    'gateway': 'بوابة الشبكة',
    'this_device_warning': 'هذا هو جهازك الحالي النشط',
    'threat_intel': 'استخبارات التهديدات الحية',
    'export_pcap': 'تصدير البيانات (CSV)',
    'generate_pdf': 'تحميل تقرير (PDF)',
    'no_threats': 'لا توجد تهديدات نشطة حالياً.',
    'threat_high': 'خطر مرتفع',
    'threat_med': 'متوسط',
    'threat_low': 'منخفض',
    'live_alerts': 'تنبيهات أمنية حية',

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