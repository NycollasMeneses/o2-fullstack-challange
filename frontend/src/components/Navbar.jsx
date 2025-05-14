import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4">
    <ul className="flex gap-4">
      <li><Link to="/produtos">Produtos</Link></li>
      <li><Link to="/movimentacoes">Movimentações</Link></li>
      <li><Link to="/assistente">IA</Link></li>
      <Link to="/dashboard">Dashboard</Link>

    </ul>
  </nav>
);

export default Navbar;