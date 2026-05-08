# Script para criar repositório no GitHub automaticamente
# Uso: .\criar-repo-github.ps1

Write-Host "`n🚀 PlanoCerto - Criar Repositório no GitHub`n" -ForegroundColor Blue

# Atualizar PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verificar se gh está instalado
Write-Host "🔍 Verificando GitHub CLI..." -ForegroundColor Blue
try {
    $ghVersion = gh --version 2>&1
    Write-Host "✅ GitHub CLI instalado: $($ghVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI não encontrado!" -ForegroundColor Red
    Write-Host "`nInstalando GitHub CLI..." -ForegroundColor Yellow
    winget install --id GitHub.cli
    Write-Host "`n⚠️  Feche e abra o PowerShell novamente, depois execute este script." -ForegroundColor Yellow
    exit
}

# Verificar se está logado
Write-Host "`n🔐 Verificando autenticação..." -ForegroundColor Blue
$authStatus = gh auth status 2>&1
if ($authStatus -match "Logged in") {
    Write-Host "✅ Já está logado no GitHub!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Você precisa fazer login no GitHub" -ForegroundColor Yellow
    Write-Host "`nAbrindo processo de login..." -ForegroundColor Blue
    Write-Host "`n📋 Instruções:" -ForegroundColor Cyan
    Write-Host "1. Escolha: GitHub.com"
    Write-Host "2. Protocolo: HTTPS"
    Write-Host "3. Autenticar Git: Yes"
    Write-Host "4. Como autenticar: Login with a web browser"
    Write-Host "5. Copie o código e cole no navegador`n"
    
    gh auth login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Erro ao fazer login" -ForegroundColor Red
        Write-Host "Tente novamente executando: gh auth login" -ForegroundColor Yellow
        exit
    }
}

# Criar repositório
Write-Host "`n📦 Criando repositório PlanoCerto01..." -ForegroundColor Blue

$repoName = "PlanoCerto01"
$description = "Plataforma completa para comparação de planos de saúde - PWA com React, TanStack Start e TypeScript"

Write-Host "`n📋 Configurações:" -ForegroundColor Cyan
Write-Host "   Nome: $repoName"
Write-Host "   Descrição: $description"
Write-Host "   Visibilidade: Public"
Write-Host "   Push automático: Sim`n"

# Criar e fazer push
gh repo create $repoName --public --description $description --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Repositório criado com sucesso!" -ForegroundColor Green
    Write-Host "`n🎉 Seu código está no GitHub!`n" -ForegroundColor Green
    
    # Obter URL do repositório
    $repoUrl = gh repo view --json url -q .url
    Write-Host "📍 URL: $repoUrl`n" -ForegroundColor Cyan
    
    Write-Host "🚀 Próximo passo: Deploy no Vercel" -ForegroundColor Blue
    Write-Host "   1. Acesse: https://vercel.com"
    Write-Host "   2. Sign up with GitHub"
    Write-Host "   3. Import $repoName"
    Write-Host "   4. Deploy`n"
    
    # Perguntar se quer abrir no navegador
    $openBrowser = Read-Host "Deseja abrir o repositório no navegador? (S/N)"
    if ($openBrowser -eq "S" -or $openBrowser -eq "s") {
        gh repo view --web
    }
    
} else {
    Write-Host "`n❌ Erro ao criar repositório" -ForegroundColor Red
    Write-Host "`nPossíveis causas:" -ForegroundColor Yellow
    Write-Host "1. Repositório já existe"
    Write-Host "2. Problemas de autenticação"
    Write-Host "3. Problemas de rede`n"
    
    Write-Host "Tente verificar se o repositório já existe:" -ForegroundColor Cyan
    Write-Host "   gh repo view $repoName --web`n"
}
