# ✅ Checklist de Testes - PlanoCerto

## 📋 Testes Funcionais (50 itens)

### Autenticação
- [ ] Criar conta com email válido
- [ ] Criar conta com email inválido (deve falhar)
- [ ] Login com credenciais corretas
- [ ] Login com credenciais incorretas (deve falhar)
- [ ] Logout funciona
- [ ] Recuperação de senha
- [ ] Verificação de email

### Busca de Planos
- [ ] Buscar planos com todos os campos preenchidos
- [ ] Buscar sem preencher idade (deve validar)
- [ ] Buscar sem preencher cidade (deve validar)
- [ ] Buscar sem preencher orçamento (deve validar)
- [ ] Filtrar por operadora
- [ ] Filtrar por cobertura odontológica
- [ ] Filtrar por aceita dependentes
- [ ] Ordenar por preço
- [ ] Ordenar por avaliação
- [ ] Ordenar por popularidade
- [ ] Resultados aparecem corretamente
- [ ] Loading states aparecem durante busca
- [ ] Mensagem quando nenhum plano encontrado

### Comparação
- [ ] Adicionar plano à comparação
- [ ] Adicionar até 3 planos
- [ ] Tentar adicionar 4º plano (deve avisar limite)
- [ ] Remover plano da comparação
- [ ] Ver comparação lado a lado
- [ ] Gráficos de preço aparecem
- [ ] Gráficos de avaliação aparecem
- [ ] Melhor plano destacado
- [ ] Compartilhar comparação
- [ ] Exportar comparação

### Favoritos
- [ ] Marcar plano como favorito
- [ ] Desmarcar favorito
- [ ] Ver lista de favoritos no dashboard
- [ ] Favoritos persistem após logout/login
- [ ] Remover favorito do dashboard

### Alertas de Preço
- [ ] Criar alerta com preço válido
- [ ] Tentar criar alerta com preço maior que atual (deve falhar)
- [ ] Ver alertas no dashboard
- [ ] Ativar/desativar alerta
- [ ] Deletar alerta
- [ ] Receber notificação quando preço baixa
- [ ] Limite de 3 alertas (gratuito)

### Filtros Salvos
- [ ] Salvar filtro com nome
- [ ] Ver filtros salvos
- [ ] Usar filtro salvo
- [ ] Duplicar filtro
- [ ] Compartilhar filtro
- [ ] Deletar filtro
- [ ] Filtros sugeridos aparecem
- [ ] Criar filtro sugerido

### Notificações
- [ ] Solicitar permissão de notificações
- [ ] Receber notificação de teste
- [ ] Ver notificações no sino
- [ ] Contador de não lidas correto
- [ ] Marcar notificação como lida
- [ ] Marcar todas como lidas
- [ ] Deletar notificação

### Temas
- [ ] Trocar tema
- [ ] Tema persiste após reload
- [ ] Exportar tema
- [ ] Importar tema
- [ ] Todos os 8 temas funcionam

---

## 🎨 Testes de Usabilidade (20 itens)

- [ ] Navegação intuitiva
- [ ] Botões claramente identificados
- [ ] Feedback visual em ações
- [ ] Mensagens de erro claras
- [ ] Mensagens de sucesso aparecem
- [ ] Loading states informativos
- [ ] Formulários fáceis de preencher
- [ ] Labels descritivos
- [ ] Placeholders úteis
- [ ] Ícones reconhecíveis
- [ ] Cores contrastantes
- [ ] Texto legível
- [ ] Espaçamento adequado
- [ ] Hierarquia visual clara
- [ ] Call-to-actions destacados
- [ ] Menu fácil de encontrar
- [ ] Busca rápida e eficiente
- [ ] Comparação intuitiva
- [ ] Dashboard organizado
- [ ] Configurações acessíveis

---

## ⚡ Testes de Performance (15 itens)

- [ ] Página inicial carrega em < 2s
- [ ] Busca retorna resultados em < 1s
- [ ] Comparação carrega em < 1s
- [ ] Dashboard carrega em < 1s
- [ ] Troca de tema instantânea
- [ ] Navegação entre páginas fluida
- [ ] Scroll suave
- [ ] Animações sem lag
- [ ] Imagens otimizadas
- [ ] Bundle size < 500KB
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Score > 90
- [ ] Sem memory leaks
- [ ] CPU usage normal

---

## 🔒 Testes de Segurança (10 itens)

- [ ] Senhas são hasheadas
- [ ] Tokens expiram
- [ ] HTTPS em produção
- [ ] XSS protection
- [ ] CSRF protection
- [ ] SQL injection protection
- [ ] Rate limiting em APIs
- [ ] Validação de inputs
- [ ] Sanitização de dados
- [ ] Headers de segurança corretos

---

## ♿ Testes de Acessibilidade (15 itens)

- [ ] Navegação por teclado funciona
- [ ] Tab order lógico
- [ ] Focus visível
- [ ] Alt text em imagens
- [ ] Labels em inputs
- [ ] ARIA labels corretos
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Texto redimensionável
- [ ] Sem dependência de cor apenas
- [ ] Leitor de tela funciona
- [ ] Formulários acessíveis
- [ ] Botões descritivos
- [ ] Links descritivos
- [ ] Headings hierárquicos
- [ ] Lighthouse Accessibility > 90

---

## 📱 Testes de PWA (10 itens)

- [ ] Manifest.json válido
- [ ] Service Worker registra
- [ ] App instalável
- [ ] Ícones corretos
- [ ] Splash screen aparece
- [ ] Funciona offline
- [ ] Cache funciona
- [ ] Sync em background
- [ ] Push notifications funcionam
- [ ] Lighthouse PWA Score = 100

---

## 🔔 Testes de Notificações (8 itens)

- [ ] Permissão solicitada corretamente
- [ ] Notificação de teste funciona
- [ ] Notificação de alerta de preço
- [ ] Notificação de novo plano
- [ ] Notificação de boas-vindas
- [ ] Ações nas notificações funcionam
- [ ] Notificações aparecem no sino
- [ ] Contador atualiza corretamente

---

## 🌐 Testes Cross-Browser (5 navegadores)

### Chrome
- [ ] Todas as funcionalidades
- [ ] PWA instala
- [ ] Notificações funcionam
- [ ] Performance OK

### Firefox
- [ ] Todas as funcionalidades
- [ ] PWA instala
- [ ] Notificações funcionam
- [ ] Performance OK

### Edge
- [ ] Todas as funcionalidades
- [ ] PWA instala
- [ ] Notificações funcionam
- [ ] Performance OK

### Safari (Desktop)
- [ ] Todas as funcionalidades
- [ ] PWA instala
- [ ] Notificações funcionam
- [ ] Performance OK

### Safari (iOS)
- [ ] Todas as funcionalidades
- [ ] PWA instala
- [ ] Notificações funcionam
- [ ] Performance OK

---

## 📱 Testes Mobile (3 dispositivos)

### Android (Chrome)
- [ ] Layout responsivo
- [ ] Touch funciona
- [ ] PWA instala
- [ ] Performance OK

### iOS (Safari)
- [ ] Layout responsivo
- [ ] Touch funciona
- [ ] PWA instala
- [ ] Performance OK

### Tablet
- [ ] Layout responsivo
- [ ] Touch funciona
- [ ] PWA instala
- [ ] Performance OK

---

## 📊 Resumo

**Total de Testes:** 133

**Por Categoria:**
- Funcionais: 50
- Usabilidade: 20
- Performance: 15
- Segurança: 10
- Acessibilidade: 15
- PWA: 10
- Notificações: 8
- Cross-Browser: 20 (5 navegadores × 4 testes)
- Mobile: 12 (3 dispositivos × 4 testes)

**Meta:** 100% dos testes passando antes do deploy

---

**Versão:** 1.0
**Última Atualização:** 07/05/2026
