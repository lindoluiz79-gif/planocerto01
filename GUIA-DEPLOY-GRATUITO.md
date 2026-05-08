# 🚀 Guia de Deploy Gratuito - PlanoCerto

## 🎯 Objetivo

Fazer deploy do PlanoCerto como site com PWA instalável, **100% GRATUITO**.

---

## ⚠️ Importante: Limitação do TanStack Start

Seu projeto usa **TanStack Start (SSR)** que precisa de servidor Node.js. Não pode ser hospedado como site estático.

### Opções Gratuitas com Node.js:

1. **Vercel** ⭐ RECOMENDADO
2. **Railway**
3. **Render**
4. **Fly.io**

---

## 🥇 Opção 1: Vercel (RECOMENDADO)

### Por que Vercel?
- ✅ 100% Gratuito para projetos pessoais
- ✅ Deploy automático do GitHub
- ✅ HTTPS grátis
- ✅ Domínio grátis (.vercel.app)
- ✅ Suporta TanStack Start
- ✅ Edge Functions
- ✅ Analytics grátis

### Passo a Passo:

#### 1. Criar Conta Vercel

1. Acesse https://vercel.com
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize o Vercel

#### 2. Preparar Projeto

Seu projeto já está pronto! Mas vamos garantir:

```bash
# Testar build local
npm run build

# Se funcionar, está pronto!
```

#### 3. Criar arquivo vercel.json

Já existe, mas vamos melhorar:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/client",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["gru1"],
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    },
    {
      "source": "/manifest.webmanifest",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### 4. Deploy no Vercel

**Opção A: Via Dashboard (Mais Fácil)**

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório GitHub
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/client`
   - **Install Command:** `npm install`
5. Clique em "Deploy"
6. Aguarde 2-5 minutos
7. ✅ Pronto! Seu site está no ar!

**Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Responda as perguntas:
# - Set up and deploy? Y
# - Which scope? [sua conta]
# - Link to existing project? N
# - Project name? planocerto
# - Directory? ./
# - Override settings? N

# Deploy para produção
vercel --prod
```

#### 5. Configurar Domínio Personalizado (Opcional)

Se você tiver um domínio:

1. Vercel Dashboard → Seu Projeto → Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Aguarde propagação (até 48h)

**Domínio Grátis:**
Seu site ficará em: `planocerto.vercel.app`

---

## 🥈 Opção 2: Railway

### Por que Railway?
- ✅ Grátis (com limite de $5/mês de crédito)
- ✅ Deploy do GitHub
- ✅ HTTPS grátis
- ✅ Banco de dados grátis
- ✅ Fácil de usar

### Passo a Passo:

1. Acesse https://railway.app
2. Sign up com GitHub
3. New Project → Deploy from GitHub
4. Selecione seu repositório
5. Configure:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
6. Deploy automático!

**URL:** `planocerto.up.railway.app`

---

## 🥉 Opção 3: Render

### Por que Render?
- ✅ Grátis para sites estáticos
- ✅ HTTPS grátis
- ✅ Deploy automático
- ✅ Fácil configuração

### Passo a Passo:

1. Acesse https://render.com
2. Sign up com GitHub
3. New → Web Service
4. Conecte repositório
5. Configure:
   - **Name:** planocerto
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
   - **Plan:** Free
6. Create Web Service

**URL:** `planocerto.onrender.com`

---

## 🎨 Adicionar Botão "Instalar App"

Vamos adicionar um botão para instalar o PWA:

### 1. Criar Componente InstallButton

```typescript
// src/components/InstallButton.tsx
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA instalado!');
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-primary to-primary-glow text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-bounce"
    >
      <Download className="w-5 h-5" />
      <span className="font-semibold">Instalar App</span>
    </button>
  );
}
```

### 2. Adicionar no AppShell

```typescript
// src/components/AppShell.tsx
import { InstallButton } from "./InstallButton";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* ... resto do código ... */}
      
      <InstallButton />
      <AIChat />
      <WhatsAppButton />
      <PremiumFloatingBadge />
      <BottomNav />
    </div>
  );
}
```

---

## 📱 Como Instalar (Para Usuários)

### Android (Chrome)
1. Abra o site
2. Clique no botão "Instalar App" OU
3. Menu (⋮) → "Instalar app" / "Adicionar à tela inicial"
4. Confirme

### iOS (Safari)
1. Abra o site
2. Botão de compartilhar (□↑)
3. "Adicionar à Tela de Início"
4. Confirme

### Desktop (Chrome/Edge)
1. Abra o site
2. Ícone de instalação na barra de endereço OU
3. Clique no botão "Instalar App"
4. Confirme

---

## 🔧 Variáveis de Ambiente

Se precisar de variáveis de ambiente:

### Vercel
Dashboard → Settings → Environment Variables

```
NODE_ENV=production
VITE_API_URL=https://api.planocerto.com.br
```

### Railway
Settings → Variables

### Render
Environment → Environment Variables

---

## 📊 Monitoramento

### Vercel Analytics (Grátis)
1. Dashboard → Analytics
2. Veja:
   - Visitantes
   - Páginas mais acessadas
   - Performance
   - Erros

### Google Analytics (Grátis)
1. Crie conta em https://analytics.google.com
2. Adicione tracking code no `index.html`

---

## 🚀 Deploy Automático

### GitHub Actions (Já configurado!)

Toda vez que você fizer push para `main`:
1. GitHub Actions roda
2. Testa o código
3. Faz build
4. Deploy automático!

---

## 💰 Custos

### Vercel (Recomendado)
- **Grátis:** 100 GB bandwidth/mês
- **Hobby:** $0/mês
- **Pro:** $20/mês (se precisar mais)

### Railway
- **Grátis:** $5 crédito/mês
- **Hobby:** $5/mês depois

### Render
- **Grátis:** 750 horas/mês
- **Starter:** $7/mês

**Recomendação:** Comece com Vercel (100% grátis)

---

## 🎯 Checklist de Deploy

### Antes do Deploy
- [x] Projeto compila sem erros
- [x] PWA configurado (manifest + SW)
- [x] Ícones criados
- [x] Service Worker funcionando
- [ ] Conta Vercel criada
- [ ] Repositório no GitHub

### Durante o Deploy
- [ ] Conectar GitHub ao Vercel
- [ ] Configurar build settings
- [ ] Deploy inicial
- [ ] Testar site online
- [ ] Testar instalação PWA

### Após o Deploy
- [ ] Compartilhar URL
- [ ] Testar em diferentes dispositivos
- [ ] Configurar analytics
- [ ] Monitorar erros
- [ ] Coletar feedback

---

## 🆘 Troubleshooting

### Build Falha
**Erro:** "Build failed"
**Solução:** 
```bash
# Teste local
npm run build

# Veja os erros
# Corrija
# Commit e push
```

### PWA Não Instala
**Erro:** Botão de instalar não aparece
**Solução:**
- Verifique HTTPS (obrigatório)
- Valide manifest.json
- Verifique Service Worker
- Teste em modo anônimo

### Site Lento
**Solução:**
- Otimize imagens
- Reduza bundle size
- Use lazy loading
- Configure cache

---

## 📚 Recursos Úteis

### Documentação
- **Vercel:** https://vercel.com/docs
- **Railway:** https://docs.railway.app
- **Render:** https://render.com/docs
- **PWA:** https://web.dev/progressive-web-apps

### Ferramentas
- **Lighthouse:** Teste PWA (Chrome DevTools)
- **PWA Builder:** https://www.pwabuilder.com
- **Manifest Validator:** https://manifest-validator.appspot.com

---

## 🎉 Pronto!

Seu site estará no ar em minutos, 100% grátis, com PWA instalável!

**Próximos Passos:**
1. Escolha Vercel (recomendado)
2. Conecte GitHub
3. Deploy
4. Compartilhe a URL!

**Quando tiver $25, você pode publicar na Play Store usando o guia anterior!**

---

**Boa sorte! 🚀**

**Versão:** 1.0
**Data:** 07/05/2026
