# Find remaining replacement characters in index.html and about.html
$R = [char]0xFFFD

foreach ($f in @("index.html", "about.html")) {
    Write-Host "=== $f ==="
    $content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
    $chars = $content.ToCharArray()
    
    for ($i = 0; $i -lt $chars.Length; $i++) {
        if ([int]$chars[$i] -eq 0xFFFD) {
            $start = [Math]::Max(0, $i - 30)
            $end = [Math]::Min($chars.Length, $i + 30)
            $snippet = $content.Substring($start, $end - $start)
            # Find line number
            $lineNum = ($content.Substring(0, $i) -split "`n").Count
            Write-Host "  Line $lineNum, Pos $i : ...$snippet..."
        }
    }
}
