#!/bin/sh
# Régénère index.html, ar/index.html, en/index.html (minifiés) et sitemap.xml
# à partir de la source lisible index.src.html (voir build.mjs).
# Usage : sh build.sh
set -e
node "$(dirname "$0")/build.mjs"
