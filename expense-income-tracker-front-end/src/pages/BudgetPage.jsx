import { Outlet } from "react-router-dom";
import BudgetOverview from "../components/budget/BudgetOverview";


const BudgetPage = () => {
  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h2 className="dashboard-title mb-0">
          Set Your Goals, Make a Limit on Your Spending
        </h2>
      </div>

      
      <Outlet />
    </div>
  );
};

export default BudgetPage;