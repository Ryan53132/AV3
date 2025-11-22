import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Aerocode from "./pages/Aerocode";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route path="/" element={<Login />} />
        {/* Página principal (HUD ou app) */}
        <Route path="/Aerocode" element={<Aerocode />} />
        {/* Qualquer rota inválida redireciona pro login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
