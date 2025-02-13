import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "../Pages/Footer";
import AuthPages from "../Pages/Register";
import Header from "../Pages/Header";
import ChatBot from "../Pages/Chat";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<AuthPages />} />
        <Route path="/Chat" element = {<ChatBot/>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
