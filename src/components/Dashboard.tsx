/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  FileText, Activity, HeartPulse, Download, FilePlus2, User, ChevronRight, Calendar, ArrowLeft, RefreshCw 
} from "lucide-react";
import { MedicalCase, PatientDetails, ReportAnalysis, SymptomAnalysis, HealthRecommendations } from "../types";
import { DEMO_CASE } from "../data/demoData";
import { generateMedicalPdf } from "../utils/pdf";
import ReportAnalyzer from "./ReportAnalyzer";
import SymptomTracker from "./SymptomTracker";
import Recommendations from "./Recommendations";

interface DashboardProps {
  initialDemo: boolean;
  onBackToLanding: () => void;
}

export default function Dashboard({ initialDemo, onBackToLanding }: DashboardProps) {
  // Store the unified medical case state
  const [medicalCase, setMedicalCase] = useState<MedicalCase>(() => {
    if (initialDemo) {
      return JSON.parse(JSON.stringify(DEMO_CASE));
    }
    return {
      patient: {
        name: "",
        age: "",
        gender: "Male",
        bloodType: "O-Positive",
        date: new Date().toISOString(),
      },
      reportAnalysis: null,
      symptomAnalysis: null,
      recommendations: null,
    };
  });

  const [activeTab, setActiveTab] = useState<"reports" | "symptoms" | "recs">("reports");
  const [reportsLoading, setReportsLoading] = useState(false);
  const [symptomsLoading, setSymptomsLoading] = useState(false);
  const [recsLoading, setRecsLoading] = useState(false);

  const loadDemoCase = () => {
    setMedicalCase(JSON.parse(JSON.stringify(DEMO_CASE)));
    setActiveTab("reports");
  };

  const clearCase = () => {
    setMedicalCase({
      patient: {
        name: "",
        age: "",
        gender: "Male",
        bloodType: "O-Positive",
        date: new Date().toISOString(),
      },
      reportAnalysis: null,
      symptomAnalysis: null,
      recommendations: null,
    });
    setActiveTab("reports");
  };

  const handlePatientChange = (updatedPatient: PatientDetails) => {
    setMedicalCase(prev => ({ ...prev, patient: updatedPatient }));
  };

  const handleReportSuccess = (analysis: ReportAnalysis) => {
    setMedicalCase(prev => ({ ...prev, reportAnalysis: analysis }));
    // Automatically switch or show update
  };

  const handleSymptomSuccess = (analysis: SymptomAnalysis) => {
    setMedicalCase(prev => ({ ...prev, symptomAnalysis: analysis }));
  };

  const handleRecsSuccess = (recs: HealthRecommendations) => {
    setMedicalCase(prev => ({ ...prev, recommendations: recs }));
  };

  const triggerPdfDownload = () => {
    const { patient, reportAnalysis, symptomAnalysis, recommendations } = medicalCase;
    
    // Ensure we have at least patient name or basic results before saving
    const finalPatient = {
      ...patient,
      name: patient.name.trim() || "Anonymous Patient",
      date: patient.date || new Date().toISOString()
    };

    const doc = generateMedicalPdf(finalPatient, reportAnalysis, symptomAnalysis, recommendations);
    const sanitizedName = finalPatient.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    doc.save(`MedVision_${sanitizedName}_Clinical_Report.pdf`);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pb-20 text-[#03045E]">
      {/* Upper Navigation Rail */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Back Action */}
          <div className="flex items-center gap-4">
            <button
              id="btn-back-home"
              onClick={onBackToLanding}
              className="p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold text-slate-500 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0077B6] flex items-center gap-1">
              ✙ MedVision AI Core
            </span>
          </div>

          {/* Quick Loading/Resets Controls */}
          <div className="flex gap-2">
            <button
              id="btn-load-demo-scenario"
              onClick={loadDemoCase}
              className="px-3.5 py-1.5 bg-[#CAF0F8] hover:bg-[#CAF0F8]/80 text-[#0077B6] text-xs font-bold rounded-lg transition-all border border-[#90E0EF]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Pre-load Demo Scenario</span>
            </button>
            <button
              id="btn-clear-scenario"
              onClick={clearCase}
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-lg transition-all hover:bg-slate-50 cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Workspace Workspace Column */}
          <div className="lg:col-span-9 space-y-8">
            {/* Main Tabs Navigation Header */}
            <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm gap-1 self-start">
              <button
                id="tab-reports"
                onClick={() => setActiveTab("reports")}
                className={`flex-1 py-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "reports" 
                    ? "bg-[#0077B6] text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Report Analyzer</span>
                {medicalCase.reportAnalysis && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                id="tab-symptoms"
                onClick={() => setActiveTab("symptoms")}
                className={`flex-1 py-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "symptoms" 
                    ? "bg-[#0077B6] text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>2. Symptom Tracker</span>
                {medicalCase.symptomAnalysis && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                id="tab-recs"
                onClick={() => setActiveTab("recs")}
                className={`flex-1 py-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "recs" 
                    ? "bg-[#0077B6] text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span>3. AI Recommendations</span>
                {medicalCase.recommendations && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>

            {/* Dynamic Content Views */}
            <div className="transition-all duration-300">
              {activeTab === "reports" && (
                <ReportAnalyzer
                  patient={medicalCase.patient}
                  onPatientChange={handlePatientChange}
                  reportAnalysis={medicalCase.reportAnalysis}
                  onAnalysisSuccess={handleReportSuccess}
                  isLoading={reportsLoading}
                  setIsLoading={setReportsLoading}
                />
              )}

              {activeTab === "symptoms" && (
                <SymptomTracker
                  patient={medicalCase.patient}
                  symptomAnalysis={medicalCase.symptomAnalysis}
                  onAnalysisSuccess={handleSymptomSuccess}
                  isLoading={symptomsLoading}
                  setIsLoading={setSymptomsLoading}
                />
              )}

              {activeTab === "recs" && (
                <Recommendations
                  patient={medicalCase.patient}
                  reportAnalysis={medicalCase.reportAnalysis}
                  symptomAnalysis={medicalCase.symptomAnalysis}
                  recommendations={medicalCase.recommendations}
                  onGenerationSuccess={handleRecsSuccess}
                  isLoading={recsLoading}
                  setIsLoading={setRecsLoading}
                />
              )}
            </div>
          </div>

          {/* Sidebar Panel Action Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Health Case Recap Widget */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-left space-y-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4 text-[#0077B6]" />
                <span>Active Profile</span>
              </h4>

              <div className="space-y-3.5 font-sans">
                <div className="border-b border-slate-100 pb-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">User Name</span>
                  <span className="text-xs font-bold text-slate-700 truncate block">
                    {medicalCase.patient.name.trim() || "[Not set yet]"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Age (Yrs)</span>
                    <span className="text-xs font-bold text-slate-700">
                      {medicalCase.patient.age || "--"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Blood Group</span>
                    <span className="text-xs font-bold text-slate-700">
                      {medicalCase.patient.bloodType || "O-Positive"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-400 font-medium">Reports Parsed:</span>
                  <span className={`font-bold ${medicalCase.reportAnalysis ? "text-emerald-600" : "text-slate-400"}`}>
                    {medicalCase.reportAnalysis ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Symptoms Cataloged:</span>
                  <span className={`font-bold ${medicalCase.symptomAnalysis ? "text-emerald-600" : "text-slate-400"}`}>
                    {medicalCase.symptomAnalysis ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Wellness Plan:</span>
                  <span className={`font-bold ${medicalCase.recommendations ? "text-emerald-600" : "text-slate-400"}`}>
                    {medicalCase.recommendations ? "Ready" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Master Download Action PDF - MOST IMPORTANT FEATURE */}
              <button
                id="btn-master-download-pdf"
                onClick={triggerPdfDownload}
                className="w-full py-3 bg-[#0077B6] hover:bg-[#0077B6]/95 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer pt-3 pl-3 pr-3 pb-3"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download Clinical PDF</span>
              </button>
            </div>

            {/* Quick Demo Assist notes */}
            <div className="p-4 rounded-xl bg-[#CAF0F8]/10 border border-[#90E0EF]/40 text-left">
              <span className="text-[10px] uppercase font-bold text-[#0077B6]">Evaluation Support</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-sans">
                Review sections using artificial metrics. Click <strong>"Pre-load Demo Scenario"</strong> in the header bar above to populate records representing an active case scenario instantly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
