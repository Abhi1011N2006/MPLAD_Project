import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const ROLES = {
  MINISTRY: { id: 'ministry', label: 'Ministry of Statistics & Programme Implementation', badge: 'National' },
  STATE: { id: 'state', label: 'State Nodal Authority (Maharashtra)', badge: 'State Level' },
  DISTRICT: { id: 'district', label: 'District Authority (Nashik)', badge: 'District Level' },
  MP: { id: 'mp', label: 'Member of Parliament (Lok Sabha)', badge: 'Constituency' },
  CONTRACTOR: { id: 'contractor', label: 'Contractor / Implementing Agency', badge: 'Agency' },
  CITIZEN: { id: 'citizen', label: 'Citizen Portal', badge: 'Public' },
};

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRoleState] = useState(() => {
    try {
      const saved = localStorage.getItem('mplads_active_role');
      if (saved) {
        const match = Object.values(ROLES).find(r => r.id === saved || r.id === saved.toLowerCase());
        if (match) return match;
      }
    } catch (e) {}
    return ROLES.MINISTRY;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('mplads_is_logged_in') === 'true';
    } catch (e) {
      return false;
    }
  });

  const setCurrentRole = (role) => {
    if (!role) return;
    setCurrentRoleState(role);
    try {
      localStorage.setItem('mplads_active_role', role.id || 'ministry');
    } catch (e) {}
  };

  const login = (role) => {
    if (role) setCurrentRole(role);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('mplads_is_logged_in', 'true');
    } catch (e) {}
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('mplads_is_logged_in');
    } catch (e) {}
  };

  const safeRole = currentRole || ROLES.MINISTRY;

  return (
    <RoleContext.Provider value={{ currentRole: safeRole, setCurrentRole, isLoggedIn, login, logout, ROLES }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
