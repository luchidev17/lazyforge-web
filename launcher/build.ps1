# build.ps1 - Compila build_mod.exe para Lazy Forge
# Ejecutar desde la carpeta /launcher/

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=====================================================" -ForegroundColor DarkYellow
Write-Host "         L A Z Y   F O R G E  —  Build EXE          " -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor DarkYellow
Write-Host ""

# Verificar que Go esté instalado
try {
    $goVer = & go version 2>&1
    Write-Host "[OK] $goVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Go no está instalado o no está en el PATH." -ForegroundColor Red
    Write-Host "        Descargalo desde https://go.dev/dl/" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "Compilando build_mod.exe..." -ForegroundColor Cyan

$output = "..\public\gradle-wrapper\build_mod.exe"

# -ldflags="-s -w" reduce el tamaño del binario eliminando debug info
& go build -ldflags="-s -w" -o $output .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] La compilacion fallo." -ForegroundColor Red
    exit 1
}

$size = [math]::Round((Get-Item $output).Length / 1MB, 2)
Write-Host ""
Write-Host "[OK] build_mod.exe generado exitosamente ($size MB)" -ForegroundColor Green
Write-Host "     Ruta: $((Resolve-Path $output).Path)" -ForegroundColor Gray
Write-Host ""
Write-Host "El .exe ya esta listo en /public/gradle-wrapper/" -ForegroundColor Yellow
Write-Host "Ahora podes hacer 'npm run build' y el ZIP incluira el .exe." -ForegroundColor Yellow
Write-Host ""
