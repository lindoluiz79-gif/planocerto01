# ✅ CHECKLIST - DEPLOY CLOUDFLARE

Siga este checklist passo a passo. Marque cada item conforme for completando.

---

## 📝 PRÉ-REQUISITOS

- [ ] Tenho conta no GitHub (já tem ✅)
- [ ] Repositório está atualizado no GitHub (já está ✅)
- [ ] Build local funcionou (já funcionou ✅)

---

## 🚀 PASSO A PASSO

### 1️⃣ ACESSAR CLOUDFLARE
- [ ] Abri o site: https://dash.cloudflare.com/
- [ ] Fiz login OU criei conta grátis
- [ ] Estou na página inicial do dashboard

### 2️⃣ CRIAR PROJETO
- [ ] Cliquei em "Workers & Pages" no menu lateral
- [ ] Cliquei em "Create application"
- [ ] Escolhi a aba "Pages"
- [ ] Cliquei em "Connect to Git"

### 3️⃣ CONECTAR GITHUB
- [ ] Selecionei "GitHub"
- [ ] Autorizei o Cloudflare no GitHub
- [ ] Encontrei o repositório: `lindoluiz79-gif/planocerto01`
- [ ] Cliquei em "Begin setup"

### 4️⃣ CONFIGURAR BUILD
Preenchi os campos:

- [ ] **Project name**: `planocerto`
- [ ] **Production branch**: `master`
- [ ] **Framework preset**: `None` ou `Vite`
- [ ] **Build command**: `npm install --legacy-peer-deps && npm run build`
- [ ] **Build output directory**: `dist/client`
- [ ] **Root directory**: (deixei vazio)

### 5️⃣ VARIÁVEIS DE AMBIENTE
- [ ] Cliquei em "Environment variables (advanced)"
- [ ] Adicionei variável:
  - Nome: `NODE_VERSION`
  - Valor: `20`

### 6️⃣ INICIAR DEPLOY
- [ ] Cliquei em "Save and Deploy"
- [ ] Aguardando o build... ⏳

---

## 🎯 DURANTE O BUILD

Você vai ver:
1. ⏳ "Initializing build environment"
2. ⏳ "Cloning repository"
3. ⏳ "Installing dependencies"
4. ⏳ "Building application"
5. ✅ "Deploying to Cloudflare's global network"
6. 🎉 "Success! Your site is live"

**Tempo estimado: 2-3 minutos**

---

## ✅ APÓS O DEPLOY

- [ ] Recebi a URL do site (tipo: `https://planocerto.pages.dev`)
- [ ] Cliquei na URL para abrir o site
- [ ] O site carregou corretamente
- [ ] Testei algumas páginas:
  - [ ] Página inicial (/)
  - [ ] Buscar planos (/buscar)
  - [ ] Comparar (/comparar)
  - [ ] Blog (/blog)
  - [ ] FAQ (/faq)

---

## 🎊 SUCESSO!

Se tudo funcionou:
- ✅ Seu site está no ar!
- ✅ Deploy automático configurado (cada push faz deploy)
- ✅ SSL/HTTPS ativado automaticamente
- ✅ CDN global ativo

---

## ❌ SE DEU ERRO

Marque onde parou:

**Erro no passo**: ___________

**Mensagem de erro**: 
```
(cole aqui a mensagem de erro)
```

**Me avise e eu te ajudo a resolver!**

---

## 📱 COMPARTILHE!

Quando estiver funcionando, compartilhe a URL:
- WhatsApp
- Redes sociais
- Com amigos e família

**Parabéns! 🎉🎉🎉**
