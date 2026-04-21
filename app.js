/* ============================================================
   POPOPO お出かけマップ — app.js
   Firebase Firestore連携 + コミュニティ投稿機能
   ============================================================ */

// ============================================================
// 1. FIREBASE 設定
//    Firebase Console (console.firebase.google.com) でプロジェクト作成後
//    「プロジェクト設定 > マイアプリ > SDK の設定と構成」からコピー
// ============================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBpT9sGsfC_G3qK-Y298ajeBZ94ZC7lIoo",
  authDomain: "popopo-outing-map.firebaseapp.com",
  projectId: "popopo-outing-map",
  storageBucket: "popopo-outing-map.firebasestorage.app",
  messagingSenderId: "529529969026",
  appId: "1:529529969026:web:4a6e645d50c5a6bc07d79b",
  measurementId: "G-L40134RLX0"
};
const USE_FIREBASE = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";

// ============================================================
// 2. スポットデータ
// ============================================================
const SPOTS = [
  // --- 飲食店 ---
  { id: 'lion', cat: 'food', emoji: '☕', name: '名曲喫茶ライオン', area: '道玄坂', pref: '東京', url: 'https://tabelog.com/tokyo/A1303/A130301/13001723/', memo: '名曲を聴きながら楽しめる喫茶店' },
  { id: 'beltz', cat: 'food', emoji: '🍽️', name: 'BELTZ', area: '渋谷・広尾', pref: '東京', url: 'https://beltztokyo.stores.jp/', memo: '' },
  { id: 'torikatsu', cat: 'food', emoji: '🍗', name: 'とりかつ', area: '道玄坂', pref: '東京', url: 'https://tabelog.com/tokyo/A1303/A130301/13001699/', memo: '' },
  { id: 'hinto', cat: 'food', emoji: '🍜', name: '貧頭', area: '兵庫県西宮市', pref: '兵庫', url: 'https://tabelog.com/hyogo/A2803/A280301/28000906/', memo: '' },
  { id: 'karayaki', cat: 'food', emoji: '🍕', name: '釜焼きラトマト', area: '渋谷区百人町', pref: '東京', url: 'https://tabelog.com/tokyo/A1304/A130404/13263740/', memo: '' },
  {
    id: 'yugi', cat: 'food', emoji: '🥟', name: '友誼商店', area: '池袋', pref: '東京',
    url: 'https://tabelog.com/tokyo/A1305/A130501/13235881/',
    memo: '小籠包・涼皮（りゃんぴー）・朝はお粥・油条（ヨウティヤオ）がおすすめ！'
  },
  { id: 'haidilao', cat: 'food', emoji: '🫕', name: 'ハイディーラオ', area: '全国', pref: '全国', url: 'https://www.haidilao.com/jp/', memo: '人気の四川火鍋チェーン' },
  { id: 'dennys', cat: 'food', emoji: '☕', name: 'デニーズ', area: '全国', pref: '全国', url: 'https://www.dennys.jp', memo: 'ジャンバラヤ・麻辣湯がおすすめ' },
  { id: 'manchs', cat: 'food', emoji: '🍔', name: "マンチズバーガー", area: '港区芝', pref: '東京', url: 'https://tabelog.com/tokyo/A1314/A131401/13121856/', memo: 'あのトラちゃんも食べた！' },
  // --- 食べたいもの（モヒンガー） ---
  { id: 'mohinga', cat: 'mohinga', emoji: '🍜', name: 'モヒンガー（ミャンマー料理）', area: '高田馬場など', pref: '東京', url: 'https://otonano-shumatsu.com/articles/488762', memo: 'ミャンマーの国民食！ぜひ食べたい。詳しくはリンク先から。' },
  // --- 美術館・博物館 ---
  { id: 'yamatane', cat: 'museum', emoji: '🎨', name: '山種美術館', area: '渋谷・広尾', pref: '東京', url: 'https://www.yamatane-museum.jp/', memo: '日本画専門の美術館' },
  { id: 'nmwa', cat: 'museum', emoji: '🏛️', name: '国立西洋美術館', area: '上野', pref: '東京', url: 'https://www.nmwa.go.jp/jp/', memo: 'ル・コルビュジエ設計の世界遺産建築' },
  { id: 'edo', cat: 'museum', emoji: '🗼', name: '江戸東京博物館', area: '墨田区', pref: '東京', url: 'https://www.edo-tokyo-museum.or.jp/', memo: '江戸〜東京の歴史を体感できる' },
  { id: 'hokusai', cat: 'museum', emoji: '🌊', name: 'すみだ北斎美術館', area: '墨田区', pref: '東京', url: 'https://hokusai-museum.jp/', memo: '葛飾北斎の作品を多数展示' },
  // --- イベント ---
  { id: 'yoyogi', cat: 'event', emoji: '🌿', name: '代々木公園 イベント', area: '代々木公園', pref: '東京', url: 'https://www.yoyogikoen.info/', memo: 'さまざまなイベントが開催される都心の公園' },
  // --- エンタメ ---
  { id: 'hazbin', cat: 'entertainment', emoji: '🎬', name: 'ハズビン・ホテル', area: 'Amazon Prime Video', pref: 'オンライン', url: 'https://www.amazon.co.jp/gp/video/detail/B0CLM8CW52/ref=atv_dp_share_cu_r', memo: 'おすすめアニメ。大人向けミュージカルアニメ。' },
  { id: 'doc72', cat: 'entertainment', emoji: '📺', name: 'ドキュメント72時間', area: 'NHK', pref: 'オンライン', url: 'https://www.nhk.jp/g/ts/W3W8WRN8M3/', memo: 'おすすめドキュメンタリー番組（NHK）' },
];

// ============================================================
// 3. 行った場所データ
// ============================================================
const VISITED = [
  {
    id: 'aagan', cat: 'food', name: 'アーガン', area: '新宿区大久保', pref: '東京',
    url: 'https://tabelog.com/tokyo/A1304/A130404/13196997/',
    rating: 5,
    review: '美味しい😋 おかわりの量に感動！',
    photos: [
      { label: '📷 写真①', url: 'https://drive.proton.me/urls/1VV92P0RBM#KDnMGm7KD8Vx' },
      { label: '📷 写真②', url: 'https://drive.proton.me/urls/PNMKER3AEG#JHsS75MDYpDG' }
    ]
  },
  {
    id: 'rosetsu', cat: 'museum', name: '府中市美術館 — 長沢蘆雪展', area: '府中市', pref: '東京',
    url: 'https://www.city.fuchu.tokyo.jp/art/index.html',
    rating: 5,
    review: '日本の可愛い芸術の原点✨ 蘆雪の躍動感ある筆致に感動！',
    photos: [
      { label: '📷 写真①', url: 'https://drive.proton.me/urls/ZG0W0T859M#DJGWj24bgXdY' },
      { label: '📷 写真②', url: 'https://drive.proton.me/urls/4PARCBE5S8#JrIu8GQNjevS' }
    ],
    book: {
      title: '『子犬の絵画史 たのしい日本美術』 金子信久 著',
      url: 'https://www.amazon.co.jp/dp/4065280842',
      note: '渋谷区図書館にあるかも（事前予約可）'
    }
  }
];

// ============================================================
// 4. Firebase & LocalStorage 統合
// ============================================================
let db = null;
let localPosts = JSON.parse(localStorage.getItem('popopo_posts') || '[]');
let localLikes = JSON.parse(localStorage.getItem('popopo_likes') || '{}');
let localSuggestions = JSON.parse(localStorage.getItem('popopo_suggestions') || '[]');
let selectedRating = 0;
let allPosts = [];

function initFirebase() {
  if (!USE_FIREBASE) {
    document.getElementById('firebaseNotice').style.display = 'block';
    return false;
  }
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    console.log('✅ Firebase 接続成功！');
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e);
    document.getElementById('firebaseNotice').style.display = 'block';
    return false;
  }
}

async function saveSpotSuggestion(data) {
  const s = { ...data, id: 's_' + Date.now(), timestamp: Date.now(), suggested: true };
  localSuggestions.unshift(s);
  localStorage.setItem('popopo_suggestions', JSON.stringify(localSuggestions));
  if (db) {
    try { await db.collection('suggestions').add({ ...data, timestamp: firebase.firestore.FieldValue.serverTimestamp() }); }
    catch(e) { console.warn(e); }
  }
  return s;
}

async function saveLike(spotId) {
  localLikes[spotId] = (localLikes[spotId] || 0) + 1;
  localStorage.setItem('popopo_likes', JSON.stringify(localLikes));
  if (db) {
    try {
      const ref = db.collection('likes').doc(spotId);
      await ref.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
    } catch (e) { console.warn(e); }
  }
}

async function getLikeCount(spotId) {
  if (db) {
    try {
      const doc = await db.collection('likes').doc(spotId).get();
      if (doc.exists) return doc.data().count || 0;
    } catch (e) { /* fallback */ }
  }
  return localLikes[spotId] || 0;
}

async function savePost(postData) {
  const post = { ...postData, timestamp: Date.now(), id: 'p_' + Date.now() };
  localPosts.unshift(post);
  localStorage.setItem('popopo_posts', JSON.stringify(localPosts));
  if (db) {
    try {
      await db.collection('posts').add({ ...postData, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    } catch (e) { console.warn(e); }
  }
  return post;
}

function listenPosts(callback) {
  if (db) {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snap => {
      const posts = snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      callback(posts);
    }, () => callback(localPosts));
  } else {
    callback(localPosts);
  }
}

function listenSuggestions(callback) {
  if (db) {
    db.collection('suggestions').orderBy('timestamp', 'desc').onSnapshot(snap => {
      const suggestions = snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      callback(suggestions);
    }, () => callback(localSuggestions));
  } else {
    callback(localSuggestions);
  }
}

async function trackPageView() {
  const viewsEl = document.getElementById('statViews');
  if (db) {
    try {
      const ref = db.collection('likes').doc('page_views');
      ref.onSnapshot(doc => {
        viewsEl.textContent = doc.exists ? (doc.data().count || 0) : 0;
      });
      if (!sessionStorage.getItem('popopo_viewed')) {
        await ref.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
        sessionStorage.setItem('popopo_viewed', 'true');
      }
    } catch (e) {
      console.warn('Page view tracking failed', e);
      viewsEl.textContent = '-';
    }
  } else {
    viewsEl.textContent = 'Demo';
  }
}

// ============================================================
// 5. レンダリング関数
// ============================================================
function renderStars(n, max = 5) {
  return '★'.repeat(n) + '☆'.repeat(max - n);
}

function renderSpotCards(cat = 'all') {
  const grid = document.getElementById('spotsGrid');
  const allSpots = [
    ...SPOTS,
    ...localSuggestions.map(s => ({
      id: s.id, cat: s.cat, emoji: getCatEmoji(s.cat),
      name: s.name, area: s.area, pref: '',
      url: s.url || '', memo: s.reason, suggested: true,
      suggestedBy: s.nickname || '匿名リスナー'
    }))
  ];
  const filtered = cat === 'all' ? allSpots : allSpots.filter(s => s.cat === cat);
  grid.innerHTML = filtered.map(s => `
    <div class="spot-card" data-cat="${s.cat}" data-id="${s.id}">
      <div class="spot-card-top">
        <span class="spot-emoji">${s.emoji}</span>
        <button class="spot-like-btn ${localLikes[s.id] ? 'liked' : ''}" data-id="${s.id}" id="like-${s.id}">
          ${localLikes[s.id] ? '❤️' : '🤍'} <span id="like-count-${s.id}">${localLikes[s.id] || 0}</span>
        </button>
      </div>
      <div class="spot-name">${s.name}${s.suggested ? ' <span class="suggest-badge">✨ リスナー推薦</span>' : ''}</div>
      <div class="spot-area"><span>📍 ${s.area}${s.pref && s.pref !== '東京' && s.pref !== '全国' && s.pref !== 'オンライン' ? '（' + s.pref + '）' : ''}</span></div>
      ${s.memo ? `<div class="spot-memo">${escHtml(s.memo)}</div>` : ''}
      ${s.suggested ? `<div class="spot-memo" style="font-size:0.78rem;color:var(--text-dim);">提案者：${escHtml(s.suggestedBy)}</div>` : ''}
      <div class="spot-footer">
        ${s.url ? `<a href="${s.url}" target="_blank" rel="noopener" class="spot-link">🔗 詳細を見る</a>` : ''}
        <button class="spot-post-btn" data-spotname="${s.name}">📝 行ってみた！</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.spot-like-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sid = btn.dataset.id;
      await saveLike(sid);
      btn.classList.add('liked');
      btn.innerHTML = `❤️ <span id="like-count-${sid}">${localLikes[sid] || 0}</span>`;
    });
  });
  grid.querySelectorAll('.spot-post-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.spotname));
  });

  // スポット数更新（提案含む）
  document.getElementById('statSpots').textContent = allSpots.length;
}

function getCatEmoji(cat) {
  return { food: '🍴', mohinga: '🍜', museum: '🎨', event: '🌿', entertainment: '🎬' }[cat] || '📍';
}

function formatMemo(memo) {
  return `<p>${escHtml(memo)}</p>`;
}

function renderVisited() {
  const grid = document.getElementById('visitedGrid');
  grid.innerHTML = VISITED.map(v => `
    <div class="visited-card">
      <div class="visited-card-body">
        <span class="visited-category-badge ${v.cat}">${v.cat === 'food' ? '🍽️ グルメ' : '🎨 美術館'}</span>
        <div class="visited-name">${v.name}</div>
        <div class="visited-area">📍 ${v.area}</div>
        <div class="visited-rating">${renderStars(v.rating)}</div>
        <div class="visited-review">"${v.review}"</div>
        <div class="visited-photos">
          ${v.photos.map(p => `<a href="${p.url}" target="_blank" rel="noopener" class="visited-photo-link">${p.label}</a>`).join('')}
          ${v.url ? `<a href="${v.url}" target="_blank" rel="noopener" class="visited-photo-link">🔗 食べログ</a>` : ''}
        </div>
        ${v.book ? `
          <div class="visited-book">
            📚 <strong>関連本：</strong><a href="${v.book.url}" target="_blank" rel="noopener">${v.book.title}</a><br>
            <span style="font-size:0.78rem;opacity:0.7;">${v.book.note}</span>
          </div>` : ''}
      </div>
    </div>
  `).join('');
}

function renderPosts(posts) {
  const grid = document.getElementById('postsGrid');
  const empty = document.getElementById('postsEmpty');
  const sort = document.getElementById('sortSelect').value;
  const spotF = document.getElementById('spotFilter').value;

  let filtered = [...posts];
  if (spotF !== 'all') filtered = filtered.filter(p => p.spotName === spotF);
  if (sort === 'newest') filtered.sort((a, b) => b.timestamp - a.timestamp);
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  if (filtered.length === 0) {
    empty.style.display = 'block';
    const existing = grid.querySelectorAll('.post-card');
    existing.forEach(el => el.remove());
    return;
  }
  empty.style.display = 'none';

  const existingCards = grid.querySelectorAll('.post-card');
  existingCards.forEach(el => el.remove());

  filtered.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    const dateStr = post.visitDate ? new Date(post.visitDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }) : '日付不明';
    card.innerHTML = `
      <div class="post-card-top">
        <span class="post-nick">🙂 ${escHtml(post.nickname || '匿名リスナー')}</span>
        <span class="post-rating">${renderStars(post.rating || 0)}</span>
      </div>
      <div class="post-spot-badge">📍 ${escHtml(post.spotName)}</div>
      <div class="post-comment">${escHtml(post.comment)}</div>
      <div class="post-footer">
        <span class="post-date">${dateStr}</span>
        ${post.photoUrl ? `<a href="${escHtml(post.photoUrl)}" target="_blank" rel="noopener" class="post-photo-link">📷 写真を見る</a>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });

  // 統計更新
  document.getElementById('statPosts').textContent = posts.length;
}

function populateSpotFilter(posts) {
  const sel = document.getElementById('spotFilter');
  const allSpotNames = [...new Set([
    ...SPOTS.map(s => s.name),
    ...localSuggestions.map(s => s.name),
    ...posts.map(p => p.spotName).filter(Boolean)
  ])];
  const current = sel.value;
  sel.innerHTML = '<option value="all">すべて</option>' +
    allSpotNames.map(n => `<option value="${n}"${n === current ? ' selected' : ''}>${n}</option>`).join('');
}

function populateModalSpotSelect(preselect = '') {
  const sel = document.getElementById('fSpot');
  const allSpots = [
    ...SPOTS,
    ...localSuggestions.map(s => ({ name: s.name, area: s.area, emoji: getCatEmoji(s.cat) }))
  ];
  sel.innerHTML = '<option value="">-- スポットを選択 --</option>' +
    allSpots.map(s => `<option value="${s.name}"${s.name === preselect ? ' selected' : ''}>${s.emoji} ${s.name}（${s.area}）</option>`).join('');
}

// ============================================================
// 6. モーダル制御
// ============================================================
// スポット追加モーダル
function openAddSpotModal() {
  document.getElementById('addSpotModal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
  document.getElementById('addSpotForm').reset();
  document.getElementById('asCharNum').textContent = '0';
}
function closeAddSpotModal() {
  document.getElementById('addSpotModal').classList.remove('is-open');
  document.body.style.overflow = '';
}

// 投稿モーダル
function openModal(preselect = '') {
  document.getElementById('postModal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
  populateModalSpotSelect(preselect);
  resetForm();
}

function closeModal() {
  document.getElementById('postModal').classList.remove('is-open');
  document.body.style.overflow = '';
}

function resetForm() {
  document.getElementById('postForm').reset();
  selectedRating = 0;
  document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('charNum').textContent = '0';
}

// ============================================================
// 7. フォーム送信
// ============================================================
// スポット追加フォーム送信
document.getElementById('addSpotForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('asName').value.trim();
  const area = document.getElementById('asArea').value.trim();
  const reason = document.getElementById('asReason').value.trim();
  if (!name || !area || !reason) { alert('必須項目を入力してください'); return; }
  const btn = document.getElementById('addSpotSubmitBtn');
  btn.disabled = true; btn.textContent = '送信中...';
  const data = {
    name, area,
    cat: document.getElementById('asCat').value,
    reason,
    url: document.getElementById('asUrl').value.trim(),
    nickname: document.getElementById('asNick').value.trim()
  };
  try {
    await saveSpotSuggestion(data);
    closeAddSpotModal();
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    showToast('スポットを追加しました！ありがとうございます ✨');
  } catch(err) {
    alert('追加に失敗しました。もう一度お試しください。');
  } finally {
    btn.disabled = false; btn.textContent = '追加する ✨';
  }
});

// 行ってみた投稿フォーム送信
document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const spotSel = document.getElementById('fSpot').value;
  const spotFree = document.getElementById('fSpotFree').value.trim();
  const spotName = spotFree || spotSel;

  if (!spotName) { alert('スポット名を選択または入力してください'); return; }
  const comment = document.getElementById('fComment').value.trim();
  if (!comment) { alert('コメントを入力してください'); return; }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = '送信中...';

  const nickname = document.getElementById('fNick').value.trim() || '匿名リスナー';

  // もし自由入力で新しいスポットが入力されたら、行きたい場所リスト（suggestions）にも自動追加する
  if (spotFree && !SPOTS.some(s => s.name === spotFree) && !localSuggestions.some(s => s.name === spotFree)) {
    try {
      await saveSpotSuggestion({
        name: spotFree,
        area: 'エリア不明（リスナー投稿）',
        cat: 'food',
        reason: 'リスナーさんが行っておすすめしてくれたスポットです！',
        url: '',
        nickname: nickname
      });
      // Spotsを再描画
      const activeTab = document.querySelector('.tab.active');
      renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    } catch (err) {
      console.warn('スポット自動追加に失敗', err);
    }
  }

  const postData = {
    nickname: nickname === '匿名リスナー' ? '' : nickname,
    spotName,
    visitDate: document.getElementById('fDate').value,
    rating: selectedRating,
    comment,
    photoUrl: document.getElementById('fPhoto').value.trim()
  };

  try {
    await savePost(postData);
    closeModal();
    listenPosts(posts => { allPosts = posts; renderPosts(posts); populateSpotFilter(posts); });
    showToast('投稿しました！ありがとうございます 🎉');
  } catch (err) {
    console.error(err);
    alert('投稿に失敗しました。もう一度お試しください。');
  } finally {
    btn.disabled = false; btn.textContent = '投稿する 🚀';
  }
});

// ============================================================
// 8. ユーティリティ
// ============================================================
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:32px;left:50%;transform:translateX(-50%);
    background:var(--blue);color:#fff;font-weight:700;
    padding:14px 28px;border-radius:50px;
    box-shadow:0 8px 32px rgba(91,141,238,0.4);z-index:9999;
    animation:fadeUp 0.3s ease;font-size:0.92rem;white-space:nowrap;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ============================================================
// 9. イベントバインド
// ============================================================
function bindEvents() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navMobile').classList.toggle('open');
  });
  document.querySelectorAll('.nav-mobile-link').forEach(l => {
    l.addEventListener('click', () => document.getElementById('navMobile').classList.remove('open'));
  });
  ['navPostBtn','mobilePostBtn','heroPostBtn','communityPostBtn','emptyPostBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => openModal());
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('postModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('postModal')) closeModal();
  });
  // スポット追加モーダル
  document.getElementById('addSpotBtn').addEventListener('click', openAddSpotModal);
  document.getElementById('addSpotModalClose').addEventListener('click', closeAddSpotModal);
  document.getElementById('addSpotCancelBtn').addEventListener('click', closeAddSpotModal);
  document.getElementById('addSpotModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('addSpotModal')) closeAddSpotModal();
  });
  document.getElementById('asReason').addEventListener('input', function() {
    document.getElementById('asCharNum').textContent = this.value.length;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeAddSpotModal(); }
  });
  document.getElementById('tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderSpotCards(tab.dataset.cat);
  });
  document.getElementById('starPicker').addEventListener('click', (e) => {
    const btn = e.target.closest('.star-btn');
    if (!btn) return;
    selectedRating = parseInt(btn.dataset.val);
    document.querySelectorAll('.star-btn').forEach((b, i) => {
      b.classList.toggle('active', i < selectedRating);
    });
  });
  document.getElementById('fComment').addEventListener('input', function () {
    document.getElementById('charNum').textContent = this.value.length;
  });
  document.getElementById('sortSelect').addEventListener('change', () => renderPosts(allPosts));
  document.getElementById('spotFilter').addEventListener('change', () => renderPosts(allPosts));
}

// ============================================================
// 10. 初期化
// ============================================================
function init() {
  initFirebase();
  
  // スポット追加をリッスン
  listenSuggestions(suggestions => {
    localSuggestions = suggestions;
    localStorage.setItem('popopo_suggestions', JSON.stringify(localSuggestions));
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
  });

  renderVisited();

  // 投稿をリッスン
  listenPosts(posts => {
    allPosts = posts;
    renderPosts(posts);
    populateSpotFilter(posts);
  });

  // 統計
  document.getElementById('statSpots').textContent = SPOTS.length;
  document.getElementById('statVisited').textContent = VISITED.length;
  trackPageView();

  bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
