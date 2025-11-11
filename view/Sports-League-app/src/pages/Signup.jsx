import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent");
  const [parentEmail, setParentEmail] = useState("");
  const [teamCode, setTeamCode] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const payload = { name, email, password, role };
    
    if (role === "child" && parentEmail) {
      payload.parentEmail = parentEmail;
    }
    if (role === "manager" && teamCode) {
      payload.teamCode = teamCode;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! You can now log in.");
      } else {
        alert(data.message || "Signup failed");
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
    select: {
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
    conditionalField: {
      backgroundColor: '#f9f9f9',
      padding: '10px',
      borderRadius: '6px',
      borderLeft: '3px solid #ff6b35',
    },
    roleInfo: {
      fontSize: '13px',
      color: '#777',
      fontStyle: 'italic',
      marginTop: '5px',
      marginBottom: '0',
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
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style={styles.heading}>Sign Up</h2>
        
        <input
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
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

        <select 
          style={styles.select}
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required
        >
          <option value="parent">Parent</option>
          <option value="child">Child/Player</option>
          <option value="manager">Team Manager</option>
        </select>

        {role === "child" && (
          <div style={styles.conditionalField}>
            <input
              style={styles.input}
              placeholder="Parent's Email"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              required
            />
            <p style={styles.roleInfo}>Enter the email of your parent's account</p>
          </div>
        )}

        {role === "manager" && (
          <div style={styles.conditionalField}>
            <input
              style={styles.input}
              placeholder="Team Code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              required
            />
            <p style={styles.roleInfo}>Enter the team code provided by the admin</p>
          </div>
        )}

        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a2b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b35'}
        >
          Sign Up
        </button>
      </form>
      
      <div style={styles.link}>
        Already have an account? <Link to="/Login" style={styles.linkAnchor}>Sign In</Link>
      </div>
    </div>
  );
}

export default Signup;