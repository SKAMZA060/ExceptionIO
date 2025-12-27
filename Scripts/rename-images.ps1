# PowerShell script to normalize image filenames (remove spaces, lowercase, replace with hyphens)
cd (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)\..\Images\Portfolio
Get-ChildItem -File | Where-Object { $_.Name -match "\s" } | ForEach-Object {
    $new = $_.Name.ToLower() -replace '\s+', '-' 
    Rename-Item -LiteralPath $_.FullName -NewName $new -Force
    Write-Output "Renamed $_.Name -> $new"
}
Write-Output "Done. Consider running: npm run optimize-images"