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
// 2. ギャラリー・用語辞典データ
// ============================================================
const GALLERY_ITEMS = [
  { image: "assets/listener-gallery/listener-art-01.jpg", title: "小さな鹿たち", caption: "やわらかな鉛筆線で、4頭の小さな鹿がのびのび並ぶ一枚。", alt: "4頭の鹿が描かれた鉛筆スケッチ", type: "art" },
  { image: "assets/listener-gallery/listener-art-02.jpg", title: "オレンジの鹿", caption: "オレンジの線で元気よく描かれた、印象の残る一枚。", alt: "オレンジ色の線で描かれた鹿のイラスト", type: "art" },
  { image: "assets/listener-gallery/listener-art-03.jpg", title: "帽子のキャラクター", caption: "配信中に届いた、ユーモラスな表情のキャラクタースケッチ。", alt: "帽子をかぶったキャラクターのイラスト", type: "art" },
  { image: "assets/listener-gallery/listener-art-04.jpg", title: "すっとした横顔", caption: "線の流れがきれいな、鹿の横顔のスケッチ。", alt: "鹿の横顔を描いた線画", type: "art" },
  { image: "assets/listener-gallery/listener-art-05.jpg", title: "森で会えたら", caption: "言葉や風景まで含めて、やさしい世界観を広げてくれた一枚。", alt: "風景と吹き出し付きで加工された鹿の作品", type: "art" },
  { image: "assets/listener-gallery/listener-art-06.jpg", title: "鉛筆のポートレート", caption: "やわらかな陰影で描かれた、静かな雰囲気のポートレート。", alt: "鉛筆で描かれた鹿のポートレート", type: "art" },
  { image: "assets/listener-gallery/listener-art-08.jpg", title: "森の奥の小さな鹿", caption: "木々の間に小さな鹿がそっと立つ、物語の一場面のようなスケッチ。手描きの線に、静かな空気が残る一枚です。", alt: "森の中に小さな鹿が描かれたリスナー作品", type: "art" },
  { image: "assets/listener-gallery/listener-art-09.jpg", title: "POPOPO用語辞典", caption: "見開きいっぱいにPOPOPOの言葉が並ぶ、辞典風作品。ページをめくるように眺めたくなる一枚です。", alt: "POPOPO内で生まれた言葉を辞典風にまとめた見開き作品", type: "dict", lockAnswer: "TimTam", lockHint: "ある配信者が牛乳の中に落としたお菓子は何でしょうか？" },
  { image: "assets/listener-gallery/listener-art-10.jpg", title: "POPOPO用語辞典 2", caption: "「masaリティショー」や「涙が止まりません」など、POPOPOならではの表現が収録された辞典ページです。", alt: "POPOPO用語辞典の追加ページ（masaリティショーなど）", type: "dict_page", lockAnswer: "TimTam", lockHint: "ある配信者が牛乳の中に落としたお菓子は何でしょうか？" },
  { image: "assets/listener-gallery/listener-art-11.jpg", title: "小さな鹿のピアス", caption: "手描きの小さな鹿が、銀色のアクセサリーになったような作品。静かな紙の質感もきれいです。", alt: "小さな鹿をモチーフにしたピアス作品", type: "art" },
  { image: "assets/listener-gallery/listener-art-12.jpg", title: "ポップな小さな鹿のピアス", caption: "黄色い背景とカラフルなビーズで、小さな鹿がぱっと明るく見える一枚です。", alt: "黄色い背景に置かれた小さな鹿のピアス作品", type: "art" },
  { image: "assets/listener-gallery/listener-art-13.jpg", title: "かわいい雑貨風", caption: "小さな鹿がタオルやポーチにそっと入った、雑貨カタログのようなやさしい作品です。", alt: "小さな鹿をあしらった雑貨風のコラージュ作品", type: "art" },
  { image: "assets/listener-gallery/listener-art-14.jpg", title: "布の上の小さな鹿たち", caption: "布の上に小さな鹿と葉の模様が広がる、手仕事のぬくもりを感じる作品です。", alt: "布の上に小さな鹿と葉の模様が描かれた作品", type: "art" },
  { image: "assets/listener-gallery/listener-art-15.jpg", title: "にんじん和紙テープ", caption: "小さな鹿が和紙テープになった、思わず使ってみたくなる文具風の作品です。", alt: "小さな鹿の絵が並ぶ和紙テープ作品", type: "art" },
  { image: "assets/listener-gallery/listener-art-16.jpg", title: "根元の生命スニーカー", caption: "白いスニーカーに小さな鹿が描かれた、歩くたびに物語が始まりそうな作品です。", alt: "白いスニーカーに小さな鹿が描かれた作品", type: "art" },
  { image: "assets/listener-gallery/listener-art-17.jpg", title: "にっこり笑顔のキャラクター", caption: "独特の愛嬌ある表情がたまらない、手描きのキャラクタースケッチ。", alt: "笑顔のキャラクターの手描きスケッチ", type: "art" },
  { image: "assets/listener-gallery/listener-art-18.jpg", title: "ふさふさしっぽのリス", caption: "ふさふさのしっぽが特徴的な、かわいらしい小動物の線画です。", alt: "小動物の線画イラスト", type: "art" },
  { image: "assets/listener-gallery/listener-art-19.jpg", title: "イラスト入りソックス", caption: "手描きのキャラクターがワンポイントで刺繍された、温かみのある靴下作品。", alt: "キャラクターが刺繍された白い靴下", type: "art" },
  { image: "assets/listener-gallery/listener-art-20.jpg", title: "黄色いキツネ", caption: "黄色の線でシンプルに描かれた、愛らしい動物のイラスト。", alt: "黄色い線で描かれた動物のイラスト", type: "art" },
  { image: "assets/listener-gallery/listener-art-21.jpg", title: "キャラクター刺繍のニット帽", caption: "ダークグレーのニット帽にキャラクターが同系色で刺繍された、さりげないお洒落な作品。", alt: "キャラクターが刺繍されたニット帽", type: "art" },
  { image: "assets/listener-gallery/listener-art-22.jpg", title: "まんまるキャラクター", caption: "丸いフォルムと大きな瞳が可愛らしい、手描きのキャラクタースケッチ。", alt: "丸い顔のキャラクターのスケッチ", type: "art" },
  { image: "assets/listener-gallery/listener-art-23.jpg", title: "キャラクターのパーカー", caption: "手描きのキャラクターが背中に大きくプリントされた、かわいらしいパーカー作品。", alt: "背中にキャラクターが描かれたパーカー", type: "art" },
  { image: "assets/listener-gallery/listener-art-24.jpg", title: "立ち上がるリス", caption: "独特のフォルムが愛らしい、すっと立ち上がったようなリスのスケッチ。", alt: "立ち上がったリスの手描きイラスト", type: "art" },
  { image: "assets/listener-gallery/listener-art-25.jpg", title: "太陽みたいなトートバッグ", caption: "お日様のような明るいキャラクターがプリントされた、キャンバス地のトートバッグです。", alt: "キャラクターが描かれたトートバッグ", type: "art" },
  { image: "assets/listener-gallery/listener-art-26.jpg", title: "ライオンのスケッチ", caption: "たてがみと笑顔がかわいらしい、ライオンのキャラクターのスケッチ。", alt: "ライオンのキャラクターの手描きスケッチ", type: "art" },
  { image: "assets/listener-gallery/listener-art-27.jpg", title: "落下するミーアキャット", caption: "ひゅーんと落下中…！？そんな瞬間のなかでも、どこか穏やかで微笑ましい表情を浮かべたミーアキャット。見ているこちらまで力が抜けてしまうような、不思議な魅力の一枚です。", alt: "落下しながら微笑むミーアキャットの手描きイラスト", type: "art" },
  { image: "assets/listener-gallery/listener-art-28.jpg", title: "キャラクターのタンブラー", caption: "手描きの愛らしいキャラクターがプリントされた、日常使いしたくなるタンブラー作品。", alt: "キャラクターが描かれた白いタンブラー", type: "art" },
  { image: "assets/listener-gallery/listener-art-29.jpg", title: "手描きイラストのエプロン", caption: "「My Little Artist's Kitchen」の文字と共に、手描きの愛らしいキャラクターが刺繍された素敵なエプロンです。", alt: "キャラクターのイラストが刺繍されたエプロン", type: "art" },
  { image: "assets/listener-gallery/listener-art-30.jpg", title: "ご機嫌なキャラクター", caption: "にっこり笑って、なんだか嬉しそうに立っている愛らしいキャラクタースケッチ。", alt: "笑顔で立っているキャラクターのイラスト", type: "art" },
  { image: "assets/listener-gallery/listener-art-31.jpg", title: "まったりキャラクター", caption: "絶妙な表情でこちらを見つめる、独特のゆるさが魅力のキャラクタースケッチ。", alt: "まったりした表情のキャラクターのイラスト", type: "art" }
];

// ============================================================
// 3. スポットデータ
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
  // --- 自然・よりみち ---
  { id: 'inokashira', cat: 'nature', emoji: '🌳', name: '井の頭恩賜公園', area: '武蔵野市・三鷹市', pref: '東京', url: 'https://www.tokyo-park.or.jp/park/format/index044.html', memo: '【サンプル】散歩するだけで心が整う、緑豊かな公園。' },
  // --- 本・しらべもの ---
  { id: 'tsutaya', cat: 'book', emoji: '📚', name: '代官山 蔦屋書店', area: '代官山', pref: '東京', url: 'https://store.tsite.jp/daikanyama/', memo: '【サンプル】新しい本との出会いがある、心地よい空間。' },
  // --- くらし・雑貨 ---
  { id: 'kakimori', cat: 'shop', emoji: '🛒', name: 'カキモリ', area: '蔵前', pref: '東京', url: 'https://kakimori.com/', memo: '【サンプル】自分だけのノートが作れる、素敵な文房具店。' },
  // --- おきにいりの景色 ---
  { id: 'shibuyasky', cat: 'view', emoji: '✨', name: 'SHIBUYA SKY', area: '渋谷', pref: '東京', url: 'https://www.shibuya-scramble-square.com/sky/', memo: '【サンプル】東京の空を広く感じられる、お気に入りの場所。' },
  // --- 癒やし・ととのう ---
  { id: 'kogane', cat: 'relax', emoji: '🛁', name: '黄金湯', area: '墨田区', pref: '東京', url: 'https://koganeyu.com/', memo: '【サンプル】モダンな雰囲気でリラックスできる、素敵な銭湯。' },
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
let localSeenReviews = JSON.parse(localStorage.getItem('popopo_seen_reviews') || '{}');
let localChatReactions = JSON.parse(localStorage.getItem('popopo_chat_reactions') || '{}');
let localSuggestions = JSON.parse(localStorage.getItem('popopo_suggestions') || '[]');
let localChats = JSON.parse(localStorage.getItem('popopo_chats') || '[]');
const NICKNAME_STORAGE_KEY = 'popopo_last_nickname';
const ADD_SPOT_FORM_DRAFT_KEY = 'popopo_add_spot_draft_session_v1';
let addSpotDraftTimer = null;
let selectedRating = 0;
let allPosts = [];
let allChats = [];
let latestRemotePosts = [];
let latestRemoteSuggestions = [];
let latestRemoteChats = [];
let currentReviewSpotName = '';
let editingId = null;
let editingClientId = null;
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
const HERO_BACKDROP_ROTATE_MS = 5000;
const KIRIBAN_ROUND_INTERVAL = 100;
const KIRIBAN_MIN_COUNT = 100;
const INTRO_STORY_STORAGE_KEY = 'popopo_intro_story_seen_v1';
const INTRO_STORY_SLIDE_MS = 5200;
const DISCOVERY_ROTATE_MS = 45000;
const DISCOVERY_PAUSE_MS = 12000;
const DISCOVERY_TEXT_LIMIT = 92;
const DAILY_PROMPTS = [
  '最近、気になっている場所はありますか？',
  '誰かにそっとすすめたいお店はありますか？',
  '次の休日に行ってみたい場所はどこですか？',
  'POPOPOを聴きながら思い出した場所はありますか？',
  '実際に行ってみて、予想よりよかった場所はありますか？',
  'まだ行けていないけれど、気になっている場所はありますか？',
  '今日の気分に合うお出かけ先を挙げるならどこですか？',
  'ひとりでふらっと行きたい場所はありますか？',
  '誰かと一緒に行ったら楽しそうな場所はありますか？',
  '最近食べてみたいものはありますか？',
  '雨の日でも行きたい場所はありますか？',
  'もう一度行きたい場所はありますか？',
  '誰かの投稿を見て気になった場所はありますか？',
  'POPOPOリスナーに聞いてみたいおすすめはありますか？',
  'このサイトで、もっと見やすくしたいところはありますか？',
  'このサイトに追加されたら便利だと思う機能はありますか？',
  'スポットや感想の表示で、分かりにくいところはありますか？',
  '初めて来た人に向けて、あると親切だと思う案内はありますか？',
  '投稿しやすくなるために、どんな工夫があるとよさそうですか？',
  'POPOPOコミュニティらしい遊び心のアイデアはありますか？'
];
let visibleSpotCount = INITIAL_SPOT_COUNT;
let visibleReviewCount = INITIAL_REVIEW_COUNT;
let visibleChatCount = INITIAL_CHAT_COUNT;
let replyingTo = null;
let showingWantList = false;
let heroBackdropTimer = null;
let heroBackdropVisibilityBound = false;
let heroBackdropResizeTimer = null;
let heroBackdropResizeBound = false;
let heroGalleryResizeTimer = null;
let heroGalleryResizeBound = false;
let heroGalleryMotionFrame = null;
let heroGalleryLastFrame = 0;
let heroGalleryLoopDistance = 0;
let heroGalleryOffset = 0;
let heroGalleryIsDragging = false;
let heroGallerySuppressClick = false;
let introStoryTimer = null;
let introStoryIndex = 0;
let currentDiscoveryItem = null;
let discoveryItems = [];
let discoveryIndex = 0;
let discoveryTimer = null;
let discoveryPausedUntil = 0;
let pendingGalleryUnlock = null;

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

function normalizeHeroGalleryOffset(offset) {
  if (!heroGalleryLoopDistance) return offset;
  const distance = heroGalleryLoopDistance;
  let nextOffset = offset;
  while (nextOffset <= -distance) nextOffset += distance;
  while (nextOffset > 0) nextOffset -= distance;
  return nextOffset;
}

function applyHeroGalleryOffset(track) {
  if (!track) return;
  track.style.setProperty('--hero-gallery-offset', `${heroGalleryOffset}px`);
}

function startHeroGalleryMotion() {
  if (heroGalleryMotionFrame) return;
  heroGalleryLastFrame = performance.now();
  const tick = (time) => {
    const marquee = document.getElementById('heroGalleryMarquee');
    const track = marquee?.querySelector('.hero-gallery-track');
    if (!marquee || !track) {
      heroGalleryMotionFrame = null;
      return;
    }
    const delta = Math.min(time - heroGalleryLastFrame, 48);
    heroGalleryLastFrame = time;

    if (!heroGalleryIsDragging && !document.hidden && !marquee.matches(':hover')) {
      heroGalleryOffset = normalizeHeroGalleryOffset(heroGalleryOffset - delta * 0.032);
      applyHeroGalleryOffset(track);
    }
    heroGalleryMotionFrame = requestAnimationFrame(tick);
  };
  heroGalleryMotionFrame = requestAnimationFrame(tick);
}

function bindHeroGalleryDrag(marquee, track) {
  if (!marquee || !track || marquee.dataset.dragBound === 'true') return;
  let startX = 0;
  let startOffset = 0;
  let moved = false;
  let pressItem = null;

  const stopDrag = (e) => {
    if (!heroGalleryIsDragging) return;
    heroGalleryIsDragging = false;
    marquee.classList.remove('is-dragging');
    if (!moved && pressItem) {
      heroGallerySuppressClick = true;
      openGalleryItem(pressItem);
      window.setTimeout(() => { heroGallerySuppressClick = false; }, 120);
    } else if (moved) {
      heroGallerySuppressClick = true;
      window.setTimeout(() => { heroGallerySuppressClick = false; }, 120);
    }
    pressItem = null;
    try {
      marquee.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Pointer capture may already be released on Safari.
    }
  };

  marquee.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    heroGalleryIsDragging = true;
    heroGallerySuppressClick = false;
    moved = false;
    startX = e.clientX;
    startOffset = heroGalleryOffset;
    pressItem = e.target.closest('.hero-gallery-item');
    marquee.classList.add('is-dragging');
    try {
      marquee.setPointerCapture(e.pointerId);
    } catch (err) {
      // Some older mobile browsers do not support capture here.
    }
  });

  marquee.addEventListener('pointermove', (e) => {
    if (!heroGalleryIsDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    heroGalleryOffset = normalizeHeroGalleryOffset(startOffset + dx);
    applyHeroGalleryOffset(track);
    if (e.cancelable) e.preventDefault();
  });

  marquee.addEventListener('pointerup', stopDrag);
  marquee.addEventListener('pointercancel', stopDrag);
  marquee.addEventListener('lostpointercapture', stopDrag);
  marquee.dataset.dragBound = 'true';
}

function setupHeroGallery() {
  const marquee = document.getElementById('heroGalleryMarquee');
  const track = document.getElementById('heroGalleryTrack');
  if (!marquee || !track || typeof GALLERY_ITEMS === 'undefined') return;

  track.innerHTML = GALLERY_ITEMS.map((item, index) => {
    if (item.type === 'dict_page') return '';
    const isDoc = item.type === 'dict' ? ' is-document-thumb' : '';
    const lockAttrs = item.lockAnswer ? ` data-lock-answer="${item.lockAnswer}" data-lock-hint="${item.lockHint}"` : '';
    return `
      <button type="button" class="hero-gallery-item" data-gallery-index="${index}" data-gallery-item data-image="${item.image}" data-title="${item.title}" data-caption="${item.caption}" data-alt="${item.alt}"${lockAttrs}>
        <img class="hero-gallery-thumb${isDoc}" src="${item.image}" alt="${item.alt}" loading="lazy">
      </button>
    `;
  }).join('');

  const baseItems = Array.from(track.querySelectorAll('.hero-gallery-item'));
  if (!baseItems.length) return;

  const trackStyle = window.getComputedStyle(track);
  const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0') || 0;
  const firstItem = baseItems[0];
  const lastItem = baseItems[baseItems.length - 1];
  const baseWidth = (lastItem.offsetLeft + lastItem.offsetWidth) - firstItem.offsetLeft;
  const loopDistance = Math.max(baseWidth + gap, 1);
  const repeatCount = Math.max(4, Math.ceil((marquee.offsetWidth + loopDistance) / loopDistance) + 1);
  const fragment = document.createDocumentFragment();

  for (let copyIndex = 0; copyIndex < repeatCount; copyIndex += 1) {
    baseItems.forEach((item) => {
      const clone = item.cloneNode(true);
      if (copyIndex > 0) {
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        const image = clone.querySelector('.hero-gallery-thumb');
        if (image) image.alt = '';
      } else {
        clone.removeAttribute('aria-hidden');
        clone.removeAttribute('tabindex');
      }
      fragment.appendChild(clone);
    });
  }

  track.replaceChildren(fragment);
  heroGalleryLoopDistance = loopDistance;
  heroGalleryOffset = normalizeHeroGalleryOffset(heroGalleryOffset);
  track.style.setProperty('--hero-gallery-loop-distance', `${loopDistance}px`);
  applyHeroGalleryOffset(track);
  bindHeroGalleryDrag(marquee, track);
  startHeroGalleryMotion();

  if (!heroGalleryResizeBound) {
    window.addEventListener('resize', () => {
      clearTimeout(heroGalleryResizeTimer);
      heroGalleryResizeTimer = setTimeout(setupHeroGallery, 140);
    });
    heroGalleryResizeBound = true;
  }
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
  if (!spotId || localLikes[spotId]) return false;
  localLikes[spotId] = 1;
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
  return true;
}

function getSeenReviewCount(reviewId) {
  return globalLikes[reviewId] || (localSeenReviews[reviewId] ? 1 : 0);
}

function updateSeenReviewButton(reviewId) {
  const count = getSeenReviewCount(reviewId);
  const isSeen = Boolean(localSeenReviews[reviewId]);
  document.querySelectorAll('.review-seen-btn').forEach(btn => {
    if (btn.dataset.reviewSeenId !== reviewId) return;
    btn.classList.toggle('is-seen', isSeen);
    btn.setAttribute('aria-pressed', isSeen ? 'true' : 'false');
    const text = btn.querySelector('.review-seen-text');
    const countEl = btn.querySelector('.review-seen-count');
    if (text) text.textContent = isSeen ? '見たよ済み' : '見たよ';
    if (countEl) countEl.textContent = count;
  });
}

async function saveSeenReview(reviewId) {
  if (!reviewId || localSeenReviews[reviewId]) return;
  localSeenReviews[reviewId] = Date.now();
  localStorage.setItem('popopo_seen_reviews', JSON.stringify(localSeenReviews));
  globalLikes[reviewId] = (globalLikes[reviewId] || 0) + 1;
  updateSeenReviewButton(reviewId);

  if (db) {
    try {
      await db.collection('likes').doc(reviewId).set({
        count: firebase.firestore.FieldValue.increment(1)
      }, { merge: true });
    } catch (e) { console.warn(e); }
  }
}

function getChatReactionId(chat = {}, type = 'thanks') {
  const key = chat.clientId || chat.id || [
    chat.nickname,
    chat.message,
    chat.timestamp
  ].map(normalizeDedupeValue).join('|');
  return `chat_${type}_${hashString(key)}`;
}

function getChatKey(chat = {}) {
  return chat.clientId || chat.id || '';
}

function findChatByKey(chatId) {
  return allChats.find(chat => getChatKey(chat) === chatId) ||
    localChats.find(chat => getChatKey(chat) === chatId) ||
    latestRemoteChats.find(chat => getChatKey(chat) === chatId) ||
    null;
}

function getChatReactionCount(reactionId) {
  return globalLikes[reactionId] || (localChatReactions[reactionId] ? 1 : 0);
}

function updateChatReactionButton(reactionId) {
  const count = getChatReactionCount(reactionId);
  const reacted = Boolean(localChatReactions[reactionId]);
  document.querySelectorAll('.chat-reaction-btn').forEach(btn => {
    if (btn.dataset.chatReactionId !== reactionId) return;
    btn.classList.toggle('is-reacted', reacted);
    btn.setAttribute('aria-pressed', reacted ? 'true' : 'false');
    const text = btn.querySelector('.chat-reaction-text');
    const countEl = btn.querySelector('.chat-reaction-count');
    if (text) text.textContent = reacted ? btn.dataset.reactedLabel : btn.dataset.defaultLabel;
    if (countEl) countEl.textContent = count;
  });
}

async function saveChatReaction(reactionId) {
  if (!reactionId || localChatReactions[reactionId]) return;
  localChatReactions[reactionId] = Date.now();
  localStorage.setItem('popopo_chat_reactions', JSON.stringify(localChatReactions));
  globalLikes[reactionId] = (globalLikes[reactionId] || 0) + 1;
  updateChatReactionButton(reactionId);

  if (db) {
    try {
      await db.collection('likes').doc(reactionId).set({
        count: firebase.firestore.FieldValue.increment(1)
      }, { merge: true });
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
        if (doc.id.startsWith('review_seen_')) updateSeenReviewButton(doc.id);
        if (doc.id.startsWith('chat_')) updateChatReactionButton(doc.id);
      });
    });
  }
}

async function saveChat(chatData) {
  const clientId = 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const parentId = replyingTo ? getChatKey(replyingTo) : null;
  const parentNick = replyingTo ? (replyingTo.nickname || '匿名リスナー') : null;
  const chat = { 
    ...chatData, 
    id: clientId, 
    clientId, 
    timestamp: Date.now(),
    parentId,
    parentNick
  };
  localChats.unshift(chat);
  localStorage.setItem('popopo_chats', JSON.stringify(localChats));

  if (db) {
    db.collection('chats').add({
      ...chatData,
      clientId,
      parentId,
      parentNick,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.warn('Chat sync failed:', e));
  }

  return chat;
}

function mergeChats(remoteChats = latestRemoteChats) {
  const byKey = new Map();
  localChats.forEach(chat => {
    const key = getChatKey(chat);
    if (key) byKey.set(key, chat);
  });
  remoteChats.forEach(chat => {
    const key = getChatKey(chat);
    if (!key) return;
    const existing = byKey.get(key);
    byKey.set(key, {
      ...existing,
      ...chat,
      parentId: chat.parentId || existing?.parentId || null,
      parentNick: chat.parentNick || existing?.parentNick || null
    });
  });
  return Array.from(byKey.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

let tickerInterval = null;
let currentTickerIndex = 0;

function updateChatsView(chats = null) {
  if (Array.isArray(chats)) allChats = chats;
  const currentChats = Array.isArray(chats) ? chats : mergeChats();
  renderChats(currentChats);
  setStatText('statPosts', currentChats.length);

  // ティッカー（速報）の更新
  const ticker = document.getElementById('tickerContent');
  if (ticker) {
    if (tickerInterval) clearInterval(tickerInterval);
    if (currentChats.length > 0) {
      const displayChats = currentChats.slice(0, 5); // 最新5件をローテーション
      
      const updateTickerText = () => {
        const chat = displayChats[currentTickerIndex];
        const nick = chat.nickname || '匿名リスナー';
        
        // フェードアウト効果
        ticker.style.opacity = '0';
        setTimeout(() => {
          ticker.textContent = `${nick}：${chat.message}`;
          ticker.style.opacity = '1';
        }, 300); // 300msで切り替え
        
        currentTickerIndex = (currentTickerIndex + 1) % displayChats.length;
      };
      
      // 初回表示（アニメーションなし）
      ticker.style.transition = 'opacity 0.3s ease';
      const firstChat = displayChats[0];
      ticker.textContent = `${firstChat.nickname || '匿名リスナー'}：${firstChat.message}`;
      ticker.style.opacity = '1';
      currentTickerIndex = 1 % displayChats.length;
      
      if (displayChats.length > 1) {
        tickerInterval = setInterval(updateTickerText, 4000); // 4秒ごとに切り替え
      }
    } else {
      ticker.textContent = '最初のつぶやきを待っています...';
      ticker.style.opacity = '1';
    }
  }
}

function listenChats(callback) {
  if (db) {
    db.collection('chats').orderBy('timestamp', 'desc').onSnapshot(snap => {
      latestRemoteChats = snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      syncLocalWithRemote('chat', latestRemoteChats);
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
  return sortNewest(dedupePosts([...localPosts, ...remotePosts]));
}

function listenPosts(callback) {
  if (db) {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snap => {
      latestRemotePosts = snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      syncLocalWithRemote('post', latestRemotePosts);
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

function syncLocalWithRemote(type, remoteList) {
  let localList = [];
  if (type === 'chat') localList = localChats;
  else if (type === 'post') localList = localPosts;
  else if (type === 'suggestion') localList = localSuggestions;
  
  const remoteClientIds = new Set(remoteList.map(r => r.clientId).filter(Boolean));
  
  const now = Date.now();
  const threshold = 30000; // 30秒以内の新規投稿は維持（ラグ考慮）
  
  const newList = localList.filter(l => {
    // 1. サーバー上に存在する
    if (remoteClientIds.has(l.clientId)) return true;
    // 2. まだ非常に新しい（サーバーに反映される前かもしれない）
    if ((now - (l.timestamp || 0)) < threshold) return true;
    // それ以外はサーバーで削除されたか、リストから外れたとみなす
    return false;
  });
  
  if (newList.length !== localList.length) {
    if (type === 'chat') {
      localChats = newList;
      localStorage.setItem('popopo_chats', JSON.stringify(localChats));
    } else if (type === 'post') {
      localPosts = newList;
      localStorage.setItem('popopo_posts', JSON.stringify(localPosts));
    } else if (type === 'suggestion') {
      localSuggestions = newList;
      localStorage.setItem('popopo_suggestions', JSON.stringify(localSuggestions));
    }
  }
}

// --- 自分の投稿判別・アクション表示 ---
function isMyEntity(entity, type) {
  // セキュリティと安全のため、clientIdが確実にある場合のみ判定
  if (!entity.clientId) return false;
  
  let list = [];
  if (type === 'chat') list = localChats;
  else if (type === 'post') list = localPosts;
  else if (type === 'suggestion') list = localSuggestions;
  
  // localListの中にも同じclientIdが存在するかチェック
  return list.some(e => e.clientId === entity.clientId);
}

function renderPostActions(entity, type) {
  if (!isMyEntity(entity, type)) return '';
  const id = entity.id || '';
  const clientId = entity.clientId || '';
  return `
    <div class="post-actions" data-id="${id}" data-client-id="${clientId}">
      <button class="btn-post-action is-edit" onclick="startEditEntity('${id}', '${clientId}', '${type}')" title="編集">✏️ 編集</button>
    </div>
  `;
}

function getSavedNickname() {
  try {
    return localStorage.getItem(NICKNAME_STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
}

function saveNickname(nickname) {
  const value = String(nickname || '').trim();
  if (!value || value === '匿名リスナー') return;
  try {
    localStorage.setItem(NICKNAME_STORAGE_KEY, value.slice(0, 20));
  } catch (e) {
    console.warn('Nickname save failed:', e);
  }
}

function fillSavedNickname(inputId) {
  const input = document.getElementById(inputId);
  const nickname = getSavedNickname();
  if (input && nickname && !input.value.trim()) input.value = nickname;
}



async function deleteChatRecord(id, clientId) {
  // Local 削除
  localChats = localChats.filter(c => (c.clientId || c.id) !== clientId);
  localStorage.setItem('popopo_chats', JSON.stringify(localChats));
  
  // Remote 削除
  if (db && id) {
    await db.collection('chats').doc(id).delete().catch(e => console.warn(e));
  }
  
  updateChatsView();
}

async function deletePostRecord(id, clientId) {
  // Local 削除
  localPosts = localPosts.filter(p => (p.clientId || p.id) !== clientId);
  localStorage.setItem('popopo_posts', JSON.stringify(localPosts));
  
  // Remote 削除
  if (db && id) {
    await db.collection('posts').doc(id).delete().catch(e => console.warn(e));
  }
  
  allPosts = mergePosts(latestRemotePosts);
  renderVisited(allPosts);
  renderHeroBackdrop();
}

async function deleteSuggestionRecord(id, clientId) {
  // Local 削除
  localSuggestions = localSuggestions.filter(s => (s.clientId || s.id) !== clientId);
  localStorage.setItem('popopo_suggestions', JSON.stringify(localSuggestions));
  
  // Remote 削除
  if (db && id) {
    await db.collection('suggestions').doc(id).delete().catch(e => console.warn(e));
  }
  
  const activeTab = getActiveSpotCategory();
  renderSpotCards(activeTab);
  renderHeroBackdrop();
}

function startEditEntity(id, clientId, type) {
  if (type === 'chat') {
    const chat = allChats.find(c => (c.clientId || c.id) === clientId);
    if (chat) openChatModal(chat.message, id, clientId);
  } else if (type === 'post') {
    const post = allPosts.find(p => (p.clientId || p.id) === clientId);
    if (post) openModal(post.spotName, id, clientId);
  } else if (type === 'suggestion') {
    const suggs = getAllSpotItemsForDisplay().filter(s => s.suggested);
    const sugg = suggs.find(s => (s.clientId || s.id) === clientId);
    if (sugg) openAddSpotModal(id, clientId);
  }
}

function listenSuggestions(callback) {
  if (db) {
    db.collection('suggestions').orderBy('timestamp', 'desc').onSnapshot(snap => {
      latestRemoteSuggestions = snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      syncLocalWithRemote('suggestion', latestRemoteSuggestions);
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
    let hasViewCount = false;
    try {
      const ref = db.collection('likes').doc('page_views');
      ref.onSnapshot(doc => {
        hasViewCount = true;
        setStatText('statViews', doc.exists ? (doc.data().count || 0) : 0);
      }, e => {
        console.warn('Page view read failed', e);
        if (!hasViewCount) setStatText('statViews', '-');
      });
      if (!sessionStorage.getItem('popopo_viewed')) {
        const newCount = await db.runTransaction(async transaction => {
          const doc = await transaction.get(ref);
          const currentCount = doc.exists ? (Number(doc.data().count) || 0) : 0;
          const nextCount = currentCount + 1;
          transaction.set(ref, {
            count: nextCount,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          return nextCount;
        });
        sessionStorage.setItem('popopo_viewed', 'true');
        showKiribanModalIfNeeded(newCount);
      }
    } catch (e) {
      console.warn('Page view tracking failed', e);
      if (!hasViewCount && (!viewsEl || viewsEl.textContent === '読み込み中')) {
        setStatText('statViews', '-');
      }
    }
  } else {
    setStatText('statViews', 'Demo');
  }
}

function isKiribanCount(count) {
  if (!Number.isInteger(count) || count < KIRIBAN_MIN_COUNT) return false;
  if (count % KIRIBAN_ROUND_INTERVAL === 0) return true;
  const countText = String(count);
  return countText.length >= 3 && new Set(countText).size === 1;
}

function showKiribanModalIfNeeded(count) {
  if (!isKiribanCount(count)) return;
  const modal = document.getElementById('kiribanModal');
  const countEl = document.getElementById('kiribanCount');
  if (!modal || !countEl) return;
  const storageKey = `popopo_kiriban_${count}`;
  if (sessionStorage.getItem(storageKey)) return;
  sessionStorage.setItem(storageKey, 'true');
  countEl.textContent = count.toLocaleString('ja-JP');
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeKiribanModal() {
  const modal = document.getElementById('kiribanModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

async function shareKiriban() {
  const count = document.getElementById('kiribanCount')?.textContent || '';
  const message = `【キリ番達成】POPOPO お出かけマップの ${count} 人目の訪問者になりました！🎉`;
  
  // キリ番モーダルを閉じる
  closeKiribanModal();
  
  // フリートーク投稿モーダルを開く（メッセージを自動入力）
  openChatModal(message);
  
  showToast('掲示板に報告しましょう！✨');
}

function getIntroStorySlides() {
  return Array.from(document.querySelectorAll('[data-intro-story-slide]'));
}

function setIntroStorySlide(index) {
  const slides = getIntroStorySlides();
  const dots = Array.from(document.querySelectorAll('[data-intro-story-dot]'));
  if (!slides.length) return;
  introStoryIndex = ((index % slides.length) + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === introStoryIndex);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === introStoryIndex);
    dot.setAttribute('aria-current', i === introStoryIndex ? 'true' : 'false');
  });
}

function startIntroStoryFlow() {
  window.clearInterval(introStoryTimer);
  introStoryTimer = window.setInterval(() => {
    setIntroStorySlide(introStoryIndex + 1);
  }, INTRO_STORY_SLIDE_MS);
}

function markIntroStorySeen() {
  try {
    localStorage.setItem(INTRO_STORY_STORAGE_KEY, 'true');
  } catch (e) {
    // Storageが使えない環境では、その回で閉じられれば十分。
  }
}

function closeIntroStoryModal() {
  const modal = document.getElementById('introStoryModal');
  if (!modal) return;
  window.clearInterval(introStoryTimer);
  introStoryTimer = null;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  markIntroStorySeen();
}

function maybeShowIntroStory() {
  const modal = document.getElementById('introStoryModal');
  if (!modal || !getIntroStorySlides().length) return;
  try {
    if (localStorage.getItem(INTRO_STORY_STORAGE_KEY) === 'true') return;
  } catch (e) {
    // 読み取りできない環境でも、表示自体は続ける。
  }
  const openWhenQuiet = (attempt = 0) => {
    if (document.querySelector('.modal-bg.is-open')) {
      if (attempt < 6) window.setTimeout(() => openWhenQuiet(attempt + 1), 1200);
      return;
    }
    setIntroStorySlide(0);
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    startIntroStoryFlow();
  };
  window.setTimeout(openWhenQuiet, 900);
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

function getDayIndex() {
  const today = new Date();
  return Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 86400000);
}

function getDailyPrompt() {
  return DAILY_PROMPTS[getDayIndex() % DAILY_PROMPTS.length];
}

function renderDailyPrompt() {
  const text = document.getElementById('dailyPromptText');
  if (text) text.textContent = getDailyPrompt();
}

function getDiscoveryItems() {
  const suggestions = Array.isArray(localSuggestions) ? localSuggestions : [];
  const posts = Array.isArray(allPosts) ? allPosts : [];
  const suggestionItems = suggestions.map(s => ({
    kind: 'spot',
    id: s.id || s.clientId || '',
    cat: s.cat || 'spot',
    sourceLabel: '📍 おすすめスポット',
    spotName: s.name,
    title: s.name,
    text: s.reason || `${s.area || 'どこか'}で気になっているスポットです。`,
    href: '#spots',
    action: 'スポットを見る'
  }));
  const spotItems = SPOTS.map(s => ({
    kind: 'spot',
    id: s.id,
    cat: s.cat,
    sourceLabel: '📍 おすすめスポット',
    spotName: s.name,
    title: s.name,
    text: s.memo || `${s.area}のおすすめスポットです。`,
    href: '#spots',
    action: 'スポットを見る'
  }));
  const allSpots = [...suggestionItems, ...spotItems];
  const reviewItems = sortNewest(dedupePosts(posts)).slice(0, 12).map(p => {
    const relatedSpot = allSpots.find(spot => (spot.spotName || spot.name) === p.spotName);
    return {
      kind: 'review',
      id: p.id || p.clientId || '',
      cat: p.cat || relatedSpot?.cat || 'review',
      sourceLabel: '💬 みんなの感想',
      spotName: p.spotName,
      title: p.spotName,
      text: p.comment,
      href: '#visited',
      action: '感想を見る'
    };
  });
  return [...reviewItems, ...suggestionItems, ...spotItems].filter(item => item.title && item.text);
}

function getDiscoveryItemKey(item) {
  if (!item) return '';
  return [
    item.kind,
    item.id || '',
    item.spotName || item.title || '',
    normalizeDedupeValue(item.text || '').slice(0, 48)
  ].join('|');
}

function rotateDiscoveryList(items, salt) {
  if (!items.length) return [];
  const offset = Math.abs(hashString(`${getDayIndex()}-${salt}`)) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function buildDiscoveryQueue(items) {
  const spots = rotateDiscoveryList(items.filter(item => item.kind === 'spot'), 'spot');
  const reviews = rotateDiscoveryList(items.filter(item => item.kind === 'review'), 'review');
  const queue = [];
  const max = Math.max(spots.length, reviews.length);
  const startWithReview = Math.floor(Date.now() / DISCOVERY_ROTATE_MS) % 2 === 1;

  for (let i = 0; i < max; i += 1) {
    if (startWithReview) {
      if (reviews[i]) queue.push(reviews[i]);
      if (spots[i]) queue.push(spots[i]);
    } else {
      if (spots[i]) queue.push(spots[i]);
      if (reviews[i]) queue.push(reviews[i]);
    }
  }

  return queue.length ? queue : items;
}

function prefersReducedDiscoveryMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getDiscoveryTitle(item, categoryLabel) {
  return item.cat ? `${categoryLabel}・${item.title}` : item.title;
}

function updateDiscoveryDom(item) {
  const category = document.getElementById('weeklyDiscoveryCategory');
  const title = document.getElementById('weeklyDiscoveryTitle');
  const text = document.getElementById('weeklyDiscoveryText');
  const link = document.getElementById('weeklyDiscoveryLink');
  if (!item || !category || !title || !text || !link) return;

  const sourceLabel = item.sourceLabel || (item.kind === 'review' ? '💬 みんなの感想' : '📍 おすすめスポット');
  const categoryLabel = getCatLabel(item.cat);
  const titleLabel = getDiscoveryTitle(item, categoryLabel);
  const previewText = item.text.length > DISCOVERY_TEXT_LIMIT ? `${item.text.slice(0, DISCOVERY_TEXT_LIMIT)}...` : item.text;

  currentDiscoveryItem = item;
  category.textContent = sourceLabel;
  category.title = `表示元：${sourceLabel}`;
  title.textContent = titleLabel;
  title.title = `カテゴリー：${categoryLabel} / 名前：${item.title}`;
  text.textContent = previewText;
  text.title = item.text;
  link.href = item.href;
  link.dataset.discoveryKind = item.kind;
  link.dataset.discoveryId = item.id || '';
  link.dataset.discoveryCategory = item.cat || '';
  link.dataset.discoverySpot = item.spotName || item.title;
  link.setAttribute('aria-label', `${sourceLabel}、${titleLabel}を開く`);
}

function showDiscoveryItem(item, animate = false) {
  const link = document.getElementById('weeklyDiscoveryLink');
  if (!link || !animate || prefersReducedDiscoveryMotion()) {
    updateDiscoveryDom(item);
    return;
  }
  link.classList.add('is-switching');
  window.setTimeout(() => {
    updateDiscoveryDom(item);
    link.classList.remove('is-switching');
  }, 180);
}

function renderWeeklyDiscovery() {
  const card = document.getElementById('weeklyDiscoveryCard');
  if (!card) return;
  try {
    const items = getDiscoveryItems();
    if (!items.length) return;
    const currentKey = getDiscoveryItemKey(currentDiscoveryItem);
    discoveryItems = buildDiscoveryQueue(items);
    const preservedIndex = discoveryItems.findIndex(item => getDiscoveryItemKey(item) === currentKey);
    discoveryIndex = preservedIndex >= 0 ? preservedIndex : discoveryIndex % discoveryItems.length;
    const item = discoveryItems[discoveryIndex];
    if (!item) return;
    showDiscoveryItem(item, false);
  } catch (e) {
    console.warn('Discovery render failed:', e);
  }
}

function shouldRotateDiscovery() {
  if (prefersReducedDiscoveryMotion()) return false;
  if (document.hidden) return false;
  if (Date.now() < discoveryPausedUntil) return false;
  if (document.querySelector('.modal-bg.is-open')) return false;
  return discoveryItems.length > 1;
}

function rotateDiscoveryItem() {
  if (!shouldRotateDiscovery()) return;
  discoveryIndex = (discoveryIndex + 1) % discoveryItems.length;
  showDiscoveryItem(discoveryItems[discoveryIndex], true);
}

function startDiscoveryRotation() {
  if (discoveryTimer || prefersReducedDiscoveryMotion()) return;
  discoveryTimer = window.setInterval(rotateDiscoveryItem, DISCOVERY_ROTATE_MS);
}

function pauseDiscoveryRotation(ms = DISCOVERY_PAUSE_MS) {
  discoveryPausedUntil = Math.max(discoveryPausedUntil, Date.now() + ms);
}

function setActiveSpotCategory(cat = 'all') {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.cat === cat);
  });
}

function getSuggestedSpotItems() {
  const merged = mergeSuggestions();
  return merged.map(s => ({
    id: s.id || s.clientId || '',
    cat: s.cat,
    catLabel: getCatLabel(s.cat),
    name: s.name,
    area: s.area,
    pref: '',
    url: s.url || '',
    resources: getSuggestionResources(s),
    memo: s.reason,
    suggested: true,
    suggestedBy: s.nickname || '匿名リスナー'
  }));
}

function getAllSpotItemsForDisplay() {
  return [
    ...getSuggestedSpotItems(),
    ...SPOTS
  ];
}

function highlightDiscoveryElement(el) {
  if (!el) return;
  document.querySelectorAll('.is-discovery-target').forEach(node => {
    node.classList.remove('is-discovery-target');
  });
  el.classList.add('is-discovery-target');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => el.classList.remove('is-discovery-target'), 2800);
}

function openDiscoveryItem(item = currentDiscoveryItem) {
  if (!item) return;
  if (item.kind === 'review') {
    openSpotReviews(item.spotName || item.title);
    return;
  }

  showingWantList = false;
  setActiveSpotCategory('all');
  const allSpots = getAllSpotItemsForDisplay();
  const spotIndex = allSpots.findIndex(spot => {
    return spot.id === item.id || spot.name === item.spotName || spot.name === item.title;
  });
  visibleSpotCount = spotIndex >= 0
    ? Math.max(INITIAL_SPOT_COUNT, Math.ceil((spotIndex + 1) / INITIAL_SPOT_COUNT) * INITIAL_SPOT_COUNT)
    : Math.max(INITIAL_SPOT_COUNT, allSpots.length);
  renderSpotCards('all');
  window.setTimeout(() => {
    const cards = Array.from(document.querySelectorAll('.spot-card'));
    const target = cards.find(card => {
      const name = card.querySelector('.spot-name')?.textContent || '';
      return card.dataset.id === item.id || name === (item.spotName || item.title);
    });
    highlightDiscoveryElement(target || document.getElementById('spots'));
  }, 80);
}

/** 多め表示は稀に。基本は「ひとつ」で落ち着いて選べる体験に寄せる */
const GACHA_JACKPOT_CHANCE = 0.11;
const GACHA_FULL_REVEAL_CAP = 14;
let gachaSpinTimer = null;
let gachaSpinTickTimer = null;
let gachaIsSpinning = false;
let gachaReturnFocusEl = null;

function getGachaPool() {
  try {
    return getDiscoveryItems().filter(item => item && item.title && item.text);
  } catch (e) {
    return [];
  }
}

function shuffleForGacha(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rollGachaOutcome(pool) {
  if (!pool.length) return { mode: 'empty', items: [], headline: '', foot: '' };
  const pickOne = () => pool[Math.floor(Math.random() * pool.length)];
  const footSingle = 'カードをタップすると、スポットや感想の詳細が開きます。';
  const footMulti = '気になるものから、ひとつずつタップしてみてください。';
  if (pool.length < 2) {
    return { mode: 'normal', items: [pickOne()], headline: 'ひとつ、届きました', sub: 'ポポッと届いたおすすめです', foot: footSingle };
  }
  if (Math.random() > GACHA_JACKPOT_CHANCE) {
    return { mode: 'normal', items: [pickOne()], headline: 'ひとつ、届きました', sub: 'ポポッと届いたおすすめです', foot: footSingle };
  }
  const tierRoll = Math.random();
  let count;
  let headline;
  let sub;
  if (tierRoll < 0.52) {
    count = Math.min(3, pool.length);
    headline = 'いくつか、そろいました';
    sub = '今日はゆっくり比べてみても大丈夫です';
  } else if (tierRoll < 0.88) {
    count = Math.min(5, pool.length);
    headline = 'いくつか、そろいました';
    sub = 'のんびり眺めて、しっくりくるものを選んでください';
  } else {
    count = Math.min(pool.length, GACHA_FULL_REVEAL_CAP);
    headline = 'じっくり眺める回';
    sub = count >= pool.length
      ? 'いま見える候補をまとめて並べました'
      : 'いま見える候補から、いくつかを並べました';
  }
  const items = shuffleForGacha(pool).slice(0, Math.max(count, 2));
  return { mode: 'jackpot', items, headline, sub, foot: footMulti };
}

function gachaResultCardHtml(item, index = 0) {
  const categoryLabel = getCatLabel(item.cat);
  const titleLabel = getDiscoveryTitle(item, categoryLabel);
  const preview = item.text.length > 96 ? `${item.text.slice(0, 96)}…` : item.text;
  const kind = item.kind || 'spot';
  const src = item.sourceLabel || (kind === 'review' ? '💬 みんなの感想' : '📍 おすすめスポット');
  const staggerMs = prefersReducedDiscoveryMotion() ? 0 : Math.min(index, 14) * 42;
  const staggerStyle = staggerMs ? ` style="animation-delay:${staggerMs}ms"` : '';
  return `
    <button type="button" class="gacha-result-card"${staggerStyle} data-kind="${escHtml(kind)}" data-id="${escHtml(item.id || '')}" data-cat="${escHtml(item.cat || '')}" data-spot="${escHtml(item.spotName || item.title || '')}" data-title="${escHtml(item.title || '')}">
      <span class="gacha-result-src">${escHtml(src)}</span>
      <span class="gacha-result-title">${escHtml(titleLabel)}</span>
      <span class="gacha-result-text">${escHtml(preview)}</span>
    </button>
  `;
}

function resetGachaModalUi() {
  gachaIsSpinning = false;
  const box = document.querySelector('.gacha-modal-box');
  if (box) box.classList.remove('is-jackpot');
  if (gachaSpinTimer) {
    window.clearTimeout(gachaSpinTimer);
    gachaSpinTimer = null;
  }
  if (gachaSpinTickTimer) {
    window.clearTimeout(gachaSpinTickTimer);
    gachaSpinTickTimer = null;
  }
  const spinBtn = document.getElementById('gachaSpinBtn');
  if (spinBtn) {
    spinBtn.disabled = false;
    spinBtn.removeAttribute('aria-busy');
  }
  const spinPh = document.getElementById('gachaPhaseSpin');
  if (spinPh) spinPh.removeAttribute('aria-busy');
  const foot = document.getElementById('gachaResultFoot');
  if (foot) {
    foot.textContent = '';
    foot.hidden = true;
  }
  const idle = document.getElementById('gachaPhaseIdle');
  const spin = document.getElementById('gachaPhaseSpin');
  const res = document.getElementById('gachaPhaseResult');
  if (idle) idle.hidden = false;
  if (spin) spin.hidden = true;
  if (res) res.hidden = true;
}

function openGachaModal() {
  const modal = document.getElementById('gachaModal');
  if (!modal) return;
  pauseDiscoveryRotation(120000);
  try {
    gachaReturnFocusEl = document.activeElement;
  } catch (e) {
    gachaReturnFocusEl = null;
  }
  resetGachaModalUi();
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  window.requestAnimationFrame(() => {
    const spinBtn = document.getElementById('gachaSpinBtn');
    if (spinBtn && typeof spinBtn.focus === 'function') spinBtn.focus();
  });
}

function closeGachaModal() {
  const modal = document.getElementById('gachaModal');
  if (!modal) return;
  resetGachaModalUi();
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  const back = gachaReturnFocusEl;
  gachaReturnFocusEl = null;
  if (back && typeof back.focus === 'function') {
    window.requestAnimationFrame(() => {
      try {
        back.focus();
      } catch (e) {
        // フォーカスを戻せない要素の場合は無視
      }
    });
  }
}

function showGachaResult(outcome) {
  const box = document.querySelector('.gacha-modal-box');
  const badge = document.getElementById('gachaResultBadge');
  const grid = document.getElementById('gachaResultGrid');
  const idle = document.getElementById('gachaPhaseIdle');
  const spin = document.getElementById('gachaPhaseSpin');
  if (!badge || !grid || !idle || !spin) return;
  idle.hidden = true;
  spin.hidden = true;
  const res = document.getElementById('gachaPhaseResult');
  if (res) res.hidden = false;

  const foot = document.getElementById('gachaResultFoot');

  if (outcome.mode === 'empty') {
    if (box) box.classList.remove('is-jackpot');
    badge.innerHTML = '<span class="gacha-badge-title">いまは候補がありません</span><span class="gacha-badge-sub">スポットや感想が増えたら、またのんびり試してみてください</span>';
    grid.innerHTML = '';
    if (foot) foot.hidden = true;
    return;
  }

  if (outcome.mode === 'jackpot' && box) box.classList.add('is-jackpot');
  else if (box) box.classList.remove('is-jackpot');

  badge.innerHTML = `
    <span class="gacha-badge-title">${escHtml(outcome.headline)}</span>
    ${outcome.sub ? `<span class="gacha-badge-sub">${escHtml(outcome.sub)}</span>` : ''}
  `;
  grid.innerHTML = outcome.items.map((item, i) => gachaResultCardHtml(item, i)).join('');
  if (foot) {
    foot.textContent = outcome.foot || '';
    foot.hidden = !outcome.foot;
  }
  window.requestAnimationFrame(() => {
    const firstCard = grid.querySelector('.gacha-result-card');
    if (firstCard && typeof firstCard.focus === 'function') {
      try {
        firstCard.focus({ preventScroll: true });
      } catch (e) {
        firstCard.focus();
      }
    }
  });
}

function runGachaSpin() {
  if (gachaIsSpinning) return;
  const pool = getGachaPool();
  const reduced = prefersReducedDiscoveryMotion();
  const idle = document.getElementById('gachaPhaseIdle');
  const spin = document.getElementById('gachaPhaseSpin');
  const spinText = document.getElementById('gachaSpinnerText');
  if (!pool.length) {
    showToast('いま候補が足りません。のんびりあとで試してみてください。');
    return;
  }
  if (!idle || !spin || !spinText) return;

  const spinBtn = document.getElementById('gachaSpinBtn');
  if (spinBtn) {
    spinBtn.disabled = true;
    spinBtn.setAttribute('aria-busy', 'true');
  }
  spin.setAttribute('aria-busy', 'true');

  gachaIsSpinning = true;
  const outcome = rollGachaOutcome(pool);
  idle.hidden = true;
  spin.hidden = false;
  const resPh = document.getElementById('gachaPhaseResult');
  if (resPh) resPh.hidden = true;

  if (reduced) {
    showGachaResult(outcome);
    gachaIsSpinning = false;
    if (spinBtn) {
      spinBtn.disabled = false;
      spinBtn.removeAttribute('aria-busy');
    }
    spin.removeAttribute('aria-busy');
    return;
  }

  let tickCount = 0;
  const maxTicks = 12;
  let nextDelay = 68;
  const runFlickerTick = () => {
    if (tickCount >= maxTicks) {
      gachaSpinTickTimer = null;
      return;
    }
    const sample = pool[Math.floor(Math.random() * pool.length)];
    const categoryLabel = getCatLabel(sample.cat);
    spinText.textContent = getDiscoveryTitle(sample, categoryLabel);
    tickCount += 1;
    nextDelay = Math.min(nextDelay + 12, 148);
    gachaSpinTickTimer = window.setTimeout(runFlickerTick, nextDelay);
  };
  gachaSpinTickTimer = window.setTimeout(runFlickerTick, 55);

  const settleMs = 1580;
  gachaSpinTimer = window.setTimeout(() => {
    if (gachaSpinTickTimer) {
      window.clearTimeout(gachaSpinTickTimer);
      gachaSpinTickTimer = null;
    }
    showGachaResult(outcome);
    gachaSpinTimer = null;
    gachaIsSpinning = false;
    if (spinBtn) {
      spinBtn.disabled = false;
      spinBtn.removeAttribute('aria-busy');
    }
    spin.removeAttribute('aria-busy');
  }, settleMs);
}

function onGachaResultClick(e) {
  const btn = e.target.closest('.gacha-result-card');
  if (!btn) return;
  const kind = btn.dataset.kind;
  const item = {
    kind: kind === 'review' ? 'review' : 'spot',
    id: btn.dataset.id || '',
    cat: btn.dataset.cat || '',
    spotName: btn.dataset.spot || '',
    title: btn.dataset.title || ''
  };
  closeGachaModal();
  openDiscoveryItem(item);
}

function normalizeDedupeValue(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function hashString(value = '') {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function getPostFingerprint(post = {}) {
  const media = Array.isArray(post.media)
    ? post.media.map(item => typeof item === 'string'
      ? item
      : `${item.kind || item.type || ''}:${item.url || ''}`).join('|')
    : (post.photoUrl || '');
  return [
    post.spotName,
    post.comment,
    post.visitDate,
    post.nickname,
    post.rating,
    post.cat,
    post.area,
    media
  ].map(normalizeDedupeValue).join('|');
}

function getReviewDisplayFingerprint(item = {}) {
  return [
    item.spotName || item.name,
    item.comment || item.review,
    item.rating,
    item.cat,
    item.area
  ].map(normalizeDedupeValue).join('|');
}

function hasReviewCore(item = {}) {
  return Boolean(
    normalizeDedupeValue(item.spotName || item.name) &&
    normalizeDedupeValue(item.comment || item.review)
  );
}

function getPostSyncScore(post = {}) {
  const id = String(post.id || '');
  let score = 0;
  if (post.clientId) score += 1;
  if (id && id !== post.clientId && !id.startsWith('p_')) score += 2;
  if (post.timestamp) score += 1;
  return score;
}

function preferPostRecord(current, next) {
  const currentScore = getPostSyncScore(current);
  const nextScore = getPostSyncScore(next);
  if (nextScore !== currentScore) return nextScore > currentScore ? next : current;
  return (next.timestamp || 0) >= (current.timestamp || 0) ? next : current;
}

function dedupePosts(posts = []) {
  const byIdentity = new Map();
  const withoutIdentity = [];

  posts.forEach(post => {
    if (!post) return;
    const identity = post.clientId || post.id;
    if (!identity) {
      withoutIdentity.push(post);
      return;
    }
    const key = `id:${identity}`;
    const current = byIdentity.get(key);
    byIdentity.set(key, current ? preferPostRecord(current, post) : post);
  });

  const byContent = new Map();
  const strictIndex = new Map();
  const displayIndex = new Map();
  [...byIdentity.values(), ...withoutIdentity].forEach(post => {
    const strictFingerprint = hasReviewCore(post) ? getPostFingerprint(post) : '';
    const displayFingerprint = hasReviewCore(post) ? getReviewDisplayFingerprint(post) : '';
    const existingKey = (strictFingerprint && strictIndex.get(strictFingerprint)) ||
      (displayFingerprint && displayIndex.get(displayFingerprint));
    const key = existingKey || strictFingerprint || displayFingerprint || `item:${post.id || Math.random()}`;
    const current = byContent.get(key);
    byContent.set(key, current ? preferPostRecord(current, post) : post);
    if (strictFingerprint) strictIndex.set(strictFingerprint, key);
    if (displayFingerprint) displayIndex.set(displayFingerprint, key);
  });

  return Array.from(byContent.values());
}

function getReviewReactionId(item = {}, scope = 'review') {
  const fingerprint = getReviewDisplayFingerprint(item);
  return `review_seen_${hashString(`${scope}|${fingerprint}`)}`;
}

function renderChatReactionButton(reactionId, icon, label, reactedLabel) {
  const reacted = Boolean(localChatReactions[reactionId]);
  const count = getChatReactionCount(reactionId);
  return `
    <button type="button" class="chat-reaction-btn ${reacted ? 'is-reacted' : ''}" data-chat-reaction-id="${escHtml(reactionId)}" data-default-label="${escHtml(label)}" data-reacted-label="${escHtml(reactedLabel)}" aria-pressed="${reacted ? 'true' : 'false'}">
      <span>${icon}</span>
      <span class="chat-reaction-text">${reacted ? escHtml(reactedLabel) : escHtml(label)}</span>
      <span class="chat-reaction-count">${count}</span>
    </button>
  `;
}

function renderSeenReviewButton(reviewId) {
  const isSeen = Boolean(localSeenReviews[reviewId]);
  const count = getSeenReviewCount(reviewId);
  return `
    <button type="button" class="review-seen-btn ${isSeen ? 'is-seen' : ''}" data-review-seen-id="${escHtml(reviewId)}" aria-pressed="${isSeen ? 'true' : 'false'}">
      <span class="review-seen-icon">👀</span>
      <span class="review-seen-text">${isSeen ? '見たよ済み' : '見たよ'}</span>
      <span class="review-seen-count" id="like-count-${escHtml(reviewId)}">${count}</span>
    </button>
  `;
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
  
  // すべての候補を一つのプールにまとめる
  const pool = [
    // スポット系
    ...localSuggestions.map(spot => ({
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
    })),
    // 感想系
    ...allPosts.map(post => ({
      kind: 'review',
      kindLabel: 'みんなの感想',
      title: post.spotName || 'スポット',
      text: truncateText(post.comment || '', 42),
      meta: [post.rating ? renderStars(post.rating) : '', formatVisitDate(post.visitDate), post.nickname ? `👤 ${post.nickname}` : ''].filter(Boolean).join(' ・ '),
      accent: post.cat
    })),
    ...localPosts.map(post => ({
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
  ];

  // 全体をシャッフルして必要な数だけ抽出
  return shuffleItems(pool).slice(0, slots.length);
}

function renderHeroBackdrop() {
  const host = document.getElementById('heroShowcase');
  if (!host) return;
  const cards = buildHeroCards();
  const slots = getHeroCardSlots();
  const isMobile = slots.length === 2;
  
  // 既存のコンテンツを一旦クリアして確実に再描画させる
  host.innerHTML = ''; 
  
  const fragment = document.createDocumentFragment();
  cards.forEach((card, index) => {
    const slot = slots[index % slots.length];
    const cardEl = document.createElement('div');
    cardEl.className = 'hero-float-card';
    
    // 不透明度を大幅にアップ (0.6 ~ 0.85 程度)
    const baseOpacity = isMobile ? 0.7 : 0.6;
    const opacity = baseOpacity + (index * 0.05);
    
    const style = [
      slot.top ? `top:${slot.top}` : '',
      slot.bottom ? `bottom:${slot.bottom}` : '',
      slot.left ? `left:${slot.left}` : '',
      slot.right ? `right:${slot.right}` : '',
      `width:${slot.width}`,
      `--card-rot:${slot.rot}`,
      `--card-scale:${slot.scale || 1}`,
      `--card-opacity:${opacity}`,
      `--float-delay:${slot.delay}`,
      `--hero-accent:${getCatAccent(card.accent)}`,
      `animation-delay:${index * 0.2}s` // 順繰りに表示されるように
    ].filter(Boolean).join(';');
    
    cardEl.setAttribute('style', style);
    cardEl.innerHTML = `
      <div class="hero-float-card-inner">
        <span class="hero-float-kind">${escHtml(card.kindLabel)}</span>
        <div class="hero-float-title">${escHtml(card.title)}</div>
        <div class="hero-float-text">${escHtml(card.text)}</div>
        ${card.meta ? `<div class="hero-float-meta">${escHtml(card.meta)}</div>` : ''}
      </div>
    `;
    fragment.appendChild(cardEl);
  });
  
  host.appendChild(fragment);
}

function startHeroBackdropRotation() {
  if (heroBackdropTimer || !document.getElementById('heroShowcase')) return;
  
  heroBackdropTimer = window.setInterval(() => {
    renderHeroBackdrop();
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
  return sortNewest(dedupePosts(allPosts).filter(p => String(p.spotName || '').trim() === target));
}

function formatVisitDate(date) {
  return date ? new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }) : '日付不明';
}

function getSavedSpotIds() {
  return Object.keys(localLikes).filter(id => localLikes[id]);
}

function getActiveSpotCategory() {
  return document.querySelector('.tab.active')?.dataset.cat || 'all';
}

function updateWantListButton() {
  const btn = document.getElementById('wantListToggleBtn');
  if (!btn) return;
  const count = getSavedSpotIds().length;
  btn.classList.toggle('active', showingWantList);
  btn.setAttribute('aria-pressed', showingWantList ? 'true' : 'false');
  btn.textContent = showingWantList
    ? `すべてのスポットに戻る（${count}）`
    : `🔖 行きたいリスト（${count}）`;
}

function updateWantListHint(visibleSavedCount = 0) {
  const hint = document.getElementById('wantListHint');
  if (!hint) return;
  hint.hidden = !(showingWantList && visibleSavedCount > 0);
}

function renderSpotCards(cat = 'all') {
  const grid = document.getElementById('spotsGrid');
  const allSpots = getAllSpotItemsForDisplay();
  let filtered = cat === 'all' ? allSpots : allSpots.filter(s => s.cat === cat);
  if (showingWantList) {
    filtered = filtered.filter(s => localLikes[s.id]);
  }
  const visibleSpots = filtered.slice(0, visibleSpotCount);
  updateWantListButton();
  updateWantListHint(filtered.length);
  if (showingWantList && filtered.length === 0) {
    grid.innerHTML = `
      <div class="spots-empty-card">
        <strong>まだ行きたいスポットがありません</strong>
        <span>気になるスポットの「🔖 行きたい」を押すと、ここに集まります。</span>
      </div>
    `;
    setStatText('statSpots', allSpots.length);
    updateMoreButton('spotsMoreBtn', 0, 0, INITIAL_SPOT_COUNT);
    return;
  }
  grid.innerHTML = visibleSpots.map(s => {
    const reviews = getSpotReviews(s.name);
    const reviewCount = reviews.length;
    const latestReviewText = reviews[0]?.comment ? truncateText(reviews[0].comment, 46) : '';
    const resources = getSuggestionResources(s);
    const previewImage = getResourcePreviewImage(resources);
    return `
    <div class="spot-card" data-cat="${s.cat}" data-id="${s.id}">
      <div class="spot-card-top">
        <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);margin-bottom:0;font-size:0.8rem;">${s.catLabel || getCatLabel(s.cat)}</span>
        <div style="display:flex;gap:8px;align-items:center;">
          ${s.suggested ? renderPostActions(s, 'suggestion') : ''}
          <button class="spot-like-btn ${localLikes[s.id] ? 'liked' : ''}" data-id="${s.id}" id="like-${s.id}" aria-pressed="${localLikes[s.id] ? 'true' : 'false'}">
            <span class="spot-like-icon">${localLikes[s.id] ? '✅' : '🔖'}</span>
            <span class="spot-like-label">${localLikes[s.id] ? '行きたい済み' : '行きたい'}</span>
            <span class="spot-like-count" id="like-count-${s.id}">${globalLikes[s.id] || localLikes[s.id] || 0}</span>
          </button>
        </div>
      </div>
      ${previewImage ? `<img class="spot-preview-img" src="${escHtml(previewImage)}" alt="" loading="lazy">` : ''}
      <div class="spot-name">${escHtml(s.name)}</div>
      <div class="spot-area"><span>📍 ${escHtml(s.area)}${s.pref && s.pref !== '東京' && s.pref !== '全国' && s.pref !== 'オンライン' ? '（' + escHtml(s.pref) + '）' : ''}</span></div>
      ${s.memo || s.reason ? `<div class="spot-memo">${escHtml(s.memo || s.reason)}</div>` : ''}
      ${s.suggested ? `<div class="spot-memo" style="font-size:0.78rem;color:var(--text-dim);">提案者：${escHtml(s.suggestedBy)}</div>` : ''}
      ${resources.length ? `<div class="spot-resources">${renderResourceLinks(resources, 'spot', 'spot-link')}</div>` : ''}
      ${latestReviewText ? `
        <button type="button" class="spot-latest-review" data-spotname="${escHtml(s.name)}" aria-label="${escHtml(s.name)}のみんなの感想を見る">
          <span>最近の感想</span>
          <strong>${escHtml(latestReviewText)}</strong>
        </button>
      ` : ''}
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
      const saved = await saveLike(sid);
      if (!saved) return;
      btn.classList.add('liked');
      btn.setAttribute('aria-pressed', 'true');
      const icon = btn.querySelector('.spot-like-icon');
      const label = btn.querySelector('.spot-like-label');
      if (icon) icon.textContent = '✅';
      if (label) label.textContent = '行きたい済み';
      updateWantListButton();
    });
  });
  grid.querySelectorAll('.spot-post-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.spotname));
  });
  grid.querySelectorAll('.spot-reviews-btn').forEach(btn => {
    btn.addEventListener('click', () => openSpotReviews(btn.dataset.spotname));
  });
  grid.querySelectorAll('.spot-latest-review').forEach(btn => {
    btn.addEventListener('click', () => openSpotReviews(btn.dataset.spotname));
  });

  // スポット数更新（提案含む）
  setStatText('statSpots', allSpots.length);
  updateMoreButton('spotsMoreBtn', filtered.length, Math.min(visibleSpotCount, filtered.length), INITIAL_SPOT_COUNT);
}

function getCatLabel(cat) {
  return { 
    food: '🍴 飲食店', 
    mohinga: '🍜 食べたいもの', 
    museum: '🎨 美術館・博物館', 
    event: '🌿 イベント', 
    nature: '🌳 自然・よりみち',
    book: '📚 本・しらべもの',
    shop: '🛒 くらし・雑貨',
    view: '✨ おきにいりの景色',
    relax: '🛁 癒やし・ととのう',
    entertainment: '🎬 エンタメ' 
  }[cat] || '📍 スポット';
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
    const reviewSeenId = getReviewReactionId(p, 'listener');
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
        <div class="review-reactions">${renderSeenReviewButton(reviewSeenId)}</div>
      </article>
    `;
  }).join('');
}

function renderVisited(posts = []) {
  const grid = document.getElementById('visitedGrid');
  const sortedPosts = sortNewest(dedupePosts(posts));
  const listenerReviewKeys = new Set(sortedPosts.map(getReviewDisplayFingerprint));
  
  const officialCards = VISITED
    .filter(v => !listenerReviewKeys.has(getReviewDisplayFingerprint(v)))
    .map(v => {
      const reviewSeenId = getReviewReactionId(v, 'official');
      return `
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
        <div class="review-reactions">${renderSeenReviewButton(reviewSeenId)}</div>
      </div>
    </div>
  `;
    });

  const listenerCards = sortedPosts.map(p => {
    const dateStr = formatVisitDate(p.visitDate);
    const areaStr = p.area ? `📍 ${escHtml(p.area)}` : '📍 エリア不明';
    const nickname = p.nickname || '匿名リスナー';
    const media = getPostMedia(p);
    const previewImage = getResourcePreviewImage(media);
    const reviewSeenId = getReviewReactionId(p, 'listener');
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
        <div class="review-reactions">${renderSeenReviewButton(reviewSeenId)}</div>
        ${renderPostActions(p, 'post')}
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

  const chatMap = new Map();
  chats.forEach(chat => {
    const key = getChatKey(chat);
    if (key) chatMap.set(key, chat);
  });

  const childMap = new Map();
  chats.forEach(chat => {
    if (!chat.parentId || !chatMap.has(chat.parentId)) return;
    if (!childMap.has(chat.parentId)) childMap.set(chat.parentId, []);
    childMap.get(chat.parentId).push(chat);
  });

  childMap.forEach(children => {
    children.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  });

  function getThreadLatestActivityTs(rootChat) {
    let maxTs = rootChat.timestamp || 0;
    const walk = parentKey => {
      const kids = childMap.get(parentKey) || [];
      kids.forEach(ch => {
        maxTs = Math.max(maxTs, ch.timestamp || 0);
        const k = getChatKey(ch);
        if (k) walk(k);
      });
    };
    const rootKey = getChatKey(rootChat);
    if (rootKey) walk(rootKey);
    return maxTs;
  }

  const topLevel = chats
    .filter(chat => !chat.parentId || !chatMap.has(chat.parentId))
    .sort((a, b) => getThreadLatestActivityTs(b) - getThreadLatestActivityTs(a));
  const visibleTopLevel = topLevel.slice(0, visibleChatCount);

  function createChatCardHtml(chat, depth = 0) {
    const dateStr = new Date(chat.timestamp).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const nick = chat.nickname || '匿名リスナー';
    const initial = Array.from(nick)[0].toUpperCase();
    const thanksId = getChatReactionId(chat, 'thanks');
    const curiousId = getChatReactionId(chat, 'curious');
    const cid = getChatKey(chat);
    const parent = chat.parentId ? chatMap.get(chat.parentId) : null;
    const parentNick = parent?.nickname || chat.parentNick || '元の投稿';
    const replyContext = chat.parentId
      ? `<div class="chat-reply-context">↳ ${escHtml(parentNick)} への返信</div>`
      : '';

    return `
      <div class="chat-card ${depth > 0 ? 'is-reply' : ''}" data-chat-id="${escHtml(cid)}" data-depth="${Math.min(depth, 3)}">
        <div class="chat-avatar">${escHtml(initial)}</div>
        <div class="chat-content">
          <div class="chat-head">
            <span class="chat-nick">${escHtml(nick)}</span>
            <span class="chat-date">${dateStr}</span>
          </div>
          ${replyContext}
          <div class="chat-msg">${escHtml(chat.message)}</div>
          <div class="chat-reactions">
            ${renderChatReactionButton(thanksId, '💐', 'ありがとう', 'ありがとう済み')}
            ${renderChatReactionButton(curiousId, '👀', '気になる', '気になる済み')}
            <button class="btn-reply" onclick="initiateReply('${escHtml(cid)}')">💬 返信</button>
          </div>
          ${renderPostActions(chat, 'chat')}
        </div>
      </div>
    `;
  }

  function renderChatBranch(chat, depth = 0) {
    const key = getChatKey(chat);
    const children = childMap.get(key) || [];
    const repliesHtml = children.length > 0
      ? `<div class="chat-replies" data-depth="${Math.min(depth + 1, 3)}">
          <div class="chat-replies-label">返信 ${children.length}件</div>
          ${children.map(child => renderChatBranch(child, depth + 1)).join('')}
        </div>`
      : '';

    return `
      <div class="${depth === 0 ? 'chat-thread' : 'chat-branch'}" data-depth="${Math.min(depth, 3)}">
        ${createChatCardHtml(chat, depth)}
        ${repliesHtml}
      </div>
    `;
  }

  grid.innerHTML = visibleTopLevel.map(chat => renderChatBranch(chat, 0)).join('');

  updateMoreButton('chatsMoreBtn', topLevel.length, Math.min(visibleChatCount, topLevel.length), INITIAL_CHAT_COUNT);
}

window.initiateReply = function(chatId) {
  const chat = findChatByKey(chatId);
  
  if (!chat) return;
  
  replyingTo = chat;
  const modal = document.getElementById('chatModal');
  const info = document.getElementById('chatReplyInfo');
  const nick = document.getElementById('chatReplyNick');
  
  if (info && nick) {
    nick.textContent = chat.nickname || '匿名リスナー';
    info.style.display = 'flex';
  }
  
  openChatModal();
};

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
function captureAddSpotFormDraftState() {
  return {
    name: document.getElementById('asName')?.value || '',
    area: document.getElementById('asArea')?.value || '',
    cat: document.getElementById('asCat')?.value || '',
    reason: document.getElementById('asReason')?.value || '',
    nick: document.getElementById('asNick')?.value || '',
    kinds: [1, 2, 3].map(i => document.getElementById(`asKind${i}`)?.value || ''),
    urls: [1, 2, 3].map(i => document.getElementById(`asUrl${i}`)?.value || '')
  };
}

function addSpotDraftStateHasText(state) {
  if (!state) return false;
  const parts = [state.name, state.area, state.reason, state.nick, ...(state.urls || [])];
  return parts.some(p => String(p || '').trim().length > 0);
}

function scheduleSaveAddSpotFormDraft() {
  window.clearTimeout(addSpotDraftTimer);
  addSpotDraftTimer = window.setTimeout(() => {
    addSpotDraftTimer = null;
    const modal = document.getElementById('addSpotModal');
    if (!modal?.classList.contains('is-open')) return;
    if (editingClientId) return;
    const state = captureAddSpotFormDraftState();
    if (!addSpotDraftStateHasText(state)) {
      try {
        sessionStorage.removeItem(ADD_SPOT_FORM_DRAFT_KEY);
      } catch (e) {
        // ignore
      }
      return;
    }
    try {
      sessionStorage.setItem(ADD_SPOT_FORM_DRAFT_KEY, JSON.stringify(state));
    } catch (e) {
      // プライベートモード等では保存できない場合がある
    }
  }, 450);
}

function clearAddSpotFormDraft() {
  try {
    sessionStorage.removeItem(ADD_SPOT_FORM_DRAFT_KEY);
  } catch (e) {
    // ignore
  }
}

function restoreAddSpotFormDraftIfAny() {
  if (editingClientId) return;
  let state = null;
  try {
    state = JSON.parse(sessionStorage.getItem(ADD_SPOT_FORM_DRAFT_KEY) || 'null');
  } catch (e) {
    return;
  }
  if (!state || typeof state !== 'object' || !addSpotDraftStateHasText(state)) return;
  const setVal = (id, v) => {
    const el = document.getElementById(id);
    if (el && v != null) el.value = String(v);
  };
  setVal('asName', state.name);
  setVal('asArea', state.area);
  if (state.cat) setVal('asCat', state.cat);
  setVal('asReason', state.reason);
  setVal('asNick', state.nick);
  for (let i = 0; i < 3; i += 1) {
    const k = state.kinds && state.kinds[i];
    const u = state.urls && state.urls[i];
    if (k) setVal(`asKind${i + 1}`, k);
    if (u != null) setVal(`asUrl${i + 1}`, u);
  }
  const reasonEl = document.getElementById('asReason');
  const charNum = document.getElementById('asCharNum');
  if (charNum && reasonEl) charNum.textContent = String((reasonEl.value || '').length);
}

function applySuggestionResourcesToAddSpotRows(s) {
  const resources = getSuggestionResources(s);
  for (let i = 0; i < 3; i += 1) {
    const urlEl = document.getElementById(`asUrl${i + 1}`);
    const kindEl = document.getElementById(`asKind${i + 1}`);
    const entry = resources[i];
    if (urlEl) urlEl.value = entry?.url || '';
    if (kindEl) kindEl.value = entry?.kind || 'reference';
  }
}

// スポット追加モーダル
function openAddSpotModal(id = null, clientId = null) {
  const modal = document.getElementById('addSpotModal');
  const wasOpen = modal.classList.contains('is-open');
  const prevEditingClientId = editingClientId;
  const openingBlankNew = !id && !clientId;
  if (wasOpen && openingBlankNew && !prevEditingClientId) {
    return;
  }

  editingId = id;
  editingClientId = clientId;

  const title = modal.querySelector('.modal-title') || modal.querySelector('h3');
  const btn = document.getElementById('addSpotSubmitBtn');

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  document.getElementById('addSpotForm').reset();
  document.getElementById('asCharNum').textContent = '0';
  clearResourceValidation('spot');

  if (editingClientId) {
    if (title) title.textContent = '✨ スポット情報を編集';
    if (btn) btn.textContent = '更新する 🚀';

    const suggs = getAllSpotItemsForDisplay().filter(s => s.suggested);
    const s = suggs.find(item => (item.clientId || item.id) === editingClientId);
    if (s) {
      document.getElementById('asName').value = s.name || '';
      document.getElementById('asArea').value = s.area || '';
      document.getElementById('asCat').value = s.cat || 'food';
      document.getElementById('asReason').value = s.reason || '';
      document.getElementById('asNick').value = s.nickname || '';
      applySuggestionResourcesToAddSpotRows(s);
      const reasonEl = document.getElementById('asReason');
      const charNum = document.getElementById('asCharNum');
      if (charNum && reasonEl) charNum.textContent = String((reasonEl.value || '').length);
    }
  } else {
    if (title) title.textContent = '✨ スポットを提案する';
    if (btn) btn.textContent = '提案を送る 🚀';
    fillSavedNickname('asNick');
    restoreAddSpotFormDraftIfAny();
  }
}
function closeAddSpotModal() {
  document.getElementById('addSpotModal').classList.remove('is-open');
  document.body.style.overflow = '';
  editingId = null;
  editingClientId = null;
}

// 掲示板投稿モーダル
function openChatModal(prefill = '', id = null, clientId = null) {
  editingId = id;
  editingClientId = clientId;
  
  const modal = document.getElementById('chatModal');
  const title = modal.querySelector('.modal-title') || modal.querySelector('h3');
  const btn = document.getElementById('chatSubmitBtn');
  
  if (editingClientId) {
    replyingTo = null;
    const info = document.getElementById('chatReplyInfo');
    if (info) info.style.display = 'none';
    if (title) title.textContent = '💬 つぶやきを編集';
    if (btn) btn.textContent = '更新する 🚀';
    
    const chat = allChats.find(c => getChatKey(c) === editingClientId);
    if (chat) {
      const nickInput = document.getElementById('cNick');
      if (nickInput) nickInput.value = chat.nickname === '匿名リスナー' ? '' : (chat.nickname || '');
    }
  } else {
    if (replyingTo) {
      if (title) title.textContent = '💬 返信する';
      if (btn) btn.textContent = '返信する 🚀';
    } else {
      if (title) title.textContent = '💬 つぶやく';
      if (btn) btn.textContent = '投稿する 🚀';
      const info = document.getElementById('chatReplyInfo');
      if (info) info.style.display = 'none';
    }
    fillSavedNickname('cNick');
  }

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const message = document.getElementById('cMsg');
  if (prefill && message) {
    message.value = prefill;
    message.focus();
    message.setSelectionRange(message.value.length, message.value.length);
  }
}
function closeChatModal() {
  document.getElementById('chatModal').classList.remove('is-open');
  document.body.style.overflow = '';
  replyingTo = null;
  const info = document.getElementById('chatReplyInfo');
  if (info) info.style.display = 'none';
}

document.getElementById('chatReplyClearBtn')?.addEventListener('click', () => {
  replyingTo = null;
  const info = document.getElementById('chatReplyInfo');
  if (info) info.style.display = 'none';
});

function normalizeGalleryAnswer(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s　・･._＿\-ー−—–]/g, '')
    .replace(/[\u3041-\u3096]/g, char => String.fromCharCode(char.charCodeAt(0) + 0x60));
}

function isGalleryUnlockAnswer(value) {
  const answer = normalizeGalleryAnswer(value);
  return answer.includes('timtam') ||
    answer.includes('ティムタム') ||
    answer.includes('テイムタム');
}

function getGalleryUnlockKey(imageSrc) {
  return `popopo_gallery_unlocked_${imageSrc || 'item'}`;
}

function isGalleryUnlocked(imageSrc) {
  try {
    const isDict = typeof GALLERY_ITEMS !== 'undefined' && GALLERY_ITEMS.some(item => (item.type === 'dict' || item.type === 'dict_page') && item.image === imageSrc);
    const key = isDict ? 'popopo_gallery_unlocked_dictionary' : getGalleryUnlockKey(imageSrc);
    return sessionStorage.getItem(key) === 'true';
  } catch (e) {
    return false;
  }
}

function rememberGalleryUnlock(imageSrc) {
  try {
    const isDict = typeof GALLERY_ITEMS !== 'undefined' && GALLERY_ITEMS.some(item => (item.type === 'dict' || item.type === 'dict_page') && item.image === imageSrc);
    const key = isDict ? 'popopo_gallery_unlocked_dictionary' : getGalleryUnlockKey(imageSrc);
    sessionStorage.setItem(key, 'true');
  } catch (e) {
    // Safariのプライベート環境などでは保存できないことがあるため、その場で開ければ十分。
  }
}

function isDictionaryGalleryItem(item) {
  return Boolean(item && (item.type === 'dict' || item.type === 'dict_page'));
}

function getGalleryItemByImage(imageSrc) {
  if (typeof GALLERY_ITEMS === 'undefined') return null;
  return GALLERY_ITEMS.find(item => item.image === imageSrc) || null;
}

function getCurrentGalleryItem() {
  if (typeof GALLERY_ITEMS === 'undefined' || currentGalleryIndex < 0) return null;
  return GALLERY_ITEMS[currentGalleryIndex] || null;
}

function isCurrentGalleryDictionary() {
  return isDictionaryGalleryItem(getCurrentGalleryItem());
}

function getSameGalleryTypeItems(currentItem) {
  if (typeof GALLERY_ITEMS === 'undefined' || !currentItem) return [];
  const isDict = isDictionaryGalleryItem(currentItem);
  return GALLERY_ITEMS.map((item, idx) => ({ item, idx })).filter(entry => {
    if (isDict) return isDictionaryGalleryItem(entry.item);
    return entry.item.type === currentItem.type;
  });
}

function setGalleryModalMode(imageSrc) {
  const modalBox = document.querySelector('.gallery-modal-box');
  const item = getCurrentGalleryItem() || getGalleryItemByImage(imageSrc);
  if (modalBox) modalBox.classList.toggle('is-dictionary-mode', isDictionaryGalleryItem(item));
}

function hideDictionaryThumbs() {
  const thumbs = document.getElementById('galleryDictThumbs');
  if (!thumbs) return;
  thumbs.hidden = true;
  thumbs.innerHTML = '';
}

function setGalleryBaseControls(isDict) {
  const btnPrev = document.getElementById('galleryBtnPrev');
  const btnNext = document.getElementById('galleryBtnNext');
  const btnZoomIn = document.getElementById('galleryBtnZoomIn');
  const btnZoomOut = document.getElementById('galleryBtnZoomOut');
  const btnClose = document.getElementById('galleryBtnCloseView');
  if (btnPrev) {
    btnPrev.textContent = isDict ? '前へ' : '◀︎';
    btnPrev.style.opacity = '0.3';
    btnPrev.style.pointerEvents = 'none';
    btnPrev.disabled = true;
    btnPrev.setAttribute('aria-disabled', 'true');
    btnPrev.onclick = (e) => e.stopPropagation();
  }
  if (btnNext) {
    btnNext.textContent = isDict ? '次へ' : '▶︎';
    btnNext.style.opacity = '0.3';
    btnNext.style.pointerEvents = 'none';
    btnNext.disabled = true;
    btnNext.setAttribute('aria-disabled', 'true');
    btnNext.onclick = (e) => e.stopPropagation();
  }
  if (btnZoomIn) {
    btnZoomIn.textContent = isDict ? '拡大' : '＋';
    btnZoomIn.setAttribute('aria-label', isDict ? '用語辞典を拡大する' : '画像を拡大する');
    btnZoomIn.onclick = (e) => { e.stopPropagation(); setGalleryZoom(true); };
  }
  if (btnZoomOut) {
    btnZoomOut.textContent = isDict ? '戻す' : '－';
    btnZoomOut.setAttribute('aria-label', isDict ? '用語辞典の拡大を戻す' : '拡大を戻す');
    btnZoomOut.onclick = (e) => { e.stopPropagation(); resetGalleryZoom(); };
  }
  if (btnClose) {
    btnClose.textContent = isDict ? '閉じる' : '✕';
    btnClose.onclick = (e) => { e.stopPropagation(); closeGalleryModal(); };
  }
}

function setGalleryLockState(locked, hint = '') {
  const visual = document.getElementById('galleryModalVisual');
  const lockVisual = document.getElementById('galleryLockVisual');
  const lockPanel = document.getElementById('galleryLockPanel');
  const lockHint = document.getElementById('galleryLockHint');
  const lockInput = document.getElementById('galleryLockInput');
  const lockMessage = document.getElementById('galleryLockMessage');

  visual?.classList.toggle('is-locked', locked);
  if (lockVisual) lockVisual.hidden = !locked;
  if (lockPanel) lockPanel.hidden = !locked;
  if (lockHint) lockHint.textContent = hint;
  if (lockInput) lockInput.value = '';
  if (lockMessage) {
    lockMessage.textContent = '';
    lockMessage.classList.remove('is-success');
  }
}

function showGalleryImage(imageSrc, title, caption, alt) {
  const modal = document.getElementById('galleryModal');
  const image = document.getElementById('galleryModalImage');
  const titleEl = document.getElementById('galleryModalTitle');
  const captionEl = document.getElementById('galleryModalCaption');
  if (!modal || !image || !titleEl || !captionEl) return;
  setGalleryLockState(false);
  setGalleryModalMode(imageSrc);
  image.src = imageSrc;
  image.alt = alt || title || '配信で届いた作品';
  titleEl.textContent = title || '配信で届いた作品';
  captionEl.textContent = caption || '';
}

function openGalleryModal(imageSrc, title, caption, alt, lockAnswer = '', lockHint = '') {
  const modal = document.getElementById('galleryModal');
  const image = document.getElementById('galleryModalImage');
  const titleEl = document.getElementById('galleryModalTitle');
  const captionEl = document.getElementById('galleryModalCaption');
  if (!modal || !image || !titleEl || !captionEl) return;

  const needsUnlock = Boolean(lockAnswer);
  const isUnlocked = needsUnlock && isGalleryUnlocked(imageSrc);
  const isDict = isDictionaryGalleryItem(getCurrentGalleryItem() || getGalleryItemByImage(imageSrc));
  setGalleryModalMode(imageSrc);
  setGalleryBaseControls(isDict);
  titleEl.textContent = title || '配信で届いた作品';
  captionEl.textContent = caption || '';

  if (needsUnlock && !isUnlocked) {
    pendingGalleryUnlock = { imageSrc, title, caption, alt };
    image.src = '';
    image.alt = '';
    setGalleryLockState(true, lockHint || '合言葉を入力してください。');
    hideDictionaryThumbs();
    window.setTimeout(() => document.getElementById('galleryLockInput')?.focus(), 60);
  } else {
    pendingGalleryUnlock = null;
    showGalleryImage(imageSrc, title, caption, alt);
  }

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  resetGalleryZoom();

  // 操作ガイドを表示
  showGalleryHint(isDict ? 'ピンチ・ダブルタップで拡大。下のボタンでページ移動できます' : '左右スワイプで作品移動。タップで拡大できます');
}

function showGalleryHint(text) {
  let hint = document.getElementById('galleryActionHint');
  if (!hint) {
    hint = document.createElement('div');
    hint.id = 'galleryActionHint';
    hint.className = 'gallery-action-hint';
    document.getElementById('galleryModal')?.appendChild(hint);
  }
  hint.textContent = text;
  hint.classList.add('is-visible');
  setTimeout(() => hint.classList.remove('is-visible'), 3000);
}

// ズーム・パン（移動）のロジック
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;
let galleryZoomScale = 1;
let pinchStartDistance = 0;
let pinchStartScale = 1;
let lastGalleryTapTime = 0;

function getTouchDistance(touches) {
  if (!touches || touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function clampGalleryScale(scale) {
  return Math.max(1, Math.min(scale, isCurrentGalleryDictionary() ? 3.4 : 3));
}

function applyGalleryTransform() {
  const image = document.getElementById('galleryModalImage');
  if (!image) return;
  if (galleryZoomScale <= 1) {
    image.style.transform = '';
    return;
  }
  image.style.transform = `scale(${galleryZoomScale}) translate(${translateX / galleryZoomScale}px, ${translateY / galleryZoomScale}px)`;
}

function setGalleryZoom(zoomed, scale = null) {
  const image = document.getElementById('galleryModalImage');
  const modalBox = document.querySelector('.gallery-modal-box');
  const visual = document.getElementById('galleryModalVisual');
  const btnZoomIn = document.getElementById('galleryBtnZoomIn');
  if (!image) return;
  const isDict = isCurrentGalleryDictionary();
  if (zoomed) {
    galleryZoomScale = clampGalleryScale(scale || (isDict ? 2.15 : (window.innerWidth > 1024 ? 3 : 2.5)));
    image.classList.add('is-zoomed');
    if (visual) visual.classList.add('is-gallery-zoomed');
    if (modalBox) {
      modalBox.classList.toggle('is-focus-mode', !isDict);
      modalBox.classList.toggle('is-dictionary-zoomed', isDict);
    }
  } else {
    galleryZoomScale = 1;
    translateX = 0;
    translateY = 0;
    image.classList.remove('is-zoomed');
    if (visual) visual.classList.remove('is-gallery-zoomed');
    if (modalBox) modalBox.classList.remove('is-focus-mode', 'is-dictionary-zoomed');
  }
  if (btnZoomIn) btnZoomIn.setAttribute('aria-pressed', galleryZoomScale > 1 ? 'true' : 'false');
  applyGalleryTransform();
}

function resetGalleryZoom() {
  isDragging = false;
  pinchStartDistance = 0;
  pinchStartScale = 1;
  setGalleryZoom(false);
}

document.addEventListener('DOMContentLoaded', () => {
  const modalImg = document.getElementById('galleryModalImage');
  if (modalImg) {
    modalImg.addEventListener('click', (e) => {
      if (modalImg.src && !document.getElementById('galleryLockVisual')?.offsetParent) {
        if (!isDragging) { // ドラッグ直後のクリック誤動作防止
          const isDict = isCurrentGalleryDictionary();
          const now = Date.now();
          const isDoubleTap = now - lastGalleryTapTime < 320;
          lastGalleryTapTime = now;
          if (!isDict || isDoubleTap) {
            setGalleryZoom(!modalImg.classList.contains('is-zoomed'));
          }
        }
      }
    });

    // ドラッグ開始
    const startDrag = (e) => {
      if (e.type === 'touchstart' && e.touches.length >= 2 && isCurrentGalleryDictionary()) {
        pinchStartDistance = getTouchDistance(e.touches);
        pinchStartScale = galleryZoomScale;
        return;
      }
      if (!modalImg.classList.contains('is-zoomed')) return;
      isDragging = true;
      modalImg.style.transition = 'none'; // ドラッグ中はアニメーションをオフ
      const touch = e.type === 'touchstart' ? e.touches[0] : e;
      startX = touch.clientX - translateX;
      startY = touch.clientY - translateY;
    };

    // ドラッグ中
    const moveDrag = (e) => {
      if (e.type === 'touchmove' && e.touches.length >= 2 && pinchStartDistance > 0 && isCurrentGalleryDictionary()) {
        e.preventDefault();
        galleryZoomScale = clampGalleryScale(pinchStartScale * (getTouchDistance(e.touches) / pinchStartDistance));
        setGalleryZoom(galleryZoomScale > 1.04, galleryZoomScale);
        return;
      }
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.type === 'touchmove' ? e.touches[0] : e;
      translateX = touch.clientX - startX;
      translateY = touch.clientY - startY;
      applyGalleryTransform();
    };

    // ドラッグ終了
    const endDrag = () => {
      pinchStartDistance = 0;
      if (!isDragging) return;
      setTimeout(() => isDragging = false, 50);
      modalImg.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    };

    modalImg.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    modalImg.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
  }
});

function openGalleryItem(card) {
  if (!card) return;
  const index = Number(card.dataset.galleryIndex);
  if (Number.isInteger(index) && typeof GALLERY_ITEMS !== 'undefined' && GALLERY_ITEMS[index]) {
    openGalleryItemByIndex(index);
    return;
  }
  currentGalleryIndex = -1;
  openGalleryModal(card.dataset.image, card.dataset.title, card.dataset.caption, card.dataset.alt, card.dataset.lockAnswer, card.dataset.lockHint);
}

function submitGalleryUnlock() {
  const input = document.getElementById('galleryLockInput');
  const message = document.getElementById('galleryLockMessage');
  if (!input || !message || !pendingGalleryUnlock) return;

  if (!isGalleryUnlockAnswer(input.value)) {
    message.textContent = 'ちょっと違うかも。英字でもカタカナでも大丈夫です。';
    message.classList.remove('is-success');
    input.select();
    return;
  }

  const { imageSrc, title, caption, alt } = pendingGalleryUnlock;
  rememberGalleryUnlock(imageSrc);
  message.textContent = '正解です。POPOPO用語辞典を開きます。';
  message.classList.add('is-success');
  window.setTimeout(() => {
    showGalleryImage(imageSrc, title, caption, alt);
    pendingGalleryUnlock = null;
    injectGalleryNavButtons();
    if (document.getElementById('fullGalleryModal')?.classList.contains('is-open')) {
      renderFullGalleryGrid();
    }
    setupHeroGallery();
  }, 240);
}

function closeGalleryModal() {
  const modal = document.getElementById('galleryModal');
  const image = document.getElementById('galleryModalImage');
  if (!modal || !image) return;
  modal.classList.remove('is-open');
  image.src = '';
  image.alt = '';
  pendingGalleryUnlock = null;
  currentGalleryIndex = -1;
  const visual = document.getElementById('galleryModalVisual');
  const pageNumEl = document.getElementById('galleryModalPageNum');
  const modalBox = document.querySelector('.gallery-modal-box');
  if (visual) visual.querySelectorAll('.modal-img-nav').forEach(el => el.remove());
  if (pageNumEl) pageNumEl.hidden = true;
  if (modalBox) modalBox.classList.remove('is-dictionary-mode', 'is-dictionary-zoomed', 'is-focus-mode');
  hideDictionaryThumbs();
  resetGalleryZoom();
  setGalleryLockState(false);
  document.body.style.overflow = '';
}

// ============================================================
// フルギャラリー＆用語辞典の処理
// ============================================================
function openFullGalleryModal() {
  const modal = document.getElementById('fullGalleryModal');
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  renderFullGalleryGrid();
}

function closeFullGalleryModal() {
  const modal = document.getElementById('fullGalleryModal');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

function switchFullGalleryTab(targetId) {
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.gallery-tab[data-target="${targetId}"]`)?.classList.add('active');
  document.getElementById('galleryGridArt').style.display = targetId === 'galleryGridArt' ? 'grid' : 'none';
  document.getElementById('galleryGridDict').style.display = targetId === 'galleryGridDict' ? 'grid' : 'none';
}

function renderFullGalleryGrid() {
  if (typeof GALLERY_ITEMS === 'undefined') return;
  const artGrid = document.getElementById('galleryGridArt');
  const dictGrid = document.getElementById('galleryGridDict');
  if (!artGrid || !dictGrid) return;
  
  const arts = GALLERY_ITEMS.filter(item => item.type !== 'dict' && item.type !== 'dict_page');
  const dicts = GALLERY_ITEMS.filter(item => item.type === 'dict');
  
  artGrid.innerHTML = arts.map(item => {
    const globalIdx = GALLERY_ITEMS.indexOf(item);
    return `
      <div class="gallery-grid-item" onclick="openGalleryItemByIndex(${globalIdx})">
        <img src="${item.image}" alt="${item.alt}" loading="lazy">
      </div>
    `;
  }).join('');
  
  const dictItemsCount = GALLERY_ITEMS.filter(item => item.type === 'dict' || item.type === 'dict_page').length;

  dictGrid.innerHTML = dicts.map(item => {
    const globalIdx = GALLERY_ITEMS.indexOf(item);
    const locked = item.lockAnswer && !isGalleryUnlocked(item.image);
    const lockAttr = locked ? ` data-lock-answer="${item.lockAnswer}"` : '';
    return `
      <div class="gallery-grid-item"${lockAttr} onclick="openGalleryItemByIndex(${globalIdx})">
        <img class="${locked ? '' : 'is-document-thumb'}" src="${item.image}" alt="${item.alt}" loading="lazy">
        ${!locked && dictItemsCount > 1 ? `<div class="gallery-item-badge">全${dictItemsCount}枚</div>` : ''}
      </div>
    `;
  }).join('');
}

let currentGalleryIndex = -1;

function openGalleryItemByIndex(index, direction = '') {
  currentGalleryIndex = index;
  const item = GALLERY_ITEMS[index];
  if (!item) return;
  
  openGalleryModal(item.image, item.title, item.caption, item.alt, item.lockAnswer, item.lockHint);
  injectGalleryNavButtons();

  // アニメーション適用
  const img = document.getElementById('galleryModalImage');
  if (img && direction) {
    img.classList.remove('slide-left', 'slide-right');
    void img.offsetWidth; // リフロー
    img.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');
  }
}

function renderDictionaryThumbs(sameTypeItems, currentTypeIndex, isDict) {
  const thumbs = document.getElementById('galleryDictThumbs');
  if (!thumbs) return;
  if (!isDict || sameTypeItems.length <= 1) {
    hideDictionaryThumbs();
    return;
  }
  thumbs.hidden = false;
  thumbs.innerHTML = sameTypeItems.map((entry, index) => `
    <button class="gallery-dict-thumb ${index === currentTypeIndex ? 'is-active' : ''}" type="button" data-gallery-index="${entry.idx}" aria-label="用語辞典 ${index + 1}ページ目を開く">
      <img src="${entry.item.image}" alt="" loading="lazy">
      <span>${index + 1}</span>
    </button>
  `).join('');
  thumbs.querySelectorAll('.gallery-dict-thumb').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const nextIndex = Number(button.dataset.galleryIndex);
      if (Number.isFinite(nextIndex) && nextIndex !== currentGalleryIndex) {
        openGalleryItemByIndex(nextIndex, nextIndex > currentGalleryIndex ? 'next' : 'prev');
      }
    });
  });
}

function injectGalleryNavButtons() {
  const visual = document.getElementById('galleryModalVisual');
  const pageNumEl = document.getElementById('galleryModalPageNum');
  if (!visual) return;
  
  // Clean up old buttons and page num
  visual.querySelectorAll('.modal-img-nav').forEach(el => el.remove());
  if (pageNumEl) pageNumEl.hidden = true;
  
  // ページ切り替え時にズームを解除
  resetGalleryZoom();

  if (currentGalleryIndex < 0) return;
  
  const currentItem = GALLERY_ITEMS[currentGalleryIndex];
  // Only inject nav if it's unlocked or doesn't have a lock
  const locked = currentItem.lockAnswer && !isGalleryUnlocked(currentItem.image);
  if (locked) {
    hideDictionaryThumbs();
    return;
  }

  const isDict = isDictionaryGalleryItem(currentItem);
  const sameTypeItems = getSameGalleryTypeItems(currentItem);
  
  const currentTypeIndex = sameTypeItems.findIndex(x => x.idx === currentGalleryIndex);
  renderDictionaryThumbs(sameTypeItems, currentTypeIndex, isDict);

  // Update page number
  if (pageNumEl && sameTypeItems.length > 1) {
    pageNumEl.textContent = isDict ? `用語辞典 ${currentTypeIndex + 1} / ${sameTypeItems.length}` : `${currentTypeIndex + 1} / ${sameTypeItems.length}`;
    pageNumEl.hidden = false;
  }
  
  // 新しいコントロールパネルの制御
  const btnPrev = document.getElementById('galleryBtnPrev');
  const btnNext = document.getElementById('galleryBtnNext');
  const btnZoomIn = document.getElementById('galleryBtnZoomIn');
  const btnZoomOut = document.getElementById('galleryBtnZoomOut');
  const btnClose = document.getElementById('galleryBtnCloseView');

  if (btnPrev) btnPrev.textContent = isDict ? '前へ' : '◀︎';
  if (btnNext) btnNext.textContent = isDict ? '次へ' : '▶︎';
  if (btnZoomIn) btnZoomIn.textContent = isDict ? '拡大' : '＋';
  if (btnZoomOut) btnZoomOut.textContent = isDict ? '戻す' : '－';
  if (btnClose) btnClose.textContent = isDict ? '閉じる' : '✕';

  if (btnPrev) {
    const canGoPrev = currentTypeIndex > 0;
    btnPrev.disabled = !canGoPrev;
    btnPrev.setAttribute('aria-disabled', canGoPrev ? 'false' : 'true');
    btnPrev.style.opacity = canGoPrev ? '1' : '0.3';
    btnPrev.style.pointerEvents = canGoPrev ? 'auto' : 'none';
    btnPrev.onclick = (e) => {
      e.stopPropagation();
      if (canGoPrev) openGalleryItemByIndex(sameTypeItems[currentTypeIndex - 1].idx, 'prev');
    };
  }
  if (btnNext) {
    const canGoNext = currentTypeIndex < sameTypeItems.length - 1;
    btnNext.disabled = !canGoNext;
    btnNext.setAttribute('aria-disabled', canGoNext ? 'false' : 'true');
    btnNext.style.opacity = canGoNext ? '1' : '0.3';
    btnNext.style.pointerEvents = canGoNext ? 'auto' : 'none';
    btnNext.onclick = (e) => {
      e.stopPropagation();
      if (canGoNext) openGalleryItemByIndex(sameTypeItems[currentTypeIndex + 1].idx, 'next');
    };
  }

  if (btnZoomIn) btnZoomIn.onclick = (e) => { e.stopPropagation(); setGalleryZoom(true); };
  if (btnZoomOut) btnZoomOut.onclick = (e) => { e.stopPropagation(); resetGalleryZoom(); };
  if (btnClose) btnClose.onclick = (e) => { e.stopPropagation(); closeGalleryModal(); };

  if (isDict) return;
  
  if (currentTypeIndex > 0) {
    const prevIdx = sameTypeItems[currentTypeIndex - 1].idx;
    const btn = document.createElement('button');
    btn.className = 'modal-img-nav prev';
    btn.innerHTML = '◀︎';
    btn.type = 'button';
    btn.setAttribute('aria-label', '前の作品へ');
    btn.onclick = (e) => { e.stopPropagation(); openGalleryItemByIndex(prevIdx, 'prev'); };
    visual.appendChild(btn);
  }
  
  if (currentTypeIndex < sameTypeItems.length - 1) {
    const nextIdx = sameTypeItems[currentTypeIndex + 1].idx;
    const btn = document.createElement('button');
    btn.className = 'modal-img-nav next';
    btn.innerHTML = '▶︎';
    btn.type = 'button';
    btn.setAttribute('aria-label', '次の作品へ');
    btn.onclick = (e) => { e.stopPropagation(); openGalleryItemByIndex(nextIdx, 'next'); };
    visual.appendChild(btn);
  }
}

function moveGalleryFromCurrent(direction) {
  const currentItem = getCurrentGalleryItem();
  if (!currentItem || (currentItem.lockAnswer && !isGalleryUnlocked(currentItem.image))) return false;
  const sameTypeItems = getSameGalleryTypeItems(currentItem);
  const currentTypeIndex = sameTypeItems.findIndex(x => x.idx === currentGalleryIndex);
  const nextTypeIndex = direction === 'next' ? currentTypeIndex + 1 : currentTypeIndex - 1;
  if (nextTypeIndex < 0 || nextTypeIndex >= sameTypeItems.length) return false;
  openGalleryItemByIndex(sameTypeItems[nextTypeIndex].idx, direction);
  return true;
}

// スワイプ操作の検知
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('DOMContentLoaded', () => {
  const visual = document.getElementById('galleryModalVisual');
  if (visual) {
    visual.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    visual.addEventListener('touchend', (e) => {
      if (document.getElementById('galleryModalImage')?.classList.contains('is-zoomed')) return;
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > 54 && Math.abs(diffX) > Math.abs(diffY) * 1.35) {
        const moved = diffX < 0
          // 次へ（左スワイプ）
          ? moveGalleryFromCurrent('next')
          // 前へ（右スワイプ）
          : moveGalleryFromCurrent('prev');
        if (!moved) showGalleryHint(diffX < 0 ? '最後の作品です' : '最初の作品です');
      }
    }, { passive: true });
  }
});

function isTypingTarget(el) {
  if (!el) return false;
  const tag = String(el.tagName || '').toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
}

function handleGalleryKeyboard(e) {
  const modal = document.getElementById('galleryModal');
  if (!modal?.classList.contains('is-open') || isTypingTarget(e.target)) return false;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (!moveGalleryFromCurrent('next')) showGalleryHint('最後の作品です');
    return true;
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (!moveGalleryFromCurrent('prev')) showGalleryHint('最初の作品です');
    return true;
  }
  if (e.key === '+' || e.key === '=') {
    e.preventDefault();
    setGalleryZoom(true);
    return true;
  }
  if (e.key === '-' || e.key === '_' || e.key === '0') {
    e.preventDefault();
    resetGalleryZoom();
    return true;
  }
  return false;
}

// ============================================================
// 10. その他のUI / モーダル処理
// ============================================================
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
function openModal(preselect = '', id = null, clientId = null) {
  editingId = id;
  editingClientId = clientId;
  
  const modal = document.getElementById('postModal');
  const title = modal.querySelector('.modal-title') || modal.querySelector('h2');
  const btn = document.getElementById('submitBtn');
  
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  resetForm();
  populateModalSpotSelect(preselect);
  
  if (editingClientId) {
    if (title) title.textContent = '🗺️ 感想を編集する';
    if (btn) btn.textContent = '更新する 🚀';
    
    // 既存データを検索して埋める
    const post = allPosts.find(p => (p.clientId || p.id) === editingClientId);
    if (post) {
      const spotEl = document.getElementById('fSpot');
      // 既存の選択肢にないスポット（自由入力されたもの）の場合も考慮
      if (!Array.from(spotEl.options).some(opt => opt.value === post.spotName)) {
        const opt = document.createElement('option');
        opt.value = post.spotName;
        opt.textContent = post.spotName;
        spotEl.appendChild(opt);
      }
      spotEl.value = post.spotName;
      document.getElementById('fNick').value = post.nickname || '';
      document.getElementById('fDate').value = post.visitDate || '';
      document.getElementById('fComment').value = post.comment || '';
      selectedRating = post.rating || 0;
      updateStars();
    }
  } else {
    if (title) title.textContent = '🗺️ 行った場所を共有';
    if (btn) btn.textContent = '投稿する 🚀';
    fillSavedNickname('fNick');
  }
}

function updateStars() {
  document.querySelectorAll('.star-btn').forEach((b, i) => {
    b.classList.toggle('active', i < selectedRating);
  });
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
    nickname: document.getElementById('asNick').value.trim()
  };
  
  if (resources && resources.length > 0) {
    data.url = resources[0]?.url || '';
    data.urls = resources.map(r => r.url);
    data.resources = resources;
  } else if (!editingClientId) {
    data.url = '';
    data.urls = [];
    data.resources = [];
  }
  try {
    if (editingClientId) {
      await updateSuggestionRecord(editingId, editingClientId, data);
      showToast('スポット情報を更新しました！');
    } else {
      await saveSpotSuggestion(data);
      showToast('スポットを提案しました！誰かの次の休日のヒントになります。');
      clearAddSpotFormDraft();
    }
    saveNickname(data.nickname);
    closeAddSpotModal();
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    renderWeeklyDiscovery();
  } catch(err) {
    console.error('Submit failed:', err);
    alert('エラーが発生しました。時間を置いて再度お試しください。');
  } finally {
    btn.disabled = false;
    btn.textContent = editingClientId ? '更新する 🚀' : '提案を送る 🚀';
    editingId = null;
    editingClientId = null;
  }
});

async function updateSuggestionRecord(id, clientId, data) {
  // Local 更新
  localSuggestions = localSuggestions.map(s => (s.clientId || s.id) === clientId ? { ...s, ...data, timestamp: Date.now() } : s);
  localStorage.setItem('popopo_suggestions', JSON.stringify(localSuggestions));
  
  // Remote 更新
  if (db && id) {
    await db.collection('suggestions').doc(id).update({
      ...data,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

// チャットフォーム送信
document.getElementById('chatForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nickname = document.getElementById('cNick').value.trim() || '匿名リスナー';
  const message = document.getElementById('cMsg').value.trim();

  if (!message) { alert('メッセージを入力してください'); return; }

  const btn = document.getElementById('chatSubmitBtn');
  btn.disabled = true; btn.textContent = '送信中...';

  try {
    if (editingClientId) {
      await updateChatRecord(editingId, editingClientId, { nickname, message });
      showToast('つぶやきを更新しました！');
    } else {
      const isReply = Boolean(replyingTo);
      await saveChat({ nickname, message });
      showToast(isReply ? '返信しました！会話がつながりました。' : '投稿しました！あなたの一言が、会話のきっかけになります。');
    }
    saveNickname(nickname);
    updateChatsView();
    closeChatModal();
    document.getElementById('chatForm').reset();
  } catch(err) {
    console.error('Submit failed:', err);
    alert('エラーが発生しました。時間を置いて再度お試しください。');
  } finally {
    btn.disabled = false;
    btn.textContent = editingClientId ? '更新する 🚀' : '投稿する 🚀';
    editingId = null;
    editingClientId = null;
  }
});

async function updateChatRecord(id, clientId, data) {
  // Local 更新
  localChats = localChats.map(c => (c.clientId || c.id) === clientId ? { ...c, ...data, timestamp: Date.now() } : c);
  localStorage.setItem('popopo_chats', JSON.stringify(localChats));
  
  // Remote 更新
  if (db && id) {
    await db.collection('chats').doc(id).update({
      ...data,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

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
    comment
  };

  if (media && media.length > 0) {
    postData.media = media;
    postData.photoUrl = media.find(item => item.kind === 'photo')?.url || media[0]?.url || '';
  } else if (!editingClientId) {
    postData.media = [];
    postData.photoUrl = '';
  }

  try {
    if (editingClientId) {
      await updatePostRecord(editingId, editingClientId, postData);
      showToast('感想を更新しました！');
    } else {
      await savePost(postData);
      showToast('感想を投稿しました！あなたの体験が、誰かの背中を押します。');
    }
    saveNickname(nickname);
    allPosts = mergePosts(latestRemotePosts);
    renderVisited(allPosts);
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    renderWeeklyDiscovery();
    closeModal();
  } catch (err) {
    console.error('Submit failed:', err);
    alert('エラーが発生しました。時間を置いて再度お試しください。');
  } finally {
    btn.disabled = false;
    btn.textContent = editingClientId ? '更新する 🚀' : '投稿する 🚀';
    editingId = null;
    editingClientId = null;
  }
});

async function updatePostRecord(id, clientId, data) {
  // Local 更新
  localPosts = localPosts.map(p => (p.clientId || p.id) === clientId ? { ...p, ...data, timestamp: Date.now() } : p);
  localStorage.setItem('popopo_posts', JSON.stringify(localPosts));
  
  // Remote 更新
  if (db && id) {
    await db.collection('posts').doc(id).update({
      ...data,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

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
    animation:fadeUp 0.3s ease;font-size:0.92rem;max-width:min(92vw,560px);
    text-align:center;line-height:1.6;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ============================================================
// 9. イベントバインド
// ============================================================
function bindEvents() {
  // Bottom Nav のアクティブ状態管理（スクロール連動）
  const updateBottomNavActive = () => {
    const sections = ['spots', 'visited', 'community'];
    const scrollY = window.scrollY + window.innerHeight / 2;
    let activeSection = 'spots'; // デフォルトはスポット（ページ最上部 = スポットへ誘導）
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) activeSection = id;
    }
    document.querySelectorAll('.bottom-nav-item[data-section]').forEach(item => {
      item.classList.toggle('is-active', item.dataset.section === activeSection);
    });
  };

  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) scrollHint.classList.toggle('is-hidden', window.scrollY > 120);
    updateBottomNavActive();
  }, { passive: true });
  updateBottomNavActive(); // 初期表示でスポットをアクティブに
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
  if (openChatBtn) openChatBtn.addEventListener('click', () => openChatModal());
  
  const fabChatBtn = document.getElementById('fabChatBtn');
  if (fabChatBtn) fabChatBtn.addEventListener('click', () => openChatModal());

  const bottomNavPost = document.getElementById('bottomNavPost');
  if (bottomNavPost) bottomNavPost.addEventListener('click', () => openChatModal());
  const dailyPromptBtn = document.getElementById('dailyPromptBtn');
  if (dailyPromptBtn) dailyPromptBtn.addEventListener('click', () => {
    openChatModal(`今日のお題：${getDailyPrompt()}\n`);
  });
  const wantListPostBtn = document.getElementById('wantListPostBtn');
  if (wantListPostBtn) wantListPostBtn.addEventListener('click', () => openModal());
  const weeklyDiscoveryLink = document.getElementById('weeklyDiscoveryLink');
  if (weeklyDiscoveryLink) weeklyDiscoveryLink.addEventListener('click', (e) => {
    e.preventDefault();
    pauseDiscoveryRotation();
    openDiscoveryItem({
      kind: weeklyDiscoveryLink.dataset.discoveryKind,
      id: weeklyDiscoveryLink.dataset.discoveryId || '',
      cat: weeklyDiscoveryLink.dataset.discoveryCategory || '',
      spotName: weeklyDiscoveryLink.dataset.discoverySpot || '',
      title: document.getElementById('weeklyDiscoveryTitle')?.textContent || ''
    });
  });
  if (weeklyDiscoveryLink) {
    ['mouseenter', 'focusin', 'touchstart'].forEach(eventName => {
      weeklyDiscoveryLink.addEventListener(eventName, () => pauseDiscoveryRotation(), { passive: true });
    });
  }
  const navGachaOpenBtn = document.getElementById('navGachaOpenBtn');
  if (navGachaOpenBtn) navGachaOpenBtn.addEventListener('click', () => openGachaModal());
  const heroGachaBtn = document.getElementById('heroGachaBtn');
  if (heroGachaBtn) heroGachaBtn.addEventListener('click', () => openGachaModal());
  const gachaModalClose = document.getElementById('gachaModalClose');
  if (gachaModalClose) gachaModalClose.addEventListener('click', closeGachaModal);
  const gachaModal = document.getElementById('gachaModal');
  if (gachaModal) {
    gachaModal.addEventListener('click', e => {
      if (e.target === gachaModal) closeGachaModal();
    });
  }
  const gachaSpinBtn = document.getElementById('gachaSpinBtn');
  if (gachaSpinBtn) gachaSpinBtn.addEventListener('click', runGachaSpin);
  const gachaAgainBtn = document.getElementById('gachaAgainBtn');
  if (gachaAgainBtn) gachaAgainBtn.addEventListener('click', () => {
    resetGachaModalUi();
  });
  const gachaResultGrid = document.getElementById('gachaResultGrid');
  if (gachaResultGrid) gachaResultGrid.addEventListener('click', onGachaResultClick);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const gm = document.getElementById('gachaModal');
    if (!gm || !gm.classList.contains('is-open')) return;
    e.preventDefault();
    closeGachaModal();
  });

  const chatClose = document.getElementById('chatModalClose');
  if (chatClose) chatClose.addEventListener('click', closeChatModal);
  const chatCancel = document.getElementById('chatCancelBtn');
  if (chatCancel) chatCancel.addEventListener('click', closeChatModal);
  const chatModal = document.getElementById('chatModal');
  if (chatModal) chatModal.addEventListener('click', (e) => {
    if (e.target === chatModal) closeChatModal();
  });
  const listenerGallery = document.getElementById('heroGalleryMarquee');
  if (listenerGallery) listenerGallery.addEventListener('click', (e) => {
    if (heroGallerySuppressClick) {
      e.preventDefault();
      return;
    }
    const card = e.target.closest('.hero-gallery-item');
    if (!card) return;
    openGalleryItem(card);
  });
  const galleryModalClose = document.getElementById('galleryModalClose');
  if (galleryModalClose) galleryModalClose.addEventListener('click', closeGalleryModal);
  const galleryLockSubmit = document.getElementById('galleryLockSubmit');
  if (galleryLockSubmit) galleryLockSubmit.addEventListener('click', submitGalleryUnlock);
  const galleryLockInput = document.getElementById('galleryLockInput');
  if (galleryLockInput) galleryLockInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitGalleryUnlock();
  });
  const galleryModal = document.getElementById('galleryModal');
  if (galleryModal) galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) closeGalleryModal();
  });
  const fullGalleryClose = document.getElementById('fullGalleryClose');
  if (fullGalleryClose) fullGalleryClose.addEventListener('click', closeFullGalleryModal);
  const fullGalleryModal = document.getElementById('fullGalleryModal');
  if (fullGalleryModal) fullGalleryModal.addEventListener('click', (e) => {
    if (e.target === fullGalleryModal) closeFullGalleryModal();
  });
  document.querySelectorAll('.gallery-tab').forEach(t => {
    t.addEventListener('click', () => switchFullGalleryTab(t.dataset.target));
  });
  const viewAllGalleryBtn = document.getElementById('viewAllGalleryBtn');
  if (viewAllGalleryBtn) viewAllGalleryBtn.addEventListener('click', openFullGalleryModal);
  const kiribanModal = document.getElementById('kiribanModal');
  if (kiribanModal) kiribanModal.addEventListener('click', (e) => {
    if (e.target === kiribanModal) closeKiribanModal();
  });
  ['kiribanClose', 'kiribanDismissBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeKiribanModal);
  });
  const kiribanShare = document.getElementById('kiribanShareBtn');
  if (kiribanShare) kiribanShare.addEventListener('click', shareKiriban);
  const introStoryModal = document.getElementById('introStoryModal');
  if (introStoryModal) introStoryModal.addEventListener('click', (e) => {
    if (e.target === introStoryModal) closeIntroStoryModal();
  });
  ['introStoryClose', 'introStorySkipBtn', 'introStoryEnterBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeIntroStoryModal);
  });
  const introStoryReadBtn = document.getElementById('introStoryReadBtn');
  if (introStoryReadBtn) introStoryReadBtn.addEventListener('click', markIntroStorySeen);
  document.querySelectorAll('[data-intro-story-dot]').forEach(dot => {
    dot.addEventListener('click', () => {
      setIntroStorySlide(Number(dot.dataset.introStoryDot) || 0);
      startIntroStoryFlow();
    });
  });
  const introStoryNextBtn = document.getElementById('introStoryNextBtn');
  if (introStoryNextBtn) introStoryNextBtn.addEventListener('click', () => {
    setIntroStorySlide(introStoryIndex + 1);
    startIntroStoryFlow();
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
  document.addEventListener('click', (e) => {
    const seenBtn = e.target.closest('.review-seen-btn');
    if (!seenBtn) return;
    saveSeenReview(seenBtn.dataset.reviewSeenId);
  });
  document.addEventListener('click', (e) => {
    const reactionBtn = e.target.closest('.chat-reaction-btn');
    if (!reactionBtn) return;
    saveChatReaction(reactionBtn.dataset.chatReactionId);
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
  const addSpotFormEl = document.getElementById('addSpotForm');
  if (addSpotFormEl) {
    addSpotFormEl.addEventListener('input', scheduleSaveAddSpotFormDraft);
    addSpotFormEl.addEventListener('change', scheduleSaveAddSpotFormDraft);
  }
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
    if (handleGalleryKeyboard(e)) return;
    if (e.key === 'Escape') { closeModal(); closeAddSpotModal(); closeChatModal(); closeSpotReviews(); closeGalleryModal(); closeKiribanModal(); closeIntroStoryModal(); }
  });
  document.getElementById('tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    visibleSpotCount = INITIAL_SPOT_COUNT;
    renderSpotCards(tab.dataset.cat);
  });
  const wantListToggleBtn = document.getElementById('wantListToggleBtn');
  if (wantListToggleBtn) {
    wantListToggleBtn.addEventListener('click', () => {
      showingWantList = !showingWantList;
      visibleSpotCount = INITIAL_SPOT_COUNT;
      renderSpotCards(getActiveSpotCategory());
    });
  }
  document.getElementById('spotsMoreBtn').addEventListener('click', (e) => {
    visibleSpotCount = e.currentTarget.dataset.mode === 'collapse'
      ? INITIAL_SPOT_COUNT
      : visibleSpotCount + INITIAL_SPOT_COUNT;
    renderSpotCards(getActiveSpotCategory());
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

// 選択可能な全国主要都市一覧
const ALL_WEATHER_CITIES = [
  { id: '016000', name: '札幌' },
  { id: '020000', name: '青森' },
  { id: '040000', name: '仙台' },
  { id: '050000', name: '秋田' },
  { id: '060000', name: '山形' },
  { id: '070000', name: '福島' },
  { id: '080000', name: '水戸' },
  { id: '090000', name: '宇都宮' },
  { id: '100000', name: '前橋' },
  { id: '110000', name: 'さいたま' },
  { id: '120000', name: '千葉' },
  { id: '130000', name: '東京' },
  { id: '140000', name: '横浜' },
  { id: '150000', name: '新潟' },
  { id: '160000', name: '富山' },
  { id: '170000', name: '金沢' },
  { id: '180000', name: '福井' },
  { id: '190000', name: '甲府' },
  { id: '200000', name: '長野' },
  { id: '210000', name: '岐阜' },
  { id: '220000', name: '静岡' },
  { id: '230000', name: '名古屋' },
  { id: '240000', name: '津' },
  { id: '250000', name: '大津' },
  { id: '260000', name: '京都' },
  { id: '270000', name: '大阪' },
  { id: '280000', name: '神戸' },
  { id: '290000', name: '奈良' },
  { id: '300000', name: '和歌山' },
  { id: '310000', name: '鳥取' },
  { id: '320000', name: '松江' },
  { id: '330000', name: '岡山' },
  { id: '340000', name: '広島' },
  { id: '350000', name: '山口' },
  { id: '360000', name: '徳島' },
  { id: '370000', name: '高松' },
  { id: '380000', name: '松山' },
  { id: '390000', name: '高知' },
  { id: '400000', name: '福岡' },
  { id: '410000', name: '佐賀' },
  { id: '420000', name: '長崎' },
  { id: '430000', name: '熊本' },
  { id: '440000', name: '大分' },
  { id: '450000', name: '宮崎' },
  { id: '460100', name: '鹿児島' },
  { id: '471000', name: '那覇' }
];

const WEATHER_CITY_STORAGE_KEY = 'popopo_weather_cities';
const DEFAULT_WEATHER_CITY_IDS = ['016000', '130000', '230000', '270000', '400000'];

function getSelectedWeatherCities() {
  try {
    const saved = localStorage.getItem(WEATHER_CITY_STORAGE_KEY);
    if (saved) {
      const ids = JSON.parse(saved);
      if (Array.isArray(ids) && ids.length > 0) {
        return ALL_WEATHER_CITIES.filter(c => ids.includes(c.id));
      }
    }
  } catch(e) {}
  return ALL_WEATHER_CITIES.filter(c => DEFAULT_WEATHER_CITY_IDS.includes(c.id));
}

function getWeatherIcon(code) {
  const c = parseInt(code, 10);
  if (c >= 100 && c < 200) return '☀️';
  if (c >= 200 && c < 300) return '☁️';
  if (c >= 300 && c < 400) return '☔';
  if (c >= 400) return '⛄';
  return '☁️';
}

async function fetchCityWeather(city) {
  const res = await fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${city.id}.json`);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();

  const weatherCode = data[0].timeSeries[0].areas[0].weatherCodes[0];
  const icon = getWeatherIcon(weatherCode);

  let maxTemp = '';
  try {
    const tempsMax = data[1].timeSeries[1].areas[0].tempsMax;
    const validTemp = tempsMax.find(t => t !== '');
    if (validTemp) maxTemp = validTemp;
  } catch(e) {}

  let pop = '';
  try {
    const pops = data[0].timeSeries[1].areas[0].pops;
    const validPop = pops.find(p => p !== '');
    if (validPop) pop = validPop;
  } catch(e) {}

  return `
    <div class="weather-item">
      <span class="w-name">📍${city.name}</span>
      <span class="w-icon">${icon}</span>
      ${maxTemp ? `<span class="w-temp">${maxTemp}℃</span>` : ''}
      ${pop ? `<span class="w-pop">☂️${pop}%</span>` : ''}
    </div>
  `;
}

// RAF マーキー管理
let _weatherRaf = null;

function startWeatherMarquee() {
  const el = document.getElementById('weatherItems');
  if (!el) return;

  // 既存のアニメーションを停止
  if (_weatherRaf) {
    cancelAnimationFrame(_weatherRaf);
    _weatherRaf = null;
  }

  // コンテンツが3セット複製されている前提で1セット分の幅を計算
  let oneSetWidth = 0;
  let x = 0;
  let lastTime = null;
  let paused = false;

  // スピード: px/秒（スマホは速め）
  const speed = window.matchMedia('(max-width: 768px)').matches ? 90 : 55;

  const tick = (now) => {
    if (!lastTime) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05); // 最大50msで上限（タブ非表示復帰対策）
    lastTime = now;

    // 幅が未計算 or リサイズ後の再計算
    if (!oneSetWidth && el.scrollWidth > 0) {
      oneSetWidth = el.scrollWidth / 3;
    }

    if (!paused && oneSetWidth > 0) {
      x -= speed * dt;
      // 1セット分ずれたらリセット（シームレスループ）
      if (x <= -oneSetWidth) x += oneSetWidth;
      const val = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      el.style.transform = val;
      el.style.webkitTransform = val;
    }

    _weatherRaf = requestAnimationFrame(tick);
  };

  // タッチ（スマホ）・マウス（PC）でホバー一時停止
  el.addEventListener('mouseenter', () => { paused = true; });
  el.addEventListener('mouseleave', () => { paused = false; });
  el.addEventListener('touchstart', () => { paused = true; }, { passive: true });
  el.addEventListener('touchend',   () => { setTimeout(() => { paused = false; }, 800); }, { passive: true });

  _weatherRaf = requestAnimationFrame(tick);
}

async function renderWeather() {
  const container = document.getElementById('weatherItems');
  if (!container) return;

  const cities = getSelectedWeatherCities();

  const cacheKey = `popopo_weather_cache_${cities.map(c => c.id).join('_')}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    container.innerHTML = cached + cached + cached;
    // 少し待ってからアニメ開始（DOM描画完了を待つ）
    setTimeout(startWeatherMarquee, 100);
    return;
  }

  container.innerHTML = '<span style="color:var(--text-muted); font-size:0.85rem;">天気を取得中...</span>';

  try {
    const results = await Promise.all(cities.map(fetchCityWeather));
    const html = results.join('');
    container.innerHTML = html + html + html;
    sessionStorage.setItem(cacheKey, html);
    // DOM描画後にアニメ開始
    setTimeout(startWeatherMarquee, 100);
  } catch (error) {
    console.error('Weather fetch failed:', error);
    container.innerHTML = '<span style="color:var(--text-muted); font-size:0.85rem;">一時的に取得できません</span>';
  }
}

// 都市選択モーダルの初期化
function initWeatherCityPicker() {
  const modal = document.getElementById('weatherCityModal');
  const grid = document.getElementById('weatherCityGrid');
  const settingsBtn = document.getElementById('weatherSettingsBtn');
  const closeBtn = document.getElementById('weatherCityClose');
  const cancelBtn = document.getElementById('weatherCityCancelBtn');
  const saveBtn = document.getElementById('weatherCitySaveBtn');
  if (!modal || !grid) return;

  const openModal = () => {
    const savedIds = getSelectedWeatherCities().map(c => c.id);
    grid.innerHTML = ALL_WEATHER_CITIES.map(city => `
      <button type="button"
        class="weather-city-chip ${savedIds.includes(city.id) ? 'is-selected' : ''}"
        data-city-id="${city.id}">
        <span class="chip-check">✓</span>${city.name}
      </button>
    `).join('');

    grid.querySelectorAll('.weather-city-chip').forEach(chip => {
      chip.addEventListener('click', () => chip.classList.toggle('is-selected'));
    });

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  settingsBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  saveBtn?.addEventListener('click', () => {
    const selected = Array.from(grid.querySelectorAll('.weather-city-chip.is-selected'))
      .map(c => c.dataset.cityId);
    if (selected.length === 0) {
      showToast('1つ以上の都市を選択してください');
      return;
    }
    localStorage.setItem(WEATHER_CITY_STORAGE_KEY, JSON.stringify(selected));
    sessionStorage.clear(); // 天気キャッシュをリセット
    closeModal();
    renderWeather(); // 再取得して表示更新
    showToast('都市の設定を保存しました ✓');
  });
}

// ============================================================
// 11. 初期化
// ============================================================
function init() {
  initFirebase();
  
  // スポット追加をリッスン
  listenSuggestions(suggestions => {
    localSuggestions = suggestions;
    localStorage.setItem('popopo_suggestions', JSON.stringify(localSuggestions));
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    renderWeeklyDiscovery();
  });

  // 投稿をリッスン
  listenPosts(posts => {
    allPosts = posts;
    renderVisited(posts); // リスナーの投稿は「みんなの感想」セクションに追加
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    renderWeeklyDiscovery();
  });

  // フリートークをリッスン
  listenChats(chats => {
    updateChatsView(chats);
  });

  listenLikes(); // いいね数をリアルタイム同期

  trackPageView();
  renderDailyPrompt();
  renderWeeklyDiscovery();
  startDiscoveryRotation();
  renderWeather();
  setupHeroGallery();
  renderHeroBackdrop();
  startHeroBackdropRotation();

  bindEvents();
  initWeatherCityPicker();
  maybeShowIntroStory();
}

document.addEventListener('DOMContentLoaded', init);
