import React from 'react';
import { useRole } from '../context/RoleContext';
import MinistryDashboard from '../components/dashboards/MinistryDashboard';
import StateDashboard from '../components/dashboards/StateDashboard';
import DistrictDashboard from '../components/dashboards/DistrictDashboard';
import MPDashboard from '../components/dashboards/MPDashboard';
import ContractorDashboard from '../components/dashboards/ContractorDashboard';
import CitizenDashboard from '../components/dashboards/CitizenDashboard';

export default function Dashboard() {
  const { currentRole } = useRole();

  switch (currentRole.id) {
    case 'ministry':
      return <MinistryDashboard />;
    case 'state':
      return <StateDashboard />;
    case 'district':
      return <DistrictDashboard />;
    case 'mp':
      return <MPDashboard />;
    case 'contractor':
      return <ContractorDashboard />;
    case 'citizen':
      return <CitizenDashboard />;
    default:
      return <MinistryDashboard />;
  }
}
