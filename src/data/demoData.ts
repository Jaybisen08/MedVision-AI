/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MedicalCase } from "../types";

export const DEMO_CASE: MedicalCase = {
  patient: {
    name: "Jonathan Carter",
    age: "34",
    gender: "Male",
    bloodType: "A-Positive",
    date: new Date().toISOString(),
  },
  reportAnalysis: {
    summary: "Mild nutritional deficiency identified, demonstrated by decreased hemoglobin levels of 11.4 g/dL. Minor flags were also noted on the Thyroid-stimulating hormone (TSH) levels, while all other biochemical panels (liver metabolic scores, kidney filtration ratios, glucose, lipid structures) remain inside healthy, standardized levels.",
    keyObservations: [
      "Red Blood Cell Hemoglobin values represent a light systemic depletion, which directly correlates with reported physical fatigue indicators.",
      "TSH scores are moderately elevated, suggesting that the endocrine thyroid system is under active mechanical strain.",
      "Metabolic core baselines, electrolytes balance, and cardiovascular markers are in excellent reference health."
    ],
    abnormalValues: [
      {
        parameter: "Hemoglobin (CBC Panel)",
        value: "11.4 g/dL",
        standardRange: "13.5 - 17.5 g/dL",
        explanation: "Hemoglobin is the oxygen-carrying molecule housed inside your red blood cells. A slightly reduced score represents light anemia, which reduces overall oxygen supply to muscles and joints, often triggering mild tiredness or cold extremities."
      },
      {
        parameter: "Thyroid Stimulating Hormone (TSH)",
        value: "5.8 uIU/mL",
        standardRange: "0.4 - 4.5 uIU/mL",
        explanation: "TSH is produced by the pituitary gland to trigger hormone releases from your thyroid. A moderately high score suggests your body is signaling the thyroid to work harder, which can match minor symptoms of low energy or brain fog."
      }
    ],
    terminologyExplanations: [
      {
        term: "Hemoglobin",
        simpleExplanation: "An iron-rich protein inside red blood cells responsible for transporting oxygen from your lungs to all body organs."
      },
      {
        term: "TSH (Thyroid Stimulating Hormone)",
        simpleExplanation: "A signaling chemical dispatched by the brain's control center to regulate how fast your thyroid burns cellular energy."
      },
      {
        term: "CBC (Complete Blood Count)",
        simpleExplanation: "A staple initial lab evaluation panel verifying white blood cells, red cells, and platelet ratios to track general wellness."
      }
    ],
    thingsToMonitor: [
      "Observe diurnal energy levels across active working hours.",
      "Track standard morning rest heart rate patterns over 10 days.",
      "Monitor dietary intake of natural organic iron and overall Vitamin C."
    ]
  },
  symptomAnalysis: {
    symptoms: ["Fatigue", "Mild Headache", "Muscle Stiffness"],
    possibleCauses: [
      {
        condition: "Low-Grade Iron Deficiency Anemia",
        likelihood: "Medium",
        description: "Matches the low hemoglobin counts tracked in the report overview. Low red cell density frequently leads to mild work fatigue, visual focus strain, and headaches."
      },
      {
        condition: "Dehydration & Muscle Strain",
        likelihood: "High",
        description: "Prolonged desk posture combined with inadequate daily fluid volume reduces muscle hydration, triggering typical rear-neck muscle stiffness and low-grade tension headaches."
      },
      {
        condition: "Subclinical Hypothyroidism Context",
        likelihood: "Low",
        description: "Corresponds with the moderate TSH elevations. This condition slightly reduces baseline cellular energy metabolism speeds, triggering mild systemic listlessness or fatigue."
      }
    ],
    preventiveTips: [
      "Incorporate robust water intervals to hit at least 2.5 to 3 liters of daily fluid intake.",
      "Practice simple doorframe posture stretches every 60 minutes of visual computer screen work.",
      "Sustain healthy sleeping schedules of 7.5 to 8.5 hours in complete darkness."
    ],
    whenToConsult: "Request a physical checkup if fatigue indicators become progressively more debilitating, or if headache episodes continue to persist despite steady lifestyle hydration improvements for over 14 days.",
    warningSigns: [
      "Sudden constriction in the chest, tight breathing, or acute heart thumping.",
      "Instant onset of physical coordination loss, muscle numbness, or extreme facial slurs.",
      "Severe headache occurring alongside high-fever periods above 101.5°F."
    ]
  },
  recommendations: {
    lifestyle: [
      "Incorporate 10-minute quiet stretching breaks during morning work blocks to relieve neck tension.",
      "Charge digital devices outside the bedroom to guarantee a screen-free window 45 minutes before sleep.",
      "Engage in brief 5-minute deep breathing exercises to lower stress-related muscle tightness."
    ],
    diet: [
      "Boost consuming iron-rich items like spinach, lentils, pumpkin seeds, and lean proteins.",
      "Squeeze citrus or pair meals with bell peppers to access natural Vitamin C, which speeds up iron absorption.",
      "Enjoy herbal teas such as chamomile or peppermint to help calm muscle stiffness before bedtime."
    ],
    hydration: [
      "Maintain a target drink index of 2.8 liters of filtered drinking water distributed evenly across the day.",
      "Drink 200ml of mineralized water or natural coconut water following physical activities to replenish electrolytes."
    ],
    exercise: [
      "Maintain 20 to 30 minutes of low-impact physical walking or basic yoga to nurture blood circulation.",
      "Avoid exhausting cardiovascular routines during acute levels of feeling fatigued."
    ],
    monitoringTips: [
      "Establish a fast notation sheet tracking morning resting heart rates three times a week.",
      "Write a simplified daily journal checking energy and headaches on a basic 1-10 numbering scale.",
      "Review the tracked values with a licensed physician in your next physician visit."
    ]
  }
};
