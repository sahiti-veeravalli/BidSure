import React, { useState } from 'react';
import { 
  UserCheck, 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Send, 
  Scale, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DecisionModal({ 
  bidder, 
  activeTender, 
  onClose, 
  onSaveDecision,
  onNavigate 
}) {
  const [decision, setDecision] = useState(bidder?.officer_decision || 'Qualified');
  const [remarks, setRemarks] = useState(bidder?.decision_remarks || 'Entity name variation verified against MCA CIN; statutory tax filings fully compliant. Recommended for technical qualification.');
  const [isSaving, setIsSaving] = useState(false);
  const [clarificationNotice, setClarificationNotice] = useState('Please provide high-resolution signed copy of OEM Authorization Letter within 48 hours via GeM portal.');

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      bidder_id: bidder.id,
      tender_id: activeTender?.id || 'GEM/2026/B/901248',
      decision: decision,
      remarks: decision === 'Clarification Requested' ? `${remarks} [Notice sent: ${clarificationNotice}]` : remarks,
      officer_name: 'Dr. Rajesh Kumar, IAS',
      officer_role: 'Senior Procurement Officer (Level-3)'
    };

    await onSaveDecision(payload);

    if (decision === 'Qualified' || decision === 'Conditionally Qualified') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-modal border border-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-white flex items-center justify-center shadow-sm">
              <UserCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                  Final Evaluation Sign-off
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  Officer Authority
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#0A2540] mt-0.5">
                Record Procurement Officer Decision
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

        {/* AI Assessment Reference Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">AI Verification Recommendation:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
              bidder?.compliance_status === 'Compliant' ? 'bg-emerald-100 text-emerald-800' :
              bidder?.compliance_status === 'Needs Review' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {bidder?.compliance_status || 'Needs Review'} (Score: {bidder?.overall_score || 92}/100)
            </span>
          </div>

          {/* Mandatory GFR & AI Disclaimer */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong>Statutory Principle:</strong> AI assists verification and detects discrepancies. Final qualification/disqualification decision remains strictly with the Procurement Officer.
            </p>
          </div>
        </div>

        {/* Decision Selection Options */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              Select Decision Action:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              
              <label className={`p-3 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
                decision === 'Qualified' ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="decision"
                  value="Qualified"
                  checked={decision === 'Qualified'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="mt-0.5 text-emerald-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Mark as Compliant (Qualified)</span>
                  <span className="text-[10px] text-slate-500">Admit bidder to commercial bid opening stage.</span>
                </div>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
                decision === 'Clarification Requested' ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="decision"
                  value="Clarification Requested"
                  checked={decision === 'Clarification Requested'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="mt-0.5 text-amber-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Request Clarification</span>
                  <span className="text-[10px] text-slate-500">Issue 48-hour GeM representation notice.</span>
                </div>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
                decision === 'Disqualified' ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="decision"
                  value="Disqualified"
                  checked={decision === 'Disqualified'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="mt-0.5 text-rose-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Mark as Non-Compliant (Disqualified)</span>
                  <span className="text-[10px] text-slate-500">Reject bid with clause citations.</span>
                </div>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
                decision === 'Conditionally Qualified' ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="decision"
                  value="Conditionally Qualified"
                  checked={decision === 'Conditionally Qualified'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Conditionally Qualified</span>
                  <span className="text-[10px] text-slate-500">Subject to physical verification at award.</span>
                </div>
              </label>

            </div>
          </div>

          {/* Conditional Clarification Notice Box */}
          {decision === 'Clarification Requested' && (
            <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 space-y-1.5 animate-fade-in">
              <span className="font-bold text-amber-900 text-xs flex items-center space-x-1">
                <Send className="w-3.5 h-3.5 text-amber-700" />
                <span>GeM Clarification Notice Text:</span>
              </span>
              <textarea
                rows={2}
                value={clarificationNotice}
                onChange={(e) => setClarificationNotice(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          )}

          {/* Decision Remarks / Justification */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
              Official Justification / Remarks for Evaluation Record:
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide evidence-based rationale citing verified registry results or document clauses..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('reports');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Review Full Evidence Report
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#0A2540] hover:bg-[#1E40AF] text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm flex items-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span>{isSaving ? 'Signing & Recording...' : 'Save Decision & Log to Audit Trail'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
