import axios from "axios";

const API = "http://localhost:8000";

export const login = async (data: any) => {
  const res = await axios.post(`${API}/auth/login`, data);
  return res.data;
};

export const signup = async (data: any) => {
  const res = await axios.post(`${API}/auth/signup`, data);
  return res.data;
};