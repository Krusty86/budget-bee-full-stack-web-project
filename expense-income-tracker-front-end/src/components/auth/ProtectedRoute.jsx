import { selectToken } from "../../selectors/authSelector"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"

const ProtectedRoute=()=>{
    const token = useSelector(selectToken)
    const navigate = useNavigate()
    if(localStorage.getItem("token")==null){
        navigate("/login")
    }
    
    return (
        <Outlet></Outlet>
    )
}

export default ProtectedRoute