import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  FileSearch, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  FolderOpen,
  Eye
} from 'lucide-react';

export default function DocumentUploadView({ 
  selectedBidder, 
  activeTender, 
  documents, 
  onUploadDocument, 
  onNavigate,
  onSelectBidder
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('GST Certificate (Form REG-06)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0); // 1 to 6
  const [lastUploadedResult, setLastUploadedResult] = useState(null);

  const docPresets = [
    'GST Certificate (Form REG-06)',
    'Udyam MSME Certificate',
    'PAN & 3Y ITR Acknowledgement',
    'OEM Authorization (MAF)',
    'Make in India (MII) Declaration',
    'EPFO ECR / ESIC Challan',
    'CA Certified Turnover Certificate',
    'Non-Debarment & Solvency Affidavit'
  ];

  const processingSteps = [
    { step: 1, title: 'Document Uploaded', desc: 'Binary file received and checksum validated' },
    { step: 2, title: 'OCR Processing', desc: 'Layout segmentation & optical character recognition' },
    { step: 3, title: 'Document Classification', desc: 'Classified into statutory/technical taxonomy' },
    { step: 4, title: 'Information Extraction', desc: 'Key-value pairs extracted with confidence scoring' },
    { step: 5, title: 'Synthetic Verification', desc: 'Cross-checked against national registry checksums' },
    { step: 6, title: 'Compliance Evaluation', desc: 'Tender-specific qualification rules triggered' },
  ];

  const handleSimulateUpload = async (presetName) => {
    const docName = presetName || selectedDocType;
    const mockFilename = `${docName.replace(/[^a-zA-Z0-9]/g, '_')}_2026.pdf`;

    setIsProcessing(true);
    setProcessingStage(1);

    // Simulate animated 6-step pipeline
    for (let s = 1; s <= 6; s++) {
      setProcessingStage(s);
      await new Promise(r => setTimeout(r, 450));
    }

    const formData = new FormData();
    const fakeBlob = new Blob(['Simulated Government Bid PDF Document Stream'], { type: 'application/pdf' });
    formData.append('file', fakeBlob, mockFilename);
    formData.append('doc_type', docName);
    formData.append('bidder_id', selectedBidder?.id || 'BID-ABC-01');
    formData.append('tender_id', activeTender?.id || 'GEM/2026/B/901248');

    const res = await onUploadDocument(formData);
    setLastUploadedResult(res?.processed_data || {
      doc_type: docName,
      file_name: mockFilename,
      ocr_confidence: 97.5,
      classification: 'Statutory / Verified Document',
      extracted_fields_list: [
        { field: 'Registration ID', value: '29ABCDE1234F1Z5', confidence: 99.2, status: 'MATCHED' },
        { field: 'Legal Name', value: selectedBidder?.legal_name || 'ABC Technology Private Limited', confidence: 98.4, status: 'MATCHED' },
        { field: 'Validity', value: 'Active / Perpetual', confidence: 99.0, status: 'MATCHED' }
      ]
    });

    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Bidder Document Ingestion & AI OCR</h1>
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-mono font-semibold">
              Bidder: {selectedBidder?.company_name || 'ABC Technologies Pvt. Ltd.'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload PDF/image bid documents to trigger the 6-stage AI extraction and verification pipeline.
          </p>
        </div>

        <button
          onClick={() => onNavigate('documents-detail')}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
        >
          <Eye className="w-4 h-4 text-blue-600" />
          <span>Inspect AI Extracted Fields</span>
        </button>
      </div>

      {/* Main Upload Area & Preset Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Drag & Drop Zone (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors shadow-subtle text-center">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A2540]">Upload Bid Documents</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  PDF, scanned JPG/PNG, or ZIP packages up to 25MB each.
                </p>
              </div>

              {/* Doc Type Selector */}
              <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <label className="block font-semibold text-slate-700 mb-1">Select Document Category:</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {docPresets.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulateUpload(selectedDocType)}
                  className="w-full sm:w-auto bg-[#0A2540] hover:bg-[#1E40AF] disabled:bg-slate-400 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                      <span>Running AI Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>Simulate Process & Extract</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 6-Stage Processing Stepper */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">
                  6-Stage Document Intelligence Pipeline
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {isProcessing ? `Step ${processingStage} of 6 in progress...` : 'Pipeline Ready'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {processingSteps.map((step) => {
                const isPassed = !isProcessing && lastUploadedResult ? true : processingStage > step.step;
                const isCurrent = isProcessing && processingStage === step.step;

                return (
                  <div
                    key={step.step}
                    className={`p-3 rounded-xl border transition-all ${
                      isPassed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : isCurrent
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 text-blue-950 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[11px]">
                        Step {step.step}
                      </span>
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs">{step.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{step.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Extraction Result Preview Banner */}
          {lastUploadedResult && (
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-subtle animate-fade-in">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase font-mono">
                    AI Extraction Successful
                  </span>
                  <h4 className="text-sm font-bold text-[#0A2540] mt-1">{lastUploadedResult.doc_type}</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    File: {lastUploadedResult.file_name} | OCR Confidence: {lastUploadedResult.ocr_confidence}%
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('documents-detail')}
                  className="bg-[#0A2540] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#1E40AF] flex items-center space-x-1"
                >
                  <span>View Split Intelligence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {lastUploadedResult.extracted_fields_list?.map((f, i) => (
                  <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{f.field}</span>
                    <span className="font-mono font-bold text-slate-900 block truncate">{f.value || f.pattern}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{f.confidence}% confidence</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Pre-loaded Documents Library */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
            <div className="flex items-center space-x-2 mb-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">
                Pre-Loaded Demo Documents
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Click any sample bid document to run automated extraction:
            </p>

            <div className="space-y-2">
              {docPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulateUpload(preset)}
                  disabled={isProcessing}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-xs flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                    <span className="font-semibold text-slate-800 group-hover:text-blue-900 truncate">
                      {preset}
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-800 px-1.5 py-0.5 rounded font-mono flex-shrink-0 ml-1">
                    Process →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs space-y-2 text-blue-950">
            <div className="font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>SIH 2026 Document Processing</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              TenderIQ utilizes OCR layout analysis to extract structured metadata from complex government forms (REG-06, UAM, ITR-V) and cross-verifies fields against registered databases with zero manual data entry.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
