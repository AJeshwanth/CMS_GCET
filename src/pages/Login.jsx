import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const [id, setRollNo] = useState("");
  const [password, setPassword] = useState("");  // ✅ lowercase 'password'
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!id || !password) {
      setMessage("Please enter both fields");
      return;
    }
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        id,
        password,
      });

      console.log(res.data);

      if (res.data.success) {
        localStorage.setItem("user", id); 

        if (res.data.role==="user"){
          navigate('/user');
          localStorage.setItem("role", "user")
        } else if (res.data.role==="admin"){
          navigate('/admin');
          localStorage.setItem("role", "admin")
        }else if (res.data.role==="department"){
          localStorage.setItem("role", "department")
          localStorage.setItem("issue", res.data.issue)
          navigate('/department')
        }
      } else {
        setMessage("❌ Invalid credentials");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="title">Complaint Portal</h2>
        
        <input
          type="text"
          placeholder="Username"
          className="input"
          value={id}
          onChange={(e) => setRollNo(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button className="login-btn" onClick={handleLogin}>
          🔐 Login to Account
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;