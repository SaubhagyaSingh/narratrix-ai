import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const verifyEmail = async (token: string) => {
  const res = await axios.post(
    `${API}/auth/verify-email`,
    null,
    {
      params: { token }
    }
  );

  return res.data;
};