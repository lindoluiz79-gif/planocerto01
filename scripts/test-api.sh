#!/bin/bash

# Script para testar todos os endpoints da API

API_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🧪 Testando API do PlanoCerto..."
echo ""

# Health Check
echo -e "${BLUE}1. Health Check${NC}"
response=$(curl -s "$API_URL/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ API está online${NC}"
    echo "$response" | jq '.'
else
    echo -e "${RED}❌ API não está respondendo${NC}"
    exit 1
fi
echo ""

# Signup
echo -e "${BLUE}2. Testando Signup${NC}"
signup_response=$(curl -s -X POST "$API_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@planocerto.com",
    "name": "Usuário Teste",
    "password": "senha123"
  }')

if echo "$signup_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Signup funcionando${NC}"
    TOKEN=$(echo "$signup_response" | jq -r '.token')
    USER_ID=$(echo "$signup_response" | jq -r '.user.id')
else
    echo -e "${RED}⚠️  Signup falhou (usuário pode já existir)${NC}"
fi
echo ""

# Login
echo -e "${BLUE}3. Testando Login${NC}"
login_response=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@planocerto.com",
    "password": "senha123"
  }')

if echo "$login_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Login funcionando${NC}"
    TOKEN=$(echo "$login_response" | jq -r '.token')
    USER_ID=$(echo "$login_response" | jq -r '.user.id')
else
    echo -e "${RED}❌ Login falhou${NC}"
    echo "$login_response" | jq '.'
    exit 1
fi
echo ""

# Get Plans
echo -e "${BLUE}4. Testando Get Plans${NC}"
plans_response=$(curl -s "$API_URL/api/plans")
if echo "$plans_response" | jq -e '.plans' > /dev/null 2>&1; then
    plan_count=$(echo "$plans_response" | jq '.plans | length')
    echo -e "${GREEN}✅ Get Plans funcionando ($plan_count planos)${NC}"
else
    echo -e "${RED}❌ Get Plans falhou${NC}"
fi
echo ""

# Track Commission
echo -e "${BLUE}5. Testando Track Commission${NC}"
commission_response=$(curl -s -X POST "$API_URL/api/commissions/track" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"planId\": \"unimed-mei\",
    \"operadora\": \"Unimed\",
    \"userId\": \"$USER_ID\",
    \"amount\": 24.50
  }")

if echo "$commission_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Track Commission funcionando${NC}"
else
    echo -e "${RED}❌ Track Commission falhou${NC}"
    echo "$commission_response" | jq '.'
fi
echo ""

# Newsletter Subscribe
echo -e "${BLUE}6. Testando Newsletter Subscribe${NC}"
newsletter_response=$(curl -s -X POST "$API_URL/api/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newsletter@teste.com",
    "name": "Newsletter Teste"
  }')

if echo "$newsletter_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Newsletter Subscribe funcionando${NC}"
else
    echo -e "${RED}⚠️  Newsletter Subscribe falhou (pode já estar inscrito)${NC}"
fi
echo ""

# Analytics Track
echo -e "${BLUE}7. Testando Analytics Track${NC}"
analytics_response=$(curl -s -X POST "$API_URL/api/analytics/track" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"eventType\": \"plan_view\",
    \"eventData\": {\"planId\": \"unimed-mei\"}
  }")

if echo "$analytics_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Analytics Track funcionando${NC}"
else
    echo -e "${RED}❌ Analytics Track falhou${NC}"
fi
echo ""

# Resumo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Testes concluídos!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Token de autenticação:"
echo "$TOKEN"
echo ""
echo "Use este token para testar endpoints autenticados:"
echo "curl -H \"Authorization: Bearer $TOKEN\" $API_URL/api/..."
