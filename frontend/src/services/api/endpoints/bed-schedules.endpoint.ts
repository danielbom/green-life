import { ApiResponse, DateString, HttpClient, Int, Pagination, PaginationQuery, Uuid } from '../types'

export class BedSchedulesEndpoint {
  constructor(private httpClient: HttpClient) {}

  show(id: Uuid): ApiResponse<BedSchedules> {
    return this.httpClient.get(`/api/bed-schedules/${id}`)
  }

  index(query: BedSchedulesIndex): ApiResponse<Pagination<BedSchedules>> {
    return this.httpClient.get('/api/bed-schedules', { params: query })
  }

  store(body: BedScheduleStore): ApiResponse<BedSchedules> {
    return this.httpClient.post('/api/bed-schedules', body)
  }

  update(id: Uuid, body: BedScheduleUpdate): ApiResponse<BedSchedules> {
    return this.httpClient.put(`/api/bed-schedules/${id}`, body)
  }

  adjust(id: Uuid, body: BedScheduleAdjust): ApiResponse<BedSchedules> {
    return this.httpClient.patch(`/api/bed-schedules/${id}/adjust`, body)
  }

  close(id: Uuid, body: BedScheduleClose): ApiResponse<BedSchedules> {
    return this.httpClient.patch(`/api/bed-schedules/${id}/close`, body)
  }

  delete(id: Uuid): ApiResponse<void> {
    return this.httpClient.delete(`/api/bed-schedules/${id}`)
  }
}

export type BedSchedule = {
  seed_id: Uuid
  start_at: DateString
  end_at: DateString
}

export type BedScheduleStore = {
  ground_id: Uuid
  bed_label: string
  schedules: BedSchedule[]
}

export type BedSchedulesIndex = PaginationQuery & {
  ground_id: Uuid
  bed_label: string
}

export type BedScheduleUpdate = {
  schedules: BedSchedule[]
  current_schedule: Int
}

export type BedScheduleAdjust = {
  end_at: DateString
}

export type BedScheduleClose = {
  amount: Int
  unit: string
  date: DateString
}

export type BedSchedules = {
  id: Uuid
  ground_id: Uuid
  bed_label: string
  schedules: BedSchedule[]
  current_schedule?: Int
}
