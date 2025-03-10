import axios from 'axios'

const Backend = axios.create({
  baseURL: 'https://quesubsidio1-2megxp6a.b4a.run',
})

// Interceptores

Backend.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log(config)
  return config
})

export { Backend }
