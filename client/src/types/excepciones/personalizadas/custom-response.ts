import { PaginatedData } from "@/types/pagination";

export type PersonalizadaResult = {
  result: "ok";
  query: string;
  timestamp: string;
  table: string;
  num_rows: number;
  headers: string[];
  rows: PaginatedData & {
    data: any[];
  };
};
