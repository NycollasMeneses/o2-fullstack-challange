// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const mesesNomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57"];

const DashboardPage = () => {
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [valorEstoque, setValorEstoque] = useState(0);
  const [maisVendidos, setMaisVendidos] = useState([]);
  const [vendasPorMes, setVendasPorMes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchData() {
      const produtos = await api.get("/products");
      const movimentos = await api.get("/movements");

      const totalQtd = produtos.data.reduce((acc, p) => acc + p.quantidade, 0);
      const totalValor = produtos.data.reduce((acc, p) => acc + (p.quantidade * p.preco), 0);

      setTotalEstoque(totalQtd);
      setValorEstoque(totalValor);

      const vendas = movimentos.data.filter(m => m.type === "saida");

      const agrupado = {};
      vendas.forEach(v => {
        const nome = v.product.nome;
        agrupado[nome] = (agrupado[nome] || 0) + v.quantity;
      });
      const maisMov = Object.entries(agrupado)
        .map(([nome, qtd]) => ({ nome, qtd }))
        .sort((a, b) => b.qtd - a.qtd)
        .slice(0, 5);
      setMaisVendidos(maisMov);

      const porMes = {};
      vendas.forEach(v => {
        const data = new Date(v.timestamp);
        if (data.getFullYear() === Number(filtroAno)) {
          const chave = String(data.getMonth());
          porMes[chave] = (porMes[chave] || 0) + v.quantity;
        }
      });

      const grafico = Array.from({ length: 12 }, (_, i) => ({
        mes: mesesNomes[i],
        qtd: porMes[i] || 0
      }));
      setVendasPorMes(grafico);

      const catMap = {};
      produtos.data.forEach(p => {
        catMap[p.categoria] = (catMap[p.categoria] || 0) + p.quantidade;
      });
      const catArray = Object.entries(catMap).map(([name, value]) => ({ name, value }));
      setCategorias(catArray);
    }

    fetchData();
  }, [filtroAno]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">📊 Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total de Itens em Estoque</p>
          <p className="text-2xl font-bold">{totalEstoque}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Valor Total em Estoque</p>
          <p className="text-2xl font-bold">R$ {valorEstoque.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Produtos mais vendidos</p>
          <ul className="text-sm mt-2 space-y-1">
            {maisVendidos.map(p => (
              <li key={p.nome}>• {p.nome}: {p.qtd}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Vendas por Mês</p>
          <select
            className="border px-2 py-1 rounded"
            value={filtroAno}
            onChange={(e) => setFiltroAno(e.target.value)}
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendasPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="qtd" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <p className="font-semibold mb-2">Distribuição por Categoria</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={categorias} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {categorias.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
