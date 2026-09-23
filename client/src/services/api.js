import axios from 'axios';

// Read backend URL dynamically from environment variable or fallback to local Express server
const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Role and Auth headers dynamically
api.interceptors.request.use((config) => {
  const activeRole = localStorage.getItem('mplads_active_role') || 'MINISTRY';
  const assignedState = localStorage.getItem('mplads_assigned_state') || 'MH';
  const assignedDistrict = localStorage.getItem('mplads_assigned_district') || 'Nashik';
  const assignedConstituency = localStorage.getItem('mplads_assigned_constituency') || 'Nashik-LS';
  const contractorId = localStorage.getItem('mplads_contractor_id') || 'CONT-101';

  config.headers['x-demo-role'] = activeRole;
  config.headers['x-assigned-state'] = assignedState;
  config.headers['x-assigned-district'] = assignedDistrict;
  config.headers['x-assigned-constituency'] = assignedConstituency;
  config.headers['x-contractor-id'] = contractorId;

  return config;
});

export const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.warn("Using fallback local projects payload:", error);
    return null;
  }
};

export const fetchProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchTenders = async () => {
  try {
    const response = await api.get('/tenders');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const submitBid = async (tenderId, bidData) => {
  const response = await api.post(`/tenders/${tenderId}/bids`, bidData);
  return response.data;
};

export const createTender = async (tenderData) => {
  const response = await api.post('/tenders', tenderData);
  return response.data;
};

export const fetchContractorProfile = async (contractorId) => {
  try {
    const response = await api.get(`/contractors/${contractorId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// All AI requests route through Express backend (React -> Express -> FastAPI)
export const evaluateAIRisk = async (projectData) => {
  try {
    const response = await api.post('/ai/risk', projectData);
    return response.data;
  } catch (error) {
    return null;
  }
};

export default api;
