# 🚀 Criar Repositório Automaticamente

## ⚠️ Você Precisa Fazer Login Primeiro

Infelizmente, não consigo fazer login no GitHub por você (precisa de autenticação).

Mas vou te dar o comando EXATO para criar o repositório automaticamente!

---

## 📋 Passo a Passo (2 minutos)

### 1️⃣ Abrir PowerShell

Abra o PowerShell **nesta pasta** (já está aberto, certo?)

---

### 2️⃣ Fazer Login no GitHub

Cole este comando:

```powershell
gh auth login
```

**Responda:**
1. "What account do you want to log into?" → **GitHub.com**
2. "What is your preferred protocol?" → **HTTPS**
3. "Authenticate Git with your GitHub credentials?" → **Yes**
4. "How would you like to authenticate?" → **Login with a web browser**
5. Copie o código que aparecer
6. Pressione Enter
7. Cole o código no navegador
8. Autorize

✅ **Pronto!** Login feito!

---

### 3️⃣ Criar Repositório e Fazer Push

Cole este comando (tudo de uma vez):

```powershell
gh repo create PlanoCerto01 --public --source=. --remote=origin --push
```

✅ **PRONTO!** Repositório criado e código enviado!

---

## 🎉 Resultado

Seu repositório estará em:
```
https://github.com/SEU-USUARIO/PlanoCerto01
```

---

## 🚀 Próximo Passo: Deploy no Vercel

1. Acesse: https://vercel.com
2. Sign up with GitHub
3. Import PlanoCerto01
4. Deploy

**3 minutos e está no ar!** 🎉

---

## 🆘 Se Der Erro

### Erro: "gh: command not found"

Feche e abra o PowerShell novamente, ou execute:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Erro: "not logged in"

Execute novamente:
```powershell
gh auth login
```

### Erro: "repository already exists"

O repositório já foi criado! Acesse:
```
https://github.com/SEU-USUARIO/PlanoCerto01
```

---

## 📝 Comandos Completos (Copie Tudo)

```powershell
# 1. Fazer login
gh auth login

# 2. Criar repositório e fazer push
gh repo create PlanoCerto01 --public --source=. --remote=origin --push

# 3. Verificar
gh repo view --web
```

---

## ✅ Checklist

- [ ] Abrir PowerShell nesta pasta
- [ ] Executar: `gh auth login`
- [ ] Fazer login no navegador
- [ ] Executar: `gh repo create PlanoCerto01 --public --source=. --remote=origin --push`
- [ ] Verificar no GitHub
- [ ] Deploy no Vercel

---

**Boa sorte! É rápido! 🚀**

---

**Versão:** 1.0  
**Data:** 07/05/2026
