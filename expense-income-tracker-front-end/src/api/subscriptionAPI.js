import authAPI from "./authAPI";

const API = "/api/subscription";

export const createSubscription = (subscription) => {
    return authAPI.post(`${API}/create`, subscription)
}
export const getAllSubscriptions = () => {
    return authAPI.get(`${API}/getall`)
}
export const getSubscription = (id) => {
    return authAPI.get(`${API}/get/${id}`)
}
export const updateSubscription = (id, subscription) => {
    return authAPI.put(`${API}/update/${id}`, subscription)
}
export const getSubscriptionsByStatus = (status) =>{
  return authAPI.get(`${API}/status/${encodeURIComponent(status)}`)
}
export const pauseSubscription = (id) => {
    return authAPI.patch(`${API}/${id}/pause`)
}
export const resumeSubscription = (id) => {
    return authAPI.patch(`${API}/${id}/resume`)
}
export const cancelSubscription = (id) => {
    return authAPI.patch(`${API}/${id}/cancel`)
}
