import { ApiResponse, HttpClient } from '../types'
import { UserResponse } from './users.endpoint'

export class AuthEndpoint {
  constructor(private httpClient: HttpClient) {}

  login(body: AuthLogin): ApiResponse<AuthLoginResponse> {
    const form = new FormData()
    form.append('username', body.username)
    form.append('password', body.password)
    return this.httpClient.post('/api/auth/login', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  me(): ApiResponse<UserResponse> {
    return this.httpClient.get('/api/auth/me')
  }

  // TODO: pass refresh token as argument
  refresh(): ApiResponse<AuthLoginResponse> {
    return this.httpClient.post('/api/auth/refresh')
  }
}

export type AuthLogin = {
  username: string
  password: string
}

export type AuthLoginResponse = {
  refresh_token: string
  access_token: string
  token_type: string
}
