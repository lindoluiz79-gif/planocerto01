# Script PowerShell para fazer push do PlanoCerto para o GitHub
# Uso: .\push-to-github.ps1 SEU-USUARIO-GITHUB

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUser
)

$RepoName = "PlanoCerto01"

Write-Host "`n🚀 PlanoCerto - Push para GitHub`n" -ForegroundColor Blue

Write-Host "📋 Configurações:" -ForegroundColor Blue
Write-Host "   Usuário: $GitHubUser"
Write-Host "   Repositório: $RepoName"
Write-Host "   URL: https://github.com/$GitHubUser/$RepoName"
Write-Host ""

# Verificar se já existe remote
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "🔄 Removendo remote existente..." -ForegroundColor Blue
    git remote remove origin
}

# Adicionar remote
Write-Host "🔗 Adicionando remote do GitHub..." -ForegroundColor Blue
git remote add origin "https://github.com/$GitHubUser/$RepoName.git"

# Renomear branch para main
Write-Host "🌿 Renomeando branch para main..." -ForegroundColor Blue
git branch -M main

# Fazer push
Write-Host "📤 Fazendo push para o GitHub...`n" -ForegroundColor Blue
Write-Host "⚠️  Se pedir senha, use seu Personal Access Token!" -ForegroundColor Red
Write-Host "   Crie em: https://github.com/settings/tokens`n"

git push -u origin main

# Verificar se deu certo
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Push realizado com sucesso!`n" -ForegroundColor Green
    Write-Host "🎉 Seu código está no GitHub!`n" -ForegroundColor Green
    Write-Host "📍 Acesse: https://github.com/$GitHubUser/$RepoName`n"
    Write-Host "🚀 Próximo passo: Deploy no Vercel" -ForegroundColor Blue
    Write-Host "   1. Acesse: https://vercel.com"
    Write-Host "   2. Sign up with GitHub"
    Write-Host "   3. Import $RepoName"
    Write-Host "   4. Deploy`n"
} else {
    Write-Host "`n❌ Erro ao fazer push`n" -ForegroundColor Red
    Write-Host "Possíveis soluções:"
    Write-Host "1. Verifique se o repositório existe no GitHub"
    Write-Host "2. Use Personal Access Token em vez de senha"
    Write-Host "3. Ou use GitHub Desktop: https://desktop.github.com`n"
}
