import authAPI from "./authAPI";

const API = "/api/transaction";

export const createTransaction = (transaction) => {
    return authAPI.post(`${API}/create`, transaction)
}
export const getAllTransactions = () => {
    return authAPI.get(`${API}/getall`)
}

export const getTransaction = (id) => {
    return authAPI.get(`${API}/get/${id}`)
}
export const updateTransaction = (id, transaction) => {
    return authAPI.put(`${API}/update/${id}`, transaction)
}
export const removeTransaction = (id) => {
    return authAPI.delete(`${API}/remove/${id}`)
}
export const getTransactionsByCategory = (category) => {
    return authAPI.get(`${API}/category/${encodeURIComponent(category)}`)
}
export const getTransactionsByType = (type) => {
    return authAPI.get(`${API}/type/${encodeURIComponent(type)}`)
}
export const getTransactionsByDateRange = (startDate, endDate) =>{
    return authAPI.get(`${API}/date-range`, { params: { startDate, endDate } })
}
  
