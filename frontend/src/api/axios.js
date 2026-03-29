import axios from 'axios'

const API = axios.create({
  baseURL: 'https://haul-ecommerce-production.up.railway.app/api',
})

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  // FormData ke liye Content-Type remove karo — axios khud set karega
  if (req.data instanceof FormData) {
    delete req.headers['Content-Type']
  }
  return req
})

export default API