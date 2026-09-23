import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CitizenOnboardingModal({ isOpen, onClose, onSaveArea }) {
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nashik');
  const [locality, setLocality] = useState('Dindori');
  const [radius, setRadius] = useState('5');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const areaData = { state, district, locality, radiusKm: radius };
    localStorage.setItem('mplads_citizen_area', JSON.stringify(areaData));
    if (onSaveArea) onSaveArea(areaData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 text-xs">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Welcome to Citizen Portal</h3>
          <p className="text-slate-500">Set your local monitoring area to view nearby development works.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium">
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">District</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium">
              <option value="Nashik">Nashik</option>
              <option value="Pune">Pune</option>
              <option value="Thane">Thane</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Locality / Village / Ward</label>
            <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-semibold" required />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nearby Project Surveillance Radius</label>
            <select value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-blue-600">
              <option value="2">2 km radius</option>
              <option value="5">5 km radius</option>
              <option value="10">10 km radius</option>
              <option value="25">25 km radius</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Save & Start Monitoring My Area</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>
      </div>
    </div>
  );
}
