/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { 
  FileText, UploadCloud, AlertCircle, CheckCircle, HelpCircle, Eye, RefreshCw, Info, User, ChevronRight 
} from "lucide-react";
import { ReportAnalysis, PatientDetails } from "../types";

interface ReportAnalyzerProps {
  patient: PatientDetails;
  onPatientChange: (p: PatientDetails) => void;
  reportAnalysis: ReportAnalysis | null;
  onAnalysisSuccess: (analysis: ReportAnalysis) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ReportAnalyzer({
  patient,
  onPatientChange,
  reportAnalysis,
  onAnalysisSuccess,
  isLoading,
  setIsLoading
}: ReportAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stepsMessage, setStepsMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reassuring medical parsing notes
  const loadingSteps = [
    "Securely mounting laboratory file...",
    "Scanning documentation characters using AI...",
    "Extracting biochemical biomarkers and metrics...",
    "Correlating abnormal levels against medical database references...",
    "Translating complex hospital jargon into plain English summaries..."
  ];

  const handlePatientFieldChange = (field: keyof PatientDetails, value: string) => {
    onPatientChange({ ...patient, [field]: value });
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a valid lab report in PDF, JPEG, or PNG format.");
      return;
    }
    // Limit to 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File exceeds the maximum size limit of 10MB.");
      return;
    }
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  const triggerSearch = () => {
    fileInputRef.current?.click();
  };

  const processReport = async () => {
    if (!file) {
      setError("Please select or drag a medical file first.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // Rotate messages for amazing UX
      let stepIdx = 0;
      setStepsMessage(loadingSteps[0]);
      const stepTimer = setInterval(() => {
        if (stepIdx < loadingSteps.length - 1) {
          stepIdx++;
          setStepsMessage(loadingSteps[stepIdx]);
        }
      }, 2500);

      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const b64 = (reader.result as string).split(",")[1];
          resolve(b64);
        };
        reader.onerror = (e) => reject(e);
      });

      const response = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          base64Data: base64String,
          patient: patient
        }),
      });

      clearInterval(stepTimer);

      if (!response.ok) {
        let errorMsg = `Server responded with status ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } else {
            const textData = await response.text();
            errorMsg = textData.length > 200 ? textData.substring(0, 200) + "..." : textData;
          }
        } catch (e) {
          errorMsg = `Server responded with status ${response.status} (Failed to parse error description)`;
        }
        throw new Error(errorMsg);
      }

      let data: ReportAnalysis;
      try {
        data = await response.json();
      } catch (jsonErr: any) {
        let textData = "";
        try {
          textData = await response.text();
        } catch (e) {}
        throw new Error(`Failed to parse response as JSON. ${jsonErr.message}. Content preview: ${textData.substring(0, 150)}`);
      }
      onAnalysisSuccess(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during AI clinical report decoding.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans text-left">
      {/* Step Banner */}
      <div className="p-5 bg-white border border-[#90E0EF]/40 rounded-2xl shadow-sm flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
        <div>
          <h3 className="text-[#03045E] font-bold text-lg">Report Identification</h3>
          <p className="text-slate-500 text-xs mt-1">
            Provide the patient details and choose the laboratory documents file.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-initial">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Patient Name</label>
            <input
              id="patient-name-input"
              type="text"
              value={patient.name}
              onChange={(e) => handlePatientFieldChange("name", e.target.value)}
              placeholder="e.g. Jonathan Carter"
              className="px-3 py-1.5 border border-slate-200 outline-none rounded-lg text-sm focus:border-[#0077B6] w-full"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Age</label>
            <input
              id="patient-age-input"
              type="number"
              value={patient.age}
              onChange={(e) => handlePatientFieldChange("age", e.target.value)}
              placeholder="34"
              className="px-3 py-1.5 border border-slate-200 outline-none rounded-lg text-sm focus:border-[#0077B6] w-20"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h4 className="text-sm font-bold text-[#03045E] uppercase tracking-wide">Document Uploader</h4>
            
            <div
              id="drag-drop-zone"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerSearch}
              className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragActive 
                  ? "border-[#0077B6] bg-[#CAF0F8]/10" 
                  : file 
                    ? "border-emerald-500 bg-emerald-50/10" 
                    : "border-slate-200 hover:border-[#0077B6] hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="application/pdf, image/jpeg, image/png"
                className="hidden"
              />

              {file ? (
                <>
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{file.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB • READY</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-lg bg-sky-50 text-[#0077B6] flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Drag & drop files here</p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, JPEG, or PNG formats up to 10MB</p>
                </>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 flex gap-2 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {file && (
              <div className="flex gap-2">
                <button
                  id="btn-remove-file"
                  onClick={clearFile}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer"
                >
                  Remove File
                </button>
                <button
                  id="btn-process-report"
                  disabled={isLoading}
                  onClick={processReport}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-[#0077B6] hover:bg-[#0077B6]/95 hover:shadow transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Parsing...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Extract Info</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-3">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#0077B6]" />
              <span>Security Protocols</span>
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              All documents are scrutinized locally on private backends and cleared following active sessions. MedVision does not retain diagnostic clinical profiles.
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="relative w-16 h-16 mb-6">
                {/* Circular ripple animation */}
                <div className="absolute inset-0 rounded-full border-2 border-[#90E0EF]/60 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-[#0077B6]/30 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-[#0077B6] flex items-center justify-center text-white text-lg font-bold">
                  ✙
                </div>
              </div>
              <h3 className="text-base font-bold text-[#03045E]">AI Clinical Interpreter Running</h3>
              <p className="text-slate-500 text-xs tracking-wide uppercase font-mono mt-1 animate-pulse">
                {stepsMessage}
              </p>
              <p className="text-[11px] text-neutral-400 max-w-sm mt-4 leading-normal font-sans">
                Please wait a few moments. Our responsive health model translates cells indices reports and identifies deviations.
              </p>
            </div>
          ) : reportAnalysis ? (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white border border-[#CAF0F8] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-[#CAF0F8]/30 to-[#90E0EF]/10 border-b border-[#CAF0F8] px-6">
                  <h4 className="text-xs font-bold text-[#0077B6] uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#0077B6]" />
                    <span>Analytical Summary Recipient</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Summary of extracted findings</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#03045E]/90 leading-relaxed font-serif">
                    {reportAnalysis.summary}
                  </p>
                </div>
              </div>

              {/* Grid: Observations + Critical Readings */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* High Observations */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-left">
                  <h4 className="text-xs font-bold text-[#03045E] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                    ■ Clinical Observations
                  </h4>
                  <ul className="space-y-3">
                    {reportAnalysis.keyObservations && reportAnalysis.keyObservations.length > 0 ? (
                      reportAnalysis.keyObservations.map((obs, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed font-sans">
                          <ChevronRight className="w-3.5 h-3.5 text-[#0077B6] mt-0.5 flex-shrink-0" />
                          <span>{obs}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-400 italic font-sans">No key observations identified.</li>
                    )}
                  </ul>
                </div>

                {/* Things to monitor */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-left">
                  <h4 className="text-xs font-bold text-[#03045E] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                    ■ Health Aspects to Monitor
                  </h4>
                  <ul className="space-y-3">
                    {reportAnalysis.thingsToMonitor && reportAnalysis.thingsToMonitor.length > 0 ? (
                      reportAnalysis.thingsToMonitor.map((item, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed font-sans">
                          <div className="w-1.5 h-1.5 bg-[#0077B6] rounded-full mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-400 italic font-sans">No baseline factors flagged.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Abnormal Lab Values Box */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 overflow-hidden text-left">
                <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Flagged Deviations (Outside Reference Ranges)</span>
                </h4>

                {reportAnalysis.abnormalValues && reportAnalysis.abnormalValues.length > 0 ? (
                  <div className="space-y-4">
                    {reportAnalysis.abnormalValues.map((v, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-rose-50/30 border border-rose-100/30 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1 sm:max-w-md">
                          <span className="text-xs font-bold text-rose-950 block">{v.parameter}</span>
                          <p className="text-xs text-slate-500 leading-relaxed font-sans">{v.explanation}</p>
                        </div>
                        <div className="flex sm:flex-col justify-between sm:justify-start gap-4 text-right flex-shrink-0">
                          <div>
                            <span className="block text-[9px] text-slate-400 uppercase font-bold">Observed</span>
                            <span className="text-xs font-extrabold text-rose-600">{v.value}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 uppercase font-bold">Target Range</span>
                            <span className="text-xs font-medium text-slate-600">{v.standardRange}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-emerald-100 bg-emerald-50/20 text-center flex flex-col items-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                    <span className="text-xs font-bold text-emerald-950">Normal Health Markers</span>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                      All critical biological parameters catalogued in this specific report reside inside optimized reference scopes. Excellent job monitoring your diet!
                    </p>
                  </div>
                )}
              </div>

              {/* Explanations glossary list */}
              {reportAnalysis.terminologyExplanations && reportAnalysis.terminologyExplanations.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-left">
                  <h4 className="text-xs font-bold text-[#03045E] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5 text-slate-700">
                    <HelpCircle className="w-4 h-4 text-[#0077B6]" />
                    <span>Jargon Dictionary (Medical Conversions)</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {reportAnalysis.terminologyExplanations.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-sans">
                        <span className="text-xs font-bold text-[#03045E] block">{item.term}</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{item.simpleExplanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
              <FileText className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-sm font-bold text-slate-700">Analytical Canvas Empty</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-normal font-sans">
                Drag a laboratory metrics PDF/JPEG or configure Patient Details and click "Extract Info" above to trigger clinical AI interpretation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
