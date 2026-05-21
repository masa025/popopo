const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../index.html');
const destPath = path.join(__dirname, '../index-en.html');

if (!fs.existsSync(srcPath)) {
  console.error(`Source index.html not found at: ${srcPath}`);
  process.exit(1);
}

let html = fs.readFileSync(srcPath, 'utf8');

// 1. Replace html lang
html = html.replace('<html lang="ja">', '<html lang="en">');

// 2. Replace SEO head links & alternates
const oldHeadAlternates = `  <link rel="canonical" href="https://popopo-comm.netlify.app/">
  <link rel="alternate" hreflang="ja" href="https://popopo-comm.netlify.app/">
  <link rel="alternate" hreflang="en" href="https://popopo-comm.netlify.app/index-en.html">
  <link rel="alternate" hreflang="x-default" href="https://popopo-comm.netlify.app/">`;

const newHeadAlternates = `  <link rel="canonical" href="https://popopo-comm.netlify.app/index-en.html">
  <link rel="alternate" hreflang="ja" href="https://popopo-comm.netlify.app/">
  <link rel="alternate" hreflang="en" href="https://popopo-comm.netlify.app/index-en.html">
  <link rel="alternate" hreflang="x-default" href="https://popopo-comm.netlify.app/">`;

html = html.replace(oldHeadAlternates, newHeadAlternates);

// 3. Replace Titles & Descriptions (Metadata)
html = html.replace(
  '<title>POPOPO お出かけマップ | みんなで作るお出かけマップ</title>',
  '<title>POPOPO Outing Map | A Human Route</title>'
);
html = html.replace(
  '<meta name="description" content="POPOPO お出かけマップで、リスナーおすすめスポット、みんなの感想、フリートークを共有。検索やAIではなく、誰かの言葉から次のお出かけを見つけるコミュニティです。">',
  '<meta name="description" content="POPOPO Outing Map is a listener community where people share recommended spots, reviews, and free talk beyond search and algorithms.">'
);
html = html.replace(
  '<meta property="og:title" content="POPOPO お出かけマップ | みんなで作るお出かけマップ">',
  '<meta property="og:title" content="POPOPO Outing Map | A Human Route">'
);
html = html.replace(
  '<meta property="og:description" content="検索やAIではなく、誰かの言葉から次のお出かけを見つける。POPOPO お出かけマップは、みんなでおすすめスポットや感想を持ち寄るコミュニティです。">',
  '<meta property="og:description" content="Share recommended spots, guest reviews, and free talk. Find your next holiday outing from someone\'s actual voice, not AI or algorithms.">'
);
html = html.replace(
  '<meta property="og:locale" content="ja_JP">',
  '<meta property="og:locale" content="en_US">'
);
html = html.replace(
  '<meta name="twitter:title" content="POPOPO コミュニティ">',
  '<meta name="twitter:title" content="POPOPO Outing Map">'
);
html = html.replace(
  '<meta name="twitter:description" content="POPOPOリスナーのおすすめスポット、みんなの感想、フリートークを共有するコミュニティサイト。">',
  '<meta name="twitter:description" content="A listener community website sharing recommended spots, guest reviews, and free talk.">'
);

// 4. Update JSON-LD structured data block
const oldJsonLd = `"name": "POPOPO コミュニティ お出かけマップ",
    "alternateName": [
      "POPOPO コミュニティ",
      "POPOPO リスナーコミュニティ",
      "POPOPO お出かけマップ",
      "POPOPO おすすめスポット",
      "POPOPO 感想共有",
      "POPOPO フリートーク掲示板"
    ],
    "url": "https://popopo-comm.netlify.app/",
    "description": "POPOPO コミュニティで、リスナーおすすめスポット、みんなの感想、フリートークを共有するサイトです。",
    "keywords": "POPOPO コミュニティ, POPOPO リスナーコミュニティ, POPOPO お出かけマップ, POPOPO おすすめスポット, POPOPO 感想共有, POPOPO フリートーク",
    "inLanguage": "ja"`;

const newJsonLd = `"name": "POPOPO Outing Map",
    "alternateName": [
      "POPOPO Community",
      "POPOPO Listener Community",
      "POPOPO Outing Map",
      "POPOPO Recommended Spots",
      "POPOPO Review Sharing",
      "POPOPO Free Talk Board"
    ],
    "url": "https://popopo-comm.netlify.app/index-en.html",
    "description": "A listener community site to share recommended spots, reviews, and free talk about outings beyond algorithms.",
    "keywords": "POPOPO, POPOPO Community, POPOPO Outing Map, Recommended Spots, Guest Reviews, Free Talk",
    "inLanguage": "en"`;

html = html.replace(oldJsonLd, newJsonLd);

// 5. Update first JSON-LD
html = html.replace(
  '"name": "POPOPO お出かけマップ",\n    "url": "https://popopo-comm.netlify.app/",\n    "description": "リスナーおすすめスポットや感想を共有するコミュニティマップ"',
  '"name": "POPOPO Outing Map",\n    "url": "https://popopo-comm.netlify.app/index-en.html",\n    "description": "A listener community map to share recommended spots and reviews"'
);

// 6. Statically translate JP toggle buttons to EN toggle buttons
html = html.replace('<span class="lang-label">JP</span>', '<span class="lang-label">EN</span>');
html = html.replace('<span class="lang-label-mobile">JP</span>', '<span class="lang-label-mobile">EN</span>');

// 7. Statically translate key body text nodes (for crawlers without JS)
const bodyReplacements = [
  // Nav
  ['logo-sub">お出かけマップ', 'logo-sub">Outing Map'],
  ['📍 おすすめスポット</a>', '📍 Recommended Spots</a>'],
  ['💬 みんなの感想</a>', '💬 Guest Reviews</a>'],
  ['💬 フリートーク掲示板</a>', '💬 Free Talk Board</a>'],
  ['🌿 この場所を作った理由</a>', '🌿 Why We Built This</a>'],
  ['💡 使い方</a>', '💡 Guide</a>'],
  ['💡 使い方を見る</a>', '💡 Open Guide</a>'],

  // Hero Quick Links & Buttons
  ['📍 おすすめスポットを見る', '📍 Browse Spots'],
  ['💬 みんなの感想を見る', '💬 Read Reviews'],
  ['✨ ポポッと選ぶ', '✨ Pop & Pick!'],
  ['✨ ポポッと', '✨ Pop Pick'],
  ['🎮 POPOOSHIで遊ぶ', '🎮 Play POPOOSHI'],
  ['🎮 ゲーム', '🎮 Game'],
  ['地図を見る</span>', 'View Map</span>'],
  ['🖼️ すべての作品・辞典を見る', '🖼️ View Art & Dictionary'],

  // Stats
  ['>スポット<', '>Spots<'],
  ['>つぶやき<', '>Chats<'],
  ['>感想<', '>Reviews<'],
  ['👀 訪問<', '👀 Visits<'],

  // Section Headers
  ['🗺️ おすすめスポット</h2>', '🗺️ Recommended Spots</h2>'],
  ['『これ良かったよ』の気持ちをみんなでシェア。あなたの好きも、ぜひ教えてください。</p>', 'Share your \'I loved this place\' moments with everyone. Tell us your favorites!</p>'],
  ['スポットを追加する</button>', 'Add a Spot</button>'],
  ['「ここ気になる」「行ってみたい」そんな一言からで大丈夫！</p>', 'Just a small recommendation or \'I want to go here\' is perfect!</p>'],
  ['🌤️ 今日のお出かけヒント', '🌤️ Today\'s Outing Hint'],
  ['選んだ都市の天気が「今日のお出かけヒント」に表示されます（次回も記憶します）', 'Weather of selected cities will show in "Today\'s Outing Hint" (remembered)'],
  ['🌤️ 表示する都市を選択', '🌤️ Select Cities to Display'],
  ['aria-label="閉じる"', 'aria-label="Close"'],
  ['キャンセル</button>', 'Cancel</button>'],
  ['保存する ✓</button>', 'Save ✓</button>'],
  ['aria-label="表示する都市を設定"', 'aria-label="Configure display cities"'],
  ['天気を取得中...</span>', 'Fetching weather...</span>'],

  // Tabs
  ['カテゴリー：すべて', 'Category: All'],
  ['🍴 飲食店</button>', '🍴 Food & Cafe</button>'],
  ['🍜 食べたいもの</button>', '🍜 Must-Try</button>'],
  ['🎨 美術館・博物館</button>', '🎨 Art & Museum</button>'],
  ['🌿 イベント</button>', '🌿 Events</button>'],
  ['🌳 自然・よりみち</button>', '🌳 Nature & Walk</button>'],
  ['📚 本・しらべもの</button>', '📚 Book & Study</button>'],
  ['🛒 くらし・雑貨</button>', '🛒 Lifestyle & Goods</button>'],
  ['✨ おきにいりの景色</button>', '✨ Lovely Views</button>'],
  ['🛁 癒やし・ととのう</button>', '🛁 Relax & Bath</button>'],
  ['🎬 エンタメ</button>', '🎬 Fun & Media</button>'],

  // Want-to-Go
  ['🔖 行きたいリスト（0）', '🔖 Want to Go (0)'],
  ['🌱 これから行きたい場所を追加', '🌱 Add a Spot You Want to Visit'],
  ['行ってみた場所があれば、感想を残してみませんか？', 'Visited some spots? Share your impressions!'],

  // Reviews Section
  ['💬 みんなの感想</h2>', '💬 Guest Reviews</h2>'],
  ['実際に訪れたスポットの感想を集めています', 'Real reviews and impressions from guests who visited the spots'],
  ['感想を投稿する</button>', 'Write a Review</button>'],
  ['もっと見る</button>', 'See More</button>'],

  // Free talk board
  ['💬 フリートーク掲示板</h2>', '💬 Free Talk Board</h2>'],
  ['お出かけの予定、POPOPOの感想、サイトへのご意見など自由に語り合いましょう！', 'Feel free to talk about your plans, thoughts on POPOPO, feedback, or anything!'],
  ['今日のお題</span>', 'Today\'s Topic</span>'],
  ['最近気になっている場所はありますか？', 'Are there any places you are curious about lately?'],
  ['🎲 ガチャを回す', '🎲 Roll Topic Gacha'],
  ['このお題でつぶやく', 'Chat on This Topic'],
  ['みんなの提案を見る', 'View All Topics'],
  ['みんなが提案してくれたお題を順番に「今日のお題」として表示しています。<br>心が動いたお題や共感したものには、ぜひ ♡ を押して応援してみてください✨', 'We show topics suggested by everyone as \'Today\'s Topic\' in turn.<br>Press ♡ to support topics that touch your heart or make you relate✨'],
  ['お題を提案する', 'Suggest a Topic'],
  ['ふと思いついた問いかけで大丈夫。だれかの一日にそっと届きます。', 'Any casual question is fine! It will reach someone\'s day gently.'],
  ['まだ提案はありません。最初のひとつ目、書いてみませんか？', 'No suggestions yet. Why not write the first one?'],
  ['✏️ つぶやく</button>', '✏️ Post Chat</button>'],

  // Gacha Modal
  ['✨ ポポッと選ぶ</h3>', '✨ Pop & Pick</h3>'],
  ['おすすめスポットとみんなの感想から、ひとつ（ときどきいくつか）をポポッとお届けします。迷ったときの、ささやかなきっかけとしてどうぞ。何度でも、お好きなだけ。', 'We will gently suggest a spot or review at random. Great for when you can\'t decide where to go. Try as many times as you like!'],
  ['えらんでみる</button>', 'Pick for me</button>'],
  ['すこしだけ待ってください…', 'Please wait a moment...'],
  ['もう一度、ポポッと</button>', 'Pop & Pick Again</button>'],

  // Footer
  ['POPOPOで紹介された場所を、みんなで楽しもう。', 'Let\'s explore and enjoy spots introduced in POPOPO together.'],
  ['スポット一覧</a>', 'Spots Directory</a>'],
  ['お手入れ係', 'Curator'],
  ['🦋 masa0a へ連絡する / Bluesky</a>', '🦋 Contact masa0a / Bluesky</a>'],
];

for (const [jp, en] of bodyReplacements) {
  html = html.split(jp).join(en);
}

fs.writeFileSync(destPath, html, 'utf8');
console.log(`Successfully generated English homepage: ${destPath}`);
