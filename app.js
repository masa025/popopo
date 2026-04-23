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
let localChats = JSON.parse(localStorage.getItem('popopo_chats') || '[]');
let selectedRating = 0;
let allPosts = [];
let allChats = [];
let latestRemotePosts = [];
let latestRemoteSuggestions = [];
let latestRemoteChats = [];
let currentReviewSpotName = '';
const INITIAL_SPOT_COUNT = 6;
const INITIAL_REVIEW_COUNT = 6;
const INITIAL_CHAT_COUNT = 5;
const SPOT_RESOURCE_KIND_LABELS = {
  reference: '参考URL',
  photo: '写真',
  info: '情報'
};
const POST_RESOURCE_KIND_LABELS = {
  photo: '写真',
  post: '投稿URL',
  info: '情報'
};
const HERO_CARD_SLOTS_DESKTOP = [
  { top: '16%', left: '4%', width: '212px', rot: '-5deg', scale: '0.98', delay: '-1s' },
  { top: '20%', right: '5%', width: '208px', rot: '4deg', scale: '0.96', delay: '-3s' },
  { top: '60%', left: '6%', width: '202px', rot: '3deg', scale: '0.92', delay: '-5s' },
  { top: '68%', right: '6%', width: '218px', rot: '-4deg', scale: '0.95', delay: '-2s' }
];
const HERO_CARD_SLOTS_MOBILE = [
  { top: '12%', left: '4%', width: '118px', rot: '-5deg', scale: '0.88', delay: '-1s' },
  { top: '58%', right: '12%', width: '116px', rot: '4deg', scale: '0.86', delay: '-3s' }
];
const HERO_BACKDROP_ROTATE_MS = 12000;
let visibleSpotCount = INITIAL_SPOT_COUNT;
let visibleReviewCount = INITIAL_REVIEW_COUNT;
let visibleChatCount = INITIAL_CHAT_COUNT;
let heroBackdropTimer = null;
let heroBackdropVisibilityBound = false;
let heroBackdropResizeTimer = null;
let heroBackdropResizeBound = false;

function isMobileHeroLayout() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function getHeroCardSlots() {
  return isMobileHeroLayout() ? HERO_CARD_SLOTS_MOBILE : HERO_CARD_SLOTS_DESKTOP;
}

function setStatText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove('is-loading');
}

function showFirebaseNotice() {
  const notice = document.getElementById('firebaseNotice');
  if (notice) notice.style.display = 'block';
}

function initFirebase() {
  if (!USE_FIREBASE || typeof firebase === 'undefined') {
    showFirebaseNotice();
    return false;
  }
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    console.log('✅ Firebase 接続成功！');
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e);
    showFirebaseNotice();
    return false;
  }
}

async function saveSpotSuggestion(data) {
  const clientId = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const s = { ...data, id: clientId, clientId, timestamp: Date.now(), suggested: true };
  localSuggestions.unshift(s);
  localStorage.setItem('popopo_suggestions', JSON.stringify(localSuggestions));
  renderHeroBackdrop();
  if (db) {
    try { await db.collection('suggestions').add({ ...data, clientId, timestamp: firebase.firestore.FieldValue.serverTimestamp() }); }
    catch(e) { console.warn(e); }
  }
  return s;
}

function mergeSuggestions(remoteSuggestions = latestRemoteSuggestions) {
  const byKey = new Map();
  localSuggestions.forEach(spot => byKey.set(spot.clientId || spot.id, spot));
  remoteSuggestions.forEach(spot => byKey.set(spot.clientId || spot.id, spot));
  return Array.from(byKey.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

let globalLikes = {};

async function saveLike(spotId) {
  localLikes[spotId] = (localLikes[spotId] || 0) + 1;
  localStorage.setItem('popopo_likes', JSON.stringify(localLikes));
  // 画面上のカウントを即座に増やす（リスナー発火までのラグ対策）
  const countSpan = document.getElementById(`like-count-${spotId}`);
  if (countSpan) countSpan.textContent = (globalLikes[spotId] || 0) + 1;
  
  if (db) {
    try {
      const ref = db.collection('likes').doc(spotId);
      await ref.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
    } catch (e) { console.warn(e); }
  }
}

function listenLikes() {
  if (db) {
    db.collection('likes').onSnapshot(snap => {
      snap.docs.forEach(doc => {
        if (doc.id === 'page_views') return; // 除外
        globalLikes[doc.id] = doc.data().count || 0;
        const countSpan = document.getElementById(`like-count-${doc.id}`);
        if (countSpan) countSpan.textContent = globalLikes[doc.id];
      });
    });
  }
}

async function saveChat(chatData) {
  const clientId = 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const chat = { ...chatData, id: clientId, clientId, timestamp: Date.now() };
  localChats.unshift(chat);
  localStorage.setItem('popopo_chats', JSON.stringify(localChats));

  if (db) {
    db.collection('chats').add({
      ...chatData,
      clientId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.warn('Chat sync failed:', e));
  }

  return chat;
}

function mergeChats(remoteChats = latestRemoteChats) {
  const byKey = new Map();
  localChats.forEach(chat => byKey.set(chat.clientId || chat.id, chat));
  remoteChats.forEach(chat => byKey.set(chat.clientId || chat.id, chat));
  return Array.from(byKey.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

function updateChatsView(chats = null) {
  if (Array.isArray(chats)) allChats = chats;
  const currentChats = Array.isArray(chats) ? chats : (allChats.length ? allChats : mergeChats());
  renderChats(currentChats);
  setStatText('statPosts', currentChats.length);
}

function listenChats(callback) {
  if (db) {
    db.collection('chats').orderBy('timestamp', 'desc').onSnapshot(snap => {
      latestRemoteChats = snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      callback(mergeChats(latestRemoteChats));
    }, e => { console.warn('Chat listener failed:', e); callback(mergeChats([])); });
  } else {
    callback(mergeChats([]));
  }
}

async function savePost(postData) {
  const clientId = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const post = { ...postData, timestamp: Date.now(), id: clientId, clientId };
  localPosts.unshift(post);
  localStorage.setItem('popopo_posts', JSON.stringify(localPosts));
  renderHeroBackdrop();
  if (db) {
    try {
      await db.collection('posts').add({ ...postData, clientId, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    } catch (e) { console.warn(e); }
  }
  return post;
}

function mergePosts(remotePosts = latestRemotePosts) {
  const byKey = new Map();
  localPosts.forEach(post => byKey.set(post.clientId || post.id, post));
  remotePosts.forEach(post => byKey.set(post.clientId || post.id, post));
  return Array.from(byKey.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

function listenPosts(callback) {
  if (db) {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snap => {
      latestRemotePosts = snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      callback(mergePosts(latestRemotePosts));
      renderHeroBackdrop();
    }, () => {
      callback(mergePosts([]));
      renderHeroBackdrop();
    });
  } else {
    callback(mergePosts([]));
    renderHeroBackdrop();
  }
}

function listenSuggestions(callback) {
  if (db) {
    db.collection('suggestions').orderBy('timestamp', 'desc').onSnapshot(snap => {
      latestRemoteSuggestions = snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      callback(mergeSuggestions(latestRemoteSuggestions));
      renderHeroBackdrop();
    }, () => {
      callback(mergeSuggestions([]));
      renderHeroBackdrop();
    });
  } else {
    callback(mergeSuggestions([]));
    renderHeroBackdrop();
  }
}

async function trackPageView() {
  const viewsEl = document.getElementById('statViews');
  if (db) {
    try {
      const ref = db.collection('likes').doc('page_views');
      ref.onSnapshot(doc => {
        setStatText('statViews', doc.exists ? (doc.data().count || 0) : 0);
      });
      if (!sessionStorage.getItem('popopo_viewed')) {
        await ref.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
        sessionStorage.setItem('popopo_viewed', 'true');
      }
    } catch (e) {
      console.warn('Page view tracking failed', e);
      setStatText('statViews', '-');
    }
  } else {
    setStatText('statViews', 'Demo');
  }
}

// ============================================================
// 5. レンダリング関数
// ============================================================
function renderStars(n, max = 5) {
  return '★'.repeat(n) + '☆'.repeat(max - n);
}

function sortNewest(items = []) {
  return [...items].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

function isDirectImageUrl(url) {
  return /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(url || '');
}

function shuffleItems(items = []) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function truncateText(value, limit = 54) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

function getCatAccent(cat) {
  return {
    food: 'var(--cat-food)',
    mohinga: 'var(--cat-mohinga)',
    museum: 'var(--cat-museum)',
    event: 'var(--cat-event)',
    entertainment: 'var(--cat-entertainment)'
  }[cat] || 'var(--blue)';
}

function getResourceKindLabel(kind, context = 'spot') {
  if (context === 'post') {
    return POST_RESOURCE_KIND_LABELS[kind] || POST_RESOURCE_KIND_LABELS.info;
  }
  return SPOT_RESOURCE_KIND_LABELS[kind] || SPOT_RESOURCE_KIND_LABELS.reference;
}

function getResourceIcon(kind) {
  return {
    reference: '🔗',
    photo: '📷',
    post: '📝',
    info: 'ℹ️'
  }[kind] || '🔗';
}

function normalizeResourceEntry(entry, context = 'spot') {
  if (!entry) return null;
  if (typeof entry === 'string') {
    const kind = context === 'post' ? 'post' : 'reference';
    return { kind, label: getResourceKindLabel(kind, context), url: entry };
  }
  const kind = entry.kind || entry.type || (context === 'post' ? 'post' : 'reference');
  const label = entry.label || getResourceKindLabel(kind, context);
  const url = entry.url || '';
  if (!url) return null;
  return { kind, label, url };
}

function getSuggestionResources(spot) {
  if (Array.isArray(spot.resources) && spot.resources.length) {
    return spot.resources.map(entry => normalizeResourceEntry(entry, 'spot')).filter(Boolean);
  }
  if (Array.isArray(spot.urls) && spot.urls.length) {
    return spot.urls.map((url, i) => normalizeResourceEntry({
      kind: i === 0 ? 'reference' : 'reference',
      label: i === 0 ? '参考URL' : `参考URL${i + 1}`,
      url
    }, 'spot')).filter(Boolean);
  }
  if (spot.url) {
    return [normalizeResourceEntry({ kind: 'reference', label: '参考URL', url: spot.url }, 'spot')];
  }
  return [];
}

function getPostMedia(post) {
  if (Array.isArray(post.media) && post.media.length) {
    return post.media.map(entry => normalizeResourceEntry(entry, 'post')).filter(Boolean);
  }
  if (post.photoUrl) {
    return [normalizeResourceEntry({ kind: 'photo', label: '写真', url: post.photoUrl }, 'post')];
  }
  return [];
}

function getResourcePreviewImage(resources = []) {
  return resources.find(resource => isDirectImageUrl(resource.url))?.url || '';
}

function renderResourceLinks(resources = [], context = 'spot', className = 'spot-link') {
  if (!resources.length) return '';
  return resources.map((resource, i) => {
    const label = resource.label || getResourceKindLabel(resource.kind, context);
    const suffix = resources.length > 1 ? i + 1 : '';
    return `<a href="${escHtml(resource.url)}" target="_blank" rel="noopener" class="${className} ${className}--${escHtml(resource.kind || '')}">${getResourceIcon(resource.kind)} ${escHtml(label + suffix)}</a>`;
  }).join('');
}

function clearResourceValidation(context) {
  const errorId = context === 'post' ? 'fMediaError' : 'asUrlError';
  const error = document.getElementById(errorId);
  if (error) error.textContent = '';
  document.querySelectorAll(`.${context}-resource-url`).forEach(input => {
    input.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
  });
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function validateResourceEntries(context = 'spot') {
  const rows = Array.from(document.querySelectorAll(`.${context}-resource-row`));
  const errorId = context === 'post' ? 'fMediaError' : 'asUrlError';
  const error = document.getElementById(errorId);
  let firstInvalid = null;
  const entries = [];

  rows.forEach(row => {
    const kindEl = row.querySelector(`.${context}-resource-kind`);
    const urlEl = row.querySelector(`.${context}-resource-url`);
    const kind = kindEl?.value || (context === 'post' ? 'post' : 'reference');
    const url = urlEl?.value.trim() || '';
    if (!url) {
      if (urlEl) {
        urlEl.classList.remove('has-error');
        urlEl.removeAttribute('aria-invalid');
      }
      return;
    }
    if (!isValidHttpUrl(url)) {
      if (urlEl) {
        urlEl.classList.add('has-error');
        urlEl.setAttribute('aria-invalid', 'true');
      }
      if (!firstInvalid) firstInvalid = urlEl;
      return;
    }
    if (urlEl) {
      urlEl.classList.remove('has-error');
      urlEl.removeAttribute('aria-invalid');
    }
    entries.push({ kind, label: getResourceKindLabel(kind, context), url });
  });

  if (firstInvalid) {
    if (error) error.textContent = context === 'post'
      ? '写真・投稿URLは https:// または http:// から始まるURLを入力してください。'
      : '参考URLは https:// または http:// から始まるURLを入力してください。';
    firstInvalid.focus();
    return null;
  }

  if (error) error.textContent = '';
  return entries;
}

function buildHeroCards() {
  const slots = getHeroCardSlots();
  const spotCards = shuffleItems([
    ...sortNewest(localSuggestions).map(spot => ({
      kind: 'spot',
      kindLabel: 'おすすめスポット',
      title: spot.name,
      text: truncateText(spot.reason || spot.memo || spot.area, 42),
      meta: [spot.area ? `📍 ${spot.area}` : '', spot.cat ? getCatLabel(spot.cat) : ''].filter(Boolean).join(' ・ '),
      accent: spot.cat
    })),
    ...SPOTS.map(spot => ({
      kind: 'spot',
      kindLabel: 'おすすめスポット',
      title: spot.name,
      text: truncateText(spot.memo || spot.area, 42),
      meta: [spot.area ? `📍 ${spot.area}` : '', getCatLabel(spot.cat)].filter(Boolean).join(' ・ '),
      accent: spot.cat
    }))
  ]);
  const heroPosts = sortNewest([
    ...allPosts,
    ...localPosts
  ].reduce((map, post) => {
    const key = post.clientId || post.id;
    if (key) map.set(key, post);
    return map;
  }, new Map()).values());
  const reviews = shuffleItems([
    ...heroPosts.map(post => ({
      kind: 'review',
      kindLabel: 'みんなの感想',
      title: post.spotName || 'スポット',
      text: truncateText(post.comment || '', 42),
      meta: [post.rating ? renderStars(post.rating) : '', formatVisitDate(post.visitDate), post.nickname ? `👤 ${post.nickname}` : ''].filter(Boolean).join(' ・ '),
      accent: post.cat
    })),
    ...VISITED.map(visit => ({
      kind: 'review',
      kindLabel: 'みんなの感想',
      title: visit.name,
      text: truncateText(visit.review || '', 42),
      meta: [renderStars(visit.rating), visit.area ? `📍 ${visit.area}` : ''].filter(Boolean).join(' ・ '),
      accent: visit.cat
    }))
  ]);

  const reviewCards = shuffleItems(reviews);
  if (slots.length === 2) {
    return [
      spotCards[0] || reviewCards[0],
      reviewCards[0] || spotCards[0]
    ].filter(Boolean);
  }

  const cards = [
    spotCards[0] || reviewCards[0],
    reviewCards[0] || spotCards[0],
    reviewCards[1] || spotCards[1] || reviewCards[0],
    spotCards[1] || reviewCards[1] || spotCards[0]
  ].filter(Boolean);

  return cards.slice(0, slots.length);
}

function renderHeroBackdrop() {
  const host = document.getElementById('heroShowcase');
  if (!host) return;
  const cards = buildHeroCards();
  const slots = getHeroCardSlots();
  const isMobile = slots.length === 2;
  host.innerHTML = cards.map((card, index) => {
    const slot = slots[index % slots.length];
    const style = [
      slot.top ? `top:${slot.top}` : '',
      slot.bottom ? `bottom:${slot.bottom}` : '',
      slot.left ? `left:${slot.left}` : '',
      slot.right ? `right:${slot.right}` : '',
      `width:${slot.width}`,
      `--card-rot:${slot.rot}`,
      `--card-scale:${slot.scale || 1}`,
      `--card-opacity:${(isMobile ? 0.48 : 0.2) + (index * (isMobile ? 0.08 : 0.03))}`,
      `--float-delay:${slot.delay}`,
      `--hero-accent:${getCatAccent(card.accent)}`
    ].filter(Boolean).join(';');
    return `
      <div class="hero-float-card" style="${style}">
        <div class="hero-float-card-inner">
          <span class="hero-float-kind">${escHtml(card.kindLabel)}</span>
          <div class="hero-float-title">${escHtml(card.title)}</div>
          <div class="hero-float-text">${escHtml(card.text)}</div>
          ${card.meta ? `<div class="hero-float-meta">${escHtml(card.meta)}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function startHeroBackdropRotation() {
  if (heroBackdropTimer || !document.getElementById('heroShowcase')) return;
  heroBackdropTimer = window.setInterval(() => {
    if (!document.hidden) renderHeroBackdrop();
  }, HERO_BACKDROP_ROTATE_MS);

  if (!heroBackdropVisibilityBound) {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) renderHeroBackdrop();
    });
    heroBackdropVisibilityBound = true;
  }

  if (!heroBackdropResizeBound) {
    window.addEventListener('resize', () => {
      window.clearTimeout(heroBackdropResizeTimer);
      heroBackdropResizeTimer = window.setTimeout(() => {
        if (!document.hidden) renderHeroBackdrop();
      }, 150);
    });
    heroBackdropResizeBound = true;
  }
}

function updateMoreButton(id, total, visible, initialCount) {
  const btn = document.getElementById(id);
  if (!btn) return;
  if (total <= initialCount) {
    btn.style.display = 'none';
    return;
  }
  btn.style.display = 'inline-flex';
  if (visible >= total) {
    btn.textContent = '表示を少なくする';
    btn.dataset.mode = 'collapse';
  } else {
    btn.textContent = `もっと見る（残り${total - visible}件）`;
    btn.dataset.mode = 'more';
  }
}

function getSpotReviews(spotName) {
  const target = String(spotName || '').trim();
  if (!target) return [];
  return sortNewest(allPosts.filter(p => String(p.spotName || '').trim() === target));
}

function formatVisitDate(date) {
  return date ? new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }) : '日付不明';
}

function renderSpotCards(cat = 'all') {
  const grid = document.getElementById('spotsGrid');
  const suggestedSpots = sortNewest(localSuggestions).map(s => ({
    id: s.id, cat: s.cat, catLabel: getCatLabel(s.cat),
    name: s.name, area: s.area, pref: '',
    url: s.url || '', resources: getSuggestionResources(s), memo: s.reason, suggested: true,
    suggestedBy: s.nickname || '匿名リスナー'
  }));
  const allSpots = [
    ...suggestedSpots,
    ...SPOTS
  ];
  const filtered = cat === 'all' ? allSpots : allSpots.filter(s => s.cat === cat);
  const visibleSpots = filtered.slice(0, visibleSpotCount);
  grid.innerHTML = visibleSpots.map(s => {
    const reviewCount = getSpotReviews(s.name).length;
    const resources = getSuggestionResources(s);
    const previewImage = getResourcePreviewImage(resources);
    return `
    <div class="spot-card" data-cat="${s.cat}" data-id="${s.id}">
      <div class="spot-card-top">
        <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);margin-bottom:0;font-size:0.8rem;">${s.catLabel || getCatLabel(s.cat)}</span>
        <button class="spot-like-btn ${localLikes[s.id] ? 'liked' : ''}" data-id="${s.id}" id="like-${s.id}">
          ${localLikes[s.id] ? '❤️' : '🤍'} <span id="like-count-${s.id}">${globalLikes[s.id] || localLikes[s.id] || 0}</span>
        </button>
      </div>
      ${previewImage ? `<img class="spot-preview-img" src="${escHtml(previewImage)}" alt="" loading="lazy">` : ''}
      <div class="spot-name">${escHtml(s.name)}</div>
      <div class="spot-area"><span>📍 ${escHtml(s.area)}${s.pref && s.pref !== '東京' && s.pref !== '全国' && s.pref !== 'オンライン' ? '（' + escHtml(s.pref) + '）' : ''}</span></div>
      ${s.memo ? `<div class="spot-memo">${escHtml(s.memo)}</div>` : ''}
      ${s.suggested ? `<div class="spot-memo" style="font-size:0.78rem;color:var(--text-dim);">提案者：${escHtml(s.suggestedBy)}</div>` : ''}
      ${previewImage ? `<img class="spot-preview-img" src="${escHtml(previewImage)}" alt="" loading="lazy">` : ''}
      ${resources.length ? `<div class="spot-resources">${renderResourceLinks(resources, 'spot', 'spot-link')}</div>` : ''}
      <div class="spot-footer">
        <button class="spot-reviews-btn" data-spotname="${escHtml(s.name)}">💬 みんなの感想（${reviewCount}件）</button>
        <button class="spot-post-btn" data-spotname="${escHtml(s.name)}">📝 行ってみた！</button>
      </div>
    </div>
  `;
  }).join('');

  grid.querySelectorAll('.spot-like-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sid = btn.dataset.id;
      await saveLike(sid);
      btn.classList.add('liked');
      btn.querySelector('span').previousSibling.textContent = '❤️ ';
    });
  });
  grid.querySelectorAll('.spot-post-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.spotname));
  });
  grid.querySelectorAll('.spot-reviews-btn').forEach(btn => {
    btn.addEventListener('click', () => openSpotReviews(btn.dataset.spotname));
  });

  // スポット数更新（提案含む）
  setStatText('statSpots', allSpots.length);
  updateMoreButton('spotsMoreBtn', filtered.length, Math.min(visibleSpotCount, filtered.length), INITIAL_SPOT_COUNT);
}

function getCatLabel(cat) {
  return { food: '🍴 飲食店', mohinga: '🍜 食べたいもの', museum: '🎨 美術館・博物館', event: '🌿 イベント', entertainment: '🎬 エンタメ' }[cat] || '📍 スポット';
}

function formatMemo(memo) {
  return `<p>${escHtml(memo)}</p>`;
}

function renderSpotReviewCards(reviews) {
  return reviews.map(p => {
    const areaStr = p.area ? `📍 ${escHtml(p.area)}` : '📍 エリア不明';
    const nickname = p.nickname || '匿名リスナー';
    const media = getPostMedia(p);
    const previewImage = getResourcePreviewImage(media);
    return `
      <article class="spot-review-card">
        <div class="spot-review-head">
          <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);">${getCatLabel(p.cat)}</span>
          <span class="spot-review-rating">${renderStars(p.rating || 0)}</span>
        </div>
        <div class="spot-review-meta">${areaStr} &nbsp; 📅 ${formatVisitDate(p.visitDate)} &nbsp; 👤 ${escHtml(nickname)}</div>
        ${previewImage ? `<img class="spot-preview-img" src="${escHtml(previewImage)}" alt="" loading="lazy">` : ''}
        <div class="spot-review-comment">"${escHtml(p.comment)}"</div>
        ${media.length ? `<div class="visited-photos">${renderResourceLinks(media, 'post', 'visited-photo-link')}</div>` : ''}
      </article>
    `;
  }).join('');
}

function renderVisited(posts = []) {
  const grid = document.getElementById('visitedGrid');
  const sortedPosts = sortNewest(posts);
  
  const officialCards = VISITED.map(v => `
    <div class="visited-card">
      <div class="visited-card-body">
        <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);">${getCatLabel(v.cat)}</span>
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
  `);

  const listenerCards = sortedPosts.map(p => {
    const dateStr = formatVisitDate(p.visitDate);
    const areaStr = p.area ? `📍 ${escHtml(p.area)}` : '📍 エリア不明';
    const nickname = p.nickname || '匿名リスナー';
    const media = getPostMedia(p);
    const previewImage = getResourcePreviewImage(media);
    return `
    <div class="visited-card">
      <div class="visited-card-body">
        <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);">${getCatLabel(p.cat)}</span>
        <div class="visited-name">${escHtml(p.spotName)}</div>
        <div class="visited-area">${areaStr} &nbsp; 📅 ${dateStr} &nbsp; 👤 ${escHtml(nickname)}</div>
        <div class="visited-rating">${renderStars(p.rating || 0)}</div>
        ${previewImage ? `<img class="spot-preview-img" src="${escHtml(previewImage)}" alt="" loading="lazy">` : ''}
        <div class="visited-review">"${escHtml(p.comment)}"</div>
        ${media.length ? `<div class="visited-photos">${renderResourceLinks(media, 'post', 'visited-photo-link')}</div>` : ''}
      </div>
    </div>
    `;
  });

  const allCards = [...listenerCards, ...officialCards];
  grid.innerHTML = allCards.slice(0, visibleReviewCount).join('');
  setStatText('statVisited', allCards.length);
  updateMoreButton('visitedMoreBtn', allCards.length, Math.min(visibleReviewCount, allCards.length), INITIAL_REVIEW_COUNT);
}

function renderChats(chats) {
  const grid = document.getElementById('chatsGrid');
  const empty = document.getElementById('chatsEmpty');

  if (chats.length === 0) {
    empty.style.display = 'block';
    empty.innerHTML = '<div class="empty-icon">💬</div><p>まだつぶやきがありません。<br>最初のメッセージを書き込んでみませんか？</p>';
    grid.innerHTML = '';
    updateMoreButton('chatsMoreBtn', 0, 0, INITIAL_CHAT_COUNT);
    return;
  }
  empty.style.display = 'none';

  const visibleChats = chats.slice(0, visibleChatCount);
  grid.innerHTML = visibleChats.map(chat => {
    const dateStr = new Date(chat.timestamp).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const nick = chat.nickname || '匿名リスナー';
    const initial = Array.from(nick)[0].toUpperCase();
    return `
      <div class="chat-card">
        <div class="chat-avatar">${escHtml(initial)}</div>
        <div class="chat-content">
          <div class="chat-head">
            <span class="chat-nick">${escHtml(nick)}</span>
            <span class="chat-date">${dateStr}</span>
          </div>
          <div class="chat-msg">${escHtml(chat.message)}</div>
        </div>
      </div>
    `;
  }).join('');
  updateMoreButton('chatsMoreBtn', chats.length, Math.min(visibleChatCount, chats.length), INITIAL_CHAT_COUNT);
}

function populateModalSpotSelect(preselect = '') {
  const sel = document.getElementById('fSpot');
  const allSpots = [
    ...SPOTS.map(s => ({ ...s, catLabel: getCatLabel(s.cat) })),
    ...localSuggestions.map(s => ({ name: s.name, area: s.area, catLabel: getCatLabel(s.cat) }))
  ];
  sel.innerHTML = '<option value="">-- スポットを選択 --</option>' +
    allSpots.map(s => `<option value="${s.name}"${s.name === preselect ? ' selected' : ''}>${s.catLabel} | ${s.name}（${s.area}）</option>`).join('');
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
  clearResourceValidation('spot');
}
function closeAddSpotModal() {
  document.getElementById('addSpotModal').classList.remove('is-open');
  document.body.style.overflow = '';
}

// 掲示板投稿モーダル
function openChatModal() {
  document.getElementById('chatModal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeChatModal() {
  document.getElementById('chatModal').classList.remove('is-open');
  document.body.style.overflow = '';
}

// スポット別感想モーダル
function openSpotReviews(spotName) {
  currentReviewSpotName = spotName;
  const title = document.getElementById('spotReviewsTitle');
  const body = document.getElementById('spotReviewsBody');
  const reviews = getSpotReviews(spotName);

  title.textContent = `${spotName} のみんなの感想`;
  body.innerHTML = reviews.length
    ? `<div class="spot-review-list">${renderSpotReviewCards(reviews)}</div>`
    : `
      <div class="spot-review-empty">
        <div class="empty-icon">💬</div>
        <p>このスポットの感想はまだありません。<br>行ってみたら、最初の感想を投稿してみませんか？</p>
      </div>
    `;

  document.getElementById('spotReviewsModal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeSpotReviews() {
  document.getElementById('spotReviewsModal').classList.remove('is-open');
  document.body.style.overflow = '';
}

// 投稿モーダル
function openModal(preselect = '') {
  document.getElementById('postModal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
  resetForm();
  populateModalSpotSelect(preselect);
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
  clearResourceValidation('post');
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
  const resources = validateResourceEntries('spot');
  if (!resources) return;
  const btn = document.getElementById('addSpotSubmitBtn');
  btn.disabled = true; btn.textContent = '送信中...';
  const data = {
    name, area,
    cat: document.getElementById('asCat').value,
    reason,
    url: resources[0]?.url || '',
    urls: resources.map(r => r.url),
    resources,
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

// チャットフォーム送信
document.getElementById('chatForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nickname = document.getElementById('cNick').value.trim() || '匿名リスナー';
  const message = document.getElementById('cMsg').value.trim();

  if (!message) { alert('メッセージを入力してください'); return; }

  const btn = document.getElementById('chatSubmitBtn');
  btn.disabled = true; btn.textContent = '送信中...';

  try {
    await saveChat({ nickname, message });
    updateChatsView();
    closeChatModal();
    document.getElementById('chatForm').reset();
    showToast('つぶやきを投稿しました！ 🎉');
  } catch(err) {
    alert('エラーが発生しました。時間を置いて再度お試しください。');
  } finally {
    btn.disabled = false; btn.textContent = '投稿する 🚀';
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
  const media = validateResourceEntries('post');
  if (!media) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = '送信中...';

  const nickname = document.getElementById('fNick').value.trim() || '匿名リスナー';
  
  // スポットのカテゴリとエリアを取得して自動反映
  const allSpots = [...SPOTS, ...localSuggestions];
  const matchedSpot = allSpots.find(s => s.name === spotName);
  const spotCat = matchedSpot ? matchedSpot.cat : 'food';
  const spotArea = matchedSpot ? matchedSpot.area : (spotFree ? 'エリア不明' : '');

  // もし自由入力で新しいスポットが入力されたら、行きたい場所リスト（suggestions）にも自動追加する
  if (spotFree && !matchedSpot) {
    try {
      await saveSpotSuggestion({
        name: spotFree,
        area: 'エリア不明（リスナー投稿）',
        cat: 'food',
        reason: 'リスナーさんが行っておすすめしてくれたスポットです！',
        url: '',
        nickname: nickname
      });
      const activeTab = document.querySelector('.tab.active');
      renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    } catch (err) {
      console.warn('スポット自動追加に失敗', err);
    }
  }

  const postData = {
    nickname: nickname === '匿名リスナー' ? '' : nickname,
    spotName,
    cat: spotCat,
    area: spotArea,
    visitDate: document.getElementById('fDate').value,
    rating: selectedRating,
    comment,
    media,
    photoUrl: media.find(item => item.kind === 'photo')?.url || media[0]?.url || ''
  };

  try {
    const savedPost = await savePost(postData);
    allPosts = mergePosts(allPosts);
    renderVisited(allPosts);
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    closeModal();
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
  ['heroPostBtn','emptyPostBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => openModal());
  });
  
  const openChatBtn = document.getElementById('openChatModalBtn');
  if (openChatBtn) openChatBtn.addEventListener('click', openChatModal);
  const chatClose = document.getElementById('chatModalClose');
  if (chatClose) chatClose.addEventListener('click', closeChatModal);
  const chatCancel = document.getElementById('chatCancelBtn');
  if (chatCancel) chatCancel.addEventListener('click', closeChatModal);
  const chatModal = document.getElementById('chatModal');
  if (chatModal) chatModal.addEventListener('click', (e) => {
    if (e.target === chatModal) closeChatModal();
  });
  document.getElementById('spotReviewsClose').addEventListener('click', closeSpotReviews);
  document.getElementById('spotReviewsCancelBtn').addEventListener('click', closeSpotReviews);
  document.getElementById('spotReviewsPostBtn').addEventListener('click', () => {
    const spotName = currentReviewSpotName;
    closeSpotReviews();
    openModal(spotName);
  });
  document.getElementById('spotReviewsModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('spotReviewsModal')) closeSpotReviews();
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
  [
    { context: 'spot', errorId: 'asUrlError' },
    { context: 'post', errorId: 'fMediaError' }
  ].forEach(({ context, errorId }) => {
    document.querySelectorAll(`.${context}-resource-kind, .${context}-resource-url`).forEach(input => {
      const eventName = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(eventName, () => {
        if (document.getElementById(errorId)?.textContent) validateResourceEntries(context);
      });
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeAddSpotModal(); closeChatModal(); closeSpotReviews(); }
  });
  document.getElementById('tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    visibleSpotCount = INITIAL_SPOT_COUNT;
    renderSpotCards(tab.dataset.cat);
  });
  document.getElementById('spotsMoreBtn').addEventListener('click', (e) => {
    visibleSpotCount = e.currentTarget.dataset.mode === 'collapse'
      ? INITIAL_SPOT_COUNT
      : visibleSpotCount + INITIAL_SPOT_COUNT;
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
  });
  document.getElementById('visitedMoreBtn').addEventListener('click', (e) => {
    visibleReviewCount = e.currentTarget.dataset.mode === 'collapse'
      ? INITIAL_REVIEW_COUNT
      : visibleReviewCount + INITIAL_REVIEW_COUNT;
    renderVisited(allPosts);
  });
  document.getElementById('chatsMoreBtn').addEventListener('click', (e) => {
    visibleChatCount = e.currentTarget.dataset.mode === 'collapse'
      ? INITIAL_CHAT_COUNT
      : visibleChatCount + INITIAL_CHAT_COUNT;
    updateChatsView(allChats);
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

  // 投稿をリッスン
  listenPosts(posts => {
    allPosts = posts;
    renderVisited(posts); // リスナーの投稿は「みんなの感想」セクションに追加
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
  });

  // フリートークをリッスン
  listenChats(chats => {
    updateChatsView(chats);
  });

  listenLikes(); // いいね数をリアルタイム同期

  trackPageView();
  renderHeroBackdrop();
  startHeroBackdropRotation();

  bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
