import axios from 'axios';
import { getAuth } from '../utils/auth';

const BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuth().token}`,
  },
});

export const fetchSubjects = () => axios.get(`${BASE_URL}/api/teacher`, getAuthHeaders());

export const fetchCoordinatorDivision = () => axios.get(`${BASE_URL}/api/teacher/coordinator`, getAuthHeaders());

