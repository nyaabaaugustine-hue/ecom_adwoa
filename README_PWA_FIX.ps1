# ============================================================
# Adwoa's Beauty - PWA manifest.json (FIXED)
# Bugs fixed:
#   1. start_url was "/https://ecom-tgne-site.vercel.app/" → now "/"
#   2. HTML entities (&amp;) replaced with literal &
#   3. Icons path correct - files must exist in public/icons/
# ============================================================
# This file is a reminder - the real fix is manifest.json above.
Write-Host "manifest.json already written to public/manifest.json" -ForegroundColor Green
Write-Host "Run: install_pwa_assets.ps1 to install the icon PNG files" -ForegroundColor Yellow
