# Akasha one-liner bootstrap (Windows)
# Downloads the full zip from azerothl/Akasha_app releases, extracts, runs setup.
# Invoke: powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/azerothl/Akasha_app/main/scripts/get-akasha.ps1 | iex"

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Repo = "azerothl/Akasha_app"
$ZipUrl = "https://github.com/$Repo/releases/latest/download/akasha-full-windows-x86_64.zip"
$InstallDir = "C:\Akasha"

Write-Host "=== Akasha installation (one-liner) ===" -ForegroundColor Cyan
Write-Host "This script will download Akasha from $Repo and run the installer."
Write-Host "URL: $ZipUrl"
$r = Read-Host "Continue? [Y/n]"
if ($r -match "^(n|no)$") { Write-Host "Aborted."; exit 0 }

$tempDir = Join-Path $env:TEMP "akasha-install-$(Get-Random)"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
try {
    $zipPath = Join-Path $tempDir "akasha-full.zip"
    Write-Host "Downloading..."
    Invoke-WebRequest -Uri $ZipUrl -UseBasicParsing -OutFile $zipPath -MaximumRedirection 5
    if (-not (Test-Path $zipPath) -or (Get-Item $zipPath).Length -eq 0) {
        Write-Host "Download failed or empty." -ForegroundColor Red
        exit 1
    }
    Write-Host "Extracting..."
    Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force
    $extractedRoot = $tempDir
    if -not (Test-Path (Join-Path $tempDir "akasha.exe")) {
        $child = Get-ChildItem -Path $tempDir -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($child) { $extractedRoot = $child.FullName }
    }
    $setupScript = Join-Path $extractedRoot "scripts\setup.ps1"
    if (-not (Test-Path $setupScript)) {
        Write-Host "setup.ps1 not found in the downloaded package." -ForegroundColor Red
        exit 1
    }
    Write-Host "Running installer..."
    & $setupScript -InstallDir $InstallDir -AutoStart
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    $akashaExe = Join-Path $InstallDir "akasha.exe"
    $r = Read-Host "Lancer l'assistant de configuration maintenant ? [Y/n]"
    if ($r -eq "" -or $r -match "^(y|yes)$") {
        & $akashaExe init
        Write-Host "You can also run: $akashaExe tui   (terminal UI)"
    }
    Write-Host "Installation complete." -ForegroundColor Green
} finally {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
