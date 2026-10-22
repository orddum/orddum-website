#!/usr/bin/env bash
# O site é um produto só: toda página de public/ tem o mesmo cabeçalho e o mesmo
# rodapé da home, byte a byte, entre os marcadores <!-- site-header --> e
# <!-- site-footer -->, e carrega /styles.css e /script.js.
#
#   tools/check-coerencia.sh        (de qualquer pasta)
#
# Sai com 1 e lista as diferenças quando algo destoa.
set -u

raiz="$(cd "$(dirname "$0")/.." && pwd)"
cd "$raiz/public" || exit 2

home="index.html"
erros=0
tmp="$(mktemp -d 2>/dev/null || mktemp -d "$raiz/.coerencia.XXXXXX")"
trap 'rm -rf "$tmp"' EXIT

# Imprime o bloco entre <!-- NOME --> e <!-- /NOME -->, marcadores inclusos.
bloco() {
   sed -n "/<!-- $2 -->/,/<!-- \/$2 -->/p" "$1"
}

falha() {
   echo "  - $1"
   erros=$((erros + 1))
}

for nome in site-header site-footer; do
   if [ -z "$(bloco "$home" "$nome")" ]; then
      echo "A home não tem o bloco $nome."
      exit 1
   fi
done

paginas="$(find . -name '*.html' | sort)"
total=0

for pagina in $paginas; do
   total=$((total + 1))
   problemas_antes=$erros
   echo "$pagina"

   for nome in site-header site-footer; do
      esperado="$(bloco "$home" "$nome")"
      atual="$(bloco "$pagina" "$nome")"
      if [ -z "$atual" ]; then
         falha "sem o bloco $nome"
      elif [ "$esperado" != "$atual" ]; then
         falha "o bloco $nome difere da home:"
         printf '%s\n' "$esperado" > "$tmp/esperado"
         printf '%s\n' "$atual" > "$tmp/atual"
         diff "$tmp/esperado" "$tmp/atual" | sed 's/^/      /'
      fi
   done

   grep -q 'href="/styles.css"' "$pagina" || falha 'não carrega /styles.css'
   grep -q 'src="/script.js"' "$pagina" || falha 'não carrega /script.js'

   [ "$erros" -eq "$problemas_antes" ] && echo "  ok"
done

echo
if [ "$erros" -gt 0 ]; then
   echo "FALHOU: $erros problema(s) em $total página(s)."
   exit 1
fi
echo "Coerente: $total página(s) com o mesmo cabeçalho e rodapé da home."
