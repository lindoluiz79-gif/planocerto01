#!/bin/bash

# PlanoCerto - Script de Setup Automático
# Este script configura todo o ambiente de desenvolvimento

echo "🚀 Iniciando setup do PlanoCerto..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Instale em https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo ""

# Verificar PostgreSQL
echo -e "${BLUE}Verificando PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}⚠️  PostgreSQL não encontrado${NC}"
    echo "Você pode:"
    echo "1. Instalar localmente: https://www.postgresql.org/download/"
    echo "2. Usar Supabase (recomendado): https://supabase.com"
    echo ""
else
    echo -e "${GREEN}✅ PostgreSQL instalado${NC}"
fi
echo ""

# Instalar dependências
echo -e "${BLUE}Instalando dependências...${NC}"
npm install
echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo ""

# Criar .env se não existir
if [ ! -f .env ]; then
    echo -e "${BLUE}Criando arquivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
    echo -e "${RED}⚠️  IMPORTANTE: Edite o arquivo .env com suas chaves de API${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
    echo ""
fi

# Perguntar se quer configurar banco de dados
echo -e "${BLUE}Deseja configurar o banco de dados agora? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
    echo ""
    echo -e "${BLUE}Digite a DATABASE_URL:${NC}"
    echo "Exemplo: postgresql://user:password@localhost:5432/planocerto"
    read -r database_url
    
    if [ ! -z "$database_url" ]; then
        # Atualizar .env
        if grep -q "DATABASE_URL=" .env; then
            sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=$database_url|" .env
        else
            echo "DATABASE_URL=$database_url" >> .env
        fi
        
        # Rodar schema
        echo -e "${BLUE}Criando tabelas...${NC}"
        psql "$database_url" -f server/db/schema.sql
        echo -e "${GREEN}✅ Banco de dados configurado${NC}"
    fi
fi
echo ""

# Gerar JWT Secret se não existir
if ! grep -q "JWT_SECRET=" .env || grep -q "JWT_SECRET=your-super-secret" .env; then
    echo -e "${BLUE}Gerando JWT Secret...${NC}"
    jwt_secret=$(openssl rand -base64 32)
    if grep -q "JWT_SECRET=" .env; then
        sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$jwt_secret|" .env
    else
        echo "JWT_SECRET=$jwt_secret" >> .env
    fi
    echo -e "${GREEN}✅ JWT Secret gerado${NC}"
fi
echo ""

# Resumo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo ""
echo "1. Configure as chaves de API no arquivo .env:"
echo "   - Stripe: https://dashboard.stripe.com/apikeys"
echo "   - Mercado Pago: https://www.mercadopago.com.br/developers"
echo "   - SendGrid: https://app.sendgrid.com/settings/api_keys"
echo ""
echo "2. Inicie o servidor de desenvolvimento:"
echo "   ${GREEN}npm run dev:all${NC}"
echo ""
echo "3. Acesse:"
echo "   Frontend: ${BLUE}http://localhost:8080${NC}"
echo "   Backend:  ${BLUE}http://localhost:3000${NC}"
echo ""
echo "4. Leia a documentação:"
echo "   - GUIA-DEPLOY.md - Deploy em produção"
echo "   - SISTEMA-PAGAMENTOS.md - Sistema de pagamentos"
echo ""
echo -e "${GREEN}Boa sorte com o PlanoCerto! 🚀${NC}"
