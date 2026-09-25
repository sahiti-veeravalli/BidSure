import React from 'react';
import { 
  HelpCircle, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Scale, 
  Cpu, 
  FileCheck2, 
  Sparkles 
} from 'lucide-react';

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-modal border border-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A2540] to-[#1E40AF] text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                  Smart India Hackathon 2026
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  Evaluation Guide
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#0A2540] mt-0.5">
                About TenderIQ & Evaluation Methodology
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

        {/* Content Sections */}
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Core Mission of TenderIQ</span>
            </h3>
            <p className="text-[11px] text-slate-600">
              TenderIQ is an AI-assisted bid compliance verification platform designed for GeM-style government procurement. It eliminates manual verification bottlenecks, detects subtle fraudulent name and turnover manipulations, verifies statutory registrations across national registries, and empowers Procurement Officers with explainable, evidence-backed reports.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              The 9-Stage Qualification Pipeline
            </h3>
            <div className="space-y-1 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span><strong>1. Tender Selection:</strong> Define eligibility thresholds & custom tender rules</span>
                <span className="text-blue-600 font-mono font-bold">Configure</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span><strong>2. Bidder Doc Upload:</strong> Multi-document packet ingestion (GST, PAN, ITR, OEM, MII)</span>
                <span className="text-blue-600 font-mono font-bold">Ingest</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span><strong>3. AI OCR & Layout:</strong> Optical layout segmentation and structured key extraction</span>
                <span className="text-blue-600 font-mono font-bold">OCR</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span><strong>4. Registry Verification:</strong> Cross-check 8 national registries (GSTN, MCA, CBDT, etc.)</span>
                <span className="text-blue-600 font-mono font-bold">Cross-Check</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span><strong>5. Rule Evaluation:</strong> Tender-specific rule matching with scoring & weights</span>
                <span className="text-blue-600 font-mono font-bold">Match</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span><strong>6. Discrepancy & "Why?":</strong> 6-part deep explainability for any detected delta</span>
                <span className="text-blue-600 font-mono font-bold">Explain</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span><strong>7. Formal Report:</strong> Evidence dossier with verifiable checksums & PDF export</span>
                <span className="text-blue-600 font-mono font-bold">Dossier</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span><strong>8. Officer Final Sign-off:</strong> Officer retains final constitutional authority</span>
                <span className="text-emerald-700 font-mono font-bold">Sign-off</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 text-[11px] text-blue-900">
            <strong>Key Innovation:</strong> Unlike generic AI chatbots, TenderIQ never invents or hallucinates procurement facts. All evaluations are grounded strictly on deterministic rule conditions and cryptographically signed registry checksums.
          </div>

        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#0A2540] text-white text-xs font-semibold px-5 py-2 rounded-xl hover:bg-[#1E40AF]"
          >
            Got It, Proceed
          </button>
        </div>

      </div>
    </div>
  );
}
