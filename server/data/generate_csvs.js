const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. projects.csv
const projectsCSV = `projectId,projectName,type,stateId,districtId,constituencyId,localityId,latitude,longitude,terrainType,estimatedCost,sanctionedAmount,contractAmount,expenditure,progress,startDate,expectedCompletionDate,implementingAgency,contractorId,contractorName,status,riskScore,riskLevel
MPLAD-2026-MH-001,Construction of Multipurpose Community Hall at Dindori,Community Hall,MH,Nashik,Nashik-LS,Dindori,20.2012,73.8321,Plain,2000000,2000000,1850000,1800000,40,2025-11-01,2026-05-30,Public Works Department (PWD) Nashik,CONT-101,Apex Infra Tech Ltd,Ongoing,78,HIGH
MPLAD-2026-MH-002,Mountain Road Construction (Link Road to Trimbak),Road,MH,Nashik,Nashik-LS,Trimbak Hills,19.9321,73.5312,Mountain,3500000,3500000,3300000,3200000,85,2025-08-15,2026-08-15,Zilla Parishad Rural Roads Division,CONT-102,Sahyadri Earthmovers & Infra,Ongoing,22,LOW
MPLAD-2026-MH-003,Panchayat Samiti Hall Extension Block A,Community Hall,MH,Nashik,Sinnar-LS,Sinnar Central,19.8450,73.9980,Plain,2500000,2500000,2350000,2100000,70,2025-10-01,2026-04-30,District Rural Development Agency,CONT-103,Shree Ganesh Constructions,Ongoing,84,CRITICAL
MPLAD-2026-MH-004,Solar Powered Borewell & Water Tank Installation,Water Supply,MH,Nashik,Igatpuri-LS,Igatpuri West,19.6980,73.5620,Hilly,1200000,1200000,1150000,1150000,60,2025-05-10,2025-11-10,Maharashtra Jeevan Authority,CONT-104,Jal-Shakti Water Systems,Delayed,75,HIGH
MPLAD-2026-MH-005A,Primary Health Center Emergency Ward Extension Site A,Health Facility,MH,Nashik,Niphad-LS,Niphad,20.0789,74.1089,Plain,3000000,3000000,2800000,2700000,80,2025-09-01,2026-03-31,District Health Society Nashik,CONT-105,MedInfra Buildcon,Ongoing,92,CRITICAL
MPLAD-2026-MH-006,Gram Panchayat Concrete Road & Drainage Network,Road,MH,Nashik,Yeola-LS,Yeola,20.0421,74.4890,Plain,1800000,1800000,1750000,1750000,100,2025-06-01,2025-12-31,Yeola Public Works Department,CONT-106,Kadam Infra Projects,Completed,15,LOW
`;

// 2. users.csv
const usersCSV = `userId,name,email,role,stateId,districtId,constituencyId,localityId,contractorId
USR-101,Ministry Central Admin,ministry.admin@mplads.gov.in,MINISTRY,ALL,ALL,ALL,ALL,
USR-102,State Nodal Officer,mah.nodal@mplads.gov.in,STATE,MH,ALL,ALL,ALL,
USR-103,District Collector Nashik,collector.nashik@mplads.gov.in,DISTRICT,MH,Nashik,ALL,ALL,
USR-104,MP Lok Sabha Nashik,mp.nashik@loksabha.gov.in,MP,MH,Nashik,Nashik-LS,ALL,
USR-105,Apex Infra Representative,contact@apexinfra.co.in,CONTRACTOR,MH,Nashik,ALL,ALL,CONT-101
USR-106,Citizen Inspector,citizen.user@gmail.com,CITIZEN,MH,Nashik,ALL,Dindori,
`;

// 3. implementing_agencies.csv
const agenciesCSV = `agencyId,agencyName,type,districtId,stateId,contactPerson,phone
AGY-MH-01,Public Works Department (PWD) Nashik,Government Department,Nashik,MH,Executive Engineer PWD,+91 253 2571201
AGY-MH-02,Zilla Parishad Rural Roads Division,District Local Body,Nashik,MH,Deputy Engineer Roads,+91 253 2578892
AGY-MH-03,District Rural Development Agency (DRDA),Special Purpose Vehicle,Nashik,MH,Project Director DRDA,+91 253 2574411
AGY-MH-04,Maharashtra Jeevan Authority,State Water Board,Nashik,MH,Superintending Engineer,+91 253 2573390
AGY-MH-05,District Health Society Nashik,Health Department,Nashik,MH,Civil Surgeon Nashik,+91 253 2579912
`;

// 4. contractors.csv
const contractorsCSV = `contractorId,companyName,registrationNumber,companyType,registeredAddress,phone,email,representative,eligibilityStatus,totalContracts,completed,working,delayed,cancelled
CONT-101,Apex Infra Tech Ltd,REG-MH-2018-9941,Private Limited,"402 Apex Towers, CIDCO, Nashik",+91 98220 11223,contact@apexinfra.co.in,Rajesh Sharma,Class A PWD,24,15,5,3,1
CONT-102,Sahyadri Earthmovers & Infra,REG-MH-2020-4412,Partnership,"12 Industrial Area Satpur, Nashik",+91 94231 88442,info@sahyadriinfra.com,Sunil Patil,Class A Earthmoving,18,14,3,1,0
CONT-103,Shree Ganesh Constructions,REG-MH-2019-1102,Proprietary,"Panchavati, Nashik",+91 98901 22334,ganesh.const@gmail.com,Ganesh Kulkarni,Class B Civil,12,8,3,1,0
CONT-104,Jal-Shakti Water Systems,REG-MH-2021-8890,Private Limited,"MIDC Ambad, Nashik",+91 97654 33211,support@jalshakti.in,Vikas Deshmukh,Class A Plumbing & Water,15,10,3,2,0
CONT-105,MedInfra Buildcon,REG-MH-2022-3341,Partnership,"Gangapur Road, Nashik",+91 98230 44556,projects@medinfra.co.in,Anand Joshi,Class A Hospital Infra,8,5,2,1,0
CONT-106,Kadam Infra Projects,REG-MH-2017-5567,Private Limited,"College Road, Nashik",+91 94222 66778,kadam.infra@gmail.com,Sanjay Kadam,Class A PWD,30,24,5,1,0
`;

// 5. recommendations.csv
const recommendationsCSV = `recommendationId,projectId,mpId,mpName,constituencyId,recommendedDate,recommendedCost,description,status
REC-2025-01,MPLAD-2026-MH-001,USR-104,MP Lok Sabha Nashik,Nashik-LS,2025-05-10,2000000,Construction of Multipurpose Community Hall at Dindori,Approved
REC-2025-02,MPLAD-2026-MH-002,USR-104,MP Lok Sabha Nashik,Nashik-LS,2025-06-15,3500000,Mountain Link Road to Trimbakeshwar High Hill,Approved
REC-2025-03,MPLAD-2026-MH-003,USR-104,MP Lok Sabha Nashik,Sinnar-LS,2025-07-20,2500000,Panchayat Samiti Hall Extension Block A,Approved
REC-2025-04,MPLAD-2026-MH-004,USR-104,MP Lok Sabha Nashik,Igatpuri-LS,2025-03-12,1200000,Solar Powered Borewell & Water Tank,Approved
`;

// 6. tenders.csv
const tendersCSV = `tenderId,projectId,projectName,tenderTitle,description,estimatedCost,publicationDate,submissionDeadline,eligibilityRequirements,status,awardedContractorId,awardedAmount
TND-2026-MH-101,MPLAD-2026-MH-007,Construction of Anganwadi Building at Malegaon,Tender for Construction of RCC Anganwadi Center,Single-story 1200 sqft preschool building,1500000,2026-09-01,2026-10-15,Class B Civil,Bidding Open,,0
TND-2026-MH-102,MPLAD-2026-MH-008,Solar Street Lighting Project across 15 Gram Panchayats,Installation of 200 LED Solar Street Lights,Supply and 5-year maintenance,2800000,2026-08-15,2026-09-20,MNRE empaneled integrators,Awarded,CONT-102,2650000
TND-2025-MH-088,MPLAD-2026-MH-001,Multipurpose Community Hall at Dindori,Tender for RCC Hall Construction,Civil works for 250 seater hall,2000000,2025-07-01,2025-08-15,Class A PWD,Awarded,CONT-101,1850000
`;

// 7. bids.csv
const bidsCSV = `bidId,tenderId,projectId,contractorId,contractorName,bidAmount,submissionDate,eligibilityInformation,status
BID-2025-001,TND-2025-MH-088,MPLAD-2026-MH-001,CONT-101,Apex Infra Tech Ltd,1850000,2025-08-01,Class A PWD Registered,Selected
BID-2025-002,TND-2025-MH-088,MPLAD-2026-MH-001,CONT-103,Shree Ganesh Constructions,1920000,2025-08-05,Class B Civil Registered,Not Selected
BID-2026-003,TND-2026-MH-102,MPLAD-2026-MH-008,CONT-102,Sahyadri Earthmovers & Infra,2650000,2026-09-05,Class A Heavy Earthmoving,Selected
`;

// 8. contracts.csv
const contractsCSV = `contractId,projectId,projectName,contractorId,contractorName,tenderId,contractAmount,startDate,expectedCompletionDate,actualCompletionDate,status,paidExpenditure,progressPercentage,costVariationPercent
CNT-2025-MH-001,MPLAD-2026-MH-001,Multipurpose Community Hall at Dindori,CONT-101,Apex Infra Tech Ltd,TND-2025-MH-088,1850000,2025-11-01,2026-05-30,,Active,1800000,40,0
CNT-2025-MH-002,MPLAD-2026-MH-002,Mountain Road Construction (Trimbak),CONT-102,Sahyadri Earthmovers & Infra,TND-2025-MH-042,3300000,2025-08-15,2026-08-15,,Active,3200000,85,0
CNT-2025-MH-006,MPLAD-2026-MH-006,Gram Panchayat Concrete Road & Drainage,CONT-106,Kadam Infra Projects,TND-2025-MH-019,1750000,2025-06-01,2025-12-31,2025-12-28,Completed,1750000,100,0
`;

// 9. payments.csv
const paymentsCSV = `billId,projectId,contractorId,billNumber,billAmount,submittedDate,status,approvedAmount,paymentReference,paidDate,costVariationPercent
BILL-2026-901,MPLAD-2026-MH-001,CONT-101,INV-2026/01,550000,2026-08-10,Approved,550000,UTR-992102198,2026-08-15,0
BILL-2026-902,MPLAD-2026-MH-001,CONT-101,INV-2026/02,480000,2026-09-01,Paid,480000,UTR-992104512,2026-09-05,0
BILL-2026-903,MPLAD-2026-MH-002,CONT-102,INV-2026/03,820000,2026-09-12,Submitted,0,,,0
`;

// 10. progress_updates.csv
const progressCSV = `reportId,projectId,contractorId,weekNumber,reportDate,progressPercentage,workCompletedThisWeek,amountSpentThisWeek,materialsUsed,numberOfWorkers,latitude,longitude,gpsAccuracyMeters,isManualLocation,timestamp
WR-2026-101,MPLAD-2026-MH-001,CONT-101,12,2026-08-10,35,Foundation slab and column casting,300000,Concrete TMT Steel,18,20.2012,73.8321,6,false,2026-08-10T10:30:00Z
WR-2026-102,MPLAD-2026-MH-001,CONT-101,13,2026-08-25,38,Brickwork elevation,150000,Bricks Cement,14,20.2012,73.8321,8,false,2026-08-25T11:15:00Z
WR-2026-103,MPLAD-2026-MH-001,CONT-101,14,2026-09-10,40,Plaster work on east wing,100000,Plaster Mortar,10,20.2012,73.8321,5,false,2026-09-10T09:45:00Z
`;

// 11. site_images.csv
const imagesCSV = `imageId,projectId,reportId,uploadedBy,imageUrl,latitude,longitude,timestamp,gpsAccuracyMeters,fileType,embeddingVectorSimScore
IMG-2026-01,MPLAD-2026-MH-001,WR-2026-103,CONT-101,https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80,20.2012,73.8321,2026-09-10T09:45:00Z,5,image/jpeg,1.0
IMG-2026-02,MPLAD-2026-MH-005A,CR-2026-103,USR-106,https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80,20.0789,74.1089,2026-09-12T14:20:00Z,8,image/jpeg,0.89
`;

// 12. complaints.csv
const complaintsCSV = `reportId,projectId,projectName,reportType,description,submittedBy,latitude,longitude,gpsAccuracyMeters,timestamp,verificationStatus,confidenceScore
CR-2026-101,MPLAD-2026-MH-003,Panchayat Samiti Hall Extension,Incorrect progress reported,Contractor claims roof slab completed but only foundation pillars erected,Ramesh Patil,19.8452,73.9981,8,2026-09-12T16:00:00Z,Corroborated,0.88
CR-2026-102,MPLAD-2026-MH-001,Multipurpose Community Hall at Dindori,Work stopped,No construction activity or labor observed on site for over 20 days,Sunita Deshmukh,20.2015,73.8324,10,2026-09-11T11:30:00Z,Under Review,0.75
CR-2026-103,MPLAD-2026-MH-005A,Primary Health Center Emergency Ward,Possible duplicate work,This building extension was sanctioned under another grant,Anonymous,20.0789,74.1089,12,2026-09-09T09:10:00Z,Unverified,0.60
`;

// 13. inspections.csv
const inspectionsCSV = `inspectionId,projectId,inspectorName,inspectorRole,inspectionDate,observedProgress,status,remarks,photosAttached
INSP-2026-01,MPLAD-2026-MH-006,Suresh Varma,District Civil Engineer,2025-12-28,100,Satisfactory,Quality CC road completed according to PWD specifications,true
INSP-2026-02,MPLAD-2026-MH-001,Kiran Thorat,Assistant Engineer PWD,2026-08-20,40,Progress Lag,Work progressing slowly relative to fund disbursement,true
`;

// 14. anomaly_labels.csv
const anomalyCSV = `alertId,projectId,type,riskLevel,riskScore,date,reason,status
ALT-2026-901,MPLAD-2026-MH-005A,Possible duplicate,CRITICAL,92,2026-09-15,"Possible duplicate detected: Project within 12m, 89% photo similarity, identical contractor metadata.",New
ALT-2026-902,MPLAD-2026-MH-003,Progress discrepancy,CRITICAL,84,2026-09-14,"Contractor reported 70% physical completion, whereas 3 citizen reports estimate 40%.",Under Review
ALT-2026-903,MPLAD-2026-MH-001,Cost anomaly,HIGH,78,2026-09-10,"High expenditure relative to physical progress: 90% funds spent while physical completion is 40%.",New
ALT-2026-904,MPLAD-2026-MH-004,Project delay,HIGH,75,2026-09-08,"Significant milestone delay: Expected completion was Nov 2025 (10 months overdue).",New
`;

// Write CSV files
fs.writeFileSync(path.join(dataDir, 'projects.csv'), projectsCSV);
fs.writeFileSync(path.join(dataDir, 'users.csv'), usersCSV);
fs.writeFileSync(path.join(dataDir, 'implementing_agencies.csv'), agenciesCSV);
fs.writeFileSync(path.join(dataDir, 'contractors.csv'), contractorsCSV);
fs.writeFileSync(path.join(dataDir, 'recommendations.csv'), recommendationsCSV);
fs.writeFileSync(path.join(dataDir, 'tenders.csv'), tendersCSV);
fs.writeFileSync(path.join(dataDir, 'bids.csv'), bidsCSV);
fs.writeFileSync(path.join(dataDir, 'contracts.csv'), contractsCSV);
fs.writeFileSync(path.join(dataDir, 'payments.csv'), paymentsCSV);
fs.writeFileSync(path.join(dataDir, 'progress_updates.csv'), progressCSV);
fs.writeFileSync(path.join(dataDir, 'site_images.csv'), imagesCSV);
fs.writeFileSync(path.join(dataDir, 'complaints.csv'), complaintsCSV);
fs.writeFileSync(path.join(dataDir, 'inspections.csv'), inspectionsCSV);
fs.writeFileSync(path.join(dataDir, 'anomaly_labels.csv'), anomalyCSV);

console.log('✅ Generated all 14 synthetic dataset CSV files in server/data/');
