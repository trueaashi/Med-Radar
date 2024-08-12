import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
const mulipartApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-type": "multipart/form-data",
    Accept: "application/json",
  },
});
// list of all the endpoints
// export const registerApi = (data) => api.post("/api/user-register", data);
export const loginApi = data => api.post('/hospital/signin', data);
export const registerApi = data => api.post('/hospital/signup', data);
export const logoutApi = () => api.post('/hospital/signout');
export const getMeApi = () => api.get('/hospital/me');
export const updateProfileApi = (data) => mulipartApi.put('/hospital/profile-pic',data);

export const getTreatmentsApi = () => api.get('/hospital/treatments');
export const removeTreatmentApi = id => api.delete(`/hospital/treatment/${id}`);
export const updateTreatmentApi = (id, data) =>
  api.put(`/hospital/treatment/${id}`, data);
export const getTreatmentApi = id => api.get(`/hospital/treatment/${id}`);

export const getDoctorsApi = () => api.get('/hospital/doctors');
export const addDoctorsApi = (data) => mulipartApi.post('/hospital/doctor',data);
export const getDoctorApi = id => api.get(`/hospital/doctor/${id}`);
export const removeDoctorApi = id => api.delete(`/hospital/doctor/${id}`);

export const getFacilitiesApi = () => api.get('/hospital/facilities');
export const addFacilityApi = (data) => mulipartApi.post('/hospital/facility',data);
export const removeFacilityApi = id => api.delete(`/hospital/facility/${id}`);

// export const addRoomApi = (data, id) =>
//   api.post(`/api/hotel/add-room/${id}`, data);
// export const getKeyApi = () => api.get(`/api/get-key`);
// export const createOrderApi = (data, id) =>
//   api.post(`/api/checkout/${id}`, data);
// export const paymentVerificationApi = (data) =>
//   api.post(`/api/paymentverification`, data);
// export const createHotelApi = (data) =>
//   api.post(`/api/hotel/create-hotel`, data);
// export const editHotelRoomApi = (id, data) =>
//   api.put(`/api/hotel/edit-room/${id}`, data);
// export const deleteHotelRoomApi = (id, data) =>
//   api.post(`/api/hotel/delete-room/${id}`, data);
export const addTreatmentApi = data => api.post(`/hospital/treatments`, data);
export const addDoctorApi = data => api.post(`/hospital/doctors`, data);

// Interceptors
api.interceptors.response.use(
  config => {
    return config;
  },
  async error => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/hospital/refresh`, {
          withCredentials: true,
        });
        return api.request(originalRequest);
      } catch (error) {
        console.log(error.message);
      }
    }
    throw error;
  }
);
export default api;
