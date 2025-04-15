import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const signup = (data) => axios.post(`${BASE_URL}/auth/signup`, data);
export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);
