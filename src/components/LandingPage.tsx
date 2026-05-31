/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  FileText, Activity, Download, HeartPulse, CheckCircle2, ArrowRight, ShieldCheck, 
  Brain, FilePlus2, Sparkles, AlertTriangle, X, Eye, Layers, ChevronRight, Zap, ListTodo, Heart, Info, AlertOctagon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DEMO_CASE } from "../data/demoData";
import { generateMedicalPdf } from "../utils/pdf";

interface LandingPageProps {
  onStart: (demo: boolean) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoModalTab, setDemoModalTab] = useState<"report" | "analysis" | "recs" | "pdf">("report");
  const [beforeAfterActive, setBeforeAfterActive] = useState<"before" | "after" | "both">("both");
  const [pdfHovered, setPdfHovered] = useState(false);

  // Download Demo Case PDF instantly
  const downloadDemoPdf = () => {
    const doc = generateMedicalPdf(
      DEMO_CASE.patient,
      DEMO_CASE.reportAnalysis,
      DEMO_CASE.symptomAnalysis,
      DEMO_CASE.recommendations
    );
    doc.save("MedVision_Jonathan_Carter_Demo_Report.pdf");
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#03045E] overflow-x-hidden">
      {/* Upper Subtle HIPAA Branding Banner */}
      <div className="w-full bg-[#CAF0F8]/40 border-b border-[#90E0EF]/30 py-2.5 text-center text-xs font-semibold tracking-wide text-[#0077B6] flex items-center justify-center gap-2 px-4 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-[#0077B6] animate-pulse" />
        <span>Secure & HIPAA-Compliant AI Analytical Assistant — Built with Google Gemini</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CAF0F8] text-[#0077B6] text-xs font-semibold mb-6 shadow-sm border border-[#90E0EF]/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0077B6] animate-spin" style={{ animationDuration: "3s" }} />
              <span>Next-Gen Medical Report Analyzer</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6.5xl font-extrabold tracking-tight text-[#03045E] leading-tight mb-6"
            >
              Understand Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] to-[#00B4D8] drop-shadow-sm">Medical Reports</span> with AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-slate-600 mb-8 max-w-xl leading-relaxed font-sans"
            >
              Upload raw blood tests, scan doctor prescriptions, track somatic symptoms, and receive beautiful, human-readable health advice. MedVision instantly translates complex jargon into actionable guidelines.
            </motion.p>

            {/* Glowing Hero Section Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                id="btn-analyze-report"
                onClick={() => onStart(false)}
                className="group px-8 py-4 bg-[#0077B6] hover:bg-[#0077B6]/95 transition-all text-white font-bold rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(0,119,182,0.4)] flex items-center justify-center gap-2 text-base cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Analyze Report</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                id="btn-get-demo"
                onClick={() => {
                  setDemoModalTab("report");
                  setIsDemoModalOpen(true);
                }}
                className="px-8 py-4 bg-white border-2 border-[#90E0EF] text-[#0077B6] hover:bg-[#CAF0F8]/20 transition-all font-bold rounded-xl shadow-sm hover:shadow-[0_0_15px_rgba(144,224,239,0.3)] flex items-center justify-center gap-2 text-base cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <FilePlus2 className="w-5 h-5 text-[#0077B6]" />
                <span>Get Demo</span>
              </button>
            </motion.div>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0077B6] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">MD</div>
                <div className="w-8 h-8 rounded-full bg-[#00B4D8] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">RN</div>
                <div className="w-8 h-8 rounded-full bg-[#90E0EF] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white text-[#03045E]">AI</div>
              </div>
              <p className="text-xs text-slate-500 leading-normal max-w-sm">
                Clinically referenced pathways reviewed by health systems. <strong className="text-slate-700">HIPAA compliant</strong> and secure.
              </p>
            </div>
          </div>

          {/* Core Interactive Dashboard Representation */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md bg-white border border-[#CAF0F8] rounded-2xl shadow-xl p-6 relative hover:shadow-2xl transition-all"
            >
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#CAF0F8]/60 rounded-full blur-3xl -z-10" />
              
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    ✙
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-[#03045E]">MedVision Clinical Portal</h4>
                    <p className="text-[9px] text-[#0077B6] font-mono">SECURE AGENT ONLINE</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#0077B6] bg-[#CAF0F8] px-2.5 py-0.5 rounded-full font-bold">LIVE METRICS</span>
              </div>

              {/* Patient Badge */}
              <div className="my-4 bg-[#CAF0F8]/20 p-3 rounded-xl border border-[#90E0EF]/20 text-[11px] grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">MOCK CASE</span>
                  <strong className="text-slate-700 text-xs">Jonathan Carter</strong>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">HEALTH SCORE</span>
                  <span className="text-xs text-[#0077B6] font-extrabold bg-[#CAF0F8]/40 px-2 py-0.5 rounded-md">84 / 100</span>
                </div>
              </div>

              {/* Mini Content Rows */}
              <div className="space-y-3.5 text-left pt-1">
                <div className="p-2.5 rounded-lg border border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>1. Lab report analysis</span>
                    </span>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-md">2 alerts detected</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                    Hemoglobin level checks at 11.4 g/dL and TSH tracks slightly elevated at 5.8 uIU/mL. Remaining profiles are optimal.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>2. Symptom guidelines</span>
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-md">Low-Risk Causes</span>
                  </div>
                  <div className="flex gap-1 flex-wrap pt-1">
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold font-sans">Fatigue</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold font-sans font-sans">Mild Headache</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <span className="text-xs font-bold text-slate-800 block mb-1">3. Guided AI Solutions</span>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[9px] bg-[#CAF0F8] text-[#0077B6] px-2 py-0.5 rounded-md font-bold font-sans">Fluid index: 2.8L</span>
                    <span className="text-[9px] bg-[#CAF0F8] text-[#0077B6] px-2 py-0.5 rounded-md font-bold font-sans">Iron-rich spinach</span>
                    <span className="text-[9px] bg-[#CAF0F8] text-[#0077B6] px-2 py-0.5 rounded-md font-bold font-sans">Neck stretches</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-[#CAF0F8] pt-4.5 flex justify-between items-center bg-sky-50/20 -mx-6 -mb-6 p-4 rounded-b-2xl">
                <span className="text-[9px] text-[#0077B6] font-bold tracking-wider uppercase flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Educational Support Only</span>
                </span>
                <button
                  onClick={downloadDemoPdf}
                  className="text-xs text-[#0077B6] hover:text-[#005F9E] font-bold flex items-center gap-1.5 cursor-pointer hover:underline transition-all bg-white py-1 px-3.5 rounded-lg border border-[#CAF0F8] shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 1. Before vs After AI Analysis Section */}
      <section className="bg-slate-50 border-y border-slate-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-3.5">
            <span className="text-xs font-bold text-[#0077B6] uppercase tracking-widest block font-mono">
              ★ DEMO-LEVEL ACCESSIBILITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#03045E]">
              From Medical Jargon to Clear Insights
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto font-sans">
              Interact with the comparison card below to observe how MedVision's clinical engine decodes incomprehensible raw measurements into clear explanations.
            </p>
          </div>

          {/* Interactive Comparison Wrapper */}
          <div className="grid md:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Control Toggles */}
            <div className="md:col-span-12 flex justify-center">
              <div className="bg-white border border-slate-200/60 p-1.5 rounded-xl shadow-sm flex gap-1 z-10">
                <button
                  onClick={() => setBeforeAfterActive("before")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    beforeAfterActive === "before"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  Raw Medical Report
                </button>
                <button
                  onClick={() => setBeforeAfterActive("both")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    beforeAfterActive === "both"
                      ? "bg-[#03045E] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  Interactive Side-by-Side
                </button>
                <button
                  onClick={() => setBeforeAfterActive("after")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    beforeAfterActive === "after"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  AI Guided Interpretation
                </button>
              </div>
            </div>

            {/* Left Box: Dense Hospital Document */}
            {(beforeAfterActive === "before" || beforeAfterActive === "both") && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`${
                  beforeAfterActive === "both" ? "md:col-span-6" : "md:col-span-12"
                } bg-white rounded-2xl border-2 border-dashed border-red-200/75 p-6 shadow-sm text-left relative flex flex-col justify-between overflow-hidden`}
              >
                {/* Decorative retro laboratory grid overlay */}
                <div className="absolute top-0 right-0 p-3 bg-red-50 text-[9px] text-red-600 font-mono font-bold rounded-bl-xl uppercase tracking-wider">
                  ⚠️ Dense Jargon Log
                </div>

                <div className="space-y-4 font-mono text-slate-800">
                  <div className="border-b border-rose-100 pb-3">
                    <span className="text-[10px] font-bold text-red-500">SYSTEM: HEMATOLOGY LAB_CORE_B7293</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5">CBC & METAB_PANEL_RECORDS</h4>
                  </div>
                  
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex justify-between items-center p-2 rounded bg-rose-50/50 border border-rose-100/30">
                      <span>Hemoglobin (Hb/HGB)</span>
                      <strong className="text-red-600">10.2 g/dL [L]</strong>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-rose-50/50 border border-rose-100/30">
                      <span>Low Density Lipoprotein (LDL)</span>
                      <strong className="text-red-600">165 mg/dL [H]</strong>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-rose-50/50 border border-rose-100/30">
                      <span>25-Hydroxy Vitamin D [Vit-D3]</span>
                      <strong className="text-red-600">14 ng/mL [L]</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] text-slate-500 leading-normal">
                    NOTES: Hb concentration registers statistically suboptimal. LDL-C shows hyperhypocholesterolemia profile with arterial lipid aggregation potential. S-25-hydroxy Ergocalciferol suggests distinct biological sunlight deficiency.
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Lab ID: #920-CBC</span>
                  <span className="text-[10px] font-bold text-red-500 tracking-wider font-mono">UNINTERPRETED DATA</span>
                </div>
              </motion.div>
            )}

            {/* Right Box: AI Friendly Guide */}
            {(beforeAfterActive === "after" || beforeAfterActive === "both") && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`${
                  beforeAfterActive === "both" ? "md:col-span-6" : "md:col-span-12"
                } bg-white rounded-2xl border border-emerald-100 p-6 shadow-md hover:shadow-lg text-left relative flex flex-col justify-between`}
              >
                {/* Visual indicator header */}
                <div className="absolute top-0 right-0 p-3 bg-emerald-50 text-[9px] text-emerald-700 font-mono font-bold rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI CLEAR EXPLANATION</span>
                </div>

                <div className="space-y-4 font-sans">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold text-[#0077B6] uppercase tracking-wide">Processed by MedVision AI</span>
                    <h5 className="text-xs font-extrabold text-[#03045E] mt-0.5">Clinical Wellness Insights</h5>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <div className="p-3 bg-emerald-50/20 rounded-xl border border-emerald-100/35 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <div className="space-y-1 font-sans">
                        <strong className="text-xs text-slate-800 font-sans">Low Hemoglobin Detected (Oxygen Flow)</strong>
                        <p className="text-[11px] text-slate-600 leading-normal font-sans">
                          Your iron-carrying protein is low. This explains symptoms of fatigue and low energy.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/20 rounded-xl border border-emerald-100/35 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-800 font-sans font-sans">High Cholesterol Found (Cholesterol Markers)</strong>
                        <p className="text-[11px] text-slate-600 leading-normal font-sans">
                          Slightly elevated general fat levels. Routine fitness movements can safely rebalance this ratio.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/20 rounded-xl border border-emerald-100/35 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <strong className="text-xs text-slate-800 font-sans font-sans font-sans">Vitamin D Deficiency Identified (Bone & Defense)</strong>
                        <p className="text-[11px] text-slate-600 leading-normal font-sans">
                          Critical trace element tracks low. Sunlight sessions and basic diet integrations are recommended.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bullet tips summary boxes */}
                  <div className="bg-[#CAF0F8]/10 p-3.5 rounded-xl border border-[#90E0EF]/30 mt-2 space-y-1.5 text-xs text-[#03045E]">
                    <span className="block text-[9px] uppercase font-bold text-[#0077B6] tracking-wider">Lifestyle Recommendations</span>
                    <ul className="space-y-1 text-[11px] text-[#03045E]/90 font-sans font-bold">
                      <li className="flex gap-1.5 items-center">• Improve iron intake (lentils, spinach, lean proteins)</li>
                      <li className="flex gap-1.5 items-center">• Exercise regularly (20-30m brisk walking)</li>
                      <li className="flex gap-1.5 items-center">• Consult physician for localized care & Vit-D guides</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">Status: Secure Interpretation</span>
                  <span className="text-[10px] font-bold text-[#0077B6] tracking-wider flex items-center gap-1.5 font-sans">
                    <span>99% Translation Rate</span>
                  </span>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* 2. Interactive PDF Showcase */}
      <section className="py-20 bg-white border-b border-slate-100 overflow-hidden relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-bold text-[#0077B6] bg-[#CAF0F8] px-3.5 py-1.5 rounded-full inline-block font-mono uppercase tracking-widest">
              ★ PRESENTATION-READY REPORTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#03045E]">
              Beautiful Health Reports Generated Instantly
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-sans">
              Export comprehensive case evaluations into a professionally laid out PDF designed for clear communication. From elegant summary sheets to customized color charts, share structured metrics seamlessly inside physical clinical visits.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 shadow-sm animate-bounce">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Generated in Under 10 Seconds</span>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans text-xs font-bold text-slate-700 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Modern Cover Page</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Circular Health Score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Executive Summary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Abnormal Value Guides</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>At-Home Daily Habits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Emergency Signals List</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={downloadDemoPdf}
                className="px-6 py-3.5 bg-[#0077B6] hover:bg-[#0077B6]/95 text-white font-bold text-xs rounded-xl shadow hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Get Sample PDF Report</span>
              </button>
            </div>
          </div>

          {/* Premium Floating PDF Preview with Page-Flip/Tilt Hover effect */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div 
              className="relative p-6 cursor-pointer"
              onMouseEnter={() => setPdfHovered(true)}
              onMouseLeave={() => setPdfHovered(false)}
            >
              <div className="absolute inset-0 bg-[#CAF0F8]/30 rounded-full blur-3xl -z-10 animate-pulse" />

              {/* Dynamic Stacked 3D Cards */}
              <motion.div
                animate={{
                  rotateY: pdfHovered ? -12 : -4,
                  rotateX: pdfHovered ? 12 : 5,
                  z: pdfHovered ? 30 : 0
                }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm sm:w-[350px] bg-white rounded-2xl border border-slate-200 shadow-xl p-6 relative perspective-1000 transform-gpu"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Cover Page Representation */}
                <div className="absolute top-3 right-4 bg-[#CAF0F8] text-[#0077B6] font-mono text-[8px] font-bold px-2 py-0.5 rounded uppercase">
                  Page 1 of 3
                </div>

                {/* PDF Header Logo */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
                  <div className="w-7 h-7 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded flex items-center justify-center text-white text-[12px] font-bold">
                    ✙
                  </div>
                  <div className="text-left font-sans">
                    <h5 className="text-[10px] font-extrabold text-[#03045E] uppercase tracking-wide">MEDVISION MEDICAL EXAM</h5>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Consolidated Patient Dashboard</p>
                  </div>
                </div>

                {/* Cover Page Info */}
                <div className="mt-5 space-y-4 text-left font-sans">
                  <div className="bg-[#CAF0F8]/20 p-2.5 rounded-lg border border-[#90E0EF]/10 flex justify-between items-center text-[9px] text-slate-600">
                    <div>
                      <span>Patient: <strong>Jonathan Carter</strong></span>
                      <span className="block mt-0.5">Reference ID: <strong>MV-829103</strong></span>
                    </div>
                    <div className="bg-white/80 p-1.5 rounded border border-slate-100 font-bold text-center text-[#0077B6]">
                      84 Score
                    </div>
                  </div>

                  {/* Simulated Core Sections */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#03045E] block mb-0.5">■ EXECUTIVE SUMMARY</span>
                      <p className="text-[9px] text-slate-500 leading-relaxed font-sans font-bold">
                        Mild nutritional deficiencies indicated. Slightly elevated TSH points toward subclinical endocrine stresses, with other critical bioscales tracking inside healthy parameters.
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-[#03045E] block mb-1">■ RECENT FINDINGS & LAB EXPLANATIONS</span>
                      <div className="rounded-lg border border-slate-100 divide-y divide-slate-100">
                        <div className="p-1.5 flex justify-between text-[8px] bg-sky-50/50">
                          <span className="font-semibold text-slate-700">Hemoglobin (Hb/HGB)</span>
                          <span className="text-red-500 font-bold">11.4 g/dL (Normal: 13.5-17.5)</span>
                        </div>
                        <div className="p-1.5 flex justify-between text-[8px]">
                          <span className="font-semibold text-slate-700">Thyroid Stimulating Hormone</span>
                          <span className="text-red-500 font-bold">5.8 uIU/mL (Normal: 0.4-4.5)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-[#03045E] block mb-1">■ WELLNESS RECOMMENDATIONS</span>
                      <div className="space-y-1 text-[8.5px] text-slate-600 font-sans">
                        <div className="flex gap-1.5 items-start">
                          <span className="text-[#0077B6]">•</span>
                          <span>Incorporate iron-rich diet (spinach, beans, proteins)</span>
                        </div>
                        <div className="flex gap-1.5 items-start">
                          <span className="text-[#0077B6]">•</span>
                          <span>Hydration target index of 2.8 liters per day</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer and flip sign indicator */}
                <div className="mt-6 pt-3.5 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-4.5 rounded-b-2xl">
                  <span className="text-[8px] font-bold text-slate-400 font-mono tracking-wide uppercase">CONFIDENTIAL LAB REPORT</span>
                  <span className="text-[9px] text-[#0077B6] font-bold flex items-center gap-1.5 animate-pulse">
                    Hover to tilt/zoom <ChevronRight className="w-3 h-3 text-[#0077B6]" />
                  </span>
                </div>
              </motion.div>

              {/* Offset stacked page representation on background */}
              <div className="absolute top-10 left-12 w-[350px] h-[480px] bg-slate-100 border border-slate-200 shadow rounded-2xl -z-10 group-hover:left-14 transition-all" />
              <div className="absolute top-14 left-18 w-[350px] h-[480px] bg-slate-200/50 border border-slate-300 shadow rounded-2xl -z-20 group-hover:left-22 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Intelligence Visualization */}
      <section className="py-20 bg-[#CAF0F8]/10 border-b border-[#CAF0F8]/30 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-3.5 max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#0077B6] bg-[#CAF0F8] px-3.5 py-1.5 rounded-full inline-block font-mono uppercase tracking-widest">
              ★ SYSTEM PIPELINE MAP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#03045E]">
              Powered by Google Gemini
            </h2>
            <p className="text-slate-500 text-sm font-sans mx-auto leading-relaxed">
              Our clinical analytical gateway directs health profiles through safety nodes, delivering precise summaries, daily habits, and instant PDF worksheets.
            </p>
          </div>

          {/* Central AI Brain pipeline illustration with animated flows */}
          <div className="relative mt-12 py-10 max-w-4xl mx-auto">
            
            {/* Visual SVG Connecting lines - Hidden on mobile, fully scaled on desktops */}
            <div className="absolute inset-0 hidden md:block">
              {/* Central canvas or SVG overlay for lines */}
              <svg className="w-full h-full text-[#90E0EF]/60 stroke-2 fill-none" xmlns="http://www.w3.org/2000/svg">
                {/* Connecting paths */}
                <path d="M 120 100 Q 280 150 450 250" className="animate-pulse" style={{ strokeDasharray: "5,5" }} />
                <path d="M 120 250 Q 280 250 450 250" className="animate-pulse" style={{ strokeDasharray: "5,5" }} />
                <path d="M 120 400 Q 280 350 450 250" className="animate-pulse" style={{ strokeDasharray: "5,5" }} />
                
                <path d="M 450 250 Q 620 150 780 100" className="animate-pulse" style={{ strokeDasharray: "5,5" }} />
                <path d="M 450 250 Q 620 250 780 250" className="animate-pulse" style={{ strokeDasharray: "5,5" }} />
                <path d="M 450 250 Q 620 350 780 400" className="animate-pulse" style={{ strokeDasharray: "5,5" }} />
              </svg>
            </div>

            {/* Layout Grid container */}
            <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
              
              {/* Column 1: INPUT STREAM */}
              <div className="space-y-6 flex flex-col items-center md:items-start text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-[#0077B6] block mb-1">
                  1. Structured Inputs
                </span>
                
                {/* Input Card 1 */}
                <div className="w-full max-w-xs bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#0077B6] flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    📄
                  </div>
                  <div className="text-left font-sans">
                    <strong className="text-xs font-extrabold text-[#03045E] block leading-tight">Medical Reports</strong>
                    <span className="text-[10px] text-slate-500 font-bold block font-sans">Blood tests & lab PDFs</span>
                  </div>
                </div>

                {/* Input Card 2 */}
                <div className="w-full max-w-xs bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#CAF0F8] text-[#0077B6] flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    🩸
                  </div>
                  <div className="text-left">
                    <strong className="text-xs font-extrabold text-[#03045E] block leading-tight">Blood Panels</strong>
                    <span className="text-[10px] text-slate-500 font-semibold block font-sans">Biochemical reference ranges</span>
                  </div>
                </div>

                {/* Input Card 3 */}
                <div className="w-full max-w-xs bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    📝
                  </div>
                  <div className="text-left">
                    <strong className="text-xs font-extrabold text-[#03045E] block leading-tight text-slate-800">Symptom Notes</strong>
                    <span className="text-[10px] text-slate-500 font-semibold block font-sans">Physical reactions timeline</span>
                  </div>
                </div>
              </div>

              {/* Column 2: THE CENTRAL AI CORE */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Glowing core waves */}
                  <div className="absolute inset-0 rounded-full bg-[#90E0EF]/30 blur-2xl animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-[#0077B6]/15 blur-xl animate-pulse" />
                  
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] border border-white text-white flex flex-col items-center justify-center shadow-lg relative z-10 hover:scale-105 transition-transform">
                    <Brain className="w-10 h-10 text-white animate-pulse" />
                    <span className="text-[9px] font-mono font-black tracking-widest text-[#CAF0F8] mt-1.5 uppercase">
                      Gemini Core
                    </span>
                  </div>
                </div>

                <div className="mt-4.5 space-y-1">
                  <span className="text-xs font-extrabold text-[#03045E] block">AI Analysis Pipeline</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono text-[9px] font-bold">
                    ● DISPATCHING SOLUTIONS
                  </span>
                </div>
              </div>

              {/* Column 3: OUTPUT STREAM */}
              <div className="space-y-6 flex flex-col items-center md:items-end text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-[#0077B6] block mb-1">
                  2. Generated Outputs
                </span>

                {/* Output Card 1 */}
                <div className="w-full max-w-xs bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    📊
                  </div>
                  <div className="text-left font-sans">
                    <strong className="text-xs font-extrabold text-[#03045E] block leading-tight">Health Summary</strong>
                    <span className="text-[10px] text-slate-500 font-semibold block font-sans">Abnormalities & jargon translations</span>
                  </div>
                </div>

                {/* Output Card 2 */}
                <div className="w-full max-w-xs bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#CAF0F8] text-[#0077B6] flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    💡
                  </div>
                  <div className="text-left">
                    <strong className="text-xs font-extrabold text-[#03045E] block leading-tight">Recommendations</strong>
                    <span className="text-[10px] text-slate-500 font-semibold block font-sans font-sans">Habits, hydration, stretches</span>
                  </div>
                </div>

                {/* Output Card 3 */}
                <div className="w-full max-w-xs bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    📄
                  </div>
                  <div className="text-left">
                    <strong className="text-xs font-extrabold text-[#03045E] block leading-tight">Clinical PDF Report</strong>
                    <span className="text-[10px] text-slate-500 font-semibold block font-sans">Presentation-ready diagnostics</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. Health Score Dashboard Preview */}
      <section className="py-20 bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3.5 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#0077B6] bg-[#CAF0F8] px-3.5 py-1.5 rounded-full inline-block font-mono uppercase tracking-widest">
              ★ MAIN PLATFORM PREVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#03045E]">
              Track Your Health at a Glance
            </h2>
            <p className="text-slate-500 text-sm font-sans mx-auto max-w-xl">
              MedVision’s clinical system compiles real-time summaries into an aesthetic central health portal dashboard. High accuracy, instant downloads.
            </p>
          </div>

          {/* Premium Platform Mockup Frame with Floating Animations */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto bg-slate-50 rounded-2xl border-4 border-slate-100 p-6 shadow-xl relative overflow-hidden text-left"
          >
            {/* Header portion of mock dashboard */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                  ✙
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#03045E] uppercase tracking-wide">MedVision Diagnostic Dashboard</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">PORTAL READY — SECURE LINK</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Secure Server Active</span>
                </span>
                <span className="text-xs text-slate-500 font-semibold font-mono">June 2026</span>
              </div>
            </div>

            {/* Dashboard Content Mock Grid */}
            <div className="grid md:grid-cols-12 gap-6 items-start">
              
              {/* Circular Health Score widget */}
              <div className="md:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unified Wellness Ratio</span>
                
                {/* Standard Circular Progress representation */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" className="stroke-slate-100 fill-none" strokeWidth="8" />
                    <circle cx="56" cy="56" r="48" className="stroke-[#0077B6] fill-none" strokeWidth="8" strokeDasharray="301" strokeDashoffset="48" style={{ strokeLinecap: "round" }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                    <span className="text-2xl font-black text-[#03045E]">84</span>
                    <span className="text-[9px] text-slate-400 font-black uppercase">Points / 100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase font-sans">
                    ● Low Risk Level
                  </span>
                  <p className="text-[10px] text-slate-400 pt-1 leading-normal font-sans">
                    Most biochemical indicators conform to steady baseline references.
                  </p>
                </div>
              </div>

              {/* Dynamic Tabs preview mock content */}
              <div className="md:col-span-8 grid sm:grid-cols-2 gap-6 items-start">
                
                {/* Mock Card 1: Recent Report */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-1">
                    <FileText className="w-4 h-4 text-[#0077B6]" />
                    <span className="text-[11px] font-bold text-[#03045E] uppercase tracking-wider">Report Analysis</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      "CBC displays a mild hemoglobin reduction explaining somatic fatigue thresholds."
                    </div>
                    <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-[9px] text-rose-800 flex justify-between items-center font-sans font-bold">
                      <span>Hemoglobin Hb: 11.4 [L]</span>
                      <span className="font-mono">Reference range: 13.5 - 17.5</span>
                    </div>
                  </div>
                </div>

                {/* Mock Card 2: AI Recommendations */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-1">
                    <HeartPulse className="w-4 h-4 text-[#0077B6]" />
                    <span className="text-[11px] font-bold text-[#03045E] uppercase tracking-wider">Suggested Actions</span>
                  </div>
                  <div className="space-y-1.5 text-[10px] text-slate-600 leading-normal font-sans">
                    <div className="flex gap-2 items-center">
                      <span className="text-[#0077B6] font-bold">•</span>
                      <span>Hydrate target: 2.8L Filtered Water</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[#0077B6] font-bold">•</span>
                      <span>Increase organic iron-rich protein</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[#0077B6] font-bold">•</span>
                      <span>Perform dynamic neck stretches hourly</span>
                    </div>
                  </div>
                </div>

                {/* Mock Card 3: Symptom Tracker */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 sm:col-span-2">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-1">
                    <Activity className="w-4 h-4 text-[#0077B6]" />
                    <span className="text-[11px] font-bold text-[#03045E] uppercase tracking-wider">Target Symptoms Logger</span>
                  </div>
                  <div className="flex gap-2 pl-1 flex-wrap">
                    <span className="text-[9px] bg-[#CAF0F8] text-[#0077B6] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide">Fever [None]</span>
                    <span className="text-[9px] bg-[#CAF0F8] text-[#0077B6] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide">Fatigue [Mild/Moderate]</span>
                    <span className="text-[9px] bg-[#CAF0F8] text-[#0077B6] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide">Cough [Light Seasonal]</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Floating trigger CTA inside Dashboard mockup */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white -mx-6 -mb-6 p-5 rounded-b-2xl">
              <div>
                <span className="text-xs font-bold text-[#03045E] block font-sans">Experience full-stack MedVision systems instantly.</span>
                <p className="text-[10px] text-slate-400 font-bold max-w-sm mt-0.5 uppercase font-mono">NO CREDIT ARTIFACTS REQUIRED — 100% HIPAA SECURED</p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={downloadDemoPdf}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Demo PDF</span>
                </button>
                <button
                  onClick={() => onStart(true)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-[#0077B6] hover:bg-[#0077B6]/95 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer hover:shadow-md"
                >
                  <span>Open Active Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Classic How It Works Timeline Segment */}
      <section className="bg-slate-50 border-b border-slate-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#03045E]">How MedVision Works</h2>
            <p className="text-slate-500 text-sm font-sans mx-auto leading-relaxed">
              Get from clinical jargon to simple wellness pathways in four straightforward, highly secure strides.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: "Step 1", title: "Upload Report", desc: "Select blood chemical tests, lab reports, or standard health documents.", icon: FileText },
              { step: "Step 2", title: "AI Translation", desc: "Our protected Gemini engine translates medical vocabulary and isolates parameters.", icon: Activity },
              { step: "Step 3", title: "Receive Advice", desc: "Receive immediate observations on hydration, nutrition, and lifestyle wellness.", icon: HeartPulse },
              { step: "Step 4", title: "Download PDF", desc: "Obtain a presentation-ready health summary as a professional clinical PDF.", icon: Download }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col items-center">
                <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-[#CAF0F8] text-[#0077B6] font-mono text-[9px] font-bold uppercase tracking-wider">{item.step}</span>
                <div className="w-11 h-11 rounded-lg bg-[#CAF0F8] text-[#0077B6] flex items-center justify-center mb-4 mt-1 shadow-sm">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-[#03045E] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 text-center leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classic CTA Section */}
      <section className="bg-gradient-to-r from-[#0077B6] to-[#03045E] text-white py-20 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight">
            Take Control of Your Health Information
          </h2>
          <p className="text-slate-200 text-base max-w-xl mx-auto leading-relaxed font-sans font-bold">
            Instantly decode complicated laboratory documents, check relevant symptoms, and download high-precision PDF charts. Encrypted, clean, offline-ready.
          </p>
          <button
            id="btn-cta-get-started"
            onClick={() => onStart(false)}
            className="px-10 py-4 bg-white text-[#03045E] hover:bg-neutral-50 transition-all font-black rounded-xl shadow-md hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] text-lg flex items-center justify-center gap-2 mx-auto cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Get Started For Free</span>
            <ArrowRight className="w-5 h-5 text-[#03045E]" />
          </button>
        </div>
      </section>

      {/* MODAL: Beautiful "Get Demo" Showcase dossier modal */}
      <AnimatePresence>
        {isDemoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#03045E]/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left"
            >
              
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-[#CAF0F8]/50 to-[#90E0EF]/10 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white shadow font-bold text-lg">
                    ✙
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#03045E]">Interactive Demo Case Portfolio</h3>
                    <p className="text-xs text-slate-500 font-sans">Inspecting clinical simulation record: <strong>Jonathan Carter (Age 34)</strong></p>
                  </div>
                </div>
                
                <button
                  id="btn-close-demo-modal"
                  onClick={() => setIsDemoModalOpen(false)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Core Navigation TABS */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-2.5 flex flex-wrap gap-2">
                <button
                  onClick={() => setDemoModalTab("report")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
                    demoModalTab === "report"
                      ? "bg-[#0077B6] text-white shadow-sm font-sans"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-sans"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>1. Sample Blood Report</span>
                </button>

                <button
                  onClick={() => setDemoModalTab("analysis")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
                    demoModalTab === "analysis"
                      ? "bg-[#0077B6] text-white shadow-sm font-sans"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-sans"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>2. AI Analysis Output</span>
                </button>

                <button
                  onClick={() => setDemoModalTab("recs")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
                    demoModalTab === "recs"
                      ? "bg-[#0077B6] text-white shadow-sm font-sans"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-sans"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>3. Health Recommendations</span>
                </button>

                <button
                  onClick={() => setDemoModalTab("pdf")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
                    demoModalTab === "pdf"
                      ? "bg-[#0077B6] text-white shadow-sm font-sans"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-sans"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>4. Dynamic PDF Preview</span>
                </button>
              </div>

              {/* Tab Contents Frame */}
              <div className="p-6 overflow-y-auto flex-1 max-h-[50vh] min-h-[350px]">
                
                {/* TAB 1: Sample Blood Report */}
                {demoModalTab === "report" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-sky-50/20 p-4 rounded-xl border border-sky-100/40 text-xs text-sky-950 font-serif space-y-3 leading-relaxed">
                      <div className="flex justify-between border-b border-sky-100/30 pb-2">
                        <span><strong>MOCK CLINIC LABORATORY SERVICES</strong></span>
                        <span>Date: June 2026</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span>Patient: <strong>Jonathan Carter</strong></span><br />
                          <span>Age: <strong>34 Years</strong></span><br />
                          <span>Gender: <strong>Male</strong></span>
                        </div>
                        <div className="text-right">
                          <span>Referred By: <strong>Self-Assessment</strong></span><br />
                          <span>Blood Group: <strong>A-Positive</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                      <table className="w-full text-xs font-sans text-slate-700">
                        <thead className="bg-[#03045E] text-white text-left font-bold font-sans">
                          <tr>
                            <th className="p-3">Reference Marker</th>
                            <th className="p-3">Result</th>
                            <th className="p-3">Standard Reference Range</th>
                            <th className="p-3">Assessment Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold font-sans text-xs">
                          <tr className="bg-rose-50/20">
                            <td className="p-3">Hemoglobin (CBC)</td>
                            <td className="p-3 text-red-600 font-bold">11.4 g/dL</td>
                            <td className="p-3">13.5 - 17.5 g/dL</td>
                            <td className="p-3 text-red-600 uppercase font-black font-sans">Low (L)</td>
                          </tr>
                          <tr className="bg-rose-50/20">
                            <td className="p-3">TSH (Thyroid Core)</td>
                            <td className="p-3 text-red-600 font-bold">5.8 uIU/mL</td>
                            <td className="p-3">0.4 - 4.5 uIU/mL</td>
                            <td className="p-3 text-red-600 uppercase font-black font-sans font-sans">High (H)</td>
                          </tr>
                          <tr>
                            <td className="p-3">Serum Glucose (Fasting)</td>
                            <td className="p-3 font-semibold text-emerald-600">88 mg/dL</td>
                            <td className="p-3">70 - 100 mg/dL</td>
                            <td className="p-3 text-emerald-600 uppercase font-sans">Normal</td>
                          </tr>
                          <tr>
                            <td className="p-3">LDL Cholesterol</td>
                            <td className="p-3 font-semibold text-emerald-600">110 mg/dL</td>
                            <td className="p-3">Less than 130 mg/dL</td>
                            <td className="p-3 text-emerald-600 uppercase font-sans">Normal</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: AI Analysis Output */}
                {demoModalTab === "analysis" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <h4 className="text-xs font-bold text-[#03045E] uppercase tracking-wide mb-1">■ Summary Interpretation</h4>
                      <p className="text-xs text-slate-600 leading-normal font-sans">
                        {DEMO_CASE.reportAnalysis?.summary}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[#03045E] uppercase tracking-wide">■ Detailed Flagged Explanations</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {DEMO_CASE.reportAnalysis?.abnormalValues.map((v, i) => (
                          <div key={i} className="p-4 rounded-xl border border-rose-100 bg-rose-50/25 space-y-1.5 text-left font-sans text-xs">
                            <h5 className="font-bold text-slate-800">{v.parameter}</h5>
                            <div className="text-[10px] text-red-600 font-black">
                              Observed Value: {v.value} (Normal Range: {v.standardRange})
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{v.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-[#CAF0F8]/10 border border-[#90E0EF]/30 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-[#0077B6] uppercase tracking-wide">■ Layperson Terminology Guides</h4>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {DEMO_CASE.reportAnalysis?.terminologyExplanations.map((t, i) => (
                          <div key={i} className="p-2.5 bg-white border border-slate-100 rounded-lg text-left">
                            <strong className="text-[11px] text-[#03045E] block">{t.term}</strong>
                            <p className="text-[10px] text-slate-500 leading-normal mt-1 font-sans">{t.simpleExplanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: Wellness Recommendations */}
                {demoModalTab === "recs" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
                    <div className="grid sm:grid-cols-2 gap-6">
                      
                      {/* Dietary */}
                      <div className="bg-white border border-slate-100 p-4.5 rounded-xl space-y-3.5 shadow-sm">
                        <strong className="text-xs text-[#03045E] block uppercase tracking-wider border-b border-slate-100 pb-2">🥗 Dietary Habits</strong>
                        <ul className="space-y-2 text-xs text-slate-600 leading-normal">
                          {DEMO_CASE.recommendations?.diet.map((item, idx) => (
                            <li key={idx} className="flex gap-2 items-start font-sans">
                              <span className="text-[#0077B6] font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hydration */}
                      <div className="bg-white border border-slate-100 p-4.5 rounded-xl space-y-3.5 shadow-sm">
                        <strong className="text-xs text-[#03045E] block uppercase tracking-wider border-b border-slate-100 pb-2">💧 Daily Hydration</strong>
                        <ul className="space-y-2 text-xs text-slate-600 leading-normal">
                          {DEMO_CASE.recommendations?.hydration.map((item, idx) => (
                            <li key={idx} className="flex gap-2 items-start font-sans">
                              <span className="text-[#0077B6] font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Lifestyle */}
                      <div className="bg-white border border-slate-100 p-4.5 rounded-xl space-y-3.5 shadow-sm">
                        <strong className="text-xs text-[#03045E] block uppercase tracking-wider border-b border-slate-100 pb-2">💤 Lifestyle Adjustments</strong>
                        <ul className="space-y-2 text-xs text-slate-600 leading-normal">
                          {DEMO_CASE.recommendations?.lifestyle.map((item, idx) => (
                            <li key={idx} className="flex gap-2 items-start font-sans font-sans">
                              <span className="text-[#0077B6] font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Diagnostic Monitoring */}
                      <div className="bg-white border border-slate-100 p-4.5 rounded-xl space-y-3.5 shadow-sm">
                        <strong className="text-xs text-[#03045E] block uppercase tracking-wider border-b border-slate-100 pb-2">📋 Clinical Tracking</strong>
                        <ul className="space-y-2 text-xs text-slate-600 leading-normal font-sans">
                          {DEMO_CASE.recommendations?.monitoringTips.map((item, idx) => (
                            <li key={idx} className="flex gap-2 items-start font-sans text-xs">
                              <span className="text-[#0077B6] font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 4: PDF Preview */}
                {demoModalTab === "pdf" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl flex gap-3 text-left">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs text-amber-950 font-bold block uppercase tracking-wide">Ready for presentation</strong>
                        <p className="text-xs text-amber-900 leading-normal font-sans">
                          Our clinical evaluation sheets compile into single or multi-page formats. This document is engineered for easy viewing by therapists, coaches, or clinics.
                        </p>
                      </div>
                    </div>

                    {/* PDF Graphical Representation */}
                    <div className="w-full max-w-lg mx-auto bg-white border border-slate-200 shadow-md rounded-2xl p-6 space-y-4">
                      {/* Clinical Stamp Mock Header */}
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-left">
                        <div>
                          <h6 className="text-[9px] font-extrabold text-[#03045E] uppercase tracking-wider">MEDVISION LAB ANALYSIS RECAP</h6>
                          <span className="text-[7.5px] text-slate-400 font-bold uppercase block mt-0.2">HIPAA HEALTH COMPLIANT RECORD</span>
                        </div>
                        <span className="text-[9px] font-mono text-[#0077B6] bg-[#CAF0F8] px-2 py-0.5 rounded font-black font-sans">VALIDATED DOC</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-left text-[8.5px] text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 font-sans">
                        <div>Patient: <strong>Jonathan Carter</strong></div>
                        <div>Date: <strong>June 2026</strong></div>
                        <div>Age: <strong>34 Years</strong></div>
                        <div>Ref code: <strong>#MV-728103</strong></div>
                      </div>

                      <div className="space-y-2 text-left font-sans">
                        <div className="p-2 bg-rose-50 rounded text-[8.5px] text-rose-800 border border-rose-100 flex justify-between font-bold">
                          <span>Hemoglobin (Hb/HGB)</span>
                          <span>11.4 g/dL [FLAGGED LOW]</span>
                        </div>
                        <div className="p-2 bg-rose-50 rounded text-[8.5px] text-rose-800 border border-rose-100 flex justify-between font-bold">
                          <span>Thyroid Stimulating Hormone (TSH)</span>
                          <span>5.8 uIU/mL [FLAGGED HIGH]</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/30 p-3 rounded text-[8px] text-slate-500 font-sans leading-normal text-left">
                        Encrypted with industry-standard security. You can instantly print or share offline with a single click.
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Modal Action CTA Footer bar */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-xs text-slate-500 font-serif leading-none italic">
                  *Disclaimer: Contextual wellness material only. Not a diagnose replacement.
                </span>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={downloadDemoPdf}
                    className="flex-1 sm:flex-none px-5 py-3 bg-white border border-slate-200 text-[#0077B6] font-bold text-xs rounded-xl transition-all hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Demo PDF</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsDemoModalOpen(false);
                      onStart(true);
                    }}
                    className="flex-1 sm:flex-none px-6 py-3 bg-[#0077B6] hover:bg-[#0077B6]/95 text-white font-bold text-xs rounded-xl transition-all shadow hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Load Demo Inside Active App</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
