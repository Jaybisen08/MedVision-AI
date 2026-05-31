import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { symptoms, description, patient } = await req.json();

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { success: false, error: "Missing checked symptoms array" },
        { status: 400 }
      );
    }

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
    return NextResponse.json({
      success: true,
      ...parsedData,
    });
  } catch (error: any) {
    console.error("Error analyzing symptoms in App Router route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
