import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileSearch, 
  FileText, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  ExternalLink,
  Sliders,
  Scale,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';

export default function BiddersView({ 
  bidders, 
  selectedBidder, 
  onSelectBidder, 
  onNavigate,
  onOpenDecisionModal,
  onOpenWhyModal,
  activeTender
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Compliant':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified / Compliant</span>
          </span>
        );
      case 'Needs Review':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Needs Review</span>
          </span>
        );
      case 'Non-Compliant':
      case 'High Risk':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-1"></span>
            <span>Processing</span>
          </span>
        );
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'LOW':
        return <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">LOW RISK</span>;
      case 'MEDIUM':
        return <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">HIGH RISK</span>;
      case 'CRITICAL':
        return <span className="text-[11px] font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">CRITICAL RISK</span>;
      default:
        return <span className="text-[11px] text-slate-500 font-mono">N/A</span>;
    }
  };

  const filteredBidders = bidders?.filter((b) => {
    const matchesSearch = b.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.compliance_status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Bidder Review & Profile Evaluation</h1>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-semibold">
              Tender: {activeTender?.id || 'GEM/2026/B/901248'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted bids, cross-check statutory registry statuses, identify discrepancies, and record qualification decisions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('documents')}
            className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <FileSearch className="w-4 h-4 text-teal-400" />
            <span>+ Upload Bidder Documents</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-subtle text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, GSTIN, PAN or Bid ID..."
            className="w-full bg-slate-50 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-slate-500 text-[11px] font-medium">Compliance Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Compliant">Compliant / Verified</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Non-Compliant">Non-Compliant</option>
            <option value="High Risk">High Risk</option>
          </select>
        </div>
      </div>

      {/* Bidders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBidders.map((bidder) => {
          const isSelected = selectedBidder && selectedBidder.id === bidder.id;
          return (
            <div
              key={bidder.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-subtle hover:shadow-elevated text-left ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              
              {/* Header: Company Name + Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {bidder.id}
                    </span>
                    {getRiskBadge(bidder.risk_level)}
                  </div>
                  <h3 className="text-base font-bold text-[#0A2540] mt-1.5 leading-tight">
                    {bidder.company_name}
                  </h3>
                  <p className="text-[11px] text-slate-500">Legal: {bidder.legal_name}</p>
                </div>
                <div>{getStatusBadge(bidder.compliance_status)}</div>
              </div>

              {/* Statutory Registries Checklist Matrix */}
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 my-3 text-[11px] space-y-1.5">
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GSTIN:</span>
                    <span className="font-mono font-semibold text-slate-800">{bidder.gstin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">PAN:</span>
                    <span className="font-mono font-semibold text-slate-800">{bidder.pan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Udyam:</span>
                    <span className="font-mono font-semibold text-slate-800 truncate max-w-[110px]">{bidder.udyam_number || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">MCA CIN:</span>
                    <span className="font-mono font-semibold text-slate-800 truncate max-w-[110px]">{bidder.cin || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Compliance Score Gauge & Officer Decision */}
              <div className="flex items-center justify-between py-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Compliance Score
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-xl font-extrabold font-mono ${
                      bidder.overall_score >= 90 ? 'text-emerald-600' :
                      bidder.overall_score >= 70 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {bidder.overall_score}
                    </span>
                    <span className="text-[11px] text-slate-400">/ 100 (Demo Score)</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Officer Decision
                  </span>
                  <span className={`font-semibold text-xs ${
                    bidder.officer_decision === 'Qualified' ? 'text-emerald-700' :
                    bidder.officer_decision === 'Disqualified' ? 'text-rose-700' : 'text-amber-700'
                  }`}>
                    {bidder.officer_decision || 'Pending Review'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                <button
                  onClick={() => {
                    onSelectBidder(bidder.id);
                    onNavigate('documents');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2 rounded-lg font-semibold text-center transition-colors flex items-center justify-center space-x-1"
                >
                  <FileSearch className="w-3.5 h-3.5 text-slate-500" />
                  <span>Docs</span>
                </button>
                <button
                  onClick={() => {
                    onSelectBidder(bidder.id);
                    onNavigate('compliance');
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-800 py-1.5 px-2 rounded-lg font-semibold text-center transition-colors flex items-center justify-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Rules</span>
                </button>
                <button
                  onClick={() => {
                    onSelectBidder(bidder.id);
                    onOpenDecisionModal(bidder);
                  }}
                  className="bg-[#0A2540] hover:bg-[#1E40AF] text-white py-1.5 px-2 rounded-lg font-semibold text-center transition-colors flex items-center justify-center space-x-1"
                >
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Decide</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
