import axios from "axios";
import api from "@/lib/api";

export const login = async (data: any) => {
  const res = await axios.post(`${api}/auth/login`, data);
  return res.data;
};

export const signup = async (data: any) => {
  const res = await axios.post(`${api}/auth/signup`, data);
  return res.data;
};