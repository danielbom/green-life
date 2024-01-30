const apiBaseURL = import.meta.env.VITE_API_BASE_URL
const username = import.meta.env.VITE_USERNAME
const password = import.meta.env.VITE_PASSWORD
const debugApi = import.meta.env.VITE_DEBUG_API ?? true

export default {
  username,
  password,
  apiBaseURL,
  debugApi,
}
