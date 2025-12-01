
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const processFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result?.toString().replace(/^data:(.*,)?/, "");
      if (encoded) {
        if ((encoded.length % 4) > 0) {
          encoded += "=".repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      } else {
        reject("Error reading file");
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeLungScan = async (file: File, patientInfo?: any): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await processFileToBase64(file);

  try {
    const patientContext = patientInfo 
      ? `Patient Context: Age ${patientInfo.age}, Gender ${patientInfo.gender}, Symptoms: ${patientInfo.symptoms}, History: ${patientInfo.history}.` 
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
          {
            text: `You are an expert radiologist and oncologist AI assistant. 
            Analyze this chest X-ray or CT scan image for signs of lung cancer or other pulmonary pathologies.
            ${patientContext}
            
            Return a purely JSON response.
            
            If the image is NOT a medical lung scan, set diagnosis to 'Uncertain' and confidence to 0.

            Identify potential risk areas. If you find a potential anomaly, estimate its relative position (x,y from 0-100%) and approximate radius (r from 0-100%) for a heatmap visualization.
            
            Metrics to calculate:
            - Severity Score (1-10): Based on lesion size, irregularity, and spread.
            - Urgency: Routine (normal), Semi-Urgent (minor findings), Urgent (suspicious nodules), Critical (large masses/metastasis).
            - Reliability Score (1-10): Rate the image quality/clarity. Low score if blurry or bad artifacting.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: {
              type: Type.STRING,
              enum: ["Normal", "Benign", "Malignant", "Uncertain"],
            },
            confidence: {
              type: Type.NUMBER,
              description: "AI Confidence percentage (0-100)",
            },
            severityScore: {
              type: Type.NUMBER,
              description: "Severity scale 1-10",
            },
            urgency: {
              type: Type.STRING,
              enum: ["Routine", "Semi-Urgent", "Urgent", "Critical"],
            },
            reliabilityScore: {
              type: Type.NUMBER,
              description: "Image quality/Reliability score 1-10",
            },
            stage: {
              type: Type.STRING,
              description: "Estimated stage if malignant (e.g., Stage I, Stage II)",
              nullable: true,
            },
            summary: {
              type: Type.STRING,
              description: "Brief summary of the analysis (max 2 sentences)",
            },
            findings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of specific radiological findings",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recommended next steps for the doctor",
            },
            affectedAreaCoordinates: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER, description: "X percentage (0-100)" },
                y: { type: Type.NUMBER, description: "Y percentage (0-100)" },
                r: { type: Type.NUMBER, description: "Radius percentage (0-50)" },
              },
              nullable: true,
            }
          },
          required: ["diagnosis", "confidence", "severityScore", "urgency", "reliabilityScore", "summary", "findings", "recommendations"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("ML Analysis Error:", error);
    throw new Error("Failed to analyze image. Please ensure you are online and try again.");
  }
};
