import React, { useState } from 'react'
import './LoginSignup.css'
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const LoginSignup = () => {
 
    
  
    return (
    <div className="container">
        <div className="header">
            <div className="text">{action}</div>
        </div>
        <div className="inputs">
            {action==="Login"?<div />:
                <div className="input">
                    <i class="fa fa-user" aria-hidden="true"></i>
                    <input type="text" placeholder='Name' />
                </div>
            }
            <div className="input">
                <i class="fa fa-envelope" aria-hidden="true"></i>
                <input type="email" placeholder='Email Id' />
            </div>
            <div className="input">
                <i class="fa fa-key" aria-hidden="true"></i>
                <input type="password" placeholder='Password' />
            </div>
        </div>
        {action==="Sign Up"?<div />:<div className="forgot-password">Lost password? <span>Click here</span></div>}
        <div className="submit-container">
            <div className={action==="Login"?"submit grey":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className={action==="Sign Up"?"submit grey":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>
    </div>
  )
}
