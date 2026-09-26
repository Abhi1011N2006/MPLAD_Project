import React, { useState, useEffect } from 'react';
import { MOCK_CITIZEN_REPORTS, MOCK_PROJECTS } from '../data/mockData';
import Pagination from '../components/common/Pagination';
import CitizenCameraCapture from '../components/common/CitizenCameraCapture';
import { Users, Send, AlertTriangle, ShieldCheck, MapPin, Camera, Video, Navigation, Image as ImageIcon } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { getCitizenArea, isProjectInCitizenRegion } from '../utils/citizenRegion';
import { fetchCitizenReports, submitCitizenReport } from '../services/api';

export default function CitizenReports() {
  const { currentRole } = useRole();
  const isCitizen = currentRole?.id === 'citizen';
  const citizenArea = isCitizen ? getCitizenArea() : null;

  const selectableProjects = isCitizen
    ? MOCK_PROJECTS.filter((p) => isProjectInCitizenRegion(p, citizenArea))
    : MOCK_PROJECTS;

  const [reports, setReports] = useState(MOCK_CITIZEN_REPORTS);
  const [projectId, setProjectId] = useState(selectableProjects[0]?.id || MOCK_PROJECTS[0].id);
  const [reportType, setReportType] = useState('Incorrect progress reported');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Geotag & Media state from CitizenCameraCapture component
  const [locationData, setLocationData] = useState({ lat: 20.0012, lng: 73.7842, accuracy: 8.5 });
  const [attachedMedia, setAttachedMedia] = useState([]);

  const ITEMS_PER_PAGE = 10;

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
          setReports([...backendList, ...missingMocks]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateReport = async (e) => {
    e.preventDefault();

    const photoItem = attachedMedia.find(m => m.type === 'photo');
    const videoItem = attachedMedia.find(m => m.type === 'video');

    const generatedId = `CR-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newReport = {
      id: generatedId,
      reportId: generatedId,
      projectId,
      projectName: MOCK_PROJECTS.find(p => p.id === projectId)?.name || "Community Hall Development",
      reportType,
      issueType: reportType,
      description,
      submittedBy: citizenName || 'Anonymous Citizen',
      date: new Date().toISOString().split('T')[0],
      reportDate: new Date().toISOString().split('T')[0],
      latitude: locationData.lat,
      longitude: locationData.lng,
      accuracy: locationData.accuracy || 8.5,
      verificationStatus: 'Unverified',
      confidenceScore: 0.50,
      photoUrl: photoItem ? photoItem.url : null,
      videoUrl: videoItem ? videoItem.url : null,
      attachedMedia: attachedMedia
    };

    setReports((prev) => [newReport, ...prev]);

    // Save report to central Express backend database
    await submitCitizenReport(newReport);

    setDescription('');
    setCitizenName('');
    setAttachedMedia([]);
    setCurrentPage(1);

    alert(`Citizen Ground Report submitted to central database with ${attachedMedia.length} Geotagged Media Attachments & Live GPS Coordinates (${locationData.lat}°, ${locationData.lng}°)!`);
  };

  const statusColors = {
    Unverified: 'bg-slate-800 text-slate-300 border-slate-700',
    'Under Review': 'bg-amber-950 text-amber-300 border-amber-800',
    Corroborated: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    Rejected: 'bg-rose-950 text-rose-300 border-rose-800',
    Open: 'bg-blue-950 text-blue-300 border-blue-800'
  };

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginatedReports = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" /> Citizen Feedback & Field Verification Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Public reporting channel. Citizens can take live camera photo/video evidence and capture GPS field coordinates directly for automated AI verification.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-emerald-400 font-bold">
            <Camera className="w-3.5 h-3.5" /> Direct Camera & GPS Geotag Enabled
          </div>
        </div>
      </div>

      {isCitizen && citizenArea && (
        <div className="bg-sky-950/70 border border-sky-800 text-sky-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Citizen Regional Mode:</strong> Select projects located in <strong>{citizenArea.locality}, {citizenArea.district} ({citizenArea.state})</strong> for ground reporting.
            </span>
          </div>
          <span className="text-[11px] font-bold bg-sky-900 text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-700">
            {selectableProjects.length} Local Project{selectableProjects.length === 1 ? '' : 's'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Complaint Form */}
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-xl space-y-4 h-fit">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" /> Submit Geotagged Citizen Ground Report
          </h3>
          <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Select MPLADS Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-medium text-slate-200 focus:border-amber-400 focus:outline-none"
              >
                {selectableProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-medium text-slate-200 focus:border-amber-400 focus:outline-none"
              >
                <option value="Work stopped">Work stopped</option>
                <option value="Work progressing slowly">Work progressing slowly</option>
                <option value="Poor quality">Poor quality</option>
                <option value="Incorrect progress reported">Incorrect progress reported</option>
                <option value="Possible duplicate work">Possible duplicate work</option>
                <option value="Work not found">Work not found</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Description / Observations</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe ground reality, defects, or project status observed at site..."
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2 focus:border-amber-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Your Name (Optional)</label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Leave blank for anonymous citizen submission"
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* DIRECT CAMERA & GPS CAPTURE MODULE */}
            <CitizenCameraCapture
              defaultProjectId={projectId}
              onLocationChange={(loc) => setLocationData(loc)}
              onMediaChange={(media) => setAttachedMedia(media)}
            />

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md text-xs"
            >
              <Send className="w-3.5 h-3.5" /> Submit Geotagged Report for Verification
            </button>
          </form>
        </div>

        {/* Existing Citizen Reports Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Citizen Submissions & Verification Stream
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Reports: <strong className="text-amber-400">{reports.length}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {paginatedReports.map((r) => (
              <div key={r.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-xl space-y-3 text-xs text-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">{r.id}</span>
                    <span className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded font-semibold border border-slate-800 text-[11px]">
                      {r.reportType}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusColors[r.verificationStatus] || statusColors['Unverified']}`}>
                    Status: {r.verificationStatus}
                  </span>
                </div>

                <div className="font-bold text-white text-sm">{r.projectName}</div>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">{r.description}</p>

                {/* Display Media Attachments if available */}
                {((r.attachedMedia && r.attachedMedia.length > 0) || r.photoUrl || r.videoUrl) && (
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="font-semibold text-slate-300 text-[11px] flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-amber-400" /> Ground Evidence Attachments:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {r.attachedMedia && r.attachedMedia.length > 0 ? (
                        r.attachedMedia.map((m, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video relative group">
                            {m.type === 'photo' ? (
                              <img src={m.url} alt="Citizen Evidence" className="w-full h-full object-cover" />
                            ) : (
                              <video src={m.url} controls className="w-full h-full object-cover" />
                            )}
                            <span className="absolute bottom-1 left-1 bg-black/80 text-[9px] text-amber-300 px-1.5 py-0.5 rounded font-mono">
                              {m.type.toUpperCase()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <>
                          {r.photoUrl && (
                            <div className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video">
                              <img src={r.photoUrl} alt="Citizen Evidence" className="w-full h-full object-cover" />
                            </div>
                          )}
                          {r.videoUrl && (
                            <div className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video">
                              <video src={r.videoUrl} controls className="w-full h-full object-cover" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Geotag & Submitter Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span>By: <strong className="text-slate-200">{r.submittedBy}</strong> • Date: {r.date}</span>
                    {r.latitude && r.longitude && (
                      <span className="inline-flex items-center gap-1 font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {r.latitude.toFixed ? r.latitude.toFixed(4) : r.latitude}°, {r.longitude.toFixed ? r.longitude.toFixed(4) : r.longitude}°
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-cyan-400 font-bold">
                    Confidence: {(r.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Reusable Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={reports.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
