#!/bin/sh
# Régénère index.html (minifié/obfusqué) à partir de la source lisible index.src.html
# Usage : sh build.sh
set -e
npx --yes html-minifier-terser \
  --collapse-whitespace --remove-comments --remove-redundant-attributes \
  --remove-script-type-attributes --minify-css true \
  --minify-js '{"mangle":true,"compress":true}' \
  -o index.html index.src.html
echo "OK -> index.html ($(wc -c < index.html) octets)"
