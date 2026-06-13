# critical-css.ps1 — regenera o Critical CSS inline (above-the-fold) do index.html.
# Rode sempre que mudar o CSS/estrutura ACIMA DA DOBRA (hero, nav, announce).
# Requer que o index.html já tenha o <style id="critical-css"> com os marcadores
# /*CRITICAL-CSS-START*/ e /*CRITICAL-CSS-END*/ e o styles.css carregado não-bloqueante.
# Dica: rode o prerender.ps1 ANTES (o snapshot do #root precisa estar atualizado).

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

# Localiza um Chrome/Edge (mesmos caminhos do prerender.ps1)
$paths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)
$chrome = $paths | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { throw "Chrome/Edge não encontrado. Instale ou ajuste o caminho." }
$env:CHROME_PATH = $chrome
Write-Host "Usando navegador: $chrome"

# Sobe um servidor http local (file:// bloqueia o acesso a cssRules) servindo public/ (o root web).
$port = 8137
$srv = Start-Process python -ArgumentList "-m", "http.server", "$port" -WorkingDirectory (Join-Path $root "public") -PassThru -WindowStyle Hidden
$env:BASE_URL = "http://127.0.0.1:$port/"
Write-Host "Servidor local em $env:BASE_URL (PID $($srv.Id))"

Push-Location $root
try {
    npm install --no-save --no-audit --no-fund puppeteer-core@23.11.1
    node scripts/critical-css.mjs
}
finally {
    if ($srv) { Stop-Process -Id $srv.Id -Force -ErrorAction SilentlyContinue }
    Remove-Item -Recurse -Force (Join-Path $root "node_modules") -ErrorAction SilentlyContinue
    Pop-Location
}
Write-Host "Critical CSS concluído."
