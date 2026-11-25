import { Link, useNavigate } from 'react-router-dom'
import '../../assets/css/loginform.css'
import '../../assets/Vendor/fontawesome-free-6.7.2-web/css/all.min.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../../reducers/AuthSlice'
import { selectToken } from '../../selectors/authSelector'

const LoginForm = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    })
    const dispatch = useDispatch()
    const token = useSelector(selectToken)
    const navigate = useNavigate()
    function handleLogin(e){
        e.preventDefault()
        dispatch(userLogin(credentials))
        console.log("Inside Login Check")
        if(localStorage.getItem("token")!=null){
            console.log("Login Success")
            navigate("/home")
        }
    }

    return (
        <>
            <div className="container-fluid">
                <svg width="0" height="0" style={{ position: "absolute" }}>
                    <defs>
                        <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
                            <path d="M 0,0 L 0.85,0 C 1,0.3 1,0.7 0.85,1 L 0,1 Z"></path>
                        </clipPath>
                    </defs>
                </svg>

                <div className="auth-container auth-reveal-login">
                    {/* Left Section: Curved Wave Banner */}
                    <div className="auth-banner">
                        <div className="banner-circle-1"></div>
                        <div className="banner-circle-2"></div>

                        <div className="logo-wrapper stagger-item" style={{ "--delay": "0.1s" }}>
                            <img src="/img/BudgetBee_Logo.png" alt="BudgetBee Logo" className="app-logo" />
                        </div>

                        <h3 className="stagger-item" style={{ "--delay": "0.2s" }}>BudgetBee</h3>
                        <p className="stagger-item" style={{ "--delay": "0.28s" }}>Master your financial flow with BudgetBee smart tracking platform.</p>
                        <Link className='btn-switch stagger-item' style={{ "--delay": "0.36s" }} to={"/register"}>
                            Create An Account
                        </Link>
                    </div>

                    {/* Right Section: Login Form */}
                    <div className="auth-form-wrapper">
                        <div className="form-header stagger-item" style={{ "--delay": "0.15s" }}>
                            <h2>Sign In</h2>
                            <p>Enter your information to access your portal.</p>
                        </div>

                        <form id="loginForm">
                            <div className="form-group stagger-item" style={{ "--delay": "0.25s" }}>
                                <label htmlFor="email">Email</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-user"></i>
                                    <input type="text" id="email" 
                                    name="email" 
                                    placeholder="budgetBee@gmail.com" required
                                    onChange={(e)=>setCredentials({...credentials, email:e.target.value})}
                                    value={credentials.email}
                                    />
                                </div>
                            </div>

                            <div className="form-group stagger-item" style={{ "--delay": "0.33s" }}>
                                <label htmlFor="password">Password</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-lock"></i>
                                    <input type="password" id="password" name="password" placeholder="••••••••" required 
                                    onChange={(e)=>setCredentials({...credentials, password:e.target.value})}
                                    value={credentials.password}
                                    />
                                </div>
                            </div>

                            <div className="form-options stagger-item" style={{ "--delay": "0.4s" }}>
                                <a href="#forgot" className="forgot-pass">Forgot Password?</a>
                            </div>

                            <button type="submit" className="btn-submit stagger-item" style={{ "--delay": "0.46s" }}
                            onClick={(e)=>handleLogin(e)}
                            >Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default LoginForm