$OutputFile = "all_code3.txt"

# Elimina el archivo si ya existe
if (Test-Path $OutputFile) {
    Remove-Item $OutputFile
}

# Extensiones de archivo a incluir
$Extensions = @("*.js", "*.html", "*.css", "*.php", "*.py", "*.cpp", "*.java", "*.ts")

# Función para manejar archivos con error de permiso
function Try-GetContent {
    param($filePath)
    try {
        Get-Content $filePath -ErrorAction Stop
    } catch {
        Write-Host "⚠️ No se puede acceder a: $filePath"
        return $null
    }
}

# Buscar y combinar archivos
foreach ($Ext in $Extensions) {
    Get-ChildItem -Path . -Recurse -Filter $Ext | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git" } | ForEach-Object {
        Add-Content -Path $OutputFile -Value "`n`n# --- FILE: $($_.FullName) ---`n`n"
        $fileContent = Try-GetContent $_.FullName
        if ($fileContent) {
            $fileContent | Add-Content -Path $OutputFile
        }
    }
}

Write-Output "✅ Todos los archivos han sido guardados en $OutputFile"
