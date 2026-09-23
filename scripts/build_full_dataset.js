const fs = require('fs');
const path = require('path');

const datasetDir = 'C:\\Users\\Server\\Downloads\\MPLADS_AI_Complete_Dataset';

function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8').trim();
  if (!content) return [];
  const lines = content.split(/\r?\n/);
  if (lines.length < 2) return [];

  const parseLine = (line) => {
    const res = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQ = !inQ;
      } else if (c === ',' && !inQ) {
        res.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    res.push(cur.trim());
    return res;
  };

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = parseLine(lines[i]);
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = vals[idx] !== undefined ? vals[idx] : '';
    });
    rows.push(rowObj);
  }
  return rows;
}

const projectsCSV = parseCSV(path.join(datasetDir, 'projects.csv'));
const tendersCSV = parseCSV(path.join(datasetDir, 'tenders.csv'));
const contractsCSV = parseCSV(path.join(datasetDir, 'contracts.csv'));
const contractorsCSV = parseCSV(path.join(datasetDir, 'contractors.csv'));
const complaintsCSV = parseCSV(path.join(datasetDir, 'complaints.csv'));
const anomaliesCSV = parseCSV(path.join(datasetDir, 'anomaly_labels.csv'));

// Prepend demo critical and high risk projects first
const initialDemoProjects = [
  {
    id: 'MPLAD-2026-MH-001',
    name: 'Construction of Multipurpose Community Hall at Dindori Village',
    type: 'Community Hall',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Dindori',
    latitude: 20.2012,
    longitude: 73.8321,
    terrainType: 'Plain',
    estimatedCost: 2000000,
    sanctionedAmount: 2000000,
    actualExpenditure: 1800000,
    startDate: '2025-11-01',
    expectedCompletionDate: '2026-05-30',
    actualCompletionDate: null,
    progressPercentage: 40,
    implementingAgency: 'Public Works Department (PWD) Nashik',
    contractor: 'Apex Infra Tech Ltd',
    description: '250-seater community center with solar lighting and drinking water amenities.',
    photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80'],
    status: 'Ongoing',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    riskReasons: [
      'Severe financial anomaly: 90% expenditure (₹18.0 Lakhs) disbursed with only 40% physical completion reported.',
      'Sentinel-1 SAR satellite analysis confirms zero foundation structure detected at target coordinates.',
      'Geotagged site photo EXIF timestamp mismatch: uploaded photo taken 24.8km away from declared site.',
      'Contractor Apex Infra Tech Ltd flagged for 3 concurrent delayed MPLADS contracts.'
    ],
    scenarioId: 'SCENARIO_5'
  },
  {
    id: 'MPLAD-2026-MH-002',
    name: 'Mountain Road Construction (Link Road to Trimbakeshwar High Hill)',
    type: 'Road',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Trimbak Hills',
    latitude: 19.9321,
    longitude: 73.5312,
    terrainType: 'Mountain',
    roadLengthKm: 2.2,
    roadWidthMeters: 5.5,
    estimatedCost: 3500000,
    sanctionedAmount: 3500000,
    actualExpenditure: 3200000,
    startDate: '2025-08-15',
    expectedCompletionDate: '2026-08-15',
    actualCompletionDate: null,
    progressPercentage: 85,
    implementingAgency: 'Zilla Parishad Rural Roads Division',
    contractor: 'Sahyadri Earthmovers & Infra',
    description: 'Heavy terrain asphalt link road with rock cutting and retaining walls.',
    photos: ['https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80'],
    status: 'Ongoing',
    riskScore: 22,
    riskLevel: 'LOW',
    riskReasons: ['Physical progress aligned with financial disbursement schedule'],
    scenarioId: 'SCENARIO_2'
  },
  {
    id: 'MPLADS-SYN-0001',
    name: 'Sanitation & Drinking Water Facility at Sub-District Hospital',
    type: 'Water & Sanitation',
    state: 'Gujarat',
    district: 'Ahmedabad',
    village: 'Sanand',
    latitude: 22.9902,
    longitude: 72.3814,
    terrainType: 'Plain',
    estimatedCost: 2540000,
    sanctionedAmount: 2540000,
    actualExpenditure: 2540000,
    startDate: '2025-09-01',
    expectedCompletionDate: '2026-03-31',
    actualCompletionDate: null,
    progressPercentage: 20,
    implementingAgency: 'Gujarat Water Supply & Sewerage Board',
    contractor: 'Vanguard Builders',
    description: 'High-capacity RO drinking water plant and bio-toilet block for sub-district hospital.',
    photos: ['https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80'],
    status: 'Delayed',
    riskScore: 96,
    riskLevel: 'CRITICAL',
    riskReasons: [
      'Critical Payment Discrepancy: 100% funds (₹25.4 Lakhs) disbursed in single tranche, but physical progress stalled at 20%.',
      'Duplicate Geo-coordinates: location matches completed 2024 Panchayati Raj sanitation sanction MPLAD-2024-GJ-044.',
      'Citizen reports corroborate non-existent ground activity despite full payment released.'
    ]
  },
  {
    id: 'MPLADS-SYN-0015',
    name: 'Construction of Sub-Health Center Facility',
    type: 'Healthcare',
    state: 'Gujarat',
    district: 'Surat',
    village: 'Bardoli',
    latitude: 21.1215,
    longitude: 73.1120,
    terrainType: 'Plain',
    estimatedCost: 1200000,
    sanctionedAmount: 1200000,
    actualExpenditure: 1740000,
    startDate: '2025-06-10',
    expectedCompletionDate: '2026-04-15',
    actualCompletionDate: null,
    progressPercentage: 55,
    implementingAgency: 'District Health Infrastructure Division',
    contractor: 'Apex Infra Tech Ltd',
    description: 'Primary maternal care unit and immunization clinic with medical cold storage.',
    photos: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'],
    status: 'Ongoing',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    riskReasons: [
      'Unusual cost overrun: Actual expenditure exceeded sanctioned allocation by 45% (₹5.4 Lakhs excess) without revised sanction.',
      'Unauthorized subcontracting detected: Payments routed to unregistered sub-agency.'
    ]
  },
  {
    id: 'MPLADS-SYN-0042',
    name: 'Rural Water Pipeline Infrastructure Extension',
    type: 'Water Supply',
    state: 'Maharashtra',
    district: 'Aurangabad',
    village: 'Paithan',
    latitude: 19.4789,
    longitude: 75.3812,
    terrainType: 'Hilly',
    estimatedCost: 1500000,
    sanctionedAmount: 1500000,
    actualExpenditure: 1500000,
    startDate: '2025-05-01',
    expectedCompletionDate: '2026-02-28',
    actualCompletionDate: null,
    progressPercentage: 5,
    implementingAgency: 'Maharashtra Jeevan Authority',
    contractor: 'Sahyadri Earthmovers & Infra',
    description: '12km underground pipeline connecting Paithan reservoir to 4 rural hamlets.',
    photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80'],
    status: 'Delayed',
    riskScore: 95,
    riskLevel: 'CRITICAL',
    riskReasons: [
      'Ghost Infrastructure Risk: 100% funds disbursed (₹15.0 Lakhs) but 0% pipeline trenching verified by optical satellite pass.',
      'Submitted completion photos matched duplicate perceptual hash from unrelated project in 2023.'
    ]
  },
  {
    id: 'MPLADS-SYN-0088',
    name: 'Solar Street Lighting & Gram Panchayat Smart Hub',
    type: 'Energy',
    state: 'Gujarat',
    district: 'Vadodara',
    village: 'Dabhoi',
    latitude: 22.1345,
    longitude: 73.4189,
    terrainType: 'Plain',
    estimatedCost: 2800000,
    sanctionedAmount: 2800000,
    actualExpenditure: 1456000,
    startDate: '2025-07-20',
    expectedCompletionDate: '2026-06-30',
    actualCompletionDate: null,
    progressPercentage: 30,
    implementingAgency: 'Zilla Parishad Renewable Energy Cell',
    contractor: 'SunPower Urja Contractors',
    description: '120 LED solar street lights and digital Gram Panchayat community access kiosk.',
    photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'],
    status: 'Delayed',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    riskReasons: [
      'Abnormally low tender bidding (-48% below departmental baseline) leading to project stall & supplier abandonment.',
      'High citizen dissatisfaction: 14 open complaints regarding non-functional LED poles and missing solar storage units.'
    ]
  }
];

const parsedProjects = projectsCSV.map((p, idx) => {
  const projId = p.project_id || p.projectId;
  const existingDemo = initialDemoProjects.find(d => d.id === projId);
  if (existingDemo) return existingDemo;

  let riskLevel = 'LOW';
  let riskScore = Math.floor(Math.random() * 35) + 15;
  let riskReasons = ['Physical progress aligned with financial disbursement schedule'];

  if (idx % 15 === 0) {
    riskLevel = 'CRITICAL';
    riskScore = Math.floor(Math.random() * 12) + 86; // 86 to 97
    riskReasons = [
      'CRITICAL ANOMALY: Financial disbursement ratio (>85%) severely misaligned with verified ground progress (<30%).',
      'Satellite SAR spectral pass indicates zero structural earthwork at sanctioned coordinates.',
      'Flagged by AI multi-modal surveillance for potential duplicate sanction or ghost billing.'
    ];
  } else if (idx % 5 === 0) {
    riskLevel = 'HIGH';
    riskScore = Math.floor(Math.random() * 15) + 66; // 66 to 80
    riskReasons = [
      'High Risk: Progress milestone delay exceeding 90 days past expected completion target.',
      'Expenditure disbursement accelerated faster than verified weekly contractor submissions.'
    ];
  } else if (idx % 3 === 0) {
    riskLevel = 'MEDIUM';
    riskScore = Math.floor(Math.random() * 15) + 40; // 40 to 54
    riskReasons = ['Medium Risk: Moderate timeline deviation detected in contractor progress updates.'];
  }

  const terrains = ['Mountain', 'Remote', 'Hilly', 'Plain'];
  const assignedTerrain = (p.terrain && p.terrain !== 'Plain' && p.terrain !== '') ? p.terrain : terrains[idx % 4];

  return {
    id: projId,
    name: p.work_description || p.name || `MPLADS Work ${projId}`,
    type: p.work_type || p.type || 'Infrastructure',
    state: p.state || 'Gujarat',
    district: p.district || 'Ahmedabad',
    village: p.constituency || p.district || 'Locality',
    latitude: parseFloat(p.latitude) || 23.0225,
    longitude: parseFloat(p.longitude) || 72.5714,
    terrainType: assignedTerrain,
    estimatedCost: parseFloat(p.estimated_cost) || 1000000,
    sanctionedAmount: parseFloat(p.sanction_amount) || 1000000,
    actualExpenditure: parseFloat(p.expenditure) || 500000,
    startDate: p.start_date || '2026-01-01',
    expectedCompletionDate: p.expected_completion || '2026-12-31',
    actualCompletionDate: p.actual_completion_date || null,
    progressPercentage: parseInt(p.physical_progress) || 50,
    implementingAgency: p.implementing_agency || 'Public Works Department',
    contractor: p.contractor_agency || 'Registered Contractor',
    description: p.work_description || 'MPLADS Sanctioned Development Project',
    photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80'],
    status: p.status || 'Ongoing',
    riskScore: riskScore,
    riskLevel: riskLevel,
    riskReasons: riskReasons
  };
});

const allProjects = [...initialDemoProjects, ...parsedProjects.filter(p => !initialDemoProjects.some(d => d.id === p.id))];

// Explicit AI Alerts with rich Evidence Payloads
const explicitAlerts = [
  {
    id: 'ALT-CRIT-001',
    projectId: 'MPLAD-2026-MH-001',
    projectName: 'Construction of Multipurpose Community Hall at Dindori Village',
    type: 'Progress discrepancy',
    riskLevel: 'CRITICAL',
    riskScore: 94,
    date: '2026-09-20',
    status: 'New',
    reason: 'Severe Financial vs Physical Discrepancy: 90% funds spent (₹18.0L) with only 40% physical completion.',
    evidence: {
      disbursementVsProgress: {
        sanctionedLakhs: 20.0,
        disbursedLakhs: 18.0,
        expenditureRatio: '90.0%',
        reportedProgress: '40.0%',
        expectedProgress: '85.0%',
        progressLagDays: 112
      },
      satelliteSarAudit: {
        sensor: 'Sentinel-1 SAR C-Band',
        acquisitionDate: '2026-09-18',
        targetLat: 20.2012,
        targetLng: 73.8321,
        detectedBuiltAreaSqM: 0,
        expectedBuiltAreaSqM: 450,
        confidenceScore: 0.96,
        anomalyFlag: 'ZERO_EARTHWORK_DETECTED'
      },
      exifLocationAudit: {
        uploadedPhotoLat: 19.9822,
        uploadedPhotoLng: 73.7210,
        distanceFromSiteKm: 24.8,
        exifMatch: false,
        flag: 'GEOTAG_LOCATION_SPOOFING'
      }
    }
  },
  {
    id: 'ALT-CRIT-002',
    projectId: 'MPLADS-SYN-0001',
    projectName: 'Sanitation & Drinking Water Facility at Sub-District Hospital',
    type: 'Possible duplicate',
    riskLevel: 'CRITICAL',
    riskScore: 96,
    date: '2026-09-19',
    status: 'Under Review',
    reason: 'Duplicate Geo-coordinates & Work Description matched against 2024 completed sanction.',
    evidence: {
      duplicateDetection: {
        currentProjectId: 'MPLADS-SYN-0001',
        existingProjectId: 'MPLAD-2024-GJ-044',
        historicalSanctionYear: '2024',
        geoDistanceMeters: 14.2,
        textSimilarityScore: 0.92,
        imageHashMatch: '98.5% perceptual hash match with 2024 completion photos',
        flag: 'HIGH_CONFIDENCE_DUPLICATE_SANCTION'
      },
      financialDiscrepancy: {
        sanctionedAmount: 2540000,
        disbursedAmount: 2540000,
        disbursementTranches: 1,
        flag: 'SINGLE_TRANCHE_OVER_DISBURSEMENT'
      }
    }
  },
  {
    id: 'ALT-CRIT-003',
    projectId: 'MPLADS-SYN-0042',
    projectName: 'Rural Water Pipeline Infrastructure Extension',
    type: 'Cost anomaly',
    riskLevel: 'CRITICAL',
    riskScore: 95,
    date: '2026-09-18',
    status: 'New',
    reason: 'Ghost Infrastructure Risk: 100% funds disbursed but optical satellite imagery confirms 0% site work.',
    evidence: {
      ghostProjectAudit: {
        totalDisbursedLakhs: 15.0,
        physicalVerification: '0% Earthwork',
        opticalSatellitePass: {
          date: '2026-09-15',
          cloudCover: '2.1%',
          landUseClassification: 'Barren Soil / Unchanged',
          changeVectorScore: 0.03
        },
        contractorFlag: {
          contractorId: 'CONT-104',
          name: 'Sahyadri Earthmovers & Infra',
          blacklistedInOtherStates: false
        }
      }
    }
  },
  {
    id: 'ALT-CRIT-004',
    projectId: 'MPLADS-SYN-0015',
    projectName: 'Construction of Sub-Health Center Facility',
    type: 'Payment anomaly',
    riskLevel: 'CRITICAL',
    riskScore: 91,
    date: '2026-09-17',
    status: 'New',
    reason: 'Unsanctioned Budget Inflation & Subcontracting Violation.',
    evidence: {
      budgetInflation: {
        sanctionedAmount: 1200000,
        claimedExpenditure: 1740000,
        variancePercentage: '+45.0%',
        approvalStatus: 'NO_REVISED_SANCTION_FILED'
      },
      subcontractorAudit: {
        registeredContractor: 'Apex Infra Tech Ltd',
        actualPaymentRecipient: 'Unverified Sub-agent (PAN: XXXXX1234F)',
        violationType: 'UNAUTHORIZED_SUBCONTRACTING'
      }
    }
  },
  {
    id: 'ALT-CRIT-005',
    projectId: 'MPLADS-SYN-0088',
    projectName: 'Solar Street Lighting & Gram Panchayat Smart Hub',
    type: 'Project delay',
    riskLevel: 'CRITICAL',
    riskScore: 89,
    date: '2026-09-16',
    status: 'Under Review',
    reason: 'Abnormally Low Tender Bidding (-48%) leading to project stall & supplier abandonment.',
    evidence: {
      tenderSurveillance: {
        estimatedCostLakhs: 28.0,
        winningBidLakhs: 14.56,
        bidVariance: '-48.0%',
        marketBenchmarkMin: 22.4,
        flag: 'PREDATOR_BID_QUALITY_COLLAPSE'
      },
      citizenDistressIndex: {
        complaintsCount: 14,
        primaryComplaintType: 'Missing Solar Panels / Abandoned Work',
        sentimentScore: -0.87
      }
    }
  }
];

const parsedAlertsFromCSV = anomaliesCSV.map((a, idx) => {
  const pId = a.project_id || a.projectId || 'MPLADS-SYN-0001';
  const targetProject = allProjects.find(p => p.id === pId);
  const projName = targetProject ? targetProject.name : `Project ${pId}`;
  
  let anomalyType = 'Cost anomaly';
  if (a.anomaly_type === 'delay') anomalyType = 'Project delay';
  else if (a.anomaly_type === 'duplicate') anomalyType = 'Possible duplicate';
  else if (a.anomaly_type === 'cost_anomaly') anomalyType = 'Cost anomaly';
  else anomalyType = 'Progress discrepancy';

  let riskLevel = (targetProject && targetProject.riskLevel) || (a.risk_level === 'High' ? 'HIGH' : 'MEDIUM');
  let riskScore = targetProject ? targetProject.riskScore : (riskLevel === 'HIGH' ? 78 : 45);

  return {
    id: a.alertId || `ALT-2026-${1000 + idx}`,
    projectId: pId,
    projectName: projName,
    type: anomalyType,
    riskLevel: riskLevel,
    riskScore: riskScore,
    date: '2026-09-15',
    status: riskScore > 85 ? 'New' : 'Under Review',
    reason: a.reason || (targetProject && targetProject.riskReasons ? targetProject.riskReasons[0] : 'AI risk anomaly flagged'),
    evidence: {
      metadataMatchScore: parseFloat((Math.random() * 0.15 + 0.82).toFixed(2)),
      satellitePassAudit: {
        passDate: '2026-09-14',
        spectralVerification: riskScore > 85 ? 'ANOMALOUS_SURFACE_REFLECTION' : 'EXPECTED_INFRASTRUCTURE_REFLECTANCE',
        confidenceScore: parseFloat((Math.random() * 0.1 + 0.88).toFixed(2))
      },
      spatialValidation: {
        geoCoordinatesValid: true,
        exifDistanceMismatchMeters: riskScore > 85 ? 420 : 12
      }
    }
  };
});

const allAlerts = [...explicitAlerts, ...parsedAlertsFromCSV.filter(a => !explicitAlerts.some(e => e.projectId === a.projectId))];

// Build citizen reports for EVERY project
const projectReportMap = new Set();
const explicitCitizenReports = complaintsCSV.map((c, idx) => {
  const pId = c.project_id || 'MPLADS-SYN-0001';
  projectReportMap.add(pId);
  const targetProject = allProjects.find(p => p.id === pId);
  return {
    id: c.complaint_id || `CR-2026-${100 + idx}`,
    projectId: pId,
    projectName: targetProject ? targetProject.name : `Project ${pId}`,
    reportType: c.complaint_type || 'Issue Reported',
    description: c.description || 'Citizen feedback on project site',
    submittedBy: 'Local Resident',
    date: c.date || '2026-09-12',
    latitude: parseFloat(c.latitude) || (targetProject ? targetProject.latitude : 20.0),
    longitude: parseFloat(c.longitude) || (targetProject ? targetProject.longitude : 73.8),
    verificationStatus: c.status || 'Under Review',
    confidenceScore: 0.85,
    photoUrl: null
  };
});

// Generate realistic citizen reports for remaining projects to ensure 100% project coverage
const generatedCitizenReports = [];
allProjects.forEach((proj) => {
  if (!projectReportMap.has(proj.id)) {
    generatedCitizenReports.push({
      id: `CR-GEN-${proj.id}-1`,
      projectId: proj.id,
      projectName: proj.name,
      reportType: 'Community Ground Inspection',
      description: `Gram Sabha committee and local residents inspected on-site progress for ${proj.name} in ${proj.village || proj.district}. Construction work is active and quality is satisfactory.`,
      submittedBy: 'Gram Sabha Field Committee',
      date: '2026-09-10',
      latitude: proj.latitude,
      longitude: proj.longitude,
      verificationStatus: 'Corroborated',
      confidenceScore: 0.88,
      photoUrl: null
    });
    generatedCitizenReports.push({
      id: `CR-GEN-${proj.id}-2`,
      projectId: proj.id,
      projectName: proj.name,
      reportType: 'Material & On-Site Labor Feedback',
      description: `Citizen field update confirms physical progress is at ${proj.progressPercentage}% with active labor deployment on ground.`,
      submittedBy: 'Local Resident Observer',
      date: '2026-09-02',
      latitude: proj.latitude,
      longitude: proj.longitude,
      verificationStatus: 'Under Review',
      confidenceScore: 0.76,
      photoUrl: null
    });
  }
});

const allCitizenReports = [...explicitCitizenReports, ...generatedCitizenReports];

const summary = {
  totalProjects: allProjects.length,
  sanctionedAmount: allProjects.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0),
  actualExpenditure: allProjects.reduce((acc, p) => acc + (p.actualExpenditure || 0), 0),
  completedProjects: allProjects.filter(p => p.status === 'Completed').length,
  ongoingProjects: allProjects.filter(p => p.status === 'Ongoing').length,
  delayedProjects: allProjects.filter(p => p.status === 'Delayed').length,
  highRiskProjects: allProjects.filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL').length,
  criticalProjects: allProjects.filter(p => p.riskLevel === 'CRITICAL').length,
  possibleDuplicates: allAlerts.filter(a => a.type === 'Possible duplicate').length,
  openCitizenComplaints: allCitizenReports.length
};

const allContractors = [
  {
    contractorId: "CONT-101",
    companyName: "Apex Infra Tech Ltd",
    registrationNumber: "REG-MH-2018-9941",
    companyType: "Private Limited",
    state: "Maharashtra",
    district: "Nashik",
    registeredAddress: "402, Apex Towers, CIDCO, Nashik, Maharashtra 422009",
    contactDetails: { phone: "+91 98220 11223", email: "contact@apexinfra.co.in", representative: "Rajesh Sharma (Managing Director)" },
    registrationStatus: "Active",
    eligibilityStatus: "Class A Registered Contractor (PWD Maharashtra)"
  },
  {
    contractorId: "CONT-102",
    companyName: "Sahyadri Earthmovers & Infra",
    registrationNumber: "REG-MH-2020-4102",
    companyType: "Partnership Firm",
    state: "Maharashtra",
    district: "Nashik",
    registeredAddress: "12, Industrial Estate, Trimbak Road, Nashik, Maharashtra 422007",
    contactDetails: { phone: "+91 94239 88102", email: "info@sahyadriinfra.in", representative: "Vikram Patil (Chief Partner)" },
    registrationStatus: "Active",
    eligibilityStatus: "Class B Special Hilly & Mountain Terrain Specialist"
  },
  {
    contractorId: "CON-001",
    companyName: "ABC Infrastructure Pvt Ltd",
    registrationNumber: "REG-44993",
    companyType: "Private Limited",
    state: "Gujarat",
    district: "Surat",
    registeredAddress: "701, Diamond Heights, Ring Road, Surat, Gujarat 395002",
    contactDetails: { phone: "+91 98980 44993", email: "contact@abcinfra.com", representative: "Anil Contractor" },
    registrationStatus: "Active",
    eligibilityStatus: "Class A Civil Roads & Highways Contractor"
  },
  {
    contractorId: "CON-002",
    companyName: "District Works Cooperative",
    registrationNumber: "REG-31417",
    companyType: "Cooperative Society",
    state: "Uttar Pradesh",
    district: "Lucknow",
    registeredAddress: "Cooperative Bhawan, Hazratganj, Lucknow, Uttar Pradesh 226001",
    contactDetails: { phone: "+91 94150 31417", email: "admin@districtworkscoop.org", representative: "Suresh Yadav" },
    registrationStatus: "Active",
    eligibilityStatus: "Class A Public Building Works Division"
  },
  {
    contractorId: "CON-003",
    companyName: "Maharashtra Works Agency",
    registrationNumber: "REG-99733",
    companyType: "State Empaneled Agency",
    state: "Rajasthan",
    district: "Ajmer",
    registeredAddress: "45, Civil Lines, Ajmer, Rajasthan 305001",
    contactDetails: { phone: "+91 94140 99733", email: "info@mahaworks.org", representative: "Ramesh Sharma" },
    registrationStatus: "Active",
    eligibilityStatus: "Class B Civil & Irrigation Division"
  },
  {
    contractorId: "CON-004",
    companyName: "National Infra Services",
    registrationNumber: "REG-62581",
    companyType: "Public Limited",
    state: "Maharashtra",
    district: "Aurangabad",
    registeredAddress: "88, Jalna Road, Aurangabad, Maharashtra 431001",
    contactDetails: { phone: "+91 98230 62581", email: "projects@nationalinfra.co.in", representative: "Pravin Kulkarni" },
    registrationStatus: "Active",
    eligibilityStatus: "Class A National Highway & Pipeline Contractor"
  },
  {
    contractorId: "CON-005",
    companyName: "Om Civil Works",
    registrationNumber: "REG-37869",
    companyType: "Sole Proprietorship",
    state: "Uttar Pradesh",
    district: "Madurai",
    registeredAddress: "14, Bypass Road, Madurai, Tamil Nadu 625016",
    contactDetails: { phone: "+91 98421 37869", email: "omcivil@gmail.com", representative: "M. Murugan" },
    registrationStatus: "Active",
    eligibilityStatus: "Class B Water Supply & Sanitation Specialist"
  },
  {
    contractorId: "CON-006",
    companyName: "Sai Construction",
    registrationNumber: "REG-28301",
    companyType: "Private Limited",
    state: "Madhya Pradesh",
    district: "Sagar",
    registeredAddress: "22, Station Road, Sagar, Madhya Pradesh 470002",
    contactDetails: { phone: "+91 94251 28301", email: "saiconstructionsagar@gmail.com", representative: "Sanjay Gupta" },
    registrationStatus: "Active",
    eligibilityStatus: "Class B Educational & Healthcare Building Division"
  },
  {
    contractorId: "CON-007",
    companyName: "Shree Buildcon",
    registrationNumber: "REG-86484",
    companyType: "Partnership Firm",
    state: "Gujarat",
    district: "Kutch",
    registeredAddress: "55, Port Road, Bhuj, Kutch, Gujarat 370001",
    contactDetails: { phone: "+91 98252 86484", email: "contact@shreebuildcon.in", representative: "Bhavesh Patel" },
    registrationStatus: "Active",
    eligibilityStatus: "Class A Renewable Energy & Infrastructure Contractor"
  },
  {
    contractorId: "CON-008",
    companyName: "Vanguard Builders",
    registrationNumber: "REG-55210",
    companyType: "Private Limited",
    state: "Gujarat",
    district: "Ahmedabad",
    registeredAddress: "302, CG Road, Navrangpura, Ahmedabad, Gujarat 380009",
    contactDetails: { phone: "+91 98795 55210", email: "info@vanguardbuilders.com", representative: "Ketan Shah" },
    registrationStatus: "Active",
    eligibilityStatus: "Class A Hospital & High-Capacity Sanitation Integrator"
  },
  {
    contractorId: "CON-009",
    companyName: "SunPower Urja Contractors",
    registrationNumber: "REG-77421",
    companyType: "Private Limited",
    state: "Gujarat",
    district: "Vadodara",
    registeredAddress: "105, Alkapuri Arcade, Vadodara, Gujarat 390007",
    contactDetails: { phone: "+91 98240 77421", email: "support@sunpowerurja.in", representative: "Hardik Mehta" },
    registrationStatus: "Active",
    eligibilityStatus: "MNRE Empaneled Solar & Smart Lighting Contractor"
  }
];

const mockDataContent = `export const MOCK_SUMMARY = ${JSON.stringify(summary, null, 2)};

export const MOCK_PROJECTS = ${JSON.stringify(allProjects, null, 2)};

export const MOCK_ALERTS = ${JSON.stringify(allAlerts, null, 2)};

export const MOCK_CITIZEN_REPORTS = ${JSON.stringify(allCitizenReports, null, 2)};

export const MOCK_CONTRACTORS = ${JSON.stringify(allContractors, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'client', 'src', 'data', 'mockData.js');
fs.writeFileSync(outputPath, mockDataContent);
console.log('✅ Updated client/src/data/mockData.js with Critical Projects, AI Evidence Payloads & Multi-Contractor Registry!');
console.log('   - Total Projects:', allProjects.length);
console.log('   - Total Contractors:', allContractors.length);
console.log('   - Critical Projects:', summary.criticalProjects);
console.log('   - High/Critical Risk Projects:', summary.highRiskProjects);
console.log('   - Total AI Alerts:', allAlerts.length);
console.log('   - Total Citizen Reports (100% Coverage):', allCitizenReports.length);
