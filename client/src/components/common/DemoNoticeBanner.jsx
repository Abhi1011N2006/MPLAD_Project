import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export default function DemoNoticeBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 font-medium">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>DEMO / SYNTHETIC DATA MODE:</strong> Risk scores and anomaly signals are AI-generated estimates requiring human verification. The system does not claim automatic fraud detection.
        </span>
      </div>
      <div className="flex items-center gap-1 text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300 text-[11px]">
        <Info className="w-3 h-3" />
        <span>Prototype v1.0 • Synthetic MPLADS Dataset</span>
      </div>
    </div>
  );
}
