/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  HeartPulse, Apple, GlassWater, Dribbble, CheckCircle2, Eye, RefreshCw, AlertCircle, Sparkles, ChevronRight 
} from "lucide-react";
import { ReportAnalysis, SymptomAnalysis, HealthRecommendations, PatientDetails } from "../types";

interface RecommendationsProps {
  patient: PatientDetails;
  reportAnalysis: ReportAnalysis | null;
  symptomAnalysis: SymptomAnalysis | null;
  recommendations: HealthRecommendations | null;
  onGenerationSuccess: (recs: HealthRecommendations) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function Recommendations({
  patient,
  reportAnalysis,
  symptomAnalysis,
  recommendations,
  onGenerationSuccess,
  isLoading,
  setIsLoading
}: RecommendationsProps) {
  const [error, setError] = useState<string | null>(null);

  const generateRecsMap = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: patient,
          reportAnalysis: reportAnalysis,
          symptomAnalysis: symptomAnalysis
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: HealthRecommendations = await response.json();
      onGenerationSuccess(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate unified AI health recommendations. Confirm key variables.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasInputs = reportAnalysis || symptomAnalysis;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans text-left">
      {/* Dynamic Generation Prompt Panel */}
      {!recommendations && (
        <div className="bg-white border border-[#90E0EF]/30 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1 font-sans">
            <h3 className="text-base font-bold text-[#03045E] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0077B6] animate-pulse" />
              <span>Tailor AI Recommendations</span>
            </h3>
            <p className="text-slate-500 text-xs leading-normal max-w-xl">
              MedVision aggregates parsed blood results, flagged deviations and symptom notes to formulate physical wellness strategies, nutrition maps and daily trackers.
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto text-right">
            {hasInputs ? (
              <button
                id="btn-generate-recommendations"
                disabled={isLoading}
                onClick={generateRecsMap}
                className="px-6 py-3 bg-[#0077B6] hover:bg-[#0077B6]/95 transition-all text-white font-semibold rounded-xl shadow hover:shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Compiling Guidelines...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Custom Tips</span>
                    <Sparkles className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            ) : (
              <div className="text-xs text-slate-400 font-semibold italic border border-dashed border-slate-200 bg-slate-50 p-3 rounded-xl text-center">
                ⚠ Analyze a Report or Symptoms first
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
          <div className="relative w-14 h-14 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-[#90E0EF]/60 animate-ping" />
            <div className="absolute inset-2 rounded bg-[#0077B6] flex items-center justify-center text-white text-lg font-bold">
              ⚕
            </div>
          </div>
          <h3 className="text-sm font-bold text-[#03045E]">AI Health Planner Restructuring</h3>
          <p className="text-slate-500 text-xs tracking-wider font-mono mt-1 animate-pulse">
            Combining cellular thresholds, symptoms guidelines and wellness metrics...
          </p>
        </div>
      ) : recommendations ? (
        <div className="space-y-8">
          {/* Main Top Banner */}
          <div className="p-6 bg-gradient-to-r from-[#CAF0F8]/30 to-[#90E0EF]/10 border border-[#CAF0F8] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#0077B6] uppercase tracking-widest font-mono flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-[#0077B6]" />
                <span>Aggregated Health Dashboard</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Simple, structured, evidence-guided non-pharmacological care points.</p>
            </div>
            {hasInputs && (
              <button
                id="btn-re-generate-recs"
                onClick={generateRecsMap}
                className="px-4 py-2 bg-white text-[#0077B6] hover:bg-[#CAF0F8]/20 transition-all font-semibold rounded-lg shadow-sm border border-[#90E0EF]/50 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Generate</span>
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* 1. Lifestyle Adjustments */}
            <div id="recs-lifestyle-card" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0077B6] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#03045E]">Lifestyle Guidelines</h4>
                  <p className="text-[10px] text-slate-400">Rest strategies and workplace adjustments</p>
                </div>
              </div>
              <ul className="space-y-3 font-sans">
                {recommendations.lifestyle.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-normal">
                    <ChevronRight className="w-4 h-4 text-[#0077B6] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Nutritional Diet Advice */}
            <div id="recs-diet-card" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#CAF0F8] text-[#0077B6] flex items-center justify-center">
                  <Apple className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#03045E]">Nutritional Diet Suggestions</h4>
                  <p className="text-[10px] text-slate-400">Body-specific healthy diets & elements</p>
                </div>
              </div>
              <ul className="space-y-3 font-sans">
                {recommendations.diet.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-normal">
                    <ChevronRight className="w-4 h-4 text-[#0077B6] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Hydration Guidelines */}
            <div id="recs-hydration-card" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0077B6] flex items-center justify-center">
                  <GlassWater className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#03045E]">Suggested Hydration Targets</h4>
                  <p className="text-[10px] text-slate-400">Fluid limits, intervals and electrolytes</p>
                </div>
              </div>
              <ul className="space-y-3 font-sans">
                {recommendations.hydration.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-normal">
                    <ChevronRight className="w-4 h-4 text-[#0077B6] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Restorative Movements */}
            <div id="recs-exercise-card" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#CAF0F8] text-[#0077B6] flex items-center justify-center">
                  <Dribbble className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#03045E]">Physical Movement Guidelines</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Restoring joint fluidity and circulation</p>
                </div>
              </div>
              <ul className="space-y-3 font-sans">
                {recommendations.exercise.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-normal">
                    <ChevronRight className="w-4 h-4 text-[#0077B6] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* At home monitoring tips card */}
          {recommendations.monitoringTips && recommendations.monitoringTips.length > 0 && (
            <div id="recs-monitoring-card" className="bg-white border border-emerald-100 bg-emerald-50/10 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                <span>At-Home Self Metrics Logging Tips</span>
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.monitoringTips.map((tip, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-100 text-left">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Metric {idx + 1}</span>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 font-sans">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
          <HeartPulse className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-sm font-bold text-slate-700">Recommendations Panel Locked</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 leading-normal font-sans">
            Tailored AI recommendation charts form by synthesizing details from previous tabs. Upload laboratory metrics files or report symptoms first.
          </p>
        </div>
      )}
    </div>
  );
}
