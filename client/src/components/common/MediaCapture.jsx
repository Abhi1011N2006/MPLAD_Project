import React, { useState } from 'react';
import { Camera, Video, Upload, CheckCircle2, Clock, MapPin, X } from 'lucide-react';

export default function MediaCapture({ onMediaCaptured, projectId = 'MPLAD-2026-MH-001' }) {
  const [activeMedia, setActiveMedia] = useState(null);
  const [capturing, setCapturing] = useState(false);

  const simulateCapture = (type, sampleUrl) => {
    setCapturing(true);
    setTimeout(() => {
      const mediaData = {
        type: type, // 'photo' or 'video'
        url: sampleUrl,
        filename: `${type}_evidence_${Date.now()}.${type === 'photo' ? 'jpg' : 'mp4'}`,
        capturedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' }),
        timestamp: new Date().toISOString(),
        latitude: 20.0012,
        longitude: 73.7842,
        projectId: projectId
      };
      setActiveMedia(mediaData);
      setCapturing(false);

      if (onMediaCaptured) {
        onMediaCaptured(mediaData);
      }
    }, 1200);
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-800 flex items-center gap-2">
          <Camera className="w-4 h-4 text-amber-500" /> Geotagged Field Evidence Media Collector
        </span>
        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
          EXIF Metadata Enforced
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => simulateCapture('photo', 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80')}
          className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-semibold text-slate-700 gap-1.5 transition-colors"
        >
          <Camera className="w-5 h-5 text-blue-600" />
          <span>[Take Photo]</span>
        </button>

        <button
          type="button"
          onClick={() => simulateCapture('video', 'https://assets.mixkit.co/videos/preview/mixkit-construction-workers-building-a-house-41481-large.mp4')}
          className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-semibold text-slate-700 gap-1.5 transition-colors"
        >
          <Video className="w-5 h-5 text-rose-600" />
          <span>[Record Video]</span>
        </button>

        <button
          type="button"
          onClick={() => simulateCapture('photo', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80')}
          className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-semibold text-slate-700 gap-1.5 transition-colors"
        >
          <Upload className="w-5 h-5 text-emerald-600" />
          <span>[Upload Photo]</span>
        </button>

        <button
          type="button"
          onClick={() => simulateCapture('video', 'https://assets.mixkit.co/videos/preview/mixkit-workers-in-a-building-under-construction-41483-large.mp4')}
          className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-semibold text-slate-700 gap-1.5 transition-colors"
        >
          <Upload className="w-5 h-5 text-amber-600" />
          <span>[Upload Video]</span>
        </button>
      </div>

      {/* Capturing State */}
      {capturing && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg font-medium flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 animate-spin" /> Acquiring camera sensor stream & embedding GPS metadata...
        </div>
      )}

      {/* Display Captured Media Metadata Payload */}
      {activeMedia && (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-3 relative">
          <button
            type="button"
            onClick={() => setActiveMedia(null)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Evidence Payload Attached ({activeMedia.type.toUpperCase()})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1 rounded-lg overflow-hidden border border-slate-800 bg-black max-h-32">
              {activeMedia.type === 'photo' ? (
                <img src={activeMedia.url} alt="Evidence preview" className="w-full h-full object-cover" />
              ) : (
                <video src={activeMedia.url} controls className="w-full h-full object-cover" />
              )}
            </div>

            <div className="sm:col-span-2 space-y-1.5 text-[11px] font-mono text-slate-300">
              <div>Evidence File: <strong className="text-amber-400">{activeMedia.filename}</strong></div>
              <div>Captured At: <strong>{activeMedia.capturedAt}</strong></div>
              <div>Coordinates: <strong className="text-sky-300">{activeMedia.latitude}, {activeMedia.longitude}</strong></div>
              <div>Project Target: <strong>{activeMedia.projectId}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
