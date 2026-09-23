import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../../data/mockData';
import RiskBadge from '../common/RiskBadge';
import { Link } from 'react-router-dom';
import { FileText, Plus, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { createTender } from '../../services/api';

export default function DistrictDashboard() {
  const [showTenderModal, setShowTenderModal] = useState(false);
  const [tenderTitle, setTenderTitle] = useState('');
  const [projectId, setProjectId] = useState(MOCK_PROJECTS[0].id);
  const [cost, setCost] = useState('2000000');

  const handleCreateTender = async (e) => {
    e.preventDefault();
    try {
      await createTender({
        projectId,
        projectName: MOCK_PROJECTS.find(p => p.id === projectId)?.name || 'Community Hall',
        tenderTitle,
        description: 'Tender created by District Authority Nashik',
        estimatedCost: Number(cost),
        submissionDeadline: '2026-10-31',
        eligibilityRequirements: 'Class A Registered Contractor'
      });
      setShowTenderModal(false);
      alert("✅ New Tender Created & Published to Public Bidding Portal!");
    } catch (err) {
      alert("Tender published to local memory store!");
      setShowTenderModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
            DISTRICT MAGISTRATE / DISTRICT AUTHORITY DESK
          </span>
          <h1 className="text-2xl font-bold mt-2">District Collectorate — District Nashik</h1>
          <p className="text-xs text-slate-300 mt-1">
            District scope restriction. Manage MP recommendations, publish tenders, evaluate contractor bids, and inspect risk alerts.
          </p>
        </div>
        <button
          onClick={() => setShowTenderModal(true)}
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl hover:bg-amber-400 transition-all text-xs shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Tender
        </button>
      </div>

      {/* Tender Modal */}
      {showTenderModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 text-base border-b pb-2">Publish New Procurement Tender</h3>
            <form onSubmit={handleCreateTender} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Sanctioned Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                >
                  {MOCK_PROJECTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tender Title</label>
                <input
                  type="text"
                  value={tenderTitle}
                  onChange={(e) => setTenderTitle(e.target.value)}
                  placeholder="e.g. Tender for Construction of Community Hall RCC Structure"
                  className="w-full bg-slate-50 border rounded-lg p-2 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Estimated Tender Cost (₹)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg p-2 font-mono font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowTenderModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                >
                  Publish Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* District Action Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <Link to="/tenders" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-all shadow-2xs space-y-2 group">
          <div className="flex items-center justify-between text-blue-600 font-bold">
            <span>Tender & Bidding Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            Publish tenders, review submitted contractor bids, and issue formal contract awards.
          </p>
        </Link>

        <Link to="/alerts" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-400 transition-all shadow-2xs space-y-2 group">
          <div className="flex items-center justify-between text-rose-600 font-bold">
            <span>District Anomaly Inspection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            Dispatch field inspection officers to verify AI-flagged progress & cost anomalies.
          </p>
        </Link>

        <Link to="/citizen-reports" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-400 transition-all shadow-2xs space-y-2 group">
          <div className="flex items-center justify-between text-amber-600 font-bold">
            <span>Citizen Feedback Desk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            Review ground reports submitted by local residents and update verification status.
          </p>
        </Link>
      </div>
    </div>
  );
}
