import Axios from 'axios'

const baseURL = ''

const axios = Axios.create({
  baseURL,
  timeout: 20000
})

axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.data) {
      const code = error.response.status
      const msg = error.response.data.message
      console.error(`Code: ${code}, Message: ${msg}`)
      console.error('[Axios Error]', error.response)
    } else {
      console.error(`${error}`)
    }
    return Promise.reject(error)
  }
)

export default axios
