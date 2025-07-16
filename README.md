# YouTube Shorts Summary

Uma aplicação web para resumir automaticamente vídeos do YouTube Shorts usando inteligência artificial.

## 🚀 Funcionalidades

- **Download de vídeos**: Baixa vídeos do YouTube Shorts automaticamente
- **Transcrição automática**: Converte áudio em texto usando Whisper AI
- **Resumo inteligente**: Gera resumos concisos usando DistilBART
- **Interface moderna**: Interface React com Tailwind CSS
- **Processamento em tempo real**: Acompanhe o progresso do processamento

## 🛠️ Tecnologias

### Frontend
- **React 19** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **ytdl-core** - Download de vídeos do YouTube
- **FFmpeg** - Processamento de áudio/vídeo
- **@xenova/transformers** - Modelos de IA (Whisper + DistilBART)

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **pnpm** ou **npm**
- **FFmpeg** instalado no sistema

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd youtube-shorts-summary
   ```

2. **Instale as dependências do frontend**
   ```bash
   pnpm install
   ```

3. **Instale as dependências do backend**
   ```bash
   cd server
   npm install
   cd ..
   ```

## 🚀 Execução

### Desenvolvimento

1. **Inicie o servidor backend**
   ```bash
   npm run server:dev
   ```

2. **Inicie o frontend** (em outro terminal)
   ```bash
   npm run dev
   ```

3. **Acesse a aplicação**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

### Produção

1. **Build do frontend**
   ```bash
   npm run build
   ```

2. **Inicie o servidor**
   ```bash
   npm run server
   ```

## 📁 Estrutura do Projeto

```
youtube-shorts-summary/
├── src/                    # Frontend React
│   ├── api/               # Funções da API
│   ├── app.tsx            # Componente principal
│   ├── main.tsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── server/                # Backend Node.js
│   ├── api/               # Módulos da API
│   │   ├── convert.js     # Conversão de áudio
│   │   ├── download.js    # Download de vídeos
│   │   ├── summarize.js   # Resumo de texto
│   │   └── transcribe.js  # Transcrição de áudio
│   ├── index.js           # Servidor Express
│   └── package.json       # Dependências do backend
├── tmp/                   # Arquivos temporários
└── package.json           # Dependências do frontend
```

## 🌐 API Endpoints

### `GET /api/health`
Verifica se o servidor está rodando.

### `POST /api/download`
Faz download de um vídeo do YouTube.
```json
{
  "videoId": "string"
}
```

### `POST /api/transcribe`
Transcreve o áudio do vídeo baixado.

### `POST /api/summary`
Gera resumo do texto transcrito.
```json
{
  "text": "string"
}
```

## 📖 Como Usar

1. **Abra a aplicação** no navegador
2. **Cole a URL** de um YouTube Short no campo de entrada
3. **Clique no botão Play** para iniciar o processamento
4. **Aguarde** o processamento automático:
   - Download do vídeo
   - Conversão para áudio
   - Transcrição do áudio
   - Geração do resumo
5. **Leia o resumo** gerado na tela

## ⚠️ Limitações

- **Duração máxima**: 60 segundos por vídeo
- **Idioma**: Otimizado para português brasileiro
- **Formatos**: Apenas vídeos do YouTube Shorts

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia frontend em desenvolvimento
npm run server:dev       # Inicia backend em desenvolvimento

# Produção
npm run build           # Build do frontend
npm run server          # Inicia servidor de produção

# Utilitários
npm run lint            # Executa linting
npm run preview         # Preview da build
npm run server:install  # Instala dependências do servidor
```

## 🐛 Solução de Problemas

### Erro de FFmpeg
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Baixe de https://ffmpeg.org/download.html
```

### Erro de CORS
Certifique-se que o backend está rodando na porta 3001.

### Erro de URL inválida
Verifique se a URL é de um YouTube Short válido.

## 📝 Licença

MIT License