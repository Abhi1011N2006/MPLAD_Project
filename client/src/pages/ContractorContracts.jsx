import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

export default function ContractorContracts() {
  const [filter, setFilter] = useState('ALL');

  const contractsList = [
    {
      contractId: "CNT-2025-MH-001",
      projectId: "MPLAD-2026-MH-001",
      projectName: "Multipurpose Community Hall at Dindori",
      contractorName: "Apex Infra Tech Ltd",
      tenderId: "TND-2025-MH-088",
      contractAmount: 1850000,
      startDate: "2025-11-01",
      expectedCompletionDate: "2026-05-30",
      actualCompletionDate: null,
      status: "Active",
      paidExpenditure: 1800000,
      progressPercentage: 40,
      costVariationPercent: 0
    },
    {
      contractId: "CNT-2025-MH-002",
      projectId: "MPLAD-2026-MH-002",
      projectName: "Mountain Road Construction (Trimbak)",
      contractorName: "Sahyadri Earthmovers & Infra",
      tenderId: "TND-2025-MH-042",
      contractAmount: 3300000,
      startDate: "2025-08-15",
      expectedCompletionDate: "2026-08-15",
      actualCompletionDate: null,
      status: "Active",
      paidExpenditure: 3200000,
      progressPercentage: 85,
      costVariationPercent: 0
    },
    {
      contractId: "CNT-2025-MH-006",
      projectId: "MPLAD-2026-MH-006",
      projectName: "Gram Panchayat Concrete Road & Drainage",
      contractorName: "Kadam Infra Projects",
      tenderId: "TND-2025-MH-019",
      contractAmount: 1750000,
      startDate: "2025-06-01",
      expectedCompletionDate: "2025-12-31",
      actualCompletionDate: "2025-12-28",
      status: "Completed",
      paidExpenditure: 1750000,
      progressPercentage: 100,
      costVariationPercent: 0
    },
    {
      contractId: "CNT-2025-MH-004",
      projectId: "MPLAD-2026-MH-004",
      projectName: "Solar Powered Borewell & Water Tank Installation",
      contractorName: "Jal-Shakti Water Systems",
      tenderId: "TND-2025-MH-012",
      contractAmount: 1150000,
      startDate: "2025-05-10",
      expectedCompletionDate: "2025-11-10",
      actualCompletionDate: null,
      status: "Delayed",
      paidExpenditure: 1150000,
      progressPercentage: 60,
      costVariationPercent: 0
    }
  ];

  const filtered = contractsList.filter(c => filter === 'ALL' || c.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" /> Awarded Contracts Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Execution view of assigned MPLADS development contracts post-procurement award.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          {['ALL', 'Active', 'Completed', 'Delayed'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                filter === st
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filtered.map(contract => (
          <div key={contract.contractId} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border">
                  {contract.contractId}
                </span>
                <span className="font-mono text-slate-400">Tender: {contract.tenderId}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded font-bold text-[11px] ${
                contract.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                contract.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {contract.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm">{contract.projectName}</h3>
              <p className="text-slate-500 text-[11px] mt-0.5">Project ID: {contract.projectId}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg font-medium text-[11px]">
              <div>Contract Amount: <strong className="text-slate-900">₹{(contract.contractAmount/100000).toFixed(2)}L</strong></div>
              <div>Disbursed Spent: <strong className="text-emerald-700">₹{(contract.paidExpenditure/100000).toFixed(2)}L</strong></div>
              <div>Start Date: <strong className="text-slate-900">{contract.startDate}</strong></div>
              <div>Target Completion: <strong className="text-slate-900">{contract.expectedCompletionDate}</strong></div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${contract.progressPercentage}%` }} />
                </div>
                <span className="font-bold text-slate-800">{contract.progressPercentage}% Progress</span>
              </div>

              <Link
                to={`/projects/${contract.projectId}`}
                className="inline-flex items-center gap-1 bg-slate-900 text-white font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-slate-800"
              >
                Project Execution Hub <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
