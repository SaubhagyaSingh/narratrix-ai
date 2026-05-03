import api from "@/lib/api";

export const getShelves = async () => {
  const res = await api.get("/shelves/");
  return res.data;
};

export const createShelf = async (name: string) => {
  const res = await api.post("/shelves/", { name });
  return {
    _id: res.data.id,  
    name,
  };
};