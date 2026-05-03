import api from "@/lib/api";

export const uploadPdf = async (bookId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/ai/upload-pdf/${bookId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const askQuestion = async (bookId: string, query: string) => {
  const res = await api.post(`/ai/ask/${bookId}`, null, {
    params: { query },
  });
  return res.data;
};