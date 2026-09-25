import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Scale, 
  Building2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function ComplianceReportView({ 
  selectedBidder, 
  activeTender, 
  complianceData, 
  documents,
  discrepancies,
  onOpenDecisionModal 
}) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const evaluations = complianceData?.evaluations || [];
  const score = complianceData?.overall_score || 92;
  const risk = complianceData?.risk_level || 'MEDIUM';
  const status = complianceData?.compliance_status || 'Needs Review';

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `TENDERIQ COMPLIANCE ASSESSMENT REPORT
Tender ID: ${activeTender?.id || 'GEM/2026/B/901248'}
Tender Title: ${activeTender?.title || 'Cloud Infrastructure Hardware'}
Bidder: ${selectedBidder?.company_name || 'ABC Technologies Pvt. Ltd.'}
Legal Name: ${selectedBidder?.legal_name || 'ABC Technology Private Limited'}
GSTIN: ${selectedBidder?.gstin || '29ABCDE1234F1Z5'} | PAN: ${selectedBidder?.pan || 'ABCDE1234F'}
Overall Score: ${score}/100 (Demo Score)
Risk Level: ${risk}
Assessment Outcome: ${status}
Officer Decision: ${selectedBidder?.officer_decision || 'Pending Review'}
Summary: 6 Statutory and Technical Clauses passed. 2 Minor discrepancies flagged for administrative review (Entity Name delta & OEM seal clarity).`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(10, 37, 64);
    doc.text("TenderIQ — Tender Compliance Assessment", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("AI-Assisted Integrated Bid Compliance Verification Report", 14, 26);
    doc.text(`Generated: ${new Date().toUTCString()}`, 14, 31);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, 196, 35);

    // Tender Info
    doc.setFontSize(12);
    doc.setTextColor(10, 37, 64);
    doc.text("1. Tender & Bidder Information", 14, 43);

    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(`Tender Reference: ${activeTender?.id || 'GEM/2026/B/901248'}`, 14, 50);
    doc.text(`Department: ${activeTender?.department || 'Ministry of Electronics & IT'}`, 14, 55);
    doc.text(`Bidder Company: ${selectedBidder?.company_name || 'ABC Technologies Pvt. Ltd.'}`, 14, 60);
    doc.text(`Legal Registered Name: ${selectedBidder?.legal_name || 'ABC Technology Private Limited'}`, 14, 65);
    doc.text(`GSTIN: ${selectedBidder?.gstin || '29ABCDE1234F1Z5'} | PAN: ${selectedBidder?.pan || 'ABCDE1234F'}`, 14, 70);

    // Score & Risk
    doc.setFontSize(12);
    doc.setTextColor(10, 37, 64);
    doc.text("2. Evaluation Summary", 14, 82);

    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(`Compliance Score: ${score}/100 (Demo Score) | Risk Level: ${risk} | Status: ${status}`, 14, 89);
    doc.text(`Officer Evaluation Decision: ${selectedBidder?.officer_decision || 'Pending Review'}`, 14, 94);

    // Requirement Matrix
    doc.setFontSize(12);
    doc.setTextColor(10, 37, 64);
    doc.text("3. Clause-wise Compliance Matrix", 14, 106);

    let y = 113;
    evaluations.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(9);
      doc.setTextColor(10, 37, 64);
      doc.text(`${index + 1}. ${item.requirement_title} [${item.result}]`, 14, y);
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Evidence: ${item.evidence_snippet}`, 18, y, { maxWidth: 175 });
      y += 8;
    });

    // Disclaimer
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Notice: AI assists verification. Final qualification decision remains strictly with the Procurement Officer.", 14, y + 10);

    doc.save(`TenderIQ_Compliance_Report_${selectedBidder?.id || 'ABC_Tech'}.pdf`);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle no-print">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Evidence-Backed Compliance Report</h1>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
              Official Assessment
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete formal qualification dossier with requirement-wise proofs, discrepancy analysis, and audit trails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>{isExporting ? 'Generating PDF...' : 'Export to PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Assessment Paper (Print-ready document style) */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-modal p-8 sm:p-12 max-w-4xl mx-auto space-y-8 report-page text-xs font-sans">
        
        {/* Report Header */}
        <div className="border-b-2 border-[#0A2540] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-[#0A2540]">Tender</span>
              <span className="text-2xl font-bold tracking-tight text-[#0D9488]">IQ</span>
              <span className="text-[11px] font-semibold text-slate-500 border-l border-slate-300 pl-2 ml-2">
                Procurement Intelligence Dossier
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0A2540] mt-2">
              Tender Compliance Assessment Report
            </h2>
            <p className="text-xs text-slate-500">
              Generated under GeM AI Verification Standards & Public Procurement Policy
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 text-slate-600">
            <div className="font-mono text-[11px] text-slate-400">Report Ref: TIQ-2026-901248-01</div>
            <div className="font-mono text-[11px] text-slate-500 mt-0.5">Date: {new Date().toLocaleDateString('en-GB')}</div>
            <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
              AI-Verified Evidence Dossier
            </div>
          </div>
        </div>

        {/* Section 1: Tender & Bidder Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">
              Tender Specification
            </h3>
            <div className="space-y-1 text-slate-700">
              <div><strong className="text-slate-900">Tender ID:</strong> <span className="font-mono">{activeTender?.id || 'GEM/2026/B/901248'}</span></div>
              <div><strong className="text-slate-900">Title:</strong> {activeTender?.title || 'Cloud Infrastructure Hardware'}</div>
              <div><strong className="text-slate-900">Department:</strong> {activeTender?.department || 'Ministry of Electronics & IT'}</div>
              <div><strong className="text-slate-900">Est. Value:</strong> ₹4.50 Crore</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">
              Bidder Profile
            </h3>
            <div className="space-y-1 text-slate-700">
              <div><strong className="text-slate-900">Company:</strong> {selectedBidder?.company_name || 'ABC Technologies Pvt. Ltd.'}</div>
              <div><strong className="text-slate-900">Legal Entity:</strong> {selectedBidder?.legal_name || 'ABC Technology Private Limited'}</div>
              <div><strong className="text-slate-900">GSTIN / PAN:</strong> <span className="font-mono">{selectedBidder?.gstin || '29ABCDE1234F1Z5'} / {selectedBidder?.pan || 'ABCDE1234F'}</span></div>
              <div><strong className="text-slate-900">Udyam No:</strong> <span className="font-mono">{selectedBidder?.udyam_number || 'UDYAM-KR-03-0019284'}</span></div>
            </div>
          </div>
        </div>

        {/* Section 2: Executive Assessment Summary */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
              Evaluation Outcome
            </span>
            <div className="text-xl font-extrabold text-white">
              Overall Compliance: {status}
            </div>
            <p className="text-xs text-slate-300">
              Passing 6 of 8 mandatory tender conditions. 2 Minor administrative flags for review.
            </p>
          </div>

          <div className="flex items-center space-x-6 flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl font-extrabold font-mono text-teal-300">{score}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Demo Score</div>
            </div>
            <div className="text-center border-l border-slate-700 pl-6">
              <div className="text-lg font-bold text-amber-300 font-mono">{risk}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Risk Rating</div>
            </div>
          </div>
        </div>

        {/* Section 3: Clause-by-Clause Evaluation Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider border-b border-slate-200 pb-2">
            Requirement-Wise Evaluation Matrix
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {evaluations.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-white hover:bg-slate-50 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">R-{idx + 1}</span>
                    <span className="font-bold text-slate-900">{item.requirement_title}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong>Evidence:</strong> {item.evidence_snippet}
                  </p>
                  <p className="text-[11px] text-blue-900 font-medium">
                    <strong>Recommendation:</strong> {item.recommendation}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`px-2 py-1 rounded font-bold text-[10px] font-mono ${
                    item.result === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                    item.result === 'REVIEW_REQUIRED' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Flagged Discrepancies & Explanations */}
        {discrepancies && discrepancies.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider border-b border-slate-200 pb-2">
              Identified Discrepancies & Mismatch Analysis
            </h3>

            <div className="space-y-2">
              {discrepancies.map((disc, idx) => (
                <div key={idx} className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 text-xs">{disc.title}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-mono font-bold px-2 py-0.5 rounded">
                      {disc.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded border border-amber-200">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Submitted in Bid:</span>
                      <span className="font-mono text-slate-800">{disc.submitted_data}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-amber-200">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Verified in Registry:</span>
                      <span className="font-mono text-slate-800">{disc.verified_data}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <strong>Tender Clause:</strong> {disc.rule_violated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Procurement Officer Decision & Digital Sign-off */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">
              Procurement Officer Evaluation Decision
            </h3>
            <span className="font-mono text-[11px] text-slate-500">
              Audit Signature: {selectedBidder?.decision_timestamp ? 'IMMUTABLE RECORD' : 'PENDING FINAL SIGN-OFF'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Final Decision Status:</div>
              <div className="text-base font-bold text-slate-900">
                {selectedBidder?.officer_decision || 'Pending Evaluation Review'}
              </div>
              <div className="text-xs text-slate-600 mt-1 italic">
                "{selectedBidder?.decision_remarks || 'Entity name variation acceptable; OEM stamp clarity to be verified during technical stage.'}"
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
              <div className="font-bold text-xs text-slate-900">Dr. Rajesh Kumar, IAS</div>
              <div className="text-[11px] text-slate-500">Senior Procurement Officer (Level-3)</div>
              <div className="text-[10px] text-teal-700 font-mono mt-1">GeM Evaluator Key #PO-881902</div>
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed text-center">
            * Disclaimer: TenderIQ AI provides deterministic verification intelligence. Final qualification or disqualification authority remains strictly with the Procurement Evaluation Committee under General Financial Rules (GFR 2017).
          </div>
        </div>

      </div>

    </div>
  );
}
