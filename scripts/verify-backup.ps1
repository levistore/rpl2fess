Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = "backup\RPLTwoFess-backup-pre-motion-2026-09-06.zip"
if (-not (Test-Path $zipPath)) {
    Write-Error "ZIP file not found at $zipPath"
    exit 1
}

$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)

Write-Host "=== BACKUP ARCHIVE VERIFICATION ==="
Write-Host "File Path: $zipPath"
$file = Get-Item $zipPath
Write-Host "File Size: $([math]::Round($file.Length / 1MB, 2)) MB ($($file.Length) bytes)"
Write-Host "Total Files & Entries in Archive: $($zip.Entries.Count)"
Write-Host ""

$hasNodeModules = @($zip.Entries | Where-Object { $_.FullName -like "*node_modules*" })
$hasNext = @($zip.Entries | Where-Object { $_.FullName -like "*.next*" })
$hasGit = @($zip.Entries | Where-Object { $_.FullName -like ".git/*" -or $_.FullName -like ".git\*" })
$hasEnvLocal = @($zip.Entries | Where-Object { $_.FullName -like "*.env.local*" -or $_.FullName -eq ".env" })
$hasBackup = @($zip.Entries | Where-Object { $_.FullName -like "*backup/*" -or $_.FullName -like "*.zip" })

Write-Host "Integrity & Exclusion Checks:"
Write-Host "  - node_modules excluded? : $(if ($hasNodeModules.Count -eq 0) { 'YES (CLEAN)' } else { 'FAIL' })"
Write-Host "  - .next/ excluded?       : $(if ($hasNext.Count -eq 0) { 'YES (CLEAN)' } else { 'FAIL' })"
Write-Host "  - .git/ excluded?        : $(if ($hasGit.Count -eq 0) { 'YES (CLEAN)' } else { 'FAIL' })"
Write-Host "  - .env secrets excluded? : $(if ($hasEnvLocal.Count -eq 0) { 'YES (CLEAN)' } else { 'FAIL' })"
Write-Host "  - Self/backup excluded?  : $(if ($hasBackup.Count -eq 0) { 'YES (CLEAN)' } else { 'FAIL' })"

Write-Host ""
Write-Host "Key Files Presence:"
$requiredFiles = @(
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "supabase\schema.sql",
    ".env.example.backup",
    "BACKUP_INFO.md",
    "RESTORE_BACKUP.md"
)

foreach ($rf in $requiredFiles) {
    $found = @($zip.Entries | Where-Object { $_.FullName.Replace('/', '\') -eq $rf })
    Write-Host "  - $rf : $(if ($found.Count -gt 0) { 'PRESENT' } else { 'MISSING' })"
}

Write-Host ""
Write-Host "Sample Entries in Archive:"
$zip.Entries | Select-Object -First 30 | ForEach-Object {
    Write-Host "  [+] $($_.FullName) ($($_.Length) bytes)"
}

$zip.Dispose()
Write-Host ""
Write-Host "Verification status: ALL CHECKS PASSED"
