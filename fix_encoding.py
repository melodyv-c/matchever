import os
import re

# All HTML files to fix
files = ["index.html", "about.html", "contact.html", "eleveur.html", "faq.html", "refuge.html"]

# Replacement character
R = '\ufffd'

# Ordered replacements (order matters - longer/more specific first)
replacements = [
    # Footer slogan (all pages)
    (f'S{R}?Tadopter pour la vie : pour l{R}?Tanimal', "S\u2019adopter pour la vie : pour l\u2019animal"),
    
    # Navigation & text: "À propos"
    (f'{R}? propos', 'À propos'),
    
    # "Éleveuse" before "Éleveur" before "Éleveurs"
    (f'{R}?leveuse', 'Éleveuse'),
    (f'{R}?leveurs', 'Éleveurs'),
    (f'{R}?leveur', 'Éleveur'),
    
    # "Éthique"
    (f'{R}?thique', 'Éthique'),
    
    # "Épagneul"
    (f'{R}?pagneul', 'Épagneul'),
    
    # "réseau" (refuge CTA button)
    (f'r{R}seau', 'réseau'),
    
    # "cœur" (coeur with oe ligature)
    (f'c{R}"ur', 'cœur'),
    
    # Star ratings ⭐⭐⭐⭐⭐ (shows as R~. repeated 5 times)
    (f'{R}~.{R}~.{R}~.{R}~.{R}~.', '⭐⭐⭐⭐⭐'),
    
    # Euro sign "€" (shows as R , R)
    (f'{R},{R}', '€'),
    
    # Em dash "—" (shows as R?" with context)
    (f'{R}?"', '—'),
    
    # Arrow "→" (shows as R?')
    (f"{R}?'", '→'),
    
    # Dot separator "·" followed by space+text  
    # "· Gratuit" pattern
    (f'{R}? Gratuit', '· Gratuit'),
    
    # Checkmark "✅" (shows as Ro" or Ro.)
    (f'{R}o"', '✅'),
    (f'{R}o.', '✅'),
    
    # Cross mark "❌" (shows as Ro-)
    (f'{R}o-', '❌'),
    
    # Cross/X for "Avant" section (shows as RO + space)
    (f'{R}O ', '❌ '),
]

# Emoji replacements by exact surrounding context
emoji_context_replacements = [
    # index.html - floating element paw 🐾
    ('float-icon">\ufffdY\ufffd\ufffd</div>', 'float-icon">🐾</div>'),
    
    # about.html bento card icons
    ('bento-card-icon">\ufffdYZ\ufffd</div>', 'bento-card-icon">🎯</div>'),
    ('bento-card-icon">\ufffdYO\ufffd</div>', 'bento-card-icon">🛡️</div>'),
    ('bento-card-icon secondary">\ufffdY\ufffd\ufffd</div>', 'bento-card-icon secondary">🤝</div>'),
    ('bento-card-icon secondary">\ufffdY"\ufffd</div>', 'bento-card-icon secondary">🔬</div>'),
    
    # about.html mission value icons
    ('mission-value-icon">\ufffdYO\ufffd</span>', 'mission-value-icon">🛡️</span>'),
    ('mission-value-icon">\ufffdY\ufffd\ufffd</span>', 'mission-value-icon">🤝</span>'),
    ('mission-value-icon">\ufffdY"\ufffd</span>', 'mission-value-icon">🔬</span>'),
    
    # about.html overlay icons
    ('overlay-icon">\ufffdY\ufffd\ufffd</div>', 'overlay-icon">🐾</div>'),
    ('overlay-icon green">\ufffdo.</div>', 'overlay-icon green">✅</div>'),
    
    # about.html team section emoji
    (f'{R}Y\'{R} Notre', '👥 Notre'),
    # about.html news section emoji  
    (f'{R}Y"{R} Actualit', '📰 Actualit'),
    
    # contact.html info icons
    ('contact-info-icon" aria-hidden="true">\ufffdY"\ufffd</div>', 'contact-info-icon" aria-hidden="true">📧</div>'),
    ("contact-info-icon\" aria-hidden=\"true\">\ufffdY'\ufffd</div>", 'contact-info-icon" aria-hidden="true">💬</div>'),
    ('contact-info-icon" aria-hidden="true">\ufffdY\ufffd\ufffd</div>', 'contact-info-icon" aria-hidden="true">🤝</div>'),
    
    # contact.html location icons
    ('location-icon" aria-hidden="true">\ufffdY\ufffd\ufffd</span>', 'location-icon" aria-hidden="true">📍</span>'),
    ('location-icon" aria-hidden="true">\ufffdYs?</span>', 'location-icon" aria-hidden="true">🚊</span>'),
    ('location-icon" aria-hidden="true">\ufffdY.\ufffd</span>', 'location-icon" aria-hidden="true">🕐</span>'),
    
    # contact.html map pin
    ('map-pin" aria-hidden="true">\ufffdY"\ufffd</div>', 'map-pin" aria-hidden="true">📍</div>'),
    
    # contact.html support icons
    ('support-option-icon" aria-hidden="true">\ufffd"</div>', 'support-option-icon" aria-hidden="true">❓</div>'),
    ('support-option-icon" aria-hidden="true">\ufffdY"\ufffd</div>', 'support-option-icon" aria-hidden="true">📧</div>'),
    # Third support option - phone/app icon
    
    # refuge.html feature icons
    ('feature-icon" aria-hidden="true">\ufffdY"<</div>', 'feature-icon" aria-hidden="true">📋</div>'),
    ('feature-icon" aria-hidden="true">\ufffdYZ\ufffd</div>', 'feature-icon" aria-hidden="true">🎯</div>'),
    ('feature-icon" aria-hidden="true">\ufffdY"S</div>', 'feature-icon" aria-hidden="true">📊</div>'),
    ("feature-icon\" aria-hidden=\"true\">\ufffdY'\ufffd</div>", 'feature-icon" aria-hidden="true">💬</div>'),
    ('feature-icon" aria-hidden="true">\ufffdY"\ufffd</div>', 'feature-icon" aria-hidden="true">📣</div>'),
    ("feature-icon\" aria-hidden=\"true\">\ufffdY\"'</div>", 'feature-icon" aria-hidden="true">🔒</div>'),
    
    # refuge.html impact icons
    ('impact-icon">\ufffdY\ufffd.</div>', 'impact-icon">🐕</div>'),
    ('impact-icon">\ufffdY"?</div>', 'impact-icon">📉</div>'),
    
    # eleveur.html feature icons
    ('feature-icon" aria-hidden="true">\ufffdY\ufffd.</div>', 'feature-icon" aria-hidden="true">🏅</div>'),
    ('feature-icon" aria-hidden="true">\ufffdY"^</div>', 'feature-icon" aria-hidden="true">📈</div>'),
    ('feature-icon" aria-hidden="true">\ufffdY\ufffd\ufffd</div>', 'feature-icon" aria-hidden="true">🐾</div>'),
    
    # contact.html form success message
    (f'{R}o. Merci', '✅ Merci'),
    
    # contact.html JS: Message envoyé ✅
    (f"Message envoy\u00e9 {R}o\"'", "Message envoyé ✅"),
]

for fname in files:
    if not os.path.exists(fname):
        print(f"File not found: {fname}")
        continue
    
    with open(fname, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    original = content
    
    # Apply context-specific emoji replacements first (more specific)
    for old, new in emoji_context_replacements:
        content = content.replace(old, new)
    
    # Apply general text replacements
    for old, new in replacements:
        content = content.replace(old, new)
    
    # Count remaining replacement characters
    remaining = content.count('\ufffd')
    
    if content != original:
        with open(fname, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        print(f"Fixed: {fname} (remaining \ufffd: {remaining})")
    else:
        print(f"No changes: {fname}")

print("\nDone!")
