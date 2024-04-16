import { PaginatedData } from "@/types/pagination";

export type SecuenciaExceptionResponse = {
  result: "exception";
  table: string;
  column: string;
  database: string;
  datetime_analysis: string;
  min: string;
  max: string;
  num_duplicates: number;
  duplicates: PaginatedData & {
    data: any[];
  };
  num_missing: number;
  missing: PaginatedData & {
    data: any[];
  };
  num_sequence_errors: number;
  sequence_errors: PaginatedData & {
    data: {
      expected: string;
      found: string;
    }[];
  };
};

export type SecuenciaOkResponse = {
  result: "ok";
  table: string;
  column: string;
  database: string;
  datetime_analysis: string;
  min: string;
  max: string;
};