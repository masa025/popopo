
import os

path = '/Users/onoderamasaru/.gemini/antigravity/scratch/popopo-site/index.html'

# Force read and write as UTF-8
with open(path, 'rb') as f:
    data = f.read()

# Attempt to recover from mojibake (common issue where UTF-8 is read as Shift-JIS and written back)
# But since I just want to FIX specific buttons, I will just search and replace with correct UTF-8 strings.

# The buttons I added have unique URLs.
import re

content = data.decode('utf-8', errors='ignore')

# Fix nav button
nav_btn = '''        <a href="https://popooshi.vercel.app/" target="_blank" rel="noopener noreferrer" class="nav-gacha-btn" style="text-decoration:none; background:linear-gradient(135deg, #6eb0ff, #5b8dee); border-color:rgba(255,255,255,0.2); color:#fff;" title="POPOOSHIで遊ぶ">
          <span class="nav-gacha-btn-label nav-gacha-btn-label--full">🎮 POPOOSHI</span>
          <span class="nav-gacha-btn-label nav-gacha-btn-label--compact" aria-hidden="true">🎮</span>
        </a>'''
content = re.sub(r'        <a href="https://popooshi\.vercel\.app/".*?class="nav-gacha-btn".*?</a>', nav_btn, content, flags=re.DOTALL)

# Fix hero button
hero_btn = '''        <a href="https://popooshi.vercel.app/" target="_blank" rel="noopener noreferrer" class="hero-quick-link" style="background:linear-gradient(135deg, #6eb0ff, #5b8dee); color:#fff; border-color:rgba(255,255,255,0.1);" title="POPOOSHIで遊ぶ">
          <span class="hero-gacha-label hero-gacha-label--full">🎮 POPOOSHIで遊ぶ</span>
          <span class="hero-gacha-label hero-gacha-label--compact" aria-hidden="true">🎮 ゲーム</span>
        </a>'''
content = re.sub(r'        <a href="https://popooshi\.vercel\.app/".*?class="hero-quick-link".*?</a>', hero_btn, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fix applied")
