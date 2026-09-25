import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  ChevronDown,
  Info,
  ExternalLink
} from 'lucide-react';

export default function Header({ 
  activeTender, 
  tenders, 
  onSelectTender, 
  onSearch, 
  onResetDemo,
  onNavigate,
  onOpenHelp
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTenderDropdown, setShowTenderDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Discrepancy Flagged: ABC Technologies',
      time: '12 mins ago',
      type: 'warning',
      desc: 'Legal entity name variation detected between GST REG-06 and MCA record.'
    },
    {
      id: 2,
      title: 'Debarment Alert: Bharat Digital',
      time: '1 hour ago',
      type: 'danger',
      desc: 'Active warning record detected on state procurement incident database.'
    },
    {
      id: 3,
      title: 'Verification Complete: Nova Infra',
      time: '3 hours ago',
      type: 'success',
      desc: 'All 8 statutory registries verified with 98% compliance score.'
    }
  ];

  const handleReset = async () => {
    setIsResetting(true);
    await onResetDemo();
    setTimeout(() => setIsResetting(false), 600);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-subtle no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0A2540] to-[#1E40AF] flex items-center justify-center shadow-sm text-white transition-transform group-hover:scale-105">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-xl font-bold tracking-tight text-[#0A2540]">Tender</span>
                  <span className="text-xl font-bold tracking-tight text-[#0D9488] ml-0.5">IQ</span>
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                    SIH 2026
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium -mt-0.5">Verify. Analyze. Comply.</p>
              </div>
            </button>

            {/* Active Tender Selector Pill */}
            {tenders && tenders.length > 0 && (
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowTenderDropdown(!showTenderDropdown)}
                  className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium transition-colors"
                >
                  <span className="text-slate-500">Tender:</span>
                  <span className="font-semibold text-slate-900 max-w-[200px] truncate">
                    {activeTender ? activeTender.id : 'Select Tender'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showTenderDropdown && (
                  <div className="absolute left-0 mt-1 w-80 bg-white rounded-lg shadow-elevated border border-slate-200 py-1.5 z-50 animate-fade-in">
                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Switch Active Tender
                    </div>
                    {tenders.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTender(t);
                          setShowTenderDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-start justify-between ${
                          activeTender && activeTender.id === t.id ? 'bg-blue-50/70 text-blue-900 font-medium' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold">{t.id}</div>
                          <div className="text-[11px] text-slate-500 truncate">{t.title}</div>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          {t.bidders_count || 4} bids
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tender ID, bidder name, GSTIN, PAN or rule clause..."
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-900 pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </form>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Demo Mode Badge with Quick Reset */}
            <div className="flex items-center bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1.5"></span>
              <span>DEMO SANDBOX</span>
              <button
                onClick={handleReset}
                title="Reset database to default seed data"
                className="ml-2 text-amber-700 hover:text-amber-900 focus:outline-none"
              >
                <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative focus:outline-none transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-modal border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Procurement Alerts</span>
                    <span className="text-[10px] bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">3 New</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer text-left" onClick={() => { setShowNotifications(false); onNavigate('compliance'); }}>
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pt-2 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => { setShowNotifications(false); onNavigate('discrepancies'); }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      View All Discrepancy Alerts →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help / Guide */}
            <button
              onClick={onOpenHelp}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg focus:outline-none transition-colors"
              title="TenderIQ Documentation & Methodology"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Officer Profile Badge */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 hover:bg-slate-100 rounded-lg text-left focus:outline-none transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  PO
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">Procurement Officer</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Senior GeM Evaluator</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-modal border border-slate-200 p-2 z-50 animate-fade-in text-left">
                  <div className="p-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">Dr. Rajesh Kumar, IAS</div>
                    <div className="text-[11px] text-slate-500">Director of Procurement Evaluation</div>
                    <div className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded mt-1.5 inline-block font-mono">
                      Role: Procurement Officer (Level-3)
                    </div>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setShowProfileMenu(false); onNavigate('settings'); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded"
                    >
                      Evaluation Rules & Preferences
                    </button>
                    <button 
                      onClick={() => { setShowProfileMenu(false); onNavigate('audit'); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded"
                    >
                      My Digital Signature Log
                    </button>
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button 
                      onClick={() => { setShowProfileMenu(false); onNavigate('landing'); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded font-medium"
                    >
                      Exit Demo Session
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
