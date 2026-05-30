import { useState } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import Movies from "./components/Movies";
import Tickets from "./components/Tickets";
import Experience from "./components/Experience";
import Offers from "./components/Offers";
import Contact from "./components/Contact";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function refreshData() {
    setRefreshKey((value) => value + 1);
  }

  function handleAdminLoginSuccess() {
    setIsAdmin(true);
    setShowAdminLogin(false);
  }

  function handleAdminLogout() {
    setIsAdmin(false);
  }

  return (
    <div className="app">
      <Header
        isAdmin={isAdmin}
        onAdminLoginClick={() => setShowAdminLogin(true)}
        onAdminLogout={handleAdminLogout}
      />

      <Home />
      <Movies refreshKey={refreshKey} onBooked={refreshData} />
      <Tickets onBooked={refreshData} />
      <Experience />
      <Offers />
      <Contact />

      {isAdmin && <AdminDashboard refreshKey={refreshKey} />}

      <Footer />

      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
