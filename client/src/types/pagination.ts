export interface PaginatedData {
    next: string | null
    previous: string | null
    count: number
    page_size: number
    total_pages: number
    current_page: number
}