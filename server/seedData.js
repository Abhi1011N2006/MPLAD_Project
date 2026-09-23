const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Project = require('./models/Project');
const Tender = require('./models/Tender');
const Bid = require('./models/Bid');
const ContractorProfile = require('./models/ContractorProfile');
const WeeklyReport = require('./models/WeeklyReport');
const CitizenReport = require('./models/CitizenReport');
const BillPayment = require('./models/BillPayment');
const AIAlert = require('./models/AIAlert');
const ProjectEvent = require('./models/ProjectEvent');

// InMemory Store Fallback if MongoDB is not connected
const memoryDB = {
  users: [],
  projects: [],
  tenders: [],
  bids: [],
  contracts: [],
  contractors: [],
  implementingAgencies: [],
  recommendations: [],
  weeklyReports: [],
  citizenReports: [],
  billPayments: [],
  aiAlerts: [],
  projectEvents: [],
  inspections: [],
  siteImages: []
};

const initialProjects = [
  {
    projectId: "MPLAD-2026-MH-001",
    name: "Construction of Multipurpose Community Hall at Dindori Village",
    type: "Community Hall",
    stateId: "MH",
    districtId: "Nashik",
    constituencyId: "Nashik-LS",
    localityId: "Dindori",
    latitude: 20.2012,
    longitude: 73.8321,
    terrainType: "Plain",
    estimatedCost: 2000000,
    sanctionedAmount: 2000000,
    contractAmount: 1850000,
    expenditure: 1800000,
    progress: 40,
    startDate: "2025-11-01",
    expectedCompletionDate: "2026-05-30",
    actualCompletionDate: null,
    implementingAgency: "Public Works Department (PWD) Nashik",
    contractorId: "CONT-101",
    contractorName: "Apex Infra Tech Ltd",
    description: "250-seater community center with solar lighting and drinking water amenities.",
    photos: ["https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80"],
    status: "Ongoing",
    riskScore: 78,
    riskLevel: "HIGH",
    riskReasons: [
      "High expenditure (90%) relative to reported physical progress (40%)",
      "Significant progress delay beyond expected milestone",
      "Citizen field report indicates construction halted 3 weeks ago"
    ],
    scenarioId: "SCENARIO_5"
  },
  {
    projectId: "MPLAD-2026-MH-002",
    name: "Mountain Road Construction (Link Road to Trimbakeshwar High Hill)",
    type: "Road",
    stateId: "MH",
    districtId: "Nashik",
    constituencyId: "Nashik-LS",
    localityId: "Trimbak Hills",
    latitude: 19.9321,
    longitude: 73.5312,
    terrainType: "Mountain",
    roadLengthKm: 2.2,
    roadWidthMeters: 5.5,
    estimatedCost: 3500000,
    sanctionedAmount: 3500000,
    contractAmount: 3300000,
    expenditure: 3200000,
    progress: 85,
    startDate: "2025-08-15",
    expectedCompletionDate: "2026-08-15",
    actualCompletionDate: null,
    implementingAgency: "Zilla Parishad Rural Roads Division",
    contractorId: "CONT-102",
    contractorName: "Sahyadri Earthmovers & Infra",
    description: "Heavy terrain asphalt link road with rock cutting and retaining walls.",
    photos: ["https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80"],
    status: "Ongoing",
    riskScore: 22,
    riskLevel: "LOW",
    riskReasons: [
      "Higher cost per km justified by Mountain terrain rock excavation parameters",
      "Physical progress aligned with financial disbursement schedule"
    ],
    scenarioId: "SCENARIO_2"
  },
  {
    projectId: "MPLAD-2026-MH-003",
    name: "Panchayat Samiti Hall Extension - Block A",
    type: "Community Hall",
    stateId: "MH",
    districtId: "Nashik",
    constituencyId: "Sinnar-LS",
    localityId: "Sinnar Central",
    latitude: 19.8450,
    longitude: 73.9980,
    terrainType: "Plain",
    estimatedCost: 2500000,
    sanctionedAmount: 2500000,
    contractAmount: 2350000,
    expenditure: 2100000,
    progress: 70,
    startDate: "2025-10-01",
    expectedCompletionDate: "2026-04-30",
    actualCompletionDate: null,
    implementingAgency: "District Rural Development Agency (DRDA)",
    contractorId: "CONT-103",
    contractorName: "Shree Ganesh Constructions",
    description: "Extension of existing hall with meeting rooms and acoustic ceiling.",
    photos: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"],
    status: "Ongoing",
    riskScore: 84,
    riskLevel: "CRITICAL",
    riskReasons: [
      "Contractor reported 70% physical completion",
      "Citizen field evidence & photo embeddings indicate only 40% completion",
      "Possible progress discrepancy between reported & observed ground status"
    ],
    scenarioId: "SCENARIO_4"
  },
  {
    projectId: "MPLAD-2026-MH-004",
    name: "Solar Powered Borewell & Water Tank Installation",
    type: "Water Supply",
    stateId: "MH",
    districtId: "Nashik",
    constituencyId: "Igatpuri-LS",
    localityId: "Igatpuri West",
    latitude: 19.6980,
    longitude: 73.5620,
    terrainType: "Hilly",
    estimatedCost: 1200000,
    sanctionedAmount: 1200000,
    contractAmount: 1150000,
    expenditure: 1150000,
    progress: 60,
    startDate: "2025-05-10",
    expectedCompletionDate: "2025-11-10",
    actualCompletionDate: null,
    implementingAgency: "Maharashtra Jeevan Authority",
    contractorId: "CONT-104",
    contractorName: "Jal-Shakti Water Systems",
    description: "Deep borewell, 10,000L overhead tank, solar pump array and distribution pipelines.",
    photos: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80"],
    status: "Delayed",
    riskScore: 75,
    riskLevel: "HIGH",
    riskReasons: [
      "Project delayed by 10 months past expected completion date",
      "Overdue weekly contractor reports (3 consecutive weeks missing)"
    ],
    scenarioId: "SCENARIO_6"
  },
  {
    projectId: "MPLAD-2026-MH-005A",
    name: "Primary Health Center Emergency Ward Extension - Site A",
    type: "Health Facility",
    stateId: "MH",
    districtId: "Nashik",
    constituencyId: "Niphad-LS",
    localityId: "Niphad",
    latitude: 20.078912,
    longitude: 74.108923,
    terrainType: "Plain",
    estimatedCost: 3000000,
    sanctionedAmount: 3000000,
    contractAmount: 2800000,
    expenditure: 2700000,
    progress: 80,
    startDate: "2025-09-01",
    expectedCompletionDate: "2026-03-31",
    actualCompletionDate: null,
    implementingAgency: "District Health Society Nashik",
    contractorId: "CONT-105",
    contractorName: "MedInfra Buildcon",
    description: "Construction of 10-bed emergency room with oxygen pipeline infrastructure.",
    photos: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"],
    status: "Ongoing",
    riskScore: 92,
    riskLevel: "CRITICAL",
    riskReasons: [
      "GPS proximity (12 meters) to project MPLAD-2026-MH-005B",
      "Image embedding similarity 89% across photo evidence",
      "High metadata similarity (same contractor, sanction date, and scope)"
    ],
    scenarioId: "SCENARIO_3"
  },
  {
    projectId: "MPLAD-2026-MH-006",
    name: "Gram Panchayat Concrete Road & Drainage Network",
    type: "Road",
    stateId: "MH",
    districtId: "Nashik",
    constituencyId: "Yeola-LS",
    localityId: "Yeola",
    latitude: 20.0421,
    longitude: 74.4890,
    terrainType: "Plain",
    roadLengthKm: 1.5,
    roadWidthMeters: 4.0,
    estimatedCost: 1800000,
    sanctionedAmount: 1800000,
    contractAmount: 1750000,
    expenditure: 1750000,
    progress: 100,
    startDate: "2025-06-01",
    expectedCompletionDate: "2025-12-31",
    actualCompletionDate: "2025-12-28",
    implementingAgency: "Yeola Public Works Department",
    contractorId: "CONT-106",
    contractorName: "Kadam Infra Projects",
    description: "CC road with covered side drains for rain water management.",
    photos: ["https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80"],
    status: "Completed",
    riskScore: 15,
    riskLevel: "LOW",
    riskReasons: [
      "Project completed within sanctioned budget and schedule",
      "Verified by District Inspection Officer"
    ],
    scenarioId: "SCENARIO_1"
  }
];

const initialTenders = [
  {
    tenderId: "TND-2026-MH-101",
    projectId: "MPLAD-2026-MH-007",
    projectName: "Construction of Anganwadi Building at Malegaon",
    tenderTitle: "Tender for Construction of RCC Anganwadi Center",
    description: "Single-story 1200 sqft preschool building with playground and sanitation facility.",
    estimatedCost: 1500000,
    publicationDate: "2026-09-01",
    submissionDeadline: "2026-10-15",
    eligibilityRequirements: "Class B or above registered civil contractors with min 3 years experience.",
    status: "Bidding Open",
    awardedContractorId: null,
    awardedAmount: 0
  },
  {
    tenderId: "TND-2026-MH-102",
    projectId: "MPLAD-2026-MH-008",
    projectName: "Solar Street Lighting Project across 15 Gram Panchayats",
    tenderTitle: "Installation of 200 All-in-One LED Solar Street Lights",
    description: "Supply, installation, and 5-year comprehensive maintenance of solar LED street lights.",
    estimatedCost: 2800000,
    publicationDate: "2026-08-15",
    submissionDeadline: "2026-09-20",
    eligibilityRequirements: "MNRE empaneled solar energy system integrators.",
    status: "Under Evaluation",
    awardedContractorId: null,
    awardedAmount: 0
  }
];

const initialContractors = [
  {
    contractorId: "CONT-101",
    companyName: "Apex Infra Tech Ltd",
    registrationNumber: "REG-MH-2018-9941",
    companyType: "Private Limited",
    registeredAddress: "402, Apex Towers, CIDCO, Nashik, Maharashtra 422009",
    contactDetails: {
      phone: "+91 98220 11223",
      email: "contact@apexinfra.co.in",
      representative: "Rajesh Sharma (Managing Director)"
    },
    eligibilityStatus: "Class A Registered Contractor (PWD Maharashtra)",
    totalContracts: 24,
    successfullyCompleted: 15,
    currentlyWorking: 5,
    delayed: 3,
    cancelledOrTerminated: 1,
    contractsHistory: [
      {
        projectId: "MPLAD-2026-MH-001",
        projectName: "Multipurpose Community Hall at Dindori",
        year: "2025",
        contractAmount: 1850000,
        startDate: "2025-11-01",
        expectedCompletion: "2026-05-30",
        status: "In Progress",
        delayDays: 110,
        costVariationPercent: 0,
        finalAmount: 1850000
      },
      {
        projectId: "MPLAD-2024-MH-088",
        projectName: "Primary School Library Wing",
        year: "2024",
        contractAmount: 1400000,
        startDate: "2024-01-10",
        expectedCompletion: "2024-07-10",
        actualCompletion: "2024-07-05",
        status: "Completed",
        delayDays: 0,
        costVariationPercent: 0,
        finalAmount: 1400000
      }
    ]
  },
  {
    contractorId: "CONT-102",
    companyName: "Sahyadri Earthmovers & Infra",
    registrationNumber: "REG-MH-2020-4412",
    companyType: "Partnership Firm",
    registeredAddress: "12, Industrial Area, Satpur, Nashik, Maharashtra 422007",
    contactDetails: {
      phone: "+91 94231 88442",
      email: "info@sahyadriinfra.com",
      representative: "Sunil Patil (Partner)"
    },
    eligibilityStatus: "Class A Heavy Earthmoving & Road Contractor",
    totalContracts: 18,
    successfullyCompleted: 14,
    currentlyWorking: 3,
    delayed: 1,
    cancelledOrTerminated: 0,
    contractsHistory: []
  }
];

function parseCSVFile(filePath) {
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

function populateMemoryStore() {
  memoryDB.projects = [...initialProjects];
  memoryDB.tenders = [...initialTenders];
  memoryDB.contractors = [...initialContractors];

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) return;

  // Load projects.csv
  const csvProjects = parseCSVFile(path.join(dataDir, 'projects.csv'));
  csvProjects.forEach(p => {
    const projObj = {
      ...p,
      projectId: p.project_id || p.projectId,
      name: p.work_description || p.name || `Project ${p.project_id}`,
      type: p.work_type || p.type || "Infrastructure",
      stateId: p.state || p.stateId || "Gujarat",
      districtId: p.district || p.districtId || "Ahmedabad",
      constituencyId: p.constituency || p.constituencyId || "Ahmedabad",
      localityId: p.locality || p.district,
      latitude: parseFloat(p.latitude) || 23.0225,
      longitude: parseFloat(p.longitude) || 72.5714,
      terrainType: p.terrain || "Plain",
      estimatedCost: parseFloat(p.estimated_cost) || 1000000,
      sanctionedAmount: parseFloat(p.sanction_amount) || 1000000,
      contractAmount: parseFloat(p.estimated_cost) || 950000,
      expenditure: parseFloat(p.expenditure) || 500000,
      progress: parseInt(p.physical_progress) || 50,
      financialProgress: parseInt(p.financial_progress) || 50,
      startDate: p.start_date || "2026-01-01",
      expectedCompletionDate: p.expected_completion || "2026-12-31",
      actualCompletionDate: p.actual_completion_date || null,
      implementingAgency: p.implementing_agency || "Public Works Department",
      contractorName: p.contractor_agency || "Registered Contractor",
      contractorId: "CON-001",
      description: p.work_description || "MPLADS Sanctioned Development Project",
      photos: ["https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80"],
      status: p.status || "Ongoing",
      riskScore: Math.floor(Math.random() * 40) + 20,
      riskLevel: "LOW",
      riskReasons: ["Expenditure aligned with expected physical progress"]
    };
    if (!memoryDB.projects.some(existing => existing.projectId === projObj.projectId)) {
      memoryDB.projects.push(projObj);
    }
  });

  // Load tenders.csv
  const csvTenders = parseCSVFile(path.join(dataDir, 'tenders.csv'));
  csvTenders.forEach(t => {
    const tObj = {
      ...t,
      tenderId: t.tender_id || t.tenderId,
      projectId: t.project_id || t.projectId,
      tenderTitle: t.tender_title || t.tenderTitle,
      estimatedCost: parseFloat(t.estimated_cost) || 1000000,
      publicationDate: t.publication_date,
      submissionDeadline: t.submission_deadline,
      status: t.tender_status || "Awarded",
      awardedContractorId: t.awarded_contractor_id || "CON-001",
      awardedAmount: parseFloat(t.award_amount) || parseFloat(t.estimated_cost) || 0
    };
    if (!memoryDB.tenders.some(e => e.tenderId === tObj.tenderId)) {
      memoryDB.tenders.push(tObj);
    }
  });

  // Load contracts.csv
  const csvContracts = parseCSVFile(path.join(dataDir, 'contracts.csv'));
  csvContracts.forEach(c => {
    const cObj = {
      ...c,
      contractId: c.contract_id || c.contractId,
      projectId: c.project_id || c.projectId,
      tenderId: c.tender_id || c.tenderId,
      contractorId: c.contractor_id || c.contractorId || "CON-001",
      contractAmount: parseFloat(c.contract_amount) || 0,
      startDate: c.contract_start_date,
      expectedCompletionDate: c.contract_end_date,
      status: c.contract_status || "Active"
    };
    if (!memoryDB.contracts.some(e => e.contractId === cObj.contractId)) {
      memoryDB.contracts.push(cObj);
    }
  });

  // Load contractors.csv
  const csvContractors = parseCSVFile(path.join(dataDir, 'contractors.csv'));
  csvContractors.forEach(co => {
    const coObj = {
      ...co,
      contractorId: co.contractor_id || co.contractorId,
      companyName: co.company_name || co.contractor_name || "Contractor Company",
      registrationNumber: co.registration_number || "REG-9901",
      companyType: "Private Limited",
      registeredAddress: `${co.district || 'Ahmedabad'}, ${co.state || 'Gujarat'}`,
      contactDetails: {
        phone: "+91 98000 11122",
        email: "contact@contractor.in",
        representative: "Managing Director"
      },
      eligibilityStatus: "Class A Registered Contractor",
      totalContracts: parseInt(co.total_contracts) || 10,
      successfullyCompleted: parseInt(co.completed_contracts) || 8,
      currentlyWorking: parseInt(co.ongoing_contracts) || 2,
      delayed: parseInt(co.delayed_contracts) || 0,
      cancelledOrTerminated: parseInt(co.cancelled_contracts) || 0,
      contractsHistory: []
    };
    if (!memoryDB.contractors.some(e => e.contractorId === coObj.contractorId)) {
      memoryDB.contractors.push(coObj);
    }
  });

  // Load bids.csv
  const csvBids = parseCSVFile(path.join(dataDir, 'bids.csv'));
  csvBids.forEach(b => {
    memoryDB.bids.push({
      ...b,
      bidId: b.bid_id || b.bidId,
      tenderId: b.tender_id || b.tenderId,
      contractorId: b.contractor_id || b.contractorId,
      bidAmount: parseFloat(b.bid_amount) || 0
    });
  });

  // Load payments.csv
  const csvPayments = parseCSVFile(path.join(dataDir, 'payments.csv'));
  csvPayments.forEach(p => {
    memoryDB.billPayments.push({
      ...p,
      billId: p.payment_id || p.billId,
      projectId: p.project_id || p.projectId,
      amount: parseFloat(p.amount) || 0,
      status: "Paid",
      paymentDate: p.payment_date
    });
  });

  // Load progress_updates.csv
  const csvProgress = parseCSVFile(path.join(dataDir, 'progress_updates.csv'));
  csvProgress.forEach(pr => {
    memoryDB.weeklyReports.push({
      ...pr,
      reportId: pr.update_id || pr.reportId,
      projectId: pr.project_id || pr.projectId,
      progress: parseInt(pr.physical_progress) || 0,
      financialProgress: parseInt(pr.financial_progress) || 0,
      reportDate: pr.date
    });
  });

  // Load complaints.csv
  const csvComplaints = parseCSVFile(path.join(dataDir, 'complaints.csv'));
  csvComplaints.forEach(c => {
    memoryDB.citizenReports.push({
      ...c,
      reportId: c.complaint_id || c.reportId,
      projectId: c.project_id || c.projectId,
      issueType: c.complaint_type,
      description: c.description,
      status: c.status || "Pending",
      reportDate: c.date
    });
  });

  // Load inspections.csv
  const csvInspections = parseCSVFile(path.join(dataDir, 'inspections.csv'));
  csvInspections.forEach(ins => {
    memoryDB.inspections.push({
      ...ins,
      inspectionId: ins.inspection_id || ins.inspectionId,
      projectId: ins.project_id || ins.projectId,
      outcome: ins.outcome,
      remarks: ins.remarks,
      inspectionDate: ins.inspection_date
    });
  });

  // Load site_images.csv
  const csvImages = parseCSVFile(path.join(dataDir, 'site_images.csv'));
  csvImages.forEach(img => {
    memoryDB.siteImages.push({
      ...img,
      imageId: img.image_id || img.imageId,
      projectId: img.project_id || img.projectId,
      imagePath: img.image_path
    });
  });

  // Load anomaly_labels.csv
  const csvAnomalies = parseCSVFile(path.join(dataDir, 'anomaly_labels.csv'));
  csvAnomalies.forEach(a => {
    memoryDB.aiAlerts.push({
      ...a,
      alertId: a.alertId || `ALERT-${Math.random().toString(36).substring(2,7)}`,
      projectId: a.project_id || a.projectId,
      riskLevel: a.risk_level || a.riskLevel || "MEDIUM",
      anomalyType: a.anomaly_type,
      reason: a.reason
    });
  });

  console.log(`✅ Loaded complete MPLADS dataset into memoryDB:`);
  console.log(`   - Projects: ${memoryDB.projects.length}`);
  console.log(`   - Tenders: ${memoryDB.tenders.length}`);
  console.log(`   - Contracts: ${memoryDB.contracts.length}`);
  console.log(`   - Contractors: ${memoryDB.contractors.length}`);
  console.log(`   - Bids: ${memoryDB.bids.length}`);
  console.log(`   - Payments: ${memoryDB.billPayments.length}`);
  console.log(`   - Progress Updates: ${memoryDB.weeklyReports.length}`);
  console.log(`   - Complaints: ${memoryDB.citizenReports.length}`);
  console.log(`   - Inspections: ${memoryDB.inspections.length}`);
  console.log(`   - AI Alerts: ${memoryDB.aiAlerts.length}`);
}

populateMemoryStore();

module.exports = {
  memoryDB,
  initialProjects,
  initialTenders,
  initialContractors
};

