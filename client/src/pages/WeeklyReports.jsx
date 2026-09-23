import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { MOCK_PROJECTS } from '../data/mockData';
import { FileCheck, Upload, MapPin, IndianRupee, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function WeeklyReports() {
  const { currentRole } = useRole();
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0].id);
  const [weekNumber, setWeekNumber] = useState('14');
  const [progress, setProgress] = useState('45');
  const [amountSpent, setAmountSpent] = useState('150000');
  const [materials, setMaterials] = useState('Ready-mix Concrete, Steel TMT Bars 12mm, Bricks');
  const [workers, setWorkers] = useState('24');
  const [delays, setDelays] = useState('Minor delay due to monsoonal rainfall');
  const [submitted, setSubmitted] = useState(false);

  // ROUTE GUARD: Block Citizens from viewing or submitting Contractor Weekly Reports
  if (currentRole?.id === 'citizen') {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-2xl border border-rose-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">403 Access Denied</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Public/Citizen accounts are not authorized to view or submit contractor weekly progress reports. Please use the Citizen Portal to submit public feedback or report field issues.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link to="/" className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all">
            Return to Public Portal Home
          </Link>
          <Link to="/citizen-reports" className="bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all">
            Report an Issue / Feedback
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert("Weekly Contractor Report submitted successfully & processed by AI Service!");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600" /> Weekly Contractor Progress Report Submission
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Mandatory field submission for contractors and local engineers. Reports are automatically evaluated against historical financial and spatial data.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Project Selection */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Select MPLADS Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
            >
              {MOCK_PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.name} ({p.village})
                </option>
              ))}
            </select>
          </div>

          {/* Week Number & Progress */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Week Number</label>
            <input
              type="number"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Cumulative Progress (%)</label>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Amount Spent & Workers */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Amount Spent This Week (₹)</label>
            <input
              type="number"
              value={amountSpent}
              onChange={(e) => setAmountSpent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Number of On-Site Workers</label>
            <input
              type="number"
              value={workers}
              onChange={(e) => setWorkers(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Materials Used */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Materials Used</label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Delays / Issues */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Problems / Obstacles Encountered</label>
            <textarea
              rows="2"
              value={delays}
              onChange={(e) => setDelays(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Photo & GPS Geotag Mock */}
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2">
          <Upload className="w-8 h-8 text-slate-400" />
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700">Upload Geotagged Field Photograph</p>
            <p className="text-[11px] text-slate-500">EXIF GPS tags will be extracted automatically by AI embedding pipeline</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitted}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {submitted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> Processing AI Embeddings...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Weekly Contractor Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
