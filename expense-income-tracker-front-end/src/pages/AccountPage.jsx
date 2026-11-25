import { Outlet } from "react-router-dom"
const AccountPage=()=>{
    return(
        <>
        <div className="container-fluid">
                <div className="row">
                    <h2 className="dashboard-title">Manage Your Financial Accounts Here</h2>
                    {/* Account Add*/}
                    
                    <Outlet></Outlet>
                </div>
                </div>
        </>
    )
}
export default AccountPage