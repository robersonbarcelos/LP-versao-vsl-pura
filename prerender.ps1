# prerender.ps1 — compila os bundles e gera o shell estático no #root do index.html.
# Rode ANTES de commitar/deploy sempre que mudar a ESTRUTURA das seções (.jsx).
# Edições só no TWEAK_DEFAULTS não exigem rerodar (o React renderiza do valor atual;
# só o flash inicial do shell ficaria desatualizado até o JS assumir).

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

# 1. Compila os .jsx -> js/*.min.js
& (Join-Path $root "build.ps1")

# 2. Localiza um Chrome/Edge para o snapshot
$paths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)
$chrome = $paths | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "Chrome/Edge não encontrado. Instale ou ajuste o caminho em prerender.ps1." }
$env:CHROME_PATH = $chrome
Write-Host "Usando navegador: $chrome"

# 3. Snapshot (puppeteer-core instalado temporariamente, sem salvar)
Push-Location $root
try {
    npm install --no-save --no-audit --no-fund puppeteer-core@23.11.1
    node scripts/prerender.mjs
}
finally {
    Remove-Item -Recurse -Force (Join-Path $root "node_modules") -ErrorAction SilentlyContinue
    Pop-Location
}
Write-Host "Pré-render concluído."
