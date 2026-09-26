import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../data/mockData';
import RiskBadge from '../components/common/RiskBadge';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { Map as MapIcon, Filter, Layers, Navigation, MapPin } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { getCitizenArea, isProjectInCitizenRegion } from '../utils/citizenRegion';

// Custom Leaflet Markers based on Risk Level
const createCustomIcon = (level) => {
  const colors = {
    LOW: '#10b981',
    MEDIUM: '#f59e0b',
    HIGH: '#f97316',
    CRITICAL: '#ef4444',
  };
  const color = colors[level] || '#10b981';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -38],
  });
};

export default function MapPage() {
  const { currentRole } = useRole();
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [selectedTerrainFilter, setSelectedTerrainFilter] = useState('ALL');

  const isCitizen = currentRole?.id === 'citizen';
  const citizenArea = isCitizen ? getCitizenArea() : null;

  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    if (isCitizen && !isProjectInCitizenRegion(p, citizenArea)) {
      return false;
    }
    const matchesRisk = selectedRiskFilter === 'ALL' || p.riskLevel === selectedRiskFilter;
    const matchesTerrain = selectedTerrainFilter === 'ALL' || p.terrainType === selectedTerrainFilter;
    return matchesRisk && matchesTerrain;
  });

  // Map center over Nashik, Maharashtra by default
  const center = [20.0, 73.8];

  return (
    <div className="space-y-4 font-sans text-slate-900">
      {isCitizen && citizenArea && (
        <div className="bg-sky-50 border border-sky-200 text-sky-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between font-medium shadow-2xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Citizen Regional Scope:</strong> Displaying projects within <strong>{citizenArea.locality}, {citizenArea.district} District ({citizenArea.state})</strong>.
            </span>
          </div>
          <span className="text-[11px] font-bold bg-sky-200/70 text-sky-900 px-2.5 py-0.5 rounded-full">
            {filteredProjects.length} Regional Marker{filteredProjects.length === 1 ? '' : 's'}
          </span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-blue-900 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-blue-600" /> Geographic Anomaly & GIS Surveillance Map
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time spatial monitoring of sanctioned MPLADS assets with ML anomaly markers & terrain layer.
          </p>
        </div>

        {/* Risk Legend & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200 text-slate-700">
            <span className="font-bold text-slate-500">Filters:</span>
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk (Green)</option>
              <option value="MEDIUM">Medium Risk (Yellow)</option>
              <option value="HIGH">High Risk (Orange)</option>
              <option value="CRITICAL">Critical Risk (Red)</option>
            </select>
            <select
              value={selectedTerrainFilter}
              onChange={(e) => setSelectedTerrainFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Terrains</option>
              <option value="Plain">Plain</option>
              <option value="Hilly">Hilly</option>
              <option value="Mountain">Mountain</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm h-[620px] relative overflow-hidden">
        <MapContainer center={center} zoom={10} scrollWheelZoom={true} className="w-full h-full rounded-xl">
          {/* Public Free OpenStreetMap TileLayer — 100% Free, NO Watermark, NO API Key Required */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredProjects.map((project) => (
            <Marker
              key={project.id}
              position={[project.latitude, project.longitude]}
              icon={createCustomIcon(project.riskLevel)}
            >
              <Popup>
                <div className="p-1 space-y-2 text-xs font-sans max-w-xs text-slate-900">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1">
                    <span className="font-mono font-bold text-blue-700">{project.id}</span>
                    <RiskBadge score={project.riskScore} level={project.riskLevel} size="sm" />
                  </div>
                  <h4 className="font-bold text-slate-900 leading-tight">{project.name}</h4>
                  <div className="text-slate-600 space-y-0.5 text-[11px] font-medium">
                    <div>Location: <strong className="text-slate-900">{project.village}, {project.district}</strong></div>
                    <div>Terrain: <strong className="text-blue-800">{project.terrainType}</strong></div>
                    <div>Sanctioned: <strong className="text-slate-900">₹{(project.sanctionedAmount / 100000).toFixed(1)} Lakhs</strong></div>
                    <div>Spent: <strong className="text-blue-700 font-bold">₹{(project.actualExpenditure / 100000).toFixed(1)} Lakhs</strong></div>
                    <div>Progress: <strong className="text-emerald-700 font-bold">{project.progressPercentage}%</strong></div>
                  </div>
                  <div className="pt-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] transition-all shadow-xs"
                    >
                      Inspect Full Project Details
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
