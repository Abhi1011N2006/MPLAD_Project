import React from 'react';
import { useRole } from '../context/RoleContext';
import { UserCog, ShieldCheck, UserCheck, Key } from 'lucide-react';

export default function Users() {
  const { ROLES, currentRole, setCurrentRole } = useRole();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserCog className="w-5 h-5 text-blue-600" /> User Roles & Role-Based Access Control (RBAC)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Switch active user persona to view role-restricted interfaces for Ministry, District Authorities, MPs, Contractors, and Citizens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(ROLES).map((role) => {
          const isSelected = currentRole.id === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setCurrentRole(role)}
              className={`p-5 rounded-xl border cursor-pointer transition-all space-y-3 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-amber-400'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isSelected ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {role.badge}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active Persona
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm leading-snug">{role.label}</h3>
                <p className={`text-xs mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  Role ID: <code className="font-mono">{role.id}</code>
                </p>
              </div>

              <button
                className={`w-full text-xs font-semibold py-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected ? 'Currently Selected' : 'Switch To This Role'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
