import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  const [nameerror, setNameerror] = useState("");
  const [emailerror, setEmailerror] = useState("");
  const [passworderror, setPassworderror] = useState("");
  const [phonenumbererror, setPhonenumbererror] = useState("");

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"

  const navigate = useNavigate();

  const nameHandling = (e) => {
    const value = e.target.value;
    setName(value);

    if (value.trim() === "") setNameerror("Name is required.");
    else if (value.length < 3)
      setNameerror("Name must be at least 3 characters.");
    else setNameerror("");
  };

  const emailHandling = (e) => {
    const value = e.target.value.trim();
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") setEmailerror("Email is required.");
    else if (!emailRegex.test(value)) setEmailerror("Enter a valid email.");
    else setEmailerror("");
  };

  const passwordHandling = (e) => {
    const value = e.target.value.trim();
    setPassword(value);

    if (value === "") setPassworderror("Password is required.");
    else if (value.length < 8)
      setPassworderror("Password must be 8+ characters.");
    else setPassworderror("");
  };

  const phonenumberHandling = (e) => {
    const value = e.target.value;
    setPhonenumber(value);

    const phoneRegex = /^[6-9]\d{9}$/;

    if (value.trim() === "") setPhonenumbererror("Phone number required.");
    else if (!/^\d+$/.test(value)) setPhonenumbererror("Only digits allowed.");
    else if (!phoneRegex.test(value))
      setPhonenumbererror("Enter valid 10-digit Indian number.");
    else setPhonenumbererror("");
  };

  const handleRegister = () => {
    if (
      nameerror ||
      emailerror ||
      passworderror ||
      phonenumbererror ||
      !name ||
      !email ||
      !password ||
      !phonenumber
    ) {
      setMessageText("Fill all details before submitting.");
      setMessageType("error");
      setShowMessage(true);
      return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    setMessageText("Registration successful!");
    setMessageType("success");
    setShowMessage(true);
    setTimeout(() => {
      navigate("/login");
    }, 2000); // Delay navigation to show message
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="app-container">
      <h1>Welcome to EK's Expense Tracker App</h1>
      <h1>Register to Continue...</h1>

      <div className="signup-container">
        {!showMessage && <h1>Register Here</h1>}

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
              type="text"
              value={name}
              onChange={nameHandling}
              placeholder="John Doe"
            />
            <p className="error">{nameerror}</p>

            <input
              className="input-box"
              type="text"
              value={email}
              onChange={emailHandling}
              placeholder="johndoe@gmail.com"
            />
            <p className="error">{emailerror}</p>

            <input
              className="input-box"
              type="password"
              value={password}
              onChange={passwordHandling}
              placeholder="********"
            />
            <p className="error">{passworderror}</p>

            <input
              className="input-box"
              type="text"
              value={phonenumber}
              onChange={phonenumberHandling}
              placeholder="1234567890"
            />
            <p className="error">{phonenumbererror}</p>

            <div className="button-group">
              <button className="btn" onClick={handleRegister}>
                Register
              </button>
              <button className="btn" onClick={handleLogin}>
                Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
