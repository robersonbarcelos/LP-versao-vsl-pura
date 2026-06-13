# build.ps1 — pré-compila os arquivos JSX para JS minificado (produção).
# Roda esbuild via npx; não precisa instalar nada permanentemente.
# Rode este script SEMPRE que alterar qualquer arquivo .jsx.
# Edições só no bloco TWEAK_DEFAULTS do index.html NÃO exigem rebuild.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
# Os bundles servidos vivem em public/js (o output servido pelo CF Pages e a pasta public/).
# Os .jsx-fonte ficam na raiz (nao servidos).
New-Item -ItemType Directory -Force (Join-Path $root "public\js") | Out-Null

# Ordem importa: tweaks-panel e effects expõem helpers no window; sections expõe
# os componentes; app é o último (chama ReactDOM.render e usa os demais).
$files = @("tweaks-panel", "effects", "sections", "app")

foreach ($f in $files) {
    $src = Join-Path $root "$f.jsx"
    $out = Join-Path $root "public\js\$f.min.js"
    Write-Host "Compilando $f.jsx -> public/js/$f.min.js"
    npx --yes esbuild@0.24.0 $src --format=iife --minify --target=es2019 --outfile=$out
}

Write-Host "Build concluído. Bundles em public/js/*.min.js"
