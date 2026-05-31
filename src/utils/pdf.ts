/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportAnalysis, SymptomAnalysis, HealthRecommendations, PatientDetails } from "../types";

export function generateMedicalPdf(
  patient: PatientDetails,
  report: ReportAnalysis | null,
  symptoms: SymptomAnalysis | null,
  recommendations: HealthRecommendations | null
) {
  const doc = new jsPDF();
  const primaryColor = [0, 119, 182]; // #0077B6
  const secondaryColor = [0, 180, 216]; // #00B4D8
  const darkTextColor = [3, 4, 94]; // #03045E
  const grayColor = [100, 116, 139]; // Slate

  // Page tracking info
  let pageNumber = 1;
  const pageHeight = doc.internal.pageSize.height;

  // Header Helper Function (drawn on each page if needed)
  const drawHeader = () => {
    // Top primary accent line
    doc.setFillColor(0, 119, 182);
    doc.rect(0, 0, 210, 4, "F");

    // Logo Emblem
    doc.setFillColor(0, 119, 182);
    doc.rect(15, 12, 10, 10, "F");
    
    // Medical Cross inside Logo
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1.2);
    doc.line(20, 14, 20, 20); // vertical
    doc.line(17, 17, 23, 17); // horizontal

    // App Name
    doc.setTextColor(3, 4, 94);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("MEDVISION AI", 28, 19);

    // Subtitle
    doc.setTextColor(115, 115, 115);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("PERSONAL CLINICAL SUMMARY REPORT", 28, 23);

    // Document Metadata (top right)
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date(patient.date).toLocaleDateString()}`, 195, 18, { align: "right" });
    doc.text(`Report ID: MV-${Math.floor(100000 + Math.random() * 900000)}`, 195, 23, { align: "right" });

    // Header divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 28, 195, 28);
  };

  // Footer Helper Function
  const drawFooter = () => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    
    // Page outline footer
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 15, 195, pageHeight - 15);

    doc.text(
      "CONFIDENTIAL MEDICAL DISCUSSION SUPPORT SHEET - POWERED BY GEMINI 3.5 AI",
      15,
      pageHeight - 10
    );
    doc.text(`Page ${pageNumber}`, 195, pageHeight - 10, { align: "right" });
  };

  // Begin page drawing
  drawHeader();

  // 1. PATIENT DEMOGRAPHICS SUMMARY BOX
  doc.setFillColor(240, 249, 255); // Super light sky blue background
  doc.rect(15, 33, 180, 25, "F");
  
  // Left Blue Highlight border
  doc.setFillColor(0, 119, 182);
  doc.rect(15, 33, 3, 25, "F");

  // Title inside Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(3, 4, 94);
  doc.text("PATIENT HEALTH PROFILE", 22, 39);

  // Patient parameters split into two columns
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Name:   ${patient.name}`, 22, 45);
  doc.text(`Age:    ${patient.age} Yrs`, 22, 51);
  doc.text(`Gender:  ${patient.gender}`, 100, 45);
  doc.text(`Blood:   ${patient.bloodType || "N/A"}`, 100, 51);

  // Start yPosition tracking for core contents
  let yPos = 66;

  // 2. REPORT ANALYSIS SECTION
  if (report) {
    // Section Header
    doc.setFillColor(0, 119, 182);
    doc.rect(15, yPos, 4, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(3, 4, 94);
    doc.text("1. MEDICAL REPORT INTERPRETATION", 22, yPos + 5);
    yPos += 10;

    // Report Summary Text with word-wrap
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(report.summary, 180);
    doc.text(splitSummary, 15, yPos);
    yPos += splitSummary.length * 5 + 4;

    // Abnormal values table
    if (report.abnormalValues && report.abnormalValues.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(185, 28, 28); // Dark reddish
      doc.text("Detected Flagged/Abnormal Values & Explanations", 15, yPos);
      yPos += 4;

      const tableRows = report.abnormalValues.map((v) => [
        v.parameter,
        v.value,
        v.standardRange,
        v.explanation,
      ]);

      autoTable(doc, {
        startY: yPos,
        margin: { left: 15, right: 15 },
        head: [["Test Parameter", "Observed Value", "Reference Range", "Patient-Friendly Health Context"]],
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [0, 119, 182], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5 },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "bold" },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 85 },
        },
        didDrawPage: (data) => {
          yPos = data.cursor ? data.cursor.y : yPos;
        }
      });
      yPos += 8;
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(22, 101, 52); // Soft green
      doc.text("No highly abnormal values were extracted or flagged in this report file.", 15, yPos);
      yPos += 6;
    }

    // Key observations as bullet points
    if (report.keyObservations && report.keyObservations.length > 0) {
      // Check space
      if (yPos > pageHeight - 50) {
        doc.addPage();
        pageNumber++;
        drawHeader();
        yPos = 35;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(3, 4, 94);
      doc.text("Clinical Observations Summary", 15, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      
      report.keyObservations.forEach((obs) => {
        const splitObs = doc.splitTextToSize(`• ${obs}`, 175);
        doc.text(splitObs, 15, yPos);
        yPos += splitObs.length * 4.5 + 1;
      });
      yPos += 4;
    }
  }

  // 3. SYMPTOMS ANALYSIS SECTION
  if (symptoms) {
    if (yPos > pageHeight - 70) {
      doc.addPage();
      pageNumber++;
      drawHeader();
      yPos = 35;
    }

    // Header segment
    doc.setFillColor(0, 119, 182);
    doc.rect(15, yPos, 4, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(3, 4, 94);
    doc.text("2. PATIENT REPORTED SYMPTOM ANALYSIS", 22, yPos + 5);
    yPos += 8;

    // Tracked symptoms line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Tracked Symptoms: `, 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(symptoms.symptoms.join(", "), 49, yPos);
    yPos += 6;

    // Possible causes table
    if (symptoms.possibleCauses && symptoms.possibleCauses.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(3, 4, 94);
      doc.text("Potential Underlying Causes Evaluated (Clinical Context)", 15, yPos);
      yPos += 4;

      const symptomCauseRows = symptoms.possibleCauses.map((c) => [
        c.condition,
        c.likelihood,
        c.description,
      ]);

      autoTable(doc, {
        startY: yPos,
        margin: { left: 15, right: 15 },
        head: [["Potential Cause/Condition", "Statistical Likelihood", "Condition Context / Educational Meaning"]],
        body: symptomCauseRows,
        theme: "striped",
        headStyles: { fillColor: [0, 180, 216], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.5 },
        columnStyles: {
          0: { cellWidth: 45, fontStyle: "bold" },
          1: { cellWidth: 35 },
          2: { cellWidth: 100 },
        },
        didDrawPage: (data) => {
          yPos = data.cursor ? data.cursor.y : yPos;
        }
      });
      yPos += 8;
    }

    // Red flag warn/urgent consultation guidelines
    if (yPos > pageHeight - 50) {
      doc.addPage();
      pageNumber++;
      drawHeader();
      yPos = 35;
    }

    doc.setFillColor(254, 242, 242); // Super Soft light red alert
    doc.setDrawColor(248, 113, 113);
    doc.setLineWidth(0.5);
    
    // Draw warnings container
    const warnLines = doc.splitTextToSize(`WARNING SIGNS & DOCTOR CONSULTATION:\n${symptoms.whenToConsult}\nEmergency Indicators: ${symptoms.warningSigns.join(", ")}`, 170);
    const boxHeight = warnLines.length * 4.5 + 8;
    
    doc.rect(15, yPos, 180, boxHeight, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(153, 27, 27); // Dark alert text red
    doc.text("CRITICAL DISCUSSIONS & ALERT THRESHOLDS", 20, yPos + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    warnLines.forEach((line: string, i: number) => {
      if (i > 0) { // Skip title calculation
        doc.text(line, 20, yPos + 5 + (i * 4.5));
      }
    });

    yPos += boxHeight + 8;
  }

  // 4. RECOMMENDATIONS SECTION
  if (recommendations) {
    if (yPos > pageHeight - 80) {
      doc.addPage();
      pageNumber++;
      drawHeader();
      yPos = 35;
    }

    // Header segment
    doc.setFillColor(0, 119, 182);
    doc.rect(15, yPos, 4, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(3, 4, 94);
    doc.text("3. AI WELLNESS RECOMMENDATIONS (CLIENT-SPECIFIC)", 22, yPos + 5);
    yPos += 10;

    // Lifestyle/Diet/Hydration columns or separate paragraphs
    const renderBulletList = (title: string, items: string[]) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        pageNumber++;
        drawHeader();
        yPos = 35;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(3, 4, 94);
      doc.text(title, 15, yPos);
      yPos += 4;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      items.forEach((item) => {
        const splitItem = doc.splitTextToSize(`• ${item}`, 175);
        doc.text(splitItem, 15, yPos);
        yPos += splitItem.length * 4 + 1;
      });
      yPos += 3;
    };

    renderBulletList("Lifestyle & Wellness Habits", recommendations.lifestyle);
    renderBulletList("Nutrient-Focused Diet Recommendations", recommendations.diet);
    renderBulletList("Suggested Daily Hydration Strategy", recommendations.hydration);
    renderBulletList("Restorative Exercises & Kinetic Movement", recommendations.exercise);
    renderBulletList("At-Home Diagnostics & Health Monitoring Patterns", recommendations.monitoringTips);
  }

  // 5. LEGAL MEDICAL DISCLAIMER BOX
  if (yPos > pageHeight - 40) {
    doc.addPage();
    pageNumber++;
    drawHeader();
    yPos = 35;
  } else {
    yPos = Math.max(yPos, pageHeight - 45); // Align nicely towards bottom
  }

  doc.setFillColor(248, 250, 252); // Neutral Slate boundary box
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos, 180, 22, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text("IMPORTANT CLINICAL NOTICE & ETHICAL DISCLAIMER", 20, yPos + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const disclaimerText = "MedVision AI is an educational clinical aid program driven by artificial intelligence. Results, interpretations, and wellness plans produced within are contextual summaries for personal information. It is NOT a professional replacement for doctors, clinical evaluations, or licensed diagnoses. Prioritize physical checkups with certified healthcare practitioners.";
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, 170);
  doc.text(splitDisclaimer, 20, yPos + 9);

  // Draw footer on all pages
  for (let i = 1; i <= pageNumber; i++) {
    doc.setPage(i);
    drawFooter();
  }

  // Return the PDF document
  return doc;
}
