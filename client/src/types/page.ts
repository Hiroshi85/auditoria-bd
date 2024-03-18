export interface PageParams {
  page: number
  size: number
  meta?: any
}

export interface Paginate<T> {
  items: T[]
  meta: Meta
}

export interface Meta {
  totalItems: number
  itemCount: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export function GetPageQueries(params: PageParams): string {
  var query = `?page=${params.page}&limit=${params.size}`

  if (params.meta){
    const metaKey = Object.keys(params.meta)
    metaKey.forEach(
      (key) => {
        query += `&${key}=${params.meta[key]}`
      }
    )
  }

  return query

}