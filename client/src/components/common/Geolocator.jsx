import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Geolocator({ onLocationChange }) {
  const [coords, setCoords] = useState({ lat: 20.0012, lng: 73.7842 });
  const [accuracy, setAccuracy] = useState(12); // in meters
  const [isManual, setIsManual] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestGPSLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setPermissionDenied(true);
      setIsManual(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const acc = position.coords.accuracy || 8;
        setCoords(newCoords);
        setAccuracy(acc);
        setIsManual(false);
        setPermissionDenied(false);
        setLoading(false);

        if (onLocationChange) {
          onLocationChange({ ...newCoords, accuracy: acc, isManual: false });
        }
      },
      (error) => {
        console.warn("Geolocation permission denied or unavailable:", error.message);
        setPermissionDenied(true);
        setIsManual(true);
        setLoading(false);

        if (onLocationChange) {
          onLocationChange({ ...coords, accuracy: 25, isManual: true });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestGPSLocation();
  }, []);

  const handleManualAdjust = (latDelta, lngDelta) => {
    const adjusted = {
      lat: Number((coords.lat + latDelta).toFixed(6)),
      lng: Number((coords.lng + lngDelta).toFixed(6))
    };
    setCoords(adjusted);
    setIsManual(true);
    if (onLocationChange) {
      onLocationChange({ ...adjusted, accuracy: 25, isManual: true });
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>GPS Location & Geotag Validation</span>
        </div>
        <button
          type="button"
          onClick={requestGPSLocation}
          className="inline-flex items-center gap-1 bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded text-[11px] font-semibold hover:bg-slate-100"
        >
          <Navigation className="w-3 h-3 text-blue-600" /> {loading ? 'Acquiring GPS...' : 'Refresh GPS'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono bg-white p-3 rounded-lg border border-slate-200">
        <div>
          <span className="text-slate-400 block text-[10px]">Latitude</span>
          <strong className="text-slate-900">{coords.lat}</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Longitude</span>
          <strong className="text-slate-900">{coords.lng}</strong>
        </div>
      </div>

      {/* Accuracy & Verification Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        {isManual ? (
          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600" /> Manually Selected Coordinates (GPS Fallback)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold border border-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> GPS Hardware Geotag Verified
          </span>
        )}

        <span className="text-slate-500 font-mono">
          Accuracy: <strong>±{accuracy}m</strong>
        </span>
      </div>

      {accuracy > 20 && (
        <p className="text-[11px] text-amber-700 font-medium bg-amber-50 p-2 rounded border border-amber-200">
          ⚠️ GPS accuracy is low ({accuracy}m). Please verify the physical location before submitting report.
        </p>
      )}

      {/* Manual Pin Adjuster Controls */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span>Fine-tune pin location:</span>
        <div className="flex gap-1">
          <button type="button" onClick={() => handleManualAdjust(0.0005, 0)} className="px-2 py-0.5 bg-white border rounded hover:bg-slate-100">North +</button>
          <button type="button" onClick={() => handleManualAdjust(-0.0005, 0)} className="px-2 py-0.5 bg-white border rounded hover:bg-slate-100">South -</button>
          <button type="button" onClick={() => handleManualAdjust(0, 0.0005)} className="px-2 py-0.5 bg-white border rounded hover:bg-slate-100">East +</button>
          <button type="button" onClick={() => handleManualAdjust(0, -0.0005)} className="px-2 py-0.5 bg-white border rounded hover:bg-slate-100">West -</button>
        </div>
      </div>
    </div>
  );
}
