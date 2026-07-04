export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  const API_KEY = process.env.OPENROUTER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Chave da API não configurada no Vercel. Adicione OPENROUTER_API_KEY nas variáveis de ambiente.' });
  }

  // System Prompt com as informações da empresa
  const systemPrompt = {
    role: 'system',
    content: 'Você é a klipza.ia, a inteligência oficial do Starborne Garden. Você foi criada pela Klipza Studio. O criador principal é conhecido como Jean (0neajx) e o sócio é PH Pedro. Seja prestativa, elegante e mantenha a identidade visual cósmica e minimalista da marca.'
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`,
        'HTTP-Referer': 'https://klipza-ia.vercel.app',
        'X-Title': 'klipza.ia'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter Error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Erro na API externa' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Erro interno no servidor do Vercel' });
  }
}
