import { useEffect, useState } from 'react';

const ProductForm = ({ onSubmit, produtoEdit }) => {
  const [produto, setProduto] = useState({
    nome: '',
    descricao: '',
    codigo: '',
    quantidade: '',
    preco: '',
    categoria: ''
  });


useEffect(() => {
  if (produtoEdit) {
    setProduto(produtoEdit);
  } else {
    setProduto({ nome: '', descricao: '', codigo: '', quantidade: '', preco: '', categoria: '' });
  }
}, [produtoEdit]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(produto);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex flex-col gap-4">
      <h2 className="text-xl font-bold">{produtoEdit ? 'Editar Produto' : 'Cadastro de Produto'}</h2>
      <input name="nome" value={produto.nome} onChange={handleChange} placeholder="Nome" className="w-full border p-2 rounded" required />
      <input name="descricao" value={produto.descricao} onChange={handleChange} placeholder="Descrição" className="w-full border p-2 rounded" required />
      <input name="codigo" value={produto.codigo} onChange={handleChange} placeholder="Código" className="w-full border p-2 rounded" required />
      <input name="quantidade" type="number" value={produto.quantidade} onChange={handleChange} placeholder="Quantidade" className="w-full border p-2 rounded" required />
      <input name="preco" type="number" value={produto.preco} onChange={handleChange} placeholder="Preço" className="w-full border p-2 rounded" required />
      <input name="categoria" value={produto.categoria} onChange={handleChange} placeholder="Categoria" className="w-full border p-2 rounded" required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {produtoEdit ? 'Atualizar' : 'Cadastrar'}
      </button>
    </form>
  );
};

export default ProductForm;
