import axios, { AxiosError } from "axios"

const api = axios.create({
  baseURL:  "http://localhost:5050",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (response) => { 
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default api