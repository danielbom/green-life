import { ApiResponse, HttpClient, PaginationQuery, Uuid } from '../types'

export class VoluntariesUsingToolsEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<VoluntaryUsingTool> {
    return this.httpClient.get(`/api/voluntaries-using-tools/${id}`)
  }

  index(query: VoluntaryUsingToolIndex): ApiResponse<VoluntaryUsingTool[]> {
    return this.httpClient.get('/api/voluntaries-using-tools', { params: query })
  }

  start(body: VoluntaryUsingToolStart): ApiResponse<VoluntaryUsingTool> {
    return this.httpClient.post('/api/voluntaries-using-tools/start', body)
  }

  end(id: Uuid): ApiResponse<VoluntaryUsingTool> {
    return this.httpClient.put(`/api/voluntaries-using-tools/end/${id}`)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/voluntaries-using-tools/${id}`)
  }
}

export type VoluntaryUsingTool = {
  voluntary_id: Uuid
  tool_id: Uuid
  start_date: string
  end_date: string | null
}

export type VoluntaryUsingToolIndex = PaginationQuery & {
  voluntary_id?: Uuid
  tool_id?: Uuid
  ground_id?: string
  bed_label?: string
}

export type VoluntaryUsingToolStart = {
  voluntary_id: Uuid
  tool_id: Uuid
}
