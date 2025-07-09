import axios from 'axios';
import { getAuth } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuth().token}`,
  },
});

// Student Management
export const uploadStudentsCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/api/admin/fill-student`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const findStudent = (studentId) => 
  axios.get(`${BASE_URL}/api/admin/find-student?studentId=${studentId}`, getAuthHeaders());

export const updateStudent = (studentData) => 
  axios.put(`${BASE_URL}/api/admin/update-student`, studentData, getAuthHeaders());

// Teacher Management
export const findTeacher = (teacherId) => 
  axios.get(`${BASE_URL}/api/admin/find-teacher?teacherId=${teacherId}`, getAuthHeaders());

export const updateTeacher = (teacherData) => 
  axios.put(`${BASE_URL}/api/admin/update-teacher`, teacherData, getAuthHeaders());

// Email Management
export const allowEmail = (email) => 
  axios.post(`${BASE_URL}/api/admin/allow-email?email=${email}`, {}, getAuthHeaders());

export const uploadAllowedEmailsCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/api/admin/upload-allowed-emails`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Division Management
export const uploadDivisionsCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/api/admin/upload-divisions`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Batch Management
export const uploadBatchesCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/api/admin/upload-batches`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Subject Management
export const uploadSubjectsCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/api/admin/upload-subjects`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Coordinator Assignment
export const assignCoordinator = (divisionId, teacherId) => 
  axios.post(`${BASE_URL}/api/admin/assign-coordinator`, {
    division: divisionId,
    teacherId: teacherId
  }, getAuthHeaders()); 