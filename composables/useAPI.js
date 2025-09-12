const API_ENDPOINTS = {
  stores: {
    device_history: "/device_history",
    data_sensor: "/data_sensor",
    list_devices: "/list_devices",
    control_device: "/control_device",
  },
}
class Request {
  constructor() {
    this.baseURL = useRuntimeConfig().public.baseUrl
    this.headers = {}
  }
  fetch(url, method, options) {
    this.headers = {
      "Content-type": "application/json",
    }

    return useFetch(url, {
      baseURL: this.baseURL,
      method: method,
      headers: this.headers,
      ...options,
    })
  }

  get(url, options) {
    return this.fetch(url, "GET", options)
  }
  post(url, options) {
    return this.fetch(url, "POST", options)
  }
  put(url, options) {
    return this.fetch(url, "PUT", options)
  }
  patch(url, options) {
    return this.fetch(url, "PATCH", options)
  }
  delete(url, options) {
    return this.fetch(url, "DELETE", options)
  }
}

class API {
  constructor(request) {
    this.request = request
  }
  async getDeviceHistory(data) {
    return this.request.get(`${API_ENDPOINTS.stores.device_history}`, data)
  }
  async getDataSensor(data) {
    return this.request.get(`${API_ENDPOINTS.stores.data_sensor}`, data)
  }
  async getListDevice(data) {
    return this.request.get(`${API_ENDPOINTS.stores.list_devices}`, data)
  }
  async conTrolDevice(data) {
    return this.request.post(`${API_ENDPOINTS.stores.control_device}`,data)
  }
}

class RestAPI {
  constructor() {
    this.request = new Request()
    this.stores = new API(this.request)
  }
}
export default () => ({ restAPI: new RestAPI() })
