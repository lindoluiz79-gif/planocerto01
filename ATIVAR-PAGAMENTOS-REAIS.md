# 💳 COMO ATIVAR PAGAMENTOS REAIS

## ⚠️ SITUAÇÃO ATUAL:

**Modo**: Desenvolvimento (Simulação)  
**Comportamento**: Ao clicar em "Assinar", o usuário vira Premium instantaneamente **SEM COBRANÇA**

---

## 🎯 POR QUE ISSO ACONTECE?

O sistema está configurado para **simular pagamentos** durante o desenvolvimento, permitindo testar todas as funcionalidades sem precisar de cartão de crédito real.

**Código atual** (`src/routes/premium.tsx`):
```typescript
// Detecta se está em desenvolvimento
const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (isDevelopment) {
  // SIMULAÇÃO: Ativa Premium sem cobrar
  await payments.simulatePayment(planId, user.id);
} else {
  // PRODUÇÃO: Redireciona para Stripe (pagamento real)
  window.location.href = stripeCheckoutUrl;
}
```

---

## ✅ COMO ATIVAR PAGAMENTOS REAIS:

### Passo 1: Criar Conta no Stripe

1. Acesse: https://dashboard.stripe.com/register
2. Crie uma conta
3. Complete o cadastro

### Passo 2: Obter Chaves de API

**Modo Teste** (para testar com cartões falsos):
1. Vá em: Dashboard > Developers > API Keys
2. Copie:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

**Modo Produção** (pagamentos reais):
1. Ative sua conta no Stripe
2. Vá em: Dashboard > Developers > API Keys
3. Ative "View live data"
4. Copie:
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...`

### Passo 3: Configurar Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Frontend
VITE_STRIPE_PUBLIC_KEY=pk_test_51xxxxx  # ou pk_live_51xxxxx

# Backend (se estiver rodando)
STRIPE_SECRET_KEY=sk_test_51xxxxx  # ou sk_live_51xxxxx
```

### Passo 4: Reiniciar Aplicação

```bash
# Parar servidor (Ctrl+C)

# Iniciar novamente
npm run dev:all
```

### Passo 5: Testar

1. Acesse: http://localhost:8080/premium
2. Clique em "Assinar Agora"
3. Você será redirecionado para o **Stripe Checkout**
4. Use cartão de teste:
   - **Número**: 4242 4242 4242 4242
   - **Data**: Qualquer data futura
   - **CVV**: Qualquer 3 dígitos

---

## 🧪 CARTÕES DE TESTE (Stripe):

### Sucesso:
- `4242 4242 4242 4242` - Pagamento aprovado

### Falha:
- `4000 0000 0000 0002` - Cartão recusado
- `4000 0000 0000 9995` - Fundos insuficientes

### 3D Secure:
- `4000 0027 6000 3184` - Requer autenticação

**Mais cartões**: https://stripe.com/docs/testing

---

## 🚀 COLOCAR EM PRODUÇÃO:

### 1. Backend em Produção

Certifique-se que o backend está rodando:
- Railway: https://railway.app
- Heroku: https://heroku.com
- Vercel: https://vercel.com

### 2. Configurar Webhooks

**O que são webhooks?**
São notificações que o Stripe envia quando algo acontece (pagamento aprovado, assinatura cancelada, etc).

**Como configurar:**

1. Acesse: Dashboard > Developers > Webhooks
2. Clique em "Add endpoint"
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copie o **Signing secret**: `whsec_...`
6. Adicione no `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 3. Ativar Modo Live

1. No Stripe Dashboard, ative "View live data"
2. Use chaves `pk_live_` e `sk_live_`
3. Configure webhooks para produção
4. Teste com cartão real

---

## 📊 FLUXO COMPLETO:

### Desenvolvimento (Atual):
```
Usuário clica "Assinar"
    ↓
Sistema detecta: isDevelopment = true
    ↓
Simula pagamento (sem cobrar)
    ↓
Marca usuário como Premium
    ↓
Redireciona para /payment-success
```

### Produção (Com Stripe):
```
Usuário clica "Assinar"
    ↓
Sistema detecta: isDevelopment = false
    ↓
Cria checkout session no Stripe
    ↓
Redireciona para Stripe Checkout
    ↓
Usuário preenche dados do cartão
    ↓
Stripe processa pagamento
    ↓
Stripe envia webhook para backend
    ↓
Backend marca usuário como Premium
    ↓
Usuário é redirecionado para /payment-success
```

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO:

### Modo Desenvolvimento:
- ✅ Aviso amarelo aparece na página Premium
- ✅ Toast mostra "MODO DESENVOLVIMENTO"
- ✅ Assinatura é instantânea

### Modo Produção:
- ✅ Aviso amarelo NÃO aparece
- ✅ Redireciona para Stripe
- ✅ Mostra formulário de pagamento
- ✅ Requer cartão real

---

## 💡 DICAS:

### Para Testar Localmente com Stripe:

1. **Instale Stripe CLI**:
   ```bash
   # Windows
   scoop install stripe
   
   # Mac
   brew install stripe/stripe-cli/stripe
   ```

2. **Login**:
   ```bash
   stripe login
   ```

3. **Forward webhooks**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Teste pagamentos** com cartões de teste

### Para Debug:

1. **Ver logs do Stripe**:
   - Dashboard > Developers > Logs

2. **Ver eventos**:
   - Dashboard > Developers > Events

3. **Ver webhooks**:
   - Dashboard > Developers > Webhooks > Ver tentativas

---

## ⚠️ IMPORTANTE:

### Nunca Commite:
- ❌ Chaves secretas (`sk_test_` ou `sk_live_`)
- ❌ Webhook secrets (`whsec_`)
- ❌ Arquivo `.env`

### Sempre Use:
- ✅ Variáveis de ambiente
- ✅ `.env.example` (sem valores reais)
- ✅ `.gitignore` incluindo `.env`

---

## 🎯 CHECKLIST DE PRODUÇÃO:

- [ ] Conta Stripe criada e ativada
- [ ] Chaves de produção obtidas (`pk_live_`, `sk_live_`)
- [ ] Variáveis configuradas no `.env`
- [ ] Backend em produção rodando
- [ ] Webhooks configurados
- [ ] Testado com cartão de teste
- [ ] Testado com cartão real (pequeno valor)
- [ ] Logs do Stripe verificados
- [ ] Fluxo completo funcionando

---

## 📞 SUPORTE:

### Documentação Stripe:
- Início: https://stripe.com/docs
- Checkout: https://stripe.com/docs/payments/checkout
- Webhooks: https://stripe.com/docs/webhooks
- Testes: https://stripe.com/docs/testing

### Problemas Comuns:

**"Webhook signature verification failed"**
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Use Stripe CLI para testar localmente

**"Invalid API Key"**
- Verifique se está usando a chave correta (test vs live)
- Verifique se não tem espaços extras

**"Checkout session not found"**
- Verifique se o backend está rodando
- Verifique se a URL da API está correta

---

## 🎉 RESUMO:

**Agora você sabe:**
- ✅ Por que está simulando (modo desenvolvimento)
- ✅ Como ativar pagamentos reais (Stripe)
- ✅ Como testar com cartões de teste
- ✅ Como colocar em produção
- ✅ Como debugar problemas

**Para ativar pagamentos reais:**
1. Criar conta Stripe
2. Obter chaves de API
3. Configurar `.env`
4. Reiniciar aplicação
5. Testar!

---

**Desenvolvido com ❤️ para facilitar sua vida!**
