#!/bin/bash

# Script de Setup para Android - PlanoCerto
# Este script automatiza a criação do app Android

echo "🚀 PlanoCerto - Setup Android"
echo "================================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em https://nodejs.org"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar Java
if ! command -v java &> /dev/null; then
    echo "❌ Java não encontrado. Instale JDK 11+ em https://adoptium.net"
    exit 1
fi

echo "✅ Java encontrado: $(java --version | head -n 1)"

# Instalar Bubblewrap
echo ""
echo "📦 Instalando Bubblewrap CLI..."
npm install -g @bubblewrap/cli

if [ $? -eq 0 ]; then
    echo "✅ Bubblewrap instalado com sucesso!"
else
    echo "❌ Erro ao instalar Bubblewrap"
    exit 1
fi

# Criar diretório para o projeto Android
echo ""
echo "📁 Criando diretório do projeto Android..."
mkdir -p planocerto-android
cd planocerto-android

echo "✅ Diretório criado: planocerto-android/"

# Instruções finais
echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Certifique-se de que seu PWA está hospedado em HTTPS"
echo "   URL: https://planocerto.com.br"
echo ""
echo "2. Execute o comando de inicialização:"
echo "   cd planocerto-android"
echo "   bubblewrap init --manifest https://planocerto.com.br/manifest.webmanifest"
echo ""
echo "3. Gere a keystore de assinatura:"
echo "   keytool -genkey -v -keystore planocerto.keystore -alias planocerto -keyalg RSA -keysize 2048 -validity 10000"
echo ""
echo "4. Build do app:"
echo "   bubblewrap build"
echo ""
echo "5. Teste o APK:"
echo "   adb install app-release-signed.apk"
echo ""
echo "6. Upload do AAB na Play Store:"
echo "   Arquivo: app-release-bundle.aab"
echo ""
echo "📖 Leia o GUIA-PLAY-STORE.md para instruções detalhadas!"
echo ""
