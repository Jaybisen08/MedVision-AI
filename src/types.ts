/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AbnormalValue {
  parameter: string;
  value: string;
  standardRange: string;
  explanation: string;
}

export interface TerminologyExplanation {
  term: string;
  simpleExplanation: string;
}

export interface ReportAnalysis {
  summary: string;
  keyObservations: string[];
  abnormalValues: AbnormalValue[];
  terminologyExplanations: TerminologyExplanation[];
  thingsToMonitor: string[];
}

export interface PossibleCause {
  condition: string;
  likelihood: "High" | "Medium" | "Low";
  description: string;
}

export interface SymptomAnalysis {
  symptoms: string[];
  possibleCauses: PossibleCause[];
  preventiveTips: string[];
  whenToConsult: string;
  warningSigns: string[];
}

export interface HealthRecommendations {
  lifestyle: string[];
  diet: string[];
  hydration: string[];
  exercise: string[];
  monitoringTips: string[];
}

export interface PatientDetails {
  name: string;
  age: string;
  gender: string;
  bloodType: string;
  date: string;
}

export interface MedicalCase {
  patient: PatientDetails;
  reportAnalysis: ReportAnalysis | null;
  symptomAnalysis: SymptomAnalysis | null;
  recommendations: HealthRecommendations | null;
}
