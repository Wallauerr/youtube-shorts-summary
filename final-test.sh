#!/bin/bash

# YouTube Shorts Summary - Final Test Script
# Este script testa todo o projeto para garantir que está funcionando corretamente

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis
SERVER_PID=""
API_BASE="http://localhost:3001/api"
FRONTEND_PORT=5173

echo -e "${BLUE}🚀 =================================${NC}"
echo -e "${BLUE}🚀   TESTE FINAL DO PROJETO        ${NC}"
echo -e "${BLUE}🚀   YouTube Shorts Summary        ${NC}"
echo -e "${BLUE}🚀 =================================${NC}"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo -e "\n${YELLOW}🧹 Limpando processos...${NC}"
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    pkill -f "node.*index.js" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    echo -e "${GREEN}✅ Limpeza concluída${NC}"
}

trap cleanup EXIT

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências
echo -e "${BLUE}📋 Verificando dependências...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm não encontrado${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"

# Verificar se as dependências estão instaladas
echo -e "\n${BLUE}📦 Verificando instalação das dependências...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Instalando dependências do frontend...${NC}"
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Instalando dependências do servidor...${NC}"
    cd server && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependências verificadas${NC}"

# Teste 1: Build do Frontend
echo -e "\n${BLUE}🏗️  Teste 1: Build do Frontend${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build do frontend OK${NC}"
    BUILD_TEST=1
else
    echo -e "${RED}❌ Build do frontend falhou${NC}"
    BUILD_TEST=0
fi

# Teste 2: Lint do código
echo -e "\n${BLUE}🔍 Teste 2: Lint do código${NC}"
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Lint passou${NC}"
    LINT_TEST=1
else
    echo -e "${RED}❌ Lint falhou${NC}"
    LINT_TEST=0
fi

# Teste 3: Iniciar servidor
echo -e "\n${BLUE}🖥️  Teste 3: Iniciando servidor...${NC}"
cd server
node index.js &
SERVER_PID=$!
cd ..

# Esperar servidor inicializar
sleep 5

# Verificar se servidor está rodando
if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Servidor iniciado (PID: $SERVER_PID)${NC}"
    SERVER_TEST=1
else
    echo -e "${RED}❌ Servidor falhou ao iniciar${NC}"
    SERVER_TEST=0
fi

# Teste 4: Health Check API
echo -e "\n${BLUE}🏥 Teste 4: Health Check API${NC}"
if curl -s "$API_BASE/health" | grep -q "running"; then
    echo -e "${GREEN}✅ Health Check OK${NC}"
    HEALTH_TEST=1
else
    echo -e "${RED}❌ Health Check falhou${NC}"
    HEALTH_TEST=0
fi

# Teste 5: API de Download (validação)
echo -e "\n${BLUE}📥 Teste 5: API de Download (validação)${NC}"
DOWNLOAD_RESPONSE=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"videoId":""}' \
    "$API_BASE/download")

if echo "$DOWNLOAD_RESPONSE" | grep -q "400"; then
    echo -e "${GREEN}✅ Validação de Download OK${NC}"
    DOWNLOAD_TEST=1
else
    echo -e "${RED}❌ Validação de Download falhou${NC}"
    DOWNLOAD_TEST=0
fi

# Teste 6: API de Resumo
echo -e "\n${BLUE}📝 Teste 6: API de Resumo${NC}"
SUMMARY_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"text":"Este é um teste do sistema de resumo. O sistema deve conseguir processar este texto e gerar um resumo conciso. É importante que funcione corretamente para validar a funcionalidade."}' \
    "$API_BASE/summary")

if echo "$SUMMARY_RESPONSE" | grep -q "result"; then
    echo -e "${GREEN}✅ API de Resumo OK${NC}"
    SUMMARY_TEST=1
else
    echo -e "${RED}❌ API de Resumo falhou${NC}"
    SUMMARY_TEST=0
fi

# Teste 7: Frontend Development Server
echo -e "\n${BLUE}🌐 Teste 7: Frontend Development Server${NC}"
timeout 10s npm run dev > /dev/null 2>&1 &
VITE_PID=$!
sleep 5

if curl -s "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend server OK${NC}"
    FRONTEND_TEST=1
else
    echo -e "${RED}❌ Frontend server falhou${NC}"
    FRONTEND_TEST=0
fi

kill $VITE_PID 2>/dev/null || true

# Resumo dos testes
echo -e "\n${BLUE}🚀 =================================${NC}"
echo -e "${BLUE}🚀        RESUMO DOS TESTES        ${NC}"
echo -e "${BLUE}🚀 =================================${NC}"

TOTAL_TESTS=7
PASSED_TESTS=0

echo -e "📋 Build Frontend:      $([ $BUILD_TEST -eq 1 ] && echo -e "${GREEN}✅ PASSOU${NC}" || echo -e "${RED}❌ FALHOU${NC}")"
[ $BUILD_TEST -eq 1 ] && ((PASSED_TESTS++))

echo -e "🔍 Lint:                $([ $LINT_TEST -eq 1 ] && echo -e "${GREEN}✅ PASSOU${NC}" || echo -e "${RED}❌ FALHOU${NC}")"
[ $LINT_TEST -eq 1 ] && ((PASSED_TESTS++))

echo -e "🖥️  Servidor:            $([ $SERVER_TEST -eq 1 ] && echo -e "${GREEN}✅ PASSOU${NC}" || echo -e "${RED}❌ FALHOU${NC}")"
[ $SERVER_TEST -eq 1 ] && ((PASSED_TESTS++))

echo -e "🏥 Health Check:        $([ $HEALTH_TEST -eq 1 ] && echo -e "${GREEN}✅ PASSOU${NC}" || echo -e "${RED}❌ FALHOU${NC}")"
[ $HEALTH_TEST -eq 1 ] && ((PASSED_TESTS++))

echo -e "📥 API Download:        $([ $DOWNLOAD_TEST -eq 1 ] && echo -e "${GREEN}✅ PASSOU${NC}" || echo -e "${RED}❌ FALHOU${NC}")"
[ $DOWNLOAD_TEST -eq 1 ] && ((PASSED_TESTS++))

echo -e "📝 API Resumo:          $([ $SUMMARY_TEST -eq 1 ] && echo -e "${GREEN}✅ PASSOU${NC}" || echo -e "${RED}❌ FALHOU${NC}")"
[ $SUMMARY_TEST -eq 1 ] && ((PASSED_TESTS++))

echo -e "🌐 Frontend Server:     $([ $FRONTEND_TEST -eq 1 ] && echo -e "${GREEN}✅ PASSOU${NC}" || echo -e "${RED}❌ FALHOU${NC}")"
[ $FRONTEND_TEST -eq 1 ] && ((PASSED_TESTS++))

echo ""
echo -e "${BLUE}📊 RESULTADO FINAL:${NC}"
echo -e "   Testes aprovados: ${GREEN}$PASSED_TESTS/$TOTAL_TESTS${NC}"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "\n${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo -e "${GREEN}🚀 O projeto está funcionando corretamente!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Para usar o projeto:${NC}"
    echo -e "   1. ${BLUE}cd server && npm start${NC}     (Terminal 1)"
    echo -e "   2. ${BLUE}npm run dev${NC}               (Terminal 2)"
    echo -e "   3. Acesse ${BLUE}http://localhost:5173${NC}"
    echo ""
    exit 0
else
    echo -e "\n${RED}⚠️  ALGUNS TESTES FALHARAM${NC}"
    echo -e "${YELLOW}📋 Verifique os erros acima e corrija os problemas${NC}"
    echo ""
    exit 1
fi
