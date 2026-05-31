import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { reportAnalysis, symptomAnalysis, patient } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY is not defined. Please configure it in your environment variables/secrets." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

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
    return NextResponse.json({
      success: true,
      ...parsedData,
    });
  } catch (error: any) {
    console.error("Error generating recommendations in App Router route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
