import React from 'react';
import { MOCK_PROJECTS } from '../../data/mockData';
import RiskBadge from '../common/RiskBadge';
import { Link } from 'react-router-dom';
import { UserCheck, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

export default function MPDashboard() {
  const mpProjects = MOCK_PROJECTS.filter(p => p.constituencyId === 'Nashik-LS' || p.district === 'Nashik');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
          MEMBER OF PARLIAMENT (LOK SABHA) CONSTITUENCY DESK
        </span>
        <h1 className="text-2xl font-bold mt-2">MP Constituency Surveillance — Nashik (Lok Sabha)</h1>
        <p className="text-xs text-slate-300 mt-1">
          Constituency scope restriction. Track recommended development works, contractor award status, and constituent citizen feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 block font-medium">Recommended Works</span>
          <strong className="text-xl font-black text-slate-900">18 Sanctioned</strong>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 block font-medium">Annual Fund Utilization</span>
          <strong className="text-xl font-black text-emerald-600">₹4.85 Crore</strong>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 block font-medium">Constituent Feedback</span>
          <strong className="text-xl font-black text-blue-600">14 Reports Received</strong>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Constituency Development Projects</h3>
        <div className="space-y-3 text-xs">
          {mpProjects.map(p => (
            <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-mono text-blue-600 font-bold">{p.id}</span>
                <h4 className="font-bold text-slate-900">{p.name}</h4>
                <p className="text-slate-500 text-[11px]">Contractor: <strong>{p.contractor}</strong> • Locality: {p.village}</p>
              </div>
              <RiskBadge score={p.riskScore} level={p.riskLevel} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
