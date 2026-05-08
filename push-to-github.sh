#!/bin/bash

# Script para fazer push do PlanoCerto para o GitHub
# Uso: ./push-to-github.sh SEU-USUARIO-GITHUB

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 PlanoCerto - Push para GitHub${NC}"
echo ""

# Verificar se o usuário foi fornecido
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erro: Forneça seu usuário do GitHub${NC}"
    echo ""
    echo "Uso: ./push-to-github.sh SEU-USUARIO-GITHUB"
    echo ""
    echo "Exemplo: ./push-to-github.sh joaosilva"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME="PlanoCerto01"

echo -e "${BLUE}📋 Configurações:${NC}"
echo "   Usuário: $GITHUB_USER"
echo "   Repositório: $REPO_NAME"
echo "   URL: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""

# Verificar se já existe remote
if git remote | grep -q "origin"; then
    echo -e "${BLUE}🔄 Removendo remote existente...${NC}"
    git remote remove origin
fi

# Adicionar remote
echo -e "${BLUE}🔗 Adicionando remote do GitHub...${NC}"
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Renomear branch para main
echo -e "${BLUE}🌿 Renomeando branch para main...${NC}"
git branch -M main

# Fazer push
echo -e "${BLUE}📤 Fazendo push para o GitHub...${NC}"
echo ""
echo -e "${RED}⚠️  Se pedir senha, use seu Personal Access Token!${NC}"
echo "   Crie em: https://github.com/settings/tokens"
echo ""

git push -u origin main

# Verificar se deu certo
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
    echo ""
    echo -e "${GREEN}🎉 Seu código está no GitHub!${NC}"
    echo ""
    echo "📍 Acesse: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo -e "${BLUE}🚀 Próximo passo: Deploy no Vercel${NC}"
    echo "   1. Acesse: https://vercel.com"
    echo "   2. Sign up with GitHub"
    echo "   3. Import $REPO_NAME"
    echo "   4. Deploy"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    echo ""
    echo "Possíveis soluções:"
    echo "1. Verifique se o repositório existe no GitHub"
    echo "2. Use Personal Access Token em vez de senha"
    echo "3. Ou use GitHub Desktop: https://desktop.github.com"
    echo ""
fi
