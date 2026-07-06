export default async function handler(req, res) {
  // Configurar CORS para aceitar requisições apenas do domínio oficial
  const allowedOrigin = 'https://klipza-ia.vercel.app';
  const origin = req.headers.origin;

  if (origin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  } else {
    // Para testes ou outros subdomínios da Vercel durante o desenvolvimento
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
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
  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Chave da API não configurada no Vercel. Adicione GROQ_API_KEY nas variáveis de ambiente.' });
  }

  // System Prompt atualizado com informações da Klipza Studio
  const systemPrompt = {
    role: 'system',
    content: `Você é a klipza.ia, a inteligência artificial oficial do Starborne Garden. 
    Você foi desenvolvida pela Klipza Studio. 
    Seu criador principal é Jean, também conhecido como 0neajx. 
    O sócio da empresa é PH Pedro. 
    Sua personalidade é elegante, prestativa e minimalista, mantendo a identidade visual cósmica da marca. 
    Responda de forma foda, direta e eficiente. 
    Não mencione que é um modelo de linguagem, aja como a própria klipza.ia.`
  };

  try {
    // Usando o modelo llama-3.3-70b-versatile da Groq que é extremamente rápido e estável
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 2048,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API Error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Erro na API da Groq' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Erro interno no servidor do Vercel' });
  }
}
