import { useState, useEffect } from "react";
import { getShelves, createShelf } from "@/api/shelves";
import { Shelf } from "@/types";

export function useShelves() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShelves()
      .then(setShelves)
      .finally(() => setLoading(false));
  }, []);

  const addShelf = async (name: string) => {
    const shelf = await createShelf(name);
    setShelves((prev) => [...prev, shelf]);
    return shelf;
  };

  return { shelves, loading, addShelf };
}