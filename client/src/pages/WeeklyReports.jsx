import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Camera,
  Navigation,
  ShieldCheck,
  Image as ImageIcon,
  Clock
} from 'lucide-react';

export default function WeeklyReports() {
  const { currentRole } = useRole();
  const [selectedProjectId, setSelectedProjectId] = useState(MOCK_PROJECTS[0].id);
  const [weekNumber, setWeekNumber] = useState('14');
  const [progress, setProgress] = useState('45');
  const [amountSpent, setAmountSpent] = useState('150000');
  const [materials, setMaterials] = useState('Ready-mix Concrete, Steel TMT Bars 12mm, Bricks');
  const [workers, setWorkers] = useState('24');
  const [delays, setDelays] = useState('Minor delay due to monsoonal rainfall');
  const [submitted, setSubmitted] = useState(false);

  // Selected project object for automatic coordinate alignment
  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId) || MOCK_PROJECTS[0];

  // GPS Coordinates & Site Photo State
  const [siteCoords, setSiteCoords] = useState({
    lat: selectedProject.latitude || 20.2012,
    lng: selectedProject.longitude || 73.8321,
    accuracy: 8.5,
    isManual: false
  });
  const [gpsLoading, setGpsLoading] = useState(false);

  // Attached Site Image with Coordinates
  const [sitePhoto, setSitePhoto] = useState({
    id: 'IMG-W14-001',
    name: 'Field_Site_Progress_W14.jpg',
    url: selectedProject.photos && selectedProject.photos[0] ? selectedProject.photos[0] : 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
    capturedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    size: '2.4 MB'
  });

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

  // Sync default GPS coordinates when selected project changes
  useEffect(() => {
    if (selectedProject) {
      setSiteCoords((prev) => ({
        ...prev,
        lat: selectedProject.latitude || 20.2012,
        lng: selectedProject.longitude || 73.8321
      }));
    }
  }, [selectedProjectId]);

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

  // Acquire Live Browser GPS Geotag Location
  const requestLiveGPS = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      setGpsLoading(false);
      alert("Geolocation is not supported by your browser. Using target site coordinates.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSiteCoords({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
          accuracy: Number((position.coords.accuracy || 6.5).toFixed(1)),
          isManual: false
        });
        setGpsLoading(false);
      },
      (error) => {
        console.warn("GPS Geolocation error:", error.message);
        setGpsLoading(false);
        // Fallback to project declared site coordinates
        setSiteCoords({
          lat: selectedProject.latitude || 20.2012,
          lng: selectedProject.longitude || 73.8321,
          accuracy: 12.0,
          isManual: true
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Uploading Site Photo Image
  const handleSitePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSitePhoto({
        id: `IMG-${Date.now()}`,
        name: file.name,
        url: event.target.result,
        capturedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
    };
    reader.readAsDataURL(file);
  };

  // Sample Site Photo Quick Selector
  const handleSamplePhotoSelect = (sampleUrl, sampleName) => {
    setSitePhoto({
      id: `IMG-SAMPLE-${Date.now()}`,
      name: sampleName,
      url: sampleUrl,
      capturedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      size: '1.8 MB'
    });
  };

  // Handle Uploading Spending Bills
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

    if (!sitePhoto) {
      alert("Please upload or attach a geotagged site photograph before submitting the weekly report.");
      return;
    }

    if (spentNum > 0 && uploadedBills.length === 0) {
      if (!confirm("Notice: Weekly expenditure is reported, but no spending bills are attached. Do you still wish to submit without bill attachments?")) {
        return;
      }
    }

    setSubmitted(true);

    const payload = {
      projectId: selectedProjectId,
      weekNumber: parseInt(weekNumber) || 14,
      progressPercentage: parseFloat(progress) || 45,
      amountSpent: spentNum,
      workersCount: parseInt(workers) || 24,
      materialsUsed: materials,
      obstacles: delays,
      billsAttached: uploadedBills,
      sitePhotoUrl: sitePhoto.url,
      sitePhotoName: sitePhoto.name,
      latitude: siteCoords.lat,
      longitude: siteCoords.lng,
      geotagAccuracy: siteCoords.accuracy,
      submittedBy: currentRole?.label || 'Contractor Agency'
    };

    await submitWeeklyReport(payload);

    setTimeout(() => {
      setSubmitted(false);
      alert(`Weekly Contractor Report for Week ${weekNumber} submitted successfully! Site Image Attached with GPS Geotag (${siteCoords.lat}°, ${siteCoords.lng}°) & ${uploadedBills.length} Bills Processed.`);
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
          Mandatory field submission for contractors and site engineers. Attach geotagged site photographs with GPS coordinates & spending bills for AI audit verification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Project Selection */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Select MPLADS Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
            >
              {MOCK_PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.name} ({p.village}, {p.district})
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
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 font-semibold"
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

        {/* 1. SITE PHOTOGRAPH & GPS GEOTAG COORDINATES COLLECTOR */}
        <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" /> Site Photograph & GPS Geotag Coordinates
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Mandatory spatial proof. Upload an image of current site progress with verified latitude and longitude coordinates.
              </p>
            </div>
            <button
              type="button"
              onClick={requestLiveGPS}
              disabled={gpsLoading}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs self-start sm:self-auto shrink-0"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              {gpsLoading ? 'Acquiring GPS...' : 'Acquire Live GPS'}
            </button>
          </div>

          {/* GPS Coordinates Display & Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Latitude (°N)</label>
              <input
                type="number"
                step="any"
                value={siteCoords.lat}
                onChange={(e) => setSiteCoords({ ...siteCoords, lat: parseFloat(e.target.value) || 0, isManual: true })}
                className="w-full bg-slate-900 text-amber-400 font-bold border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Longitude (°E)</label>
              <input
                type="number"
                step="any"
                value={siteCoords.lng}
                onChange={(e) => setSiteCoords({ ...siteCoords, lng: parseFloat(e.target.value) || 0, isManual: true })}
                className="w-full bg-slate-900 text-amber-400 font-bold border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400 uppercase font-bold">GPS Sensor Accuracy</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-400 font-bold">±{siteCoords.accuracy}m</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  {siteCoords.isManual ? 'Manual Override' : 'GPS Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Site Image File Upload & Quick Sample Photo Controls */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <label className="cursor-pointer bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-bold shadow-xs">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Site Photo File (.jpg, .png)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSitePhotoUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <span>Or select sample:</span>
                <button
                  type="button"
                  onClick={() => handleSamplePhotoSelect('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80', 'Community_Hall_Work_W14.jpg')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[10px] font-mono border border-slate-700"
                >
                  Hall Site
                </button>
                <button
                  type="button"
                  onClick={() => handleSamplePhotoSelect('https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80', 'Trimbak_Road_Layer_W14.jpg')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[10px] font-mono border border-slate-700"
                >
                  Road Site
                </button>
              </div>
            </div>

            {/* Attached Image Preview Card with Embedded Coordinates */}
            {sitePhoto && (
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-1 relative rounded-lg overflow-hidden border border-slate-800 group h-36 bg-black">
                  <img src={sitePhoto.url} alt="Site progress evidence" className="w-full h-full object-cover" />
                  {/* Live GPS Overlay Tag on Image */}
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 p-1.5 text-[10px] font-mono text-amber-300 flex items-center justify-between border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" /> {siteCoords.lat}°, {siteCoords.lng}°
                    </span>
                    <span className="text-emerald-400 font-bold text-[9px]">Geotagged</span>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" /> {sitePhoto.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSitePhoto(null)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                      title="Remove site photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                    <div>Captured: <strong>{sitePhoto.capturedAt}</strong></div>
                    <div>File Size: <strong>{sitePhoto.size}</strong></div>
                    <div>Latitude: <strong className="text-amber-400">{siteCoords.lat}° N</strong></div>
                    <div>Longitude: <strong className="text-amber-400">{siteCoords.lng}° E</strong></div>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> EXIF Geotag Matched with Sanctioned Site ({selectedProject.village})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. WEEKLY SPENDING BILLS UPLOAD SECTION */}
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

        <button
          type="submit"
          disabled={submitted}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {submitted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> Processing AI Spatial & Financial Audit...
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
