$bytes = [System.IO.File]::ReadAllBytes("index.html")
Write-Host "First 10 bytes:"
for ($i = 0; $i -lt 10; $i++) {
    Write-Host ("{0:X2}" -f $bytes[$i]) -NoNewline
    Write-Host " " -NoNewline
}
Write-Host ""
Write-Host "File size: $($bytes.Length)"

# Search for the corrupted "À propos" pattern around the nav area
# Looking for byte sequences near line 67 (approx byte offset)
$text = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::GetEncoding(28591))
$idx = $text.IndexOf("propos")
if ($idx -ge 0) {
    $start = [Math]::Max(0, $idx - 10)
    $end = [Math]::Min($text.Length, $idx + 20)
    $snippet = $text.Substring($start, $end - $start)
    Write-Host "Snippet around 'propos': [$snippet]"
    # Show hex of those bytes
    $snippetBytes = [System.Text.Encoding]::GetEncoding(28591).GetBytes($snippet)
    Write-Host "Hex:"
    foreach ($b in $snippetBytes) {
        Write-Host ("{0:X2}" -f $b) -NoNewline
        Write-Host " " -NoNewline
    }
    Write-Host ""
}

# Check if there's a BOM
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "UTF-8 BOM detected"
} else {
    Write-Host "No BOM"
}
