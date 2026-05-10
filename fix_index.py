
import os

path = '/Users/onoderamasaru/.gemini/antigravity/scratch/popopo-site/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove playground section
import re
content = re.sub(r'  <!-- おたのしみ・遊び場 -->.*?<!-- フッター -->', '  <!-- フッター -->', content, flags=re.DOTALL)

# 2. Remove how-to-use entry 7
content = content.replace('''        <div style="margin-bottom:16px;">
          <h4 style="color:var(--blue);margin-bottom:8px;">7. 遊び場でゲームを楽しむ 🎡</h4>
          <p>「おたのしみ」セクションでは、リスナー有志によるファンゲーム「POPOOSHI」で遊ぶことができます。ぜひチェックしてみてください！</p>
        </div>''', '')

# 3. Add buttons
nav_target = '<button type="button" class="nav-gacha-btn" id="navGachaOpenBtn" aria-label="おすすめや感想から、ポポッと選びます" title="ポポッと選ぶ">'
nav_replacement = nav_target + '''
        <a href="https://popooshi.vercel.app/" target="_blank" rel="noopener noreferrer" class="nav-gacha-btn" style="text-decoration:none; background:linear-gradient(135deg, #6eb0ff, #5b8dee); border-color:rgba(255,255,255,0.2); color:#fff;" title="POPOOSHIで遊ぶ">
          <span class="nav-gacha-btn-label nav-gacha-btn-label--full">🎮 POPOOSHI</span>
          <span class="nav-gacha-btn-label nav-gacha-btn-label--compact" aria-hidden="true">🎮</span>
        </a>'''
content = content.replace(nav_target, nav_replacement)

hero_target = '<button type="button" class="hero-quick-link hero-quick-link--gacha" id="heroGachaBtn" aria-label="おすすめや感想から、ポポッと選びます" title="ポポッと選ぶ">'
hero_replacement = hero_target + '''
        <a href="https://popooshi.vercel.app/" target="_blank" rel="noopener noreferrer" class="hero-quick-link" style="background:linear-gradient(135deg, #6eb0ff, #5b8dee); color:#fff; border-color:rgba(255,255,255,0.1);" title="POPOOSHIで遊ぶ">
          <span class="hero-gacha-label hero-gacha-label--full">🎮 POPOOSHIで遊ぶ</span>
          <span class="hero-gacha-label hero-gacha-label--compact" aria-hidden="true">🎮 ゲーム</span>
        </a>'''
content = content.replace(hero_target, hero_replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
