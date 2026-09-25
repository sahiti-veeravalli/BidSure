import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileSearch, 
  SlidersHorizontal, 
  Scale, 
  Lock, 
  Zap, 
  Building2, 
  Cpu, 
  SearchCheck, 
  FileSpreadsheet, 
  AlertTriangle, 
  Sparkles,
  ChevronRight,
  Eye
} from 'lucide-react';

export default function LandingPage({ onEnterDemo }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* Top Government-grade Banner */}
      <div className="bg-[#0A2540] text-slate-200 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-medium text-slate-300">Smart India Hackathon (SIH 2026) Prototype</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">GeM-Aligned AI Bid Compliance Verification Platform</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-slate-400">
          <span>Sandbox Mode (Synthetic National Registries)</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A2540] to-[#1E40AF] flex items-center justify-center shadow text-white">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold tracking-tight text-[#0A2540]">Tender</span>
                <span className="text-2xl font-bold tracking-tight text-[#0D9488] ml-0.5">IQ</span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide -mt-1">Verify. Analyze. Comply.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="#workflow" 
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 hidden sm:block"
            >
              Evaluation Pipeline
            </a>
            <a 
              href="#differentiators" 
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 hidden sm:block"
            >
              Key Innovations
            </a>
            <button
              onClick={onEnterDemo}
              className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition-all flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex-1">
        
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Next-Gen Procurement Intelligence for GeM Evaluators</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0A2540] tracking-tight max-w-4xl mx-auto leading-tight">
          Verify. Analyze. Comply.
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          AI-assisted bid compliance verification for <span className="font-semibold text-slate-900">faster, transparent, and evidence-backed</span> public procurement.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onEnterDemo}
            className="w-full sm:w-auto bg-[#0A2540] hover:bg-[#1E40AF] text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-elevated transition-all flex items-center justify-center space-x-2 group focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            <span>Explore Demo as Procurement Officer</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-teal-400" />
          </button>
          <a
            href="#workflow"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold px-6 py-3.5 rounded-xl shadow-subtle transition-all flex items-center justify-center space-x-2"
          >
            <span>View How It Works</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Horizontal Visual Workflow */}
        <div id="workflow" className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            End-to-End Tender Evaluation Workflow
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'UPLOAD', desc: 'Drag-and-drop multi-document bid packet', icon: '📄' },
              { step: '02', title: 'EXTRACT', desc: 'AI OCR extracts keys & financial numbers', icon: '⚡' },
              { step: '03', title: 'VERIFY', desc: 'Cross-check 8 statutory registries (GST, PAN, Udyam)', icon: '🔍' },
              { step: '04', title: 'CHECK', desc: 'Tender-specific compliance rules applied', icon: '⚖️' },
              { step: '05', title: 'EXPLAIN', desc: '"Why This Result?" instant discrepancy breakdown', icon: '💡' },
              { step: '06', title: 'DECIDE', desc: 'Officer sign-off recorded in immutable audit log', icon: '✅' },
            ].map((s, idx) => (
              <div key={s.step} className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle text-left flex flex-col justify-between relative group hover:border-blue-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold mb-2">
                    <span>{s.step}</span>
                    <span className="text-lg">{s.icon}</span>
                  </div>
                  <div className="font-bold text-xs text-[#0A2540] tracking-wide mb-1">{s.title}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{s.desc}</div>
                </div>
                {idx < 5 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3 Key Differentiators */}
        <div id="differentiators" className="mt-20 max-w-5xl mx-auto text-left">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540]">Engineered for Serious Public Procurement</h2>
            <p className="text-sm text-slate-500 mt-2">Built with zero hallucination risk, strict explainability, and total officer empowerment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:shadow-elevated transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A2540] mb-2">AI Document Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic OCR layout analysis extracts key identifiers (GSTIN, CIN, Turnover, OEM authorization dates) with per-field confidence scoring and visual bounding boxes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:shadow-elevated transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 font-bold">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A2540] mb-2">Tender-Aware Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Define customized tender eligibility rules (e.g. Class-I MII % &ge; 50%, Min Turnover &ge; ₹2.5 Cr, Active Udyam category). Evaluates bids automatically against clauses.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:shadow-elevated transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0A2540] mb-2">Evidence-Backed Decisions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every flag links back to submitted documents and registry checksums. Explainable "Why This Result?" panel ensures fairness and generates instant audit-ready PDF reports.
              </p>
            </div>
          </div>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-[#0A2540] text-white p-8 rounded-3xl shadow-modal text-left border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-semibold">Active Tender Evaluation Case</span>
              </div>
              <h4 className="text-xl font-bold mt-1 text-white">GEM/2026/B/901248 — Cloud Hardware Procurement</h4>
              <p className="text-xs text-slate-300 mt-0.5">Ministry of Electronics & IT | Value: ₹4.50 Cr</p>
            </div>
            <button
              onClick={onEnterDemo}
              className="bg-teal-500 hover:bg-teal-400 text-[#0A2540] font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center space-x-1.5 flex-shrink-0"
            >
              <span>Open Evaluation View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-1">Bidder Under Review</span>
              <span className="font-bold text-sm text-white block">ABC Technologies Pvt. Ltd.</span>
              <span className="text-[11px] text-amber-400 font-medium mt-1 inline-block">Score: 92/100 (Needs Review)</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-1">Registry Checks</span>
              <span className="font-bold text-sm text-white block">8 of 8 Sources Verified</span>
              <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">GST, Udyam, MCA, ITR Valid</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-1">Discrepancy Detected</span>
              <span className="font-bold text-sm text-amber-300 block">Name Delta + OEM Stamp</span>
              <span className="text-[11px] text-slate-400 mt-1 inline-block">Explainable in 1-Click</span>
            </div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">TenderIQ</span>
            <span>—</span>
            <span>AI-Assisted Integrated Bid Compliance Verification Platform</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Smart India Hackathon 2026 Prototype | Synthetic Sandboxed Registries
          </div>
        </div>
      </footer>

    </div>
  );
}
