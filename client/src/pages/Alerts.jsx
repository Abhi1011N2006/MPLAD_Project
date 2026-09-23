import React, { useState, useEffect } from 'react';
import { MOCK_ALERTS } from '../data/mockData';
import RiskBadge from '../components/common/RiskBadge';
import Pagination from '../components/common/Pagination';
import { Link } from 'react-router-dom';
import { AlertTriangle, Filter, CheckCircle2, XCircle, Search, ShieldAlert } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, statusFilter]);

  const handleUpdateStatus = (alertId, newStatus) => {
    setAlerts(
      alerts.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesType = typeFilter === 'ALL' || a.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> AI Anomaly & Risk Alerts Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Human-in-the-loop surveillance dashboard for inspecting and resolving AI-flagged project anomalies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-200 focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Anomaly Types</option>
            <option value="Cost anomaly">Cost anomaly</option>
            <option value="Payment anomaly">Payment anomaly</option>
            <option value="Project delay">Project delay</option>
            <option value="Progress discrepancy">Progress discrepancy</option>
            <option value="Possible duplicate">Possible duplicate</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-200 focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Alert Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="False Positive">False Positive</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {paginatedAlerts.map((alert) => (
          <div key={alert.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl space-y-3 text-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {alert.id}
                </span>
                <span className="text-xs font-semibold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-800">
                  {alert.type}
                </span>
                <span className="text-xs text-slate-400">Date: {alert.date}</span>
              </div>
              <RiskBadge score={alert.riskScore} level={alert.riskLevel} size="md" />
            </div>

            <div>
              <Link to={`/projects/${alert.projectId}`} className="font-bold text-white text-sm hover:text-amber-400 hover:underline">
                {alert.projectName} ({alert.projectId})
              </Link>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                <strong className="text-amber-400">Explainable Reason:</strong> {alert.reason}
              </p>
            </div>

            {/* Evidence Payload */}
            {alert.evidence && (
              <div className="text-[11px] font-mono bg-slate-950 text-slate-200 p-3 rounded-lg space-y-1 border border-slate-800">
                <span className="text-amber-400 font-bold block">Extract Evidence Payload:</span>
                <pre className="text-amber-300 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(alert.evidence, null, 2)}</pre>
              </div>
            )}

            {/* Actions for Officers */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className="font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {alert.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => handleUpdateStatus(alert.id, 'Under Review')}
                  className="bg-amber-950 hover:bg-amber-900 text-amber-200 font-semibold px-3 py-1.5 rounded-lg border border-amber-700 transition-colors"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus(alert.id, 'Verified')}
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 font-semibold px-3 py-1.5 rounded-lg border border-emerald-700 transition-colors"
                >
                  Verify Anomaly
                </button>
                <button
                  onClick={() => handleUpdateStatus(alert.id, 'False Positive')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                >
                  False Positive
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAlerts.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
