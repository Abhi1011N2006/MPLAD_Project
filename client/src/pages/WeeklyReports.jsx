import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { MOCK_PROJECTS } from '../data/mockData';
import { submitWeeklyReport } from '../services/api';
import {
  FileCheck,
  Upload,
  MapPin,
  IndianRupee,
  Send,
  CheckCircle2,
  ShieldAlert,
  FileText,
  Receipt,
  Paperclip,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

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

  // Weekly Expenditure Bills State
  const [uploadedBills, setUploadedBills] = useState([
    {
      id: 'BILL-101',
      name: 'Invoice_Concrete_Materials_W14.pdf',
      size: '1.2 MB',
      type: 'Vendor Material Invoice',
      uploadedAt: new Date().toISOString().split('T')[0]
    }
  ]);
  const [billCategory, setBillCategory] = useState('Material Invoice');

  // ROUTE GUARD: Block Citizens from viewing or submitting Contractor Weekly Reports
  if (currentRole?.id === 'citizen') {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-2xl border border-rose-200 shadow-xl text-center space-y-4 font-sans">
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newBills = files.map((f, i) => ({
      id: `BILL-${Date.now()}-${i}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      type: billCategory,
      uploadedAt: new Date().toISOString().split('T')[0]
    }));

    setUploadedBills((prev) => [...prev, ...newBills]);
  };

  const handleRemoveBill = (id) => {
    setUploadedBills((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const spentNum = parseFloat(amountSpent) || 0;

    if (spentNum > 0 && uploadedBills.length === 0) {
      if (!confirm("Notice: Weekly expenditure is reported, but no spending bills are attached. Do you still wish to submit without bill attachments?")) {
        return;
      }
    }

    setSubmitted(true);

    const payload = {
      projectId: selectedProject,
      weekNumber: parseInt(weekNumber) || 14,
      progressPercentage: parseFloat(progress) || 45,
      amountSpent: spentNum,
      workersCount: parseInt(workers) || 24,
      materialsUsed: materials,
      obstacles: delays,
      billsAttached: uploadedBills,
      submittedBy: currentRole?.label || 'Contractor Agency'
    };

    await submitWeeklyReport(payload);

    setTimeout(() => {
      setSubmitted(false);
      alert(`Weekly Contractor Report for Week ${weekNumber} submitted successfully with ${uploadedBills.length} Spending Bill/Invoice attachments & processed by AI Audit Service!`);
    }, 1200);
  };

  const hasSpending = parseFloat(amountSpent) > 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-slate-900">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600" /> Weekly Contractor Progress & Expenditure Submission
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Mandatory field submission for contractors and site engineers. Attach weekly bills/invoices whenever spending is reported for AI financial audit verification.
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
            <label className="text-xs font-semibold text-slate-700">Cumulative Physical Progress (%)</label>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 font-bold text-blue-700"
              required
            />
          </div>

          {/* Amount Spent & Workers */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Amount Spent This Week (₹)</label>
              {hasSpending && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Spending Declared
                </span>
              )}
            </div>
            <input
              type="number"
              value={amountSpent}
              onChange={(e) => setAmountSpent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
              placeholder="0"
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
            <label className="text-xs font-semibold text-slate-700">Materials Procured & Consumed</label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Delays / Issues */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Obstacles / Delays Encountered</label>
            <textarea
              rows="2"
              value={delays}
              onChange={(e) => setDelays(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* WEEKLY SPENDING BILLS UPLOAD SECTION (Mandatory/Recommended when Spending > 0) */}
        <div className={`p-5 rounded-xl border space-y-4 transition-all ${
          hasSpending ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" /> Upload Spending Bills, Receipts & Invoices
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {hasSpending
                  ? `Weekly spending of ₹${Number(amountSpent).toLocaleString('en-IN')} declared. Upload GST invoices or payment receipts as audit proof.`
                  : 'Optionally upload purchase receipts or vouchers for this week.'}
              </p>
            </div>
            {hasSpending && (
              <span className="text-xs bg-blue-600 text-white font-bold px-3 py-1 rounded-full shadow-2xs self-start sm:self-auto">
                {uploadedBills.length} Bill{uploadedBills.length === 1 ? '' : 's'} Attached
              </span>
            )}
          </div>

          {/* Category Select & Drag-and-Drop / File Upload Button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Bill Category</label>
              <select
                value={billCategory}
                onChange={(e) => setBillCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
              >
                <option value="Material Invoice">Material Purchase Invoice</option>
                <option value="Labor Muster Roll">Labor Muster / Wage Receipt</option>
                <option value="Equipment Rental">Machinery & Equipment Rental</option>
                <option value="Fuel Voucher">Fuel & Transport Receipt</option>
                <option value="Subcontractor Bill">Subcontractor Bill Copy</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <label className="w-full cursor-pointer bg-white hover:bg-blue-50 border-2 border-dashed border-blue-300 hover:border-blue-500 p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold text-blue-700 shadow-2xs">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span>Select & Upload Invoice File (PDF, PNG, JPG)</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* List of Attached Bills */}
          {uploadedBills.length > 0 ? (
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Attached Spending Invoices ({uploadedBills.length})</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {uploadedBills.map((bill) => (
                  <div key={bill.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate text-[11px]">{bill.name}</p>
                        <p className="text-[10px] text-slate-500">{bill.type} • {bill.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200 hidden sm:inline-block">
                        Verified
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBill(bill.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove attached bill"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            hasSpending && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>No spending bill attached yet. Please attach at least 1 invoice or payment voucher for financial auditing.</span>
              </div>
            )
          )}
        </div>

        {/* Photo & GPS Geotag Section */}
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2">
          <Upload className="w-8 h-8 text-slate-400" />
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700">Upload Geotagged Site Photograph</p>
            <p className="text-[11px] text-slate-500">EXIF GPS tags will be extracted automatically by AI embedding pipeline</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitted}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {submitted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> Processing AI Financial & Spatial Audit...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Weekly Contractor Progress & Spending Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
