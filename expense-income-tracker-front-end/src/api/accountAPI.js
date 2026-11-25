import authAPI from "./authAPI";

const API = "/api/financial-account";

export const createAccount = (account) => {
    return authAPI.post(`${API}/create`, account)
}
export const getAllAccounts = () => {
    return authAPI.get(`${API}/getall`)
}
export const updateAccount = (id, account) => {
    return authAPI.put(`${API}/update/${id}`, account)
}
export const removeAccount = (id) => {
    return authAPI.delete(`${API}/remove/${id}`)
}
