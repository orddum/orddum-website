#!/bin/bash

echo "🔍 Verificando configuração DNS do Squarespace para orddum.com"
echo "============================================================="
echo ""

echo "1. Verificando resolução DNS:"
echo "--- orddum.com ---"
nslookup orddum.com
echo ""
echo "--- www.orddum.com ---"
nslookup www.orddum.com
echo ""

echo "2. Verificando conectividade HTTP:"
echo "--- orddum.com ---"
curl -I http://orddum.com 2>/dev/null | head -5
echo ""
echo "--- https://orddum.com ---"
curl -I https://orddum.com 2>/dev/null | head -5
echo ""

echo "3. Verificando se ainda está no Squarespace:"
SQUARESPACE_CHECK=$(curl -s https://orddum.com | grep -i "squarespace\|coming soon" | head -1)
if [ -n "$SQUARESPACE_CHECK" ]; then
    echo "❌ Ainda apontando para Squarespace: $SQUARESPACE_CHECK"
else
    echo "✅ Não está mais no Squarespace"
fi
echo ""

echo "4. Verificando se está no Firebase:"
FIREBASE_CHECK=$(curl -s https://orddum.com | grep -i "orddum.*desenvolvimento.*aplicativos" | head -1)
if [ -n "$FIREBASE_CHECK" ]; then
    echo "✅ Apontando para Firebase: $FIREBASE_CHECK"
else
    echo "❌ Não está apontando para Firebase ainda"
fi
echo ""

echo "5. Comparando com orddum.web.app:"
if diff <(curl -s https://orddum.com 2>/dev/null) <(curl -s https://orddum.web.app 2>/dev/null) > /dev/null 2>&1; then
    echo "✅ Conteúdo idêntico ao Firebase"
else
    echo "❌ Conteúdo diferente do Firebase"
fi
echo ""

echo "✅ Verificação concluída!"
echo ""
echo "📋 Próximos passos se ainda não funcionar:"
echo "1. Configurar registros A no Squarespace: 151.101.1.195 e 151.101.65.195"
echo "2. Configurar CNAME www -> orddum.web.app"
echo "3. Aguardar propagação DNS (pode levar até 48h)"
echo "4. Adicionar domínio personalizado no Firebase Console" 