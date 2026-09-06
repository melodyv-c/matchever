# Diagnose all corrupted sequences in the HTML files
$files = @("index.html", "about.html", "contact.html", "eleveur.html", "faq.html", "refuge.html")

foreach ($f in $files) {
    Write-Host "=== $f ==="
    $bytes = [System.IO.File]::ReadAllBytes($f)
    
    # Find all positions of EF BF BD (UTF-8 replacement character)
    for ($i = 0; $i -lt $bytes.Length - 2; $i++) {
        if ($bytes[$i] -eq 0xEF -and $bytes[$i+1] -eq 0xBF -and $bytes[$i+2] -eq 0xBD) {
            $start = [Math]::Max(0, $i - 5)
            $end = [Math]::Min($bytes.Length, $i + 15)
            $hex = ""
            $ascii = ""
            for ($j = $start; $j -lt $end; $j++) {
                $hex += ("{0:X2} " -f $bytes[$j])
                if ($bytes[$j] -ge 0x20 -and $bytes[$j] -le 0x7E) {
                    $ascii += [char]$bytes[$j]
                } else {
                    $ascii += "."
                }
            }
            Write-Host "  Pos $i : $hex | $ascii"
        }
    }
}
