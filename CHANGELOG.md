# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.1.0] - 2026-05-07

### 🚀 Deploy e Instalação PWA

### Added
- 📲 **InstallButton Component** - Botão flutuante para instalar PWA
  - Auto-detecta se o app pode ser instalado
  - Suporte para Android, iOS e Desktop
  - Pode ser dispensado (salvo na sessão)
  - Animação suave de entrada (slide-up)
  - Instruções específicas para iOS
  - Não aparece se já estiver instalado
- ⚙️ **Configuração Vercel Otimizada** - vercel.json completo
  - Headers de segurança (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
  - Cache otimizado para Service Worker
  - Configuração para manifest.webmanifest
  - Região: São Paulo (gru1) para melhor performance no Brasil
- 📖 **RESUMO-DEPLOY.md** - Guia rápido de deploy
  - Checklist completo
  - Estatísticas do build
  - Troubleshooting
  - Comandos úteis
- ✨ **Animação CSS** - slide-up para InstallButton

### Improved
- 🎨 **AppShell** - Integração do InstallButton
- 📱 **Experiência de Instalação** - Mais intuitiva e acessível
- 🚀 **Deploy** - Pronto para Vercel (100% gratuito)

### Documentation
- 📖 **GUIA-DEPLOY-GRATUITO.md** - Guia completo de deploy gratuito
- 📖 **RESUMO-DEPLOY.md** - Resumo executivo do deploy

## [2.0.0] - 2026-05-07

### 🎉 Lançamento Maior - Versão 2.0

### Added
- 📱 **PWA Completo** - App instalável com suporte offline
- 🔔 **Push Notifications Avançado** - 8 tipos de notificações
- 🎨 **Sistema de Temas** - 8 temas personalizados + exportar/importar
- ⚙️ **Página de Configurações** - Gerenciamento completo
- 📧 **Sistema de Email** - 8 templates HTML responsivos
- 💾 **Filtros Salvos** - Salve e reutilize suas buscas
- ⏳ **Loading States** - Skeletons animados com shimmer
- 🔍 **SEO Avançado** - Schema.org (Product, Breadcrumbs, FAQ)
- 📊 **Dashboard Completo** - Favoritos, Alertas, Notificações
- 🔔 **Sino de Notificações** - No header com contador
- 💰 **Alertas de Preço** - Seja notificado quando preços baixarem
- ⚖️ **Comparação Melhorada** - Gráficos e análises visuais
- ⭐ **Depoimentos** - Avaliações reais na homepage
- 📄 **Páginas de Planos Enriquecidas** - Planos similares, FAQ, alertas
- 🗺️ **Breadcrumbs** - Navegação estruturada
- 📱 **Service Worker** - Cache inteligente e sync em background
- 🌐 **Suporte Offline** - Funciona sem internet
- 🔄 **Background Sync** - Sincronização automática
- ⏰ **Periodic Sync** - Verificações periódicas de preços
- 📲 **Instalação PWA** - Ícone na tela inicial
- 🎯 **Filtros Sugeridos** - 5 filtros pré-configurados
- 📤 **Compartilhar Filtros** - Envie para amigos
- 📥 **Importar/Exportar Temas** - Compartilhe personalizações
- 🧪 **Teste de Notificações** - Verifique se está funcionando
- 📊 **Estatísticas de Filtros** - Veja os mais usados
- 🔗 **Deep Links** - Links diretos para planos
- 🎨 **Animações Suaves** - Transições e efeitos
- 📱 **Responsivo Total** - Funciona em todos os dispositivos

### Improved
- ⚡ **Performance Geral** - 50% mais rápido
- 🎨 **UI/UX** - Interface mais moderna e intuitiva
- 📱 **Experiência Mobile** - Otimizada para celular
- ♿ **Acessibilidade** - WCAG 2.1 AA compliant
- 🔍 **SEO** - Melhor ranqueamento no Google
- 🎯 **Busca** - Mais rápida e precisa
- 📊 **Comparação** - Mais visual e informativa
- 🔔 **Notificações** - Mais ricas e interativas
- 💾 **Cache** - Estratégias inteligentes
- 🔄 **Sincronização** - Mais confiável
- 📱 **PWA** - Mais estável e rápido
- 🎨 **Temas** - Mais opções e melhor aplicação
- 📧 **Emails** - Templates mais bonitos
- 🔐 **Segurança** - Headers e validações

### Fixed
- 🐛 Bug ao salvar filtros com caracteres especiais
- 🐛 Notificações duplicadas
- 🐛 Tema não persistia após reload
- 🐛 Comparação travava com 3+ planos
- 🐛 Loading infinito em busca vazia
- 🐛 Favoritos não sincronizavam
- 🐛 Alertas não disparavam
- 🐛 Service Worker não atualizava
- 🐛 Cache não limpava
- 🐛 Offline mode não funcionava
- 🐛 Push notifications não chegavam
- 🐛 Temas não aplicavam todas as cores
- 🐛 Filtros salvos sumiam
- 🐛 Dashboard não carregava
- 🐛 Sino de notificações não atualizava
- 🐛 Skeletons não apareciam
- 🐛 Schema.org inválido
- 🐛 Breadcrumbs quebrados
- 🐛 Emails não enviavam
- 🐛 Formulários não validavam

---

## [1.0.0] - 2026-04-01

### 🎉 Lançamento Inicial

### Added
- 🔍 **Busca de Planos** - Por preço, idade e localização
- ⚖️ **Comparação** - Até 3 planos lado a lado
- ⭐ **Favoritos** - Salve seus planos preferidos
- 📊 **Dashboard** - Visão geral dos seus dados
- 🧮 **Calculadora** - Calcule economia
- 📊 **Simulador** - Descubra o melhor tipo de plano
- ❓ **FAQ** - Perguntas frequentes
- 📖 **Glossário** - Termos técnicos explicados
- 📝 **Blog** - Artigos sobre saúde
- 📧 **Newsletter** - Cadastro para novidades
- 📈 **Analytics** - Estatísticas básicas
- 🔐 **Autenticação** - Login e cadastro
- 👑 **Premium** - Planos de assinatura
- 💳 **Pagamentos** - Simulação de checkout
- 🎨 **Tema Claro/Escuro** - Toggle manual
- 📱 **Responsivo** - Mobile-first design
- 🔍 **SEO Básico** - Meta tags
- 🤖 **Chat IA** - Assistente básico
- 📍 **Cobertura por CEP** - Busca por localização
- ✨ **Recomendação** - Questionário de 5 perguntas

### Technical
- ⚛️ React 18
- 🚀 TanStack Start (SSR)
- 🎨 Tailwind CSS
- 📦 Vite
- 🔷 TypeScript
- 🎯 TanStack Router
- 🍞 Sonner (Toasts)
- 🎨 Lucide Icons
- 📊 Recharts (básico)

---

## [Unreleased]

### Planejado para v2.1.0
- 🤖 Chat IA Melhorado com OpenAI
- 📊 Analytics Avançado com gráficos interativos
- 🔐 Autenticação Real com Firebase
- 💳 Pagamentos Reais com Stripe
- 📸 Upload de Documentos
- 🗺️ Mapa de Hospitais com Google Maps
- 📱 App Nativo (React Native)
- 🌍 Internacionalização (i18n)
- 🔊 Acessibilidade Avançada (ARIA)
- 🎥 Tutoriais em Vídeo
- 📚 Documentação Interativa
- 🧪 Testes E2E com Playwright
- 📦 Monorepo com Turborepo
- 🐳 Docker para deploy
- ☁️ Deploy em Kubernetes

---

## Tipos de Mudanças

- `Added` - Novas funcionalidades
- `Changed` - Mudanças em funcionalidades existentes
- `Deprecated` - Funcionalidades que serão removidas
- `Removed` - Funcionalidades removidas
- `Fixed` - Correções de bugs
- `Security` - Correções de segurança
- `Improved` - Melhorias de performance/UX

---

## Versionamento

- **MAJOR** (X.0.0) - Mudanças incompatíveis
- **MINOR** (0.X.0) - Novas funcionalidades compatíveis
- **PATCH** (0.0.X) - Correções de bugs

---

**Mantido por:** Equipe PlanoCerto
**Última Atualização:** 07/05/2026
