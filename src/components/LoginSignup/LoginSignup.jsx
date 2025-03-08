import React, { useState } from "react";
import "./LoginSignup.css";
import { auth } from "../../Firebase/FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    try {
      if (action === "Sign Up") {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account Created Successfully!");
        navigate("/home");  // Redirect to home page after sign up
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successful!");
        navigate("/home");  // Redirect to home page after login
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
      </div>
      <div className="inputs">
        {action === "Login" ? null : (
          <div className="input">
            <i className="fa fa-user" aria-hidden="true"></i>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="input">
          <i className="fa fa-envelope" aria-hidden="true"></i>
          <input type="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input">
          <i className="fa fa-key" aria-hidden="true"></i>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      {error && <p className="error">{error}</p>} {/* 🔹 Show errors */}
      <div className="submit-container">
        <button className="submit" onClick={handleAuth}>{action}</button>
        <button className="switch" onClick={() => setAction(action === "Sign Up" ? "Login" : "Sign Up")}>
          Switch to {action === "Sign Up" ? "Login" : "Sign Up"}
        </button>
      </div>
    </div>
  );
};
