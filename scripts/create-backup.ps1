$dest = "backup\RPLTwoFess-backup-pre-motion-2026-09-06.zip"

if (-not (Test-Path "backup")) {
    New-Item -ItemType Directory -Path "backup" | Out-Null
}

if (Test-Path $dest) {
    Remove-Item $dest -Force
}

$items = @(
    "app",
    "components",
    "lib",
    "public",
    "scripts",
    "supabase",
    "types",
    ".env.example",
    ".env.example.backup",
    ".gitignore",
    "AGENTS.md",
    "BACKUP_INFO.md",
    "CLAUDE.md",
    "design.md",
    "eslint.config.mjs",
    "maskotlogo.png",
    "next-env.d.ts",
    "next.config.ts",
    "package.json",
    "package-lock.json",
    "postcss.config.mjs",
    "prd.md",
    "proxy.ts",
    "README.md",
    "RESTORE_BACKUP.md",
    "rplogo.png",
    "tsconfig.json"
)

Write-Host "Compressing $($items.Count) items to $dest..."
Compress-Archive -Path $items -DestinationPath $dest -CompressionLevel Optimal
Write-Host "Backup completed: $dest"
$file = Get-Item $dest
Write-Host "File size: $([math]::Round($file.Length / 1MB, 2)) MB ($($file.Length) bytes)"
