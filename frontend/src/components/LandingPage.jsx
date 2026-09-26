import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  ChevronRight,
  ChevronDown,
  Eye,
  FileText,
  Database,
  UserCheck,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  Scale,
  Lock,
  SearchCheck,
  FileWarning,
  Activity,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  FileCheck2,
  FileSearch,
  CheckCircle
} from 'lucide-react';
import BidIntelligence3D from './BidIntelligence3D';

export default function LandingPage({ onEnterDemo }) {
  // Section 2: Workspace State
  const [activeHotspot, setActiveHotspot] = useState('compliance');
  const [selectedBidder, setSelectedBidder] = useState('abc');

  // Section 3 (Dark Navy Patch): Interactive Lineage Diff
  const [activeCase, setActiveCase] = useState('oem');
  const [activeEvidenceFocus, setActiveEvidenceFocus] = useState('mismatch');

  // Section 4: FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const biddersData = {
    abc: {
      name: 'ABC Technologies Pvt. Ltd.',
      score: '92.4%',
      status: 'NEEDS REVIEW',
      statusColor: 'amber',
      docsCount: 3,
      gstin: '27AAACA1234F1Z5',
      turnover: '₹6.82 Cr (Passed)',
      flags: ['OEM Authorization Name Delta']
    },
    netsphere: {
      name: 'NetSphere Systems Ltd.',
      score: '96.8%',
      status: 'COMPLIANT',
      statusColor: 'emerald',
      docsCount: 4,
      gstin: '07AAACN5678B1Z2',
      turnover: '₹12.40 Cr (Passed)',
      flags: []
    },
    param: {
      name: 'Param Infotech Enterprises',
      score: '64.2%',
      status: 'NON-COMPLIANT',
      statusColor: 'rose',
      docsCount: 2,
      gstin: '29AAACP9012D1Z9',
      turnover: '₹1.80 Cr (Below Clause)',
      flags: ['Turnover Below Minimum Threshold']
    }
  };

  const hotspots = [
    {
      id: 'documents',
      label: 'DOCUMENTS',
      title: 'Layout-Aware PDF Ingestion & OCR',
      description: 'Parses bidder submissions, extracting key financial numbers, tax IDs, and validity dates with per-field confidence scoring.',
      tag: '3 Ingested',
      highlightData: [
        { label: 'Audited Turnover Statement', val: '₹6.82 Cr (CA Certified FY24)', conf: '99.4% Match' },
        { label: 'MII Local Content Affidavit', val: '62.00% (Class-I Supplier)', conf: '98.5% Match' },
        { label: 'OEM Dealership Deed', val: 'Flagged: Entity Suffix Delta', conf: '94.0% Flag' }
      ]
    },
    {
      id: 'verification',
      label: 'REGISTRIES',
      title: 'Cross-Source Statutory Checks',
      description: 'Validates extracted credentials against 8 statutory government registries to verify active legal standing and tax filing status.',
      tag: '8 / 8 Verified',
      highlightData: [
        { label: 'GSTN Portal (27AAACA1234F1Z5)', val: 'Active · GSTR-3B Compliant', conf: 'Verified' },
        { label: 'MCA21 Company Master Data', val: 'Active (3 Registered Directors)', conf: 'Verified' },
        { label: 'MSME Udyam Portal', val: 'Class-I Micro Enterprise', conf: 'Verified' }
      ]
    },
    {
      id: 'compliance',
      label: 'COMPLIANCE',
      title: 'Deterministic Tender Clause Rules',
      description: 'Executes strict clause logic defined by the procurement tender—assessing financial thresholds, technical certifications, and local content.',
      tag: '7 Passed · 1 Review',
      highlightData: [
        { label: 'Clause TR-101: Turnover Threshold', val: 'Min ₹2.50 Cr (Bidder: ₹6.82 Cr)', conf: 'PASSED' },
        { label: 'Clause TR-102: Class-I MII %', val: 'Min 50.0% (Bidder: 62.0%)', conf: 'PASSED' },
        { label: 'Clause TR-204: OEM Exact Match', val: 'Name Delta Detected', conf: 'NEEDS REVIEW' }
      ]
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      title: 'Explainable Anomaly Identification',
      description: 'Every recommendation is backed by a side-by-side evidence diff linking findings to the exact source document, registry checksum, and tender rule.',
      tag: '1 Finding Flagged',
      highlightData: [
        { label: 'Submitted Document Excerpt', val: '"ABC Technologies Pvt Ltd"', conf: 'Document Page 2' },
        { label: 'Verified Statutory Registry', val: '"ABC InfoTech Global Private Limited"', conf: 'Registry #8820' },
        { label: 'Officer Adjudication Action', val: 'Issue 48-hr Clarification Notice', conf: 'Recommendation' }
      ]
    }
  ];

  const discrepancyCases = {
    oem: {
      title: 'OEM Authorization Entity Suffix Mismatch',
      finding: 'Name mismatch detected between submitted authorization and verified bidder statutory record.',
      docTitle: 'ABC_OEM_Authorization_2026.pdf',
      docPage: 'Page 2, Clause 3.1',
      docSnippet: 'Authorized Bidder: "ABC Technologies Pvt Ltd"',
      sourceTitle: 'OEM Partner Registry #8820',
      sourceSnippet: 'Registered Entity: "ABC InfoTech Global Private Limited"',
      ruleCode: 'Clause TR-204 (Mandatory)',
      ruleReq: 'OEM Authorization Entity Legal Name Exact Match',
      resultTag: 'NEEDS REVIEW',
      officerRec: 'Issue 48-hour clarification notice for MCA incorporation name-change certificate.'
    },
    turnover: {
      title: 'Annual Turnover Financial Threshold Evaluation',
      finding: 'Bidder declared FY24 turnover exceeds the tender minimum requirement of ₹2.50 Cr.',
      docTitle: 'CA_Certified_Turnover_FY24.pdf',
      docPage: 'Page 1, Schedule A',
      docSnippet: 'Average Annual Turnover: ₹6,82,40,000',
      sourceTitle: 'CA UDIN Registry Verification',
      sourceSnippet: 'UDIN 24089765AAAA1234 · Sharma & Associates CA',
      ruleCode: 'Clause TR-101 (Financial)',
      ruleReq: 'Minimum Annual Turnover ≥ ₹2,50,00,000 in last 3 FYs',
      resultTag: 'PASSED (₹6.82 CR)',
      officerRec: 'Threshold condition satisfied. No clarification required.'
    },
    mii: {
      title: 'Make in India (MII) Local Content % Verification',
      finding: 'Declared local content percentage meets the Class-I Local Supplier criteria of ≥ 50%.',
      docTitle: 'MII_Local_Content_Affidavit.pdf',
      docPage: 'Page 1, Declaration',
      docSnippet: 'Domestic Value Addition: 62.00%',
      sourceTitle: 'Self-Certification Verified with BoM',
      sourceSnippet: 'Manufacturing Facilities: Pune & Bengaluru Units',
      ruleCode: 'Clause TR-102 (Preference Policy)',
      ruleReq: 'Class-I Local Supplier Criteria (Local Content ≥ 50%)',
      resultTag: 'PASSED (62.0%)',
      officerRec: 'Eligible for purchase preference under Public Procurement Order.'
    }
  };

  const currentCase = discrepancyCases[activeCase] || discrepancyCases.oem;
  const activeHotspotData = hotspots.find(h => h.id === activeHotspot) || hotspots[2];

  const faqs = [
    {
      q: 'Does TenderIQ make the award decision?',
      a: 'No. TenderIQ is strictly a decision-support and evidence-compilation platform. It extracts data, validates statutory records, and highlights discrepancies against tender rules. The Procurement Officer and Evaluation Committee retain 100% sovereign authority to make, justify, and record the final decision.'
    },
    {
      q: 'What data does the platform run on today?',
      a: 'In this prototype, TenderIQ operates in Sandbox Mode using synthetic bidder submissions and simulated government registry APIs (GSTN, MCA21, CBDT PAN, MSME Udyam, and CPPP debarment database) formatted after real GeM tender structures.'
    },
    {
      q: 'Can an officer challenge a finding?',
      a: 'Yes. Every flagged discrepancy includes an officer adjudication panel where officers can record formal justifications, issue 48-hour clarification notices to bidders, or override flags with a cryptographic audit log entry.'
    },
    {
      q: 'How does this sit alongside our existing evaluation manual?',
      a: 'TenderIQ encodes standard General Financial Rules (GFR), GeM evaluation guidelines, and tender-specific eligibility criteria into deterministic rule matrices, complementing your manual committee procedures with instant evidence verification.'
    },
    {
      q: 'Is the process auditable after the fact?',
      a: 'Yes. Every document ingestion, OCR extraction confidence score, registry API response, and officer justification note is permanently recorded with SHA-256 integrity hashes in a tamper-proof audit trail and exportable PDF compliance dossier.'
    },
    {
      q: 'What would a first walkthrough involve for us?',
      a: 'Clicking "Launch Demo" takes you directly into an active evaluation scenario (GEM/2026/B/901248) with 4 pre-loaded bidder packets. You can inspect extracted documents, explore discrepancy diffs, and execute a mock officer adjudication.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A2540] flex flex-col font-sans selection:bg-blue-100 selection:text-[#0A2540] antialiased bg-grid-ambient">
      
      {/* =========================================================================
          PREMIER GLASSPHORPHISM NAVBAR
          ========================================================================= */}
      <header className="bg-[#FAFAFA]/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 py-3.5 flex items-center justify-between">
          
          {/* Brand Mark */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A2540] flex items-center justify-center text-white border border-slate-800 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-[#0A2540] leading-none font-sans">
                TenderIQ
              </div>
              <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase font-mono mt-0.5">
                Verify. Analyze. Comply.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-wider text-slate-600 uppercase font-mono">
            <a href="#workspace" className="hover:text-[#0A2540] transition-colors">Workspace</a>
            <a href="#how-it-works" className="hover:text-[#0A2540] transition-colors">How It Works</a>
            <a href="#faqs" className="hover:text-[#0A2540] transition-colors">FAQs</a>
          </nav>

          {/* Action CTA */}
          <button
            onClick={onEnterDemo}
            className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center space-x-2 font-mono uppercase tracking-wider group"
          >
            <span>Launch Demo</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 transition-transform group-hover:translate-x-0.5" />
          </button>

        </div>
      </header>

      {/* =========================================================================
          SECTION 1 — HERO: HIGH-CONTRAST EDITORIAL + INTERACTIVE 3D STACK
          ========================================================================= */}
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full bg-radial-glow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0A2540] tracking-tight leading-[1.03] uppercase">
              AUTOMATE BID<br />
              COMPLIANCE.<br />
              DECIDE WITH<br />
              <span className="animate-shimmer-text">EVIDENCE.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-lg">
              Extract bidder documents. Cross-check statutory registries. Apply tender clauses. Give procurement officers an evidence-backed review before final sign-off.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={onEnterDemo}
                className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 font-mono uppercase tracking-wider group"
              >
                <span>EXPLORE EVALUATION</span>
                <ArrowRight className="w-4 h-4 text-teal-300 transition-transform group-hover:translate-x-1" />
              </button>
              
              <a
                href="#workspace"
                className="bg-white hover:bg-slate-50 text-[#0A2540] border border-slate-300 text-sm font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 font-mono uppercase tracking-wider"
              >
                <span>VIEW WORKSPACE</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs font-mono text-slate-500 flex items-center space-x-6">
              <div><strong className="text-[#0A2540] font-bold">8</strong> Registries Checked</div>
              <div><strong className="text-[#0A2540] font-bold">0%</strong> Hallucination Rules</div>
              <div><strong className="text-[#0A2540] font-bold">100%</strong> Officer Sovereign</div>
            </div>

          </div>

          {/* Right Hero Column: FAST SHUFFLING 3D BID INTELLIGENCE STACK */}
          <div className="lg:col-span-6 relative">
            <BidIntelligence3D onOpenEvaluation={onEnterDemo} />
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — THE EVALUATION WORKSPACE (CLEAN & SIMPLE)
          ========================================================================= */}
      <section id="workspace" className="py-14 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-1 text-left">
              <div className="text-xs font-mono font-bold tracking-widest text-[#0D9488] uppercase">
                ONE BID DOSSIER
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A2540] tracking-tight uppercase">
                THE EVALUATION WORKSPACE
              </h2>
            </div>

            {/* Hotspot Toggle Bar */}
            <div className="flex flex-wrap items-center gap-1.5">
              {hotspots.map((h) => {
                const isActive = activeHotspot === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setActiveHotspot(h.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#0A2540] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{h.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? 'bg-teal-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-700'}`}>
                      {h.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Large Dimensional Workspace Card */}
          <div className="bg-[#FAFAFA] rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm text-left space-y-6">
            
            {/* Active Tender Case Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] font-mono font-bold text-[#0D9488] uppercase">TENDER REF: GEM/2026/B/901248</span>
                </div>
                <h3 className="text-lg font-black text-[#0A2540] mt-0.5">
                  High-Performance Cloud Server Hardware Procurement
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xl font-black text-[#0A2540] font-mono">92.4%</div>
                  <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">
                    NEEDS REVIEW
                  </span>
                </div>
                <button
                  onClick={onEnterDemo}
                  className="bg-[#0A2540] hover:bg-[#1E40AF] text-white px-3.5 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                >
                  Live View →
                </button>
              </div>
            </div>

            {/* Interactive Bidder Profiles Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(biddersData).map(([key, b]) => {
                const isSelected = selectedBidder === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedBidder(key)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-white border-[#0A2540] shadow-sm ring-1 ring-[#0A2540]' 
                        : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0A2540]">{b.name}</span>
                      <span className="text-xs font-mono font-bold text-slate-900">{b.score}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                      <span>{b.gstin}</span>
                      <span className={`font-bold ${
                        b.statusColor === 'emerald' ? 'text-emerald-700' : b.statusColor === 'amber' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hotspot Context & Live Evaluation Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
              
              <div className="lg:col-span-5 space-y-3">
                <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-900 px-2.5 py-0.5 rounded text-xs font-mono font-bold">
                  <span>STAGE: {activeHotspotData.label}</span>
                </div>

                <h4 className="text-xl font-black text-[#0A2540]">
                  {activeHotspotData.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {activeHotspotData.description}
                </p>

                <div className="pt-1">
                  <button
                    onClick={onEnterDemo}
                    className="bg-[#0A2540] hover:bg-[#1E40AF] text-white px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Inspect In Sandbox</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[10px] text-slate-400 font-bold uppercase">
                  <span>PARAMETER / RECORD</span>
                  <span>RESULT</span>
                </div>

                {activeHotspotData.highlightData.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</div>
                      <div className="text-slate-900 font-bold text-xs mt-0.5">{item.val}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-300 text-[#0A2540]">
                      {item.conf}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — PROMINENT DARK NAVY PATCH: HOW IT WORKS (CRYSTAL CLEAR)
          ========================================================================= */}
      <section id="how-it-works" className="py-16 md:py-24 bg-[#0A2540] text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14">
          
          {/* Dark Navy Section Header */}
          <div className="max-w-3xl text-left space-y-3">
            <div className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase">
              THE 3-STEP INTELLIGENCE PROTOCOL
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-[1.05]">
              AI EXTRACTS. RULES VERIFY.<br />
              THE OFFICER DECIDES.
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              A transparent, 3-step pipeline designed for public procurement committees.
            </p>
          </div>

          {/* 3 Clear Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Step 1 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold font-mono">
                01
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Document Ingestion & OCR</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Upload multi-page PDFs. AI OCR extracts key financial turnover, GSTIN, PAN, and certificate dates in seconds with confidence scores.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-teal-300">
                ✓ 14 Structured Fields Extracted (98.6% Conf)
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Statutory Registry Checks</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Directly cross-checks extracted bidder credentials against 8 statutory government portals (GSTN, MCA21, CBDT, MSME Udyam, CPPP).
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400">
                ✓ 8 / 8 Active Statutory Registries Verified
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Evidence-Backed Decision</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Every discrepancy is linked to the exact document clause. Officers record official justifications in a permanent cryptographic audit trail.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300">
                ✓ Sovereign Human Adjudication & Audit Log
              </div>
            </div>

          </div>

          {/* Interactive Evidence Lineage Showcase */}
          <div className="bg-slate-900/95 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-2xl text-left space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-700 gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest block">
                  INTERACTIVE XAI EVIDENCE DIFF
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Finding: {currentCase.title}
                </h3>
              </div>

              {/* Case Switcher Tabs */}
              <div className="flex items-center space-x-2 font-mono text-xs">
                <button
                  onClick={() => setActiveCase('oem')}
                  className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    activeCase === 'oem' ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  OEM Mismatch
                </button>
                <button
                  onClick={() => setActiveCase('turnover')}
                  className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    activeCase === 'turnover' ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Turnover Check
                </button>
                <button
                  onClick={() => setActiveCase('mii')}
                  className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    activeCase === 'mii' ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Local Content
                </button>
              </div>
            </div>

            {/* 3-Column Connected Evidence Diff */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              
              {/* Evidence 1: Submitted Document */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>1. SUBMITTED DOCUMENT</span>
                </div>
                <div className="font-bold text-white text-xs">{currentCase.docTitle}</div>
                <div className="text-[10px] text-slate-500">{currentCase.docPage}</div>
                <div className="mt-2 text-slate-200 text-[11px] bg-slate-900 p-2.5 rounded border border-slate-800">
                  {currentCase.docSnippet}
                </div>
              </div>

              {/* Evidence 2: Verified Source */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. STATUTORY REGISTRY</span>
                </div>
                <div className="font-bold text-white text-xs">{currentCase.sourceTitle}</div>
                <div className="text-[10px] text-slate-500">National Registry API</div>
                <div className="mt-2 text-slate-200 text-[11px] bg-slate-900 p-2.5 rounded border border-slate-800">
                  {currentCase.sourceSnippet}
                </div>
              </div>

              {/* Evidence 3: Applicable Tender Rule */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                  <Scale className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3. TENDER RULE</span>
                </div>
                <div className="font-bold text-white text-xs">{currentCase.ruleCode}</div>
                <div className="text-[10px] text-slate-500">Mandatory Clause</div>
                <div className="mt-2 text-slate-200 text-[11px] bg-slate-900 p-2.5 rounded border border-slate-800">
                  {currentCase.ruleReq}
                </div>
              </div>

            </div>

            {/* Explanation & Action Footer */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-slate-300 text-xs font-normal">
                {currentCase.finding} <span className="text-teal-300 font-semibold">Officer Action:</span> {currentCase.officerRec}
              </p>
              <button
                onClick={onEnterDemo}
                className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-4 py-2 rounded font-mono text-xs transition-colors flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
              >
                <span>Inspect in Live Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — FAQS: "What evaluation teams ask us"
          ========================================================================= */}
      <section id="faqs" className="py-14 md:py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-left space-y-8">
          
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight font-sans">
              What evaluation teams ask us
            </h2>
          </div>

          {/* Minimalist Accordion List */}
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left py-1 group focus:outline-none cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-semibold text-[#0A2540] group-hover:text-blue-700 transition-colors pr-4 font-sans">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'transform rotate-180 text-[#0A2540]' : ''
                      }`} 
                    />
                  </button>

                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-48 opacity-100 mt-2.5 pb-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-sm text-slate-600 leading-relaxed font-normal font-sans">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — COMPACT FINAL CTA (DARK NAVY #0A2540)
          ========================================================================= */}
      <section className="py-16 md:py-20 bg-[#0A2540] text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6">
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            FROM UNSTRUCTURED BID<br />
            TO AUDIT-READY DECISION.
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto font-normal">
            Experience TenderIQ evaluate a complete bid in our interactive sandbox.
          </p>

          <div>
            <button
              onClick={onEnterDemo}
              className="bg-white hover:bg-slate-100 text-[#0A2540] font-black text-xs sm:text-sm px-8 py-4 rounded-xl shadow-xl transition-all inline-flex items-center space-x-2.5 uppercase font-mono tracking-wider focus:outline-none focus:ring-4 focus:ring-blue-400/30 cursor-pointer"
            >
              <span>LAUNCH EVALUATION</span>
              <ArrowRight className="w-4 h-4 text-[#0A2540]" />
            </button>
          </div>

        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-8 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#0A2540] text-sm font-sans">TenderIQ</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700">Verify. Analyze. Comply.</span>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            Enterprise Bid Compliance Verification · Sandbox Mode
          </div>

        </div>
      </footer>

    </div>
  );
}
