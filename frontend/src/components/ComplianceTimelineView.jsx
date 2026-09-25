import React from 'react';
import { 
  History, 
  UploadCloud, 
  Cpu, 
  SearchCheck, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function ComplianceTimelineView({ 
  selectedBidder, 
  activeTender, 
  auditLogs,
  onOpenDecisionModal,
  onNavigate 
}) {
  const timelineEvents = [
    {
      step: 1,
      title: 'Document Package Uploaded',
      actor: 'Procurement Officer',
      time: '2026-09-20 10:14:22 UTC',
      status: 'COMPLETED',
      icon: UploadCloud,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      desc: '6 Bid documents (GST REG-06, Udyam MSME, ITR-6, OEM Auth, MII Declaration, EPFO Challan) ingested.'
    },
    {
      step: 2,
      title: 'AI OCR & Document Layout Analysis',
      actor: 'TenderIQ OCR Engine',
      time: '2026-09-20 10:16:10 UTC',
      status: 'COMPLETED',
      icon: Cpu,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      desc: 'High-accuracy character and table layout recognition. Average field confidence: 97.4%.'
    },
    {
      step: 3,
      title: 'Key Information Extraction',
      actor: 'TenderIQ Extraction Model',
      time: '2026-09-20 10:18:40 UTC',
      status: 'COMPLETED',
      icon: FileText,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      desc: 'Extracted GSTIN 29ABCDE1234F1Z5, 3Y Avg Turnover ₹4.19 Cr, Class-I Local Content 64.5%, and 68 EPFO headcount.'
    },
    {
      step: 4,
      title: 'Statutory Registry Verification Completed',
      actor: 'TenderIQ Verification Bridge',
      time: '2026-09-21 08:30:12 UTC',
      status: 'COMPLETED',
      icon: SearchCheck,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      desc: 'Cross-checked against 8 government registries. GST active, Udyam valid, Income Tax compliant, Zero debarment records.'
    },
    {
      step: 5,
      title: 'Tender-Specific Rules Evaluated',
      actor: 'Compliance Rule Engine',
      time: '2026-09-21 08:31:00 UTC',
      status: 'COMPLETED',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      desc: 'Evaluated against 8 tender clauses. 6 Clauses Passed, 2 Clauses Flagged for review.'
    },
    {
      step: 6,
      title: 'Risk & Mismatches Identified',
      actor: 'Discrepancy Analyzer',
      time: '2026-09-21 08:31:45 UTC',
      status: 'FLAGGED',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      desc: 'Medium Risk: Trade name abbreviation delta ("ABC Technologies" vs "ABC Technology Private Limited") and OEM stamp clarity.'
    },
    {
      step: 7,
      title: 'Procurement Officer Review',
      actor: 'Procurement Officer (Admin)',
      time: '2026-09-21 09:15:00 UTC',
      status: 'IN_PROGRESS',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      desc: 'Officer inspected evidence-backed assessment report and evaluated discrepancy severity.'
    },
    {
      step: 8,
      title: 'Final Qualification Decision Recorded',
      actor: 'Procurement Officer',
      time: selectedBidder?.decision_timestamp ? new Date(selectedBidder.decision_timestamp).toUTCString() : 'Awaiting Sign-off',
      status: selectedBidder?.officer_decision !== 'Pending Review' ? 'RECORDED' : 'PENDING',
      icon: CheckCircle2,
      color: selectedBidder?.officer_decision !== 'Pending Review' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-400 bg-slate-50 border-slate-200',
      desc: selectedBidder?.officer_decision !== 'Pending Review' ? `Decision recorded as: ${selectedBidder.officer_decision}. Remarks: ${selectedBidder.decision_remarks}` : 'Procurement Officer has not yet finalized decision.'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">End-to-End Compliance Timeline</h1>
            <span className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded font-mono font-semibold">
              SIH Audit Workflow
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete sequential trail demonstrating the auditability and lifecycle of the bid verification.
          </p>
        </div>

        <button
          onClick={() => onOpenDecisionModal(selectedBidder)}
          className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <UserCheck className="w-4 h-4 text-teal-400" />
          <span>Final Officer Decision</span>
        </button>
      </div>

      {/* Visual Timeline Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 sm:p-8">
        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-8">
          
          {timelineEvents.map((event, idx) => {
            const Icon = event.icon;
            return (
              <div key={event.step} className="relative pl-6 sm:pl-8 group">
                
                {/* Timeline Node Dot */}
                <div className={`absolute -left-3.5 top-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-xs ${event.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Event Card */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 hover:bg-slate-50 transition-all text-xs space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        STEP {event.step}
                      </span>
                      <h3 className="text-sm font-bold text-[#0A2540]">{event.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {event.desc}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <span>Actor: <strong className="text-slate-800 font-sans">{event.actor}</strong></span>
                    <span className={`px-2 py-0.2 rounded font-bold font-mono text-[10px] ${
                      event.status === 'COMPLETED' || event.status === 'RECORDED' ? 'bg-emerald-100 text-emerald-800' :
                      event.status === 'FLAGGED' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}
