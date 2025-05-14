import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import MovementsPage from './pages/MovementsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/movimentacoes" element={<MovementsPage />} />
        <Route path="/assistente" element={<AIAssistantPage />} />
      </Routes>
    </Router>
  );
}

export default App;
