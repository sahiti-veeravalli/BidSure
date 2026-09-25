import React from 'react';
import { 
  FileSpreadsheet, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  FileSearch,
  Eye,
  Info
} from 'lucide-react';

export default function DashboardView({ 
  stats, 
  tenders, 
  onSelectTender, 
  onNavigate,
  onOpenWhyModal,
  onSelectBidder
}) {
  const kpis = [
    {
      label: 'Active Tenders',
      value: stats?.active_tenders || 4,
      desc: '3 Open on GeM Portal',
      icon: FileSpreadsheet,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      label: 'Bids Under Review',
      value: stats?.bids_under_review || 2,
      desc: 'Pending Officer Verification',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    {
      label: 'Verified Bids',
      value: stats?.verified_bids || 1,
      desc: 'Passing 100% Rules',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      label: 'Flagged Bids',
      value: stats?.flagged_bids || 1,
      desc: 'Discrepancies Detected',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    },
    {
      label: 'High-Risk Cases',
      value: stats?.high_risk_cases || 2,
      desc: 'Debarment or Tax Default',
      icon: ShieldAlert,
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540] tracking-tight">
              Good morning, Procurement Officer
            </h1>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              Demo Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Here's the current compliance overview across your active tenders.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('tenders')}
            className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <span>+ Create New Tender</span>
          </button>
          <button
            onClick={() => onNavigate('documents')}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5"
          >
            <FileSearch className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload Bid Docs</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Clearly labeled DEMO data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white p-4 rounded-xl border ${kpi.border} shadow-subtle hover:shadow-elevated transition-all text-left flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  {kpi.label}
                </span>
                <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0A2540] tracking-tight font-mono">
                  {kpi.value}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {kpi.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left (Active Tenders + Recent Activity) | Right (Compliance Overview + Risk Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Left Column (2 spans): Active Tenders */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section A: Active Tenders */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">
                  Active Tender Portfolios
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitor live bid submission volumes, compliance progress, and deadlines.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('tenders')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>View All Tenders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Tender ID & Title</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Deadline</th>
                    <th className="py-3 px-3 text-center">Bids</th>
                    <th className="py-3 px-4">AI Verification</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenders && tenders.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0A2540] group-hover:text-blue-600 font-mono text-[11px]">
                          {t.id}
                        </div>
                        <div className="text-xs text-slate-700 font-medium max-w-xs truncate mt-0.5">
                          {t.title}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <div className="max-w-[140px] truncate text-[11px]">
                          {t.department}
                        </div>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {t.submission_deadline ? t.submission_deadline.split('T')[0] : '2026-10-15'}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-800 font-mono">
                        {t.bidders_count || 4}
                      </td>
                      <td className="py-3.5 px-4 min-w-[130px]">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span>{t.verification_progress || 75}% Evaluated</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              (t.verification_progress || 75) > 80 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${t.verification_progress || 75}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            onSelectTender(t);
                            onNavigate('bidders');
                          }}
                          className="bg-slate-100 hover:bg-[#0A2540] hover:text-white text-slate-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-md transition-colors"
                        >
                          Evaluate Bids →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C: Recent Verification Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">
                  Live Verification Activity Stream
                </h2>
                <p className="text-xs text-slate-500">Real-time registry checks, document extractions, and rule evaluations.</p>
              </div>
              <button 
                onClick={() => onNavigate('audit')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Full Audit Trail →
              </button>
            </div>

            <div className="space-y-3">
              {stats?.recent_activity?.slice(0, 4).map((act, i) => (
                <div key={act.id || i} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5"></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{act.bidder_name || 'ABC Technologies'}</span>
                        <span className="text-[10px] text-slate-500 font-mono">[{act.verification_type || 'Statutory Check'}]</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{act.details || act.action}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {act.result || 'PASS'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:44 AM'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 span): Compliance Overview + Risk Alerts */}
        <div className="space-y-6">
          
          {/* Section B: Compliance Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5">
            <h2 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider mb-1">
              Compliance Distribution
            </h2>
            <p className="text-xs text-slate-500 mb-4">Overall bidder qualification statuses.</p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">Compliant</span>
                    <span className="text-[10px] text-emerald-700">Nova Infra Solutions</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-extrabold text-emerald-800 bg-white px-2 py-1 rounded shadow-subtle">
                  1 Bid (25%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">Needs Review</span>
                    <span className="text-[10px] text-amber-700">ABC Technologies (Minor Mismatch)</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-extrabold text-amber-800 bg-white px-2 py-1 rounded shadow-subtle">
                  1 Bid (25%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div>
                    <span className="text-xs font-bold text-rose-950 block">Non-Compliant</span>
                    <span className="text-[10px] text-rose-700">Vertex Eng. (Turnover Shortfall)</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-extrabold text-rose-800 bg-white px-2 py-1 rounded shadow-subtle">
                  1 Bid (25%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <div>
                    <span className="text-xs font-bold text-red-950 block">High Risk</span>
                    <span className="text-[10px] text-red-700">Bharat Digital (State Debarred)</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-extrabold text-red-900 bg-white px-2 py-1 rounded shadow-subtle">
                  1 Bid (25%)
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigate('compliance')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center w-full"
              >
                <span>Explore Compliance Engine Matrix</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Section D: Priority Risk Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">
                  Critical Discrepancies
                </h2>
              </div>
              <span className="text-[10px] bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded">Action Needed</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-start justify-between">
                  <span className="font-bold text-slate-900">ABC Technologies</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">Medium Risk</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Legal name slight mismatch: "ABC Technologies Pvt Ltd" vs "ABC Technology Private Limited".
                </p>
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => onOpenWhyModal('COMP-ABC-06')}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <span>Why This Result?</span>
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                  <button 
                    onClick={() => { onSelectBidder('BID-ABC-01'); onNavigate('bidders'); }}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded hover:bg-slate-50 font-medium"
                  >
                    Inspect Profile
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-start justify-between">
                  <span className="font-bold text-slate-900">ABC Technologies</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">Medium Risk</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  OEM Authorization letter corporate ink seal impression clarity is indistinct (&lt; 85%).
                </p>
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => onOpenWhyModal('COMP-ABC-05')}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <span>Why This Result?</span>
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                  <button 
                    onClick={() => { onSelectBidder('BID-ABC-01'); onNavigate('documents'); }}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded hover:bg-slate-50 font-medium"
                  >
                    View Document
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigate('discrepancies')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800"
              >
                View All Risk & Discrepancy Items →
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
