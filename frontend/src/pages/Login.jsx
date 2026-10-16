import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";
import { login } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login({ email: email.trim(), password });
      setMessageText("Login successful!");
      setMessageType("success");
      setShowMessage(true);
      setTimeout(() => {
        navigate("/home");
      }, 2000); // Delay navigation to show message
    } catch (error) {
      setMessageText(error.message);
      setMessageType("error");
      setShowMessage(true);
    }
  };

  return (
    <div className="app-container">
      <h1>Welcome to EK's Expense Tracker App</h1>
      <h1>Login to Continue...</h1>
      <div className="login-container">
        {!showMessage && <h1>Login Here</h1>}

        {showMessage ? (
          <div className={`message ${messageType}`}>
            <p>{messageText}</p>
            {messageType === "error" && (
              <button className="btn" onClick={() => setShowMessage(false)}>
                Back
              </button>
            )}
          </div>
        ) : (
          <>
            <input
              className="input-box"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
            />

            <input
              className="input-box"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />

            <button className="btn" onClick={handleLogin}>
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
