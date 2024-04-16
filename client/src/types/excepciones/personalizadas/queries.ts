export type CustomQueriesResponse = {
  id: number;
  name: string;
  query: string;
  table: string;
  created_at: string;
  updated_at: string;
  connection: number;
  only_this_connection: boolean;
};

export type CustomQueriesRequest = {
  id?: number;
  table: string;
  name: string;
  query: string;
  only_this_connection: boolean;
};
