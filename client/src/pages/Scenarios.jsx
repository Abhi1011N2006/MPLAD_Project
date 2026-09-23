import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../data/mockData';
import RiskBadge from '../components/common/RiskBadge';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, Mountain, Copy, FileSpreadsheet, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Scenarios() {
  const [activeScenario, setActiveScenario] = useState('SCENARIO_1');

  const scenariosList = [
    {
      id: 'SCENARIO_1',
      title: 'Scenario 1: Normal Project',
      projectId: 'MPLAD-2026-MH-006',
      icon: CheckCircle2,
      riskLevel: 'LOW',
      riskScore: 15,
      description: 'Gram Panchayat Concrete Road & Drainage Network',
      summary: 'Project completed within sanctioned budget (₹18L) and target timeframe with full officer sign-off.',
      aiReasoning: '✅ All baseline metrics within normal standard deviations. No GPS proximity matches or budget overruns.'
    },
    {
      id: 'SCENARIO_2',
      title: 'Scenario 2: High Cost Explained by Mountain Terrain',
      projectId: 'MPLAD-2026-MH-002',
      icon: Mountain,
      riskLevel: 'LOW',
      riskScore: 22,
      description: 'Trimbak Mountain Link Road (2.2 km)',
      summary: 'Project cost (₹35L) is higher than plain roads, but normalized unit cost per km fits mountain terrain parameters.',
      aiReasoning: '✅ Contextual ML module detected Mountain terrain classification. Unit cost ₹15.9L/km is within normal mountain benchmark range (₹15L–₹18L/km).'
    },
    {
      id: 'SCENARIO_3',
      title: 'Scenario 3: Duplicate Asset / Hall (Different GPS & Angles)',
      projectId: 'MPLAD-2026-MH-005A',
      icon: Copy,
      riskLevel: 'CRITICAL',
      riskScore: 92,
      description: 'Primary Health Center Emergency Ward (Site A vs Block B)',
      summary: 'Two distinct projects submitted within 12 meters distance with 89% photo vector similarity.',
      aiReasoning: '⚠️ CRITICAL DUPLICATE SIGNAL: Haversine distance 12.4m, ResNet image embedding cosine similarity 0.89, matching contractor and sanctioned amount.'
    },
    {
      id: 'SCENARIO_4',
      title: 'Scenario 4: Contractor vs Citizen Discrepancy',
      projectId: 'MPLAD-2026-MH-003',
      icon: FileSpreadsheet,
      riskLevel: 'CRITICAL',
      riskScore: 84,
      description: 'Panchayat Samiti Hall Extension',
      summary: 'Contractor reports 70% physical completion, whereas 3 independent geotagged citizen reports show only 40%.',
      aiReasoning: '⚠️ HIGH DISCREPANCY: Reported progress (70%) conflicts with NLP-clustered field reports (40%). Expenditure is at 84%.'
    },
    {
      id: 'SCENARIO_5',
      title: 'Scenario 5: High Expenditure Mismatch (85% Spent, 35% Progress)',
      projectId: 'MPLAD-2026-MH-001',
      icon: AlertTriangle,
      riskLevel: 'HIGH',
      riskScore: 78,
      description: 'Multipurpose Community Hall at Dindori',
      summary: '₹18 Lakhs (90% of budget) disbursed while physical completion stands at only 40%.',
      aiReasoning: '⚠️ ANOMALY DETECTED: Disproportionate financial payout relative to physical milestone completion ratio (ratio 2.25).'
    },
    {
      id: 'SCENARIO_6',
      title: 'Scenario 6: Significant Milestone Project Delay',
      projectId: 'MPLAD-2026-MH-004',
      icon: Clock,
      riskLevel: 'HIGH',
      riskScore: 75,
      description: 'Solar Borewell & Water Tank Installation',
      summary: 'Project target completion was Nov 2025 (overdue by 10 months) with 3 missing contractor weekly reports.',
      aiReasoning: '⚠️ DELAY RISK: Project schedule overrun exceeds 300 days without uploaded progress updates.'
    }
  ];

  const currentScen = scenariosList.find(s => s.id === activeScenario) || scenariosList[0];
  const targetProject = MOCK_PROJECTS.find(p => p.id === currentScen.projectId) || MOCK_PROJECTS[0];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Core Prototype Verification Scenarios
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Interactive AI Surveillance Test Cases</h1>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Select any of the 6 required prototype scenarios to inspect how the multi-signal AI engine evaluates cost anomalies, terrain context, duplicate assets, and citizen discrepancies.
        </p>
      </div>

      {/* Scenario Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenariosList.map((scen) => {
          const Icon = scen.icon;
          const isSelected = activeScenario === scen.id;
          return (
            <button
              key={scen.id}
              onClick={() => setActiveScenario(scen.id)}
              className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-blue-600'}`} />
                <RiskBadge score={scen.riskScore} level={scen.riskLevel} size="sm" />
              </div>
              <h3 className="font-bold text-xs">{scen.title}</h3>
              <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {scen.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed Selected Scenario Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Selected Target: {targetProject.id}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-2">{currentScen.title}</h2>
            <p className="text-xs text-slate-600">{currentScen.summary}</p>
          </div>
          <Link
            to={`/projects/${targetProject.id}`}
            className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-sm shrink-0"
          >
            Inspect Project Deep-Dive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Explainable AI Reasoning Box */}
        <div className="bg-slate-900 text-slate-100 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> EXPLAINABLE AI REASONING OUTPUT
            </span>
            <RiskBadge score={currentScen.riskScore} level={currentScen.riskLevel} size="sm" />
          </div>
          <div className="text-xs leading-relaxed font-mono text-slate-200 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            {currentScen.aiReasoning}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            * Note: All AI reasoning results are generated as assistance for human verification.
          </p>
        </div>
      </div>
    </div>
  );
}
