import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { fileName, mimeType, base64Data, patient } = await req.json();

    if (!base64Data || !mimeType) {
      return NextResponse.json(
        { success: false, error: "Missing uploaded file data or mimeType" },
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
    return NextResponse.json({
      success: true,
      ...parsedData,
    });
  } catch (error: any) {
    console.error("Error analyzing medical report in App Router route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
