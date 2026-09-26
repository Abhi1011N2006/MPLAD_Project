import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_ALERTS, MOCK_CITIZEN_REPORTS } from '../data/mockData';
import RiskBadge from '../components/common/RiskBadge';
import { fetchCitizenReports } from '../services/api';
import {
  FolderKanban,
  MapPin,
  IndianRupee,
  Clock,
  Calendar,
  AlertTriangle,
  FileCheck,
  Users,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Mountain,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  FileText,
  Award,
  Layers,
  Search,
  Camera,
  Briefcase
} from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [allCitizenReports, setAllCitizenReports] = useState(MOCK_CITIZEN_REPORTS);

  const project = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];
  const projectAlerts = MOCK_ALERTS.filter((a) => a.projectId === project.id);

  useEffect(() => {
    let isMounted = true;
    fetchCitizenReports()
      .then((res) => {
        if (!isMounted) return;
        let backendList = null;
        if (Array.isArray(res)) backendList = res;
        else if (res && Array.isArray(res.data)) backendList = res.data;

        if (backendList && backendList.length > 0) {
          const existingIds = new Set(backendList.map(r => r.id || r.reportId));
          const missingMocks = MOCK_CITIZEN_REPORTS.filter(m => !existingIds.has(m.id || m.reportId));
          setAllCitizenReports([...backendList, ...missingMocks]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const projectCitizenReports = allCitizenReports.filter((c) => (c.projectId === project.id || c.project_id === project.id));

  // 11 Unified Central Tabs
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tender', label: 'Tender' },
    { id: 'contractor', label: 'Contractor' },
    { id: 'finance', label: 'Finance' },
    { id: 'progress', label: 'Progress' },
    { id: 'weekly', label: 'Weekly Reports' },
    { id: 'citizen', label: `Citizen Reports (${projectCitizenReports.length})` },
    { id: 'evidence', label: 'Evidence' },
    { id: 'alerts', label: `AI Alerts (${projectAlerts.length})` },
    { id: 'inspections', label: 'Inspections' },
    { id: 'history', label: 'Audit History' },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/projects" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Projects Registry
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="font-mono text-amber-400 font-semibold">{project.id}</span>
      </div>

      {/* Main Banner Card */}
      <div className="bg-slate-900/90 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/30 font-bold">
                {project.id}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-semibold">
                {project.type}
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/30 font-semibold">
                Status: {project.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-2 text-white">{project.name}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> {project.village}, {project.district}, {project.state} •
              <Mountain className="w-3.5 h-3.5 text-sky-400" /> Terrain: <strong className="text-white">{project.terrainType}</strong>
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">AI Risk Rating</div>
              <div className="mt-1">
                <RiskBadge score={project.riskScore} level={project.riskLevel} size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Explainable AI Risk Callout */}
        {project.riskLevel !== 'LOW' && (
          <div className="bg-rose-950/60 border border-rose-800/80 p-4 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>EXPLAINABLE AI RISK ASSESSMENT: {project.riskLevel} RISK ANOMALY DETECTED</span>
              </div>
              <span className="text-[10px] bg-rose-900 text-rose-200 px-2 py-0.5 rounded font-mono border border-rose-700">
                Human Verification Required
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-200 pl-1 leading-relaxed">
              {project.riskReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 11 Unified Central Tabs Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 rounded-xl p-1 gap-1 shadow-md overflow-x-auto text-xs font-semibold text-slate-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg space-y-2">
                <span className="text-xs text-slate-400 font-medium">Estimated vs Sanctioned Budget</span>
                <div className="text-xl font-bold text-white">₹{(project.sanctionedAmount / 100000).toFixed(2)} Lakhs</div>
                <div className="text-xs text-slate-300">Actual Spent: <strong className="text-amber-400">₹{(project.actualExpenditure / 100000).toFixed(2)} Lakhs</strong></div>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg space-y-2">
                <span className="text-xs text-slate-400 font-medium">Reported Physical Progress</span>
                <div className="text-xl font-bold text-cyan-400">{project.progressPercentage}% Completed</div>
                <div className="text-xs text-slate-300">Target Date: <strong className="text-white">{project.expectedCompletionDate}</strong></div>
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg space-y-3">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Project Description</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Geographic Coordinates</h3>
              <div>Latitude: <strong className="font-mono text-amber-400">{project.latitude}</strong></div>
              <div>Longitude: <strong className="font-mono text-amber-400">{project.longitude}</strong></div>
              <div>Terrain Profile: <strong className="text-sky-300">{project.terrainType}</strong></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tender' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-3 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Procurement & Tender Audit Record</h3>
          <div>Tender ID: <strong className="font-mono text-amber-400">TND-2025-MH-088</strong></div>
          <div>Estimated Cost: <strong className="text-white">₹{(project.sanctionedAmount/100000).toFixed(2)} Lakhs</strong></div>
          <div>Status: <strong className="text-emerald-400">Contract Awarded</strong></div>
        </div>
      )}

      {activeTab === 'contractor' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-3 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Awarded Implementing Agency / Contractor</h3>
          <div>Firm Name: <strong className="text-white font-bold text-sm">{project.contractor}</strong></div>
          <div>Contractor ID: <strong className="font-mono text-amber-400 font-bold">{project.contractorId || 'CON-001'}</strong></div>
          <div>Link to Agency Record: <Link to={`/contractor/profile?name=${encodeURIComponent(project.contractor)}`} className="text-sky-400 hover:underline font-bold text-xs">View Full Corporate Profile for {project.contractor} →</Link></div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-3 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Financial Disbursement Ledger</h3>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-300 font-medium">Sanctioned Amount:</span>
            <strong className="text-white font-bold text-sm">₹{(project.sanctionedAmount/100000).toFixed(2)} Lakhs</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-300 font-medium">Actual Spent:</span>
            <strong className="text-amber-400 font-bold text-sm">₹{(project.actualExpenditure/100000).toFixed(2)} Lakhs</strong>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-300 font-medium">Remaining Balance:</span>
            <strong className="text-emerald-400 font-bold text-sm">₹{((project.sanctionedAmount - project.actualExpenditure)/100000).toFixed(2)} Lakhs</strong>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-3 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Physical Progress Tracking</h3>
          <div className="text-lg font-bold text-cyan-400">{project.progressPercentage}% Completed</div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
            <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${project.progressPercentage}%` }} />
          </div>
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-3 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Weekly Contractor Field Reports</h3>
          <p className="text-slate-300">Latest report submitted: Week 14 (Progress {project.progressPercentage}%).</p>
        </div>
      )}

      {activeTab === 'citizen' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-3 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Citizen Complaints & Observations</h3>
          {projectCitizenReports.length === 0 ? (
            <p className="text-slate-400">No citizen complaints logged for this project.</p>
          ) : (
            projectCitizenReports.map(c => (
              <div key={c.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-amber-400">{c.reportType}</div>
                <p className="text-slate-300 mt-1">{c.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-4 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Geotagged Photographic & AI Satellite Evidence Timeline</span>
            <span className="text-[11px] font-normal text-amber-400 font-mono">Multi-Modal Audit Proof</span>
          </h3>

          {/* AI Evidence Payload Banner if project has evidence */}
          {projectAlerts.some(a => a.evidence) && (
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3 font-mono">
              <div className="text-amber-400 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> AI Multi-Modal Surveillance Evidence Extract:
              </div>
              {projectAlerts.filter(a => a.evidence).map((a, idx) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <div className="text-rose-400 font-bold flex items-center justify-between">
                    <span>{a.type} ({a.riskLevel} Risk - Score: {a.riskScore}/100)</span>
                    <span className="text-slate-400 text-[10px]">{a.date}</span>
                  </div>
                  <pre className="text-amber-300 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] bg-slate-950 p-2.5 rounded border border-slate-800 leading-relaxed">
                    {JSON.stringify(a.evidence, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.photos.map((photo, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-slate-800 relative group">
                <img src={photo} alt="Evidence" className="w-full h-44 object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 p-2 text-[10px] text-slate-300 flex justify-between font-mono">
                  <span>LAT: {project.latitude.toFixed(4)} | LNG: {project.longitude.toFixed(4)}</span>
                  <span className="text-emerald-400 font-bold">Geotag Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-4 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>AI Risk Anomaly Alerts ({projectAlerts.length})</span>
            <span className="text-xs text-rose-400 font-mono font-bold">Explainable AI Signals</span>
          </h3>
          {projectAlerts.length === 0 ? (
            <p className="text-slate-400">No active AI alerts for this project.</p>
          ) : (
            projectAlerts.map(a => (
              <div key={a.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold">{a.id}</span>
                    <span className="bg-rose-950 text-rose-300 px-2.5 py-0.5 rounded text-[11px] font-bold border border-rose-800">
                      {a.type}
                    </span>
                    <span className="text-slate-400 text-[11px]">{a.date}</span>
                  </div>
                  <RiskBadge score={a.riskScore} level={a.riskLevel} size="sm" />
                </div>
                <p className="text-slate-200 leading-relaxed font-medium bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <strong className="text-amber-400">Explainable Anomaly Reason:</strong> {a.reason}
                </p>
                {a.evidence && (
                  <div className="bg-slate-900 text-slate-300 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                    <span className="text-amber-400 font-bold block">Extracted Evidence Payload:</span>
                    <pre className="whitespace-pre-wrap overflow-x-auto text-amber-300 bg-slate-950 p-2.5 rounded border border-slate-800">{JSON.stringify(a.evidence, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'inspections' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-3 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Field Inspection Logs</h3>
          <div className="text-slate-300">Last Officer Inspection: <strong className="text-white">2026-08-15</strong> (Verified by District Engineer)</div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg text-xs space-y-3 text-slate-200">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Immutable Audit Event Timeline</h3>
          <ul className="space-y-2 text-slate-300">
            <li>• 2025-05-10: MP Recommendation Submitted</li>
            <li>• 2025-07-01: Tender Published</li>
            <li>• 2025-08-15: Contract Awarded to Apex Infra Tech Ltd</li>
            <li>• 2025-09-01: Work Started on Ground</li>
          </ul>
        </div>
      )}
    </div>
  );
}
