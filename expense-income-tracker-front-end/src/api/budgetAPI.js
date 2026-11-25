import axios from "axios";
import authAPI from './authAPI'

const API = "http://localhost:8080/api/budget"

export const createBudget=(budget)=>{
    return authAPI.post(`${API}/create`,budget)
}
export const getAllBudgets=()=>{
    return authAPI.get(`${API}/getall`)
}
export const updateBudget=(id,budget)=>{
    return authAPI.put(`${API}/update/${id}`,budget)
}
export const getBudget=(id)=>{
    return authAPI.get(`${API}/get/${id}`)
}
export const getBudgetSummary=(id)=>{
    return authAPI.get(`${API}/summary/${id}`)
}
export const removeBudget=(id)=>{
    return authAPI.delete(`${API}/remove/${id}`)
}