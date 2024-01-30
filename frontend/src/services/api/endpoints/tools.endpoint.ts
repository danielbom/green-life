import { ApiResponse, HttpClient, Int, OrderByQuery, Pagination, PaginationQuery, SearchQuery, Uuid } from '../types'

export class ToolsEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<Tool> {
    return this.httpClient.get(`/api/tools/${id}`)
  }

  index(query: ToolIndex): ApiResponse<Pagination<Tool>> {
    return this.httpClient.get('/api/tools', { params: query })
  }

  store(body: ToolStore): ApiResponse<Tool> {
    return this.httpClient.post('/api/tools', body)
  }

  update(id: Uuid, body: ToolUpdate): ApiResponse<Tool> {
    return this.httpClient.put(`/api/tools/${id}`, body)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/tools/${id}`)
  }
}

export type Tool = {
  id: Uuid
  name: string
  description: string
  amount: Int
}

export type ToolOrderBy = '' | 'name_up' | 'name_down'
export type ToolIndex = PaginationQuery & SearchQuery & OrderByQuery<ToolOrderBy>

export type ToolStore = {
  name: string
  amount: Int
  description: string
}

export type ToolUpdate = {
  name?: string
  amount?: Int
  description?: string
}
