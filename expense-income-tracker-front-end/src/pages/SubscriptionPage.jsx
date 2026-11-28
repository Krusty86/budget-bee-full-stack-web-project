import { Outlet } from "react-router-dom"

const SubscriptionPage=()=>{
    return(
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                    
                    <h2 className="dashboard-title">Your Subscriptions Here</h2>
                    <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SubscriptionPage