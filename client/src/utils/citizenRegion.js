/**
 * Citizen Region Utility Helper
 * Manages citizen location profiles and filters projects based on citizen's assigned region.
 */

export const getCitizenArea = () => {
  try {
    const saved = localStorage.getItem('mplads_citizen_area');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.district || parsed.state || parsed.locality)) {
        return parsed;
      }
    }
  } catch (e) {}
  return { state: 'Maharashtra', district: 'Nashik', locality: 'Dindori', radiusKm: '5' };
};

export const setCitizenArea = (areaData) => {
  try {
    localStorage.setItem('mplads_citizen_area', JSON.stringify(areaData));
  } catch (e) {}
};

/**
 * Checks whether a given project is located within the citizen's assigned region.
 */
export const isProjectInCitizenRegion = (project, citizenArea) => {
  if (!project) return false;
  const area = citizenArea || getCitizenArea();

  const cDistrict = (area.district || 'Nashik').toLowerCase().trim();
  const cState = (area.state || 'Maharashtra').toLowerCase().trim();
  const cLocality = (area.locality || '').toLowerCase().trim();

  const pDistrict = (project.district || '').toLowerCase().trim();
  const pState = (project.state || '').toLowerCase().trim();
  const pVillage = (project.village || project.location || '').toLowerCase().trim();
  const pName = (project.name || '').toLowerCase().trim();

  // 1. Direct match on district
  if (pDistrict && (pDistrict === cDistrict || pDistrict.includes(cDistrict) || cDistrict.includes(pDistrict))) {
    return true;
  }

  // 2. Direct match on locality / village
  if (cLocality && (pVillage.includes(cLocality) || pName.includes(cLocality))) {
    return true;
  }

  // 3. Match on state if project has state and matches citizen's state
  if (pState && pState === cState) {
    // If project also specifies a district, it must match citizen's district
    if (!pDistrict || pDistrict === cDistrict) {
      return true;
    }
  }

  return false;
};
