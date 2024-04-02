export interface TableExceptionResponse {
    table: string
    results: Result[]
  }
  
  export interface Result {
    column: string
    foreing_table: string
    foreing_column: string
    results: ResultValues[]
  }
  
  export interface ResultValues {
    primary_key: string
    foreign_key: number
    table_foreign_key: any
  }
  

export interface TableExceptionRequest {
    table: string
    details: Detail[]
  }
  
  export interface Detail {
    column_name: string
    condition: string
    foreing_table: string
    foreing_column: string
  }
  