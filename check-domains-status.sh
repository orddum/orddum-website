#!/bin/bash

echo "🔍 Verificação Detalhada dos Domínios Orddum"
echo "============================================="
echo ""

echo "📊 STATUS ATUAL:"
echo ""

echo "1. orddum.com (domínio raiz):"
echo "   DNS: $(nslookup orddum.com 2>/dev/null | grep 'Address:' | head -1 | awk '{print $2}')"
echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" https://orddum.com 2>/dev/null)"
echo "   Servidor: $(curl -I https://orddum.com 2>/dev/null | grep 'server:' | head -1)"
echo ""

echo "2. www.orddum.com:"
echo "   DNS: $(nslookup www.orddum.com 2>/dev/null | grep 'canonical name' | head -1)"
echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" http://www.orddum.com 2>/dev/null)"
echo "   Redirecionamento: $(curl -I http://www.orddum.com 2>/dev/null | grep 'Location:' | head -1)"
echo ""

echo "3. orddum.web.app (Firebase):"
echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" https://orddum.web.app 2>/dev/null)"
echo "   Servidor: $(curl -I https://orddum.web.app 2>/dev/null | grep 'x-served-by:' | head -1)"
echo ""

echo "🔧 PROBLEMAS IDENTIFICADOS:"
echo ""

# Verificar orddum.com
if curl -s https://orddum.com | grep -q "Coming Soon"; then
    echo "❌ orddum.com: Ainda no Squarespace (página 'Coming Soon')"
    echo "   → Precisa configurar registros A no Squarespace"
else
    echo "✅ orddum.com: Não está mais no Squarespace"
fi

# Verificar www.orddum.com
if nslookup www.orddum.com 2>/dev/null | grep -q "orddum.web.app"; then
    echo "✅ www.orddum.com: DNS configurado corretamente"
else
    echo "❌ www.orddum.com: DNS não configurado"
fi

# Verificar SSL
if curl -I https://www.orddum.com 2>/dev/null | grep -q "200"; then
    echo "✅ www.orddum.com: HTTPS funcionando"
else
    echo "❌ www.orddum.com: Problema com SSL"
fi

echo ""
echo "📋 AÇÕES NECESSÁRIAS:"
echo ""

echo "1. No Squarespace (orddum.com):"
echo "   - Adicionar registros A:"
echo "     Nome: @"
echo "     Valor: 151.101.1.195"
echo "     Valor: 151.101.65.195"
echo ""

echo "2. No Firebase Console:"
echo "   - Acessar: https://console.firebase.google.com/project/orddum/hosting"
echo "   - Adicionar domínio personalizado: orddum.com"
echo "   - Adicionar domínio personalizado: www.orddum.com"
echo ""

echo "3. Verificar SSL:"
echo "   - Aguardar certificado SSL ser emitido pelo Firebase"
echo "   - Pode levar até 24 horas"
echo ""

echo "✅ Verificação concluída!" 