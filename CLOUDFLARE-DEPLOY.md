# 🚀 Deploy no Cloudflare Pages - PlanoCerto

## ✅ TUDO PRONTO PARA DEPLOY!

Todos os arquivos estão configurados corretamente para o Cloudflare Pages.

---

## 📋 Configuração Automática

Os seguintes arquivos foram preparados:

- ✅ `wrangler.toml` - Configuração Cloudflare
- ✅ `.node-version` - Node.js 18
- ✅ `package.json` - Scripts de build corretos
- ✅ `vite.config.ts` - Configuração TanStack Start

---

## 🚀 Passo a Passo (5 minutos)

### 1️⃣ Criar Conta Cloudflare

**Link:** https://dash.cloudflare.com/sign-up

1. Preencha email e senha
2. Clique em "Create Account"
3. Verifique seu email
4. Faça login

---

### 2️⃣ Acessar Cloudflare Pages

1. No dashboard, clique em **"Workers & Pages"** (menu lateral)
2. Clique em **"Create application"**
3. Clique na aba **"Pages"**
4. Clique em **"Connect to Git"**

---

### 3️⃣ Conectar GitHub

1. Clique em **"Connect GitHub"**
2. Autorize o Cloudflare
3. Selecione **"Only select repositories"**
4. Escolha: **planocerto01**
5. Clique em **"Install & Authorize"**

---

### 4️⃣ Configurar Build

**⚠️ COPIE EXATAMENTE ESTAS CONFIGURAÇÕES:**

```
Project name: planocerto
Production branch: master

Build settings:
Framework preset: None
Build command: npm run build
Build output directory: dist/client
Root directory: (deixe vazio)
```

**Environment variables (opcional):**
```
NODE_VERSION = 18
```

---

### 5️⃣ Deploy

1. Clique em **"Save and Deploy"**
2. Aguarde 2-3 minutos
3. ✅ **Pronto!**

---

## 🎉 Resultado

Você terá:

- 🌐 **URL:** `https://planocerto.pages.dev`
- 📱 **PWA instalável**
- 🚀 **SSR funcionando**
- ⚡ **Super rápido** (Cloudflare CDN global)
- 💰 **100% GRATUITO**

---

## 📊 Especificações Técnicas

### Build
- **Comando:** `npm run build`
- **Output:** `dist/client`
- **Node.js:** 18
- **Framework:** TanStack Start + Vite

### Features
- ✅ Server-Side Rendering (SSR)
- ✅ Progressive Web App (PWA)
- ✅ Service Worker
- ✅ Offline support
- ✅ Push notifications
- ✅ 8 temas personalizados

---

## 🔄 Deploy Automático

Depois do primeiro deploy:

**Cada push no GitHub = Deploy automático!**

```bash
git add .
git commit -m "Nova feature"
git push origin master
```

→ Cloudflare detecta automaticamente  
→ Faz build  
→ Faz deploy  
→ Site atualizado em 2-3 minutos!

---

## 🆘 Troubleshooting

### Build Falha

**Erro:** "Build failed"

**Solução:**
1. Verifique se usou `dist/client` como output
2. Verifique se o build command é `npm run build`
3. Tente adicionar `NODE_VERSION=18` nas variáveis

---

### Site Não Carrega

**Erro:** Página em branco

**Solução:**
1. Aguarde 5 minutos (propagação)
2. Limpe cache do navegador (Ctrl+Shift+R)
3. Tente em modo anônimo

---

### 404 em Rotas

**Erro:** Rotas internas dão 404

**Solução:**
- Isso não deve acontecer! O TanStack Start cuida disso.
- Se acontecer, me avise!

---

## 📱 Domínio Personalizado (Opcional)

Depois do deploy, você pode adicionar seu próprio domínio:

1. Cloudflare Pages → Seu projeto
2. **Custom domains** → **Set up a custom domain**
3. Digite seu domínio (ex: `planocerto.com.br`)
4. Siga as instruções de DNS
5. Aguarde propagação (até 24h)

**Custo:** Apenas o domínio (~R$ 40/ano no registro.br)

---

## 🎯 Checklist Final

Antes de fazer deploy, verifique:

- [x] ✅ Código no GitHub (planocerto01)
- [x] ✅ wrangler.toml configurado
- [x] ✅ .node-version criado
- [x] ✅ package.json com build correto
- [x] ✅ tailwind.config.ts criado
- [x] ✅ Todas as dependências instaladas
- [x] ✅ Build testado localmente (funcionando!)
- [ ] ⏳ Conta Cloudflare criada
- [ ] ⏳ GitHub conectado
- [ ] ⏳ Deploy realizado

---

## 💡 Dicas

### Performance
- ✅ Cloudflare CDN global (super rápido)
- ✅ Cache automático
- ✅ Compressão Brotli
- ✅ HTTP/3

### Monitoramento
- Cloudflare Pages → Analytics
- Veja visitantes, performance, erros
- Tudo grátis!

### Limites (Plano Gratuito)
- ✅ 500 builds/mês
- ✅ Bandwidth ilimitado
- ✅ Requests ilimitados
- ✅ 100 domínios personalizados

**Mais que suficiente!** 🎉

---

## 🚀 Pronto para Deploy!

**Tudo está configurado!**

Agora é só:
1. Criar conta no Cloudflare
2. Conectar GitHub
3. Configurar build
4. Deploy!

**5 minutos e está no ar!** 🎉

---

## 📞 Links Úteis

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **TanStack Start Docs:** https://tanstack.com/start
- **Suporte:** https://community.cloudflare.com

---

## 🎉 Boa Sorte!

Seu site vai ficar incrível! 🚀

**Comece agora:** https://dash.cloudflare.com/sign-up

---

**Versão:** 1.0  
**Data:** 08/05/2026  
**Status:** ✅ 100% PRONTO PARA DEPLOY
