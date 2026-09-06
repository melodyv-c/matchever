# Fix encoding - PowerShell version using .NET string operations
# Replacement character as a string
$R = [string][char]0xFFFD

$files = @("index.html", "about.html", "contact.html", "eleveur.html", "faq.html", "refuge.html")

foreach ($f in $files) {
    if (-not (Test-Path $f)) {
        Write-Host "Not found: $f"
        continue
    }
    
    $content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
    $original = $content
    
    # ========== FOOTER SLOGAN (all pages) ==========
    $content = $content.Replace("S${R}?Tadopter pour la vie : pour l${R}?Tanimal", [string]::Concat("S", [char]0x2019, "adopter pour la vie : pour l", [char]0x2019, "animal"))
    
    # ========== NAV & TEXT ==========
    $content = $content.Replace("${R}? propos", [string]::Concat([char]0x00C0, " propos"))
    $content = $content.Replace("${R}?leveuse", [string]::Concat([char]0x00C9, "leveuse"))
    $content = $content.Replace("${R}?leveurs", [string]::Concat([char]0x00C9, "leveurs"))
    $content = $content.Replace("${R}?leveur", [string]::Concat([char]0x00C9, "leveur"))
    $content = $content.Replace("${R}?thique", [string]::Concat([char]0x00C9, "thique"))
    $content = $content.Replace("${R}?pagneul", [string]::Concat([char]0x00C9, "pagneul"))
    
    # réseau
    $content = $content.Replace("r${R}seau", [string]::Concat("r", [char]0x00E9, "seau"))
    
    # cœur (c + R + "ur)
    $content = $content.Replace([string]::Concat("c", $R, '"', "ur"), [string]::Concat("c", [char]0x0153, "ur"))
    
    # ========== STAR RATINGS ==========
    $five_stars_corrupted = "${R}~.${R}~.${R}~.${R}~.${R}~."
    $five_stars_good = [string]::Concat([char]0x2B50, [char]0x2B50, [char]0x2B50, [char]0x2B50, [char]0x2B50)
    $content = $content.Replace($five_stars_corrupted, $five_stars_good)
    
    # ========== EURO SIGN ==========
    $content = $content.Replace("${R},${R}", [string]([char]0x20AC))
    
    # ========== MIDDLE DOT ==========
    $content = $content.Replace("${R}? Gratuit", [string]::Concat([char]0x00B7, " Gratuit"))
    
    # ========== ARROWS ==========
    $content = $content.Replace("${R}?'", [string]([char]0x2192))
    
    # ========== EM DASH ==========
    $content = $content.Replace([string]::Concat($R, '?', '"'), [string]([char]0x2014))
    
    # ========== CHECKMARKS & CROSSES ==========
    # Checkmark shows as R + o + " (hex: EF BF BD 6F 22)
    $content = $content.Replace([string]::Concat($R, 'o', '"'), [string]([char]0x2705))
    # Checkmark variant shows as R + o + . (hex: EF BF BD 6F 2E)
    $content = $content.Replace("${R}o.", [string]([char]0x2705))
    # Cross shows as R + o + -
    $content = $content.Replace("${R}o-", [string]([char]0x274C))
    # Cross for "Avant" section
    $content = $content.Replace("${R}O ", [string]::Concat([char]0x274C, " "))
    
    # ========== EMOJIS BY CONTEXT ==========
    # Using surrogate pairs for emojis above U+FFFF
    
    # Paw prints 🐾 U+1F43E = D83D DC3E
    $paw = [char]::ConvertFromUtf32(0x1F43E)
    # Target 🎯 U+1F3AF = D83C DFAF  
    $target = [char]::ConvertFromUtf32(0x1F3AF)
    # Shield 🛡 U+1F6E1
    $shield = [char]::ConvertFromUtf32(0x1F6E1)
    # Handshake 🤝 U+1F91D
    $handshake = [char]::ConvertFromUtf32(0x1F91D)
    # Microscope 🔬 U+1F52C
    $microscope = [char]::ConvertFromUtf32(0x1F52C)
    # Dog 🐕 U+1F415
    $dog = [char]::ConvertFromUtf32(0x1F415)
    # Clipboard 📋 U+1F4CB
    $clipboard = [char]::ConvertFromUtf32(0x1F4CB)
    # Chart 📊 U+1F4CA
    $chart = [char]::ConvertFromUtf32(0x1F4CA)
    # Speech 💬 U+1F4AC
    $speech = [char]::ConvertFromUtf32(0x1F4AC)
    # Megaphone 📣 U+1F4E3
    $megaphone = [char]::ConvertFromUtf32(0x1F4E3)
    # Lock 🔒 U+1F512
    $lock = [char]::ConvertFromUtf32(0x1F512)
    # Email 📧 U+1F4E7
    $email = [char]::ConvertFromUtf32(0x1F4E7)
    # Pin 📍 U+1F4CD
    $pin = [char]::ConvertFromUtf32(0x1F4CD)
    # Tram 🚊 U+1F68A
    $tram = [char]::ConvertFromUtf32(0x1F68A)
    # Clock 🕐 U+1F550
    $clock = [char]::ConvertFromUtf32(0x1F550)
    # Medal 🏅 U+1F3C5
    $medal = [char]::ConvertFromUtf32(0x1F3C5)
    # Chart up 📈 U+1F4C8
    $chartup = [char]::ConvertFromUtf32(0x1F4C8)
    # Chart down 📉 U+1F4C9
    $chartdown = [char]::ConvertFromUtf32(0x1F4C9)
    # Camera 📷 U+1F4F7
    $camera = [char]::ConvertFromUtf32(0x1F4F7)
    # Team 👥 U+1F465
    $team = [char]::ConvertFromUtf32(0x1F465)
    # Newspaper 📰 U+1F4F0
    $newspaper = [char]::ConvertFromUtf32(0x1F4F0)
    # Leaf 🌿 U+1F33F
    $leaf = [char]::ConvertFromUtf32(0x1F33F)
    # Question ❓ U+2753
    $question = [char]0x2753
    # Phone 📱 U+1F4F1
    $phone = [char]::ConvertFromUtf32(0x1F4F1)
    
    # index.html float-icon paw
    $content = $content.Replace("float-icon`">${R}Y${R}${R}</div>", "float-icon`">$paw</div>")
    
    # about.html bento-card-icon
    $content = $content.Replace("bento-card-icon`">${R}YZ${R}</div>", "bento-card-icon`">$target</div>")
    $content = $content.Replace("bento-card-icon`">${R}YO${R}</div>", "bento-card-icon`">$shield</div>")
    $content = $content.Replace("bento-card-icon secondary`">${R}Y${R}${R}</div>", "bento-card-icon secondary`">$handshake</div>")
    $content = $content.Replace("bento-card-icon secondary`">${R}Y`"${R}</div>", "bento-card-icon secondary`">$microscope</div>")
    
    # about.html mission-value-icon
    $content = $content.Replace("mission-value-icon`">${R}YO${R}</span>", "mission-value-icon`">$shield</span>")
    $content = $content.Replace("mission-value-icon`">${R}Y${R}${R}</span>", "mission-value-icon`">$handshake</span>")
    $content = $content.Replace("mission-value-icon`">${R}Y`"${R}</span>", "mission-value-icon`">$microscope</span>")
    
    # about.html overlay-icon
    $content = $content.Replace("overlay-icon`">${R}Y${R}${R}</div>", "overlay-icon`">$paw</div>")
    $content = $content.Replace("overlay-icon green`">${R}o.</div>", "overlay-icon green`">$leaf</div>")
    
    # about.html team/news section
    $content = $content.Replace("${R}Y'${R} Notre", "$team Notre")
    $content = $content.Replace("${R}Y`"${R} Actualit", "$newspaper Actualit")
    
    # contact.html info icons  
    $content = $content.Replace("contact-info-icon`" aria-hidden=`"true`">${R}Y`"${R}</div>", "contact-info-icon`" aria-hidden=`"true`">$email</div>")
    $content = $content.Replace("contact-info-icon`" aria-hidden=`"true`">${R}Y'${R}</div>", "contact-info-icon`" aria-hidden=`"true`">$speech</div>")
    $content = $content.Replace("contact-info-icon`" aria-hidden=`"true`">${R}Y${R}${R}</div>", "contact-info-icon`" aria-hidden=`"true`">$handshake</div>")
    
    # contact.html location icons
    $content = $content.Replace("location-icon`" aria-hidden=`"true`">${R}Y${R}${R}</span>", "location-icon`" aria-hidden=`"true`">$pin</span>")
    $content = $content.Replace("location-icon`" aria-hidden=`"true`">${R}Ys?</span>", "location-icon`" aria-hidden=`"true`">$tram</span>")
    $content = $content.Replace("location-icon`" aria-hidden=`"true`">${R}Y.${R}</span>", "location-icon`" aria-hidden=`"true`">$clock</span>")
    
    # contact.html map pin
    $content = $content.Replace("map-pin`" aria-hidden=`"true`">${R}Y`"${R}</div>", "map-pin`" aria-hidden=`"true`">$pin</div>")
    
    # contact.html support icons
    $content = $content.Replace("support-option-icon`" aria-hidden=`"true`">${R}`"</div>", "support-option-icon`" aria-hidden=`"true`">$question</div>")
    $content = $content.Replace("support-option-icon`" aria-hidden=`"true`">${R}Y`"${R}</div>", "support-option-icon`" aria-hidden=`"true`">$email</div>")
    $content = $content.Replace("support-option-icon`" aria-hidden=`"true`">${R}Y`"${R}</div>", "support-option-icon`" aria-hidden=`"true`">$phone</div>")
    
    # refuge.html feature icons
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}Y`"<</div>", "feature-icon`" aria-hidden=`"true`">$clipboard</div>")
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}YZ${R}</div>", "feature-icon`" aria-hidden=`"true`">$target</div>")
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}Y`"S</div>", "feature-icon`" aria-hidden=`"true`">$chart</div>")
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}Y'${R}</div>", "feature-icon`" aria-hidden=`"true`">$speech</div>")
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}Y`"${R}</div>", "feature-icon`" aria-hidden=`"true`">$megaphone</div>")
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}Y`"'</div>", "feature-icon`" aria-hidden=`"true`">$lock</div>")
    
    # refuge.html impact icons
    $content = $content.Replace("impact-icon`">${R}Y${R}.</div>", "impact-icon`">$dog</div>")
    $content = $content.Replace("impact-icon`">${R}Y`"?</div>", "impact-icon`">$chartdown</div>")
    
    # eleveur.html feature icons  
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}Y${R}.</div>", "feature-icon`" aria-hidden=`"true`">$medal</div>")
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}Y`"^</div>", "feature-icon`" aria-hidden=`"true`">$chartup</div>")
    $content = $content.Replace("feature-icon`" aria-hidden=`"true`">${R}Y${R}${R}</div>", "feature-icon`" aria-hidden=`"true`">$paw</div>")
    
    # contact.html form success  
    $content = $content.Replace("${R}o. Merci", [string]::Concat([char]0x2705, " Merci"))
    
    # contact.html JS: Message envoyé checkmark
    $content = $content.Replace([string]::Concat("envoy", [char]0x00E9, " ", $R, "o`"'"), [string]::Concat("envoy", [char]0x00E9, " ", [char]0x2705))
    
    # Remaining cleanup - any leftover R? patterns that might be stray middle dots or similar
    # Be careful not to replace too aggressively
    
    # Write back
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($f, $content, $utf8NoBom)
    
    # Count remaining
    $remaining = 0
    foreach ($c in $content.ToCharArray()) {
        if ([int]$c -eq 0xFFFD) { $remaining++ }
    }
    
    $changed = $content -ne $original
    Write-Host "$f - Changed: $changed, Remaining bad chars: $remaining"
}

Write-Host "`nDone!"
