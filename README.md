# 🏥 PlanoCerto - Plataforma de Comparação de Planos de Saúde

> Compare planos de saúde para MEI e autônomos brasileiros. Gratuito, rápido e completo.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)

---

## ✨ Funcionalidades

### 🎯 Core Features
- ✅ **Busca por Preço** - Encontre planos dentro do seu orçamento
- ✅ **Recomendação Inteligente** - IA sugere o melhor plano para você
- ✅ **Comparação** - Compare até 3 planos lado a lado
- ✅ **Favoritos** - Salve seus planos preferidos
- ✅ **Calculadora de Economia** - Veja quanto você economiza
- ✅ **Simulador de Uso** - Descubra o melhor tipo de plano

### 💰 Monetização
- ✅ **Sistema de Pagamentos** - Stripe, Mercado Pago, PagSeguro
- ✅ **Planos Premium** - R$ 19,90/mês ou R$ 199,90/ano
- ✅ **Comissões** - Rastreamento automático de conversões
- ✅ **Anúncios** - Banner para usuários gratuitos

### 🤖 IA e Automação
- ✅ **Chatbot IA** - Assistente virtual inteligente
- ✅ **Alertas de Preço** - Notificações de mudanças
- ✅ **Recomendações Personalizadas** - Baseadas no perfil

### 📊 Analytics e Admin
- ✅ **Dashboard Administrativo** - Gestão de comissões
- ✅ **Analytics** - Rastreamento de eventos
- ✅ **Reviews** - Sistema de avaliações
- ✅ **Newsletter** - Captação de leads

### 🎨 UX/UI
- ✅ **Dark Mode** - Tema claro e escuro
- ✅ **PWA** - Instalável como app
- ✅ **Responsivo** - Mobile-first design
- ✅ **Acessibilidade** - WCAG 2.1 AA compliant

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/planocerto.git
cd planocerto

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas chaves

# Setup do banco de dados
npm run db:setup

# Inicie o desenvolvimento
npm run dev:all
```

Acesse:
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

---

## 📦 Estrutura do Projeto

```
planocerto/
├── src/                      # Frontend (React + TanStack Router)
│   ├── components/          # Componentes React
│   ├── routes/              # Páginas
│   ├── lib/                 # Utilitários
│   └── data/                # Dados estáticos
├── server/                   # Backend (Node.js + Express)
│   ├── routes/              # Endpoints da API
│   ├── middleware/          # Middlewares
│   ├── services/            # Serviços (email, etc)
│   └── db/                  # Banco de dados
├── public/                   # Assets estáticos
└── docs/                     # Documentação
```

---

## 🔧 Tecnologias

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - Routing
- **Tailwind CSS** - Styling
- **Radix UI** - Components
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Stripe** - Payments
- **SendGrid** - Emails

### DevOps
- **Vite** - Build tool
- **Vitest** - Testing
- **ESLint** - Linting
- **Prettier** - Formatting

---

## 💳 Configuração de Pagamentos

### Stripe
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Mercado Pago
```env
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-...
MERCADOPAGO_ACCESS_TOKEN=TEST-...
```

Veja [GUIA-DEPLOY.md](./GUIA-DEPLOY.md) para instruções completas.

---

## 📊 Planos e Preços

| Plano | Preço | Recursos |
|-------|-------|----------|
| **Gratuito** | R$ 0/mês | Busca básica, comparação de 3 planos |
| **Premium** | R$ 19,90/mês | Alertas ilimitados, sem anúncios, consultoria |
| **Premium Anual** | R$ 199,90/ano | Tudo do Premium + 2 meses grátis |

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Com coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

---

## 🚀 Deploy

### Vercel (Frontend)
```bash
vercel --prod
```

### Railway (Backend)
```bash
# Conectar repositório no dashboard
# Deploy automático
```

Veja [GUIA-DEPLOY.md](./GUIA-DEPLOY.md) para mais opções.

---

## 📈 Roadmap

### Q1 2025
- [ ] Integração com mais operadoras
- [ ] App mobile nativo (React Native)
- [ ] Sistema de afiliados
- [ ] Relatórios em PDF

### Q2 2025
- [ ] Marketplace de corretores
- [ ] Comparação de planos odontológicos
- [ ] Integração com telemedicina
- [ ] API pública

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para mais detalhes.

---

## 📞 Contato

- **Website**: https://planocerto.com.br
- **Email**: contato@planocerto.com.br
- **WhatsApp**: (11) 93953-7040

---

## 🙏 Agradecimentos

- Operadoras parceiras
- Comunidade open source
- Todos os contribuidores

---

## 📚 Documentação

- [GUIA-DEPLOY.md](./GUIA-DEPLOY.md) - Guia completo de deploy
- [SISTEMA-PAGAMENTOS.md](./SISTEMA-PAGAMENTOS.md) - Documentação do sistema de pagamentos
- [COMPLETO-FINAL.md](./COMPLETO-FINAL.md) - Lista completa de funcionalidades

---

**Feito com ❤️ para MEIs e autônomos brasileiros**
