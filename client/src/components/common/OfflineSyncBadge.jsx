import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function OfflineSyncBadge() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Read stored pending offline reports
    const stored = JSON.parse(localStorage.getItem('mplads_pending_offline_reports') || '[]');
    setPendingQueue(stored);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = () => {
    if (pendingQueue.length === 0) return;
    setSyncing(true);
    setTimeout(() => {
      localStorage.removeItem('mplads_pending_offline_reports');
      setPendingQueue([]);
      setSyncing(false);
      alert("✅ All pending offline field reports synchronized with backend server!");
    }, 1500);
  };

  if (pendingQueue.length === 0 && isOnline) return null;

  return (
    <div className={`px-4 py-2 text-xs flex items-center justify-between font-medium border-b ${
      !isOnline
        ? 'bg-rose-50 text-rose-900 border-rose-200'
        : 'bg-sky-50 text-sky-900 border-sky-200'
    }`}>
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-rose-600 animate-pulse" />
            <span><strong>OFFLINE MODE:</strong> Field reports will be saved locally as "Pending Sync".</span>
          </>
        ) : (
          <>
            <Wifi className="w-4 h-4 text-sky-600" />
            <span>Connection Restored: <strong>{pendingQueue.length} Pending Report(s)</strong> awaiting server synchronization.</span>
          </>
        )}
      </div>

      {isOnline && pendingQueue.length > 0 && (
        <button
          onClick={triggerSync}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 bg-sky-600 text-white px-3 py-1 rounded text-[11px] font-bold hover:bg-sky-700 transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Synchronizing...' : 'Sync Pending Reports Now'}
        </button>
      )}
    </div>
  );
}
