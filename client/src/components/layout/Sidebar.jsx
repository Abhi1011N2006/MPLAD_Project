import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import {
  LayoutDashboard,
  FolderKanban,
  Map,
  FileCheck,
  Users,
  AlertOctagon,
  BarChart3,
  UserCog,
  Settings,
  Sparkles,
  ShieldAlert,
  FileText,
  Building2,
  FileSpreadsheet,
  Home,
  IndianRupee,
  Briefcase
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { currentRole } = useRole();

  // Hide left sidebar on first entering landing page (/) and login page (/login)
  // Only show left sidebar after login when navigating to internal dashboards / features
  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  const roleId = currentRole?.id || 'citizen';
  const isContractor = roleId === 'contractor';

  // Specific role-tailored navigation items
  const roleNavItems = {
    ministry: [
      { label: 'Public Portal Home', path: '/', icon: Home },
      { label: 'Ministry Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'All India Projects', path: '/projects', icon: FolderKanban },
      { label: 'Financial Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'Tenders Surveillance', path: '/tenders', icon: FileText },
      { label: 'Contracts Registry', path: '/contractor/contracts', icon: Briefcase },
      { label: 'Contractor Profiles', path: '/contractor/profile', icon: Building2 },
      { label: 'Contractor History', path: '/contractor/history', icon: FileSpreadsheet },
      { label: 'AI Risk Alerts', path: '/alerts', icon: AlertOctagon, badge: 'High Risk' },
      { label: 'Interactive GIS Map', path: '/map', icon: Map },
      { label: 'Weekly Progress Reports', path: '/reports', icon: FileCheck },
      { label: 'Citizen Reports', path: '/citizen-reports', icon: Users },
      { label: 'Audit / Activity Scenarios', path: '/scenarios', icon: Sparkles, highlight: true },
    ],
    state: [
      { label: 'Public Portal Home', path: '/', icon: Home },
      { label: 'State Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'State Projects', path: '/projects', icon: FolderKanban },
      { label: 'State Financial Progress', path: '/analytics', icon: BarChart3 },
      { label: 'Tenders & Procurement', path: '/tenders', icon: FileText },
      { label: 'Contracts', path: '/contractor/contracts', icon: Briefcase },
      { label: 'Contractors & Agencies', path: '/contractor/profile', icon: Building2 },
      { label: 'AI Risk Alerts', path: '/alerts', icon: AlertOctagon, badge: 'State Alerts' },
      { label: 'Interactive State Map', path: '/map', icon: Map },
    ],
    district: [
      { label: 'Public Portal Home', path: '/', icon: Home },
      { label: 'District Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Assigned District Projects', path: '/projects', icon: FolderKanban },
      { label: 'Recommendations', path: '/projects', icon: FileSpreadsheet },
      { label: 'Tenders & Bidding Control', path: '/tenders', icon: FileText },
      { label: 'Contracts Management', path: '/contractor/contracts', icon: Briefcase },
      { label: 'Contractors & Agencies', path: '/contractor/profile', icon: Building2 },
      { label: 'Payments & Bills', path: '/contractor/payments', icon: IndianRupee },
      { label: 'AI Risk Alerts', path: '/alerts', icon: AlertOctagon, badge: 'District' },
      { label: 'District GIS Map', path: '/map', icon: Map },
    ],
    mp: [
      { label: 'Public Portal Home', path: '/', icon: Home },
      { label: 'Constituency Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'My Constituency Projects', path: '/projects', icon: FolderKanban },
      { label: 'Financial Progress', path: '/analytics', icon: BarChart3 },
      { label: 'Tender Summaries', path: '/tenders', icon: FileText },
      { label: 'Awarded Contractors', path: '/contractor/profile', icon: Building2 },
      { label: 'AI Risk Alerts', path: '/alerts', icon: AlertOctagon },
      { label: 'Constituency Map', path: '/map', icon: Map },
    ],
    contractor: [
      { label: 'Public Portal Home', path: '/', icon: Home },
      { label: 'Contractor Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'My Profile', path: '/contractor/profile', icon: Building2 },
      { label: 'My Contracts', path: '/contractor/contracts', icon: Briefcase },
      { label: 'Active Projects', path: '/projects', icon: FolderKanban },
      { label: 'Weekly Progress Reports', path: '/reports', icon: FileCheck },
      { label: 'Bills & Payments Ledger', path: '/contractor/payments', icon: IndianRupee },
      { label: 'Contract Performance History', path: '/contractor/history', icon: FileSpreadsheet },
      { label: 'Issues & Alerts', path: '/alerts', icon: AlertOctagon, badge: 'Active' },
      { label: 'Interactive Project Map', path: '/map', icon: Map },
    ],
    citizen: [
      { label: 'Public Portal Home', path: '/', icon: Home },
      { label: 'My Area Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Nearby Public Projects', path: '/projects', icon: FolderKanban },
      { label: 'Public Project Map', path: '/map', icon: Map },
      { label: 'Public Tender Info', path: '/tenders', icon: FileText },
      { label: 'Report an Issue / Feedback', path: '/citizen-reports', icon: Users },
    ]
  };

  const navItems = roleNavItems[roleId] || roleNavItems.citizen;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between text-slate-700 min-h-[calc(100vh-65px)] shadow-xs">
      <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {isContractor ? 'Contractor Execution Desk' : 'Platform Navigation'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? item.highlight
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-blue-50 text-blue-700 font-extrabold border-l-4 border-blue-600 shadow-2xs'
                    : item.highlight
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 text-slate-500 group-hover:text-blue-600" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Role Footer Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-semibold">Active Scope:</span>
          <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {currentRole.badge}
          </span>
        </div>
      </div>
    </aside>
  );
}
