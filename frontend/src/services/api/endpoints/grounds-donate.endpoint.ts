import { ApiResponse, DateString, HttpClient, Pagination, PaginationQuery, Uuid } from '../types'

export class GroundsDonateEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<GroundDonate> {
    return this.httpClient.get(`/api/grounds-donate/${id}`)
  }

  index(query: GroundDonateIndex): ApiResponse<Pagination<GroundDonate>> {
    return this.httpClient.get('/api/grounds-donate', { params: query })
  }

  store(body: GroundDonateStore): ApiResponse<GroundDonate> {
    return this.httpClient.post('/api/grounds-donate', body)
  }

  update(id: Uuid, body: GroundDonateUpdate): ApiResponse<GroundDonate> {
    return this.httpClient.put(`/api/grounds-donate/${id}`, body)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/grounds-donate/${id}`)
  }
}

export type GroundDonate = {
  id: Uuid
  name: string
  email: string
  cellphone: string
  birth_date: string
  address: string
  ground_address: string
}

export type GroundDonateIndex = PaginationQuery

export type GroundDonateStore = {
  name: string
  email: string
  cellphone: string
  birth_date: DateString
  address: string
  ground_address: string
}

export type GroundDonateUpdate = {
  name?: string
  email?: string
  cellphone?: string
  birth_date?: DateString
  address?: string
  ground_address?: string
}
