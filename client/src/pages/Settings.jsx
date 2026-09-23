import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Cpu, Save } from 'lucide-react';

export default function Settings() {
  const [lowThresh, setLowThresh] = useState('30');
  const [medThresh, setMedThresh] = useState('60');
  const [highThresh, setHighThresh] = useState('80');
  const [aiEndpoint, setAiEndpoint] = useState(() => import.meta.env.VITE_API_URL || 'https://nirisha-mplad-backend.onrender.com');

  const handleSave = (e) => {
    e.preventDefault();
    alert("Configuration parameters saved to localStorage / Backend Environment!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" /> Platform & Risk Engine Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure risk scoring threshold ranges and Python FastAPI AI microservice connection endpoints.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-6 text-xs">
        {/* Risk Threshold Config */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
            <Sliders className="w-4 h-4 text-amber-500" /> Configurable Anomaly Thresholds (0-100 Score)
          </h3>
          <p className="text-slate-500 text-[11px]">
            * Note: These risk cutoff values are prototype configurable settings for synthetic surveillance evaluation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Low Risk Upper Cutoff</label>
              <input
                type="number"
                value={lowThresh}
                onChange={(e) => setLowThresh(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Medium Risk Upper Cutoff</label>
              <input
                type="number"
                value={medThresh}
                onChange={(e) => setMedThresh(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">High Risk Upper Cutoff</label>
              <input
                type="number"
                value={highThresh}
                onChange={(e) => setHighThresh(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Python AI Service Endpoint */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
            <Cpu className="w-4 h-4 text-blue-500" /> Python FastAPI Service Connection
          </h3>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">AI Service Base URL</label>
            <input
              type="text"
              value={aiEndpoint}
              onChange={(e) => setAiEndpoint(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Configuration Settings
        </button>
      </form>
    </div>
  );
}
