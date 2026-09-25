import React, { useState } from 'react';
import { 
  SearchCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  Building2, 
  FileCheck2, 
  Info, 
  Sparkles,
  ChevronRight,
  Code
} from 'lucide-react';

export default function VerificationCenterView({ 
  verificationSources, 
  selectedBidder, 
  onReverifySource,
  onNavigate 
}) {
  const [reverifyingKey, setReverifyingKey] = useState(null);
  const [activeJsonModal, setActiveJsonModal] = useState(null);

  const handleReverify = async (sourceKey) => {
    setReverifyingKey(sourceKey);
    await onReverifySource(selectedBidder?.id || 'BID-ABC-01', sourceKey);
    setTimeout(() => setReverifyingKey(null), 500);
  };

  const getStatusBadge = (status) => {
    if (status?.includes('VERIFIED') || status?.includes('CLEAN') || status?.includes('AUTHENTIC')) {
      return (
        <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{status.replace('_', ' ')}</span>
        </span>
      );
    }
    if (status?.includes('FLAGGED') || status?.includes('DELINQUENT') || status?.includes('DEBARRED')) {
      return (
        <span className="inline-flex items-center space-x-1 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-semibold">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>{status.replace('_', ' ')}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Registry Verification Center</h1>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
              8 National Source Adapters
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated registry cross-verification against statutory portals to eliminate fraud and shell companies.
          </p>
        </div>

        <button
          onClick={() => onNavigate('compliance')}
          className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <span>Evaluate Compliance Rules</span>
          <ChevronRight className="w-4 h-4 text-teal-400" />
        </button>
      </div>

      {/* Mandatory SIH Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start space-x-3 shadow-subtle">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm">Prototype Verification Mode — Mock/Synthetic Sandbox Data</span>
          <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
            All verification calls query simulated national registry adapters (GSTN, Udyam MSME, Income Tax, MCA21, EPFO, DPIIT, and GeM Incident Registers). The codebase is architected with modular plug-and-play adapter classes ready for direct production integration with authenticated government API gateways.
          </p>
        </div>
      </div>

      {/* Verification Source Cards Grid (8 sources) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verificationSources && verificationSources.map((source) => {
          const isReverifying = reverifyingKey === source.source_key;
          return (
            <div
              key={source.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-elevated transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Source Name + Status */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Registry Adapter [{source.source_key}]
                    </span>
                    <h3 className="text-sm font-bold text-[#0A2540] mt-0.5">{source.source_name}</h3>
                  </div>
                  <div>{getStatusBadge(source.verification_status)}</div>
                </div>

                {/* Evidence Summary */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Verified Evidence
                  </span>
                  <p className="text-[11px] text-slate-700">{source.evidence_summary}</p>
                </div>
              </div>

              {/* Bottom Actions: Last Checked, Re-verify, Raw JSON */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-mono">
                  Checked: {new Date(source.last_checked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveJsonModal(source)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-[11px] font-medium flex items-center space-x-1"
                    title="Inspect Raw Response Payload"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Raw JSON</span>
                  </button>
                  <button
                    onClick={() => handleReverify(source.source_key)}
                    disabled={isReverifying}
                    className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isReverifying ? 'animate-spin text-blue-600' : ''}`} />
                    <span>Re-Check</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Raw Response JSON Modal */}
      {activeJsonModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-modal border border-slate-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0A2540]">{activeJsonModal.source_name}</h3>
                <p className="text-[11px] text-slate-500 font-mono">Adapter Response Schema</p>
              </div>
              <button
                onClick={() => setActiveJsonModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-slate-800">
              {JSON.stringify(activeJsonModal.raw_response, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
