/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Activity, CheckSquare, Square, AlertTriangle, AlertOctagon, Heart, LifeBuoy, ArrowRight, RefreshCw, ChevronRight 
} from "lucide-react";
import { SymptomAnalysis, PatientDetails } from "../types";

interface SymptomTrackerProps {
  patient: PatientDetails;
  symptomAnalysis: SymptomAnalysis | null;
  onAnalysisSuccess: (analysis: SymptomAnalysis) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function SymptomTracker({
  patient,
  symptomAnalysis,
  onAnalysisSuccess,
  isLoading,
  setIsLoading
}: SymptomTrackerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const commonSymptoms = [
    "Fever",
    "Headache",
    "Cough",
    "Fatigue",
    "Stomach Pain",
    "Muscle Stiffness",
    "Sore Throat",
    "Nausea",
    "Shortness of Breath"
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(item => item !== symptom)
        : [...prev, symptom]
    );
  };

  const processSymptoms = async () => {
    if (selectedSymptoms.length === 0 && !customNotes.trim()) {
      setError("Please check at least one symptom or type inside the custom description.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          description: customNotes,
          patient: patient
        })
      });

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

      let data: SymptomAnalysis;
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
      setError(err.message || "Failed to catalog current symptoms. Verify connection/credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans text-left">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Checked Symptoms Configuration Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#03045E] uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0077B6]" />
                <span>Symptom Selection</span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">Toggle what symptoms represent current feelings.</p>
            </div>

            {/* Checkbox Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-2">
              {commonSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    id={`symptom-${symptom.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => toggleSymptom(symptom)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs font-semibold cursor-pointer transition-all ${
                      isSelected 
                        ? "border-[#0077B6] bg-[#CAF0F8]/20 text-[#0077B6] shadow-sm" 
                        : "border-slate-100 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#0077B6]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                    <span>{symptom}</span>
                  </button>
                );
              })}
            </div>

            {/* Freeform textarea */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Additional Health Details
              </label>
              <textarea
                id="symptoms-custom-notes"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Describe start times, intensity changes, or specific body segments affected here..."
                rows={4}
                className="w-full text-xs p-3 border border-slate-100 rounded-xl outline-none focus:border-[#0077B6] leading-relaxed resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-lg flex gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="btn-analyze-symptoms"
              disabled={isLoading}
              onClick={processSymptoms}
              className="w-full py-3 bg-[#0077B6] hover:bg-[#0077B6]/95 text-white text-xs font-bold rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating Symptoms...</span>
                </>
              ) : (
                <>
                  <span>Evaluate Symptoms</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>

          {/* Prompt warning disclaimer box - MANDATORY FEATURE */}
          <div className="p-5 border border-amber-200 bg-amber-50 rounded-2xl flex gap-3 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-950 uppercase tracking-wider block">Clinical Safety Disclaimer</span>
              <p className="leading-relaxed font-semibold italic text-amber-950">
                "This is not a medical diagnosis. Consult a healthcare professional for medical advice."
              </p>
              <p className="text-[10px] text-amber-800 leading-normal pt-1">
                The information provided by MedVision is for educational health support. Seek local in-person clinics for acute pain and persistent issues.
              </p>
            </div>
          </div>
        </div>

        {/* Symptoms Analysis Output Column */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="relative w-14 h-14 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-[#90E0EF]/60 animate-ping" />
                <div className="absolute inset-2 bg-[#0077B6] rounded-full flex items-center justify-center text-white text-lg font-bold">
                  ⚕
                </div>
              </div>
              <h3 className="text-base font-bold text-[#03045E]">AI Symptoms Classifier Assessing</h3>
              <p className="text-slate-500 text-xs tracking-wider font-mono mt-1 animate-pulse">
                Assessing biological pathways, pain receptors and benign causes...
              </p>
              <p className="text-[11px] text-neutral-400 max-w-sm mt-4 leading-normal font-sans">
                Our model interprets your inputs to categorize potential conditions, self-care routines, and emergency indicators.
              </p>
            </div>
          ) : symptomAnalysis ? (
            <div className="space-y-6">
              {/* Conditions Card list */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h4 className="text-xs font-bold text-[#03045E] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                  ■ Potential Underlying Causes (Clinically Checked)
                </h4>

                {symptomAnalysis.possibleCauses && symptomAnalysis.possibleCauses.length > 0 ? (
                  <div className="space-y-4">
                    {symptomAnalysis.possibleCauses.map((cause, idx) => {
                      const likelihoodColors = 
                        cause.likelihood === "High" 
                          ? { bg: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" }
                          : cause.likelihood === "Medium"
                            ? { bg: "bg-orange-50 text-orange-700 border-orange-100", dot: "bg-orange-500" }
                            : { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" };

                      return (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="space-y-1 text-left font-sans">
                            <span className="text-xs font-bold text-slate-800">{cause.condition}</span>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{cause.description}</p>
                          </div>
                          
                          <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 flex-shrink-0 self-start sm:self-auto ${likelihoodColors.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${likelihoodColors.dot}`} />
                            <span className="uppercase tracking-wide font-mono">{cause.likelihood} Likelihood</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No likely conditions detected.</p>
                )}
              </div>

              {/* Preventive Care Tips Card */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-left">
                <h4 className="text-xs font-bold text-[#0077B6] uppercase tracking-wider mb-4 pb-2 border-b border-[#CAF0F8] flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-[#0077B6]" />
                  <span>At-Home Self Care & Preventive Habits</span>
                </h4>
                <ul className="space-y-3 font-sans">
                  {symptomAnalysis.preventiveTips && symptomAnalysis.preventiveTips.length > 0 ? (
                    symptomAnalysis.preventiveTips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed font-sans">
                        <ChevronRight className="w-3.5 h-3.5 text-[#0077B6] mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic font-sans text-xs">No specific suggestions generated.</li>
                  )}
                </ul>
              </div>

              {/* Consultation Guidelines + Warning Signs */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Regular Consultation timeline */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-left">
                  <h4 className="text-xs font-bold text-[#03045E] uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-500" />
                    <span>In-Person Consult Guidelines</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal font-sans">
                    {symptomAnalysis.whenToConsult}
                  </p>
                </div>

                {/* Crimson emergency indicators */}
                <div className="bg-rose-50/20 border border-rose-100 rounded-2xl shadow-sm p-6 text-left">
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3 pb-2 border-b border-rose-100 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>Immediate Emergency Flags</span>
                  </h4>
                  <ul className="space-y-2">
                    {symptomAnalysis.warningSigns && symptomAnalysis.warningSigns.length > 0 ? (
                      symptomAnalysis.warningSigns.map((warn, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-rose-950 font-semibold leading-relaxed font-sans">
                          <span className="text-rose-500 mt-1 flex-shrink-0">■</span>
                          <span>{warn}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-rose-400 italic">No urgent indicators.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <Activity className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-sm font-bold text-slate-700">Symptom Timeline Empty</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-normal font-sans text-center">
                Toggle common symptoms, specify notes on physical reactions on the left panel, and click "Evaluate Symptoms" to start classification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
