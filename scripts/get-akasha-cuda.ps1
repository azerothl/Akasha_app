# Akasha CUDA one-liner (Windows full CUDA zip)
# Invoke: powershell -ExecutionPolicy Bypass -c "irm https://raw.githubusercontent.com/azerothl/Akasha_app/main/scripts/get-akasha-cuda.ps1 | iex"
if ($PSScriptRoot) {
    & (Join-Path $PSScriptRoot 'get-akasha.ps1') -Cuda
} else {
    $installerUrl = 'https://raw.githubusercontent.com/azerothl/Akasha_app/main/scripts/get-akasha.ps1'
    & ([ScriptBlock]::Create((Invoke-RestMethod -Uri $installerUrl))) -Cuda
}
