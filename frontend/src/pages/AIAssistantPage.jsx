import { useState } from 'react';
import axios from 'axios';

function AIAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [suggestions] = useState([
    'Mostrar produtos com estoque abaixo de 10',
    'Quais produtos estão no estoque?',
    'Qual é o produto mais barato?',
  ]);

  const handleAsk = async () => {
    if (!prompt.trim()) return;

    const newHistory = [...history, { user: prompt }];
    setHistory(newHistory);

    try {
      const res = await axios.post('http://localhost:8000/ask', { prompt });
      const botResponse = res.data.response;

      setResponse(botResponse);
      setHistory([...newHistory, { user: prompt, bot: botResponse }]);
      setPrompt('');
    } catch (err) {
      setResponse('Erro ao se comunicar com o agente de IA.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🤖 Assistente de IA</h1>

      {/* Campo de entrada */}
      <div className="flex flex-col gap-3">
        <textarea
          rows={4}
          className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ex: Quais produtos estão com estoque abaixo de 10?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="self-start bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAsk}
        >
          Enviar
        </button>
      </div>

      {/* Sugestões rápidas */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-2">Sugestões:</h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((sugestao, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
              onClick={() => setPrompt(sugestao)}
            >
              {sugestao}
            </button>
          ))}
        </div>
      </div>

      {/* Histórico de mensagens */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-700 mb-2">Histórico:</h3>
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="p-4 border rounded bg-gray-50">
              <p><strong className="text-blue-600">Você:</strong> {entry.user}</p>
              {entry.bot && (
                <p className="mt-2"><strong className="text-green-600">IA:</strong> {entry.bot}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Última resposta destacada */}
      {response && (
        <div className="mt-8 p-4 border-l-4 border-blue-600 bg-blue-50 rounded">
          <h3 className="font-semibold mb-1 text-blue-700">Resposta da IA:</h3>
          <p className="text-gray-800">{response}</p>
        </div>
      )}
    </div>
  );
}

export default AIAssistantPage;
