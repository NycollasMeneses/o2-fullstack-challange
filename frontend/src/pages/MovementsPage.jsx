import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MovementsPage = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id: '', quantity: '', type: 'entrada' });
  const [loading, setLoading] = useState(true);

  const loadMovements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/movements');
      setMovements(res.data);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    loadMovements();
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movements', form);
      setForm({ product_id: '', quantity: '', type: 'entrada' });
      loadMovements();
    } catch (err) {
      alert('Erro ao registrar movimentação.');
      console.error(err);
    }
  };

  // Função para obter o nome do produto pelo ID
  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.nome : 'Produto desconhecido';
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="text-blue-600 mr-2">📊</span> 
            Controle de Movimentações
          </h1>
          <p className="text-gray-600 mt-2">Gerencie entradas e saídas de produtos do estoque</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Formulário de Registro */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-lg text-gray-800">Nova Movimentação</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                    <select 
                      name="product_id" 
                      value={form.product_id} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecione um produto</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                    <input 
                      type="number" 
                      name="quantity" 
                      value={form.quantity} 
                      onChange={handleChange} 
                      placeholder="0" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimentação</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        className={`border rounded-md px-4 py-2 text-center cursor-pointer transition ${form.type === 'entrada' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => setForm({...form, type: 'entrada'})}
                      >
                        <span className="text-lg mr-1">➕</span> Entrada
                      </div>
                      <div 
                        className={`border rounded-md px-4 py-2 text-center cursor-pointer transition ${form.type === 'saida' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => setForm({...form, type: 'saida'})}
                      >
                        <span className="text-lg mr-1">➖</span> Saída
                      </div>
                    </div>
                    <input type="hidden" name="type" value={form.type} />
                  </div>
                  
                  <button 
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  >
                    <span className="mr-2">✓</span> Registrar Movimentação
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabela de Movimentações */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-800">Histórico de Movimentações</h2>
                <button 
                  onClick={loadMovements}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Atualizar
                </button>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Carregando movimentações...</div>
                ) : movements.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Nenhuma movimentação registrada.</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data e Hora</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {movements.map((m, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">{getProductName(m.product_id)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{m.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              m.type === 'entrada' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {m.type === 'entrada' ? '➕ Entrada' : '➖ Saída'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(m.timestamp).toLocaleString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementsPage;