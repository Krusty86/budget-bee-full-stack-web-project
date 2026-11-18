import { Route, Routes } from "react-router-dom"
import UserLayout from "./components/user/UserLayout"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AccountPage from "./pages/AccountPage"

const App=()=>{
  return(
    <>
     <Routes>
        <Route path="/login" ></Route>

        <Route element={<UserLayout></UserLayout>}>
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path="/accounts" element={<AccountPage></AccountPage>}/>
            <Route path="/transactions" element={<AccountPage></AccountPage>}/>
            <Route path="/subscriptions" element={<AccountPage></AccountPage>}/>
            
          </Route>
        </Route>
     </Routes>
    </>
  )
}