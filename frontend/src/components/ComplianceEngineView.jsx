import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  Info
} from 'lucide-react';

export default function ComplianceEngineView({ 
  complianceData, 
  selectedBidder, 
  activeTender, 
  onOpenWhyModal, 
  onOpenDecisionModal,
  onNavigate 
}) {
  const [filterResult, setFilterResult] = useState('ALL');

  const evaluations = complianceData?.evaluations || [];
  const score = complianceData?.overall_score || 92;
  const risk = complianceData?.risk_level || 'MEDIUM';
  const status = complianceData?.compliance_status || 'Needs Review';

  const filteredEvaluations = evaluations.filter((item) => {
    if (filterResult === 'ALL') return true;
    return item.result === filterResult;
  });

  const getResultBadge = (result) => {
    switch (result) {
      case 'PASS':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>PASS</span>
          </span>
        );
      case 'REVIEW_REQUIRED':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>REVIEW REQUIRED</span>
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>FAIL</span>
          </span>
        );
      default:
        return <span className="text-[11px] text-slate-500 font-mono">{result}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Tender Compliance Rules Engine</h1>
            <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-mono font-semibold">
              Evaluation Core
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated verification against tender-specific eligibility clauses and public procurement rules.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('discrepancies')}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>View Discrepancies</span>
          </button>
          <button
            onClick={() => onOpenDecisionModal(selectedBidder)}
            className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>Record Final Decision</span>
          </button>
        </div>
      </div>

      {/* Compliance Score Gauge & Category Breakdown Banner */}
      <div className="bg-gradient-to-br from-[#0A2540] to-[#0F172A] text-white p-6 rounded-3xl shadow-modal border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: Score Dial (5 spans) */}
          <div className="md:col-span-5 flex items-center space-x-6 border-b md:border-b-0 md:border-r border-slate-700 pb-5 md:pb-0 md:pr-6">
            <div className="relative w-24 h-24 rounded-full bg-slate-800/80 border-4 border-teal-400 flex items-center justify-center flex-shrink-0 shadow-inner">
              <div className="text-center">
                <span className="text-3xl font-extrabold font-mono text-white block">{score}</span>
                <span className="text-[9px] uppercase tracking-wider text-teal-300 font-bold block">Score</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-teal-400 uppercase font-bold tracking-wider block">
                Calculated Compliance Rating
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedBidder?.company_name || 'ABC Technologies'}</h3>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  risk === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  risk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {risk} RISK
                </span>
                <span className="text-xs text-slate-300 font-mono">Status: {status}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Clearly labelled: Demo Synthetic Score</p>
            </div>
          </div>

          {/* Right: Category Pillar Breakdown (7 spans) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Statutory Tax</span>
              <span className="text-emerald-400 font-bold text-sm block mt-0.5">100% PASS</span>
              <span className="text-[10px] text-slate-400">GSTN & PAN Active</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Financial 3Y</span>
              <span className="text-emerald-400 font-bold text-sm block mt-0.5">100% PASS</span>
              <span className="text-[10px] text-slate-400">₹4.19 Cr &gt; ₹2.5 Cr</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Tech / OEM</span>
              <span className="text-amber-400 font-bold text-sm block mt-0.5">REVIEW</span>
              <span className="text-[10px] text-slate-400">Stamp Clarity Flag</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Integrity</span>
              <span className="text-emerald-400 font-bold text-sm block mt-0.5">CLEAN</span>
              <span className="text-[10px] text-slate-400">0 Blacklist Flags</span>
            </div>
          </div>

        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-subtle text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider pl-1">Rule Results:</span>
          {['ALL', 'PASS', 'REVIEW_REQUIRED', 'FAIL'].map((res) => (
            <button
              key={res}
              onClick={() => setFilterResult(res)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterResult === res
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {res.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Showing {filteredEvaluations.length} of {evaluations.length} clauses
        </span>
      </div>

      {/* Requirement vs Evidence Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Tender Requirement & Category</th>
                <th className="py-3.5 px-3">Rule Condition</th>
                <th className="py-3.5 px-3">Source Adapter</th>
                <th className="py-3.5 px-3">Evaluation Result</th>
                <th className="py-3.5 px-4">Evidence Summary</th>
                <th className="py-3.5 px-4 text-center">Explainability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvaluations.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors group">
                  
                  {/* Requirement Title & Category */}
                  <td className="py-4 px-4 max-w-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <span className="font-bold text-[#0A2540] text-xs block mt-0.5">
                      {item.requirement_title}
                    </span>
                  </td>

                  {/* Rule Condition */}
                  <td className="py-4 px-3 text-slate-600 font-mono text-[11px] max-w-[180px]">
                    {item.rule_condition}
                  </td>

                  {/* Source Adapter */}
                  <td className="py-4 px-3 text-slate-600 text-[11px] whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                      {item.source_adapter}
                    </span>
                  </td>

                  {/* Result */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    {getResultBadge(item.result)}
                  </td>

                  {/* Evidence Snippet */}
                  <td className="py-4 px-4 text-slate-700 text-xs max-w-sm leading-relaxed">
                    <p className="line-clamp-2">{item.evidence_snippet}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5 italic">
                      Rec: {item.recommendation}
                    </span>
                  </td>

                  {/* Why Button (Novel Feature 1) */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onOpenWhyModal(item.id || item)}
                      className="bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 mx-auto shadow-xs group-hover:scale-105"
                    >
                      <Sparkles className="w-3 h-3 text-blue-500 group-hover:text-white" />
                      <span>Why?</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
