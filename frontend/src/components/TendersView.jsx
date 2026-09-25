import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  Tag, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Trash2, 
  PlusCircle, 
  FileText,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';

export default function TendersView({ 
  tenders, 
  activeTender, 
  onSelectTender, 
  onCreateTender, 
  onNavigate,
  onSelectBidder
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTenderDetail, setSelectedTenderDetail] = useState(null);

  // New Tender Form State
  const [newTender, setNewTender] = useState({
    id: `GEM/2026/B/${Math.floor(100000 + Math.random() * 900000)}`,
    title: '',
    department: 'Ministry of Electronics & Information Technology (MeitY)',
    category: 'Goods / IT Hardware',
    estimated_value: 35000000,
    submission_deadline: '2026-11-15T17:00:00Z',
    description: '',
    eligibility_requirements: [
      'Bidder must have valid GST registration with active filing status',
      'Bidder must have valid Udyam MSME registration',
      'Minimum average annual financial turnover of ₹2.50 Cr',
      'Make in India (MII) Class-I local content minimum 50%'
    ],
    required_documents: [
      'GST Registration Certificate (Form REG-06)',
      'Udyam MSME Registration Certificate',
      'PAN Card & 3 Years ITR Acknowledgement',
      'OEM Authorization Certificate & Undertaking',
      'Make in India (Class-I) Self-Declaration Certificate'
    ],
    rules: [
      { rule_id: 'RUL-GST-01', name: 'GST Active Status', field: 'gstin_status', operator: 'EQUALS', value: 'ACTIVE', mandatory: true, weight: 20 },
      { rule_id: 'RUL-UDY-02', name: 'Udyam Registration', field: 'udyam_status', operator: 'EQUALS', value: 'ACTIVE', mandatory: true, weight: 20 },
      { rule_id: 'RUL-TUR-03', name: 'Minimum Annual Turnover', field: 'turnover_cr', operator: 'GREATER_THAN_OR_EQUAL', value: 2.5, mandatory: true, weight: 30 },
      { rule_id: 'RUL-MII-04', name: 'Make in India Local Content', field: 'local_content_pct', operator: 'GREATER_THAN_OR_EQUAL', value: 50, mandatory: true, weight: 30 }
    ]
  });

  const [newRequirementText, setNewRequirementText] = useState('');
  const [newDocText, setNewDocText] = useState('');
  const [newCustomRule, setNewCustomRule] = useState({
    name: 'Debarment Clearance',
    field: 'is_blacklisted',
    operator: 'EQUALS',
    value: 'False',
    mandatory: true,
    weight: 15
  });

  const handleAddRequirement = () => {
    if (!newRequirementText.trim()) return;
    setNewTender({
      ...newTender,
      eligibility_requirements: [...newTender.eligibility_requirements, newRequirementText.trim()]
    });
    setNewRequirementText('');
  };

  const handleAddDoc = () => {
    if (!newDocText.trim()) return;
    setNewTender({
      ...newTender,
      required_documents: [...newTender.required_documents, newDocText.trim()]
    });
    setNewDocText('');
  };

  const handleAddRule = () => {
    if (!newCustomRule.name.trim()) return;
    const ruleObj = {
      rule_id: `RUL-CUST-${newTender.rules.length + 1}`,
      name: newCustomRule.name,
      field: newCustomRule.field,
      operator: newCustomRule.operator,
      value: newCustomRule.value,
      mandatory: newCustomRule.mandatory,
      weight: Number(newCustomRule.weight) || 15
    };
    setNewTender({
      ...newTender,
      rules: [...newTender.rules, ruleObj]
    });
  };

  const handleRemoveRule = (index) => {
    const updated = [...newTender.rules];
    updated.splice(index, 1);
    setNewTender({ ...newTender, rules: updated });
  };

  const handleSubmitTender = async (e) => {
    e.preventDefault();
    if (!newTender.title.trim()) {
      alert('Please enter a tender title');
      return;
    }
    await onCreateTender(newTender);
    setShowCreateModal(false);
  };

  const filteredTenders = tenders?.filter((t) => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || t.department.includes(departmentFilter);
    return matchesSearch && matchesDept;
  }) || [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#0A2540]">Tender Management & Rule Configuration</h1>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
              {tenders?.length || 0} Total Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure tender requirements, eligibility parameters, document checklists, and automated compliance rules.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Create New Tender</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-subtle text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tender ID, keyword, or ministry..."
            className="w-full bg-slate-50 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-slate-500 text-[11px] font-medium">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Electronics">Ministry of Electronics & IT</option>
            <option value="Housing">Ministry of Housing & Urban</option>
            <option value="Railways">Ministry of Railways</option>
            <option value="Defence">Department of Defence</option>
          </select>
        </div>
      </div>

      {/* Tenders Grid / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTenders.map((tender) => {
          const isSelected = activeTender && activeTender.id === tender.id;
          return (
            <div
              key={tender.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-subtle hover:shadow-elevated ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {tender.id}
                    </span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                      {tender.status || 'Active'}
                    </span>
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {tender.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0A2540]">{tender.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{tender.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tender.department}</span>
                    </div>
                    <div className="flex items-center space-x-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Closes: {tender.submission_deadline ? tender.submission_deadline.split('T')[0] : '2026-10-15'}</span>
                    </div>
                    <div className="flex items-center space-x-1 font-mono font-semibold text-slate-700">
                      <span>Est. Value: ₹{(tender.estimated_value / 10000000).toFixed(2)} Cr</span>
                    </div>
                  </div>
                </div>

                {/* Right: Bids & Rules Stats + Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 lg:w-64 flex-shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  <div className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
                    <div className="flex justify-between items-center text-[11px] text-slate-600 mb-1">
                      <span>Submitted Bids</span>
                      <span className="font-bold font-mono text-slate-900">{tender.bidders_count || 4} Bidders</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-600 mb-1">
                      <span>Automated Rules</span>
                      <span className="font-bold text-teal-700">{tender.rules?.length || 7} Configured</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${tender.verification_progress || 75}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full">
                    <button
                      onClick={() => {
                        onSelectTender(tender);
                        onNavigate('bidders');
                      }}
                      className="flex-1 bg-[#0A2540] hover:bg-[#1E40AF] text-white text-xs font-semibold py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Review Bids</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedTenderDetail(tender)}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                      title="View Tender Rules & Details"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Tender Rules Detail Modal / Drawer */}
      {selectedTenderDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-modal border border-slate-200 text-left">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedTenderDetail.id}
                </span>
                <h3 className="text-lg font-bold text-[#0A2540] mt-1">{selectedTenderDetail.title}</h3>
                <p className="text-xs text-slate-500">{selectedTenderDetail.department}</p>
              </div>
              <button 
                onClick={() => setSelectedTenderDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Configured Compliance Rules ({selectedTenderDetail.rules?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedTenderDetail.rules?.map((r, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center space-x-2">
                          <span>{r.name}</span>
                          <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                            {r.field} {r.operator} {String(r.value)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Weight: {r.weight} pts | Mandatory: {r.mandatory ? 'YES' : 'NO'}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        Automated AI Check
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Required Document Submissions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTenderDetail.required_documents?.map((doc, i) => (
                    <div key={i} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  onSelectTender(selectedTenderDetail);
                  setSelectedTenderDetail(null);
                  onNavigate('bidders');
                }}
                className="bg-[#0A2540] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1E40AF]"
              >
                Set as Active & Evaluate Bidders →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tender Modal Wizard */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-modal border border-slate-200 text-left">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">GeM Tender Setup Wizard</span>
                </div>
                <h2 className="text-xl font-bold text-[#0A2540] mt-0.5">Create Tender & Configure Rules</h2>
                <p className="text-xs text-slate-500">Define custom tender requirements and deterministic AI evaluation rules.</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTender} className="py-4 space-y-5 text-xs">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tender ID (GeM / CPPP)</label>
                  <input
                    type="text"
                    value={newTender.id}
                    onChange={(e) => setNewTender({ ...newTender, id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Procurement Category</label>
                  <select
                    value={newTender.category}
                    onChange={(e) => setNewTender({ ...newTender, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  >
                    <option value="Goods / IT Hardware">Goods / IT Hardware</option>
                    <option value="Works & Turnkey IT Services">Works & Turnkey IT Services</option>
                    <option value="Goods / Railway Engineering">Goods / Railway Engineering</option>
                    <option value="Consultancy & Managed Services">Consultancy & Managed Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tender Title</label>
                <input
                  type="text"
                  value={newTender.title}
                  onChange={(e) => setNewTender({ ...newTender, title: e.target.value })}
                  placeholder="e.g. Supply & Installation of High Performance AI Computing Servers"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department / Ministry</label>
                  <input
                    type="text"
                    value={newTender.department}
                    onChange={(e) => setNewTender({ ...newTender, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Value (₹ INR)</label>
                  <input
                    type="number"
                    value={newTender.estimated_value}
                    onChange={(e) => setNewTender({ ...newTender, estimated_value: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Dynamic Compliance Rules Section (Crucial Feature) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">Define Tender-Specific Compliance Rules</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Configurable Rule Engine</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  TenderIQ automatically evaluates bidder documents and registry data against these conditions.
                </p>

                {/* Rules List */}
                <div className="space-y-2 mb-3">
                  {newTender.rules.map((rule, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800">{rule.name}</span>
                        <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {rule.field} {rule.operator} {String(rule.value)}
                        </span>
                        <span className="text-[10px] text-blue-600 font-semibold">{rule.weight} pts</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Rule Sub-form */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    placeholder="Rule Name (e.g. ISO 27001)"
                    value={newCustomRule.name}
                    onChange={(e) => setNewCustomRule({ ...newCustomRule, name: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs col-span-2"
                  />
                  <select
                    value={newCustomRule.operator}
                    onChange={(e) => setNewCustomRule({ ...newCustomRule, operator: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs"
                  >
                    <option value="EQUALS">EQUALS</option>
                    <option value="GREATER_THAN_OR_EQUAL">&gt;=</option>
                    <option value="CONTAINS">CONTAINS</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Expected Value"
                    value={newCustomRule.value}
                    onChange={(e) => setNewCustomRule({ ...newCustomRule, value: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 font-semibold text-xs flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Bid Documents Checklist</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {newTender.required_documents.map((doc, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-md border border-slate-200 flex items-center space-x-1">
                      <span>{doc}</span>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDocText}
                    onChange={(e) => setNewDocText(e.target.value)}
                    placeholder="Add required document (e.g. ISO 9001 Certificate)..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddDoc}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded-lg font-semibold text-xs"
                  >
                    + Add Doc
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A2540] hover:bg-[#1E40AF] text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm"
                >
                  Publish Tender & Rules
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
