import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CONTRACTORS, MOCK_PROJECTS } from '../data/mockData';
import { Building2, ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileSpreadsheet, ExternalLink, Search } from 'lucide-react';

export default function ContractorHistory() {
  const [selectedContractorId, setSelectedContractorId] = useState(MOCK_CONTRACTORS[0].contractorId);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedContractor = MOCK_CONTRACTORS.find(c => c.contractorId === selectedContractorId) || MOCK_CONTRACTORS[0];

  // Dynamically filter matching projects from the master dataset
  const contractorProjects = MOCK_PROJECTS.filter(p =>
    p.contractor && (
      p.contractor.toLowerCase() === selectedContractor.companyName.toLowerCase() ||
      p.contractor.toLowerCase().includes(selectedContractor.companyName.toLowerCase())
    )
  );

  // Calculate factual dynamic metrics directly from MOCK_PROJECTS
  const totalContracts = contractorProjects.length;
  const successfullyCompleted = contractorProjects.filter(p => p.status === 'Completed' || p.progressPercentage === 100).length;
  const delayed = contractorProjects.filter(p => p.status === 'Delayed').length;
  const currentlyWorking = contractorProjects.filter(p => p.status === 'Ongoing' || (p.status !== 'Completed' && p.status !== 'Delayed' && p.status !== 'Cancelled')).length;
  const cancelledOrTerminated = contractorProjects.filter(p => p.status === 'Cancelled' || p.status === 'Terminated').length;

  const filteredContractors = MOCK_CONTRACTORS.filter(c =>
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Contractor Header Banner & Selector */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
                CONTRACTOR ID: {selectedContractor.contractorId}
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
                {selectedContractor.eligibilityStatus || 'Empaneled Implementing Agency'}
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-2 text-white">{selectedContractor.companyName}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Registration No: <code className="font-mono">{selectedContractor.registrationNumber}</code> • {selectedContractor.companyType} • {selectedContractor.state}
            </p>
          </div>

          {/* Agency Selector Dropdown */}
          <div className="w-full sm:w-auto">
            <label className="text-[11px] text-slate-400 font-bold block mb-1">Select Agency for Audit:</label>
            <select
              value={selectedContractorId}
              onChange={(e) => setSelectedContractorId(e.target.value)}
              className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 w-full"
            >
              {MOCK_CONTRACTORS.map(c => (
                <option key={c.contractorId} value={c.contractorId}>
                  {c.contractorId} - {c.companyName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Factual Performance Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Total Assigned Contracts</span>
          <strong className="text-2xl font-black text-slate-900">{totalContracts}</strong>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
          <span className="text-emerald-800 font-medium block">Successfully Completed</span>
          <strong className="text-2xl font-black text-emerald-600">{successfullyCompleted}</strong>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-2xs">
          <span className="text-blue-800 font-medium block">Currently Working</span>
          <strong className="text-2xl font-black text-blue-600">{currentlyWorking}</strong>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs">
          <span className="text-amber-800 font-medium block">Delayed Contracts</span>
          <strong className="text-2xl font-black text-amber-600">{delayed}</strong>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-2xs">
          <span className="text-rose-800 font-medium block">Cancelled / Terminated</span>
          <strong className="text-2xl font-black text-rose-600">{cancelledOrTerminated}</strong>
        </div>
      </div>

      {/* Contract History Table linked 100% dynamically to MOCK_PROJECTS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white font-bold text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" /> Complete Contract Audit Record ({selectedContractor.companyName})
          </span>
          <span className="text-xs text-slate-400 font-normal">* Synchronized live with Master Projects Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase border-b">
              <tr>
                <th className="px-4 py-3">Project ID & Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Sanctioned Cost</th>
                <th className="px-4 py-3">Expenditure</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contractorProjects.length > 0 ? (
                contractorProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-mono text-blue-600 font-bold flex items-center gap-1">
                        {p.id}
                      </div>
                      <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{p.district}, {p.state}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.village || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">₹{(p.sanctionedAmount / 100000).toFixed(2)}L</td>
                    <td className="px-4 py-3 font-mono text-slate-700">₹{(p.actualExpenditure / 100000).toFixed(2)}L</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${p.progressPercentage === 100 ? 'bg-emerald-500' : p.progressPercentage < 50 ? 'bg-amber-500' : 'bg-blue-600'}`}
                            style={{ width: `${p.progressPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px]">{p.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                        p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        p.status === 'Ongoing' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        p.status === 'Delayed' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/projects?id=${p.id}`}
                        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg font-bold border border-blue-200 text-[11px]"
                      >
                        Inspect <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400 font-medium">
                    No active or historical contracts recorded for this agency in the master database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
