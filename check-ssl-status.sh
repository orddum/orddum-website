#!/bin/bash

echo "🔒 Verificação de SSL - Domínios Orddum"
echo "======================================="
echo ""

echo "📊 STATUS SSL ATUAL:"
echo ""

echo "1. www.orddum.com:"
echo "   HTTP Status: $(curl -s -o /dev/null -w "%{http_code}" http://www.orddum.com 2>/dev/null)"
echo "   HTTPS Status: $(curl -s -o /dev/null -w "%{http_code}" https://www.orddum.com 2>/dev/null)"
echo "   SSL Certificate: $(echo | openssl s_client -servername www.orddum.com -connect www.orddum.com:443 2>/dev/null | openssl x509 -noout -subject 2>/dev/null | cut -d'=' -f3- | head -1)"
echo "   SSL Expiry: $(echo | openssl s_client -servername www.orddum.com -connect www.orddum.com:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d'=' -f2)"
echo ""

echo "2. orddum.com:"
echo "   HTTP Status: $(curl -s -o /dev/null -w "%{http_code}" http://orddum.com 2>/dev/null)"
echo "   HTTPS Status: $(curl -s -o /dev/null -w "%{http_code}" https://orddum.com 2>/dev/null)"
echo "   SSL Certificate: $(echo | openssl s_client -servername orddum.com -connect orddum.com:443 2>/dev/null | openssl x509 -noout -subject 2>/dev/null | cut -d'=' -f3- | head -1)"
echo ""

echo "3. orddum.web.app (Firebase):"
echo "   HTTPS Status: $(curl -s -o /dev/null -w "%{http_code}" https://orddum.web.app 2>/dev/null)"
echo "   SSL Certificate: $(echo | openssl s_client -servername orddum.web.app -connect orddum.web.app:443 2>/dev/null | openssl x509 -noout -subject 2>/dev/null | cut -d'=' -f3- | head -1)"
echo ""

echo "🔧 ANÁLISE:"
echo ""

# Verificar se www.orddum.com tem SSL válido
if curl -s -o /dev/null -w "%{http_code}" https://www.orddum.com 2>/dev/null | grep -q "200"; then
    echo "✅ www.orddum.com: HTTPS funcionando"
    
    # Verificar se o certificado é do Firebase
    CERT_ISSUER=$(echo | openssl s_client -servername www.orddum.com -connect www.orddum.com:443 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null | grep -i "google\|firebase" | head -1)
    if [ -n "$CERT_ISSUER" ]; then
        echo "✅ Certificado SSL emitido pelo Firebase/Google"
    else
        echo "⚠️  Certificado SSL não é do Firebase"
    fi
else
    echo "❌ www.orddum.com: Problema com HTTPS"
fi

echo ""
echo "📋 PRÓXIMOS PASSOS PARA SSL COMPLETO:"
echo ""

echo "1. Configurar domínio no Firebase Console:"
echo "   - Acessar: https://console.firebase.google.com/project/orddum/hosting"
echo "   - Adicionar domínio personalizado: www.orddum.com"
echo "   - Aguardar certificado SSL ser emitido (até 24h)"
echo ""

echo "2. Verificar DNS:"
echo "   - Confirmar que www.orddum.com aponta para Firebase"
echo "   - Aguardar propagação DNS completa"
echo ""

echo "3. Testar SSL:"
echo "   - Verificar certificado no navegador"
echo "   - Testar redirecionamento HTTP → HTTPS"
echo ""

echo "✅ Verificação SSL concluída!" 