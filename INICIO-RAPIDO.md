# ⚡ INÍCIO RÁPIDO - 5 MINUTOS

## 🚀 Coloque o PlanoCerto no ar em 5 minutos!

---

## 📋 PRÉ-REQUISITOS:

- ✅ Node.js 20+ instalado
- ✅ Conta no Supabase (grátis) - https://supabase.com
- ✅ 5 minutos do seu tempo

---

## 🎯 PASSO A PASSO:

### 1️⃣ Instalar Dependências (1 min)

```bash
npm install
```

---

### 2️⃣ Configurar Banco de Dados (2 min)

**Opção A: Supabase (Recomendado - Grátis)**

1. Acesse https://supabase.com
2. Crie uma conta (grátis)
3. Crie um novo projeto
4. Vá em "Project Settings" > "Database"
5. Copie a "Connection string" (URI)
6. Cole no arquivo `.env`:

```env
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@[SEU-HOST]:5432/postgres
```

7. Vá em "SQL Editor" no Supabase
8. Cole o conteúdo de `server/db/schema.sql`
9. Clique em "Run"

**Opção B: PostgreSQL Local**

```bash
# Criar banco
createdb planocerto

# Rodar schema
psql planocerto < server/db/schema.sql
```

---

### 3️⃣ Configurar Variáveis (1 min)

```bash
# Copiar exemplo
cp .env.example .env
```

Edite `.env` e adicione:

```env
# Obrigatório
DATABASE_URL=sua-url-do-supabase
JWT_SECRET=qualquer-texto-aleatorio-aqui-123456

# Opcional (pode deixar em branco por enquanto)
VITE_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
SENDGRID_API_KEY=
```

---

### 4️⃣ Iniciar Aplicação (1 min)

```bash
# Iniciar frontend + backend
npm run dev:all
```

Aguarde aparecer:
```
🚀 Servidor rodando na porta 3000
✅ Conectado ao banco de dados PostgreSQL
```

---

### 5️⃣ Acessar! (0 min)

Abra no navegador:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3000/health

---

## ✅ PRONTO!

Seu PlanoCerto está rodando! 🎉

---

## 🧪 TESTAR:

### Criar Conta:
1. Acesse http://localhost:8080
2. Clique em "Entrar"
3. Clique em "Criar conta"
4. Preencha os dados
5. Pronto! Você está logado

### Testar Funcionalidades:
- ✅ Buscar planos por preço
- ✅ Comparar planos
- ✅ Adicionar favoritos
- ✅ Usar calculadora
- ✅ Chat com IA
- ✅ Ver dashboard

---

## 💳 ATIVAR PAGAMENTOS (Opcional):

### Stripe (Modo Teste):

1. Crie conta em https://dashboard.stripe.com/register
2. Vá em "Developers" > "API Keys"
3. Copie as chaves de teste
4. Cole no `.env`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

5. Reinicie o servidor
6. Teste com cartão: `4242 4242 4242 4242`

---

## 📧 ATIVAR EMAILS (Opcional):

### SendGrid (100 emails/dia grátis):

1. Crie conta em https://signup.sendgrid.com/
2. Vá em "Settings" > "API Keys"
3. Crie uma API Key
4. Cole no `.env`:

```env
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@planocerto.com.br
```

5. Reinicie o servidor

---

## 🚀 DEPLOY (Opcional):

### Vercel (Frontend - Grátis):

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Railway (Backend - $5 crédito grátis):

1. Acesse https://railway.app
2. Conecte seu GitHub
3. Deploy automático
4. Adicione PostgreSQL
5. Configure variáveis de ambiente

---

## 🆘 PROBLEMAS?

### Erro: "Cannot connect to database"
```bash
# Verificar se DATABASE_URL está correto
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL -c "SELECT 1"
```

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Erro: "Module not found"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 PRÓXIMOS PASSOS:

1. ✅ Leia `GUIA-DEPLOY.md` para deploy em produção
2. ✅ Leia `SISTEMA-PAGAMENTOS.md` para configurar pagamentos
3. ✅ Leia `IMPLEMENTACAO-COMPLETA.md` para entender tudo

---

## 💡 DICAS:

### Desenvolvimento:
```bash
# Apenas frontend
npm run dev

# Apenas backend
npm run dev:server

# Ambos
npm run dev:all
```

### Testes:
```bash
# Testar API
bash scripts/test-api.sh

# Rodar testes
npm test
```

### Banco de Dados:
```bash
# Resetar banco
psql $DATABASE_URL -f server/db/schema.sql

# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## 🎉 SUCESSO!

Você tem o PlanoCerto rodando localmente!

Agora explore as funcionalidades e quando estiver pronto, faça o deploy em produção seguindo o `GUIA-DEPLOY.md`.

**Boa sorte! 🚀**

---

## 📞 AJUDA:

- 📖 Documentação completa: `GUIA-DEPLOY.md`
- 💰 Sistema de pagamentos: `SISTEMA-PAGAMENTOS.md`
- 🔧 Implementação: `IMPLEMENTACAO-COMPLETA.md`
- 📝 Visão geral: `README.md`
