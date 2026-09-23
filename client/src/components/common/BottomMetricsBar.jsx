import React from 'react';
import { FolderKanban, FileSpreadsheet, FileCheck, HardHat, CheckCircle2, AlertOctagon, Layers } from 'lucide-react';

export default function BottomMetricsBar() {
  const metrics = [
    { label: 'Total Projects', count: '1,006', color: 'text-white', border: 'border-slate-700/80', bg: 'bg-slate-900/90', icon: FolderKanban },
    { label: 'Recommendations', count: '49', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-950/40', icon: FileSpreadsheet },
    { label: 'Sanctioned', count: '112', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-950/40', icon: Layers },
    { label: 'Tendered', count: '80', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/40', icon: FileCheck },
    { label: 'Construction', count: '33', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-950/40', icon: HardHat },
    { label: 'Completed', count: '35', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/40', icon: CheckCircle2 },
    { label: 'Risk Alerts', count: '29', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-950/40', icon: AlertOctagon }
  ];

  return (
    <div className="bg-[#0B132B] border-t border-slate-800 p-2.5 shadow-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 max-w-7xl mx-auto">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`${m.bg} ${m.border} border rounded-xl p-3 flex flex-col items-center justify-center transition-all hover:scale-105 shadow-md`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-4 h-4 ${m.color}`} />
                <span className={`text-2xl font-black ${m.color} tracking-tight font-mono`}>
                  {m.count}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider text-center">
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
