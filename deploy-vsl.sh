#!/bin/bash
# Build + sync + push da versao VSL pura
cd "$(dirname "$0")"

# Compila JSX
npx esbuild@0.24.0 effects-vsl.jsx --bundle=false --minify \
  --outfile="public/js/effects-vsl.min.js" \
  --jsx=transform --jsx-factory=React.createElement --jsx-fragment=React.Fragment

npx esbuild@0.24.0 sections-vsl.jsx --bundle=false --minify \
  --outfile="public/js/sections-vsl.min.js" \
  --jsx=transform --jsx-factory=React.createElement --jsx-fragment=React.Fragment

npx esbuild@0.24.0 app-vsl.jsx --bundle=false --minify \
  --outfile="public/js/app-vsl.min.js" \
  --jsx=transform --jsx-factory=React.createElement --jsx-fragment=React.Fragment

# Sincroniza index.html com index-vsl.html
cp public/index-vsl.html public/index.html

echo "Build OK. Pronto para commit e push."
