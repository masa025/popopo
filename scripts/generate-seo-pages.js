const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const baseUrl = 'https://popopo-comm.netlify.app';
const lastmod = '2026-05-20';

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
    memo: '浅浅草から都営浅草線で乗り換えなし。開店したばかりで、ランチがお得で美味しいとのリスナー推薦です。',
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

// Load configurations dynamically from app.js to prevent duplication
const appJsPath = path.join(root, 'app.js');
let SPOT_TRANSLATIONS = {};
let ADDRESS_TRANSLATION_MAP = {};
let SPOT_COORDINATES = {};
let SPOTS = [];
let VISITED = [];

try {
  const appJsContent = fs.readFileSync(appJsPath, 'utf8');
  
  function extractJsObject(jsContent, objectName) {
    const regex = new RegExp(`const\\s+${objectName}\\s*=\\s*(\\{[\\s\\S]*?\\});`, 'm');
    const match = jsContent.match(regex);
    if (match) {
      try {
        return Function(`return ${match[1]};`)();
      } catch (e) {
        console.error(`Failed to parse ${objectName}:`, e);
      }
    }
    // Try array match
    const regexArr = new RegExp(`const\\s+${objectName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`, 'm');
    const matchArr = jsContent.match(regexArr);
    if (matchArr) {
      try {
        return Function(`return ${matchArr[1]};`)();
      } catch (e) {
        console.error(`Failed to parse ${objectName} as array:`, e);
      }
    }
    return null;
  }
  
  SPOT_TRANSLATIONS = extractJsObject(appJsContent, 'SPOT_TRANSLATIONS') || {};
  ADDRESS_TRANSLATION_MAP = extractJsObject(appJsContent, 'ADDRESS_TRANSLATION_MAP') || {};
  SPOT_COORDINATES = extractJsObject(appJsContent, 'SPOT_COORDINATES') || {};
  SPOTS = extractJsObject(appJsContent, 'SPOTS') || [];
  VISITED = extractJsObject(appJsContent, 'VISITED') || [];
  console.log('Successfully loaded SPOT_TRANSLATIONS, ADDRESS_TRANSLATION_MAP, SPOT_COORDINATES, SPOTS, and VISITED from app.js');
} catch (err) {
  console.error('Error parsing app.js:', err);
}

// English Category Labels Map
const CAT_LABELS_EN = {
  'food': 'Food & Cafe',
  'mohinga': 'Must-Try',
  'museum': 'Art & Museum',
  'event': 'Events',
  'nature': 'Nature & Walk',
  'book': 'Book & Study',
  'shop': 'Lifestyle & Goods',
  'view': 'Lovely Views',
  'relax': 'Relax & Bath',
  'entertainment': 'Fun & Media'
};

// Extra translations for reviews/points that aren't defined in app.js
const EXTRA_SPOT_TRANSLATIONS = {
  'comme-chinois': {
    point: 'Easy to reach for people searching for bakeries or breakfast spots in Kobe/Sannomiya.'
  },
  'yugi': {
    point: 'Contains highly searched specific keywords such as Ikebukuro, Xiaolongbao, Liangpi, and Breakfast.',
    review: 'Guests noted that after the TV broadcast, there were long lines outside, and the herbal soup of Malatang left a lasting impression with its spicy and aromatic spices.'
  },
  'kameju': {
    point: 'Highly searchable in the context of Asakusa, Dorayaki, and traditional Japanese sweets.'
  },
  'kamado-gohan-matsushima': {
    point: 'Great synergy with local searches as a lunch spot easily accessible from Asakusa.'
  },
  'yamaya-ikebukuro': {
    point: 'Includes keywords with clear search intent, such as Ikebukuro lunch, Mentsuko (spicy cod roe), and motsunabe.'
  },
  'kura-global-flagship': {
    point: 'Highly useful for tourists, families, and those looking for conveyor-belt sushi in Tokyo.'
  },
  'saryo-tsujiri-daimaru': {
    point: 'Matches search demand for Tokyo Station, matcha, sweets, and cafe breaks.'
  },
  'leonards-japan': {
    point: 'Highly specific with the combination of Yokohama, Malasadas, and Hawaiian sweets.'
  },
  'shinpachi-shokudo': {
    point: 'Fits a wide range of search intents like solo dining, set meals, and breakfast.'
  },
  'mohinga': {
    point: 'Ideal for niche searches like Myanmar food, Mohinga, and Takadanobaba.'
  },
  '400do-pizza': {
    point: 'Contains popular proper nouns highly searched as famous pizza spots in Hiroshima and Okayama.'
  },
  'yamatane': {
    point: 'Clear museum name and area name, making it suitable for cultural outing searches.'
  },
  'nmwa': {
    point: 'Perfect for search contexts relating to Ueno, art museums, and World Heritage architecture.'
  },
  'hokusai': {
    point: 'Strong keyword combination of Hokusai, museum, and Sumida-ku.'
  },
  'kagurazaka-machibutai-2026': {
    point: 'Includes event name, dates, and Kagurazaka local context, suitable for seasonal searches.'
  },
  'koishikawa-korakuen': {
    point: 'Useful as a detour option near Tokyo Dome, Bunkyo-ku, or urban gardens.'
  },
  'ikebukuro-jazz-festival': {
    point: 'Contains real-life impressions matching search intents for Ikebukuro, jazz festivals, free events, and city walks.',
    review: 'Hearing about it on POPOPO, a listener dropped by for a break during studies and was deeply moved by the live saxophone performance and the sense of unity at the venue.'
  },
  'thai-festival-tokyo': {
    point: 'Suitable for searches for Yoyogi Park, Thai Festival, Gapao rice, and international events.',
    review: 'Reviews highlight the lively atmosphere, authentic Thai food, and a space where music and food naturally bring out smiles.'
  },
  'lafollejournee-tokyo-2026': {
    point: 'Matches searches for Tokyo International Forum, classical music festivals, and free concerts.',
    review: 'Listeners were naturally drawn in by the musicians\' dedication to their art, the acoustic resonance of the venue, and the shared excitement of the audience.'
  },
  'niconico-chokaigi': {
    point: 'Strong theme for searches about Niconico Chokaigi, Makuhari, Vocaloid, internet culture, and event reviews.',
    review: 'Various impressions from the venue include DJ lives by Vocaloid producers, famous personalities at merch booths, and Sachiko Kobayashi\'s Senbonzakura.'
  },
  'kasai-rinkai-crystal-view': {
    point: 'Perfect for searches regarding Kasai Rinkai Park, Crystal View, free entry, and sea view spots.'
  },
  'tokyo-mitaiwara': {
    point: 'Suits niche and specific searches for Nishi-Kasai, Indian sweets, and Barfi.'
  },
  'ota-memorial-museum': {
    point: 'Highly searchable combination of Harajuku, Ukiyo-e, and art museum.'
  },
  'rakusho-ramen': {
    point: 'Matches search intents for Fukuoka, Tenjin, ramen, curry, and cheap lunch.'
  },
  'kusamakura-cafe': {
    point: 'Perfect for searches for Minato-ku, quiet cafes, and cafes with books.'
  },
  'japan-coast-guard-museum-yokohama': {
    point: 'Fits specific searches for Yokohama, free museums, maritime safety, and patrol boat exhibits.'
  },
  'matsuya-morning': {
    point: 'Ideal for daily searches such as Matsuya breakfast, morning sets, value dining, and early lunch.',
    review: 'Reviews express surprise at the excellent balance of price and satisfaction, mentioning options like Tokucho Gyusara Teishoku and domestic grated yam.'
  },
  'sanin-gyokai-chuka-soba': {
    point: 'Perfect for searches for Nerima, clam ramen, morning ramen, and seafood ramen.'
  },
  'frijoles-yaesu': {
    point: 'Matches searches for Tokyo Station, Yaesu, burritos, and healthy lunch.'
  },
  'oyama-milk-no-sato': {
    point: 'Suits searches for Tottori, Daisen, Shirobara Milk, soft-serve ice cream, and dairy farm sightseeing.',
    review: 'Impressions highlight the clean air, grazing cows, picnics on the grass, and the rich yet refreshing flavor of the soft-serve ice cream.'
  },
  'ramen-otama': {
    point: 'Matches local search interests for Yonago, Tottori, beef bone ramen, and fried rice.',
    review: 'A guest who tried beef bone ramen for the first time noted that it was delicious, free from any gamey smell, and had a beautiful clear broth.'
  },
  'queen-hiroba-yokohama-customs': {
    point: 'Matches specific searches for Yokohama, Yokohama Customs, free museums, and smuggling exhibits.'
  },
  'aagan': {
    point: 'Allows adding real-life guest reviews for dining options around Okubo.',
    review: 'Delicious! I was deeply impressed by the generous portions of refills.'
  },
  'rosetsu': {
    point: 'Features cultural search keywords like Fuchu Art Museum, Nagasawa Rosetsu, and Japanese art, matching art search intents.',
    review: 'The origin of cute Japanese art. I was deeply moved by Rosetsu\'s dynamic and lively brushwork.'
  }
};

// Merge vegan/card/wifi tags dynamically from SPOTS and VISITED arrays in app.js
const allAppSpots = [...SPOTS, ...VISITED];
for (const spot of spots) {
  const appSpot = allAppSpots.find(s => s.id === spot.id);
  if (appSpot) {
    if (appSpot.vegan) spot.vegan = true;
    if (appSpot.card) spot.card = true;
    if (appSpot.wifi) spot.wifi = true;
    if (appSpot.traditional) spot.traditional = true;
  }
}

function convertToEnglishAddress(area, pref) {
  const tArea = ADDRESS_TRANSLATION_MAP[area] || area;
  const tPref = ADDRESS_TRANSLATION_MAP[pref] || pref;
  if (tPref === 'Japan Nationwide' || tPref === 'Online' || tPref === 'Nationwide') {
    return tPref;
  }
  if (tArea === tPref) {
    return tArea;
  }
  return `${tArea}, ${tPref}`;
}

function getGoogleMapsUrl(spot) {
  if (SPOT_COORDINATES[spot.id]) {
    const { lat, lng } = SPOT_COORDINATES[spot.id];
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const query = encodeURIComponent(`${spot.name} ${spot.pref || ''} ${spot.area || ''}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function renderInboundTags(s, lang) {
  let html = '';
  const isEn = lang === 'en';
  if (s.vegan) {
    html += `<span class="inbound-tag inbound-tag--vegan">${isEn ? '🌱 Vegan' : '🌱 ヴィーガン対応'}</span>`;
  }
  if (s.card) {
    html += `<span class="inbound-tag inbound-tag--card">${isEn ? '💳 Card OK' : '💳 カード決済可'}</span>`;
  }
  if (s.wifi) {
    html += `<span class="inbound-tag inbound-tag--wifi">${isEn ? '📶 Wi-Fi' : '📶 Wi-Fiあり'}</span>`;
  }
  if (s.traditional) {
    html += `<span class="inbound-tag inbound-tag--traditional">${isEn ? '🏯 Traditional' : '🏯 日本の伝統'}</span>`;
  }
  if (html) {
    return `<div class="spot-inbound-tags">${html}</div>`;
  }
  return '';
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function metaDesc(spot, lang) {
  if (lang === 'en') {
    const spotName = SPOT_TRANSLATIONS[spot.id]?.name || spot.name;
    const spotMemo = SPOT_TRANSLATIONS[spot.id]?.memo || spot.memo;
    const spotArea = convertToEnglishAddress(spot.area, spot.pref);
    return `POPOPO listener recommendation for ${spotName} in ${spotArea}. ${spotMemo}`.replace(/\s+/g, ' ').slice(0, 155);
  } else {
    return `${spot.name}（${spot.area}）のPOPOPOリスナーおすすめメモ。${spot.memo}`.replace(/\s+/g, ' ').slice(0, 155);
  }
}

function pageHtml(spot, lang) {
  const isEn = lang === 'en';
  const spotName = isEn ? (SPOT_TRANSLATIONS[spot.id]?.name || spot.name) : spot.name;
  const spotMemo = isEn ? (SPOT_TRANSLATIONS[spot.id]?.memo || spot.memo) : spot.memo;
  const spotPoint = isEn ? (EXTRA_SPOT_TRANSLATIONS[spot.id]?.point || spot.point) : spot.point;
  const spotReview = isEn ? (EXTRA_SPOT_TRANSLATIONS[spot.id]?.review || spot.review) : spot.review;
  const spotCatLabel = isEn ? (CAT_LABELS_EN[spot.cat] || spot.catLabel) : spot.catLabel;
  const spotMeta = isEn ? `📍 ${convertToEnglishAddress(spot.area, spot.pref)}` : `📍 ${spot.area}${spot.pref ? `（${spot.pref}）` : ''}`;
  
  const title = isEn ? `${spotName} | POPOPO Outing Map` : `${spotName} | POPOPO お出かけマップ`;
  const desc = metaDesc(spot, lang);
  
  const pageUrl = isEn ? `${baseUrl}/spots/en/${spot.id}.html` : `${baseUrl}/spots/${spot.id}.html`;
  const relativeDepth = isEn ? '../..' : '..';
  const logoUrl = isEn ? '../../index.html#hero' : '../index.html#hero';
  
  // Dynamic language toggle link next to nav
  const langToggleHtml = isEn 
    ? `<a href="../${spot.id}.html" class="lang-toggle-btn"><span class="lang-icon">🌐</span> 日本語</a>`
    : `<a href="en/${spot.id}.html" class="lang-toggle-btn"><span class="lang-icon">🌐</span> English</a>`;
  
  const googleMapsUrl = getGoogleMapsUrl(spot);
  const inboundTagsHtml = renderInboundTags(spot, lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isEn ? `${spotName} Outing Recommendation` : `${spotName}のおすすめメモ`,
    description: desc,
    inLanguage: isEn ? 'en' : 'ja',
    url: pageUrl,
    image: `${baseUrl}/assets/social-card-map.png`,
    about: {
      '@type': 'Place',
      name: spotName,
      address: isEn ? convertToEnglishAddress(spot.area, spot.pref) : `${spot.pref} ${spot.area}`,
      url: spot.url
    },
    isPartOf: {
      '@type': 'WebSite',
      name: isEn ? 'POPOPO Outing Map' : 'POPOPO お出かけマップ',
      url: baseUrl
    }
  };

  return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ja'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="author" content="masa0a">
  <link rel="canonical" href="${esc(pageUrl)}">
  
  <!-- Reciprocal alternate hreflang links for robust international SEO -->
  <link rel="alternate" hreflang="ja" href="${esc(`${baseUrl}/spots/${spot.id}.html`)}">
  <link rel="alternate" hreflang="en" href="${esc(`${baseUrl}/spots/en/${spot.id}.html`)}">
  <link rel="alternate" hreflang="x-default" href="${esc(`${baseUrl}/spots/${spot.id}.html`)}">

  <meta property="og:locale" content="${isEn ? 'en_US' : 'ja_JP'}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${isEn ? 'POPOPO Outing Map' : 'POPOPO お出かけマップ'}">
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
  <link rel="icon" type="image/png" sizes="512x512" href="${relativeDepth}/assets/favicon-512.png">
  <link rel="apple-touch-icon" href="${relativeDepth}/assets/apple-touch-icon.png">
  <link rel="stylesheet" href="${relativeDepth}/style.css?v=${lastmod}-1">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="seo-spot-page">
  <nav id="navbar">
    <div class="nav-inner">
      <a href="${logoUrl}" class="nav-logo">
        <span class="logo-main">POPOPO</span>
        <span class="logo-sub">${isEn ? 'Outing Map' : 'お出かけマップ'}</span>
      </a>
      <div class="nav-links" id="navLinks">
        <a href="${relativeDepth}/index.html#spots" class="nav-link">${isEn ? '📍 Recommended Spots' : '📍 おすすめスポット'}</a>
        <a href="${relativeDepth}/index.html#visited" class="nav-link">${isEn ? '💬 Guest Reviews' : '💬 みんなの感想'}</a>
        <a href="${relativeDepth}/index.html#community" class="nav-link">${isEn ? '💬 Free Talk' : '💬 フリートーク掲示板'}</a>
        <a href="${relativeDepth}/about.html" class="nav-link">${isEn ? '🌿 Why This Site' : '🌿 この場所を作った理由'}</a>
        <a href="${relativeDepth}/how-to.html" class="nav-link">${isEn ? '💡 Guide' : '💡 使い方'}</a>
        ${langToggleHtml}
      </div>
    </div>
  </nav>

  <main>
    <section class="seo-spot-hero">
      <div class="container seo-spot-inner">
        <a class="seo-breadcrumb" href="${isEn ? 'index.html' : 'index.html'}">${isEn ? 'Spots Directory' : 'SEOスポット一覧'}</a>
        <p class="guide-kicker">${esc(spot.emoji)} ${esc(spotCatLabel)}</p>
        <h1 class="seo-spot-title">${esc(spotName)}</h1>
        <p class="seo-spot-meta">${esc(spotMeta)}</p>
        ${inboundTagsHtml}
        <p class="seo-spot-lead" style="margin-top: 15px;">${esc(spotMemo)}</p>
        ${spotReview ? `<blockquote class="seo-spot-review">“${esc(spotReview)}”</blockquote>` : ''}
        <div class="seo-spot-actions">
          <a class="btn-primary" href="${relativeDepth}/index.html#spots">${isEn ? 'View on Site' : 'サイトで見る'}</a>
          <a class="btn-outline" href="${esc(spot.url)}" target="_blank" rel="noopener">${isEn ? 'Open Website' : '参考URLを開く'}</a>
          ${googleMapsUrl ? `<a class="btn-outline btn-googlemaps" href="${esc(googleMapsUrl)}" target="_blank" rel="noopener" style="background: rgba(26, 115, 232, 0.06); border-color: rgba(26, 115, 232, 0.4); color: #1a73e8;">🗺️ ${isEn ? 'Open in Google Maps' : 'Google Mapsで開く'}</a>` : ''}
        </div>
      </div>
    </section>

    <section class="guide-section">
      <div class="container seo-spot-content">
        <article class="guide-card seo-spot-note">
          <span class="guide-num">PO</span>
          <h2>${isEn ? "POPOPO Listener's Recommendation" : 'POPOPOリスナーのおすすめポイント'}</h2>
          <p>${esc(spotPoint)}</p>
        </article>
        <article class="guide-card seo-spot-note">
          <span class="guide-num">MAP</span>
          <h2>${isEn ? 'About this page' : 'このページについて'}</h2>
          <p>${isEn 
            ? 'This page is a search-friendly static page designed to organize recommended spots and reviews featured on POPOPO Outing Map. Check the home page for the latest updates, live chats, and community reviews.' 
            : 'このページは、POPOPO お出かけマップに掲載されているおすすめスポットや感想を、検索でも見つけやすいように整理した静的ページです。最新の投稿やみんなの感想はトップページで確認できます。'}</p>
        </article>
      </div>
    </section>
  </main>

  <footer id="siteFooter">
    <div class="footer-inner">
      <div class="footer-logo">
        <span class="logo-main">POPOPO</span>
        <span class="logo-sub">${isEn ? 'Outing Map' : 'お出かけマップ'}</span>
      </div>
      <p class="footer-desc">${isEn ? 'A gentle, word-of-mouth guide for little outings.' : '人から人へ伝わる、ちいさなおお出かけ案内。'}</p>
      <p class="footer-update">${isEn ? `Last Updated: ${lastmod}` : `最終更新：2026年5月20日`}</p>
    </div>
  </footer>
</body>
</html>
`;
}

function indexHtml(lang) {
  const isEn = lang === 'en';
  const relativeDepth = isEn ? '../..' : '..';
  const logoUrl = isEn ? '../../index.html#hero' : '../index.html#hero';
  
  const cards = spots.map(spot => {
    const spotName = isEn ? (SPOT_TRANSLATIONS[spot.id]?.name || spot.name) : spot.name;
    const spotMemo = isEn ? (SPOT_TRANSLATIONS[spot.id]?.memo || spot.memo) : spot.memo;
    const spotArea = isEn ? convertToEnglishAddress(spot.area, spot.pref) : spot.area;
    const spotCatLabel = isEn ? (CAT_LABELS_EN[spot.cat] || spot.catLabel) : spot.catLabel;
    const inboundTagsHtml = renderInboundTags(spot, lang);
    const relPath = `${spot.id}.html`;

    return `
        <a class="guide-card seo-index-card" href="${relPath}">
          <span class="guide-num">${esc(spot.emoji)}</span>
          <h2>${esc(spotName)}</h2>
          <p>${esc(spotArea)} / ${esc(spotCatLabel)}</p>
          ${inboundTagsHtml}
          <p style="margin-top: 8px;">${esc(spotMemo)}</p>
        </a>`;
  }).join('');

  const title = isEn ? 'Spots Directory | POPOPO Outing Map' : 'おすすめスポット一覧 | POPOPO お出かけマップ';
  const desc = isEn 
    ? 'A collection of recommended spots and guest reviews featured on the POPOPO Outing Map, optimized for search engines.' 
    : 'POPOPO お出かけマップのおすすめスポットやみんなの感想を、検索でも見つけやすい静的ページとして整理した一覧です。';
  
  const pageUrl = isEn ? `${baseUrl}/spots/en/` : `${baseUrl}/spots/`;
  
  const langToggleHtml = isEn
    ? `<a href="../index.html" class="lang-toggle-btn"><span class="lang-icon">🌐</span> 日本語</a>`
    : `<a href="en/index.html" class="lang-toggle-btn"><span class="lang-icon">🌐</span> English</a>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: desc,
    url: pageUrl,
    inLanguage: isEn ? 'en' : 'ja',
    isPartOf: {
      '@type': 'WebSite',
      name: isEn ? 'POPOPO Outing Map' : 'POPOPO お出かけマップ',
      url: baseUrl
    }
  };

  return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ja'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${pageUrl}">
  
  <!-- Reciprocal alternate hreflang links for sitemap root directories -->
  <link rel="alternate" hreflang="ja" href="${esc(`${baseUrl}/spots/`)}">
  <link rel="alternate" hreflang="en" href="${esc(`${baseUrl}/spots/en/`)}">
  <link rel="alternate" hreflang="x-default" href="${esc(`${baseUrl}/spots/`)}">

  <meta property="og:locale" content="${isEn ? 'en_US' : 'ja_JP'}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${isEn ? 'POPOPO Outing Map' : 'POPOPO お出かけマップ'}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${baseUrl}/assets/social-card-map.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${baseUrl}/assets/social-card-map.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Outfit:wght@300;400;600;700&family=Yomogi&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" sizes="512x512" href="${relativeDepth}/assets/favicon-512.png">
  <link rel="apple-touch-icon" href="${relativeDepth}/assets/apple-touch-icon.png">
  <link rel="stylesheet" href="${relativeDepth}/style.css?v=${lastmod}-1">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="seo-spot-page">
  <nav id="navbar">
    <div class="nav-inner">
      <a href="${logoUrl}" class="nav-logo">
        <span class="logo-main">POPOPO</span>
        <span class="logo-sub">${isEn ? 'Outing Map' : 'お出かけマップ'}</span>
      </a>
      <div class="nav-links" id="navLinks">
        <a href="${relativeDepth}/index.html#spots" class="nav-link">${isEn ? '📍 Recommended Spots' : '📍 おすすめスポット'}</a>
        <a href="${relativeDepth}/index.html#visited" class="nav-link">${isEn ? '💬 Guest Reviews' : '💬 みんなの感想'}</a>
        <a href="${relativeDepth}/about.html" class="nav-link">${isEn ? '🌿 Why This Site' : '🌿 この場所を作った理由'}</a>
        <a href="${relativeDepth}/how-to.html" class="nav-link">${isEn ? '💡 Guide' : '💡 使い方'}</a>
        ${langToggleHtml}
      </div>
    </div>
  </nav>

  <main>
    <section class="guide-hero seo-index-hero">
      <div class="guide-hero-inner">
        <span class="guide-kicker">${isEn ? 'Pickups for Search' : '検索向けピックアップ'}</span>
        <h1 class="guide-title">${isEn ? 'Spots Directory' : 'おすすめスポット一覧'}</h1>
        <p class="guide-lead">${isEn 
          ? 'We organize recommended spots and reviews from POPOPO listeners with specific place names, areas, and local experiences.' 
          : 'POPOPOリスナーのおすすめや感想の中から、場所名・地域名・体験内容が具体的なものを静的ページとして整理しています。'}</p>
        <div class="guide-actions">
          <a href="${relativeDepth}/index.html#spots" class="btn-primary">${isEn ? 'Browse Map' : 'トップで見る'}</a>
          <a href="${relativeDepth}/index.html#visited" class="btn-outline">${isEn ? 'Guest Reviews' : 'みんなの感想へ'}</a>
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
    ['/spots/en/', lastmod],
    ...spots.map(spot => [`/spots/${spot.id}.html`, lastmod]),
    ...spots.map(spot => [`/spots/en/${spot.id}.html`, lastmod])
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
const spotsEnDir = path.join(spotsDir, 'en');

fs.mkdirSync(spotsDir, { recursive: true });
fs.mkdirSync(spotsEnDir, { recursive: true });

for (const spot of spots) {
  fs.writeFileSync(path.join(spotsDir, `${spot.id}.html`), pageHtml(spot, 'ja'));
  fs.writeFileSync(path.join(spotsEnDir, `${spot.id}.html`), pageHtml(spot, 'en'));
}
fs.writeFileSync(path.join(spotsDir, 'index.html'), indexHtml('ja'));
fs.writeFileSync(path.join(spotsEnDir, 'index.html'), indexHtml('en'));
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemapXml());

console.log(`Generated ${spots.length} Japanese spot pages inside spots/`);
console.log(`Generated ${spots.length} English spot pages inside spots/en/`);
console.log(`Generated spots/index.html and spots/en/index.html`);
console.log(`Generated sitemap.xml`);
