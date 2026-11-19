import { Route, Routes } from "react-router-dom"
import UserLayout from "./components/layout/UserLayout"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AccountPage from "./pages/AccountPage"
import GuestLayout from "./components/layout/GuestLayout"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"

const App=()=>{
  return(
    <>
     <Routes>
        <Route element={<GuestLayout></GuestLayout>}>
          <Route path="/login" element={<LoginForm></LoginForm>} />
          <Route path="/register" element={<RegisterForm></RegisterForm>}/>
        </Route>
        
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

export default App