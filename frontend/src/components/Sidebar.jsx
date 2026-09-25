import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Users, 
  FileSearch, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  History, 
  Sliders,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeView, onNavigate, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'tenders', label: 'Tenders', icon: FileSpreadsheet, badge: stats?.active_tenders || '4' },
    { id: 'bidders', label: 'Bidders', icon: Users, badge: '4' },
    { id: 'documents', label: 'Document Verification', icon: FileSearch, badge: 'AI OCR' },
    { id: 'compliance', label: 'Compliance Engine', icon: ShieldCheck, badge: 'Rules' },
    { id: 'discrepancies', label: 'Risk & Discrepancies', icon: AlertTriangle, badge: stats?.high_risk_cases ? `${stats.high_risk_cases} High` : '2', badgeColor: 'bg-red-100 text-red-700' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'audit', label: 'Audit Trail', icon: History, badge: 'Immutable' },
    { id: 'settings', label: 'Settings', icon: Sliders, badge: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 no-print">
      
      {/* Top Nav List */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Evaluation Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-50/90 text-blue-900 font-semibold shadow-subtle border-l-4 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Procurement Workflow Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-subtle text-left">
          <div className="flex items-center space-x-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">AI Evaluation Flow</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2 leading-tight">
            End-to-end evidence-backed qualification pipeline.
          </p>
          <div className="space-y-1 text-[10px] font-medium text-slate-600">
            <div className="flex items-center text-emerald-700">
              <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-600" />
              <span>1. Multi-Doc OCR Extraction</span>
            </div>
            <div className="flex items-center text-emerald-700">
              <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-600" />
              <span>2. 8-Registry Cross Check</span>
            </div>
            <div className="flex items-center text-blue-700">
              <div className="w-3 h-3 rounded-full bg-blue-600 mr-1.5 flex items-center justify-center text-[8px] text-white">3</div>
              <span>3. Tender-Aware Rule Engine</span>
            </div>
            <div className="flex items-center text-slate-400">
              <div className="w-3 h-3 rounded-full border border-slate-300 mr-1.5 flex items-center justify-center text-[8px]">4</div>
              <span>4. Officer Final Decision</span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
