export interface Message {
  role: "user" | "ai";
  content: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  theme?: string;
  tags: string[];
  shelf_id?: string;
}

export interface Shelf {
  _id: string;
  name: string;
}