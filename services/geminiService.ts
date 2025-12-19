
import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Common instruction to append to prompts to get JSON data
const JSON_STATS_INSTRUCTION = `
  CRITICAL: At the very end of your response, you MUST append a JSON block inside \`\`\`json\`\`\` code fences. 
  This JSON must strictly follow this format:
  {
    "scan_results": {
        "verdict": "CLEAN" | "MALICIOUS" | "SUSPICIOUS",
        "malware_family": "string",
        "programming_language": "string",
        "detection_ratio": "string (e.g. 45/72)",
        "risk_score": number,
        "summary_ar": "ملخص مختصر جدا بالعربية",
        "summary_en": "Very brief summary in English",
        "engines": [
          {"name": "Kaspersky", "verdict": "Malicious/Clean", "detail": "Trojan.Win32.Generic"},
          {"name": "CrowdStrike", "verdict": "Malicious/Clean", "detail": "Malicious_Behavior"},
          {"name": "Microsoft", "verdict": "Malicious/Clean", "detail": "Backdoor:Win32/Zrev.A"},
          {"name": "BitDefender", "verdict": "Malicious/Clean", "detail": "Gen:Variant.Razy.741"},
          {"name": "SentinelOne", "verdict": "Malicious/Clean", "detail": "Static AI - Malicious"}
        ]
    }
  }
`;

export const analyzeThreat = async (logMessage: string, context: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `Analyze this specific log entry: "${logMessage}". Context: ${context}. Output in ${lang === 'ar' ? 'Arabic' : 'English'}.`;
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text || "Analysis failed.";
  } catch (error) { return "Error."; }
};

export const generateSecurityReport = async (infrastructureType: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
   try {
    const ai = getClient();
    const prompt = `Generate vulnerability report for: ${infrastructureType}. Output in ${lang === 'ar' ? 'Arabic' : 'English'}.`;
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text || "Report failed.";
  } catch (error) { return "Error."; }
}

export const analyzeTrafficBatch = async (trafficData: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `Analyze traffic: ${trafficData}. Output in ${lang === 'ar' ? 'Arabic' : 'English'}.`;
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text || "Failed.";
  } catch (error) { return "Error."; }
};

export const analyzeVulnerabilityLogFile = async (fileData: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `Analyze log: ${fileData}. Output in ${lang === 'ar' ? 'Arabic' : 'English'}.`;
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text || "Failed.";
  } catch (error) { return "Error."; }
};

export const analyzeMalwareFile = async (fileMetadata: any, hexSnippet: string, extractedStrings: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      Act as a Hybrid Analysis Sandbox and Multi-Engine Scanner (VirusTotal Style).
      Perform a deep static and heuristic analysis on this file.
      
      File Metadata: ${JSON.stringify(fileMetadata)}
      Binary Snippet: ${hexSnippet}
      Extracted Strings: ${extractedStrings.substring(0, 10000)}

      YOUR GOAL:
      1. Simulate how top antivirus engines would react to this file patterns.
      2. Identify malicious indicators (C2 IPs, Obfuscation, Dangerous API Hooks).
      3. Create a technical forensic report AND a brief executive summary.
      
      Output language for the main report: ${lang === 'ar' ? 'Arabic' : 'English'}.
      ${JSON_STATS_INSTRUCTION}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });

    return response.text || "Malware analysis failed.";
  } catch (error) {
     return lang === 'ar' ? "خطأ في فحص الملف." : "Error scanning file.";
  }
};
