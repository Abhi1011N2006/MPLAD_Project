import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { ShieldCheck, UserCheck, Key, Lock, ArrowRight, Sparkles, Building2, Globe, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { ROLES, login } = useRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [email, setEmail] = useState('ministry.admin@mplads.gov.in');
  const [password, setPassword] = useState('demo123456');
  const [selectedRole, setSelectedRole] = useState(ROLES.MINISTRY);

  const demoAccounts = [
    { role: ROLES.MINISTRY, email: 'ministry.admin@mplads.gov.in', label: 'Ministry Central Admin' },
    { role: ROLES.STATE, email: 'mah.nodal@mplads.gov.in', label: 'State Nodal Officer (Maharashtra)' },
    { role: ROLES.DISTRICT, email: 'collector.nashik@mplads.gov.in', label: 'District Magistrate (Nashik)' },
    { role: ROLES.MP, email: 'mp.nashik@loksabha.gov.in', label: 'Member of Parliament (Nashik LS)' },
    { role: ROLES.CONTRACTOR, email: 'contact@apexinfra.co.in', label: 'Apex Infra Tech Ltd (Contractor)' },
    { role: ROLES.CITIZEN, email: 'citizen.user@gmail.com', label: 'Citizen Field Inspector' },
  ];

  const handleSelectDemo = (acc) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword('demo123456');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
    const target = redirectTo ? decodeURIComponent(redirectTo) : '/dashboard';
    navigate(target);
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center p-4 sm:p-8 font-sans space-y-4">
      {/* Notice if redirected because of login requirement */}
      {redirectTo && (
        <div className="max-w-5xl w-full bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-2xl flex items-center gap-3 shadow-md text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong className="font-bold block">🔒 Authentication Required to View Project Details</strong>
            <span>Please select your role or enter credentials to sign in and inspect project information.</span>
          </div>
        </div>
      )}

      {/* eSAKSHI Official Login Container */}
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left Panel: eSAKSHI Official Branding & Parliament Image */}
        <div className="lg:col-span-6 bg-[#002B49] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-25">
            <img
              src="/nirisha_banner.jpg"
              alt="eSAKSHI Parliament Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#002B49] via-[#002B49]/80 to-transparent"></div>

          {/* Top Emblem & Header */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full border border-amber-500/40">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Government of India • MoSPI
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              eSAKSHI <span className="text-amber-400 font-mono">MPLADS</span>
            </h1>
            <p className="text-xs text-amber-200/90 font-medium leading-relaxed font-sans">
              SAnsad sadasya sthaniya KSHetra vIkas yojana (Member of Parliament Local Area Development Scheme).
            </p>
          </div>

          {/* Middle Callout Summary */}
          <div className="relative z-10 space-y-4 my-8 bg-[#0B2545]/90 p-5 rounded-2xl border border-blue-800/80 backdrop-blur-xs">
            <div className="text-xs text-cyan-300 font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> NIRISHA AI Surveillance Integration
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Unified AI-powered project surveillance engine monitoring physical progress, financial disbursements, satellite SAR passes, and citizen ground reports.
            </p>
          </div>

          {/* Footer Security Note */}
          <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-blue-900/80 pt-4 font-mono">
            <span>Secure SSL e-Governance Portal</span>
            <span className="text-emerald-400 font-bold">STQC Certified</span>
          </div>
        </div>

        {/* Right Panel: Official Login Form & Persona Switcher */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase font-mono tracking-wider">
                Official Sign In
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
                mplads.mospi.gov.in
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">eSAKSHI Portal Authentication</h2>
            <p className="text-xs text-slate-500 font-medium">Select a demo persona or enter authorized government credentials.</p>
          </div>

          {/* Demo Persona Selector Grid */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block px-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Select Active Demo Persona:
            </span>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {demoAccounts.map((acc, i) => {
                const isSelected = selectedRole.id === acc.role.id;
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleSelectDemo(acc)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#002B49] text-white font-bold shadow-sm ring-2 ring-amber-400'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <span className="truncate">{acc.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isSelected ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-slate-100 text-slate-600'}`}>
                      {acc.role.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Government ID / Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Security Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#002B49] hover:bg-blue-900 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Authenticate & Enter eSAKSHI Portal</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
