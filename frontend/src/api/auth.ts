import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/auth/login`, data);
  return res.data;
};

export const signup = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/auth/signup`, data);
  return res.data;
};