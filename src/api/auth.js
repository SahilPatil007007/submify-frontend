import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const signup = (data) => axios.post(`${BASE_URL}/auth/signup`, data);
export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);
