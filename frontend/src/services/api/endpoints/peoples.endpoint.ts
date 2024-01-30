import {
  ApiResponse,
  DateString,
  HttpClient,
  OrderByQuery,
  Pagination,
  PaginationQuery,
  SearchQuery,
  Uuid,
} from '../types'

export class PeoplesEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<People> {
    return this.httpClient.get(`/api/peoples/${id}`)
  }

  index(query: PeopleIndex): ApiResponse<Pagination<People>> {
    return this.httpClient.get('/api/peoples', { params: query })
  }

  store(body: PeopleStore): ApiResponse<People> {
    return this.httpClient.post('/api/peoples', body)
  }

  update(id: Uuid, body: PeopleUpdate): ApiResponse<People> {
    return this.httpClient.put(`/api/peoples/${id}`, body)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/peoples/${id}`)
  }
}

export type People = {
  id: string
  name: string
  email: string
  cellphone: string
  birth_date: DateString
  address: string
}

export type PeopleOrderBy =
  | ''
  | 'name_up'
  | 'name_down'
  | 'birth_date_up'
  | 'birth_date_down'
  | 'address_up'
  | 'address_down'
export type PeopleIndex = PaginationQuery & SearchQuery & OrderByQuery<PeopleOrderBy>

export type PeopleStore = {
  name: string
  email: string
  cellphone: string
  birth_date: DateString
  address: string
}

export type PeopleUpdate = {
  name?: string
  email?: string
  cellphone?: string
  birth_date?: DateString
  address?: string
}
