import React from 'react';
import { MOCK_PROJECTS } from '../../data/mockData';
import RiskBadge from '../common/RiskBadge';
import { Link } from 'react-router-dom';
import { Building2, FileCheck, FileText, UserCheck, ShieldCheck, ArrowRight, Briefcase, IndianRupee, FileSpreadsheet } from 'lucide-react';

export default function ContractorDashboard() {
  const contractorProjects = MOCK_PROJECTS.filter(p => p.contractorId === 'CONT-101' || p.contractor.includes('Apex'));

  return (
    <div className="space-y-6">
      {/* Contractor Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
            CONTRACTOR EXECUTION DESK
          </span>
          <h1 className="text-2xl font-bold mt-2">Apex Infra Tech Ltd</h1>
          <p className="text-xs text-slate-300 mt-1">
            Contractor ID: <code className="font-mono text-amber-400">CONT-101</code> • Class A Registered Civil Contractor (PWD Maharashtra)
          </p>
        </div>
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl hover:bg-amber-400 transition-all text-xs shadow-md shrink-0"
        >
          <FileCheck className="w-4 h-4" /> Submit Weekly Progress Report
        </Link>
      </div>

      {/* Contractor Post-Award Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <Link to="/contractor/contracts" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-all shadow-2xs space-y-2 group">
          <div className="flex items-center justify-between text-blue-600 font-bold">
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> My Contracts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            Active, completed & delayed contract specifications.
          </p>
        </Link>

        <Link to="/contractor/history" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 transition-all shadow-2xs space-y-2 group">
          <div className="flex items-center justify-between text-emerald-600 font-bold">
            <span className="flex items-center gap-1.5"><FileSpreadsheet className="w-4 h-4" /> Contract History</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            Factual performance stats: Completed (15), Active (5), Delayed (3).
          </p>
        </Link>

        <Link to="/contractor/payments" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 transition-all shadow-2xs space-y-2 group">
          <div className="flex items-center justify-between text-emerald-700 font-bold">
            <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4" /> Bills & Payments</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            Track submitted bills, approved payments & cost variations.
          </p>
        </Link>

        <Link to="/reports" className="p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-400 transition-all shadow-2xs space-y-2 group">
          <div className="flex items-center justify-between text-amber-600 font-bold">
            <span className="flex items-center gap-1.5"><FileCheck className="w-4 h-4" /> Weekly Reports</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            Upload geotagged field photos, manpower logs & progress.
          </p>
        </Link>
      </div>

      {/* Assigned Active Contracts */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">My Active Awarded Contracts</h3>
        <div className="space-y-3 text-xs">
          {contractorProjects.map(p => (
            <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="font-mono font-bold text-blue-600">{p.id}</span>
                <h4 className="font-bold text-slate-900">{p.name}</h4>
                <p className="text-slate-500 text-[11px]">Contract Value: ₹{(p.sanctionedAmount/100000).toFixed(2)} Lakhs • Progress: {p.progressPercentage}%</p>
              </div>
              <Link to={`/projects/${p.id}`} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-800">
                Manage Project Execution
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
