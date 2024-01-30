import { ApiResponse, HttpClient, PaginationQuery, Uuid } from '../types'

export class VoluntariesUsingSeedsEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<VoluntaryUsingSeed> {
    return this.httpClient.get(`/api/voluntaries-using-seeds/${id}`)
  }

  index(query: VoluntaryUsingSeedIndex): ApiResponse<VoluntaryUsingSeed[]> {
    return this.httpClient.get('/api/voluntaries-using-seeds', { params: query })
  }

  start(body: VoluntaryUsingSeedStart): ApiResponse<VoluntaryUsingSeed> {
    return this.httpClient.post('/api/voluntaries-using-seeds/start', body)
  }

  end(id: Uuid): ApiResponse<VoluntaryUsingSeed> {
    return this.httpClient.put(`/api/voluntaries-using-seeds/end/${id}`)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/voluntaries-using-seeds/${id}`)
  }
}

export type VoluntaryUsingSeed = {
  voluntary_id: Uuid
  tool_id: Uuid
  start_date: string
  end_date: string | null
}

export type VoluntaryUsingSeedIndex = PaginationQuery & {
  voluntary_id?: Uuid
  tool_id?: Uuid
  ground_id?: string
  bed_label?: string
}

export type VoluntaryUsingSeedStart = {
  voluntary_id: Uuid
  tool_id: Uuid
}
