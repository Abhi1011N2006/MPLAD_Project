import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../../data/mockData';
import RiskBadge from '../common/RiskBadge';
import { Link } from 'react-router-dom';
import { Users, MapPin, Camera, Navigation, Send, ArrowRight } from 'lucide-react';
import Geolocator from '../common/Geolocator';
import MediaCapture from '../common/MediaCapture';
import { getCitizenArea, setCitizenArea, isProjectInCitizenRegion } from '../../utils/citizenRegion';

export default function CitizenDashboard() {
  const initialArea = getCitizenArea();
  const [selectedState, setSelectedState] = useState(initialArea.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState(initialArea.district || 'Nashik');
  const [selectedLocality, setSelectedLocality] = useState(initialArea.locality || 'Dindori');
  const [radiusKm, setRadiusKm] = useState(initialArea.radiusKm || '5');
  const [capturedMedia, setCapturedMedia] = useState(null);

  const updateArea = (newState, newDistrict, newLocality, newRadius) => {
    const updated = {
      state: newState,
      district: newDistrict,
      locality: newLocality,
      radiusKm: newRadius
    };
    setCitizenArea(updated);
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setSelectedState(val);
    updateArea(val, selectedDistrict, selectedLocality, radiusKm);
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setSelectedDistrict(val);
    updateArea(selectedState, val, selectedLocality, radiusKm);
  };

  const handleLocalityChange = (e) => {
    const val = e.target.value;
    setSelectedLocality(val);
    updateArea(selectedState, selectedDistrict, val, radiusKm);
  };

  const handleRadiusChange = (e) => {
    const val = e.target.value;
    setRadiusKm(val);
    updateArea(selectedState, selectedDistrict, selectedLocality, val);
  };

  const activeArea = { state: selectedState, district: selectedDistrict, locality: selectedLocality, radiusKm };
  const localProjects = MOCK_PROJECTS.filter(p => isProjectInCitizenRegion(p, activeArea));

  return (
    <div className="space-y-6">
      {/* Citizen Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
        <span className="bg-sky-500/20 text-sky-300 text-xs font-bold px-3 py-1 rounded-full border border-sky-500/30">
          PUBLIC CITIZEN TRANSPARENCY & MONITORING PORTAL
        </span>
        <h1 className="text-2xl font-bold mt-2">MPLADS Citizen Surveillance & Field Reporting</h1>
        <p className="text-xs text-slate-300 mt-1">
          Monitor public development projects in your area. Submit ground observations with GPS and photo evidence.
        </p>
      </div>

      {/* Locality Profile Setup */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm border-b pb-2">1. Select Your Monitoring Area / Locality</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">State</label>
            <select value={selectedState} onChange={handleStateChange} className="w-full bg-slate-50 border rounded-lg p-2 font-medium">
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">District</label>
            <select value={selectedDistrict} onChange={handleDistrictChange} className="w-full bg-slate-50 border rounded-lg p-2 font-medium">
              <option value="Nashik">Nashik</option>
              <option value="Pune">Pune</option>
              <option value="Thane">Thane</option>
              <option value="Aurangabad">Aurangabad</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Locality / Village / Ward</label>
            <input type="text" value={selectedLocality} onChange={handleLocalityChange} className="w-full bg-slate-50 border rounded-lg p-2 font-semibold" />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Geographic Radius (km)</label>
            <select value={radiusKm} onChange={handleRadiusChange} className="w-full bg-slate-50 border rounded-lg p-2 font-bold text-blue-600">
              <option value="2">2 km radius</option>
              <option value="5">5 km radius</option>
              <option value="10">10 km radius</option>
              <option value="25">25 km radius</option>
            </select>
          </div>
        </div>
      </div>

      {/* Local Projects Listing */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-slate-900 text-sm">Development Projects Nearby ({selectedLocality})</h3>
          <span className="text-xs text-slate-500">Public Disclosable Information</span>
        </div>

        <div className="space-y-3 text-xs">
          {localProjects.map(p => (
            <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="font-mono font-bold text-blue-600">{p.id}</span>
                <h4 className="font-bold text-slate-900">{p.name}</h4>
                <p className="text-slate-500 text-[11px]">Sanctioned Budget: ₹{(p.sanctionedAmount/100000).toFixed(2)} Lakhs • Awarded Contractor: <strong>{p.contractor}</strong></p>
              </div>
              <Link to={`/projects/${p.id}`} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-800">
                Inspect Public Record
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Field Report Submission Component */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm border-b pb-2">2. Submit Citizen Field Evidence Report</h3>

        {/* GPS Capture */}
        <Geolocator />

        {/* Camera / Photo / Video Media Capture */}
        <MediaCapture onMediaCaptured={(media) => setCapturedMedia(media)} />

        <Link
          to="/citizen-reports"
          className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md text-xs"
        >
          <Send className="w-4 h-4" /> Open Complete Citizen Complaint Form
        </Link>
      </div>
    </div>
  );
}
