import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  RefreshCw,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function AuditTrailView({ auditLogs, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('ALL');

  const filteredLogs = auditLogs?.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.bidder_name && log.bidder_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.id && log.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesUser = userFilter === 'ALL' || log.user_role?.includes(userFilter) || log.user_name?.includes(userFilter);
    return matchesSearch && matchesUser;
  }) || [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Immutable Audit Trail</h1>
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-mono font-semibold flex items-center space-x-1">
              <Lock className="w-3 h-3 text-teal-600" />
              <span>Tamper-Evident Ledger</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological, cryptographically verifiable log of all document uploads, registry checks, rule triggers, and officer decisions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh Log</span>
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
            placeholder="Search action, bidder, result or hash..."
            className="w-full bg-slate-50 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-slate-500 text-[11px] font-medium">Actor Filter:</span>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Actors</option>
            <option value="Procurement Officer">Procurement Officers</option>
            <option value="TenderIQ">TenderIQ AI / Automation</option>
            <option value="Bridge">Registry Adapters</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Timestamp & Event ID</th>
                <th className="py-3.5 px-3">Actor / Authority</th>
                <th className="py-3.5 px-3">Action Description</th>
                <th className="py-3.5 px-3">Target Bidder / Tender</th>
                <th className="py-3.5 px-3">Verification Module</th>
                <th className="py-3.5 px-3">Outcome Result</th>
                <th className="py-3.5 px-4">Audit Details & Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Timestamp & ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-slate-900 font-semibold block text-[11px]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '10:42 AM'}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 block">
                      {log.id || `AUD-${1000 + idx}`}
                    </span>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-bold text-[#0A2540] text-xs block">
                      {log.user_name}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {log.user_role}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 max-w-xs">
                    <span className="font-semibold text-slate-800 text-xs block">
                      {log.action}
                    </span>
                  </td>

                  {/* Bidder / Tender */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-bold text-slate-900 text-xs block">
                      {log.bidder_name || 'ABC Technologies'}
                    </span>
                    <span className="font-mono text-[10px] text-blue-600 block">
                      {log.tender_id || 'GEM/2026/B/901248'}
                    </span>
                  </td>

                  {/* Module */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                      {log.verification_type || 'Statutory'}
                    </span>
                  </td>

                  {/* Result */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] font-mono ${
                      log.result?.includes('PASS') || log.result?.includes('ACTIVE') || log.result?.includes('Qualified') || log.result?.includes('CLEAN')
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.result?.includes('Review') || log.result?.includes('Discrepancy')
                        ? 'bg-amber-100 text-amber-800'
                        : log.result?.includes('Disqualified') || log.result?.includes('DEBARRED')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-50 text-blue-800'
                    }`}>
                      {log.result || 'PROCESSED'}
                    </span>
                  </td>

                  {/* Details & IP Hash */}
                  <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-xs">
                    <p className="line-clamp-2">{log.details}</p>
                    <span className="font-mono text-[9px] text-slate-400 block mt-0.5">
                      Origin: {log.ip_hash || '192.168.1.42 [GeM Secured Network]'}
                    </span>
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
