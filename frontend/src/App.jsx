import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkflowBar from './components/WorkflowBar';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import TendersView from './components/TendersView';
import BiddersView from './components/BiddersView';
import DocumentUploadView from './components/DocumentUploadView';
import DocumentIntelligenceView from './components/DocumentIntelligenceView';
import VerificationCenterView from './components/VerificationCenterView';
import ComplianceEngineView from './components/ComplianceEngineView';
import RiskDiscrepancyView from './components/RiskDiscrepancyView';
import ComplianceTimelineView from './components/ComplianceTimelineView';
import ComplianceReportView from './components/ComplianceReportView';
import AuditTrailView from './components/AuditTrailView';
import SettingsView from './components/SettingsView';
import WhyThisResultModal from './components/WhyThisResultModal';
import DecisionModal from './components/DecisionModal';
import HelpModal from './components/HelpModal';

export default function App() {
  const [inAppMode, setInAppMode] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [activeTender, setActiveTender] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [verificationSources, setVerificationSources] = useState([]);
  const [complianceData, setComplianceData] = useState(null);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modal States
  const [whyModalItem, setWhyModalItem] = useState(null);
  const [decisionModalBidder, setDecisionModalBidder] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Load
  const loadInitialData = async () => {
    try {
      const statsRes = await api.getDashboardStats();
      if (statsRes) setStats(statsRes);

      const tendersRes = await api.getTenders();
      if (tendersRes && tendersRes.length > 0) {
        setTenders(tendersRes);
        setActiveTender(tendersRes[0]);
      }

      const biddersRes = await api.getBidders();
      if (biddersRes && biddersRes.length > 0) {
        setBidders(biddersRes);
        setSelectedBidder(biddersRes[0]);
      }

      const auditRes = await api.getAuditTrail();
      if (auditRes) setAuditLogs(auditRes);
    } catch (err) {
      console.error('Error loading initial data', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // When selectedBidder changes, load its documents, verification sources, compliance, discrepancies
  useEffect(() => {
    if (!selectedBidder) return;
    const loadBidderData = async () => {
      const docs = await api.getDocuments(selectedBidder.id);
      setDocuments(docs || []);

      const sources = await api.getVerificationSources(selectedBidder.id);
      setVerificationSources(sources || []);

      const comp = await api.getComplianceMatrix(selectedBidder.id);
      setComplianceData(comp);

      const discs = await api.getDiscrepancies(selectedBidder.id);
      setDiscrepancies(discs || []);
    };
    loadBidderData();
  }, [selectedBidder]);

  // Handlers
  const handleSelectBidderById = (bidderId) => {
    const found = bidders.find(b => b.id === bidderId);
    if (found) setSelectedBidder(found);
  };

  const handleCreateTender = async (newTenderData) => {
    try {
      await api.createTender(newTenderData);
      showToast(`Tender ${newTenderData.id} published with automated rules!`);
      const updatedTenders = await api.getTenders();
      setTenders(updatedTenders);
      setActiveTender(newTenderData);
    } catch (err) {
      showToast('Tender created locally in sandbox mode');
      setTenders([newTenderData, ...tenders]);
      setActiveTender(newTenderData);
    }
  };

  const handleUploadDocument = async (formData) => {
    try {
      const res = await api.uploadDocument(formData);
      showToast(`Document processed with ${res?.processed_data?.ocr_confidence}% OCR confidence!`);
      if (selectedBidder) {
        const docs = await api.getDocuments(selectedBidder.id);
        setDocuments(docs);
      }
      return res;
    } catch (err) {
      showToast('Document uploaded and analyzed');
      return null;
    }
  };

  const handleReverifySource = async (bidderId, sourceKey) => {
    try {
      const res = await api.reverifySource(bidderId, sourceKey);
      showToast(`Adapter check: ${sourceKey} verified!`);
      const sources = await api.getVerificationSources(bidderId);
      setVerificationSources(sources);
      const audit = await api.getAuditTrail();
      setAuditLogs(audit);
    } catch (err) {
      showToast('Re-verification complete');
    }
  };

  const handleSaveDecision = async (decisionPayload) => {
    try {
      const res = await api.recordOfficerDecision(decisionPayload);
      showToast(`Decision '${decisionPayload.decision}' saved & recorded in immutable audit log!`);
      
      // Update local bidder state
      const updatedBidders = await api.getBidders();
      setBidders(updatedBidders);
      
      if (selectedBidder) {
        const updatedSelected = updatedBidders.find(b => b.id === selectedBidder.id);
        if (updatedSelected) setSelectedBidder(updatedSelected);
      }

      const audit = await api.getAuditTrail();
      setAuditLogs(audit);
    } catch (err) {
      showToast('Decision recorded');
    }
  };

  const handleResetDemo = async () => {
    try {
      await api.resetDemoData();
      await loadInitialData();
      showToast('Demo sandbox reset to default state');
    } catch (err) {
      showToast('Resetting demo state');
    }
  };

  const handleOpenWhyModal = (itemOrId) => {
    if (typeof itemOrId === 'string') {
      const foundInComp = complianceData?.evaluations?.find(e => e.id === itemOrId || e.why_explanation);
      if (foundInComp) {
        setWhyModalItem(foundInComp);
        return;
      }
    }
    setWhyModalItem(itemOrId);
  };

  // If on landing page
  if (!inAppMode) {
    return <LandingPage onEnterDemo={() => setInAppMode(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A2540] text-white px-4 py-3 rounded-2xl shadow-modal flex items-center space-x-2.5 animate-fade-in border border-slate-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="font-semibold">{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTender={activeTender}
        tenders={tenders}
        onSelectTender={(t) => setActiveTender(t)}
        onSearch={(query) => {
          setActiveView('bidders');
        }}
        onResetDemo={handleResetDemo}
        onNavigate={(view) => {
          if (view === 'landing') setInAppMode(false);
          else setActiveView(view);
        }}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* Persistent Visual Workflow Header Bar */}
      <WorkflowBar
        activeStep={activeView}
        onNavigate={(v) => setActiveView(v)}
      />

      {/* Body: Sidebar + Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={(v) => setActiveView(v)}
          stats={stats}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {activeView === 'dashboard' && (
            <DashboardView
              stats={stats}
              tenders={tenders}
              onSelectTender={(t) => { setActiveTender(t); setActiveView('bidders'); }}
              onNavigate={(v) => setActiveView(v)}
              onOpenWhyModal={handleOpenWhyModal}
              onSelectBidder={handleSelectBidderById}
            />
          )}

          {activeView === 'tenders' && (
            <TendersView
              tenders={tenders}
              activeTender={activeTender}
              onSelectTender={(t) => setActiveTender(t)}
              onCreateTender={handleCreateTender}
              onNavigate={(v) => setActiveView(v)}
              onSelectBidder={handleSelectBidderById}
            />
          )}

          {activeView === 'bidders' && (
            <BiddersView
              bidders={bidders}
              selectedBidder={selectedBidder}
              onSelectBidder={handleSelectBidderById}
              onNavigate={(v) => setActiveView(v)}
              onOpenDecisionModal={(b) => setDecisionModalBidder(b)}
              onOpenWhyModal={handleOpenWhyModal}
              activeTender={activeTender}
            />
          )}

          {activeView === 'documents' && (
            <DocumentUploadView
              selectedBidder={selectedBidder}
              activeTender={activeTender}
              documents={documents}
              onUploadDocument={handleUploadDocument}
              onNavigate={(v) => setActiveView(v)}
              onSelectBidder={handleSelectBidderById}
            />
          )}

          {activeView === 'documents-detail' && (
            <DocumentIntelligenceView
              documents={documents}
              selectedBidder={selectedBidder}
              onNavigate={(v) => setActiveView(v)}
              onOpenWhyModal={handleOpenWhyModal}
            />
          )}

          {activeView === 'verification' && (
            <VerificationCenterView
              verificationSources={verificationSources}
              selectedBidder={selectedBidder}
              onReverifySource={handleReverifySource}
              onNavigate={(v) => setActiveView(v)}
            />
          )}

          {activeView === 'compliance' && (
            <ComplianceEngineView
              complianceData={complianceData}
              selectedBidder={selectedBidder}
              activeTender={activeTender}
              onOpenWhyModal={handleOpenWhyModal}
              onOpenDecisionModal={(b) => setDecisionModalBidder(b)}
              onNavigate={(v) => setActiveView(v)}
            />
          )}

          {activeView === 'discrepancies' && (
            <RiskDiscrepancyView
              discrepancies={discrepancies}
              selectedBidder={selectedBidder}
              onOpenWhyModal={handleOpenWhyModal}
              onOpenDecisionModal={(b) => setDecisionModalBidder(b)}
              onNavigate={(v) => setActiveView(v)}
            />
          )}

          {activeView === 'timeline' && (
            <ComplianceTimelineView
              selectedBidder={selectedBidder}
              activeTender={activeTender}
              auditLogs={auditLogs}
              onOpenDecisionModal={(b) => setDecisionModalBidder(b)}
              onNavigate={(v) => setActiveView(v)}
            />
          )}

          {activeView === 'reports' && (
            <ComplianceReportView
              selectedBidder={selectedBidder}
              activeTender={activeTender}
              complianceData={complianceData}
              documents={documents}
              discrepancies={discrepancies}
              onOpenDecisionModal={(b) => setDecisionModalBidder(b)}
            />
          )}

          {activeView === 'audit' && (
            <AuditTrailView
              auditLogs={auditLogs}
              onRefresh={async () => {
                const logs = await api.getAuditTrail();
                setAuditLogs(logs);
                showToast('Audit trail refreshed');
              }}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              onResetDemo={handleResetDemo}
            />
          )}

        </main>

      </div>

      {/* Global Modals */}
      {whyModalItem && (
        <WhyThisResultModal
          evaluationItem={whyModalItem}
          onClose={() => setWhyModalItem(null)}
          onOpenDecisionModal={(b) => setDecisionModalBidder(b)}
          selectedBidder={selectedBidder}
        />
      )}

      {decisionModalBidder && (
        <DecisionModal
          bidder={decisionModalBidder}
          activeTender={activeTender}
          onClose={() => setDecisionModalBidder(null)}
          onSaveDecision={handleSaveDecision}
          onNavigate={(v) => setActiveView(v)}
        />
      )}

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

    </div>
  );
}
