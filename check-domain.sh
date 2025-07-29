#!/bin/bash

echo "🔍 Verificando configuração do domínio www.orddum.com..."
echo ""

echo "1. Verificando resolução DNS:"
nslookup www.orddum.com
echo ""

echo "2. Verificando conectividade HTTP:"
curl -I http://www.orddum.com 2>/dev/null | head -5
echo ""

echo "3. Verificando conectividade HTTPS:"
curl -I https://www.orddum.com 2>/dev/null | head -5
echo ""

echo "4. Verificando redirecionamento:"
curl -I https://orddum.web.app 2>/dev/null | head -5
echo ""

echo "✅ Verificação concluída!" 