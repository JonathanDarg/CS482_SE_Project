import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/Login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "50px auto",
      padding: "40px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
      color: "#333",
      marginBottom: "30px",
      fontSize: "28px",
    },
    infoContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    infoRow: {
      display: "flex",
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: "15px",
    },
    label: {
      fontWeight: "600",
      color: "#666",
      minWidth: "120px",
      fontSize: "16px",
    },
    value: {
      color: "#333",
      fontSize: "16px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "30px",
    },
    button: {
      padding: "14px 30px",
      backgroundColor: "#ff6b35",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "18px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Profile</h2>
      
      <div style={styles.infoContainer}>
        <div style={styles.infoRow}>
          <span style={styles.label}>Name:</span>
          <span style={styles.value}>{user.name || "N/A"}</span>
        </div>
        
        <div style={styles.infoRow}>
          <span style={styles.label}>Email:</span>
          <span style={styles.value}>{user.email || "N/A"}</span>
        </div>
        
        <div style={styles.infoRow}>
          <span style={styles.label}>Role:</span>
          <span style={styles.value}>
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "N/A"}
          </span>
        </div>
        
        {user.teamId && (
          <div style={styles.infoRow}>
            <span style={styles.label}>Team ID:</span>
            <span style={styles.value}>{user.teamId}</span>
          </div>
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button 
          onClick={handleLogout}
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#e55a2b"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#ff6b35"}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
