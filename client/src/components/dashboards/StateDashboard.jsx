import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../../data/mockData';
import RiskBadge from '../common/RiskBadge';
import Pagination from '../common/Pagination';
import { Link } from 'react-router-dom';
import { Building, MapPin, ArrowRight } from 'lucide-react';

export default function StateDashboard() {
  const stateProjects = MOCK_PROJECTS.filter(p => p.state === 'Maharashtra');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.ceil(stateProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = stateProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 text-slate-100">
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 border border-blue-800 p-6 rounded-2xl text-white shadow-xl">
        <span className="bg-sky-500/20 text-sky-300 text-xs font-bold px-3 py-1 rounded-full border border-sky-500/30">
          STATE NODAL AUTHORITY SURVEILLANCE
        </span>
        <h1 className="text-2xl font-bold mt-2">State Nodal Authority — Maharashtra</h1>
        <p className="text-xs text-slate-300 mt-1">
          Geographic scope restricted to projects within Maharashtra State across all 36 districts.
        </p>
      </div>

      <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm">State District Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium block">Nashik District</span>
            <strong className="text-lg text-white font-black">42 Projects</strong>
            <span className="text-[11px] text-rose-400 block mt-1">4 High Risk Flags</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium block">Pune District</span>
            <strong className="text-lg text-white font-black">38 Projects</strong>
            <span className="text-[11px] text-emerald-400 block mt-1">1 High Risk Flag</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium block">Thane District</span>
            <strong className="text-lg text-white font-black">29 Projects</strong>
            <span className="text-[11px] text-amber-400 block mt-1">2 Medium Risk Flags</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm mb-3">State Projects Stream</h3>
        <div className="space-y-3 text-xs">
          {paginatedProjects.map(p => (
            <div key={p.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-slate-200">
              <div>
                <span className="font-mono font-bold text-amber-400">{p.id}</span>
                <h4 className="font-bold text-white">{p.name}</h4>
                <span className="text-slate-400 text-[11px]">{p.village}, {p.district} • Terrain: <strong className="text-sky-300">{p.terrainType}</strong></span>
              </div>
              <RiskBadge score={p.riskScore} level={p.riskLevel} size="sm" />
            </div>
          ))}
        </div>

        {/* Reusable Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={stateProjects.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
