const API_ENDPOINTS = {
  stores: {
    login: "/auth/login",
    device_history: "api/device_history",
    data_sensor: "api/data_sensor",
    list_devices: "api/list_devices",
    control_device: "api/control_device",
    device_stats_today: "api/device_stats/today",
    device_stats_by_date: "api/device_stats",
    device_stats_by_date_range : "/api/device_stats/by_date_range",
  },
};
class Request {
  constructor() {
    this.baseURL = useRuntimeConfig().public.baseUrl;
    this.headers = {};
  }
  // ✅ THÊM METHOD LẤY TOKEN
  getAuthToken() {
    const token = useCookie("auth-token");
    return token.value;
  }
  // ✅ SET AUTH HEADERS TỰ ĐỘNG
  setAuthHeaders() {
    const token = this.getAuthToken();
    this.headers = {
      "Content-type": "application/json",
    };

    if (token) {
      this.headers.Authorization = `Bearer ${token}`;
    }
  }
  fetch(url, method, options) {
    this.setAuthHeaders(); // ✅ TỰ ĐỘNG THÊM TOKEN

    return useFetch(url, {
      baseURL: this.baseURL,
      method: method,
      headers: this.headers,
      ...options,
    });
  }
  // Thêm method cho $fetch (không cache, thực thi mỗi lần gọi)
  async directFetch(url, method, options) {
    this.setAuthHeaders(); //  TỰ ĐỘNG THÊM TOKEN

    return await $fetch(url, {
      baseURL: this.baseURL,
      method: method,
      headers: this.headers,
      ...options,
    });
  }

  get(url, options) {
    return this.fetch(url, "GET", options);
  }
  post(url, options) {
    return this.fetch(url, "POST", options);
  }
  // Thêm method cho direct POST
  async postDirect(url, options) {
    return await this.directFetch(url, "POST", options);
  }
  async getDirect(url, options) {
    return await this.directFetch(url, "GET", options);
  }
  put(url, options) {
    return this.fetch(url, "PUT", options);
  }
  patch(url, options) {
    return this.fetch(url, "PATCH", options);
  }
  delete(url, options) {
    return this.fetch(url, "DELETE", options);
  }
}

class API {
  constructor(request) {
    this.request = request;
  }
  async login(data) {
    return this.request.postDirect(`${API_ENDPOINTS.stores.login}`, data);
  }
  async getDeviceHistory(data) {
    return this.request.get(`${API_ENDPOINTS.stores.device_history}`, data);
  }
  async getDataSensor(data) {
    return this.request.get(`${API_ENDPOINTS.stores.data_sensor}`, data);
  }
  async getDataSensorv1(data) {
    return this.request.getDirect(`${API_ENDPOINTS.stores.data_sensor}`, data);
  }
  //  MỚI: Lấy thống kê thiết bị hôm nay
  async getDeviceStatsToday(data) {
    return this.request.getDirect(`${API_ENDPOINTS.stores.device_stats_today}`, data);
  }

  //  MỚI: Lấy thống kê thiết bị theo ngày tùy chỉnh
  async getDeviceStatsByDate(data) {
    return this.request.getDirect(`${API_ENDPOINTS.stores.device_stats_by_date}`, data);
  }
  async getDeviceStatsByDateRange(data) {
    return this.request.getDirect(`${API_ENDPOINTS.stores.device_stats_by_date_range}`, data);
  }
  async getListDevice(data) {
    return this.request.get(`${API_ENDPOINTS.stores.list_devices}`, data);
  }
  async conTrolDevice(data) {
    return this.request.postDirect(
      `${API_ENDPOINTS.stores.control_device}`,
      data
    );
  }
}

class RestAPI {
  constructor() {
    this.request = new Request();
    this.stores = new API(this.request);
  }
}
export default () => ({
  restAPI: new RestAPI()
});