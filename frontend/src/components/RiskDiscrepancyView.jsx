import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  FileText,
  Search,
  Scale,
  UserCheck
} from 'lucide-react';

export default function RiskDiscrepancyView({ 
  discrepancies, 
  selectedBidder, 
  onOpenWhyModal, 
  onOpenDecisionModal,
  onNavigate 
}) {
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredDiscrepancies = discrepancies.filter((d) => {
    if (severityFilter === 'ALL') return true;
    return d.severity === severityFilter;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded text-[10px] font-mono">CRITICAL</span>;
      case 'HIGH':
        return <span className="bg-red-50 text-red-700 border border-red-200 font-bold px-2 py-0.5 rounded text-[10px] font-mono">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded text-[10px] font-mono">MEDIUM</span>;
      default:
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded text-[10px] font-mono">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Risk & Discrepancy Intelligence</h1>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono font-semibold">
              Delta Analysis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Explainable delta comparison between submitted bid documentation and verified national registry records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenDecisionModal(selectedBidder)}
            className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>Procurement Officer Decision</span>
          </button>
        </div>
      </div>

      {/* Overall Risk Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Overall Risk Rating</span>
          <span className="text-xl font-bold text-amber-600 font-mono block mt-1">MEDIUM</span>
          <span className="text-[10px] text-slate-500">2 Non-Fatal Deltas</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Identity & Name Match</span>
          <span className="text-xl font-bold text-amber-600 font-mono block mt-1">SYNTACTIC DELTA</span>
          <span className="text-[10px] text-slate-500">Plural vs Singular Match</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Technical / OEM Stamp</span>
          <span className="text-xl font-bold text-amber-600 font-mono block mt-1">CLARIFICATION</span>
          <span className="text-[10px] text-slate-500">Low OCR Stamp Clarity</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Integrity Debarment</span>
          <span className="text-xl font-bold text-emerald-600 font-mono block mt-1">CLEAN</span>
          <span className="text-[10px] text-slate-500">0 Debarment Records</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-subtle text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider pl-1">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                severityFilter === sev
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {filteredDiscrepancies.length} Discrepancies Flagged
        </span>
      </div>

      {/* Discrepancy Cards with Side-by-Side Comparison */}
      <div className="space-y-4">
        {filteredDiscrepancies.map((disc, idx) => (
          <div
            key={disc.id || idx}
            className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-elevated transition-all p-5 space-y-4"
          >
            {/* Header: Title + Severity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                    {disc.category}
                  </span>
                  {getSeverityBadge(disc.severity)}
                </div>
                <h3 className="text-base font-bold text-[#0A2540] mt-0.5">{disc.title}</h3>
              </div>

              <button
                onClick={() => onOpenWhyModal(disc.id?.includes('01') ? 'COMP-ABC-06' : 'COMP-ABC-05')}
                className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Explain: Why Flagged?</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              
              {/* Submitted Side */}
              <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block font-sans mb-1">
                  [1] Data Extracted from Bidder Document
                </span>
                <div className="text-slate-900 font-bold text-xs bg-white p-2.5 rounded-lg border border-rose-100 shadow-xs">
                  {disc.submitted_data}
                </div>
              </div>

              {/* Verified Side */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block font-sans mb-1">
                  [2] Verified Government Registry Record
                </span>
                <div className="text-slate-900 font-bold text-xs bg-white p-2.5 rounded-lg border border-emerald-100 shadow-xs">
                  {disc.verified_data}
                </div>
              </div>

            </div>

            {/* Evidence, Clause & Action Recommendation */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-start justify-between text-slate-700">
                <span className="font-semibold text-slate-500 w-32 flex-shrink-0">Tender Clause:</span>
                <span className="flex-1 font-mono text-[11px] text-slate-800">{disc.rule_violated}</span>
              </div>
              <div className="flex items-start justify-between text-slate-700">
                <span className="font-semibold text-slate-500 w-32 flex-shrink-0">Evidence Source:</span>
                <span className="flex-1 text-[11px] text-slate-800">{disc.evidence}</span>
              </div>
              <div className="flex items-start justify-between text-slate-700 pt-1 border-t border-slate-200">
                <span className="font-bold text-[#0A2540] w-32 flex-shrink-0">Recommended Action:</span>
                <span className="flex-1 text-[11px] font-semibold text-blue-900">{disc.recommendation}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
