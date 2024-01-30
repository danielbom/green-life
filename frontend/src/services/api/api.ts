import { AuthEndpoint } from './endpoints/auth.endpoint'
import { BedSchedulesEndpoint } from './endpoints/bed-schedules.endpoint'
import { GroundsDonateEndpoint } from './endpoints/grounds-donate.endpoint'
import { GroundsEndpoint } from './endpoints/grounds.endpoint'
import { PeoplesEndpoint } from './endpoints/peoples.endpoint'
import { SeedsEndpoint } from './endpoints/seeds.endpoint'
import { ToolsEndpoint } from './endpoints/tools.endpoint'
import { UsersEndpoint } from './endpoints/users.endpoint'
import { VoluntariesRequestEndpoint } from './endpoints/voluntaries-request.endpoint'
import { VoluntariesUsingSeedsEndpoint } from './endpoints/voluntaries-using-seeds.endpoint'
import { VoluntariesUsingToolsEndpoint } from './endpoints/voluntaries-using-tools.endpoint'
import { VoluntariesEndpoint } from './endpoints/voluntaries.endpoint'
import { HttpClient } from './types'

class ApiJWT {
  constructor(public httpClient: HttpClient) {}

  setToken(token: string) {
    this.httpClient.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  removeToken() {
    delete this.httpClient.defaults.headers.common.Authorization
  }

  isTokenSet() {
    return !!this.httpClient.defaults.headers.common.Authorization
  }
}

export class Api extends ApiJWT {
  auth = new AuthEndpoint(this.httpClient)
  bedSchedules = new BedSchedulesEndpoint(this.httpClient)
  groundsDonate = new GroundsDonateEndpoint(this.httpClient)
  grounds = new GroundsEndpoint(this.httpClient)
  peoples = new PeoplesEndpoint(this.httpClient)
  seeds = new SeedsEndpoint(this.httpClient)
  tools = new ToolsEndpoint(this.httpClient)
  users = new UsersEndpoint(this.httpClient)
  voluntariesRequest = new VoluntariesRequestEndpoint(this.httpClient)
  voluntariesUsingTools = new VoluntariesUsingToolsEndpoint(this.httpClient)
  voluntariesUsingSeeds = new VoluntariesUsingSeedsEndpoint(this.httpClient)
  voluntaries = new VoluntariesEndpoint(this.httpClient)
}
