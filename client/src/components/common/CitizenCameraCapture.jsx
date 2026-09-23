import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Upload, MapPin, Navigation, X, CheckCircle2, AlertCircle, RefreshCw, Trash2, Play, Eye } from 'lucide-react';

export default function CitizenCameraCapture({ onMediaChange, onLocationChange, defaultProjectId = 'MPLAD-2026-MH-001' }) {
  // Location state
  const [coords, setCoords] = useState({ lat: 20.0012, lng: 73.7842 });
  const [accuracy, setAccuracy] = useState(8.5);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'success' | 'manual' | 'error'

  // Media attachments list
  const [mediaList, setMediaList] = useState([]);

  // Camera modal state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraMode, setCameraMode] = useState('photo'); // 'photo' | 'video'
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Video & Canvas Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // File input ref
  const fileInputRef = useRef(null);

  // Request GPS Coordinates
  const fetchGPSCoordinates = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6))
        };
        const acc = Number((position.coords.accuracy || 5).toFixed(1));
        setCoords(newCoords);
        setAccuracy(acc);
        setGpsStatus('success');
        setGpsLoading(false);
        if (onLocationChange) {
          onLocationChange({ ...newCoords, accuracy: acc, isManual: false });
        }
      },
      (err) => {
        console.warn("GPS acquisition warning:", err.message);
        setGpsStatus('manual');
        setGpsLoading(false);
        if (onLocationChange) {
          onLocationChange({ ...coords, accuracy: 15.0, isManual: true });
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Initial GPS fetch on mount
  useEffect(() => {
    fetchGPSCoordinates();
  }, []);

  // Update parent when media list changes
  useEffect(() => {
    if (onMediaChange) {
      onMediaChange(mediaList);
    }
  }, [mediaList]);

  // Open camera modal with getUserMedia
  const openCamera = async (mode) => {
    setCameraMode(mode);
    setCameraError(null);
    setShowCameraModal(true);

    try {
      const constraints = {
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: mode === 'video'
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Webcam access error:", err);
      setCameraError("Camera hardware access is restricted or unavailable. You can upload media files or capture using browser camera fallback.");
    }
  };

  // Close camera modal
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setShowCameraModal(false);
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setRecordingSeconds(0);
  };

  // Capture photo snapshot from stream
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Geotag Watermark bar overlay on canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#fbbf24';
    const timestampStr = new Date().toLocaleString('en-IN');
    ctx.fillText(`📍 LAT: ${coords.lat}° | LNG: ${coords.lng}° | ACC: ±${accuracy}m | ${timestampStr}`, 15, canvas.height - 15);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    const newMedia = {
      id: `MED-${Date.now()}`,
      type: 'photo',
      url: dataUrl,
      filename: `Geotagged_Photo_${Date.now()}.jpg`,
      timestamp: timestampStr,
      latitude: coords.lat,
      longitude: coords.lng,
      accuracy
    };

    setMediaList((prev) => [newMedia, ...prev]);
    closeCamera();
  };

  // Start Video Recording
  const startRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];
    try {
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const timestampStr = new Date().toLocaleString('en-IN');

        const newMedia = {
          id: `MED-${Date.now()}`,
          type: 'video',
          url: videoUrl,
          filename: `Geotagged_Video_${Date.now()}.webm`,
          timestamp: timestampStr,
          latitude: coords.lat,
          longitude: coords.lng,
          accuracy
        };
        setMediaList((prev) => [newMedia, ...prev]);
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err) {
      console.error("MediaRecorder start failed:", err);
      // Fallback simulation
      simulateSampleMedia('video');
      closeCamera();
    }
  };

  // Stop Video Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    closeCamera();
  };

  // File Upload Handler (Direct image/video upload)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const isVideo = file.type.startsWith('video');
      const url = URL.createObjectURL(file);
      const timestampStr = new Date().toLocaleString('en-IN');

      const newMedia = {
        id: `MED-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: isVideo ? 'video' : 'photo',
        url: url,
        filename: file.name,
        timestamp: timestampStr,
        latitude: coords.lat,
        longitude: coords.lng,
        accuracy
      };
      setMediaList((prev) => [newMedia, ...prev]);
    });
    e.target.value = '';
  };

  // Sample media generator (for instant demo/fallback)
  const simulateSampleMedia = (type) => {
    const timestampStr = new Date().toLocaleString('en-IN');
    const samplePhotoUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80';
    const sampleVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-construction-workers-building-a-house-41481-large.mp4';

    const newMedia = {
      id: `MED-${Date.now()}`,
      type: type,
      url: type === 'photo' ? samplePhotoUrl : sampleVideoUrl,
      filename: `${type === 'photo' ? 'Geotagged_Ground_Photo' : 'Field_Inspection_Video'}_${Date.now()}.${type === 'photo' ? 'jpg' : 'mp4'}`,
      timestamp: timestampStr,
      latitude: coords.lat,
      longitude: coords.lng,
      accuracy
    };

    setMediaList((prev) => [newMedia, ...prev]);
  };

  // Delete attached media
  const removeMedia = (id) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* GPS Coordinate Display & Capture */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Live GPS Field Coordinates
          </label>
          <button
            type="button"
            onClick={fetchGPSCoordinates}
            disabled={gpsLoading}
            className="inline-flex items-center gap-1 bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-400 px-2 py-0.5 rounded text-[11px] font-semibold transition-all"
          >
            <Navigation className={`w-3 h-3 ${gpsLoading ? 'animate-spin' : ''}`} />
            {gpsLoading ? 'Acquiring Satellite Fix...' : 'Refresh GPS'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-2.5 rounded border border-slate-800 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 text-[10px] block">LATITUDE</span>
            <strong className="text-cyan-400">{coords.lat}° N</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">LONGITUDE</span>
            <strong className="text-cyan-400">{coords.lng}° E</strong>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            {gpsStatus === 'success' ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> GPS Hardware Locked
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Geotag Active (Project Site Range)
              </span>
            )}
          </span>
          <span className="font-mono">Accuracy: <strong className="text-white">±{accuracy}m</strong></span>
        </div>
      </div>

      {/* Camera & Video Action Buttons */}
      <div className="space-y-1.5">
        <label className="font-semibold text-slate-300 text-xs block">
          Add Media Evidence (Camera Photo / Video Recording)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Photo Button */}
          <button
            type="button"
            onClick={() => openCamera('photo')}
            className="flex items-center justify-center gap-1.5 p-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Take Photo</span>
          </button>

          {/* Video Button */}
          <button
            type="button"
            onClick={() => openCamera('video')}
            className="flex items-center justify-center gap-1.5 p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Video className="w-4 h-4 text-rose-400" />
            <span>Record Video</span>
          </button>

          {/* Direct File Picker / Mobile Camera */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Upload File</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            capture="environment"
            multiple
            className="hidden"
          />
        </div>
      </div>

      {/* Attached Media List / Thumbnails Gallery */}
      {mediaList.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Attached Evidence ({mediaList.length})
            </span>
            <span className="text-slate-400 font-mono text-[10px]">Auto-Geotagged</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {mediaList.map((item) => (
              <div key={item.id} className="relative group bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-md">
                <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {item.type === 'photo' ? (
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Badge Overlay */}
                <div className="absolute top-1.5 left-1.5 bg-slate-900/90 text-white px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border border-slate-700">
                  {item.type === 'photo' ? (
                    <Camera className="w-2.5 h-2.5 text-amber-400" />
                  ) : (
                    <Video className="w-2.5 h-2.5 text-rose-400" />
                  )}
                  <span>{item.type.toUpperCase()}</span>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeMedia(item.id)}
                  className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-full shadow transition-all"
                  title="Remove attachment"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                {/* Footer Metadata */}
                <div className="p-1.5 bg-slate-900 text-[9px] font-mono text-slate-300 space-y-0.5 truncate">
                  <div className="truncate text-amber-300">{item.filename}</div>
                  <div className="text-cyan-400">{item.latitude}°, {item.longitude}°</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAMERA MODAL OVERLAY */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 shadow-2xl space-y-4 text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                {cameraMode === 'photo' ? (
                  <Camera className="w-4 h-4 text-amber-400" />
                ) : (
                  <Video className="w-4 h-4 text-rose-400 animate-pulse" />
                )}
                <span>Live Ground Camera ({cameraMode === 'photo' ? 'Photo Snapshot' : 'Video Recorder'})</span>
              </div>
              <button
                type="button"
                onClick={closeCamera}
                className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Stream / Viewfinder Box */}
            <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
              {cameraError ? (
                <div className="p-4 text-center space-y-3 text-xs text-slate-300">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p>{cameraError}</p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => simulateSampleMedia(cameraMode)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      Use Sample Geotagged {cameraMode === 'photo' ? 'Photo' : 'Video'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { closeCamera(); fileInputRef.current?.click(); }}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      Choose File From Device
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Geotag HUD Overlay */}
                  <div className="absolute top-2 left-2 bg-slate-950/80 text-amber-400 font-mono text-[10px] px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-xs flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>GPS: {coords.lat}° N, {coords.lng}° E (±{accuracy}m)</span>
                  </div>

                  {/* Video Recording Status Badge */}
                  {isRecording && (
                    <div className="absolute top-2 right-2 bg-rose-600 text-white font-bold font-mono text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-pulse shadow-lg">
                      <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>REC {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:{String(recordingSeconds % 60).padStart(2, '0')}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Camera Controls */}
            {!cameraError && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => simulateSampleMedia(cameraMode)}
                  className="text-xs text-slate-400 hover:text-amber-400 underline font-medium"
                >
                  Load Sample Media
                </button>

                {cameraMode === 'photo' ? (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <Camera className="w-4 h-4" /> Capture Photo Snapshot
                  </button>
                ) : !isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <Video className="w-4 h-4" /> Start Video Recording
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-pulse"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Stop & Attach Video
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeCamera}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
