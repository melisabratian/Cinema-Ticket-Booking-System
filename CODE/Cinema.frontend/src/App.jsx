import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Movies from "./components/Movies";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <Home />
      <Movies />
      <Footer />
    </div>
  );
}

export default App;