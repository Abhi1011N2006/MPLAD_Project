import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_SUMMARY, MOCK_PROJECTS } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ShieldCheck,
  FolderKanban,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Users,
  Search,
  Sparkles,
  BellRing,
  FileText,
  Building2,
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';

const publicMarkerIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
    <circle cx="12" cy="12" r="4" fill="#ffffff"/>
  </svg>`,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -32],
});

export default function LandingPage() {
  const mapCenter = [20.0, 73.8];
  const [activeTab, setActiveTab] = useState('all');

  const announcements = [
    {
      id: 'ANN-01',
      date: '2026-09-21',
      title: 'Urgent Notice: Q3 MPLADS Physical Progress Upload Deadline',
      category: 'Public Notice',
      urgent: true,
      text: 'All implementing agencies must submit geotagged physical progress updates for Q3 work by Oct 15, 2026.'
    },
    {
      id: 'ANN-02',
      date: '2026-09-18',
      title: 'New AI Multi-Modal Risk Surveillance Engine Live',
      category: 'MoSPI Update',
      urgent: false,
      text: 'Sentinel-1 SAR satellite spectral audit and EXIF distance verification activated across all 1,002 projects.'
    },
    {
      id: 'ANN-03',
      date: '2026-09-15',
      title: 'Gram Sabha Participatory Audit Portal Expansion',
      category: 'Citizen Portal',
      urgent: false,
      text: 'Citizens can now lodge ground observations with automatic AI corroboration scoring.'
    }
  ];

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto text-slate-900 font-sans">
      {/* 1. URGENT ANNOUNCEMENTS & ALERTS BANNER (Essential Homepage Element) */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                URGENT PUBLIC NOTICE
              </span>
              <span className="text-xs text-amber-800 font-bold">2026-09-21</span>
            </div>
            <p className="text-xs text-amber-950 font-bold mt-0.5">
              Q3 MPLADS Physical Progress Submission Deadline: Oct 15, 2026 • AI Satellite Pass Audit Active.
            </p>
          </div>
        </div>
        <Link
          to="/tenders"
          className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs whitespace-nowrap shrink-0"
        >
          View All Announcements
        </Link>
      </div>

      {/* 2. OFFICIAL NIRISHA AI HERO BANNER IMAGE CARD */}
      <div className="relative rounded-3xl border border-blue-200 shadow-xl overflow-hidden bg-white">
        <div className="relative w-full max-h-[500px] overflow-hidden">
          <img
            src="/nirisha_banner.jpg"
            alt="NIRISHA AI National Integrated Risk & Intelligence System for Holistic Assessment"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        </div>

        {/* Hero Callout Bar */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-3 flex flex-col items-center text-center bg-slate-950/80 backdrop-blur-xs border-t border-slate-800">
          <div className="inline-flex items-center gap-2 bg-blue-600/30 text-sky-300 text-xs font-bold px-4 py-1.5 rounded-full border border-sky-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Government of India • Ministry of Statistics & Programme Implementation
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            NIRISHA AI — National Integrated Risk & Intelligence System
          </h1>

          <p className="text-xs sm:text-sm text-cyan-300 font-semibold tracking-wide font-mono">
            TRANSPARENT • DATA-DRIVEN • ACCESSIBLE • PUBLIC SURVEILLANCE PORTAL
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md"
            >
              <UserCheck className="w-4 h-4" /> LOGIN TO PLATFORM
            </Link>

            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl hover:bg-slate-700 transition-all shadow-md"
            >
              <Search className="w-4 h-4 text-sky-400" /> EXPLORE PUBLIC GIS MAP
            </Link>
          </div>
        </div>
      </div>

      {/* 4. PUBLIC AGGREGATE STATISTICS (MINIMALIST & FLAT DESIGN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Total Sanctioned Works</span>
          <h3 className="text-2xl font-black text-slate-900">{MOCK_SUMMARY.totalProjects}</h3>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Registered
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Sanctioned Budget</span>
          <h3 className="text-2xl font-black text-blue-900">₹24.50 Cr</h3>
          <span className="text-[11px] text-slate-500 font-medium">MPLADS Fund Allocation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs space-y-1">
          <span className="text-xs text-emerald-800 font-bold block">Completed Assets</span>
          <h3 className="text-2xl font-black text-emerald-700">{MOCK_SUMMARY.completedProjects}</h3>
          <span className="text-[11px] text-emerald-700 font-semibold">Verified Ground Progress</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-xs space-y-1">
          <span className="text-xs text-blue-800 font-bold block">Ongoing Works</span>
          <h3 className="text-2xl font-black text-blue-700">{MOCK_SUMMARY.ongoingProjects}</h3>
          <span className="text-[11px] text-blue-700 font-semibold">Active Execution</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs space-y-1">
          <span className="text-xs text-amber-900 font-bold block">Under AI Surveillance</span>
          <h3 className="text-2xl font-black text-amber-700">{MOCK_SUMMARY.highRiskProjects + MOCK_SUMMARY.delayedProjects}</h3>
          <span className="text-[11px] text-amber-800 font-semibold">Multi-Signal Monitoring</span>
        </div>
      </div>

      {/* 5. PUBLIC INTERACTIVE GIS OVERVIEW MAP */}
      <div id="public-map" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" /> Geographic Public Project Map
            </h3>
            <p className="text-xs text-slate-500">Interactive overview of sanctioned constituency development works across India.</p>
          </div>
          <Link to="/login" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
            Officer Login for Advanced Layers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200">
          <MapContainer center={mapCenter} zoom={10} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MOCK_PROJECTS.slice(0, 50).map((p) => (
              <Marker key={p.id} position={[p.latitude, p.longitude]} icon={publicMarkerIcon}>
                <Popup>
                  <div className="p-1 text-xs space-y-1 max-w-xs font-sans">
                    <span className="font-mono font-bold text-blue-700 block">{p.id}</span>
                    <h4 className="font-bold text-slate-900">{p.name}</h4>
                    <div className="text-[11px] text-slate-600">Location: {p.village}, {p.district}</div>
                    <div className="text-[11px] text-slate-600">Terrain: <strong className="text-slate-800">{p.terrainType}</strong></div>
                    <div className="text-[11px] font-bold text-emerald-700">Status: {p.status} ({p.progressPercentage}%)</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
