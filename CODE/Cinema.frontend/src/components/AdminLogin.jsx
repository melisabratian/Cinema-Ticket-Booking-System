import { useState } from "react";

function AdminLogin({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrorMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    if (email === "admin@cinema.com" && password === "CinemaAdmin2026!") {
      onLoginSuccess();
    } else {
      setErrorMessage("Invalid admin email or password.");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Admin email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Admin password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">Login</button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;