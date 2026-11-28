import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AccountPage from "./pages/AccountPage";
import GuestLayout from "./components/layout/GuestLayout";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import SubscriptionPage from "./pages/SubscriptionPage";
import TransactionPage from "./pages/TransactionPage";
import BudgetPage from "./pages/BudgetPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import StatisticsPage from "./pages/StatisticsPage";
import DefaultPage from "./pages/DefaultPage";
import AccountList from "./components/account/AccountList";
import AddAccount from "./components/account/AddAccount";
import SubscriptionList from "./components/subscription/SubscriptionList";
import AddSubscription from "./components/subscription/AddSubscription";
import ForgotPassword from "./components/auth/ForgotPassword";
import BudgetForm from "./components/budget/BudgetForm";
import BudgetOverview from "./components/budget/BudgetOverview";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<DefaultPage></DefaultPage>}></Route>
        <Route element={<GuestLayout></GuestLayout>}>
          <Route path="/login" element={<LoginForm></LoginForm>} />
          <Route path="/register" element={<RegisterForm></RegisterForm>} />
          <Route path="/logout" element={<LoginForm></LoginForm>} />
          <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}/>
        </Route>

        <Route element={<UserLayout></UserLayout>}>
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path="/home" element={<DashboardPage></DashboardPage>} />
            <Route element={<AccountPage></AccountPage>}>
              <Route path="/accounts" element={<AccountList></AccountList>} />
              <Route path="/add-account" element={<AddAccount></AddAccount>} />
            </Route>
            <Route
              path="/transactions"
              element={<TransactionPage></TransactionPage>}
            />
            <Route
              path="/statistics"
              element={<StatisticsPage></StatisticsPage>}
            />
            <Route element={<BudgetPage></BudgetPage>}>
              <Route path="/budgets" element={<BudgetOverview></BudgetOverview>} />
              <Route path="/add-budget" element={<BudgetForm></BudgetForm>} />
            </Route>
            
            <Route element={<SubscriptionPage></SubscriptionPage>}>
              <Route path="/subscriptions" element={<SubscriptionList></SubscriptionList>} />
              <Route path="/add-subscription" element={<AddSubscription></AddSubscription>} />
            </Route>
            <Route
              path="/shopping-lists"
              element={<ShoppingListPage></ShoppingListPage>}
            />
            <Route path="/profile-settings" element={<UserPage></UserPage>} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
