import _axios from 'axios'
import { axiosLogInterceptor } from './_axios-log-interceptor'
import _config from './_config'

export const axios = _axios.create({
  baseURL: _config.apiBaseURL,
  headers: { 'Content-Type': 'application/json' },
})

if (_config.debugApi) {
  axiosLogInterceptor(axios)
}
