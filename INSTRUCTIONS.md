# 🎬 YouTube Shorts Summary - Sistema Real

## 🚀 Execução do Sistema

### 1. **Instalar Dependências**
```bash
# Frontend
pnpm install

# Backend
cd server && npm install && cd ..
```

### 2. **Iniciar Backend (Terminal 1)**
```bash
cd server && npm start
```
**Aguarde:** `🚀 Servidor pronto para receber requisições!`

### 3. **Iniciar Frontend (Terminal 2)**
```bash
npm run dev
```

### 4. **Acessar**
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

---

## 🔧 Sistema Real - Como Funciona

### 📥 **Download Real do YouTube**
- Usa `ytdl-core` para baixar áudio
- Verifica duração (max 60 segundos)
- Valida se vídeo está disponível
- Baixa melhor qualidade de áudio disponível

### 🎵 **Conversão Real com FFmpeg**
- Converte MP4 → WAV (16kHz, mono)
- Usa `ffmpeg-static` (incluído)
- Processa para formato compatível com IA

### 🎤 **Transcrição Real com Whisper AI**
- Modelo: `Xenova/whisper-small`
- Processa em chunks de 30s
- Língua: Português brasileiro
- Remove ruídos e música automaticamente

### 📝 **Resumo Real com DistilBART AI**
- Modelo: `Xenova/distilbart-cnn-12-6`
- Processa textos longos em chunks
- Gera resumos de 30-200 palavras
- Otimizado para conteúdo brasileiro

---

## ⚠️ Limitações e Requisitos

### ✅ **Funciona com:**
- YouTube Shorts públicos
- Vídeos até 60 segundos
- Qualquer idioma (otimizado para português)
- URLs: `youtube.com/shorts/` ou `youtu.be/`

### ❌ **NÃO funciona com:**
- Vídeos privados ou restritos
- Vídeos com mais de 60 segundos
- Lives ou streams
- Vídeos que exigem login

### 🔧 **Requisitos do Sistema:**
- **Node.js** ≥ 18.0.0
- **RAM** ≥ 4GB (para modelos de IA)
- **Internet** estável
- **FFmpeg** (incluído automaticamente)

---

## 🧪 Testando o Sistema

### URLs de Exemplo:
```
https://www.youtube.com/shorts/VALID_VIDEO_ID
https://youtu.be/VALID_VIDEO_ID
```

### Processo Esperado:
1. **Download** (5-30 segundos)
2. **Conversão** (5-15 segundos)
3. **Transcrição** (10-60 segundos)
4. **Resumo** (5-30 segundos)

**Total:** 25-135 segundos dependendo do vídeo

---

## 🚨 Solução de Problemas

### ❌ **"Acesso negado pelo YouTube"**
```
Causa: YouTube bloqueou temporariamente
Solução: Aguardar 5-10 minutos e tentar novamente
```

### ❌ **"Erro ao carregar modelo"**
```
Causa: Primeira execução baixa modelos IA
Solução: Aguardar download automático (pode demorar)
```

### ❌ **"Memória insuficiente"**
```
Causa: Modelos IA consomem RAM
Solução: Fechar outros programas ou usar vídeo menor
```

### ❌ **"Vídeo não disponível"**
```
Causa: Vídeo privado, removido ou regional
Solução: Tentar outro vídeo público
```

### ❌ **"Erro de conexão"**
```bash
# Verificar se backend está rodando
curl http://localhost:3001/api/health

# Resposta esperada:
{"status":"Server is running!","port":3001}
```

---

## 📊 Performance e Otimização

### **Primeira Execução:**
- Pode demorar 2-5 minutos
- Downloads automáticos dos modelos IA
- Modelos ficam em cache local

### **Execuções Seguintes:**
- Processamento normal (25-135s)
- Modelos já carregados localmente
- Performance otimizada

### **Consumo de Recursos:**
- **RAM:** 1-3GB durante processamento
- **CPU:** Picos durante IA
- **Disco:** ~500MB para modelos
- **Rede:** Download do vídeo + modelos (primeira vez)

---

## 🔍 Logs e Debug

### **Backend Logs:**
```bash
# No terminal do servidor, observe:
🎬 Iniciando download do vídeo: VIDEO_ID
📊 Dados de áudio gerados: XXXXX samples
🎤 Transcrição finalizada com sucesso!
📝 Resumo gerado: XXX caracteres
```

### **Frontend Errors:**
```
F12 → Console → Verificar erros
Network → Verificar requisições para localhost:3001
```

---

## 🎯 Status do Sistema

### ✅ **Funcionando:**
- Download real de YouTube Shorts
- Conversão FFmpeg
- Transcrição Whisper AI
- Resumo DistilBART AI
- Interface React completa

### 🚧 **Notas:**
- Primeira execução: download de modelos
- YouTube pode bloquear temporariamente
- Performance varia com tamanho do vídeo
- Requer internet estável

---

## 📞 Suporte Rápido

### **Reiniciar Sistema:**
```bash
# Matar processos
pkill -f node

# Reiniciar backend
cd server && npm start

# Reiniciar frontend (novo terminal)
npm run dev
```

### **Verificar Saúde:**
```bash
curl http://localhost:3001/api/health
```

### **Limpar Cache:**
```bash
rm -rf server/node_modules/.cache
```

---

**🎉 Sistema 100% funcional com IA real para YouTube Shorts!**