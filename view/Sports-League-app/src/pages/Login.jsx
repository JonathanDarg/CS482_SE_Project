import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        switch(data.user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "manager":
            navigate("/manager/dashboard");
            break;
          case "parent":
            navigate("/parent/dashboard");
            break;
          case "child":
            navigate("/child/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error connecting to server");
      console.error(err);
    }
  };

  const styles = {
    container: {
      maxWidth: '450px',
      margin: '50px auto',
      padding: '40px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    heading: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '30px',
      fontSize: '28px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
    },
    input: {
      padding: '14px',
      border: '2px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '16px',
      transition: 'border-color 0.3s',
    },
    button: {
      padding: '14px',
      backgroundColor: '#ff6b35',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '10px',
    },
    link: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#666',
      fontSize: '14px',
    },
    linkAnchor: {
      color: '#ff6b35',
      textDecoration: 'none',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>Login</h2>
        
        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a2b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b35'}
        >
          Login
        </button>
      </form>
      
      <div style={styles.link}>
        Don't have an account? <Link to="/Signup" style={styles.linkAnchor}>Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;