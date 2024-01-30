import { ApiResponse, HttpClient, Int, OrderByQuery, Pagination, PaginationQuery, SearchQuery, Uuid } from '../types'

export class SeedsEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<Seed> {
    return this.httpClient.get(`/api/seeds/${id}`)
  }

  index(query: SeedIndex): ApiResponse<Pagination<Seed>> {
    return this.httpClient.get('/api/seeds', { params: query })
  }

  store(body: SeedStore): ApiResponse<Seed> {
    return this.httpClient.post('/api/seeds', body)
  }

  update(id: Uuid, body: SeedUpdate): ApiResponse<Seed> {
    return this.httpClient.put(`/api/seeds/${id}`, body)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/seeds/${id}`)
  }
}

export type SeedType = 'vegetable' | 'fruit' | 'herb' | 'other'

export type Seed = {
  id: Uuid
  name: string
  description: string
  amount: Int
  seed_type: SeedType
}

export type SeedOrderBy = '' | 'name_up' | 'name_down'
export type SeedIndex = PaginationQuery & SearchQuery & OrderByQuery<SeedOrderBy>

export type SeedStore = {
  name: string
  amount: Int
  description: string
  seed_type: SeedType
}

export type SeedUpdate = {
  name?: string
  amount?: Int
  description?: string
  seed_type?: SeedType
}
