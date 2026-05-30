import { useState } from "react";

function AdminLogin({ onClose, onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  function handleChange(event) {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (credentials.email === "admin@cinema.com" && credentials.password === "admin123") {
      onLoginSuccess();
    } else {
      alert("Invalid admin credentials. Try admin@cinema.com / admin123");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="booking-modal admin-login-modal">
        <h2>Admin Login</h2>
        <p className="admin-login-hint">Demo account: admin@cinema.com / admin123</p>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Admin email"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
