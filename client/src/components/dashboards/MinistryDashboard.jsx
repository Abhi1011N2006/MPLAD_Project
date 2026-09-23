import React, { useState } from 'react';
import { MOCK_SUMMARY, MOCK_PROJECTS, MOCK_ALERTS } from '../../data/mockData';
import RiskBadge from '../common/RiskBadge';
import Pagination from '../common/Pagination';
import { Link } from 'react-router-dom';
import { Building2, Globe, TrendingUp, IndianRupee, AlertTriangle, ArrowRight } from 'lucide-react';

export default function MinistryDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const totalPages = Math.ceil(MOCK_ALERTS.length / ITEMS_PER_PAGE);
  const paginatedAlerts = MOCK_ALERTS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 text-slate-100">
      {/* Role Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-amber-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
              NATIONAL MINISTRY SURVEILLANCE DESK
            </span>
            <h1 className="text-2xl font-bold mt-2">Ministry of Statistics & Programme Implementation (MoSPI)</h1>
            <p className="text-xs text-slate-300 mt-1">
              National overview monitoring all 28 States and 8 Union Territories. Full access to national project registry & AI anomaly signals.
            </p>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">Total National Budget Sanctioned</span>
            <span className="text-xl font-black text-amber-400">₹2,450.00 Cr</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-medium">All Sanctioned Projects</span>
          <h3 className="text-2xl font-black text-white mt-1">{MOCK_SUMMARY.totalProjects}</h3>
          <span className="text-[11px] text-emerald-400 font-semibold">National Coverage</span>
        </div>
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-medium">National Fund Expenditure</span>
          <h3 className="text-xl font-black text-amber-400 mt-1">₹178.50 Cr</h3>
          <span className="text-[11px] text-slate-400">72.8% Funds Utilized</span>
        </div>
        <div className="bg-slate-900/90 p-4 rounded-xl border border-rose-800/60 bg-rose-950/20 shadow-xl">
          <span className="text-xs text-rose-300 font-semibold">Critical Risk Anomaly Flags</span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">{MOCK_SUMMARY.criticalProjects}</h3>
          <span className="text-[11px] text-rose-300 font-medium">Pulsing Surveillance Priority</span>
        </div>
        <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-800/60 bg-amber-950/20 shadow-xl">
          <span className="text-xs text-amber-300 font-semibold">High / Critical Risk Flags</span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">{MOCK_SUMMARY.highRiskProjects}</h3>
          <span className="text-[11px] text-amber-300 font-medium">Requiring Field Verification</span>
        </div>
      </div>

      {/* National Alerts Overview with Pagination */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm">National High-Risk Surveillance Stream</h3>
          <Link to="/alerts" className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1">
            View Full Alerts Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {paginatedAlerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between gap-3 text-xs text-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">{alert.id}</span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold text-[11px]">
                    {alert.type}
                  </span>
                </div>
                <h4 className="font-bold text-white">{alert.projectName}</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                  <strong className="text-amber-400">Explainable Reason:</strong> {alert.reason}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <RiskBadge score={alert.riskScore} level={alert.riskLevel} size="md" />
              </div>
            </div>
          ))}
        </div>

        {/* Reusable Pagination matching user screenshot */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={MOCK_ALERTS.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
