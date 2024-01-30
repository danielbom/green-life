import { ApiResponse, HttpClient, Int, OrderByQuery, Pagination, PaginationQuery, SearchQuery, Uuid } from '../types'

export class GroundsEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<Ground> {
    return this.httpClient.get(`/api/grounds/${id}`)
  }

  index(query: GroundIndex): ApiResponse<Pagination<Ground>> {
    return this.httpClient.get('/api/grounds', { params: query })
  }

  store(body: GroundStore): ApiResponse<Ground> {
    return this.httpClient.post('/api/grounds', body)
  }

  update(id: Uuid, body: GroundUpdate): ApiResponse<Ground> {
    return this.httpClient.put(`/api/grounds/${id}`, body)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/grounds/${id}`)
  }
}

export type Bed = {
  label: string
  active: boolean
  free: boolean
  seed_id?: Uuid
  bed_schedules_id?: Uuid
}

export type Ground = {
  id: Uuid
  address: string
  width: Int
  length: Int
  description: string
  owner_id?: Uuid
  manager_id?: Uuid
  active: boolean
  beds: Bed[]
}

export type GroundOrderBy = '' | 'address_up' | 'address_down'
export type GroundIndex = PaginationQuery & SearchQuery & OrderByQuery<GroundOrderBy>

export type GroundStore = {
  width: Int
  length: Int
  address: string
  description: string
  beds_count: Int
  owner_id?: string
}

export type GroundUpdate = {
  width?: Int
  length?: Int
  address?: string
  description?: string
  owner_id?: string
}
