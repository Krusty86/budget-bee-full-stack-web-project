import { useSelector } from "react-redux";
import FirstRow from "../components/dashboard/FirstRow"
import SecondRow from "../components/dashboard/SecondRow"

const DashboardPage=()=>{
      const { username, fullname } = useSelector((state) => state.auth);
  const displayName = username;
  const displayFullName = fullname;
    return(
        <>
            <div className="container-fluid">
                <div className="row">
                    <h2 className="dashboard-title-name">Welcome back {displayName}!</h2>
                    {/* Income, Expense & Budget Cards */}
                    <FirstRow></FirstRow>
                </div>
                <div className="row">
                    {/* Charts & Graph */}
                    <SecondRow></SecondRow>
                </div>
            </div>
        </>
    )
}
export default DashboardPage