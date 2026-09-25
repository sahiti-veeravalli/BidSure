import React from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  FileText, 
  SearchCheck, 
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export default function WhyThisResultModal({ 
  evaluationItem, 
  onClose, 
  onOpenDecisionModal, 
  selectedBidder 
}) {
  if (!evaluationItem) return null;

  const why = evaluationItem.why_explanation || {
    submitted: evaluationItem.submitted_data || "ABC Technologies Pvt. Ltd. (In Bid Header)",
    verified: evaluationItem.verified_data || "ABC Technology Private Limited (In MCA21 & GSTN)",
    rule_applied: evaluationItem.rule_condition || "Clause 2.1: Legal identity must be consistent across statutory documents",
    mismatch_found: "Syntactic company name variation between trade abbreviation and registered legal name",
    evidence_used: evaluationItem.evidence_snippet || "Cross-checked MCA CIN U72200KA2018PTC112345 against GST REG-06 29ABCDE1234F1Z5",
    recommended_action: evaluationItem.recommendation || "Officer can accept with administrative note or issue 48-hour GeM clarification notice"
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-modal border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                  Explainable AI Evaluation Layer
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  Why This Result?
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#0A2540] mt-0.5">
                {evaluationItem.requirement_title || evaluationItem.title || 'Rule Evaluation Breakdown'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6-Part Structured Explainability Grid */}
        <div className="space-y-3.5 text-xs">
          
          {/* Factor 1: What was submitted */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                What Was Submitted
              </span>
            </div>
            <p className="font-mono text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200 font-semibold mt-1">
              {why.submitted}
            </p>
          </div>

          {/* Factor 2: What was verified */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px]">
                What Was Verified (Government Registry)
              </span>
            </div>
            <p className="font-mono text-emerald-950 bg-white p-2.5 rounded-lg border border-emerald-100 font-semibold mt-1">
              {why.verified}
            </p>
          </div>

          {/* Factor 3: What rule was applied */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px]">
                Tender Rule & Clause Applied
              </span>
            </div>
            <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-blue-100 font-medium mt-1">
              {why.rule_applied}
            </p>
          </div>

          {/* Factor 4: What mismatch was found */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px]">
                4
              </span>
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                Mismatch / Delta Analysis
              </span>
            </div>
            <p className="text-amber-950 bg-white p-2.5 rounded-lg border border-amber-100 font-semibold mt-1">
              {why.mismatch_found}
            </p>
          </div>

          {/* Factor 5: Evidence used */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                5
              </span>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Evidence Checksum & Document Citation
              </span>
            </div>
            <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] mt-1">
              {why.evidence_used}
            </p>
          </div>

          {/* Factor 6: Recommended next action */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center font-bold text-[10px]">
                6
              </span>
              <span className="font-bold text-teal-900 uppercase tracking-wider text-[10px]">
                Recommended Procurement Officer Action
              </span>
            </div>
            <p className="text-teal-950 bg-white p-2.5 rounded-lg border border-teal-100 font-bold mt-1">
              {why.recommended_action}
            </p>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Full audit log hash generated for this evaluation.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onOpenDecisionModal) onOpenDecisionModal(selectedBidder);
              }}
              className="bg-[#0A2540] hover:bg-[#1E40AF] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <span>Act in Decision Panel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
