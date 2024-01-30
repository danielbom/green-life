import { axios } from './_axios'
import { Api } from './api'

export const api = new Api(axios)

export type * from './types'
export type * from './endpoints/auth.endpoint'
export type * from './endpoints/bed-schedules.endpoint'
export type * from './endpoints/grounds.endpoint'
export type * from './endpoints/grounds-donate.endpoint'
export type * from './endpoints/peoples.endpoint'
export type * from './endpoints/seeds.endpoint'
export type * from './endpoints/tools.endpoint'
export type * from './endpoints/users.endpoint'
export type * from './endpoints/voluntaries.endpoint'
export type * from './endpoints/voluntaries-request.endpoint'
export type * from './endpoints/voluntaries-using-seeds.endpoint'
export type * from './endpoints/voluntaries-using-tools.endpoint'
