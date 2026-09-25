import React, { useState } from 'react';
import { 
  Sliders, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Cpu, 
  Layers, 
  Database,
  Sparkles,
  Info
} from 'lucide-react';

export default function SettingsView({ onResetDemo }) {
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [enablePkiVerification, setEnablePkiVerification] = useState(true);
  const [enableMiiCrossCheck, setEnableMiiCrossCheck] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleReset = async () => {
    setIsResetting(true);
    await onResetDemo();
    setIsResetting(false);
    setSuccessMessage('Demo sandbox reset to default SIH 2026 seed state successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Evaluation Sandbox & Adapter Settings</h1>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
              SIH 2026 Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure AI extraction thresholds, verification adapters, and test synthetic evaluation scenarios.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={isResetting}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting DB...' : 'Reset Demo Seed Data'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid: Adapter Health + Sandbox Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: AI Engine Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">
              AI Document Intelligence Parameters
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1.5">
                <span>OCR Confidence Flagging Threshold:</span>
                <span className="font-mono text-blue-700 font-bold">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Fields extracted with OCR confidence below {confidenceThreshold}% are automatically routed to the Procurement Officer for visual stamp/signature review.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">DigiLocker PKI Digital Signature Validation</span>
                  <span className="text-[11px] text-slate-500">Cryptographically verify certificate public keys and digital hashes.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enablePkiVerification}
                  onChange={(e) => setEnablePkiVerification(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">DPIIT Make in India Value Addition Engine</span>
                  <span className="text-[11px] text-slate-500">Verify Class-I Local Content percentage against domestic sub-component ledgers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableMiiCrossCheck}
                  onChange={(e) => setEnableMiiCrossCheck(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Registry Adapter Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Server className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">
              Verification Adapters Connectivity (Modular)
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { name: 'GST Common Portal (GSTN Sandbox)', status: 'ONLINE', latency: '42ms', mock: true },
              { name: 'Ministry of MSME (Udyam National API)', status: 'ONLINE', latency: '38ms', mock: true },
              { name: 'Income Tax Department (CBDT e-Filing)', status: 'ONLINE', latency: '55ms', mock: true },
              { name: 'Ministry of Corporate Affairs (MCA21 V3)', status: 'ONLINE', latency: '61ms', mock: true },
              { name: 'EPFO & ESIC Shram Suvidha Hub', status: 'ONLINE', latency: '48ms', mock: true },
              { name: 'GeM Debarment & Incident Register', status: 'ONLINE', latency: '29ms', mock: true },
            ].map((adapter, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-800">{adapter.name}</span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-[10px]">
                  <span className="text-slate-400">{adapter.latency}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    {adapter.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-[11px] text-blue-900 leading-tight">
            <strong>Integration Architecture:</strong> Adapters inherit from <code className="font-mono bg-white px-1 rounded">BaseVerificationAdapter</code>. To connect to live authorized government gateways, configure the endpoint URL and API Key in the adapter module without altering compliance rules.
          </div>
        </div>

      </div>

    </div>
  );
}
