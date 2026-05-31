/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight, FileDown, CheckSquare, HeartPulse } from "lucide-react";
import { ReportAnalysis } from "../types";

interface ClinicalSummaryPanelProps {
  reportAnalysis: ReportAnalysis | null;
  onGeneratePdf: () => void;
  onNavigateTab: (tab: "reports" | "symptoms" | "recs") => void;
}

function LiveScoreCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(0);
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * target);
      
      setScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{score}</span>;
}

export default function ClinicalSummaryPanel({
  reportAnalysis,
  onGeneratePdf,
  onNavigateTab
}: ClinicalSummaryPanelProps) {
  
  // Scoring parameters as requested in goals
  const scoreVal = 84;
  const riskLevel = "LOW";
  
  // Custom texts requested in the prompt
  const summaryText = "The uploaded report indicates mildly elevated cholesterol levels and low Vitamin D. Overall health status remains stable.";
  
  const keyFindingsList = [
    "LDL Cholesterol Elevated",
    "Vitamin D Deficiency",
    "Normal Blood Sugar Levels",
    "Stable Hemoglobin Levels"
  ];

  // Variations for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div
      id="clinical-summary-panel-root"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        boxShadow: "0 22px 45px -15px rgba(3, 4, 94, 0.08)",
        borderColor: "rgba(164, 204, 255, 0.5)"
      }}
      className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl p-6 shadow-md transition-all duration-300 relative text-left"
    >
      {/* Decorative pulse element */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Stable Profile</span>
      </div>

      {/* Header title */}
      <div className="mb-5 border-b border-slate-100 pb-3">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Verified Diagnosis</span>
        <h3 className="text-sm font-extrabold text-[#03045E] flex items-center gap-1.5 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-[#0077B6]" />
          <span>AI Clinical Summary</span>
        </h3>
      </div>

      {/* Summary Narrative */}
      <motion.div variants={childVariants} className="space-y-1 mb-5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Summary</span>
        <p className="text-xs text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 leading-relaxed font-serif italic text-left">
          "{summaryText}"
        </p>
      </motion.div>

      {/* Key Findings List */}
      <div className="space-y-2 mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Key Findings</span>
        <div className="space-y-2">
          {keyFindingsList.map((finding, idx) => (
            <motion.div
              key={idx}
              variants={childVariants}
              custom={idx}
              className="flex items-center gap-2.5 px-3 py-2 bg-sky-50/10 border border-slate-100 rounded-xl hover:translate-x-1.5 transition-transform duration-300"
            >
              <span className="text-xs text-[#0077B6] font-bold">✓</span>
              <span className="text-xs font-semibold text-[#03045E]">{finding}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Grid for Risk & Score */}
      <motion.div 
        variants={childVariants}
        className="grid grid-cols-2 gap-4 bg-slate-50/40 p-4 rounded-xl border border-slate-100/50 mb-7"
      >
        <div className="text-left border-r border-slate-200/50 pr-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Risk Level</span>
          <span className="text-base font-black tracking-wide text-indigo-600 font-sans mt-0.5 inline-block">
            {riskLevel}
          </span>
        </div>
        <div className="text-left pl-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Health Score</span>
          <span className="text-base font-black tracking-tight text-[#03045E] font-mono mt-0.5 inline-block">
            <LiveScoreCounter target={scoreVal} /> <span className="text-xs text-slate-400 font-bold">/ 100</span>
          </span>
        </div>
      </motion.div>

      {/* Quick Action Operations */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono mb-2.5">Quick Actions</span>
        
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
          {/* Action: Generate PDF */}
          <button
            onClick={onGeneratePdf}
            className="w-full py-2 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:shadow-md text-white text-xs font-bold rounded-xl transition-all flex items-center justify-between px-3 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" />
              <span>Generate PDF</span>
            </span>
            <ArrowRight className="w-3 h-3 text-white/80" />
          </button>

          {/* Action: Track Symptoms */}
          <button
            onClick={() => onNavigateTab("symptoms")}
            className="w-full py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-between px-3 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Track Symptoms</span>
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>

          {/* Action: View Recommendations */}
          <button
            onClick={() => onNavigateTab("recs")}
            className="w-full py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-between px-3 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
              <span>View Recommendations</span>
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
