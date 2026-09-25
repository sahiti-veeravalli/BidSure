import React from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Cpu, 
  FileCheck2, 
  SearchCheck, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function WorkflowBar({ activeStep = 'dashboard', onNavigate }) {
  const steps = [
    { id: 'tenders', label: '1. Tender Selection', icon: FileSpreadsheet },
    { id: 'documents', label: '2. Document Upload', icon: UploadCloud },
    { id: 'intelligence', label: '3. AI OCR & Extract', icon: Cpu },
    { id: 'verification', label: '4. Registry Verification', icon: SearchCheck },
    { id: 'compliance', label: '5. Rule Evaluation', icon: ShieldCheck },
    { id: 'discrepancies', label: '6. Risk & Discrepancies', icon: AlertTriangle },
    { id: 'reports', label: '7. Compliance Report', icon: FileText },
    { id: 'decision', label: '8. Officer Decision', icon: UserCheck },
  ];

  const getStepStatus = (stepId) => {
    const viewMap = {
      'dashboard': 0,
      'tenders': 1,
      'documents': 2,
      'intelligence': 3,
      'verification': 4,
      'compliance': 5,
      'discrepancies': 6,
      'reports': 7,
      'decision': 8,
    };
    const currentIdx = viewMap[activeStep] || 0;
    const thisIdx = viewMap[stepId] || 0;

    if (thisIdx < currentIdx) return 'completed';
    if (thisIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 shadow-sm no-print overflow-x-auto">
      <div className="flex items-center justify-between min-w-[840px] text-xs">
        <div className="flex items-center space-x-1 font-semibold text-slate-500 uppercase tracking-wider text-[10px] mr-2 flex-shrink-0">
          <span>Pipeline:</span>
        </div>
        
        <div className="flex items-center justify-between flex-1 space-x-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const status = getStepStatus(step.id);

            let pillStyle = 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100';
            let iconStyle = 'text-slate-400';

            if (status === 'completed') {
              pillStyle = 'text-emerald-800 bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100';
              iconStyle = 'text-emerald-600';
            } else if (status === 'active') {
              pillStyle = 'text-blue-900 bg-blue-50 border-blue-300 ring-1 ring-blue-500/20 font-bold';
              iconStyle = 'text-blue-600';
            }

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => onNavigate(step.id === 'intelligence' ? 'documents' : step.id === 'decision' ? 'bidders' : step.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md border text-[11px] font-medium transition-all ${pillStyle} flex-shrink-0`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${iconStyle}`} />
                  )}
                  <span>{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
