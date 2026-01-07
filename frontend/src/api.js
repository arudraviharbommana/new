import axios from 'axios'

const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default axios.create({ baseURL: `${base}/api` })
