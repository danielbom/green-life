import { ApiResponse, DateString, HttpClient, Pagination, PaginationQuery, SearchQuery, Uuid } from '../types'

export class VoluntariesEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<Voluntary> {
    return this.httpClient.get(`/api/voluntaries/${id}`)
  }

  index(query: VoluntaryIndex): ApiResponse<Pagination<Voluntary>> {
    return this.httpClient.get('/api/voluntaries', { params: query })
  }

  store(body: VoluntaryStore): ApiResponse<Voluntary> {
    return this.httpClient.post('/api/voluntaries', body)
  }

  storeMany(body: VoluntaryStore[]): ApiResponse<VoluntaryStoreMany> {
    return this.httpClient.post('/api/voluntaries/many', body)
  }

  update(id: Uuid, body: VoluntaryUpdate): ApiResponse<Voluntary> {
    return this.httpClient.put(`/api/voluntaries/${id}`, body)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/voluntaries/${id}`)
  }
}

export type Voluntary = {
  id: Uuid
  people_id: Uuid
  people_name: string
  ground_id: Uuid
  bed_label: string
  is_responsible: boolean
  start_at: DateString
  end_at?: DateString
}

export type VoluntaryIndex = PaginationQuery &
  SearchQuery & {
    ground_id?: Uuid
    people_id?: Uuid
    bed_label?: string
  }

export type VoluntaryStore = {
  people_id: Uuid
  ground_id: Uuid
  bed_label: string
  start_at: DateString
  is_responsible: boolean
}

export type VoluntaryOrError = {
  voluntary?: Voluntary
  error?: string
}

export type VoluntaryStoreMany = {
  results: VoluntaryOrError[]
}

export type VoluntaryUpdate = {
  start_at?: DateString
  end_at?: DateString
  is_responsible?: boolean
}
