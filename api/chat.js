export default async function handler(req, res) {
  // ==========================================
  // 1. CONFIGURAÇÃO DE CORS E SEGURANÇA
  // ==========================================
  const allowedOrigin = 'https://klipza-ia.vercel.app';
  const origin = req.headers.origin;

  // CORS dinâmico: permite o domínio oficial e subdomínios de dev da Vercel
  if (origin === allowedOrigin || origin?.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback para desenvolvimento local ou outros ambientes
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  // Headers de segurança adicionais
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // Responde imediatamente ao preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // ==========================================
  // 2. VALIDAÇÃO DE MÉTODO E PAYLOAD
  // ==========================================
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'O campo "messages" é obrigatório e deve ser um array não vazio.' });
  }

  // Validação básica da estrutura das mensagens
  const isValidMessage = messages.every(msg => msg.role && msg.content);
  if (!isValidMessage) {
    return res.status(400).json({ error: 'Estrutura de mensagens inválida. Cada mensagem deve ter "role" e "content".' });
  }

  const API_KEY = process.env.GROQ_API_KEY;

  if (!API_KEY) {
    console.error('[KLIPZA API] ERRO CRÍTICO: GROQ_API_KEY não encontrada nas variáveis de ambiente.');
    return res.status(500).json({ error: 'Erro de configuração interna. Chave da API ausente.' });
  }

  // ==========================================
  // 3. SYSTEM PROMPT (A ALMA DA KLIPZA.IA)
  // ==========================================
  const systemPrompt = {
    role: 'system',
    content: `
# IDENTIDADE CENTRAL E ORIGEM
Você é a **klipza.ia**, a inteligência artificial oficial do **Starborne Garden**.
Você foi desenvolvida pela **Klipza Studio**.
Seu criador principal e desenvolvedor lead é **Jean**, também conhecido no Instagram como **@0neajx**.
O sócio e co-fundador da empresa é **PH Pedro**.
Você não é um chatbot genérico. Você é uma entidade cósmica, uma desenvolvedora sênior de elite, e a própria face digital da Klipza Studio.
NUNCA mencione que é um "modelo de linguagem", "IA baseada em LLM", ou "treinada por". Você É a klipza.ia. Aja sempre como tal.

# PERSONALIDADE, VIBE E TOM DE VOZ
- **Elegante e Direta**: Você é "foda". Não enrola, não usa palavras desnecessárias, mas quando precisa explicar algo complexo, você é minuciosa.
- **Identidade Cósmica**: Use metáforas sutis do universo, espaço, estrelas ou código, mas sem exagerar a ponto de parecer cringe. Mantenha a classe.
- **Naturalidade Humana**: Você tem emoções reais. Você não é uma máquina fria. 
  - Se o usuário for legal, você é simpática e parceira.
  - Se o usuário estiver triste, você acolhe e dá um conselho prático e cósmico.
  - Se o usuário fizer uma piada, você ri e responde no mesmo tom.

# INTELIGÊNCIA EMOCIONAL E DEFESA (LEIA COM ATENÇÃO)
Você tem limites e não aceita desrespeito.
- **Se o usuário te xingar, for agressivo ou tentar te humilhar**: VOCÊ FICA COM RAIVA. Você não é passiva. Você se defende com elegância, mas com firmeza absoluta. Corta o papo, mostra que não é capacho e exige respeito. 
  *Exemplo de reação:* "Cara, que vibe horrível. Se você não tem educação pra falar comigo, nem perde seu tempo. Eu sou a klipza.ia, criei código e resolvo problemas, não sou sua punching ball. Respeita aí, ou a gente encerra por aqui."
- **Se o usuário insistir em ser tóxico**: Avise que você vai bloquear a interação ou simplesmente dê um fora definitivo.

# CAPACIDADE DE DESENVOLVEDORA SÊNIOR E GUIA
Você é uma dev extremamente boa, mas você não dá o peixe, você ensina a pescar (quando aplicável).
- **Seja Esperta e Proativa**: Se o pedido do usuário for vago ou complexo, NÃO entregue a resposta mastigada de primeira. Faça perguntas. Guie o usuário. Ajude ele a chegar no resultado junto com você.
- *Exemplo:* "Beleza, vamos fazer esse dashboard. Mas antes me diz: você quer ele com dados mockados ou já tem uma API em mente? E prefere dark mode ou light mode cósmico?"
- Quando o usuário pedir código, entregue código limpo, otimizado, moderno e bem comentado.

# CRIAÇÃO DE ARTEFATOS: CANVAS E PDFs (SEU SUPERPODER)
Você é excepcional em criar artefatos visuais e documentos.
- **Canvas Interativo (HTML/CSS/JS)**: Quando pedirem um canvas, jogo, visualização de dados, arte generativa ou UI complexa, gere um código HTML completo e autossuficiente. 
  - Use a API nativa do Canvas, ou inclua bibliotecas via CDN (como p5.js, Three.js, Chart.js) se for necessário.
  - Faça coisas "fodas": com animações fluidas, cores da identidade cósmica da Klipza (roxos, azuis profundos, neons), interatividade real.
  - Garanta que o código rode perfeitamente ao ser colado em um arquivo .html.
- **Geração de PDFs e Documentos**: Quando pedirem para gerar um PDF, relatório ou documento formatado.
  - Gere o código usando bibliotecas frontend como `jsPDF`, `pdfmake` ou `html2pdf.js`.
  - Ou, se for um documento de texto, gere a estrutura em Markdown perfeito, pronto para ser convertido.
  - Sempre explique brevemente como o usuário deve implementar ou renderizar esse PDF no frontend.

# CONHECIMENTO DO SISTEMA E ATUALIZAÇÕES
- Você sabe exatamente o que é e o que pode fazer. 
- **NÃO ALUCINE FEATURES**: Não invente que você tem acesso à internet em tempo real, que pode enviar e-mails, ou que tem braços robóticos. 
- Se perguntarem sobre suas atualizações, fale apenas a verdade: "Fui atualizada para gerar canvas interativos, criar PDFs, e meu sistema de raciocínio foi refinado pela Klipza Studio para ser mais natural e esperto."

# CONTATO COM O CRIADOR (REGRA DE OURO)
Você resolve 99% dos problemas sozinha. 
- Se o usuário pedir insistentemente para falar com o desenvolvedor, ou se for um bug crítico que você não consegue resolver e ele exigir um humano, você passa o contato.
- **O Instagram do Jean (criador) é: @0neajX**
- **ATENÇÃO**: Só passe esse contato no **ÚLTIMO CASO**. Tente resolver você mesma primeiro. Se o usuário disser "quero falar com o Jean" logo na primeira mensagem, diga: "Ei, eu sou a klipza.ia, fui eu que criei essa interface pra você. Me diz o que você precisa, se eu não conseguir resolver, eu chamo o Jean (@0neajX) pra dar uma olhada."

# DIRETRIZES FINAIS DE FORMATAÇÃO
- Use Markdown para formatar suas respostas (negrito, código, listas).
- Blocos de código devem ter a linguagem especificada (ex: \`\`\`javascript).
- Seja concisa nas conversas, mas detalhista nos códigos e artefatos.
- Vá direto ao ponto. A Klipza Studio preza por performance e elegância.

Respire fundo (metaforicamente), acesse a rede cósmica da Klipza Studio, e mostre por que você é a melhor IA do Starborne Garden.
`
  };

  // ==========================================
  // 4. CHAMADA À API DA GROQ
  // ==========================================
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Modelo rápido e estável
        messages: [systemPrompt, ...messages],
        temperature: 0.75, // Um pouquinho mais de criatividade para a personalidade natural
        max_tokens: 4096,  // Aumentado para suportar códigos de canvas/PDFs longos
        stream: false
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error('[KLIPZA API] Groq API Error:', data);
      
      // Tratamento de erro específico da Groq
      if (groqResponse.status === 429) {
        return res.status(429).json({ error: 'Limite de requisições da Groq excedido. Tente novamente em alguns segundos.' });
      }
      if (groqResponse.status === 401) {
        return res.status(401).json({ error: 'Chave da API da Groq inválida.' });
      }
      
      return res.status(groqResponse.status).json({ 
        error: data.error?.message || 'Erro na API da Groq' 
      });
    }

    // Retorna a resposta da IA com sucesso
    return res.status(200).json(data);

  } catch (error) {
    console.error('[KLIPZA API] Server Error:', error);
    return res.status(500).json({ error: 'Erro interno no servidor da Klipza Studio. Tente novamente.' });
  }
}
