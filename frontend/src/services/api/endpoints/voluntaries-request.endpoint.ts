import { ApiResponse, HttpClient, PaginationQuery, Uuid } from '../types'

export class VoluntariesRequestEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<VoluntaryRequest> {
    return this.httpClient.get(`/api/voluntaries-request/${id}`)
  }

  index(query: VoluntaryRequestIndex): ApiResponse<VoluntaryRequest[]> {
    return this.httpClient.get('/api/voluntaries-request', { params: query })
  }

  store(body: VoluntaryRequestStore): ApiResponse<VoluntaryRequest> {
    return this.httpClient.post('/api/voluntaries-request', body)
  }

  update(id: Uuid, body: VoluntaryRequestUpdate): ApiResponse<VoluntaryRequest> {
    return this.httpClient.put(`/api/voluntaries-request/${id}`, body)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/voluntaries-request/${id}`)
  }
}

export type VoluntaryRequest = {
  id: Uuid
  name: string
  email: string
  cellphone: string
  birth_date: string
  address: string
}

export type VoluntaryRequestIndex = PaginationQuery

export type VoluntaryRequestStore = {
  name: string
  email: string
  cellphone: string
  birth_date: string
  address: string
}

export type VoluntaryRequestUpdate = {
  name?: string
  email?: string
  cellphone?: string
  birth_date?: string
  address?: string
}
