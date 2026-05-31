/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size limit to handle uploaded base64 data (PDFs / Images)
app.use(express.json({ limit: "25mb" }));

// Helper to lazy-initialize and secure the Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Settings > Secrets panel of Google AI Studio.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. API Route: Analyze Medical Report (Blood tests, Prescriptions, PDFs, Images)
app.post("/api/analyze-report", async (req, res) => {
  try {
    const { fileName, mimeType, base64Data, patient } = req.body;

    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: "Missing uploaded file data or mimeType" });
    }

    const ai = getGeminiClient();

    const filePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const patientContext = patient
      ? `Patient Details:\nName: ${patient.name}\nAge: ${patient.age}\nGender: ${patient.gender}\nBlood Type: ${patient.bloodType}\n\n`
      : "";

    const promptString = `You are an expert supportive AI medical advisor. 
Analyze the provided medical report file (${fileName}) and extracts relevant medical information.
${patientContext}
Please perform the following actions:
1. Extract and provide a simple, warm, and comforting summaries of the laboratory results or prescription.
2. Formulate 3-5 high-level key observations.
3. Identify and itemize all parameters that are outside of healthy standard reference ranges (abnormal value parameters). For each abnormal parameter:
  - Mention its exact value (including unit, e.g., "16.8 g/dL").
  - Provide standard reference range (e.g., "12.0 - 15.5 g/dL").
  - Give a highly clear, supportive plain-English explanation of what this parameter means without generating unnecessary medical scare.
4. Translate any complex medical jargon or terminology found in the report into simple, friendly everyday layperson language.
5. Provide a practical list of everyday health metrics or patterns to monitor.

Always write in a compassionate, friendly, and non-alarmist tone. Ensure all fields in the JSON response are populated with accurate, informative text. Avoid using empty arrays unless there are absolutely zero findings. Do not prescribe specific pharmaceutical medications, focus purely on reporting analysis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [filePart, { text: promptString }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "An easy-to-understand summary of findings from the uploaded medical report.",
            },
            keyObservations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key high-level observations and medical findings from the report.",
            },
            abnormalValues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING, description: "Name of the medical test / parameter" },
                  value: { type: Type.STRING, description: "The actual tracked value including units" },
                  standardRange: { type: Type.STRING, description: "Healthy reference standard range" },
                  explanation: { type: Type.STRING, description: "Compassionate layperson explanation of what this parameter represents and its status." },
                },
                required: ["parameter", "value", "standardRange", "explanation"],
              },
              description: "Items outside the standard healthy standard range. Return empty array if all values are healthy.",
            },
            terminologyExplanations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING, description: "The medical jargon word" },
                  simpleExplanation: { type: Type.STRING, description: "Laidback translation of the technical medical word" },
                },
                required: ["term", "simpleExplanation"],
              },
              description: "Definitions of complex medical terms present in the report. Return empty array if none.",
            },
            thingsToMonitor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific parameters or everyday lifestyle signals to note or monitor.",
            },
          },
          required: ["summary", "keyObservations", "abnormalValues", "terminologyExplanations", "thingsToMonitor"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error analyzing medical report:", err);
    res.status(500).json({ error: err.message || "Failed to analyze report using AI." });
  }
});

// 2. API Route: Analyze Symptoms
app.post("/api/analyze-symptoms", async (req, res) => {
  try {
    const { symptoms, description, patient } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ error: "Missing checked symptoms array" });
    }

    const ai = getGeminiClient();

    const patientContext = patient
      ? `Patient Profile:\nName: ${patient.name}\nAge: ${patient.age}\nGender: ${patient.gender}\n`
      : "";

    const userQuery = `Symptom List: ${symptoms.join(", ")}\nCustom notes from patient: ${description || "None provided"}`;

    const promptString = `You are an empathetic medical symptom classifier AI. Analyze the patient symptom symptoms and notes.
${patientContext}
${userQuery}

Return a structured JSON output with:
1. Recognized input symptoms.
2. List of standard possible mild causes (common conditions, benign items) explaining in highly supportive, empathetic language. Clearly mention likelihoods (Low, Medium, or High) and emphasize these are potential educational contexts, NOT custom definitive diagnoses.
3. Friendly preventive tips and wellness guide (e.g. rest, posture, herbal tea).
4. Concrete conditions or timeline on when to seek an in-person healthcare physician (e.g., "if fever exceeds 101F or persists beyond 3 days").
5. Critical warning sign or danger alerts that signify they should immediately go to urgent care or ER (e.g., severe chest tightness, sudden numbness, difficulty breathing).

Ensure the disclaimer "This is not a medical diagnosis. Consult a healthcare professional for medical advice." is styled and respected.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptString,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of recognized or extracted symptoms",
            },
            possibleCauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING, description: "Common or benign potential medical condition" },
                  likelihood: { type: Type.STRING, description: "Likelihood rating: High, Medium, or Low" },
                  description: { type: Type.STRING, description: "Friendly outline explanation of this potential cause." },
                },
                required: ["condition", "likelihood", "description"],
              },
            },
            preventiveTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Simple self-care remedies or lifestyle habits.",
            },
            whenToConsult: {
              type: Type.STRING,
              description: "Clear thresholds for seeking professional physical consulting.",
            },
            warningSigns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Emergency indicators or severe warning markers that require urgent action.",
            },
          },
          required: ["symptoms", "possibleCauses", "preventiveTips", "whenToConsult", "warningSigns"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error analyzing symptoms:", err);
    res.status(500).json({ error: err.message || "Failed to analyze symptoms." });
  }
});

// 3. API Route: Generate Health & Lifestyle Recommendations
app.post("/api/generate-recommendations", async (req, res) => {
  try {
    const { reportAnalysis, symptomAnalysis, patient } = req.body;

    const ai = getGeminiClient();

    const patientContext = patient
      ? `Patient profile: ${patient.name}, ${patient.age} years old, ${patient.gender}.`
      : "Patient profile is average adult.";

    const inputDataContext = `
Report Analysis Summary: ${reportAnalysis ? JSON.stringify(reportAnalysis.summary) : "None uploaded"}
Abnormal Values: ${reportAnalysis ? JSON.stringify(reportAnalysis.abnormalValues) : "None"}
Symptom Tracking Analysis Causes: ${symptomAnalysis ? JSON.stringify(symptomAnalysis.possibleCauses) : "None tracked"}
Symptom list: ${symptomAnalysis ? JSON.stringify(symptomAnalysis.symptoms) : "None"}
`;

    const promptString = `You are a holistic medical wellness and wellness planner AI.
Based on the medical results and tracked symptoms provided:
${patientContext}
${inputDataContext}

Devise a set of highly specific, supportive, practical, and everyday recommendations categorized into:
- lifestyle (3-5 items on stress, sleep, desk posture, resting, screen time, etc.)
- diet (3-5 items on nutrients, wholesome food, minerals, fiber, items to reduce/add based on report parameters)
- hydration (3-5 items on suggested intake, electrolytes, water tracking based on active symptoms/reports)
- exercise (3-5 items of light movement or specialized indicators like stretching, walking, yoga, when to rest)
- monitoringTips (3-5 tips on maintaining regular self-measurements, temperature logging, tracker records)

Write in simple, constructive, non-pharmaceutical, lifestyle-focused language.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptString,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lifestyle: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Practical lifestyle adjustments and recommendations.",
            },
            diet: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Everyday healthy diet, nutrient and eating habits guidance.",
            },
            hydration: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Hydration targets and suggestions tailored to context.",
            },
            exercise: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Mild, restorative exercise and stretches matching energy levels.",
            },
            monitoringTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Tips on what parameter (like temperature, blood oxygen, daily walks) to track.",
            },
          },
          required: ["lifestyle", "diet", "hydration", "exercise", "monitoringTips"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error generating recommendations:", err);
    res.status(500).json({ error: err.message || "Failed to generate health recommendations." });
  }
});

// Export app for serverless deployment platforms like Vercel
export default app;

// Setup development server or serve built client static assets
async function setupServer() {
  if (process.env.VERCEL) {
    // Vercel serverless functions shouldn't start their own listeners
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MedVision AI] Backend dev/production server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
