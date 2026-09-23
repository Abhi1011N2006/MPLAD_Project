import React, { useState, useEffect } from 'react';
import { MOCK_PROJECTS } from '../data/mockData';
import RiskBadge from '../components/common/RiskBadge';
import Pagination from '../components/common/Pagination';
import { Link } from 'react-router-dom';
import { Search, Filter, FolderKanban, Plus, MapPin, Mountain, LayoutGrid, List } from 'lucide-react';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [terrainFilter, setTerrainFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, terrainFilter, statusFilter, riskFilter]);

  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTerrain = terrainFilter === 'ALL' || p.terrainType === terrainFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesRisk = riskFilter === 'ALL' || p.riskLevel === riskFilter;

    return matchesSearch && matchesTerrain && matchesStatus && matchesRisk;
  });

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-blue-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-600" /> MPLADS Development Projects Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor physical progress, financial sanctions, terrain metrics, and AI risk signals across all constituencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compact Fit Table View"
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'cards' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Responsive Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Cards
            </button>
          </div>

          <button
            onClick={() => alert("Sanction New Project Modal (Phase 2 feature)")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Sanction New Project
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, name, contractor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white placeholder-slate-400 font-medium"
            />
          </div>

          {/* Terrain Filter */}
          <select
            value={terrainFilter}
            onChange={(e) => setTerrainFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Terrains</option>
            <option value="Plain">Plain</option>
            <option value="Hilly">Hilly</option>
            <option value="Mountain">Mountain</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Projects Display Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        {viewMode === 'table' ? (
          /* Compact Fit Table View (Inspect button ALWAYS visible without horizontal scroll) */
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800 border-collapse min-w-[700px]">
              <thead className="bg-slate-100 text-blue-950 font-extrabold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 w-[26%]">Project ID & Name</th>
                  <th className="px-2 py-3 w-[18%]">Location & Terrain</th>
                  <th className="px-2 py-3 w-[13%]">Financials</th>
                  <th className="px-2 py-3 w-[14%]">Progress</th>
                  <th className="px-2 py-3 w-[15%]">Contractor</th>
                  <th className="px-2 py-3 w-[8%]">AI Risk</th>
                  <th className="px-3 py-3 w-[6%] text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProjects.map((p) => {
                  const expRatio = Math.round((p.actualExpenditure / p.sanctionedAmount) * 100);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="font-mono text-[11px] font-bold text-blue-700">{p.id}</div>
                        <div className="font-bold text-slate-900 truncate max-w-[210px]" title={p.name}>
                          {p.name}
                        </div>
                        <span className="inline-block mt-0.5 text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold border border-slate-200">
                          {p.type}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-1 font-bold text-slate-900 truncate max-w-[140px]" title={`${p.village}, ${p.district}`}>
                          <MapPin className="w-3 h-3 text-blue-600 shrink-0" /> {p.village}, {p.district}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5 font-medium">
                          <Mountain className="w-3 h-3 text-blue-500 shrink-0" /> Terrain: <strong className="text-slate-800">{p.terrainType}</strong>
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="font-black text-blue-900">₹{(p.actualExpenditure / 100000).toFixed(1)}L</div>
                        <div className="text-[10px] text-slate-500 font-medium">₹{(p.sanctionedAmount / 100000).toFixed(1)}L ({expRatio}%)</div>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                            <div
                              className={`h-1.5 rounded-full ${
                                p.progressPercentage >= 80
                                  ? 'bg-emerald-500'
                                  : p.progressPercentage >= 40
                                  ? 'bg-blue-600'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${p.progressPercentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-blue-700 text-[11px]">{p.progressPercentage}%</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">{p.status}</span>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="font-bold text-slate-800 truncate max-w-[130px]" title={p.contractor}>
                          {p.contractor}
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <RiskBadge score={p.riskScore} level={p.riskLevel} size="sm" />
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap">
                        <Link
                          to={`/projects/${p.id}`}
                          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] px-3 py-1 rounded-lg font-bold transition-all shadow-2xs"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards View Grid (Zero Horizontal Scroll for Small Screens) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProjects.map((p) => {
              const expRatio = Math.round((p.actualExpenditure / p.sanctionedAmount) * 100);
              return (
                <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {p.id}
                      </span>
                      <RiskBadge score={p.riskScore} level={p.riskLevel} size="sm" />
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{p.name}</h3>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" /> {p.village}, {p.district}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mountain className="w-3.5 h-3.5 text-blue-500" /> {p.terrainType}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sanctioned:</span>
                        <strong className="text-slate-900">₹{(p.sanctionedAmount / 100000).toFixed(1)}L</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Actual Spent:</span>
                        <strong className="text-blue-900">₹{(p.actualExpenditure / 100000).toFixed(1)}L ({expRatio}%)</strong>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Physical Progress:</span>
                        <strong className="text-blue-700 font-extrabold">{p.progressPercentage}% ({p.status})</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 font-semibold truncate max-w-[170px]" title={p.contractor}>
                      {p.contractor}
                    </span>
                    <Link
                      to={`/projects/${p.id}`}
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-xl font-bold transition-all shadow-2xs"
                    >
                      Inspect Project
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reusable Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProjects.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
