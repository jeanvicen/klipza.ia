# klipza.ia

![klipza.ia](public/icons/icon-512x512.png)

**Jardim Estelar de Comunicacao** -- Sua guia no cosmos digital.

---

## Sobre

klipza.ia e um assistente de inteligencia artificial com uma interface cosmica imersiva. Converse, crie, aprenda e explore o jardim estelar com uma experiencia visual unica de particulas interativas.

## Funcionalidades

- Chat com IA com respostas inteligentes
- Sistema de autenticacao (login/registro)
- Historico de conversas organizado por data
- Sistema de tokens diarios (100/dia)
- Dois modelos: **klipza.lite** (gratuito) e **klipza.prime** (premium - em desenvolvimento)
- Tema escuro com glassmorphism
- Canvas de particulas interativas (Starborne)
- Modo foco para concentracao
- Exportacao de historico em TXT
- Sistema de exclusao de conta com periodo de 24h
- Totalmente responsivo (mobile, tablet, desktop)
- PWA: instalavel em qualquer dispositivo

---

## Estrutura do Projeto

```
klipza.ia/
|-- index.html                  # Pagina principal
|-- public/
|   |-- manifest.json           # PWA manifest
|   |-- sw.js                     # Service Worker
|   |-- icons/                  # Icones do app (72px - 512px)
|   |-- screenshots/            # Screenshots para PWA
|-- src/
|   |-- css/
|   |   |-- style.css           # Estilos completos
|   |-- js/
|       |-- app.js              # Inicializacao principal
|       |-- modules/
|           |-- state.js        # Estado global
|           |-- storage.js      # Storage e criptografia
|           |-- tokens.js       # Sistema de tokens
|           |-- models.js       # Sistema de modelos
|           |-- account.js       # Exclusao de conta
|           |-- particles.js     # Canvas de particulas
|           |-- chat.js          # Chat e mensagens
|           |-- auth.js          # Autenticacao
|           |-- ui.js            # UI utilities
`-- assets/                     # Assets estaticos
`-- README.md
```

---

## Tecnologias

- **HTML5** -- Estrutura semantica e acessivel
- **CSS3** -- Design system com variaveis, glassmorphism, animacoes
- **JavaScript (ES6+)** -- Vanilla JS, sem frameworks
- **Canvas API** -- Particulas interativas
- **Web Crypto API** -- SHA-256 para hash de senhas
- **localStorage** -- Persistencia de dados
- **PWA** -- Service Worker, Manifest, instalacao nativa
- **Google Fonts** -- Inter + Cormorant Garamond

---

## Instalacao e Desenvolvimento

### Pre-requisitos

Nenhum! E HTML/CSS/JS puro. Basta um servidor web simples.

### Rodar localmente

```bash
# Com Python
python3 -m http.server 8080

# Com Node.js
npx serve .

# Com PHP
php -S localhost:8080
```

Acesse `http://localhost:8080`

---

## PWA - Instalacao

O klipza.ia e um **PWA** completo. Para instalar:

### Desktop (Chrome/Edge)
1. Acesse o site
2. Clique no icone de instalacao na barra de endereco
3. Clique em "Instalar"

### Mobile (Android)
1. Acesse o site pelo Chrome
2. Toque no banner "Adicionar a tela inicial"
3. Ou va no menu (3 pontos) > "Instalar aplicativo"

### iOS (Safari)
1. Acesse o site pelo Safari
2. Toque no botao Compartilhar
3. Role e toque em "Adicionar a Tela de Inicio"

---

## Criando APK (Android)

Para gerar um APK a partir do PWA, use o **Bubblewrap** (ferramenta oficial do Google para Trusted Web Activity):

```bash
# Instalar Bubblewrap
npm install -g @bubblewrap/cli

# Inicializar
bubblewrap init --manifest https://klipza.ia/manifest.json

# Build APK
bubblewrap build
```

### Alternativas (Builders Online)

- [PWABuilder](https://www.pwabuilder.com/) -- Microsoft
- [AppScope](https://appsco.pe/) -- No-code APK builder
- [WebintoApp](https://www.webintoapp.com/) -- Conversor simples

### Configuracao para Play Store

1. Gere a keystore de assinatura
2. Configure o `assetlinks.json` no servidor
3. Preencha os dados na Play Store Console
4. Publique como TWA (Trusted Web Activity)

---

## Modelos

### klipza.lite (Padrao - Gratuito)
Modelo rapido e eficiente. Ideal para conversas do dia a dia, emails, ideias e produtividade. **100 tokens/dia gratuitos.**

### klipza.prime (Em Desenvolvimento)
Modelo avancado com recursos premium. **Em breve disponivel por R$ 120/mes.** Incluira:
- Respostas mais elaboradas
- Sem limite de tokens
- Acesso a APIs reais de IA
- Funcionalidades exclusivas

---

## Seguranca

- Senhas armazenadas com hash **SHA-256** + salt
- Dados salvos apenas no **localStorage** do dispositivo
- Nenhum dado enviado para servidores externos
- Exclusao de conta com periodo de carencia de **24 horas**
-  Content Security Policy recomendada para producao

---

## Roadmap

- [] Integracao com APIs reais de IA (klipza.prime)
- [] Sistema de pagamento (Stripe/PIX)amd
- [] Sincronizacao entre dispositivos
- [] Temas personalizados
- [] Upload de arquivos
- [] Modo voz
- [] Internacionalizacao (EN, ES)

---

## Desenvolvido por

**Klipza Studio** - [klipza.ia](https://klipza.ia)

---

## Licenca
Todos os direitos reservados. © 2026 Klipza Studio.
