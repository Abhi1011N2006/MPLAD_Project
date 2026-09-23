import React, { useState } from 'react';
import { Bell, X, AlertTriangle, FileText, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    {
      id: "NOTIF-2026-001",
      type: "AI Risk Alert",
      title: "High-Risk Anomaly Flagged",
      message: "Project MPLAD-2026-MH-005A flagged for 92% duplicate probability with Site B.",
      time: "10 mins ago",
      unread: true,
      link: "/alerts"
    },
    {
      id: "NOTIF-2026-002",
      type: "New Tender Published",
      title: "Tender Published in Nashik",
      message: "District Authority Nashik published Tender TND-2026-MH-101 for RCC Anganwadi Building.",
      time: "1 hour ago",
      unread: true,
      link: "/tenders"
    },
    {
      id: "NOTIF-2026-003",
      type: "Citizen Report Submitted",
      title: "Field Observation Received",
      message: "Citizen submitted photo evidence for project MPLAD-2026-MH-003 (Sinnar).",
      time: "3 hours ago",
      unread: false,
      link: "/citizen-reports"
    },
    {
      id: "NOTIF-2026-004",
      type: "Weekly Report Missing",
      title: "Overdue Contractor Report",
      message: "Solar Borewell project MPLAD-2026-MH-004 has 3 missing weekly reports.",
      time: "1 day ago",
      unread: false,
      link: "/reports"
    }
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-slate-900 text-slate-100 shadow-2xl z-50 border-l border-slate-800 flex flex-col justify-between">
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">System Notifications Stream</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-2 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
          <span>{notifications.filter(n => n.unread).length} Unread Updates</span>
          <button onClick={markAllRead} className="text-amber-400 hover:underline">Mark all as read</button>
        </div>

        <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
          {notifications.map((n) => (
            <Link
              key={n.id}
              to={n.link}
              onClick={onClose}
              className={`block p-3 rounded-xl border text-xs transition-colors ${
                n.unread
                  ? 'bg-slate-800/90 border-slate-700 text-white'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-amber-400 text-[11px]">{n.type}</span>
                <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
              </div>
              <h4 className="font-bold text-slate-100">{n.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
