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
    point: '池袋・小籠包・涼皮・朝ごはんなど、検索されやすい具体語が多いスポットです。',
    review: 'TV放映後の休日は店舗の外まで行列があり、麻辣担の薬膳スープは香辛料の香りと辛味が印象的だったという感想が届いています。'
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
    id: 'ikebukuro-jazz-festival',
    cat: 'event',
    catLabel: 'イベント',
    emoji: '🎺',
    name: '池袋ジャズフェスティバル',
    area: '池袋',
    pref: '東京',
    url: 'https://www.ikebukurojazz.com/',
    memo: '池袋の街なかで音楽が聴こえてくる、無料でふらっと立ち寄れるジャズイベント。カフェ巡りや散歩の途中にも楽しめる、やさしい空気のフェスです。',
    point: '池袋、ジャズフェス、無料イベント、街歩きという検索意図に合う実体験のあるページです。',
    review: 'POPOPOで聞き、勉強の合間に息抜きで立ち寄ったところ、生のサックスの音色や会場の一体感に心を動かされたという感想が届いています。'
  },
  {
    id: 'thai-festival-tokyo',
    cat: 'event',
    catLabel: 'イベント',
    emoji: '🇹🇭',
    name: 'タイフェスティバル東京',
    area: '代々木公園',
    pref: '東京',
    url: 'https://thaifes.jp/',
    memo: '代々木公園で開催される、タイの食・音楽・文化を楽しめる人気イベント。東京にいながらタイ旅行のような気分を味わえる場所です。',
    point: '代々木公園、タイフェス、ガパオライス、国際イベントの検索に向いています。',
    review: '会場の賑わい、タイ料理の本場感、音楽や食を通じて自然と笑顔が生まれる空間が印象的だったという感想が投稿されています。'
  },
  {
    id: 'lafollejournee-tokyo-2026',
    cat: 'event',
    catLabel: 'イベント',
    emoji: '🎻',
    name: 'ラフォルジュルネTOKYO2026',
    area: '東京国際フォーラム',
    pref: '東京',
    url: 'https://www.lfj.jp/lfj_2026/guide/pdf/lfj2026_timetable_0424.pdf',
    memo: '東京国際フォーラムで開催されるクラシック音楽祭。無料エリアやフードコートもあり、クラシック初心者でも気軽に楽しめるイベントです。',
    point: '東京国際フォーラム、クラシック音楽祭、無料コンサートの検索と相性が良いページです。',
    review: '演奏者が真剣に音楽と向き合う姿、会場ならではの音の余韻、観客の一体感に自然と引き込まれたという感想が届いています。'
  },
  {
    id: 'niconico-chokaigi',
    cat: 'event',
    catLabel: 'イベント',
    emoji: '🎪',
    name: 'ニコニコ超会議',
    area: '幕張',
    pref: '千葉',
    url: 'https://chokaigi.jp/',
    memo: 'ネット発のみんなで作る日本最大級の文化祭。ニコニコ動画のカルチャーをリアルに体験できるイベントです。',
    point: 'ニコニコ超会議、幕張、ボカロ、ネット文化、イベント感想の検索に強いテーマです。',
    review: 'ボカロPのDJライブ、有名な人が物販に立つ不思議な空間、小林幸子さんの千本桜など、現地ならではの感想が複数届いています。'
  },
  {
    id: 'kasai-rinkai-crystal-view',
    cat: 'view',
    catLabel: 'おきにいりの景色',
    emoji: '🏝️',
    name: '葛西臨海公園 クリスタルビュー',
    area: '江戸川区',
    pref: '東京',
    url: 'https://architecture-tour.com/world/japan/tokyo/crystal-view/',
    memo: '葛西臨海公園内にある「クリスタルビュー」。美しい建築から海を眺められる、入場無料の景色スポットです。',
    point: '葛西臨海公園、クリスタルビュー、無料、海が見える場所という検索に向いています。'
  },
  {
    id: 'tokyo-mitaiwara',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍬',
    name: 'トウキョウ ミタイワラ',
    area: '西葛西',
    pref: '東京',
    url: 'https://share.google/a4XiQFxBsCeCI5B6c',
    memo: '不思議な甘さのインドスイーツのお店。バルフィがおすすめとして投稿されています。',
    point: '西葛西、インドスイーツ、バルフィという具体的でニッチな検索に合います。'
  },
  {
    id: 'ota-memorial-museum',
    cat: 'museum',
    catLabel: '美術館・博物館',
    emoji: '🖼️',
    name: '太田記念美術館',
    area: '原宿',
    pref: '東京',
    url: 'https://www.ukiyoe-ota-muse.jp/',
    memo: '原宿にある浮世絵専門の美術館。浮世絵をたくさん見られる場所として投稿されています。',
    point: '原宿、浮世絵、美術館という検索されやすい組み合わせです。'
  },
  {
    id: 'rakusho-ramen',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍜',
    name: '楽勝ラーメン',
    area: '福岡市中央区天神',
    pref: '福岡',
    url: 'https://tabelog.com/fukuoka/A4001/A400103/40006293/',
    memo: '福岡市の繁華街中心部にあり、手頃な価格でラーメンを食べられるお店。カレーも美味しいとの投稿があります。',
    point: '福岡、天神、ラーメン、カレー、安いランチの検索意図に合います。'
  },
  {
    id: 'kusamakura-cafe',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '☕',
    name: '草枕',
    area: '港区',
    pref: '東京',
    url: 'https://tabelog.com/tokyo/A1301/A130103/13043012/',
    memo: 'オフィス街にある落ち着いたカフェ。照明、丁寧な接客、本のある空間が心地よい場所として投稿されています。',
    point: '港区、落ち着くカフェ、本があるカフェという検索に向いています。'
  },
  {
    id: 'japan-coast-guard-museum-yokohama',
    cat: 'museum',
    catLabel: '美術館・博物館',
    emoji: '🚢',
    name: '海上保安資料館横浜館',
    area: '横浜',
    pref: '神奈川',
    url: 'https://share.google/OR8sP7aiI4xg6s26C',
    memo: '工作船や押収された武器などを見られる、入館無料の資料館。展示の迫力が印象的だったという投稿があります。',
    point: '横浜、無料資料館、海上保安、工作船展示という具体的な検索に合います。'
  },
  {
    id: 'matsuya-morning',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍚',
    name: '松屋のモーニング',
    area: '全国',
    pref: '全国',
    url: 'https://www.matsuyafoods.co.jp/matsuya/menu/morning/index.html',
    memo: '11時まで利用できる朝ごはんメニュー。早めのランチとしても使いやすく、選べる小鉢やコスパの良さが魅力です。',
    point: '松屋、モーニング、朝定食、コスパ、早めのランチという日常検索に向いています。',
    review: '特朝牛皿定食や国産とろろなど、価格と満足感のバランスに驚いたという実食感想が届いています。'
  },
  {
    id: 'sanin-gyokai-chuka-soba',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🐚',
    name: '山陰魚介中華蕎麦',
    area: '東京都練馬区',
    pref: '東京',
    url: 'https://tabelog.com/tokyo/A1321/A132102/13300394/',
    memo: '練馬の住宅街にあるラーメン店。大量のしじみが入った斬新な見た目と、濃厚なしじみの旨味が広がるスープが印象的です。',
    point: '練馬、しじみラーメン、朝ラーメン、魚介中華蕎麦の検索に向いています。'
  },
  {
    id: 'frijoles-yaesu',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🌯',
    name: 'フリホーレス 東京ミッドタウン八重洲店',
    area: '東京ミッドタウン八重洲',
    pref: '東京',
    url: 'https://tabelog.com/tokyo/A1302/A130201/13276542/',
    memo: 'ボリューム満点のブリトーで、タンパク質・野菜・炭水化物をバランスよく摂れるお店。時短と健康を両立したい時の候補です。',
    point: '東京駅、八重洲、ブリトー、ヘルシーランチの検索に合います。'
  },
  {
    id: 'oyama-milk-no-sato',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍦',
    name: '大山まきばのみるくの里',
    area: '鳥取・大山',
    pref: '鳥取',
    url: 'https://dainyu.or.jp/village-of-milk/',
    memo: '白バラ牛乳ブランド初の公式コンセプトショップ。白バラ商品やグッズ、ソフトクリームを楽しめる鳥取・大山のスポットです。',
    point: '鳥取、大山、白バラ牛乳、ソフトクリーム、牧場観光の検索に向いています。',
    review: '空気のきれいさ、放牧の牛、芝生でのピクニック、濃厚なのに後味がすっきりしたソフトクリームが印象的だったという感想が届いています。'
  },
  {
    id: 'ramen-otama',
    cat: 'food',
    catLabel: '飲食店',
    emoji: '🍜',
    name: 'ラーメンおたま',
    area: '鳥取・米子',
    pref: '鳥取',
    url: 'https://share.google/FSaSRer3XmzgQmbAs',
    memo: '鳥取県米子市で牛骨ラーメンを楽しめるお店。透き通ったスープと独特の甘み、コクが特徴です。',
    point: '米子、鳥取、牛骨ラーメン、チャーハンという地域性のある検索に向いています。',
    review: '初めて牛骨ラーメンを食べた方から、独特な臭みがなく、きれいな色のスープで美味しかったという感想が届いています。'
  },
  {
    id: 'queen-hiroba-yokohama-customs',
    cat: 'museum',
    catLabel: '美術館・博物館',
    emoji: '🏛️',
    name: 'クイーンのひろば',
    area: '横浜',
    pref: '神奈川',
    url: 'https://share.google/ynCJht8MwoGxLxyn2',
    memo: '横浜税関の博物館。入館無料で、密輸の手口などを知ることができる展示があります。',
    point: '横浜、横浜税関、無料博物館、密輸展示という具体的な検索に向いています。'
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
