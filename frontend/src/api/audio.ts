import api from "@/lib/api";

export const generateSpeech = async (text: string): Promise<Blob> => {
  const res = await api.post(
    "/audio/speak",
    { text },
    {
      responseType: "blob",
    }
  );

  return res.data;
};