import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export function axiosLogInterceptor(axios: AxiosInstance) {
  let count = 0

  function transformRequest(request: AxiosRequestConfig) {
    const data = {
      id: (request as any).__count,
      on: 'request',
      url: `${request.baseURL}${request.url}`,
      method: request.method,
      params: request.params,
      data: request.data,
      headers: request.headers,
    }
    return data
  }

  function transformResponse(response: AxiosResponse) {
    const startTime = (response.config as any).__startTime
    const endTime = new Date().getTime()
    const duration = endTime - startTime
    const data = transformRequest(response.config)
    return {
      id: data.id,
      on: 'response',
      url: data.url,
      method: data.method,
      params: data.params,
      status: response.status,
      data: response.data,
      duration,
      headers: data.headers,
    }
  }

  axios.interceptors.request.use(
    (request) => {
      ;(request as any).__startTime = new Date().getTime()
      ;(request as any).__count = count++
      console.log(transformRequest(request))
      return request
    },
    (error) => {
      if (error.request) {
        console.error(transformRequest(error.request))
      }
      return Promise.reject(error)
    },
  )
  axios.interceptors.response.use(
    (response) => {
      console.log(transformResponse(response))
      return response
    },
    (error) => {
      if (error.response) {
        console.error(transformResponse(error.response))
      }
      return Promise.reject(error)
    },
  )
}
