#!/bin/bash

echo "🔍 Comparando orddum.web.app vs orddum.firebaseapp.com"
echo "=================================================="
echo ""

echo "1. Verificando headers HTTP:"
echo "--- orddum.web.app ---"
curl -I https://orddum.web.app 2>/dev/null | grep -E "(HTTP|etag|last-modified|cache-control)"
echo ""
echo "--- orddum.firebaseapp.com ---"
curl -I https://orddum.firebaseapp.com 2>/dev/null | grep -E "(HTTP|etag|last-modified|cache-control)"
echo ""

echo "2. Verificando tamanho do conteúdo:"
WEBAPP_SIZE=$(curl -s https://orddum.web.app | wc -c)
FIREBASEAPP_SIZE=$(curl -s https://orddum.firebaseapp.com | wc -c)
echo "orddum.web.app: $WEBAPP_SIZE bytes"
echo "orddum.firebaseapp.com: $FIREBASEAPP_SIZE bytes"
echo ""

echo "3. Verificando se há diferenças no conteúdo:"
if diff <(curl -s https://orddum.web.app) <(curl -s https://orddum.firebaseapp.com) > /dev/null; then
    echo "✅ Nenhuma diferença encontrada no conteúdo"
else
    echo "❌ Diferenças encontradas no conteúdo"
    diff <(curl -s https://orddum.web.app) <(curl -s https://orddum.firebaseapp.com)
fi
echo ""

echo "4. Verificando tempo de resposta:"
echo "orddum.web.app:"
time curl -s https://orddum.web.app > /dev/null
echo ""
echo "orddum.firebaseapp.com:"
time curl -s https://orddum.firebaseapp.com > /dev/null
echo ""

echo "✅ Comparação concluída!" 