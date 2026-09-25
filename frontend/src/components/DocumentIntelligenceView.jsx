import React, { useState } from 'react';
import { 
  Cpu, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Eye,
  Info,
  Layers,
  Code
} from 'lucide-react';

export default function DocumentIntelligenceView({ 
  documents, 
  selectedBidder, 
  onNavigate,
  onOpenWhyModal 
}) {
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [viewMode, setViewMode] = useState('fields'); // 'fields' or 'raw_json'

  const activeDoc = documents && documents.length > 0 ? documents[activeDocIndex] : null;

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">AI Document Intelligence & OCR Extraction</h1>
            <span className="text-xs bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-mono font-semibold">
              Simulated OCR Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deep inspection of key-value pairs, optical recognition confidence scores, and visual certificate layout regions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('verification')}
            className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <span>Proceed to Verification Center</span>
            <ChevronRight className="w-4 h-4 text-teal-400" />
          </button>
        </div>
      </div>

      {/* Document Selector Pills */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-subtle flex items-center space-x-2 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-2 pr-1 flex-shrink-0">
          Documents ({documents?.length || 0}):
        </span>
        {documents && documents.map((doc, idx) => (
          <button
            key={doc.id || idx}
            onClick={() => setActiveDocIndex(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 flex-shrink-0 ${
              activeDocIndex === idx
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>{doc.doc_type}</span>
            <span className="text-[10px] bg-slate-800 text-slate-200 px-1.5 py-0.2 rounded font-mono">
              {doc.ocr_confidence}%
            </span>
          </button>
        ))}
      </div>

      {activeDoc ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (5 spans): Simulated Document Preview with Highlight Bounding Boxes */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Document Visual Layout</span>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-mono font-semibold px-2 py-0.5 rounded">
                  Bounding Box OCR Mode
                </span>
              </div>

              {/* Simulated Government Certificate Paper Layout */}
              <div className="bg-[#FAF9F5] border border-amber-200/80 rounded-xl p-5 font-mono text-[11px] text-slate-800 shadow-inner relative overflow-hidden space-y-3 min-h-[480px]">
                
                {/* Emblem & Watermark */}
                <div className="text-center border-b border-amber-200 pb-3">
                  <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    GOVERNMENT OF INDIA
                  </div>
                  <div className="text-xs font-bold text-[#0A2540] mt-0.5">
                    {activeDoc.doc_type}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Form Reference: REG-06 / MSME / CBDT Statutory Output
                  </div>
                </div>

                {/* Highlighted Bounding Box 1: Registration ID */}
                <div className="p-2.5 rounded-lg border-2 border-dashed border-blue-500 bg-blue-50/60 relative group">
                  <span className="absolute -top-2 left-2 bg-blue-600 text-white text-[9px] font-sans px-1.5 py-0.2 rounded font-semibold">
                    Extracted Identifier (99.4% conf)
                  </span>
                  <div className="text-slate-500 text-[10px] mt-1">Registration / GSTIN / Udyam No:</div>
                  <div className="font-bold text-xs text-blue-900">
                    {activeDoc.extracted_data?.gstin || activeDoc.extracted_data?.udyam_reg_number || activeDoc.extracted_data?.pan || '29ABCDE1234F1Z5'}
                  </div>
                </div>

                {/* Highlighted Bounding Box 2: Legal Name */}
                <div className="p-2.5 rounded-lg border-2 border-dashed border-teal-500 bg-teal-50/60 relative group">
                  <span className="absolute -top-2 left-2 bg-teal-600 text-white text-[9px] font-sans px-1.5 py-0.2 rounded font-semibold">
                    Legal Name Field (98.1% conf)
                  </span>
                  <div className="text-slate-500 text-[10px] mt-1">Legal Name of Business:</div>
                  <div className="font-bold text-xs text-teal-950">
                    {activeDoc.extracted_data?.legal_name || activeDoc.extracted_data?.name_of_enterprise || 'ABC Technology Private Limited'}
                  </div>
                </div>

                {/* Highlighted Bounding Box 3: Address & Dates */}
                <div className="p-2.5 rounded-lg border-2 border-dashed border-indigo-400 bg-indigo-50/40 relative">
                  <span className="absolute -top-2 left-2 bg-indigo-600 text-white text-[9px] font-sans px-1.5 py-0.2 rounded font-semibold">
                    Address & Jurisdiction
                  </span>
                  <div className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                    {activeDoc.extracted_data?.principal_place_of_business || activeDoc.extracted_data?.location_of_local_value_addition || 'Plot 42, Electronics City Phase 1, Bengaluru, Karnataka - 560100'}
                  </div>
                </div>

                {/* Highlighted Bounding Box 4: Digital Signature / Seal */}
                <div className="p-2.5 rounded-lg border-2 border-dashed border-emerald-500 bg-emerald-50/50 relative">
                  <span className="absolute -top-2 left-2 bg-emerald-600 text-white text-[9px] font-sans px-1.5 py-0.2 rounded font-semibold">
                    Digital Signature / QR Verified
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-slate-600">PKI Authenticated Checksum:</span>
                    <span className="font-bold text-emerald-800">VALID HASH</span>
                  </div>
                </div>

              </div>

              <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between">
                <span>File: {activeDoc.file_name}</span>
                <span className="font-mono text-slate-700 font-semibold">{activeDoc.file_size_kb || 348} KB</span>
              </div>
            </div>
          </div>

          {/* Right Column (7 spans): Extracted Structured Fields & Confidence Score Cards */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">
                      Extracted Fields & Verification Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deterministic extraction matching tender requirement schemas.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('fields')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      viewMode === 'fields' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Field View
                  </button>
                  <button
                    onClick={() => setViewMode('raw_json')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      viewMode === 'raw_json' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    JSON Payload
                  </button>
                </div>
              </div>

              {/* Confidence Metric Banner */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    Mean Extraction Confidence
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#0A2540] font-mono">
                      {activeDoc.ocr_confidence}%
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      High Confidence
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    Document Taxonomy
                  </span>
                  <span className="text-xs font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 mt-0.5 inline-block">
                    {activeDoc.classification}
                  </span>
                </div>
              </div>

              {/* Extracted Fields Table */}
              {viewMode === 'fields' ? (
                <div className="space-y-2.5">
                  {activeDoc.extracted_fields_list && activeDoc.extracted_fields_list.map((field, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {field.field}
                        </span>
                        <span className="font-mono font-bold text-slate-900 text-xs block">
                          {field.value || field.pattern}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-right">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Confidence</span>
                          <span className="font-mono font-bold text-blue-700 text-xs">{field.confidence}%</span>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded font-semibold ${
                          field.status === 'MATCHED' || field.status === 'PASS' || field.status?.includes('PASS')
                            ? 'bg-emerald-100 text-emerald-800'
                            : field.status === 'REVIEW_FLAG' || field.status === 'MINOR_NAME_DELTA'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {field.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="bg-slate-900 text-teal-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-80 border border-slate-800">
                  {JSON.stringify(activeDoc.extracted_data, null, 2)}
                </pre>
              )}

              {/* Notice */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Verification State: <strong className="text-emerald-700">Validated against GSTN/MSME Checksum</strong></span>
                <button
                  onClick={() => onNavigate('compliance')}
                  className="font-bold text-blue-600 hover:text-blue-800"
                >
                  View Rule Evaluation →
                </button>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
          No documents uploaded yet. Click Upload Bid Docs to begin.
        </div>
      )}

    </div>
  );
}
