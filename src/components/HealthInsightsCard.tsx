/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Brain, Sparkles, AlertCircle, Compass, RefreshCw, Layers } from "lucide-react";
import { ReportAnalysis } from "../types";

interface HealthInsightsCardProps {
  reportAnalysis: ReportAnalysis | null;
}

function CountingNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * end);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function HealthInsightsCard({ reportAnalysis }: HealthInsightsCardProps) {
  const hasAnalysis = !!reportAnalysis;

  // Exact criteria requested
  const score = 84;
  const status = "Good Overall Health";
  const confidenceScore = "96%";

  // Check if we are showing demo content or parsing dynamic content
  // Fallback to the exact text asked in the guidelines
  let keyInsight = "Your Vitamin D levels appear lower than the recommended range.";
  let topRecommendation = "Increase sunlight exposure and include Vitamin D-rich foods in your diet.";
  let nextAction = "Monitor Vitamin D levels in your next blood test.";

  // If there's an actual user-parsed report that lists specific abnormal values,
  // we can subtly adjust the insights to match, showing true extreme integration "wow" factor!
  if (reportAnalysis) {
    if (reportAnalysis.abnormalValues && reportAnalysis.abnormalValues.length > 0) {
      const firstAbnormal = reportAnalysis.abnormalValues[0];
      const secondAbnormal = reportAnalysis.abnormalValues[1];
      
      if (firstAbnormal.parameter.toLowerCase().includes("hemoglobin")) {
        // This is the pre-loaded Jonathan Carter demo case
        keyInsight = "Systemic oxygen-carrying Hemoglobin levels are moderately depleted, signaling subclinical anemia.";
        topRecommendation = "Incorporate organic iron-rich proteins (spinach, lentils) paired with daily Vitamin C intervals.";
        nextAction = "Scedule a 30-day baseline blood count evaluation to monitor thyroid (TSH) stability.";
      } else {
        // Dynamic custom upload analysis adaptation!
        keyInsight = `Your ${firstAbnormal.parameter} metrics of ${firstAbnormal.value} are outside the recommended reference bounds.`;
        if (firstAbnormal.explanation) {
          topRecommendation = firstAbnormal.explanation.length > 90 
            ? firstAbnormal.explanation.substring(0, 90) + "..."
            : firstAbnormal.explanation;
        }
        if (reportAnalysis.thingsToMonitor && reportAnalysis.thingsToMonitor.length > 0) {
          nextAction = reportAnalysis.thingsToMonitor[0];
        }
      }
    } else if (reportAnalysis.summary) {
      // General report uploaded
      keyInsight = reportAnalysis.summary.length > 80 
        ? reportAnalysis.summary.substring(0, 80) + "..." 
        : reportAnalysis.summary;
    }
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Circular ring variables
  const radius = 32;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      id="health-insights-card-root"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        boxShadow: "0 20px 40px -15px rgba(0, 180, 216, 0.12)",
        borderColor: "rgba(144, 224, 239, 0.7)"
      }}
      className="bg-white/90 backdrop-blur-md border border-[#90E0EF]/50 rounded-2xl p-6 shadow-md transition-all duration-300 relative overflow-hidden"
    >
      {/* Subtle top background gloss */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#CAF0F8]/40 rounded-full blur-2xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#CAF0F8]/50 text-[#0077B6]">
            <Brain className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-[#03045E]">🧠 AI Health Insights</span>
        </div>
        <div className="flex items-center gap-1 bg-[#CAF0F8] text-[#0077B6] px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase font-mono">
          <Sparkles className="w-2.5 h-2.5 animate-pulse" />
          <span>Live Insight</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 font-sans leading-relaxed mb-6 text-left">
        Display dynamic AI-generated insights based on uploaded reports and symptoms.
      </p>

      {/* Main Stats Block with Circle Ring Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-12 gap-4 items-center bg-sky-50/20 border border-slate-100/50 p-4 rounded-xl mb-6 relative"
      >
        {/* Floating pulse circle component */}
        <div className="col-span-4 flex justify-center relative">
          <svg className="w-20 h-20 transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated foreground circle */}
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              stroke="url(#blue-gradient)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0077B6" />
                <stop offset="100%" stopColor="#00B4D8" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Circular float container */}
          <motion.div 
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <span className="text-lg font-black tracking-tight text-[#03045E] leading-none">
              <CountingNumber value={score} />
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-0.5">/ 100</span>
          </motion.div>
        </div>

        {/* Text descriptions */}
        <div className="col-span-8 space-y-1 text-left">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Health Score</span>
          <h4 className="text-sm font-black text-[#03045E]">{status}</h4>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Overall Wellness Score Stable
          </span>
        </div>
      </motion.div>

      {/* Sequential Reveal Items */}
      <div className="space-y-4 text-left font-sans">
        
        {/* Key Insight */}
        <motion.div variants={itemVariants} className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0077B6]" />
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Key Insight</span>
          </div>
          <p className="text-xs font-semibold text-slate-700 bg-slate-50/55 p-3 rounded-xl border border-slate-100/50 leading-relaxed font-sans">
            {keyInsight}
          </p>
        </motion.div>

        {/* Top Recommendation */}
        <motion.div variants={itemVariants} className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Top Recommendation</span>
          </div>
          <p className="text-xs text-slate-600 bg-amber-50/10 p-3 rounded-xl border border-amber-100/30 leading-relaxed font-sans">
            {topRecommendation}
          </p>
        </motion.div>

        {/* Next Action */}
        <motion.div variants={itemVariants} className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Next Action</span>
          </div>
          <p className="text-xs text-slate-600 bg-emerald-50/10 p-3 rounded-xl border border-emerald-100/30 leading-relaxed font-sans">
            {nextAction}
          </p>
        </motion.div>

      </div>

      {/* Footer Info Panel */}
      <motion.div 
        variants={itemVariants}
        className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold select-none"
      >
        <span>Confidence Index: <strong className="text-emerald-600">{confidenceScore}</strong></span>
        <span className="text-[#0077B6] flex items-center gap-0.5">
          ✦ Powered by Gemini
        </span>
      </motion.div>
    </motion.div>
  );
}
