import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_CONTRACTORS, MOCK_PROJECTS } from '../data/mockData';
import { Building2, ShieldCheck, Phone, Mail, UserCheck, FileText, Lock, Search, ArrowRight, FolderKanban } from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';

export default function ContractorProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const contractorIdParam = searchParams.get('id');
  const contractorNameParam = searchParams.get('name');

  const [selectedContractor, setSelectedContractor] = useState(MOCK_CONTRACTORS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (contractorIdParam) {
      const found = MOCK_CONTRACTORS.find(c => c.contractorId === contractorIdParam);
      if (found) setSelectedContractor(found);
    } else if (contractorNameParam) {
      const found = MOCK_CONTRACTORS.find(c => c.companyName.toLowerCase().includes(contractorNameParam.toLowerCase()));
      if (found) setSelectedContractor(found);
    }
  }, [contractorIdParam, contractorNameParam]);

  const contractorProjects = MOCK_PROJECTS.filter(p =>
    p.contractor && p.contractor.toLowerCase().includes(selectedContractor.companyName.toLowerCase())
  );

  const filteredContractors = MOCK_CONTRACTORS.filter(c =>
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-900">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-blue-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Authorized Contractor Agencies Registry
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Central Ministry surveillance desk for verifying empaneled implementing contractors, agency profiles, and assigned contract performance.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl border border-blue-200 font-bold">
          Total Empaneled Agencies: {MOCK_CONTRACTORS.length}
        </div>
      </div>

      {/* Contractor Selection Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contractor by name, ID, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          <select
            value={selectedContractor.contractorId}
            onChange={(e) => {
              const found = MOCK_CONTRACTORS.find(c => c.contractorId === e.target.value);
              if (found) {
                setSelectedContractor(found);
                setSearchParams({ id: found.contractorId });
              }
            }}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-auto"
          >
            {filteredContractors.map(c => (
              <option key={c.contractorId} value={c.contractorId}>
                {c.contractorId} - {c.companyName} ({c.state})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Tabs Pill List */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          {MOCK_CONTRACTORS.map(c => {
            const isSelected = c.contractorId === selectedContractor.contractorId;
            return (
              <button
                key={c.contractorId}
                onClick={() => {
                  setSelectedContractor(c);
                  setSearchParams({ id: c.contractorId });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all font-bold ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {c.companyName} ({c.contractorId})
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Contractor Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-blue-50 text-blue-800 font-bold px-2.5 py-0.5 rounded border border-blue-200">
                ID: {selectedContractor.contractorId}
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded border border-emerald-200">
                {selectedContractor.eligibilityStatus}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-blue-900 mt-2">{selectedContractor.companyName}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {selectedContractor.companyType} • Registration: <code className="font-mono text-blue-700 font-bold">{selectedContractor.registrationNumber}</code> • State: <strong className="text-slate-800">{selectedContractor.state}</strong>
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-right text-xs shrink-0">
            <span className="text-slate-500 block text-[11px]">Assigned Projects</span>
            <span className="text-lg font-black text-blue-700">{contractorProjects.length > 0 ? contractorProjects.length : 1} Active Projects</span>
          </div>
        </div>

        {/* Corporate Details Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-blue-600" /> Corporate Entity & Registration Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px]">Company Name</span>
              <strong className="text-slate-900 font-bold">{selectedContractor.companyName}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px]">Contractor ID</span>
              <strong className="text-slate-900 font-mono font-bold text-blue-700">{selectedContractor.contractorId}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px]">Registration No</span>
              <strong className="text-slate-900 font-mono font-bold">{selectedContractor.registrationNumber}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px]">Registration Status</span>
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold border border-emerald-300">
                {selectedContractor.registrationStatus || 'Active'}
              </span>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px]">Registered Office Address</span>
              <strong className="text-slate-900">{selectedContractor.registeredAddress}</strong>
            </div>
          </div>
        </div>

        {/* Contact Representative Details */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <UserCheck className="w-4 h-4 text-emerald-600" /> Authorized Contact Representative
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px]">Representative Name</span>
              <strong className="text-slate-900">{selectedContractor.contactDetails?.representative || 'Rajesh Sharma'}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px]">Official Email</span>
              <strong className="text-slate-900 font-mono">{selectedContractor.contactDetails?.email || 'contact@agency.gov.in'}</strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium block text-[11px]">Contact Number</span>
              <strong className="text-slate-900 font-mono">{selectedContractor.contactDetails?.phone || '+91 98220 11223'}</strong>
            </div>
          </div>
        </div>

        {/* Assigned Projects Table */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <FolderKanban className="w-4 h-4 text-blue-600" /> Projects Executed by {selectedContractor.companyName}
          </h3>

          <div className="space-y-2">
            {contractorProjects.length === 0 ? (
              <p className="text-slate-500 italic p-3 bg-slate-50 rounded-xl">No active projects logged for this contractor.</p>
            ) : (
              contractorProjects.slice(0, 5).map(p => (
                <div key={p.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-100 transition-colors">
                  <div>
                    <span className="font-mono font-bold text-blue-700">{p.id}</span>
                    <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                    <span className="text-[11px] text-slate-500">{p.village}, {p.district}, {p.state} • Progress: <strong className="text-blue-700">{p.progressPercentage}%</strong></span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <RiskBadge score={p.riskScore} level={p.riskLevel} size="sm" />
                    <Link
                      to={`/projects/${p.id}`}
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                    >
                      Inspect <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security Privacy Footer */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Empaneled contractor agency profile stored in eSAKSHI MoSPI registry. Compliant with Public Procurement Privacy Rules.</span>
        </div>
      </div>
    </div>
  );
}
