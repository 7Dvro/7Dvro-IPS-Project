import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeThreat = async (logMessage: string, context: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      You are a world-class cybersecurity analyst for Sudan's Critical Infrastructure Defense System.
      Analyze the following threat log: "${logMessage}".
      Context: This is affecting a ${context}.
      
      Provide a concise response (max 100 words) in ${lang === 'ar' ? 'Arabic' : 'English'} covering:
      1. What type of attack is this?
      2. The potential impact on the ${context}.
      3. Immediate mitigation steps.
      
      Format the output in clean Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'ar' ? "خطأ في الاتصال بمحرك التحليل. يرجى التحقق من مفتاح API." : "Error connecting to AI Analysis engine. Please check API Key.";
  }
};

export const generateSecurityReport = async (infrastructureType: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
   try {
    const ai = getClient();
    const prompt = `
      Generate a simulated vulnerability assessment report summary for a ${infrastructureType} in Sudan.
      Output language: ${lang === 'ar' ? 'Arabic' : 'English'}.
      Include 3 critical vulnerabilities often found in legacy systems (e.g., outdated Windows, unpatched servers, weak encryption).
      Suggest fix for each.
      Keep it professional and technical. Max 200 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Report generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'ar' ? "خطأ في إنشاء التقرير." : "Error generating report.";
  }
}

export const analyzeTrafficBatch = async (trafficData: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      You are an elite Senior Security Analyst for the National Cyber Defense Center.
      Review the following batch of network traffic logs/data:
      
      """
      ${trafficData}
      """
      
      Analyze this data for anomalies, malicious patterns (DDoS, SQLi, Port Scanning, C2 Beaconing), and security hygiene issues.
      
      Produce a detailed "Traffic Analysis Report" in Markdown format in ${lang === 'ar' ? 'Arabic' : 'English'} with these sections:
      1. **Executive Summary**: High-level verdict (Clean/Suspicious/Critical).
      2. **Detected Anomalies**: List specific suspicious lines or patterns.
      3. **Threat Classification**: Map to MITRE ATT&CK if possible.
      4. **Strategic Recommendations**: Actionable steps for the SOC team.
      
      The report should be professional and use technical cybersecurity terminology appropriate for the language.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Batch analysis failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'ar' ? "خطأ في تحليل البيانات. يرجى التحقق من مفتاح API." : "Error analyzing traffic batch. Please check your API Key and connection.";
  }
};

export const analyzeVulnerabilityLogFile = async (fileData: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
  try {
    const ai = getClient();
    // Limit data to avoid token issues, assuming text logs
    const snippet = fileData.substring(0, 50000); 
    const prompt = `
      You are a Vulnerability Assessment Expert utilizing data from Wireshark/Network Scanners.
      Analyze the following imported log file content for potential security vulnerabilities, outdated software versions, weak ciphers, and unpatched systems.

      """
      ${snippet}
      """

      Output language: ${lang === 'ar' ? 'Arabic' : 'English'}.
      
      Produce a "Vulnerability Scan Report" containing:
      1. **Detected Technologies**: OS, Services, Versions detected in headers/banners.
      2. **Identified Vulnerabilities**: Potential CVEs or weak configurations based on the traffic.
      3. **Risk Level**: High/Medium/Low with justification.
      4. **Remediation**: Steps to patch or harden the identified systems.

      Format as clean Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "File analysis failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'ar' ? "خطأ في تحليل الملف." : "Error analyzing file.";
  }
};