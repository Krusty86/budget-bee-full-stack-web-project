import { Link } from 'react-router-dom'
import '../../assets/css/registerform.css'
import '../../assets/Vendor/fontawesome-free-6.7.2-web/css/all.min.css'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { userRegister } from '../../reducers/AuthSlice'

const RegisterForm = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        phone: ""
    })
    const dispatch = useDispatch()
    function handleRegister(e){
        e.preventDefault()
        dispatch(userRegister(userData))
    }

    return (
        <>
            <div className="container-fluid">
                <svg width="0" height="0" style={{ position: "absolute" }}>
                    <defs>
                        <clipPath id="waveClipRight" clipPathUnits="objectBoundingBox">
                            <path d="M 0.15,0 L 1,0 L 1,1 L 0.15,1 C 0,0.7 0,0.3 0.15,0 Z"></path>
                        </clipPath>
                    </defs>
                </svg>

                <div className="auth-container auth-reveal-register">
                    <div className="auth-form-wrapper">
                        <div className="form-header stagger-item" style={{ "--delay": "0.12s" }}>
                            <h2>Create An Account</h2>
                            <p>Please fill in your information to get started.</p>
                        </div>

                        <form id="registerForm">
                            <div className="form-group stagger-item" style={{ "--delay": "0.2s" }}>
                                <label htmlFor="username">Username</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-user"></i>
                                    <input type="text" id="username" name="username" placeholder="Enter your username" required 
                                    onChange={(e)=>setUserData({
                                        ...userData, username:e.target.value
                                    })}
                                    value={userData.username}
                                    />
                                </div>
                            </div>

                            <div className="form-group stagger-item" style={{ "--delay": "0.27s" }}>
                                <label htmlFor="email">Email</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-envelope"></i>
                                    <input type="email" id="email" name="email" placeholder="budgetBee@gmail.com" required 
                                    onChange={(e)=>setUserData({
                                        ...userData, email:e.target.value
                                    })}
                                    value={userData.email}
                                    />
                                </div>
                            </div>

                            <div className="form-group stagger-item" style={{ "--delay": "0.34s" }}>
                                <label htmlFor="phone">Phone Number</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-phone"></i>
                                    <input type="tel"
                                    id="phone" name="phone"
                                    placeholder="+959123456789" 
                                    required 
                                    onChange={(e)=>setUserData({
                                        ...userData, phone:e.target.value
                                    })}
                                    value={userData.phone}/>
                                </div>
                            </div>

                            <div className="form-group stagger-item" style={{ "--delay": "0.41s" }}>
                                <label htmlFor="password">Password</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-lock"></i>
                                    <input type="password" id="password" name="password" placeholder="••••••••" required 
                                    onChange={(e)=>setUserData({
                                        ...userData, password:e.target.value
                                    })}
                                    value={userData.password}/>
                                </div>
                            </div>

                            <button type="submit" className="btn-submit stagger-item" style={{ "--delay": "0.48s" }}
                            onClick={(e)=>handleRegister(e)}
                            >Register</button>
                            
                        </form>
                    </div>

                    <div className="auth-banner-right">
                        <div className="banner-circle-1-r"></div>
                        <div className="banner-circle-2-r"></div>

                        <div className="logo-wrapper stagger-item" style={{ "--delay": "0.12s" }}>
                            <img src="/img/BudgetBee_Logo.png" alt="BudgetBee Logo" className="app-logo" />
                        </div>
                        <h3 className="stagger-item" style={{ "--delay": "0.22s" }}>Welcome to BudgetBee!</h3>
                        <p className="stagger-item" style={{ "--delay": "0.3s" }}>Already have an account with BudgetBee?</p>
                        <Link className='btn-switch stagger-item' style={{ "--delay": "0.38s" }} to={"/login"}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default RegisterForm