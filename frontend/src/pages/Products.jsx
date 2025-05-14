import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-center gap-4 mb-6">
    {[1, 2].map((n) => (
      <div key={n} className="flex items-center gap-2">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold shadow transition-all duration-300 ${step === n ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          {step > n ? <CheckCircle className="w-4 h-4" /> : n}
        </div>
        {n === 1 && <div className="h-1 w-10 bg-gray-300 rounded-full" />}
      </div>
    ))}
  </div>
);

const ProductForm = ({ onSubmit, produtoEdit }) => {
  const [step, setStep] = useState(1);
  const [produto, setProduto] = useState({
    nome: '', descricao: '', codigo: '', quantidade: '', preco: '', categoria: ''
  });

  useEffect(() => {
    if (produtoEdit) {
      setProduto(produtoEdit);
      setStep(1);
    } else {
      setProduto({ nome: '', descricao: '', codigo: '', quantidade: '', preco: '', categoria: '' });
    }
  }, [produtoEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const nextStep = () => {
    if (step === 1 && (!produto.nome || !produto.codigo)) {
      alert("Preencha os campos obrigatórios da Etapa 1.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!produto.nome || !produto.codigo || !produto.quantidade || !produto.preco || !produto.categoria) {
      alert('Preencha todos os campos.');
      return;
    }
    onSubmit(produto);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        {produtoEdit ? '✏️ Editar Produto' : '🆕 Cadastro de Produto'}
      </h2>
      <StepIndicator step={step} />

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nome" value={produto.nome} onChange={handleChange} placeholder="Nome" className="input" required />
          <input name="descricao" value={produto.descricao} onChange={handleChange} placeholder="Descrição" className="input" />
          <input name="codigo" value={produto.codigo} onChange={handleChange} placeholder="Código" className="input" required />
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="quantidade" type="number" value={produto.quantidade} onChange={handleChange} placeholder="Quantidade" className="input" required />
          <input name="preco" type="number" value={produto.preco} onChange={handleChange} placeholder="Preço" className="input" required />
          <input name="categoria" value={produto.categoria} onChange={handleChange} placeholder="Categoria" className="input" required />
        </div>
      )}

      <div className="flex justify-between pt-4">
        {step > 1 && (
          <button type="button" onClick={prevStep} className="btn-gray">← Voltar</button>
        )}

        {step < 2 && (
          <button type="button" onClick={nextStep} className="btn-blue">Avançar →</button>
        )}

        {step === 2 && (
          <button type="submit" className="btn-green">
            {produtoEdit ? '✅ Atualizar' : '📦 Cadastrar'}
          </button>
        )}
      </div>
    </form>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  const handleEdit = (product) => setEditing(product);

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleSubmit = async (produto) => {
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, produto);
      } else {
        await api.post('/products', produto);
      }
      setEditing(null);
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Verifique os campos e tente novamente.');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">📦 Produtos</h2>

      <div className="mb-10">
        <ProductForm onSubmit={handleSubmit} produtoEdit={editing} />
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar produtos por nome, código ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border px-4 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Produtos</h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">{p.nome}</h3>
            <p className="text-sm text-gray-600"><strong>Descrição:</strong> {p.descricao}</p>
            <p className="text-sm text-gray-600"><strong>Código:</strong> {p.codigo}</p>
            <p className="text-sm text-gray-600"><strong>Quantidade:</strong> {p.quantidade}</p>
            <p className="text-sm text-gray-600"><strong>Preço:</strong> R$ {p.preco}</p>
            <p className="text-sm text-gray-600 mb-4"><strong>Categoria:</strong> {p.categoria}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(p)}
                className="flex items-center gap-1 text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                <Edit className="w-4 h-4" /> Editar
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex items-center gap-1 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
