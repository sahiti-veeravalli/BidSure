const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Stats
  getDashboardStats: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`);
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return await res.json();
    } catch (err) {
      console.warn('API fetch failed, returning local state fallback', err);
      return null;
    }
  },

  // Tenders
  getTenders: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tenders`);
      if (!res.ok) throw new Error('Failed to fetch tenders');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return [];
    }
  },

  getTenderDetail: async (tenderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tenders/${encodeURIComponent(tenderId)}`);
      if (!res.ok) throw new Error('Failed to fetch tender');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return null;
    }
  },

  createTender: async (tenderData) => {
    const res = await fetch(`${API_BASE_URL}/tenders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tenderData),
    });
    if (!res.ok) throw new Error('Failed to create tender');
    return await res.json();
  },

  // Bidders
  getBidders: async (tenderId = null) => {
    try {
      const url = tenderId ? `${API_BASE_URL}/bidders?tender_id=${encodeURIComponent(tenderId)}` : `${API_BASE_URL}/bidders`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch bidders');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return [];
    }
  },

  getBidderDetail: async (bidderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bidders/${encodeURIComponent(bidderId)}`);
      if (!res.ok) throw new Error('Failed to fetch bidder');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return null;
    }
  },

  // Documents
  getDocuments: async (bidderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents?bidder_id=${encodeURIComponent(bidderId)}`);
      if (!res.ok) throw new Error('Failed to fetch documents');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return [];
    }
  },

  uploadDocument: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return await res.json();
  },

  // Verification Sources
  getVerificationSources: async (bidderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/verification?bidder_id=${encodeURIComponent(bidderId)}`);
      if (!res.ok) throw new Error('Failed to fetch verification sources');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return [];
    }
  },

  reverifySource: async (bidderId, sourceKey) => {
    const res = await fetch(`${API_BASE_URL}/verification/reverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bidder_id: bidderId, source_key: sourceKey }),
    });
    if (!res.ok) throw new Error('Failed to re-verify source');
    return await res.json();
  },

  // Compliance Engine
  getComplianceMatrix: async (bidderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/compliance?bidder_id=${encodeURIComponent(bidderId)}`);
      if (!res.ok) throw new Error('Failed to fetch compliance matrix');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return null;
    }
  },

  getWhyExplanation: async (evaluationId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/compliance/why/${encodeURIComponent(evaluationId)}`);
      if (!res.ok) throw new Error('Failed to fetch explanation');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return null;
    }
  },

  // Discrepancies
  getDiscrepancies: async (bidderId = null) => {
    try {
      const url = bidderId ? `${API_BASE_URL}/discrepancies?bidder_id=${encodeURIComponent(bidderId)}` : `${API_BASE_URL}/discrepancies`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch discrepancies');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return [];
    }
  },

  // Audit Logs
  getAuditTrail: async (bidderId = null, tenderId = null) => {
    try {
      let url = `${API_BASE_URL}/audit`;
      const params = [];
      if (bidderId) params.push(`bidder_id=${encodeURIComponent(bidderId)}`);
      if (tenderId) params.push(`tender_id=${encodeURIComponent(tenderId)}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch audit trail');
      return await res.json();
    } catch (err) {
      console.warn('API error', err);
      return [];
    }
  },

  // Officer Decision
  recordOfficerDecision: async (decisionData) => {
    const res = await fetch(`${API_BASE_URL}/decisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decisionData),
    });
    if (!res.ok) throw new Error('Failed to save decision');
    return await res.json();
  },

  // Reset Demo
  resetDemoData: async () => {
    const res = await fetch(`${API_BASE_URL}/reset-demo`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return await res.json();
  }
};
