import authAPI from "./authAPI";

const API = "/api/user";

export const getUserProfile = () =>{
    return authAPI.get(`${API}/profile`)
}
export const getPwdChangeOTP = () =>{
    return authAPI.get(`${API}/request-otp`)
}
export const changeUserProfile= (newUser) =>{
    return authAPI.post(`${API}/modify`,newUser)
}
export const changeUserPassword= (req) =>{
    return authAPI.post(`${API}/change-password`,req)
}
