const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const baseUrl = 'https://popopo-comm.netlify.app';
const lastmod = '2026-05-18';

const spots = [
  {
    id: 'comme-chinois',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🥐',
    name: 'Comme Chinois（コム・シノワ）',
    area: '神戸・三宮',
    pref: '兵庫',
    url: 'https://www.comme-chinois.com/',
    memo: 'あらゆるジャンルのパンが揃う神戸の人気店。モーニングのクロワッサンは感動の美味しさです。',
    point: '神戸・三宮でパン屋やモーニングを探している人に届きやすいスポットです。'
  },
  {
    id: 'yugi',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🥟',
    name: '友誼商店',
    area: '池袋',
    pref: '東京',
    url: 'https://tabelog.com/tokyo/A1305/A130501/13235881/',
    memo: '小籠包、涼皮、朝のお粥、油条などがおすすめ。池袋で中国系の食事を楽しみたい時の候補です。',
    point: '池袋・小籠包・涼皮・朝ごはんなど、検索されやすい具体語が多いスポットです。'
  },
  {
    id: 'kameju',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍡',
    name: '亀十',
    area: '浅草',
    pref: '東京',
    url: 'https://tabelog.com/tokyo/A1311/A131102/13003655/',
    memo: '浅草の老舗和菓子店。どら焼きや和菓子好きの寄り道候補として、匿名リスナーさんから届いたおすすめです。',
    point: '浅草・どら焼き・和菓子の文脈で検索に乗りやすいスポットです。'
  },
  {
    id: 'kamado-gohan-matsushima',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍚',
    name: '竈門ご飯 松しま',
    area: '人形町',
    pref: '東京',
    url: 'https://tabelog.com/tokyo/A1302/A130204/13319779/',
    memo: '浅草から都営浅草線で乗り換えなし。開店したばかりで、ランチがお得で美味しいとのリスナー推薦です。',
    point: '浅草から行きやすいランチ候補として、地域検索との相性が良いスポットです。'
  },
  {
    id: 'yamaya-ikebukuro',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍲',
    name: '博多もつ鍋 やまや 池袋店',
    area: '池袋・東池袋',
    pref: '東京',
    url: 'https://tabelog.com/tokyo/A1305/A130501/13164146/dtlrvwlst/',
    memo: '明太子やもつ鍋、ランチ定食の候補。池袋方面のお出かけメモとして届いたリスナーおすすめです。',
    point: '池袋ランチ、明太子、もつ鍋など、検索意図がはっきりした語を含みます。'
  },
  {
    id: 'kura-global-flagship',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍣',
    name: 'くら寿司 グローバル旗艦店',
    area: '銀座・原宿・浅草ROX・押上など',
    pref: '東京',
    url: 'https://www.kurasushi.co.jp/global_flagship/',
    memo: 'いつもの回転寿司に、少しエンタメ感を足したい時の候補。都内に複数のグローバル旗艦店があります。',
    point: '観光・家族連れ・都内の回転寿司候補として使いやすい情報です。'
  },
  {
    id: 'saryo-tsujiri-daimaru',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍵',
    name: '茶寮都路里 大丸東京店',
    area: '東京駅・大丸東京店',
    pref: '東京',
    url: 'https://www.giontsujiri.co.jp/store/tokyo-daimaru/',
    memo: '東京駅直結で立ち寄りやすい、抹茶や甘味の休憩スポットです。',
    point: '東京駅、抹茶、甘味、休憩という検索需要に合います。'
  },
  {
    id: 'leonards-japan',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍩',
    name: "Leonard's Japan",
    area: '横浜ワールドポーターズ',
    pref: '神奈川',
    url: 'https://leonardsjapan.com/about-2/',
    memo: 'ハワイのマラサダを横浜で。外はサクッと、中はもちもちの甘い寄り道候補です。',
    point: '横浜・マラサダ・ハワイ系スイーツの組み合わせで具体性があります。'
  },
  {
    id: 'shinpachi-shokudo',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🐟',
    name: '炭火焼干物定食 しんぱち食堂',
    area: '東京ほか',
    pref: '全国',
    url: 'https://www.shinpachi-shokudo.com/',
    memo: '焼き魚とごはん、味噌汁の定食を気軽に食べたい時に。朝・昼・夜の候補にしやすいお店です。',
    point: '一人ごはん、定食、朝食など幅広い検索意図に合います。'
  },
  {
    id: 'mohinga',
    cat: 'mohinga',
    catLabel: '食べたいもの',
    emoji: '🍜',
    name: 'モヒンガー（ミャンマー料理）',
    area: '高田馬場など',
    pref: '東京',
    url: 'https://otonano-shumatsu.com/articles/488762',
    memo: 'ミャンマーの国民食。高田馬場周辺などで、いつもと違う麺料理を食べたい時の候補です。',
    point: 'ミャンマー料理、モヒンガー、高田馬場というニッチな検索に向いています。'
  },
  {
    id: '400do-pizza',
    cat: 'mohinga',
    catLabel: '食べたいもの',
    emoji: '🍕',
    name: '400℃ Pizza',
    area: '広島・岡山',
    pref: '広島',
    url: 'https://400do-pizza.com/',
    memo: 'YouTube「よにのちゃんねる」で紹介された超人気ピザ店。広島にもオープンした話題のスポットです。',
    point: '広島・岡山のピザ店、話題店として検索されやすい固有名詞があります。'
  },
  {
    id: 'yamatane',
    cat: 'museum',
    catLabel: '美術館・博物館',
    emoji: '🎨',
    name: '山種美術館',
    area: '渋谷・広尾',
    pref: '東京',
    url: 'https://www.yamatane-museum.jp/',
    memo: '日本画専門の美術館。渋谷・広尾方面で、落ち着いて作品を見たい時の候補です。',
    point: '美術館名と地域名が明確で、文化系のお出かけ検索に向いています。'
  },
  {
    id: 'nmwa',
    cat: 'museum',
    catLabel: '美術館・博物館',
    emoji: '🏛️',
    name: '国立西洋美術館',
    area: '上野',
    pref: '東京',
    url: 'https://www.nmwa.go.jp/jp/',
    memo: 'ル・コルビュジエ設計の世界遺産建築。上野で美術館めぐりをする時の定番候補です。',
    point: '上野、美術館、世界遺産建築という検索文脈に合います。'
  },
  {
    id: 'hokusai',
    cat: 'museum',
    catLabel: '美術館・博物館',
    emoji: '🌊',
    name: 'すみだ北斎美術館',
    area: '墨田区',
    pref: '東京',
    url: 'https://hokusai-museum.jp/',
    memo: '葛飾北斎の作品を多数展示する美術館。墨田区方面のお出かけ候補です。',
    point: '北斎、美術館、墨田区という固有名詞の組み合わせが強いページです。'
  },
  {
    id: 'kagurazaka-machibutai-2026',
    cat: 'event',
    catLabel: 'イベント',
    emoji: '🎭',
    name: '神楽坂まち舞台・大江戸めぐり2026',
    area: '神楽坂エリア',
    pref: '東京',
    url: 'https://kaguramachi.jp/',
    memo: '2026年5月16日、17日開催予定。神楽坂の街全体で伝統芸能を楽しめるフェスティバルです。',
    point: 'イベント名、開催日、神楽坂の地域性があり、期間検索にも向いています。'
  },
  {
    id: 'koishikawa-korakuen',
    cat: 'nature',
    catLabel: '自然・よりみち',
    emoji: '🌿',
    name: '小石川後楽園',
    area: '文京区後楽',
    pref: '東京',
    url: 'https://www.tokyo-park.or.jp/park/koishikawakorakuen/index.html',
    memo: '都内でアクセスしやすいのに、落ち着いて過ごせる庭園。リスナーさん曰く「人少なくてチル」。東京ドーム方面のライブ音が聞こえてきたこともあるそうです。',
    point: '都内庭園、文京区、東京ドーム周辺の寄り道候補として使いやすいページです。'
  },
  {
    id: 'aagan',
    cat: 'food',
    catLabel: 'みんなの感想',
    emoji: '🍛',
    name: 'アーガン',
    area: '新宿区大久保',
    pref: '東京',
    url: 'https://tabelog.com/tokyo/A1304/A130404/13196997/',
    memo: '新宿区大久保にあるお店。実際に訪れた感想として「美味しい。おかわりの量に感動」と投稿されています。',
    point: '大久保周辺の食事候補として、実体験の感想を含められるページです。',
    review: '美味しい。おかわりの量に感動。'
  },
  {
    id: 'rosetsu',
    cat: 'museum',
    catLabel: 'みんなの感想',
    emoji: '🎨',
    name: '府中市美術館 — 長沢蘆雪展',
    area: '府中市',
    pref: '東京',
    url: 'https://www.city.fuchu.tokyo.jp/art/index.html',
    memo: '府中市美術館で見られる展示の感想。日本の可愛い芸術の原点や、蘆雪の躍動感ある筆致に感動したという投稿があります。',
    point: '府中市美術館、長沢蘆雪、日本美術という具体語があり、文化系検索と相性が良いページです。',
    review: '日本の可愛い芸術の原点。蘆雪の躍動感ある筆致に感動。'
  }
];

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function metaDesc(spot) {
  return `${spot.name}（${spot.area}）のPOPOPOリスナーおすすめメモ。${spot.memo}`.replace(/\s+/g, ' ').slice(0, 155);
}

function pageHtml(spot) {
  const title = `${spot.name} | POPOPO お出かけマップ`;
  const desc = metaDesc(spot);
  const pageUrl = `${baseUrl}/spots/${spot.id}.html`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${spot.name}のおすすめメモ`,
    description: desc,
    inLanguage: 'ja',
    url: pageUrl,
    image: `${baseUrl}/assets/social-card-map.png`,
    about: {
      '@type': 'Place',
      name: spot.name,
      address: `${spot.pref} ${spot.area}`,
      url: spot.url
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'POPOPO お出かけマップ',
      url: baseUrl
    }
  };

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="author" content="masa0a">
  <link rel="canonical" href="${esc(pageUrl)}">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="POPOPO お出かけマップ">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(pageUrl)}">
  <meta property="og:image" content="${baseUrl}/assets/social-card-map.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${baseUrl}/assets/social-card-map.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Outfit:wght@300;400;600;700&family=Yomogi&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" sizes="512x512" href="../assets/favicon-512.png">
  <link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
  <link rel="stylesheet" href="../style.css?v=20260518-1">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="seo-spot-page">
  <nav id="navbar">
    <div class="nav-inner">
      <a href="../index.html#hero" class="nav-logo">
        <span class="logo-main">POPOPO</span>
        <span class="logo-sub">お出かけマップ</span>
      </a>
      <div class="nav-links" id="navLinks">
        <a href="../index.html#spots" class="nav-link">📍 おすすめスポット</a>
        <a href="../index.html#visited" class="nav-link">💬 みんなの感想</a>
        <a href="../index.html#community" class="nav-link">💬 フリートーク掲示板</a>
        <a href="../about.html" class="nav-link">🌿 この場所を作った理由</a>
        <a href="../how-to.html" class="nav-link">💡 使い方</a>
      </div>
    </div>
  </nav>

  <main>
    <section class="seo-spot-hero">
      <div class="container seo-spot-inner">
        <a class="seo-breadcrumb" href="index.html">SEOスポット一覧</a>
        <p class="guide-kicker">${esc(spot.emoji)} ${esc(spot.catLabel)}</p>
        <h1 class="seo-spot-title">${esc(spot.name)}</h1>
        <p class="seo-spot-meta">📍 ${esc(spot.area)}${spot.pref ? `（${esc(spot.pref)}）` : ''}</p>
        <p class="seo-spot-lead">${esc(spot.memo)}</p>
        ${spot.review ? `<blockquote class="seo-spot-review">“${esc(spot.review)}”</blockquote>` : ''}
        <div class="seo-spot-actions">
          <a class="btn-primary" href="../index.html#spots">サイトで見る</a>
          <a class="btn-outline" href="${esc(spot.url)}" target="_blank" rel="noopener">参考URLを開く</a>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <div class="container seo-spot-content">
        <article class="guide-card seo-spot-note">
          <span class="guide-num">PO</span>
          <h2>POPOPOリスナーのおすすめポイント</h2>
          <p>${esc(spot.point)}</p>
        </article>
        <article class="guide-card seo-spot-note">
          <span class="guide-num">MAP</span>
          <h2>このページについて</h2>
          <p>このページは、POPOPO お出かけマップに掲載されているおすすめスポットや感想を、検索でも見つけやすいように整理した静的ページです。最新の投稿やみんなの感想はトップページで確認できます。</p>
        </article>
      </div>
    </section>
  </main>

  <footer id="siteFooter">
    <div class="footer-inner">
      <div class="footer-logo">
        <span class="logo-main">POPOPO</span>
        <span class="logo-sub">お出かけマップ</span>
      </div>
      <p class="footer-desc">人から人へ伝わる、ちいさなお出かけ案内。</p>
      <p class="footer-update">最終更新：2026年5月18日</p>
    </div>
  </footer>
</body>
</html>
`;
}

function indexHtml() {
  const cards = spots.map(spot => `
        <a class="guide-card seo-index-card" href="${esc(spot.id)}.html">
          <span class="guide-num">${esc(spot.emoji)}</span>
          <h2>${esc(spot.name)}</h2>
          <p>${esc(spot.area)} / ${esc(spot.catLabel)}</p>
          <p>${esc(spot.memo)}</p>
        </a>`).join('');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'POPOPO お出かけマップ SEOスポット一覧',
    description: 'POPOPOリスナーのおすすめスポットや感想を検索向けに整理した一覧です。',
    url: `${baseUrl}/spots/`,
    inLanguage: 'ja',
    isPartOf: {
      '@type': 'WebSite',
      name: 'POPOPO お出かけマップ',
      url: baseUrl
    }
  };

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>おすすめスポット一覧 | POPOPO お出かけマップ</title>
  <meta name="description" content="POPOPO お出かけマップのおすすめスポットやみんなの感想を、検索でも見つけやすい静的ページとして整理した一覧です。">
  <link rel="canonical" href="${baseUrl}/spots/">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="POPOPO お出かけマップ">
  <meta property="og:title" content="おすすめスポット一覧 | POPOPO お出かけマップ">
  <meta property="og:description" content="POPOPOリスナーのおすすめスポットや感想を検索向けに整理した一覧です。">
  <meta property="og:url" content="${baseUrl}/spots/">
  <meta property="og:image" content="${baseUrl}/assets/social-card-map.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${baseUrl}/assets/social-card-map.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Outfit:wght@300;400;600;700&family=Yomogi&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" sizes="512x512" href="../assets/favicon-512.png">
  <link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
  <link rel="stylesheet" href="../style.css?v=20260518-1">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="seo-spot-page">
  <nav id="navbar">
    <div class="nav-inner">
      <a href="../index.html#hero" class="nav-logo">
        <span class="logo-main">POPOPO</span>
        <span class="logo-sub">お出かけマップ</span>
      </a>
      <div class="nav-links" id="navLinks">
        <a href="../index.html#spots" class="nav-link">📍 おすすめスポット</a>
        <a href="../index.html#visited" class="nav-link">💬 みんなの感想</a>
        <a href="../about.html" class="nav-link">🌿 この場所を作った理由</a>
        <a href="../how-to.html" class="nav-link">💡 使い方</a>
      </div>
    </div>
  </nav>

  <main>
    <section class="guide-hero seo-index-hero">
      <div class="guide-hero-inner">
        <span class="guide-kicker">検索向けピックアップ</span>
        <h1 class="guide-title">おすすめスポット一覧</h1>
        <p class="guide-lead">POPOPOリスナーのおすすめや感想の中から、場所名・地域名・体験内容が具体的なものを静的ページとして整理しています。</p>
        <div class="guide-actions">
          <a href="../index.html#spots" class="btn-primary">トップで見る</a>
          <a href="../index.html#visited" class="btn-outline">みんなの感想へ</a>
        </div>
      </div>
    </section>
    <section class="guide-section">
      <div class="container guide-grid seo-index-grid">
${cards}
      </div>
    </section>
  </main>
</body>
</html>
`;
}

function sitemapXml() {
  const urls = [
    ['/', lastmod],
    ['/how-to.html', lastmod],
    ['/about.html', lastmod],
    ['/spots/', lastmod],
    ...spots.map(spot => [`/spots/${spot.id}.html`, lastmod])
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, date]) => `  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${date}</lastmod>
  </url>`).join('\n')}
</urlset>
`;
}

const spotsDir = path.join(root, 'spots');
fs.mkdirSync(spotsDir, { recursive: true });
for (const spot of spots) {
  fs.writeFileSync(path.join(spotsDir, `${spot.id}.html`), pageHtml(spot));
}
fs.writeFileSync(path.join(spotsDir, 'index.html'), indexHtml());
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemapXml());

console.log(`Generated ${spots.length} spot pages plus spots/index.html`);
