import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { fetchTenders } from '../services/api';
import Pagination from '../components/common/Pagination';
import { FileText, Building2, CheckCircle2, Clock, ShieldCheck, Lock } from 'lucide-react';

export default function Tenders() {
  const { currentRole } = useRole();
  const [tenders, setTenders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  const initialTendersList = [
    {
      tenderId: "TND-2026-MH-101",
      projectId: "MPLAD-2026-MH-007",
      projectName: "Construction of Anganwadi Building at Malegaon",
      tenderTitle: "Tender for Construction of RCC Anganwadi Center",
      description: "Single-story 1200 sqft preschool building with playground and sanitation facility.",
      estimatedCost: 1500000,
      publicationDate: "2026-09-01",
      submissionDeadline: "2026-10-15",
      eligibilityRequirements: "Class B or above registered civil contractors with min 3 years experience.",
      status: "Bidding Open",
      bidsCount: 4,
      awardedContractorId: null,
      awardedContractorName: "Under Evaluation",
      awardedAmount: 0
    },
    {
      tenderId: "TND-2026-MH-102",
      projectId: "MPLAD-2026-MH-008",
      projectName: "Solar Street Lighting Project across 15 Gram Panchayats",
      tenderTitle: "Installation of 200 All-in-One LED Solar Street Lights",
      description: "Supply, installation, and 5-year comprehensive maintenance of solar LED street lights.",
      estimatedCost: 2800000,
      publicationDate: "2026-08-15",
      submissionDeadline: "2026-09-20",
      eligibilityRequirements: "MNRE empaneled solar energy system integrators.",
      status: "Awarded",
      bidsCount: 6,
      awardedContractorId: "CONT-102",
      awardedContractorName: "Sahyadri Earthmovers & Infra",
      awardedAmount: 2650000
    }
  ];

  useEffect(() => {
    fetchTenders().then((res) => {
      if (res && res.data && res.data.length > 0) setTenders(res.data);
      else setTenders(initialTendersList);
    });
  }, []);

  const totalPages = Math.ceil(tenders.length / ITEMS_PER_PAGE);
  const paginatedTenders = tenders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" /> Procurement Monitoring & Tender Surveillance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Read-only public transparency log for published MPLADS procurement tenders, bid tallies, and awarded contract values.
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] bg-slate-950 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-800 font-semibold">
          <Lock className="w-3.5 h-3.5 text-amber-400" /> Read-Only Procurement Registry
        </div>
      </div>

      {/* Tenders List */}
      <div className="space-y-4">
        {paginatedTenders.map((tender) => (
          <div key={tender.tenderId} className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-xl space-y-3 text-xs text-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-amber-400">{tender.tenderId}</span>
                <h3 className="font-bold text-white text-sm mt-0.5">{tender.tenderTitle}</h3>
                <span className="text-[11px] text-slate-400">Project: {tender.projectName} ({tender.projectId})</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                tender.status === 'Awarded' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-sky-950 text-sky-300 border-sky-800'
              }`}>
                Status: {tender.status}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">{tender.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl font-medium text-[11px] border border-slate-800">
              <div>Estimated Cost: <strong className="text-white">₹{(tender.estimatedCost/100000).toFixed(2)}L</strong></div>
              <div>Publication Date: <strong className="text-slate-300">{tender.publicationDate}</strong></div>
              <div>Deadline: <strong className="text-rose-400">{tender.submissionDeadline}</strong></div>
              <div>Total Bids Received: <strong className="text-amber-400 font-bold">{tender.bidsCount || 4} Bids</strong></div>
            </div>

            {tender.status === 'Awarded' && (
              <div className="p-3 bg-emerald-950/60 rounded-lg border border-emerald-800 flex flex-col sm:flex-row justify-between text-[11px]">
                <div>Awarded Contractor: <strong className="text-emerald-300">{tender.awardedContractorName || 'Sahyadri Earthmovers'}</strong></div>
                <div>Award Value: <strong className="text-emerald-300 font-bold">₹{(tender.awardedAmount/100000 || 26.5).toFixed(2)} Lakhs</strong></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={tenders.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
