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
  { image: "assets/listener-gallery/listener-art-31.jpg", title: "まったりキャラクター", caption: "絶妙な表情でこちらを見つめる、独特のゆるさが魅力のキャラクタースケッチ。", alt: "まったりした表情のキャラクターのイラスト", type: "art" },
  { 
    image: "assets/listener-gallery/listener-art-32.jpg", 
    title: "POPOPO用語辞典 3", 
    caption: "【ホットマラサダ】の項目が追加された辞典ページ。「辛さは？」という問いかけを「マラサダ」と聞き間違えたエピソードから生まれた言葉です。", 
    alt: "POPOPO用語辞典の『ホットマラサダ』のページ", 
    type: "dict_page", 
    lockAnswer: "TimTam", 
    lockHint: "ある配信者が牛乳の中に落としたお菓子は何でしょうか？" 
  },
  {
    image: "assets/listener-gallery/listener-art-33.jpg",
    title: "こんがりアートなスナック",
    caption: "こんがりきつね色のスナックに、POPOPOのキャラクターが焼き印のように描かれた美味しそうでユニークな作品です。",
    alt: "POPOPOキャラクターのイラストが描かれたスナック作品",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-34.jpg",
    title: "ピンクコーデで森のお散歩",
    caption: "ピンクのPOPOPOシャツに身を包んだお洒落な男の子が、キャラクターと一緒に木漏れ日の森を並んで歩く素敵な一枚。",
    alt: "ピンクの服を着た男の子とキャラクターが森を散歩するイラスト",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-35.jpg",
    title: "朝の商店街とお散歩",
    caption: "どこか懐かしい日本の商店街で、とんかつ定食の看板の前にたたずむ男の子とキャラクター。日常ののどかな空気感が漂います。",
    alt: "とんかつ屋の看板の前にたたずむ男の子とキャラクターのイラスト",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-36.jpg",
    title: "スーパーでの仲直り",
    caption: "スーパーの野菜売り場で、立派なにんじんの袋を手に「ご、ごめんね…」と謝る男の子と、涙ぐむキャラクターの可愛らしい一コマ。",
    alt: "にんじんを持って謝る男の子と涙ぐむキャラクターのイラスト",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-37.jpg",
    title: "お日様のペーパーホルダー",
    caption: "にっこり微笑むお日様のようなキャラクターがトイレットペーパーを優しく支える、実際に使ってみたくなる愛らしい実写風アート作品です。",
    alt: "太陽のキャラクター風デザインのトイレットペーパーホルダー",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-38.jpg",
    title: "ご機嫌なお馬さんスケッチ",
    caption: "にっこり笑う瞳と、きれいに編み込まれたしっぽがチャーミングな、手描きの愛らしいお馬さんキャラクターのスケッチです。",
    alt: "笑顔で編み込みしっぽの馬のキャラクター手描きスケッチ",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-39.jpg",
    title: "キャラクター刺繍のポロシャツ",
    caption: "上質なグリーンのポロシャツの胸元に、POPOPOのキャラクターが精密に刺繍された、スタイリッシュな公式アパレル風のアート作品です。",
    alt: "緑のポロシャツの胸元にキャラクターが刺繍されたアート作品",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-40.jpg",
    title: "確かな『声』の力 ポスター",
    caption: "『視覚のインパクトを越える、確かな「声」の力。』のキャッチコピーと共に、サイバー感溢れる暗い森の中で光るキャラクターたちとMasaさんが描かれたクールな一枚。",
    alt: "光るキャラクターとMasaさんが描かれたサイバー風ポスター作品",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-41.jpg",
    title: "おしゃれボーイのUFOキャッチャー",
    caption: "ピンクのボールや星のクッションがいっぱいに詰まったクレーンゲームの中に、Masaさんのおしゃれボーイフィギュアが並ぶ夢のようなプライズ空間アート。",
    alt: "Masaさんのフィギュアが並ぶUFOキャッチャー風アート作品",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-42.jpg",
    title: "まどろむお馬さんのスケッチ",
    caption: "静かに振り向きながら、どこか優しくまどろんでいるような表情を浮かべるお馬さんキャラクターのシンプルな線画アートです。",
    alt: "静かに振り向く馬のキャラクターの手描きスケッチ",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-43.jpg",
    title: "オージー探検家 MasaTam",
    caption: "オーストラリアの国旗が付いたハットとブーツを履き、バッグを下げた陽気なチョコレートサンドキャラクター『MasaTam』。牛乳に落としたあの人気お菓子をオマージュした最高の一枚です！",
    alt: "ティムタム風のビスケットサンドキャラクターMasaTamのアート作品",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-44.jpg",
    title: "水墨画風 掛け軸アート",
    caption: "穏やかで達観したような表情を浮かべるキャラクターが、掛け軸（かけじく）に水墨画の優しい筆致で描かれた、格調高くも心が和む和風アート作品です。",
    alt: "掛け軸に水墨画調で描かれたキャラクターのアート作品",
    type: "art"
  },
  {
    image: "assets/listener-gallery/listener-art-45.jpg",
    title: "POPOPO用語辞典 4",
    caption: "【検討に検討を重ね、検討を加速する】の項目が追加された辞典ページ。「絶対に嫌である」という強固な拒絶を意味する、味わい深いPOPOPOの言葉です。",
    alt: "POPOPO用語辞典の『検討に検討を重ね、検討を加速する』のページ",
    type: "dict_page",
    lockAnswer: "TimTam",
    lockHint: "ある配信者が牛乳の中に落としたお菓子は何でしょうか？"
  }
];

// currentLanguage and TRANSLATIONS are now managed in scripts/i18n.js

const SPOT_TRANSLATIONS = {
  'lion': {
    name: 'Meikyoku Kissa Lion',
    memo: 'A historic cafe where you can enjoy classical music masterpieces in a serene, church-like atmosphere.'
  },
  'beltz': {
    name: 'BELTZ',
    memo: 'Famous Basque cheesecake shop.'
  },
  'torikatsu': {
    name: 'Torikatsu Chicken',
    memo: 'A popular deep-fried chicken cutlet shop hidden in an alleyway.'
  },
  'hinto': {
    name: 'Hinto',
    memo: 'A popular local noodle and dining spot in Nishinomiya.'
  },
  'comme-chinois': {
    name: 'Comme Chinois',
    memo: 'A highly popular bakery in Kobe offering a vast variety of delicious pastries and bread. Morning croissants are absolutely heavenly!'
  },
  'karayaki': {
    name: 'Kamado-Baked Cuisine Rato Mato (Latorato)',
    memo: 'A cozy kamado-baked cuisine and dining spot.'
  },
  'yugi': {
    name: 'Yugi Shouten',
    memo: 'A Chinese grocery and food court in Ikebukuro. Highly recommended for xiaolongbao, Liangpi, morning congee, and Youtiao!'
  },
  'haidilao': {
    name: 'Haidilao Hotpot',
    memo: 'A globally famous Sichuan hotpot chain with great hospitality.'
  },
  'dennys': {
    name: "Denny's",
    memo: 'Jambalaya and Mala Tang are recommended options at this family restaurant.'
  },
  'manchs': {
    name: "Munch's Burger Shack",
    memo: 'Famous custom-blend beef burgers. Even President Trump dined here!'
  },
  'kameju': {
    name: 'Kameju',
    memo: 'A legendary traditional sweets shop in Asakusa. Famous for its exceptionally fluffy Dorayaki.'
  },
  'kamado-gohan-matsushima': {
    name: 'Kamado Gohan Matsushima',
    memo: 'Located in Ningyocho, accessible directly from Asakusa. Offers delicious, traditional stove-cooked rice lunch sets.'
  },
  'yamaya-ikebukuro': {
    name: 'Hakata Motsunabe Yamaya Ikebukuro',
    memo: 'Great spot for Hakata-style offal hotpot (Motsunabe) and all-you-can-eat spicy cod roe (Mentai) lunch sets.'
  },
  'kura-global-flagship': {
    name: 'Kura Sushi Global Flagship Store',
    memo: 'An entertainment-focused conveyor belt sushi experience. Several flagship locations are available in Tokyo.'
  },
  'saryo-tsujiri-daimaru': {
    name: 'Saryo Tsujiri Daimaru Tokyo',
    memo: 'Directly connected to Tokyo Station. Perfect for rich matcha parfaits and traditional Japanese tea desserts.'
  },
  'leonards-japan': {
    name: "Leonard's Japan",
    memo: 'Enjoy authentic Hawaiian Malasadas in Yokohama. Crispy on the outside, fluffy and sweet on the inside.'
  },
  'shinpachi-shokudo': {
    name: 'Shinpachi Shokudo',
    memo: 'A popular restaurant chain specializing in charcoal-grilled fish sets. Perfect for a quick, healthy Japanese meal.'
  },
  'tokyo-mitaiwara': {
    name: 'Tokyo Mitaiwala',
    memo: 'An Indian sweets cafe in Nishi-Kasai, famous for its unique traditional desserts like Barfi.'
  },
  'rakusho-ramen': {
    name: 'Rakusho Ramen',
    memo: 'A budget-friendly Hakata ramen spot in the heart of Tenjin, Fukuoka. Their curry is also popular.'
  },
  'kusamakura-cafe': {
    name: 'Kusamakura Cafe',
    memo: 'A tranquil cafe in Minato-ku. Cozy lighting, friendly staff, and books make it a relaxing place to unwind.'
  },
  'matsuya-morning': {
    name: 'Matsuya Breakfast',
    memo: 'Affordable and filling traditional Japanese breakfast sets served until 11:00 AM nationwide.'
  },
  'sanin-gyokai-chuka-soba': {
    name: 'Sanin Gyokai Chuka Soba',
    memo: 'Located in a residential area of Nerima. Known for its rich shijimi clam broth ramen with an eye-catching presentation.'
  },
  'frijoles-yaesu': {
    name: 'Frijoles Tokyo Midtown Yaesu',
    memo: 'Hearty, fresh burritos loaded with proteins and vegetables. Perfect for a quick and healthy meal.'
  },
  'oyama-milk-no-sato': {
    name: 'Daisen Makiba Milk no Sato',
    memo: 'The official concept shop for the famous Shirobara Milk brand, offering fresh soft-serve ice cream and Tottori dairy products.'
  },
  'ramen-otama': {
    name: 'Ramen Otama',
    memo: 'A local favorite in Yonago, Tottori, serving savory beef bone broth (Gyukotsu) ramen.'
  },
  'mohinga': {
    name: 'Mohinga (Myanmar Cuisine)',
    memo: "Myanmar's famous national dish of rice noodles in a rich, savory fish broth. Find it in Takadanobaba."
  },
  '400do-pizza': {
    name: '400 Degree Pizza',
    memo: 'An extremely popular artisanal pizza parlor in Hiroshima and Okayama, recently featured on popular media.'
  },
  'yamatane': {
    name: 'Yamatane Museum of Art',
    memo: 'A beautiful museum in Shibuya specializing in traditional Nihonga (Japanese-style paintings).'
  },
  'nmwa': {
    name: 'National Museum of Western Art',
    memo: 'Located in Ueno, housed in a magnificent building designed by the legendary architect Le Corbusier (World Heritage).'
  },
  'edo': {
    name: 'Edo-Tokyo Museum',
    memo: 'Experience the fascinating history and culture of Edo (old Tokyo) and modern Tokyo through full-scale replicas.'
  },
  'hokusai': {
    name: 'The Sumida Hokusai Museum',
    memo: 'Dedicated to the world-renowned Ukiyo-e master Katsushika Hokusai, exhibiting many of his iconic works.'
  },
  'ota-memorial-museum': {
    name: 'Ota Memorial Museum of Art',
    memo: 'A lovely museum in Harajuku dedicated exclusively to traditional Ukiyo-e woodblock prints.'
  },
  'japan-coast-guard-museum-yokohama': {
    name: 'Japan Coast Guard Museum Yokohama',
    memo: 'Free museum showcasing patrol vessels and informative exhibits about maritime safety.'
  },
  'queen-hiroba-yokohama-customs': {
    name: 'Queen\'s Plaza Yokohama Customs Museum',
    memo: 'A free museum showcasing Yokohama Customs history, including historic anti-smuggling exhibits.'
  },
  'yoyogi': {
    name: 'Yoyogi Park Events',
    memo: 'A spacious city park hosting various international cultural festivals and lively weekend events.'
  },
  'kagurazaka-machibutai-2026': {
    name: 'Kagurazaka Machibutai Oedo Meguri 2026',
    memo: 'A vibrant traditional arts festival held across the atmospheric streets of Kagurazaka in mid-May.'
  },
  'ikebukuro-jazz-festival': {
    name: 'Ikebukuro Jazz Festival',
    memo: 'An open-air jazz event across Ikebukuro. Drop by for free while strolling around the neighborhood.'
  },
  'thai-festival-tokyo': {
    name: 'Thai Festival Tokyo',
    memo: 'A highly popular annual event in Yoyogi Park celebrating authentic Thai food, music, and cultural performances.'
  },
  'lafollejournee-tokyo-2026': {
    name: 'La Folle Journee TOKYO 2026',
    memo: 'A lively classical music festival at Tokyo International Forum featuring affordable short concerts and food stalls.'
  },
  'niconico-chokaigi': {
    name: 'Niconico Chokaigi',
    memo: 'Japan\'s massive pop-culture convention in Makuhari, uniting internet culture, gaming, and traditional arts.'
  },
  'inokashira': {
    name: 'Inokashira Park',
    memo: 'A lush, serene park in Musashino/Mitaka. Perfect for calming strolls, swan boat rides, and relaxing among trees.'
  },
  'koishikawa-korakuen': {
    name: 'Koishikawa Korakuen Garden',
    memo: 'A historic, tranquil Japanese garden near Tokyo Dome. A perfect hidden retreat to experience seasonal nature.'
  },
  'sample-yasashii-ueno-park': {
    name: 'Ueno Park',
    memo: '[Sample] A central Tokyo park with accessible restroom information available on public accessibility guides. Easy to pair with museums and short walks, but check the latest route details before visiting.'
  },
  'sample-yasashii-tennoji-park': {
    name: 'Tenshiba, Tennoji Park',
    memo: '[Sample] A spacious park entrance area near major stations in Osaka, with official information on nursing rooms, accessible restrooms, elevators, and escalators.'
  },
  'sample-yasashii-oasis21': {
    name: 'Oasis 21',
    memo: '[Sample] A Nagoya landmark directly connected to Sakae Station, with elevators, escalators, rest areas, accessible restrooms, and a nursing room noted on the official site.'
  },
  'sample-yasashii-odori-park': {
    name: 'Odori Park',
    memo: '[Sample] A central Sapporo park where accessible water fountains, wheelchair rental, and accessible restrooms are listed in the official park guide.'
  },
  'sample-yasashii-fukuoka-art-museum': {
    name: 'Fukuoka Art Museum',
    memo: '[Sample] A museum beside Ohori Park with slopes at entrances, wheelchair rental, accessible restrooms, and nursing room information listed on the official accessibility page.'
  },
  'tsutaya': {
    name: 'Daikanyama T-Site (Tsutaya Books)',
    memo: 'A beautifully designed lifestyle bookstore offering books, cafes, and creative inspiration.'
  },
  'kakimori': {
    name: 'Kakimori Kuramae',
    memo: 'A renowned stationery shop in Kuramae where you can design and craft your own custom notebook.'
  },
  'shibuyasky': {
    name: 'SHIBUYA SKY',
    memo: 'A breathtaking open-air observation deck on the roof of Shibuya Scramble Square, offering panoramic views of Tokyo.'
  },
  'kasai-rinkai-crystal-view': {
    name: 'Kasai Rinkai Park Crystal View',
    memo: 'A stunning, minimalist glass structure overlooking Tokyo Bay inside Kasai Rinkai Park. Free admission.'
  },
  'kogane': {
    name: 'Koganeyu',
    memo: 'A chic, modern public bath (Sento) in Sumida-ku, famous for its craft beer bar and designer sauna room.'
  },
  'aagan': {
    name: 'Aagan',
    memo: 'A Nepalese/Newari restaurant in Okubo, Shinjuku. Highly praised for delicious, authentic flavors and generous portions.'
  },
  'rosetsu': {
    name: 'Fuchu Art Museum — Nagasawa Rosetsu Exhibition',
    memo: 'An exhibition showing the cute origin of Japanese art and the dynamic brushstrokes of Nagasawa Rosetsu.'
  },
  'tokin': {
    name: 'Yakitori Tokin',
    memo: 'A casual izakaya specializing in charcoal-grilled Yakitori using premium Date chickens, open until 5 AM.'
  }
};

const ADDRESS_TRANSLATION_MAP = {
  // Regions
  '関東': 'Kanto',
  '関西': 'Kansai',
  '中国': 'Chugoku',
  '九州': 'Kyushu',
  '中部': 'Chubu',
  '東北': 'Tohoku',
  '四国': 'Shikoku',
  '北海道': 'Hokkaido',
  '沖縄': 'Okinawa',

  // Prefectures & Areas
  '青森': 'Aomori',
  '岩手': 'Iwate',
  '宮城': 'Miyagi',
  '秋田': 'Akita',
  '山形': 'Yamagata',
  '福島': 'Fukushima',
  '茨城': 'Ibaraki',
  '栃木': 'Tochigi',
  '群馬': 'Gunma',
  '埼玉': 'Saitama',
  '千葉': 'Chiba',
  '東京': 'Tokyo',
  '神奈川': 'Kanagawa',
  '新潟': 'Niigata',
  '富山': 'Toyama',
  '石川': 'Ishikawa',
  '福井': 'Fukui',
  '山梨': 'Yamanashi',
  '長野': 'Nagano',
  '岐阜': 'Gifu',
  '静岡': 'Shizuoka',
  '愛知': 'Aichi',
  '三重': 'Mie',
  '滋賀': 'Shiga',
  '京都': 'Kyoto',
  '大阪': 'Osaka',
  '兵庫': 'Hyogo',
  '奈良': 'Nara',
  '和歌山': 'Wakayama',
  '鳥取': 'Tottori',
  '島根': 'Shimane',
  '岡山': 'Okayama',
  '広島': 'Hiroshima',
  '山口': 'Yamaguchi',
  '徳島': 'Tokushima',
  '香川': 'Kagawa',
  '愛媛': 'Ehime',
  '高知': 'Kochi',
  '福岡': 'Fukuoka',
  '佐賀': 'Saga',
  '長崎': 'Nagasaki',
  '熊本': 'Kumamoto',
  '大分': 'Oita',
  '宮崎': 'Miyazaki',
  '鹿児島': 'Kagoshima',
  '全国': 'Japan Nationwide',
  'オンライン': 'Online',

  // Weather Specific Cities (that might differ or are specific names)
  '札幌': 'Sapporo',
  '仙台': 'Sendai',
  '水戸': 'Mito',
  '宇都宮': 'Utsunomiya',
  '前橋': 'Maebashi',
  'さいたま': 'Saitama',
  '横浜': 'Yokohama',
  '金沢': 'Kanazawa',
  '甲府': 'Kofu',
  '名古屋': 'Nagoya',
  '津': 'Tsu',
  '大津': 'Otsu',
  '神戸': 'Kobe',
  '松江': 'Matsue',
  '高松': 'Takamatsu',
  '松山': 'Matsuyama',
  '那覇': 'Naha',

  // Sub-regions / Wards / Cities
  '千代田区': 'Chiyoda-ku',
  '中央区': 'Chuo-ku',
  '港区': 'Minato-ku',
  '新宿区': 'Shinjuku-ku',
  '文京区': 'Bunkyo-ku',
  '台東区': 'Taito-ku',
  '墨田区': 'Sumida-ku',
  '江東区': 'Koto-ku',
  '品川区': 'Shinagawa-ku',
  '目黒区': 'Meguro-ku',
  '大田区': 'Ota-ku',
  '世田谷区': 'Setagaya-ku',
  '渋谷区': 'Shibuya-ku',
  '中野区': 'Nakano-ku',
  '杉並区': 'Suginami-ku',
  '豊島区': 'Toshima-ku',
  '北区': 'Kita-ku',
  '荒川区': 'Arakawa-ku',
  '板橋区': 'Itabashi-ku',
  '練馬区': 'Nerima-ku',
  '足立区': 'Adachi-ku',
  '葛飾区': 'Katsushika-ku',
  '江戸川区': 'Edogawa-ku',
  '八王子市': 'Hachioji',
  '立川市': 'Tachikawa',
  '武蔵野市': 'Musashino',
  '三鷹市': 'Mitaka',
  '府中市': 'Fuchu',
  '調布市': 'Chofu',
  '町田市': 'Machida',
  '小金井市': 'Koganei',
  '国立市': 'Kunitachi',
  '多摩市': 'Tama',
  '横浜市': 'Yokohama',
  '川崎市': 'Kawasaki',
  '鎌倉市': 'Kamakura',
  '藤沢市': 'Fujisawa',
  '横須賀市': 'Yokosuka',
  '小田原市': 'Odawara',
  '相模原市': 'Sagamihara',
  '神戸市': 'Kobe',
  '西宮市': 'Nishinomiya',
  '姫路市': 'Himeji',
  '尼崎市': 'Amagasaki',
  '芦屋市': 'Ashiya',
  '千葉市': 'Chiba',
  '浦安市': 'Urayasu',
  '船橋市': 'Funabashi',
  '市川市': 'Ichikawa',
  '広島市': 'Hiroshima',
  '尾道市': 'Onomichi',
  '廿日市市': 'Hatsukaichi',
  '福山市': 'Fukuyama',
  '岡山市': 'Okayama',
  '倉敷市': 'Kurashiki',
  '鳥取市': 'Tottori',
  '米子市': 'Yonago',
  '大山町': 'Daisen',
  '札幌市': 'Sapporo',
  '名古屋市': 'Nagoya',
  '大阪市': 'Osaka',
  '堺市': 'Sakai',
  '豊中市': 'Toyonaka',
  '吹田市': 'Suita',
  '京都市': 'Kyoto',
  '宇治市': 'Uji',
  '福岡市': 'Fukuoka',
  '北九州市': 'Kitakyushu',

  // Custom static spot sub-regions
  '道玄坂': 'Dogenzaka, Shibuya',
  '渋谷・広尾': 'Shibuya / Hiroo',
  '兵庫県西宮市': 'Nishinomiya, Hyogo',
  '神戸・三宮': 'Sannomiya, Kobe',
  '新宿区百人町': 'Hyakunincho, Shinjuku-ku',
  '池袋': 'Ikebukuro',
  '港区芝': 'Shiba, Minato-ku',
  '浅草': 'Asakusa',
  '人形町': 'Ningyocho',
  '池袋・東池袋': 'Ikebukuro / Higashi-Ikebukuro',
  '銀座・原宿・浅草ROX・押上など': 'Ginza / Harajuku / Asakusa / Oshiage',
  '東京駅・大丸東京店': 'Tokyo Station / Daimaru Tokyo',
  '横浜ワールドポーターズ': 'Yokohama World Porters',
  '東京ほか': 'Tokyo and others',
  '西葛西': 'Nishi-Kasai',
  '福岡市中央区天神': 'Tenjin, Chuo-ku, Fukuoka',
  '東京都練馬区': 'Nerima-ku, Tokyo',
  '東京ミッドタウン八重洲': 'Tokyo Midtown Yaesu',
  '鳥取・大山': 'Daisen, Tottori',
  '鳥取・米子': 'Yonago, Tottori',
  '高田馬場など': 'Takadanobaba and others',
  '広島・岡山': 'Hiroshima / Okayama',
  '原宿': 'Harajuku',
  '代々木公園': 'Yoyogi Park',
  '神楽坂エリア': 'Kagurazaka Area',
  '東京国際フォーラム': 'Tokyo International Forum',
  '幕張': 'Makuhari',
  '武蔵野市・三鷹市': 'Musashino / Mitaka',
  '文京区後楽': 'Koraku, Bunkyo-ku',
  '上野': 'Ueno',
  '大阪市天王寺区': 'Tennoji-ku, Osaka',
  '名古屋・栄': 'Sakae, Nagoya',
  '札幌・大通': 'Odori, Sapporo',
  '福岡市中央区大濠公園': 'Ohori Park, Chuo-ku, Fukuoka',
  '代官山': 'Daikanyama',
  '蔵前': 'Kuramae',
  '渋谷': 'Shibuya',
  'Amazon Prime Video': 'Amazon Prime Video',
  'NHK': 'NHK',
  '新宿区大久保': 'Okubo, Shinjuku'
};

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

function getGoogleMapsUrl(s) {
  let coords = null;
  if (SPOT_COORDINATES[s.id]) {
    coords = SPOT_COORDINATES[s.id];
  } else {
    const matchedStaticSpot = findStaticSpotByName(s.name);
    if (matchedStaticSpot && SPOT_COORDINATES[matchedStaticSpot.id]) {
      coords = SPOT_COORDINATES[matchedStaticSpot.id];
    }
  }

  if (!coords) {
    coords = getLandmarkCoordsForSpot(s);
  }

  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  }
  const query = encodeURIComponent(`${s.name} ${s.pref || ''} ${s.area || ''}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function renderInboundTags(s, lang) {
  let html = '';
  const isEn = lang === 'en';
  if (s.traditional) {
    html += `<span class="inbound-tag inbound-tag--traditional">${isEn ? '⛩️ Traditional Japan' : '⛩️ 日本の伝統・文化'}</span>`;
  }
  return html ? `<div class="inbound-tags-container" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">${html}</div>` : '';
}

async function fetchTranslation(text, targetLang = 'en') {
  const sourceText = String(text || '').trim();
  if (!sourceText) return '';
  const cacheKey = `popopo_translation_${targetLang}_${hashString(sourceText)}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {
    // localStorageが使えない環境ではキャッシュなしで続行
  }

  const maxRetries = 2;
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
      const res = await fetch(url);
      if (res.status === 429) {
        attempt++;
        if (attempt <= maxRetries) {
          console.warn(`Translation rate limited (429). Retrying attempt ${attempt}...`);
          await new Promise(r => setTimeout(r, 1000 * attempt));
          continue;
        }
      }
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data && data[0]) {
        const translated = data[0].map(s => s[0]).join('');
        try {
          localStorage.setItem(cacheKey, translated);
        } catch (e) {
          // ignore
        }
        return translated;
      }
      throw new Error('Invalid translation format');
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) {
        console.error('Translation error after retries:', err);
        return null;
      }
      console.warn(`Translation failed: ${err.message}. Retrying...`);
      await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }
  return null;
}


// 投稿時に1回だけ呼ばれ、日本語を含むフィールドだけを英訳して返す。
// 失敗してもスローせず、取れた分だけ返す（表示側にライブ翻訳のフォールバックがある）。
const JAPANESE_RE = new RegExp('[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]');
async function translateFieldsToEnglish(fields = {}) {
  const out = {};
  for (const key of Object.keys(fields)) {
    const text = String(fields[key] || '').trim();
    if (!text) continue;
    if (!JAPANESE_RE.test(text)) continue; // 日本語を含まないものは翻訳不要
    try {
      const translated = await fetchTranslation(text, 'en');
      if (translated && translated.trim() && translated.trim() !== text) {
        out[key] = translated;
      }
    } catch (e) {
      // 1フィールド失敗しても他は続行。未設定のままなら表示側がライブ翻訳にフォールバック。
    }
  }
  return out;
}

window.toggleTranslation = async function(btn) {
  const container = btn.closest('.visited-card-body, .spot-review-card, .chat-content, .spot-card-info');
  if (!container) return;

  let translatedBox = container.querySelector('.translated-box');
  if (translatedBox) {
    translatedBox.remove();
    const originalText = btn.dataset.translateText || '';
    let label = '🌐 翻訳する';
    if (currentLanguage === 'en') {
      label = '🌐 Show English';
    } else {
      const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(originalText);
      label = hasJapanese ? '🌐 Translate to English' : '🌐 翻訳する';
    }
    btn.innerHTML = label;
    return;
  }

  const originalText = btn.dataset.translateText || '';
  if (!originalText) return;

  btn.disabled = true;
  const originalLabel = btn.innerHTML;
  
  let targetLang = currentLanguage;
  let loadingText = '翻訳中...';
  if (currentLanguage === 'en') {
    loadingText = 'Translating...';
  } else {
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(originalText);
    if (hasJapanese) {
      targetLang = 'en';
      loadingText = 'Translating...';
    } else {
      targetLang = 'ja';
      loadingText = '翻訳中...';
    }
  }

  btn.innerHTML = `<span class="translation-loading"></span> ${loadingText}`;

  const translated = await fetchTranslation(originalText, targetLang);

  btn.disabled = false;
  if (translated) {
    translatedBox = document.createElement('div');
    translatedBox.className = 'translated-box';
    translatedBox.textContent = translated;
    
    const reviewEl = container.querySelector('.visited-review, .spot-review-comment, .chat-msg');
    if (reviewEl) {
      reviewEl.after(translatedBox);
    } else {
      container.appendChild(translatedBox);
    }
    
    let revertLabel = '🌐 原文を表示';
    if (currentLanguage === 'en' || targetLang === 'en') {
      revertLabel = '🌐 Show Original';
    }
    btn.innerHTML = revertLabel;
  } else {
    btn.innerHTML = originalLabel;
    if (btn.dataset.autoTranslate !== 'true') {
      alert(currentLanguage === 'en' ? 'Translation failed. Please try again.' : '翻訳に失敗しました。もう一度お試しください。');
    }
  }
};

function renderTranslationButton(text) {
  if (!text) return '';
  let label = '';
  if (currentLanguage === 'en') {
    label = '🌐 Show English';
  } else {
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    label = hasJapanese ? '🌐 Translate to English' : '🌐 翻訳する';
  }
  return `
    <div class="translate-btn-container">
      <button class="translate-btn" data-translate-text="${escHtml(text)}" onclick="toggleTranslation(this)">
        ${label}
      </button>
    </div>
  `;
}

let autoTranslateTimer = null;
let autoTranslationRunning = false;

function queueAutoTranslateVisibleContent() {
  if (currentLanguage !== 'en') return;
  window.clearTimeout(autoTranslateTimer);
  autoTranslateTimer = window.setTimeout(autoTranslateVisibleContent, 220);
}

async function autoTranslateVisibleContent() {
  if (currentLanguage !== 'en' || autoTranslationRunning) return;
  autoTranslationRunning = true;
  const btns = Array.from(document.querySelectorAll('.translate-btn'))
    .filter(btn => {
      const container = btn.closest('.visited-card-body, .spot-review-card, .chat-content, .spot-card-info');
      return container && !container.querySelector('.translated-box');
    })
    .slice(0, 15);

  for (const btn of btns) {
    btn.dataset.autoTranslate = 'true';
    await toggleTranslation(btn);
    delete btn.dataset.autoTranslate;
    await new Promise(r => setTimeout(r, 380));
  }
  autoTranslationRunning = false;
}


document.addEventListener('languageChanged', (e) => {
  const lang = e.detail.lang;
  
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.placeholder = lang === 'en' 
      ? 'Share your thoughts, suggestions, or comments here...' 
      : 'ここに感想やお題へのつぶやきを書いてね...';
  }
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = lang === 'en'
      ? 'Search spots, areas, or keywords...'
      : 'スポット名、エリア、キーワードで検索...';
  }

  const activeTab = document.querySelector('.tab.active');
  renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
  updateCarrotGuide();
  if (typeof allPosts !== 'undefined') {
    renderVisited(allPosts);
  }

  if (lang === 'en') {
    queueAutoTranslateVisibleContent();
  }
  renderMapOnlinePanel();

  // Clear weather cache and re-render weather immediately
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i);
    if (key && (key.startsWith('popopo_weather_cache_') || key.startsWith('popopo_weather_alert_'))) {
      sessionStorage.removeItem(key);
    }
  }
  renderWeather();
});

// ============================================================
// 3. スポットデータ
// ============================================================
const SPOTS = [
  // --- 飲食店 ---
  { id: 'lion', cat: 'food', emoji: '☕', name: '名曲喫茶ライオン', area: '道玄坂', pref: '東京', url: 'https://tabelog.com/tokyo/A1303/A130301/13001723/', memo: '名曲を聴きながら楽しめる喫茶店', traditional: true },
  { id: 'beltz', cat: 'food', emoji: '🍽️', name: 'BELTZ', area: '渋谷・広尾', pref: '東京', url: 'https://beltztokyo.stores.jp/', memo: '' },
  { id: 'torikatsu', cat: 'food', emoji: '🍗', name: 'とりかつ', area: '道玄坂', pref: '東京', url: 'https://tabelog.com/tokyo/A1303/A130301/13001699/', memo: '' },
  { id: 'hinto', cat: 'food', emoji: '🍜', name: '貧頭', area: '兵庫県西宮市', pref: '兵庫', url: 'https://tabelog.com/hyogo/A2803/A280301/28000906/', memo: '' },
  { 
    id: 'comme-chinois', cat: 'food', emoji: '🥐', name: 'Comme Chinois（コム・シノワ）', area: '神戸・三宮', pref: '兵庫', 
    url: 'https://www.comme-chinois.com/', 
    memo: 'あらゆるジャンルのパンが揃う神戸の人気店。モーニングのクロワッサンは感動の美味しさです！',
    suggested: true, suggestedBy: 'パンダ🐼',
    vegan: true, card: true
  },
  { id: 'karayaki', cat: 'food', emoji: '🍕', name: '窯焼き料理 Rato Mato（ラトマト）', area: '新宿区百人町', pref: '東京', url: 'https://tabelog.com/tokyo/A1304/A130404/13263740/', memo: '' },
  {
    id: 'yugi', cat: 'food', emoji: '🥟', name: '友誼商店', area: '池袋', pref: '東京',
    url: 'https://tabelog.com/tokyo/A1305/A130501/13235881/',
    memo: '小籠包・涼皮（りゃんぴー）・朝はお粥・油条（ヨウティヤオ）がおすすめ！'
  },
  { id: 'haidilao', cat: 'food', emoji: '🫕', name: 'ハイディーラオ', area: '全国', pref: '全国', url: 'https://www.haidilao.com/jp/', memo: '人気の四川火鍋チェーン' },
  { id: 'dennys', cat: 'food', emoji: '☕', name: 'デニーズ', area: '全国', pref: '全国', url: 'https://www.dennys.jp', memo: 'ジャンバラヤ・麻辣湯がおすすめ' },
  { id: 'manchs', cat: 'food', emoji: '🍔', name: "マンチズバーガー", area: '港区芝', pref: '東京', url: 'https://tabelog.com/tokyo/A1314/A131401/13121856/', memo: 'あのトラちゃんも食べた！' },
  { id: 'kameju', cat: 'food', emoji: '🍡', name: '亀十', area: '浅草', pref: '東京', url: 'https://tabelog.com/tokyo/A1311/A131102/13003655/', memo: '浅草の老舗和菓子店。どら焼きや和菓子好きの寄り道候補。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'kamado-gohan-matsushima', cat: 'food', emoji: '🍚', name: '竈門ご飯 松しま', area: '人形町', pref: '東京', url: 'https://tabelog.com/tokyo/A1302/A130204/13319779/', memo: '浅草から都営浅草線で乗り換えなし。開店したばかりで、ランチがお得で美味しいとのリスナー推薦。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'yamaya-ikebukuro', cat: 'food', emoji: '🍲', name: '博多もつ鍋 やまや 池袋店', area: '池袋・東池袋', pref: '東京', url: 'https://tabelog.com/tokyo/A1305/A130501/13164146/dtlrvwlst/', memo: '明太子やもつ鍋、ランチ定食の候補。池袋方面のお出かけメモとして。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'kura-global-flagship', cat: 'food', emoji: '🍣', name: 'くら寿司 グローバル旗艦店', area: '銀座・原宿・浅草ROX・押上など', pref: '東京', url: 'https://www.kurasushi.co.jp/global_flagship/', memo: 'いつもの回転寿司に、少しエンタメ感を足したい時の候補。都内に複数のグローバル旗艦店があります。', suggested: true, suggestedBy: '匿名リスナー', card: true, wifi: true },
  { id: 'saryo-tsujiri-daimaru', cat: 'food', emoji: '🍵', name: '茶寮都路里 大丸東京店', area: '東京駅・大丸東京店', pref: '東京', url: 'https://www.giontsujiri.co.jp/store/tokyo-daimaru/', memo: '東京駅直結で立ち寄りやすい、抹茶や甘味の休憩スポット。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'leonards-japan', cat: 'food', emoji: '🍩', name: "Leonard's Japan", area: '横浜ワールドポーターズ', pref: '神奈川', url: 'https://leonardsjapan.com/about-2/', memo: 'ハワイのマラサダを横浜で。外はサクッと、中はもちもちの甘い寄り道候補。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'shinpachi-shokudo', cat: 'food', emoji: '🐟', name: '炭火焼干物定食 しんぱち食堂', area: '東京ほか', pref: '全国', url: 'https://www.shinpachi-shokudo.com/', memo: '焼き魚とごはん、味噌汁の定食を気軽に食べたい時に。朝・昼・夜の候補にしやすいお店。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'tokyo-mitaiwara', cat: 'food', emoji: '🍬', name: 'トウキョウ ミタイワラ', area: '西葛西', pref: '東京', url: 'https://share.google/a4XiQFxBsCeCI5B6c', memo: '不思議な甘さ of インドスイーツのお店。バルフィがおすすめとして投稿されています。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'rakusho-ramen', cat: 'food', emoji: '🍜', name: '楽勝ラーメン', area: '福岡市中央区天神', pref: '福岡', url: 'https://tabelog.com/fukuoka/A4001/A400103/40006293/', memo: '福岡市の繁華街中心部にあり、手頃な価格でラーメンを食べられるお店。カレーも美味しいとの投稿があります。', suggested: true, suggestedBy: '匿名リスナー' },
  {
    id: 'tokin',
    cat: 'food',
    emoji: '🍗',
    name: '焼鳥 と金',
    area: '福岡・今泉',
    pref: '福岡',
    url: 'https://tabelog.com/fukuoka/A4001/A400103/40045437/',
    memo: '銘柄鶏「伊達鶏」を使用した炭火焼き鳥が楽しめる大衆酒場。朝5時まで営業しています。',
    suggested: true,
    suggestedBy: '匿名リスナー'
  },
  { id: 'kusamakura-cafe', cat: 'food', emoji: '☕', name: '草枕', area: '港区', pref: '東京', url: 'https://tabelog.com/tokyo/A1301/A130103/13043012/', memo: 'オフィス街にある落ち着いたカフェ。照明、丁寧な接客、本のある空間が心地よい場所として投稿されています。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'matsuya-morning', cat: 'food', emoji: '🍚', name: '松屋のモーニング', area: '全国', pref: '全国', url: 'https://www.matsuyafoods.co.jp/matsuya/menu/morning/index.html', memo: '11時まで利用できる朝ごはんメニュー。早めのランチとしても使いやすく、選べる小鉢やコスパの良さが魅力です。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'sanin-gyokai-chuka-soba', cat: 'food', emoji: '🐚', name: '山陰魚介中華蕎麦', area: '東京都練馬区', pref: '東京', url: 'https://tabelog.com/tokyo/A1321/A132102/13300394/', memo: '練馬の住宅街にあるラーメン店。大量のしじみが入った斬新な見た目と、濃厚なしじみの旨味が広がるスープが印象的です。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'frijoles-yaesu', cat: 'food', emoji: '🌯', name: 'フリホーレス 東京ミッドタウン八重洲店', area: '東京ミッドタウン八重洲', pref: '東京', url: 'https://tabelog.com/tokyo/A1302/A130201/13276542/', memo: 'ボリューム満点のブリトーで、タンパク質・野菜・炭水化物をバランスよく摂れるお店。時短と健康を両立したい時の候補です。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'oyama-milk-no-sato', cat: 'food', emoji: '🍦', name: '大山まきばのみるくの里', area: '鳥取・大山', pref: '鳥取', url: 'https://dainyu.or.jp/village-of-milk/', memo: '白バラ牛乳ブランド初の公式コンセプトショップ。白バラ商品やグッズ、ソフトクリームを楽しめる鳥取・大山のスポットです。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'ramen-otama', cat: 'food', emoji: '🍜', name: 'ラーメンおたま', area: '鳥取・米子', pref: '鳥取', url: 'https://share.google/FSaSRer3XmzgQmbAs', memo: '鳥取県米子市で牛骨ラーメンを楽しめるお店。透き通ったスープと独特の甘み、コクが特徴です。', suggested: true, suggestedBy: '匿名リスナー' },
  // --- 食べたいもの ---
  { id: 'mohinga', cat: 'mohinga', emoji: '🍜', name: 'モヒンガー（ミャンマー料理）', area: '高田馬場など', pref: '東京', url: 'https://otonano-shumatsu.com/articles/488762', memo: 'ミャンマーの国民食！ぜひ食べたい。詳しくはリンク先から。' },
  { 
    id: '400do-pizza', cat: 'mohinga', emoji: '🍕', name: '400℃ Pizza', area: '広島・岡山', pref: '広島', 
    url: 'https://400do-pizza.com/', 
    memo: 'YouTube「よにのちゃんねる」で紹介された超人気ピザ店。広島にもオープンした話題のスポットです！\n参考：https://youtu.be/2PXvrvf5sL0?si=twirQRWCQy-sGiYW',
    suggested: true, suggestedBy: 'パンダ🐼' 
  },
  // --- 美術館・博物館 ---
  { id: 'yamatane', cat: 'museum', emoji: '🎨', name: '山種美術館', area: '渋谷・広尾', pref: '東京', url: 'https://www.yamatane-museum.jp/', memo: '日本画専門の美術館' },
  { id: 'nmwa', cat: 'museum', emoji: '🏛️', name: '国立西洋美術館', area: '上野', pref: '東京', url: 'https://www.nmwa.go.jp/jp/', memo: 'ル・コルビュジエ設計の世界遺産建築' },
  { id: 'edo', cat: 'museum', emoji: '🗼', name: '江戸東京博物館', area: '墨田区', pref: '東京', url: 'https://www.edo-tokyo-museum.or.jp/', memo: '江戸〜東京の歴史を体感できる', traditional: true },
  { id: 'hokusai', cat: 'museum', emoji: '🌊', name: 'すみだ北斎美術館', area: '墨田区', pref: '東京', url: 'https://hokusai-museum.jp/', memo: '葛飾北斎 of 作品を多数展示', traditional: true },
  { id: 'ota-memorial-museum', cat: 'museum', emoji: '🖼️', name: '太田記念美術館', area: '原宿', pref: '東京', url: 'https://www.ukiyoe-ota-muse.jp/', memo: '原宿にある浮世絵専門の美術館。浮世絵をたくさん見られる場所として投稿されています。', suggested: true, suggestedBy: '匿名リスナー', traditional: true },
  { id: 'japan-coast-guard-museum-yokohama', cat: 'museum', emoji: '🚢', name: '海上保安資料館横浜館', area: '横浜', pref: '神奈川', url: 'https://share.google/OR8sP7aiI4xg6s26C', memo: '工作船や押収された武器などを見られる、入館無料の資料館。展示の迫力が印象的だったという投稿があります。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'queen-hiroba-yokohama-customs', cat: 'museum', emoji: '🏛️', name: 'クイーンのひろば', area: '横浜', pref: '神奈川', url: 'https://share.google/ynCJht8MwoGxLxyn2', memo: '横浜税関の博物館。入館無料で、密輸の手口などを知ることができる展示があります。', suggested: true, suggestedBy: '匿名リスナー' },
  // --- イベント ---
  { id: 'yoyogi', cat: 'event', emoji: '🌿', name: '代々木公園 イベント', area: '代々木公園', pref: '東京', url: 'https://www.yoyogikoen.info/', memo: 'さまざまなイベントが開催される都心の公園' },
  { id: 'kagurazaka-machibutai-2026', cat: 'event', emoji: '🎭', name: '神楽坂まち舞台・大江戸めぐり2026', area: '神楽坂エリア', pref: '東京', url: 'https://kaguramachi.jp/', memo: '2026年5月16日（土）・17日（日）開催予定。神楽坂の街全体で伝統芸能を楽しめるフェスティバル。', suggested: true, suggestedBy: '匿名リスナー', traditional: true },
  { id: 'ikebukuro-jazz-festival', cat: 'event', emoji: '🎺', name: '池袋ジャズフェスティバル', area: '池袋', pref: '東京', url: 'https://www.ikebukurojazz.com/', memo: '池袋の街なかで音楽が聴こえてくる、無料でふらっと立ち寄れるジャズイベント。カフェ巡りや散歩の途中にも楽しめる、やさしい空気のフェスです。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'thai-festival-tokyo', cat: 'event', emoji: '🇹🇭', name: 'タイフェスティバル東京', area: '代々木公園', pref: '東京', url: 'https://thaifes.jp/', memo: '代々木公園で開催される、タイの食・音楽・文化を楽しめる人気イベント。東京にいながらタイ旅行のような気分を味わえる場所です。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'lafollejournee-tokyo-2026', cat: 'event', emoji: '🎻', name: 'ラフォルジュルネTOKYO2026', area: '東京国際フォーラム', pref: '東京', url: 'https://www.lfj.jp/lfj_2026/guide/pdf/lfj2026_timetable_0424.pdf', memo: '東京国際フォーラムで開催されるクラシック音楽祭。無料エリアやフードコートもあり、クラシック初心者でも気軽に楽しめるイベントです。', suggested: true, suggestedBy: '匿名リスナー' },
  { id: 'niconico-chokaigi', cat: 'event', emoji: '🎪', name: 'ニコニコ超会議', area: '幕張', pref: '千葉', url: 'https://chokaigi.jp/', memo: 'ネット発のみんなで作る日本最大級の文化祭。ニコニコ動画のカルチャーをリアルに体験できるイベントです。', suggested: true, suggestedBy: '匿名リスナー' },
  // --- 自然・よりみち ---
  { id: 'inokashira', cat: 'nature', emoji: '🌳', name: '井の頭恩賜公園', area: '武蔵野市・三鷹市', pref: '東京', url: 'https://www.tokyo-park.or.jp/park/format/index044.html', memo: '【サンプル】散歩するだけで心が整う、緑豊かな公園。' },
  { id: 'koishikawa-korakuen', cat: 'nature', emoji: '🌿', name: '小石川後楽園', area: '文京区後楽', pref: '東京', url: 'https://www.tokyo-park.or.jp/park/koishikawakorakuen/index.html', memo: '都内でアクセスしやすいのに、落ち着いて過ごせる庭園。リスナーさん曰く「人少なくてチル」。東京ドーム方面のライブ音が聞こえてきたこともあるそう。', suggested: true, suggestedBy: '匿名リスナー', traditional: true },
  { id: 'sample-yasashii-ueno-park', cat: 'nature', emoji: '♿', name: '上野恩賜公園', area: '上野', pref: '東京', url: 'https://www.udnavi.tokyo/udinfo/detail/detail00225.html', memo: '【サンプル】文化施設めぐりや短い散歩と組み合わせやすい都心の公園です。バリアフリー情報を確認しながら予定を立てやすく、無理のないお出かけ例として使いやすい場所です。', toilet: true, accessibleToilet: true, barrierFree: true },
  { id: 'sample-yasashii-tennoji-park', cat: 'nature', emoji: '🍼', name: 'てんしば（天王寺公園）', area: '大阪市天王寺区', pref: '大阪', url: 'https://www.tennoji-park.jp/facility/', memo: '【サンプル】主要駅から立ち寄りやすく、芝生広場で休憩もしやすい大阪の入口スポットです。授乳室・多目的トイレ・エレベーターなどの施設情報を公式ページで確認できます。', toilet: true, accessibleToilet: true, barrierFree: true, nursingRoom: true },
  { id: 'sample-yasashii-oasis21', cat: 'view', emoji: '🏙️', name: 'オアシス21', area: '名古屋・栄', pref: '愛知', url: 'https://www.sakaepark.co.jp/about/', memo: '【サンプル】栄駅直結で天候に左右されにくく、短時間でも景色や休憩を楽しみやすい場所です。多目的トイレや授乳室、エレベーター情報が確認しやすいのも安心です。', toilet: true, accessibleToilet: true, barrierFree: true, nursingRoom: true },
  { id: 'sample-yasashii-odori-park', cat: 'nature', emoji: '🌿', name: '大通公園', area: '札幌・大通', pref: '北海道', url: 'https://odori-park.jp/guide/', memo: '【サンプル】札幌中心部で休憩しながら歩ける公園です。公式ガイドで車いす貸出や多目的トイレの場所を確認できるため、初めてでも予定を組みやすい候補です。', toilet: true, accessibleToilet: true, barrierFree: true },
  { id: 'sample-yasashii-fukuoka-art-museum', cat: 'museum', emoji: '🎨', name: '福岡市美術館', area: '福岡市中央区大濠公園', pref: '福岡', url: 'https://www.fukuoka-art-museum.jp/guide/barrierfree/', memo: '【サンプル】大濠公園と合わせて過ごしやすい美術館です。入口スロープ、車いす貸出、みんなのトイレ、授乳室などの案内があり、落ち着いたお出かけ例として紹介しやすい場所です。', toilet: true, accessibleToilet: true, barrierFree: true, nursingRoom: true },
  // --- 本・しらべもの ---
  { id: 'tsutaya', cat: 'book', emoji: '📚', name: '代官山 蔦屋書店', area: '代官山', pref: '東京', url: 'https://store.tsite.jp/daikanyama/', memo: '【サンプル】新しい本との出会いがある、心地よい空間。' },
  // --- くらし・雑貨 ---
  { id: 'kakimori', cat: 'shop', emoji: '🛒', name: 'カキモリ', area: '蔵前', pref: '東京', url: 'https://kakimori.com/', memo: '【サンプル】自分だけのノートが作れる、素敵な文房具店。' },
  // --- おきにいりの景色 ---
  { id: 'shibuyasky', cat: 'view', emoji: '✨', name: 'SHIBUYA SKY', area: '渋谷', pref: '東京', url: 'https://www.shibuya-scramble-square.com/sky/', memo: '【サンプル】東京の空を広く感じられる、お気に入りの場所。' },
  { id: 'kasai-rinkai-crystal-view', cat: 'view', emoji: '🏝️', name: '葛西臨海公園 クリスタルビュー', area: '江戸川区', pref: '東京', url: 'https://architecture-tour.com/world/japan/tokyo/crystal-view/', memo: '葛西臨海公園内にある「クリスタルビュー」。美しい建築から海を眺められる、入場無料の景色スポットです。', suggested: true, suggestedBy: '匿名リスナー' },
  // --- 癒やし・ととのう ---
  { id: 'kogane', cat: 'relax', emoji: '🛁', name: '黄金湯', area: '墨田区', pref: '東京', url: 'https://koganeyu.com/', memo: '【サンプル】モダンな雰囲気でリラックスできる、素敵な銭湯。' },
  // --- エンタメ ---
  { id: 'hazbin', cat: 'entertainment', emoji: '🎬', name: 'ハズビン・ホテル', area: 'Amazon Prime Video', pref: 'オンライン', url: 'https://www.amazon.co.jp/gp/video/detail/B0CLM8CW52/ref=atv_dp_share_cu_r', memo: 'おすすめアニメ。大人向けミュージカルアニメ。' },
  { id: 'doc72', cat: 'entertainment', emoji: '📺', name: 'ドキュメント72時間', area: 'NHK', pref: 'オンライン', url: 'https://www.nhk.jp/g/ts/W3W8WRN8M3/', memo: 'おすすめドキュメンタリー番組（NHK）' },
];

// Utility functions for name-based exact/partial matching of spots
function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[\s\(\)（）\-\_\・\.\,\!\?]/g, '')
    .replace(/[ぁ-ん]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x60)) // Hiragana to Katakana
    .trim();
}

function findStaticSpotByName(name) {
  if (!name) return null;
  const cleanInput = normalizeString(name);
  
  // 1. Exact match (normalized)
  for (const s of SPOTS) {
    if (normalizeString(s.name) === cleanInput) return s;
  }
  for (const [key, value] of Object.entries(SPOT_TRANSLATIONS)) {
    if (value.name && normalizeString(value.name) === cleanInput) {
      const matched = SPOTS.find(s => s.id === key);
      if (matched) return matched;
    }
  }

  // 2. Partial match (normalized)
  for (const s of SPOTS) {
    const cleanSpotName = normalizeString(s.name);
    if (cleanSpotName.includes(cleanInput) || cleanInput.includes(cleanSpotName)) {
      return s;
    }
  }
  for (const [key, value] of Object.entries(SPOT_TRANSLATIONS)) {
    if (value.name) {
      const cleanTransName = normalizeString(value.name);
      if (cleanTransName.includes(cleanInput) || cleanInput.includes(cleanTransName)) {
        const matched = SPOTS.find(s => s.id === key);
        if (matched) return matched;
      }
    }
  }
  
  return null;
}

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

const PREFECTURE_OPTIONS = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島',
  '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
  '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知',
  '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山',
  '鳥取', '島根', '岡山', '広島', '山口',
  '徳島', '香川', '愛媛', '高知',
  '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄',
  '全国', 'オンライン'
];

const CITY_OPTIONS_BY_PREF = {
  北海道: ['札幌市'],
  東京: [
    '千代田区', '中央区', '港区', '新宿区', '文京区', '台東区', '墨田区', '江東区', '品川区',
    '目黒区', '大田区', '世田谷区', '渋谷区', '中野区', '杉並区', '豊島区', '北区', '荒川区',
    '板橋区', '練馬区', '足立区', '葛飾区', '江戸川区', '八王子市', '立川市', '武蔵野市',
    '三鷹市', '府中市', '調布市', '町田市', '小金井市', '国立市', '多摩市', '武蔵野市・三鷹市'
  ],
  神奈川: ['横浜市', '川崎市', '鎌倉市', '藤沢市', '横須賀市', '小田原市', '相模原市'],
  兵庫: ['神戸市', '西宮市', '姫路市', '尼崎市', '芦屋市'],
  千葉: ['千葉市', '浦安市', '船橋市', '市川市'],
  広島: ['広島市', '尾道市', '廿日市市', '福山市'],
  岡山: ['岡山市', '倉敷市'],
  鳥取: ['鳥取市', '米子市', '大山町'],
  大阪: ['大阪市', '堺市', '豊中市', '吹田市'],
  愛知: ['名古屋市'],
  京都: ['京都市', '宇治市'],
  福岡: ['福岡市', '北九州市'],
  全国: ['全国'],
  オンライン: ['オンライン']
};

const AREA_ALIAS_RULES = [
  { keywords: ['道玄坂', '渋谷', '広尾', '代官山', 'SHIBUYA', '代々木公園'], pref: '東京', city: '渋谷区' },
  { keywords: ['百人町', '大久保', '高田馬場', '新宿', '神楽坂'], pref: '東京', city: '新宿区' },
  { keywords: ['池袋', '東池袋'], pref: '東京', city: '豊島区' },
  { keywords: ['芝', '港区'], pref: '東京', city: '港区' },
  { keywords: ['浅草', '浅草ROX', '上野', '蔵前'], pref: '東京', city: '台東区' },
  { keywords: ['人形町', '銀座', '日本橋', '八重洲', '東京ミッドタウン八重洲'], pref: '東京', city: '中央区' },
  { keywords: ['東京ビッグサイト', 'ビッグサイト', '有明', '国際展示場', 'デザインフェスタ', 'デザフェス', 'Design Festa'], pref: '東京', city: '江東区' },
  { keywords: ['東京駅', '大丸東京', '丸の内', '東京国際フォーラム'], pref: '東京', city: '千代田区' },
  { keywords: ['墨田', '押上', '両国', '黄金湯', 'すみだ'], pref: '東京', city: '墨田区' },
  { keywords: ['小石川', '後楽', '文京'], pref: '東京', city: '文京区' },
  { keywords: ['葛西', '西葛西', '江戸川'], pref: '東京', city: '江戸川区' },
  { keywords: ['練馬', '山陰魚介'], pref: '東京', city: '練馬区' },
  { keywords: ['原宿', '太田記念美術館'], pref: '東京', city: '渋谷区' },
  { keywords: ['府中'], pref: '東京', city: '府中市' },
  { keywords: ['武蔵野', '三鷹', '井の頭'], pref: '東京', city: '武蔵野市・三鷹市' },
  { keywords: ['幕張', 'ニコニコ超会議'], pref: '千葉', city: '千葉市' },
  { keywords: ['横浜', 'ワールドポーターズ'], pref: '神奈川', city: '横浜市' },
  { keywords: ['神戸', '三宮'], pref: '兵庫', city: '神戸市' },
  { keywords: ['西宮'], pref: '兵庫', city: '西宮市' },
  { keywords: ['広島'], pref: '広島', city: '広島市' },
  { keywords: ['岡山'], pref: '岡山', city: '岡山市' },
  { keywords: ['鳥取・大山', '大山まきば', 'みるくの里', '白バラ牛乳'], pref: '鳥取', city: '大山町' },
  { keywords: ['鳥取・米子', '米子', 'ラーメンおたま', '牛骨ラーメン'], pref: '鳥取', city: '米子市' },
  { keywords: ['鳥取'], pref: '鳥取', city: '鳥取' },
  { keywords: ['てんしば', '天王寺公園', '大阪市天王寺区'], pref: '大阪', city: '大阪市' },
  { keywords: ['オアシス21', '名古屋・栄', '栄'], pref: '愛知', city: '名古屋市' },
  { keywords: ['大通公園', '札幌・大通', '札幌'], pref: '北海道', city: '札幌市' },
  { keywords: ['福岡市美術館', '大濠公園', '福岡市中央区大濠公園'], pref: '福岡', city: '福岡市' },
  { keywords: ['福岡市中央区天神', '天神', '楽勝ラーメン'], pref: '福岡', city: '福岡市' },
  { keywords: ['福岡'], pref: '福岡', city: '福岡' },
  { keywords: ['全国'], pref: '全国', city: '全国' },
  { keywords: ['オンライン', 'Amazon Prime', 'NHK'], pref: 'オンライン', city: 'オンライン' }
];

const AREA_REGION_BY_PREF = {
  北海道: '北海道',
  青森: '東北', 岩手: '東北', 宮城: '東北', 秋田: '東北', 山形: '東北', 福島: '東北',
  茨城: '関東', 栃木: '関東', 群馬: '関東', 埼玉: '関東', 千葉: '関東', 東京: '関東', 神奈川: '関東',
  新潟: '中部', 富山: '中部', 石川: '中部', 福井: '中部', 山梨: '中部', 長野: '中部', 岐阜: '中部', 静岡: '中部', 愛知: '中部',
  三重: '関西', 滋賀: '関西', 京都: '関西', 大阪: '関西', 兵庫: '関西', 奈良: '関西', 和歌山: '関西',
  鳥取: '中国', 島根: '中国', 岡山: '中国', 広島: '中国', 山口: '中国',
  徳島: '四国', 香川: '四国', 愛媛: '四国', 高知: '四国',
  福岡: '九州', 佐賀: '九州', 長崎: '九州', 熊本: '九州', 大分: '九州', 宮崎: '九州', 鹿児島: '九州', 沖縄: '沖縄'
};

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
let localPromptSuggestions = JSON.parse(localStorage.getItem('popopo_prompt_suggestions') || '[]');
let localPromptVotes = JSON.parse(localStorage.getItem('popopo_prompt_votes') || '{}');
let latestRemotePromptSuggestions = [];
// 投票送信中（Firestore 反映待ち）の voteId 集合 — UI のペンディング表示と二重送信防止
let localPendingPromptVotes = new Set();
// 自分が提案したお題の前回確認時の票数 — 再訪時に「あなたの提案に N 票届きました 🌸」を出すため
const PROMPT_VOTE_LAST_SEEN_KEY = 'popopo_prompt_last_seen_votes';
let lastSeenPromptVotes = (() => {
  try { return JSON.parse(localStorage.getItem(PROMPT_VOTE_LAST_SEEN_KEY) || '{}'); }
  catch (e) { return {}; }
})();
// 自分のおすすめスポット/感想/フリートーク投稿に届いた反応の「前回確認時の数」。
// お題と同じ仕組みで、再訪時に「新しく届いた分」だけをお礼トーストで知らせるために使う。
const SPOT_LIKE_LAST_SEEN_KEY = 'popopo_spot_like_last_seen_v1';
const REVIEW_SEEN_LAST_SEEN_KEY = 'popopo_review_seen_last_seen_v1';
const CHAT_REACTION_LAST_SEEN_KEY = 'popopo_chat_reaction_last_seen_v1';
let lastSeenSpotLikes = (() => {
  try { return JSON.parse(localStorage.getItem(SPOT_LIKE_LAST_SEEN_KEY) || '{}'); }
  catch (e) { return {}; }
})();
let lastSeenReviewSeen = (() => {
  try { return JSON.parse(localStorage.getItem(REVIEW_SEEN_LAST_SEEN_KEY) || '{}'); }
  catch (e) { return {}; }
})();
let lastSeenChatReactions = (() => {
  try { return JSON.parse(localStorage.getItem(CHAT_REACTION_LAST_SEEN_KEY) || '{}'); }
  catch (e) { return {}; }
})();
// 最初のいいねスナップショットが届いたかどうか — 通知を出すタイミング判定用
let _firstLikesSnapshotDone = false;
const PROMPT_SEEN_STORAGE_KEY = 'popopo_seen_daily_prompts_v1';
const PROMPT_SEEN_LIMIT = 240;
const PROMPT_ARCHIVE_PAGE_SIZE = 8;
const PROMPT_ARCHIVE_CUTOFF = new Date('2026-05-17T00:00:00+09:00').getTime();
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
const MAX_SPOT_UPLOAD_IMAGES = 2;
let uploadedSpotImageBase64List = [];
let uploadedPostImageBase64 = null;
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
const CARROT_GUIDE_STORAGE_KEY = 'popopo_carrot_guide_seen_v1';
const INTRO_STORY_SLIDE_MS = 5200;
const DISCOVERY_ROTATE_MS = 9000; // 旧45秒→9秒。発見カードの切替頻度
const DISCOVERY_PAUSE_MS = 12000;
const DISCOVERY_TEXT_LIMIT = 92;
const CARROT_GUIDE_HINTS = {
  hero: [
    {
      title: 'はじめて迷ったら',
      text: 'トップ画像の下にある入口から、おすすめスポットやみんなの感想へ進めます。まずは気になる場所を眺めてみてください。',
      actionLabel: 'スポットへ',
      href: '#spots'
    },
    {
      title: '今日の発見は入れ替わります',
      text: '上の小さな発見欄は、投稿されたスポットや感想から少しずつ入れ替わります。名前を押すと、そのカードを開けます。',
      actionLabel: '発見を見る',
      href: '#hero'
    },
    {
      title: '小さな作品も触れます',
      text: 'トップに流れている作品アイコンは、横に動かして選べます。気になる作品を押すと大きく開きます。',
      actionLabel: '作品を見る',
      href: '#hero'
    },
    {
      title: 'しっかり知りたい時は',
      text: '使い方ページには、投稿、行きたいリスト、ギャラリー、フリートークの見方をまとめています。',
      actionLabel: '使い方へ',
      href: 'how-to.html'
    }
  ],
  spots: [
    {
      title: '気になる場所は保存できます',
      text: 'スポットカードの「行きたい」を押すと、同じ端末の行きたいリストに集められます。',
      actionLabel: 'スポットを見る',
      href: '#spots'
    },
    {
      title: '最近の感想もヒントに',
      text: 'スポットカードには最新の感想が1行だけ出ます。「みんなの感想」から、その場所の声を一覧で見られます。',
      actionLabel: '感想を見る',
      href: '#visited'
    },
    {
      title: 'おすすめも投稿できます',
      text: '「スポットを追加する」から場所を提案できます。投稿後は同じ端末のブラウザで編集できます。',
      actionLabel: '追加する',
      href: '#add-spot'
    }
  ],
  visited: [
    {
      title: '感想は新しい順です',
      text: 'みんなの感想は新しい投稿が上に並びます。読んだら「見たよ」で気持ちを残せます。',
      actionLabel: '感想を見る',
      href: '#visited'
    },
    {
      title: '行ってみたら一言でも',
      text: '写真や投稿URLは任意です。投稿後は同じ端末のブラウザで編集できます。短い感想でも次の人のヒントになります。',
      actionLabel: '投稿する',
      href: '#visited'
    }
  ],
  community: [
    {
      title: '話題に迷ったら',
      text: '今日のお題から投稿できます。POPOPOの感想、サイトへの意見、お出かけ予定も歓迎です。',
      actionLabel: '掲示板へ',
      href: '#community'
    },
    {
      title: '会話は返信でつながります',
      text: '気になるつぶやきには返信できます。ツリーで流れが見えるので、あとから読んでも追いやすいです。',
      actionLabel: 'つぶやきを見る',
      href: '#community'
    }
  ],
  gallery: [
    {
      title: '作品は左右に送れます',
      text: '作品を開いたら、左右のボタンやスワイプで次の作品へ移動できます。',
      actionLabel: '作品へ戻る',
      href: '#hero'
    },
    {
      title: '合言葉つきの作品もあります',
      text: '用語辞典など一部の作品は、配信の思い出にまつわる合言葉で開けます。',
      actionLabel: 'ギャラリーへ',
      href: '#hero'
    }
  ]
};
const CARROT_GUIDE_HINTS_EN = {
  hero: [
    {
      title: 'Unsure where to start?',
      text: 'Use the entry points below the top visual to visit recommended spots or guest reviews. Start by browsing places that catch your interest.',
      actionLabel: 'Go to Spots',
      href: '#spots'
    },
    {
      title: "Today's Discoveries rotate",
      text: 'The "Today\'s Discovery" section at the top slowly rotates through shared spots and reviews. Tap a name to open its detail card.',
      actionLabel: 'View Discoveries',
      href: '#hero'
    },
    {
      title: 'Tap floating artworks',
      text: 'You can swipe or slide the artwork icons moving across the top. Tap any artwork to see a larger version.',
      actionLabel: 'View Artworks',
      href: '#hero'
    },
    {
      title: 'For detailed instructions',
      text: 'The "How to Use" guide summarizes how to post, use the want-list, view the gallery, and check free talk.',
      actionLabel: 'Go to Guide',
      href: 'how-to.html'
    }
  ],
  spots: [
    {
      title: 'Save places you like',
      text: 'Tap "Want" on any spot card to save it to your local want-list on this device.',
      actionLabel: 'View Spots',
      href: '#spots'
    },
    {
      title: 'Recent reviews as hints',
      text: 'Spot cards display a one-line preview of the latest review. You can see all reviews from the "Guest Reviews" section.',
      actionLabel: 'View Reviews',
      href: '#visited'
    },
    {
      title: 'Post your recommendations',
      text: 'Tap "Add a Spot" to propose a new place. Once posted, you can edit it anytime from the same device.',
      actionLabel: 'Add Spot',
      href: '#add-spot'
    }
  ],
  visited: [
    {
      title: 'Reviews in chronological order',
      text: 'Guest reviews are listed with the newest posts at the top. Once read, tap "Seen" to share your appreciation.',
      actionLabel: 'View Reviews',
      href: '#visited'
    },
    {
      title: 'Share a quick thought',
      text: 'Photos or post URLs are optional. Once posted, you can edit it from this device. Even a short review helps the next visitor!',
      actionLabel: 'Post Review',
      href: '#visited'
    }
  ],
  community: [
    {
      title: 'Unsure what to talk about?',
      text: 'You can post thoughts based on "Today\'s Topic". Feedback about POPOPO, site opinions, or your outing plans are also welcome!',
      actionLabel: 'Go to Board',
      href: '#community'
    },
    {
      title: 'Conversations thread together',
      text: 'You can reply directly to any post. Visual threads make it easy to follow the flow of conversation later.',
      actionLabel: 'View Posts',
      href: '#community'
    }
  ],
  gallery: [
    {
      title: 'Browse arts left & right',
      text: 'When you open an artwork, you can navigate using the left/right buttons or swipe gestures.',
      actionLabel: 'Back to Art',
      href: '#hero'
    },
    {
      title: 'Artworks with passcodes',
      text: 'Some works, like the glossary, can be unlocked with passcodes related to memories of the podcast broadcast.',
      actionLabel: 'Go to Gallery',
      href: '#hero'
    }
  ]
};
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
const FALLBACK_PROMPTS_ARE_ARCHIVED = true;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const PROMPT_FRESH_ROTATION_START_MS = Date.UTC(2026, 4, 29) - JST_OFFSET_MS;
const PROMPT_FRESH_ROTATION_START_DAY_INDEX = Math.floor(PROMPT_FRESH_ROTATION_START_MS / 86400000);
function loadSeenDailyPromptIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROMPT_SEEN_STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter(Boolean).slice(-PROMPT_SEEN_LIMIT) : [];
  } catch (e) {
    return [];
  }
}

let seenDailyPromptIds = loadSeenDailyPromptIds();
let visibleSpotCount = INITIAL_SPOT_COUNT;
let visibleReviewCount = INITIAL_REVIEW_COUNT;
let visibleChatCount = INITIAL_CHAT_COUNT;
let replyingTo = null;
let showingWantList = false;
let showingBarrierFreeOnly = false;
let activeAreaRegion = 'all';
let activeSpotArea = 'all';
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
let carrotGuideContext = 'hero';
let carrotGuideIndexByContext = {};

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
        <img class="hero-gallery-thumb${isDoc}" src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async">
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
    let lastHeroGalleryWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      // スマホで上下スクロールに伴いアドレスバーが伸縮した際、高さのみの変化で再描画が走り画像がパカパカ消える現象を防ぐ
      if (window.innerWidth === lastHeroGalleryWidth) return;
      lastHeroGalleryWidth = window.innerWidth;
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
      const touchedPromptVoteIds = [];
      snap.docs.forEach(doc => {
        if (doc.id === 'page_views') return; // 除外
        globalLikes[doc.id] = doc.data().count || 0;
        const countSpan = document.getElementById(`like-count-${doc.id}`);
        if (countSpan) countSpan.textContent = globalLikes[doc.id];
        if (doc.id.startsWith('review_seen_')) updateSeenReviewButton(doc.id);
        if (doc.id.startsWith('chat_')) updateChatReactionButton(doc.id);
        if (doc.id.startsWith('prompt_vote_')) {
          localPendingPromptVotes.delete(doc.id);
          touchedPromptVoteIds.push(doc.id);
        }
      });
      // お題の投票数は in-place 更新（renderDailyPrompt の innerHTML 全消しを避ける）
      touchedPromptVoteIds.forEach(voteId => updatePromptVoteButton(voteId));
      // 最初のスナップショット完了時に「自分の提案に新しく届いた票」を通知
      if (!_firstLikesSnapshotDone) {
        _firstLikesSnapshotDone = true;
        cleanupStaleLocalPromptVotes();
        setTimeout(checkMyEngagementNotifications, 900);
      }
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
      ticker.textContent = `${firstChat.nickname || (currentLanguage === 'en' ? 'Anonymous Listener' : '匿名リスナー')}：${firstChat.message}`;
      ticker.style.opacity = '1';
      currentTickerIndex = 1 % displayChats.length;
      
      if (displayChats.length > 1) {
        tickerInterval = setInterval(updateTickerText, 4000); // 4秒ごとに切り替え
      }
    } else {
      ticker.textContent = currentLanguage === 'en' ? 'Waiting for the first chat...' : '最初のつぶやきを待っています...';
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
  const editLabel = currentLanguage === 'en' ? '✏️ Edit' : '✏️ 編集';
  const editTitle = currentLanguage === 'en' ? 'Edit' : '編集';
  return `
    <div class="post-actions" data-id="${id}" data-client-id="${clientId}">
      <button class="btn-post-action is-edit" onclick="startEditEntity('${id}', '${clientId}', '${type}')" title="${editTitle}">${editLabel}</button>
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

function getSiteShareUrl(anchor = 'spots') {
  const base = window.location.origin && window.location.origin !== 'null'
    ? `${window.location.origin}${window.location.pathname}`
    : window.location.href.split('#')[0];
  return `${base.replace(/\/index\.html$/, '/')}${anchor ? `#${anchor}` : ''}`;
}

function buildSpotShareText(spot, displayName, displayArea, displayMemo, includeUrl = true) {
  const isEn = currentLanguage === 'en';
  const url = getSiteShareUrl('spots');
  if (isEn) {
    return [
      `I found "${displayName}" on POPOPO Outing Map.`,
      displayArea ? `Area: ${displayArea}` : '',
      displayMemo ? `Why it caught my eye: ${truncateText(displayMemo, 92)}` : '',
      'A small discovery shared from person to person.',
      includeUrl ? url : ''
    ].filter(Boolean).join('\n');
  }
  return [
    `POPOPO お出かけマップで見つけた「${displayName}」。`,
    displayArea ? `場所：${displayArea}` : '',
    displayMemo ? `おすすめポイント：${truncateText(displayMemo, 92)}` : '',
    '人から人へ伝わる、ちいさなお出かけ案内です。',
    includeUrl ? url : ''
  ].filter(Boolean).join('\n');
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.cssText = 'position:fixed;top:-999px;left:-999px;opacity:0;';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } finally {
    textarea.remove();
  }
  return ok;
}

async function shareSpot(spot) {
  if (!spot) return;
  const isEn = currentLanguage === 'en';
  const spotTrans = SPOT_TRANSLATIONS[spot.id] || {};
  const displayName = isEn && spotTrans.name ? spotTrans.name : spot.name;
  const displayMemo = isEn && spotTrans.memo ? spotTrans.memo : (spot.memo || spot.reason || '');
  const displayArea = isEn
    ? convertToEnglishAddress(spot.area, spot.pref)
    : `${spot.area || ''}${spot.pref && spot.pref !== '東京' && spot.pref !== '全国' && spot.pref !== 'オンライン' ? '（' + spot.pref + '）' : ''}`;
  const text = buildSpotShareText(spot, displayName, displayArea, displayMemo, true);
  const nativeShareText = buildSpotShareText(spot, displayName, displayArea, displayMemo, false);
  const shareData = {
    title: isEn ? `${displayName} | POPOPO Outing Map` : `${displayName} | POPOPO お出かけマップ`,
    text: nativeShareText,
    url: getSiteShareUrl('spots')
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showToast(isEn ? 'This might become someone’s next outing.' : '誰かのお出かけのきっかけになるかも。');
      return;
    }
    const copied = await copyTextToClipboard(text);
    showToast(copied
      ? (isEn ? 'Share text copied. It might inspire someone’s next outing.' : '共有文をコピーしました。誰かのお出かけのきっかけになるかも。')
      : (isEn ? 'Could not copy the share text.' : '共有文をコピーできませんでした。'));
  } catch (error) {
    if (error && error.name === 'AbortError') return;
    console.warn('Spot share failed:', error);
    showToast(isEn ? 'Sharing failed. Please try again.' : '共有できませんでした。もう一度お試しください。');
  }
}

function getIntroStorySlides() {
  return Array.from(document.querySelectorAll('[data-intro-story-slide]'));
}

function setIntroStorySlide(index) {
  const slides = getIntroStorySlides();
  const dots = Array.from(document.querySelectorAll('[data-intro-story-dot]'));
  const nextBtn = document.getElementById('introStoryNextBtn');
  if (!slides.length) return;
  introStoryIndex = ((index % slides.length) + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === introStoryIndex);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === introStoryIndex);
    dot.setAttribute('aria-current', i === introStoryIndex ? 'true' : 'false');
  });
  if (nextBtn) nextBtn.textContent = introStoryIndex >= slides.length - 1 ? 'サイトへ' : '次へ';
}

function startIntroStoryFlow() {
  window.clearTimeout(introStoryTimer);
  introStoryTimer = window.setTimeout(() => {
    const slides = getIntroStorySlides();
    if (!slides.length) return;
    if (introStoryIndex >= slides.length - 1) {
      closeIntroStoryModal();
      return;
    }
    setIntroStorySlide(introStoryIndex + 1);
    startIntroStoryFlow();
  }, INTRO_STORY_SLIDE_MS);
}

function markIntroStorySeen() {
  try {
    localStorage.setItem(INTRO_STORY_STORAGE_KEY, 'true');
  } catch (e) {
    // Storageが使えない環境では、その回で閉じられれば十分。
  }
}

function moveToHeroAfterIntroStory() {
  const hero = document.getElementById('hero');
  if (location.hash && location.hash !== '#hero') {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
  const scrollTop = () => {
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  window.requestAnimationFrame(scrollTop);
  window.setTimeout(scrollTop, 120);
}

function closeIntroStoryModal() {
  const modal = document.getElementById('introStoryModal');
  if (!modal) return;
  if (!modal.classList.contains('is-open')) return;
  window.clearTimeout(introStoryTimer);
  introStoryTimer = null;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  markIntroStorySeen();
  moveToHeroAfterIntroStory();
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

function getJstDateParts(date = new Date()) {
  const jst = new Date(date.getTime() + JST_OFFSET_MS);
  return {
    year: jst.getUTCFullYear(),
    month: jst.getUTCMonth(),
    day: jst.getUTCDate()
  };
}

function getJstDayStartMs(date = new Date()) {
  const { year, month, day } = getJstDateParts(date);
  return Date.UTC(year, month, day) - JST_OFFSET_MS;
}

function getDayIndex(date = new Date()) {
  return Math.floor(getJstDayStartMs(date) / 86400000);
}

function getFallbackDailyPrompt() {
  return DAILY_PROMPTS[getDayIndex() % DAILY_PROMPTS.length];
}

function saveSeenDailyPromptIds() {
  try {
    const compact = Array.from(new Set(seenDailyPromptIds.filter(Boolean))).slice(-PROMPT_SEEN_LIMIT);
    seenDailyPromptIds = compact;
    localStorage.setItem(PROMPT_SEEN_STORAGE_KEY, JSON.stringify(compact));
  } catch (e) {
    // localStorageが使えない環境では、今回の表示だけで続行する。
  }
}

function getFallbackPromptId(text) {
  return `fallback:${hashString(text || '')}`;
}

function getCommunityPromptId(item = {}) {
  return `community:${item.clientId || item.id || hashString(`${item.text || ''}|${item.timestamp || 0}`)}`;
}

function isDailyPromptSeen(id) {
  return Boolean(id && seenDailyPromptIds.includes(id));
}

function markDailyPromptSeen(info = {}) {
  if (!info.seenId || info.source === 'exhausted') return;
  if (!seenDailyPromptIds.includes(info.seenId)) {
    seenDailyPromptIds.push(info.seenId);
    saveSeenDailyPromptIds();
  }
}

function getPromptCandidateCutoffMs(dayIndex = getDayIndex()) {
  return dayIndex >= PROMPT_FRESH_ROTATION_START_DAY_INDEX
    ? PROMPT_FRESH_ROTATION_START_MS
    : PROMPT_ARCHIVE_CUTOFF;
}

function getFallbackPromptItems() {
  return DAILY_PROMPTS.map((text, index) => ({
    text,
    source: 'fallback',
    id: getFallbackPromptId(text),
    timestamp: index
  }));
}

function getUnseenPromptCandidates({ includeFallback = true, excludeId = '' } = {}) {
  const cutoffMs = getPromptCandidateCutoffMs();
  const communityItems = mergePromptSuggestions()
    .map(item => ({ ...item, source: 'community', seenId: getCommunityPromptId(item) }))
    .filter(item => (item.timestamp || 0) >= cutoffMs)
    .filter(item => item.seenId !== excludeId && !isDailyPromptSeen(item.seenId));
  const fallbackItems = includeFallback && !FALLBACK_PROMPTS_ARE_ARCHIVED
    ? getFallbackPromptItems()
        .map(item => ({ ...item, seenId: item.id }))
        .filter(item => item.seenId !== excludeId && !isDailyPromptSeen(item.seenId))
    : [];
  return [...communityItems, ...fallbackItems];
}

// 後方互換：他の箇所からも呼ばれる
function getDailyPrompt() {
  const info = currentDailyPromptInfo || getDailyPromptInfo();
  return info.text;
}

const PROMPT_SUGGESTION_TTL_DAYS = 14;

function normalizePromptText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\s+/g, '') // 空白除去
    .replace(/[　\s,.\/#!$%\^&\*;:{}=\-_`~()？?！!。、()（）「」『』“”'\"~〜]/g, '') // 記号・句読点・括弧除去
    .replace(/想い出/g, '思い出')
    .toLowerCase();
}

function getPromptRawId(suggestionOrId) {
  if (!suggestionOrId) return '';
  if (typeof suggestionOrId === 'string') {
    return suggestionOrId.startsWith('prompt_vote_')
      ? suggestionOrId.replace(/^prompt_vote_/, '')
      : suggestionOrId;
  }
  return suggestionOrId.clientId || suggestionOrId.id || hashString(`${suggestionOrId.text || ''}|${suggestionOrId.timestamp || 0}`);
}

function getPromptGroupIds(suggestion) {
  const ids = suggestion?.groupedIds || [getPromptRawId(suggestion)];
  return Array.from(new Set(ids.filter(Boolean)));
}

function getPromptVoteId(suggestionOrId) {
  if (!suggestionOrId) return '';
  let key = '';
  if (typeof suggestionOrId === 'string') {
    // すでにプレフィックスがある場合はそのまま返す、ない場合は付与する
    if (suggestionOrId.startsWith('prompt_vote_')) return suggestionOrId;
    key = suggestionOrId;
  } else {
    key = getPromptRawId(suggestionOrId);
  }
  return `prompt_vote_${key}`;
}

function getPromptVoteCount(suggestion) {
  if (!suggestion) return 0;
  const ids = getPromptGroupIds(suggestion);
  let total = 0;
  ids.forEach(id => {
    const voteId = getPromptVoteId(id);
    if (voteId) {
      const serverVotes = globalLikes[voteId] || 0;
      const isPending = localPendingPromptVotes.has(voteId);

      // 送信中（ペンディング）の期間のみ、楽観的に +1 を加算して表示（同期ラグ解消）
      if (isPending) {
        total += serverVotes + 1;
      } else {
        total += serverVotes;
      }
    }
  });
  return total;
}

function isPromptVoted(suggestion) {
  if (!suggestion) return false;
  const ids = getPromptGroupIds(suggestion);
  return ids.some(id => Boolean(localPromptVotes[getPromptVoteId(id)]));
}

function isPromptVotePending(suggestionOrId) {
  if (!suggestionOrId) return false;
  const ids = typeof suggestionOrId === 'object'
    ? getPromptGroupIds(suggestionOrId)
    : [getPromptRawId(suggestionOrId)];
  return ids.some(id => localPendingPromptVotes.has(getPromptVoteId(id)));
}

function clearPromptVotePending(voteId) {
  if (!voteId || !localPendingPromptVotes.has(voteId)) return;
  localPendingPromptVotes.delete(voteId);
  updatePromptVoteButton(voteId);
}

function schedulePromptVotePendingFallbackClear(voteId) {
  if (!voteId) return;
  window.setTimeout(() => clearPromptVotePending(voteId), 8000);
}

function cleanupStaleLocalPromptVotes() {
  let changed = false;
  Object.keys(localPromptVotes || {}).forEach(voteId => {
    if (!voteId.startsWith('prompt_vote_')) return;
    if (localPendingPromptVotes.has(voteId)) return;
    if ((globalLikes[voteId] || 0) > 0) return;
    delete localPromptVotes[voteId];
    changed = true;
  });
  if (!changed) return;
  try {
    localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes));
  } catch (e) {}
  renderDailyPrompt();
}

function mergePromptSuggestions(remoteList = latestRemotePromptSuggestions) {
  // 重複お題をまとめるため、キーを normalizedText にして名寄せします（優しい統合）
  const byNormalized = new Map();
  const now = Date.now();
  const threshold = 30000; // 30秒以内のローカル投稿のみ

  // 全てのお題（リモート＋ローカル新規）を集める
  const candidates = [];

  // ① リモートデータを入れる
  (remoteList || []).forEach(item => {
    candidates.push({ ...item, source: 'remote' });
  });

  // ② ローカルの新規投稿を入れる
  localPromptSuggestions.forEach(item => {
    const key = item.clientId || item.id;
    if (key && (now - (item.timestamp || 0)) < threshold) {
      candidates.push({ ...item, source: 'local' });
    }
  });

  // 時間の降順（新しいものが先）にソートして、重複時の代表お題は「最新」または「リモート」を優先するようにする
  candidates.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  candidates.forEach(item => {
    const norm = normalizePromptText(item.text);
    if (!norm) return;
    const itemId = getPromptRawId(item);

    if (!byNormalized.has(norm)) {
      byNormalized.set(norm, {
        ...item,
        groupedIds: itemId ? [itemId] : [],
      });
    } else {
      const group = byNormalized.get(norm);
      if (itemId && !group.groupedIds.includes(itemId)) {
        group.groupedIds.push(itemId);
      }

      // リモートデータを優先する（ローカルのままのものはリモートがあるなら上書き）
      if (item.source === 'remote' && group.source === 'local') {
        const newIds = group.groupedIds;
        Object.assign(group, item);
        group.groupedIds = newIds;
        group.source = 'remote';
      }
    }
  });

  return Array.from(byNormalized.values());
}

let activeGachaItem = null;
let currentDailyPromptInfo = null;
let dailyPromptArchivePage = 0;
let dailyPromptRefreshTimer = null;

function getPromptWaitingInfo(dayIndex = getDayIndex()) {
  return {
    text: currentLanguage === 'en' ? 'Would you like to suggest a topic?' : 'お題を投稿してみませんか？',
    source: 'exhausted',
    id: 'prompt-waiting-for-new',
    seenId: '',
    dayIndex,
  };
}

function buildFreshPromptSchedule(items = mergePromptSuggestions()) {
  let nextDisplayDay = PROMPT_FRESH_ROTATION_START_DAY_INDEX;
  return items
    .filter(item => !item.isArchived)
    .filter(item => (item.timestamp || 0) >= PROMPT_FRESH_ROTATION_START_MS)
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
    .map(item => {
      const submittedDay = getDayIndex(new Date(item.timestamp || Date.now()));
      const displayDay = Math.max(nextDisplayDay, submittedDay + 1);
      nextDisplayDay = displayDay + 1;
      return { ...item, displayDay };
    });
}

function getDailyPromptInfo() {
  const merged = mergePromptSuggestions();
  const todayIdx = getDayIndex();

  // ① ガチャで選択中のアイテムがあればそれを最優先表示
  if (activeGachaItem?.source === 'fallback') {
    return {
      text: activeGachaItem.text,
      source: 'fallback',
      id: activeGachaItem.id,
      seenId: activeGachaItem.seenId || activeGachaItem.id,
      isGacha: true,
      dayIndex: todayIdx,
    };
  }
  if (activeGachaItem && merged.some(m => (m.clientId || m.id) === (activeGachaItem.clientId || activeGachaItem.id))) {
    const fresh = merged.find(m => (m.clientId || m.id) === (activeGachaItem.clientId || activeGachaItem.id));
    const seenId = getCommunityPromptId(fresh);
    return {
      text: fresh.text,
      source: 'community',
      nickname: fresh.nickname || '匿名リスナー',
      votes: getPromptVoteCount(fresh),
      id: fresh.clientId || fresh.id,
      seenId,
      timestamp: fresh.timestamp || 0,
      isGacha: true,
      dayIndex: todayIdx,
    };
  }

  // ② キャッシュされたお題があり、かつ日付が変わっていなければそれを返す
  if (!activeGachaItem && currentDailyPromptInfo && currentDailyPromptInfo.dayIndex === todayIdx && currentDailyPromptInfo.source !== 'exhausted') {
    const isFallbackScheduled = String(currentDailyPromptInfo.id || '').startsWith('scheduled-');
    // リモートお題が読み込まれる前に生成された仮IDキャッシュがある場合、最新のリモートデータとの照合を行うためキャッシュをバイパス
    if (!isFallbackScheduled || !latestRemotePromptSuggestions.length) {
      if (currentDailyPromptInfo.source === 'community') {
        const fresh = merged.find(item => getPromptGroupIds(item).includes(currentDailyPromptInfo.id));
        if (fresh) {
          currentDailyPromptInfo.votes = getPromptVoteCount(fresh);
        } else {
          const voteId = getPromptVoteId(currentDailyPromptInfo.id);
          currentDailyPromptInfo.votes = (globalLikes[voteId] || 0) + (localPendingPromptVotes.has(voteId) ? 1 : 0);
        }
      }
      return currentDailyPromptInfo;
    }
  }

  // キャッシュ無効または日付変更によるリセット
  activeGachaItem = null;

  // 特定の日付（2026-05-26 〜 2026-05-28）の特別スケジュール割り当て
  let scheduledText = null;
  if (todayIdx === 20598) {
    scheduledText = '今だから笑えるお出かけ先での「愛すべき失敗談」を教えてください。';
  } else if (todayIdx === 20599) {
    scheduledText = '目的地よりも記憶に残った(想定外の)寄り道の想い出はありますか？';
  } else if (todayIdx === 20600) {
    scheduledText = 'お散歩中に道端で見つけた「なぜこんな所に？」という意外な落とし物';
  }

  if (scheduledText && !activeGachaItem) {
    const normScheduled = normalizePromptText(scheduledText);
    const matchedItem = merged.find(item => {
      if (!item.text) return false;
      const normItem = normalizePromptText(item.text);
      return normItem.includes(normScheduled) || normScheduled.includes(normItem);
    });
    if (matchedItem) {
      return {
        text: matchedItem.text,
        source: 'community',
        nickname: matchedItem.nickname || 'こん',
        votes: getPromptVoteCount(matchedItem),
        id: matchedItem.clientId || matchedItem.id,
        seenId: getCommunityPromptId(matchedItem),
        timestamp: matchedItem.timestamp || 0,
        dayIndex: todayIdx,
      };
    } else {
      return {
        text: scheduledText,
        source: 'community',
        nickname: 'こん',
        votes: 0,
        id: 'scheduled-' + todayIdx,
        seenId: 'scheduled-' + todayIdx,
        timestamp: Date.now(),
        dayIndex: todayIdx,
      };
    }
  }

  // ③ 2026-05-29以降は、新規投稿のお題を投稿順に1回ずつ日替わり表示する。
  // その日に表示する新規お題がない場合は、古いお題を循環させず投稿を促す。
  if (todayIdx >= PROMPT_FRESH_ROTATION_START_DAY_INDEX) {
    const scheduledItems = buildFreshPromptSchedule(merged);
    const activeItem = scheduledItems.find(item => item.displayDay === todayIdx);
    if (activeItem) {
      return {
        text: activeItem.text,
        source: 'community',
        nickname: activeItem.nickname || '匿名リスナー',
        votes: getPromptVoteCount(activeItem),
        id: activeItem.clientId || activeItem.id,
        seenId: getCommunityPromptId(activeItem),
        timestamp: activeItem.timestamp || 0,
        dayIndex: todayIdx,
      };
    }
    return getPromptWaitingInfo(todayIdx);
  }

  // ④ 5/28以前は従来どおり、既存コミュニティお題を投稿順に日替わりローテーションする。
  const allCommunity = merged.filter(item => !item.isArchived)
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)); // 投稿順（古い順）

  if (allCommunity.length) {
    const activeIndex = todayIdx % allCommunity.length;
    const activeItem = allCommunity[activeIndex];
    return {
      text: activeItem.text,
      source: 'community',
      nickname: activeItem.nickname || '匿名リスナー',
      votes: getPromptVoteCount(activeItem),
      id: activeItem.clientId || activeItem.id,
      seenId: getCommunityPromptId(activeItem),
      timestamp: activeItem.timestamp || 0,
      dayIndex: todayIdx,
    };
  }

  // ⑤ コミュニティお題がない場合は、プリセットのフォールバックお題をローテーション
  const fallbackItems = getFallbackPromptItems();
  if (fallbackItems.length) {
    const activeIndex = todayIdx % fallbackItems.length;
    const fallbackItem = fallbackItems[activeIndex];
    return {
      text: fallbackItem.text,
      source: 'fallback',
      id: fallbackItem.id,
      seenId: fallbackItem.id,
      timestamp: fallbackItem.timestamp,
      dayIndex: todayIdx,
    };
  }

  // ⑥ お題が全くない場合
  return getPromptWaitingInfo(todayIdx);
}

function renderDailyPrompt() {
  const text = document.getElementById('dailyPromptText');
  const meta = document.getElementById('dailyPromptMeta');
  const stamp = document.getElementById('dailyPromptStamp');
  const promptBtn = document.getElementById('dailyPromptBtn');
  const gachaBtn = document.getElementById('dailyPromptGachaBtn');
  const info = getDailyPromptInfo();
  currentDailyPromptInfo = info;
  if (text) text.textContent = info.text;
  if (stamp) {
    if (info.source === 'community' && info.timestamp) {
      const d = new Date(info.timestamp);
      const dateStr = !isNaN(d.getTime()) ? `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}` : 'POPOPO';
      stamp.innerHTML = `🌸 ${dateStr} 提案`;
      stamp.hidden = false;
    } else {
      stamp.hidden = true;
    }
  }
  if (promptBtn) {
    promptBtn.textContent = info.source === 'exhausted'
      ? (currentLanguage === 'en' ? 'Suggest a Topic' : 'お題を投稿する')
      : (currentLanguage === 'en' ? 'Post with this Topic' : 'このお題でつぶやく');
  }
  if (gachaBtn) {
    const remaining = getUnseenPromptCandidates({ includeFallback: true, excludeId: info.seenId }).length;
    gachaBtn.disabled = info.source === 'exhausted' || remaining === 0;
    gachaBtn.textContent = gachaBtn.disabled
      ? (currentLanguage === 'en' ? '🎲 Waiting for topics' : '🎲 新しいお題待ち')
      : (currentLanguage === 'en' ? '🎲 Roll Topic' : '🎲 ガチャを回す');
    gachaBtn.title = gachaBtn.disabled
      ? (currentLanguage === 'en' ? 'New suggestions will appear here when they arrive.' : '新しいお題の提案が届くと、また表示できます')
      : (currentLanguage === 'en' ? 'Roll a topic you have not seen yet.' : 'まだ見ていないお題をランダムでめくります');
  }
  if (meta) {
    if (info.source === 'community') {
      const nick = (info.nickname || '匿名リスナー').replace(/[<>&]/g, '');
      const badge = info.isGacha ? '<span class="pill" style="background:rgba(232,67,147,0.12);color:#d63031;">🎲 ガチャ表示中</span>' : '<span class="pill">みんなのお題</span>';
      meta.innerHTML = `${badge}${nick} さんの提案 ・ ♡ ${info.votes}`;
      meta.hidden = false;
    } else if (info.source === 'exhausted') {
      meta.innerHTML = currentLanguage === 'en'
        ? '<span class="pill">Waiting for Topics</span>New suggestions will become future daily topics.'
        : '<span class="pill">新しいお題待ち</span>新しい提案が届くと、明日以降のお題になります。';
      meta.hidden = false;
    } else {
      meta.innerHTML = '';
      meta.hidden = true;
    }
  }
  renderDailyPromptCandidates();
}

function getMsUntilNextJstDay(date = new Date()) {
  const { year, month, day } = getJstDateParts(date);
  const nextJstMidnightUtc = Date.UTC(year, month, day + 1) - JST_OFFSET_MS;
  return Math.max(1000, nextJstMidnightUtc - date.getTime() + 1200);
}

function resetDailyPromptForDayChange() {
  activeGachaItem = null;
  currentDailyPromptInfo = null;
  renderDailyPrompt();
}

function refreshDailyPromptIfDayChanged() {
  const todayIdx = getDayIndex();
  if (!currentDailyPromptInfo || currentDailyPromptInfo.dayIndex === todayIdx) return;
  resetDailyPromptForDayChange();
}

function scheduleDailyPromptRefresh() {
  window.clearTimeout(dailyPromptRefreshTimer);
  dailyPromptRefreshTimer = window.setTimeout(() => {
    resetDailyPromptForDayChange();
    scheduleDailyPromptRefresh();
  }, getMsUntilNextJstDay());
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPromptArchiveItems() {
  return mergePromptSuggestions()
    .filter(item => !item.isArchived)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

function formatPromptSuggestedAt(timestamp) {
  if (!timestamp) return currentLanguage === 'en' ? 'Suggested date unknown' : '提案日不明';
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) {
    return currentLanguage === 'en' ? 'Suggested date unknown' : '提案日不明';
  }
  if (currentLanguage === 'en') {
    return `Suggested ${d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day} 提案`;
}

function renderDailyPromptPagination(totalItems, totalPages) {
  const pager = document.getElementById('dailyPromptPagination');
  if (!pager) return;
  if (totalPages <= 1) {
    pager.hidden = true;
    pager.innerHTML = '';
    return;
  }

  const isEn = currentLanguage === 'en';
  const start = Math.max(0, Math.min(dailyPromptArchivePage - 2, totalPages - 5));
  const end = Math.min(totalPages, start + 5);
  const pageButtons = [];
  for (let i = start; i < end; i += 1) {
    pageButtons.push(`
      <button type="button" class="daily-prompt-page-btn${i === dailyPromptArchivePage ? ' is-current' : ''}" data-prompt-page-index="${i}" ${i === dailyPromptArchivePage ? 'aria-current="page"' : ''}>
        ${i + 1}
      </button>
    `);
  }

  pager.hidden = false;
  pager.innerHTML = `
    <button type="button" class="daily-prompt-page-btn" data-prompt-page-action="prev" ${dailyPromptArchivePage === 0 ? 'disabled' : ''}>
      ${isEn ? 'Prev' : '前へ'}
    </button>
    <div class="daily-prompt-page-numbers" aria-label="${isEn ? 'Topic archive pages' : 'お題アーカイブのページ'}">
      ${pageButtons.join('')}
    </div>
    <span class="daily-prompt-page-status">${isEn ? `${dailyPromptArchivePage + 1} / ${totalPages} · ${totalItems} topics` : `${dailyPromptArchivePage + 1} / ${totalPages} ・ 全${totalItems}件`}</span>
    <button type="button" class="daily-prompt-page-btn" data-prompt-page-action="next" ${dailyPromptArchivePage >= totalPages - 1 ? 'disabled' : ''}>
      ${isEn ? 'Next' : '次へ'}
    </button>
  `;
}

// 自分が投稿したお題かどうか判定（localPromptSuggestionsにclientIdが存在するか）
function isMyPrompt(item) {
  if (!item) return false;
  const key = item.clientId || item.id;
  return localPromptSuggestions.some(l => (l.clientId || l.id) === key);
}

// お題がFirebaseに反映済みかどうか判定（latestRemoteに存在するか）
function isPromptSynced(item) {
  if (!item) return false;
  const key = item.clientId || item.id;
  return latestRemotePromptSuggestions.some(r => (r.clientId || r.id) === key);
}

// ローカルのゴースト投稿を削除する
function deleteLocalPromptSuggestion(clientId) {
  localPromptSuggestions = localPromptSuggestions.filter(l => (l.clientId || l.id) !== clientId);
  localStorage.setItem('popopo_prompt_suggestions', JSON.stringify(localPromptSuggestions));
  renderDailyPrompt();
  showToast('削除しました。');
}

// お題を再送信する（Firebase未反映の場合）
async function retrySyncPrompt(clientId) {
  const item = localPromptSuggestions.find(l => (l.clientId || l.id) === clientId);
  if (!item || !db) { showToast('再送信できませんでした。'); return; }
  const voteId = getPromptVoteId(item);
  try {
    // お題本体の送信
    await db.collection('prompt_suggestions').add({
      clientId: item.clientId || item.id,
      text: item.text,
      nickname: item.nickname,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    // 初期投票（1票目）の同期も試みる
    localPromptVotes[voteId] = Date.now();
    localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes));
    localPendingPromptVotes.add(voteId);
    updatePromptVoteButton(voteId);
    await db.collection('likes').doc(voteId).set({
      count: firebase.firestore.FieldValue.increment(1),
    }, { merge: true });
    schedulePromptVotePendingFallbackClear(voteId);

    showToast('再送信しました！✓');
  } catch (e) {
    delete localPromptVotes[voteId];
    localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes));
    localPendingPromptVotes.delete(voteId);
    updatePromptVoteButton(voteId);
    showToast('再送信に失敗しました。接続を確認してください。');
    console.warn('Retry sync failed:', e);
  }
}

// お題を編集する（Firebase反映済みの場合はFirestoreも更新）
async function editPromptSuggestion(clientId, newText) {
  const cleanText = String(newText || '').trim();
  if (!cleanText) return;
  // ローカルを更新
  const localItem = localPromptSuggestions.find(l => (l.clientId || l.id) === clientId);
  if (localItem) {
    localItem.text = cleanText;
    localStorage.setItem('popopo_prompt_suggestions', JSON.stringify(localPromptSuggestions));
  }
  // Firestoreも更新（そのドキュメントを探す）
  if (db) {
    try {
      const snap = await db.collection('prompt_suggestions').where('clientId', '==', clientId).limit(1).get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({ text: cleanText });
        showToast('編集しました！✓');
      } else {
        showToast('ローカルのみ編集しました（未反映のため）。');
      }
    } catch (e) {
      console.warn('Prompt edit failed:', e);
      showToast('編集に失敗しました。');
    }
  }
  renderDailyPrompt();
}

function renderDailyPromptCandidates() {
  const list = document.getElementById('dailyPromptList');
  const empty = document.getElementById('dailyPromptEmpty');
  if (!list) return;
  const merged = getPromptArchiveItems();
  if (!merged.length) {
    list.innerHTML = '';
    renderDailyPromptPagination(0, 0);
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  const isEn = currentLanguage === 'en';
  const todayInfo = currentDailyPromptInfo || getDailyPromptInfo();
  const leadingId = todayInfo.source === 'community' ? todayInfo.id : null;
  const totalPages = Math.max(1, Math.ceil(merged.length / PROMPT_ARCHIVE_PAGE_SIZE));
  dailyPromptArchivePage = Math.max(0, Math.min(dailyPromptArchivePage, totalPages - 1));
  const pageStart = dailyPromptArchivePage * PROMPT_ARCHIVE_PAGE_SIZE;
  renderDailyPromptPagination(merged.length, totalPages);
  list.innerHTML = merged.slice(pageStart, pageStart + PROMPT_ARCHIVE_PAGE_SIZE).map((item, idx) => {
    const id = item.clientId || item.id;
    const voted = isPromptVoted(item);
    const pending = isPromptVotePending(item);
    const count = getPromptVoteCount(item);
    const isLeading = id === leadingId;
    const nick = item.nickname || '匿名リスナー';
    const suggestedAt = formatPromptSuggestedAt(item.timestamp);
    const isMine = isMyPrompt(item);
    const synced = isPromptSynced(item);
    const syncBadge = isMine && !synced
      ? `<span class="prompt-sync-badge">${isEn ? '⚠ Syncing' : '⚠ 未反映'}</span>`
      : '';
    const leadingTag = isEn ? '🌿 Today’s topic' : '🌿 今日のお題に表示中';
    const myActions = isMine ? `
      <div class="prompt-my-actions">
        ${!synced ? `<button type="button" class="prompt-action-btn prompt-retry-btn" data-prompt-retry-id="${escapeHtml(id)}" title="再送信">🔄 再送信</button>` : ''}
        <button type="button" class="prompt-action-btn prompt-edit-btn" data-prompt-edit-id="${escapeHtml(id)}" data-prompt-text="${escapeHtml(item.text)}" title="編集">✏️ 編集</button>
        ${!synced ? `<button type="button" class="prompt-action-btn prompt-delete-btn" data-prompt-delete-id="${escapeHtml(id)}" title="削除（未反映分のみ）">🗑 削除</button>` : ''}
      </div>` : '';
    return `
      <li class="daily-prompt-item${isLeading ? ' is-leading' : ''}${isMine ? ' is-mine' : ''}" data-prompt-id="${escapeHtml(id)}">
        <span class="daily-prompt-item-rank" aria-hidden="true">${pageStart + idx + 1}</span>
        <div class="daily-prompt-item-body">
          <p class="daily-prompt-item-text">${escapeHtml(item.text)}</p>
          <div class="daily-prompt-item-foot">
            <span class="daily-prompt-item-nick">— ${escapeHtml(nick)}</span>
            <span class="daily-prompt-item-date">${escapeHtml(suggestedAt)}</span>
            ${syncBadge}
            ${isLeading ? `<span class="daily-prompt-item-leading-tag">${leadingTag}</span>` : ''}
            <button type="button" class="prompt-post-action-btn" data-prompt-text="${escapeHtml(item.text)}" title="${isEn ? 'Post with this topic' : 'このお題でつぶやく'}">
              💬 ${isEn ? 'Use Topic' : 'つぶやく'}
            </button>
          </div>
          ${myActions}
        </div>
        <button type="button" class="daily-prompt-vote-btn${voted ? ' is-voted' : ''}${pending ? ' is-pending' : ''}" data-prompt-vote-id="${escapeHtml(id)}" aria-pressed="${voted ? 'true' : 'false'}" ${voted ? 'disabled' : ''} aria-label="このお題に共感する">
          <span class="daily-prompt-vote-icon" aria-hidden="true">${voted ? '♥' : '♡'}</span>
          <span class="daily-prompt-vote-count">${count}</span>
        </button>
      </li>
    `;
  }).join('');
}

async function submitPromptSuggestion({ text, nickname }) {
  const cleanText = String(text || '').trim();
  if (!cleanText) return null;
  const cleanNick = String(nickname || '').trim() || '匿名リスナー';
  const clientId = 'pr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const item = { id: clientId, clientId, text: cleanText, nickname: cleanNick, timestamp: Date.now() };
  localPromptSuggestions.unshift(item);
  localStorage.setItem('popopo_prompt_suggestions', JSON.stringify(localPromptSuggestions));
  dailyPromptArchivePage = 0;
  // 提案者は自動で1票
  const voteId = getPromptVoteId(item);
  localPromptVotes[voteId] = Date.now();
  localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes));
  localPendingPromptVotes.add(voteId);
  // 初回の通知ベースラインを 1 票（自分の投票分）にしておく
  lastSeenPromptVotes[voteId] = 1;
  try { localStorage.setItem(PROMPT_VOTE_LAST_SEEN_KEY, JSON.stringify(lastSeenPromptVotes)); } catch (e) {}
  renderDailyPrompt();

  if (!db) {
    localPendingPromptVotes.delete(voteId);
    updatePromptVoteButton(voteId);
    return item;
  }

  // ① お題本体の保存（失敗時は auto-vote も巻き戻す）
  let suggestionSynced = false;
  try {
    await db.collection('prompt_suggestions').add({
      clientId,
      text: cleanText,
      nickname: cleanNick,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    suggestionSynced = true;
  } catch (e) {
    console.warn('Prompt suggestion sync failed:', e);
    showToast('お題の保存に失敗しました。「再送信」ボタンでもう一度試せます。');
    // お題自体が出ていないなら auto-vote も成立しないのでロールバック
    delete localPromptVotes[voteId];
    localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes));
    delete lastSeenPromptVotes[voteId];
    try { localStorage.setItem(PROMPT_VOTE_LAST_SEEN_KEY, JSON.stringify(lastSeenPromptVotes)); } catch (e2) {}
    localPendingPromptVotes.delete(voteId);
    updatePromptVoteButton(voteId);
    return item;
  }

  // ② auto-vote の Firestore 反映（失敗時はその +1 だけを巻き戻す）
  if (suggestionSynced) {
    try {
      await db.collection('likes').doc(voteId).set({
        count: firebase.firestore.FieldValue.increment(1),
      }, { merge: true });
      schedulePromptVotePendingFallbackClear(voteId);
    } catch (e) {
      console.warn('Prompt auto-vote sync failed:', e);
      delete localPromptVotes[voteId];
      localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes));
      delete lastSeenPromptVotes[voteId];
      try { localStorage.setItem(PROMPT_VOTE_LAST_SEEN_KEY, JSON.stringify(lastSeenPromptVotes)); } catch (e2) {}
      localPendingPromptVotes.delete(voteId);
      updatePromptVoteButton(voteId);
    }
  }
  return item;
}

async function votePromptSuggestion(rawId, skipOptimistic = false) {
  if (!rawId) return;
  const voteId = getPromptVoteId(rawId); // ここで確実に 'prompt_vote_pr_...' 形式にする

  // 楽観的にローカル状態を更新（クリックハンドラが既に同じことをしている場合は skip）
  if (!skipOptimistic) {
    if (localPromptVotes[voteId]) return;
    localPromptVotes[voteId] = Date.now();
    localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes));
    localPendingPromptVotes.add(voteId);
    updatePromptVoteButton(voteId);
  }

  if (!db) {
    localPendingPromptVotes.delete(voteId);
    updatePromptVoteButton(voteId);
    return;
  }

  try {
    await db.collection('likes').doc(voteId).set({
      count: firebase.firestore.FieldValue.increment(1),
    }, { merge: true });
    // 成功後も listener の確定値を待つ。届かない場合だけ数秒後にペンディング表示を解除。
    schedulePromptVotePendingFallbackClear(voteId);
    return true;
  } catch (e) {
    // 失敗 — 楽観的加算を巻き戻す（最重要バグ修正）
    delete localPromptVotes[voteId];
    localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes));
    localPendingPromptVotes.delete(voteId);
    updatePromptVoteButton(voteId);
    showToast('投票の送信に失敗しました。少し時間を置いてもう一度お試しください。');
    console.warn('Prompt vote sync failed:', e);
    return false;
  }
}

// 投票ボタンの見た目（チェック状態 / カウント / ペンディング）をその場で更新するヘルパー。
// renderDailyPrompt のような全消し再描画を避けることで、粒子アニメや入力中フォーカスが飛ばない。
function updatePromptVoteButton(voteId) {
  if (!voteId) return;
  const clientId = voteId.replace(/^prompt_vote_/, '');
  const voted = Boolean(localPromptVotes[voteId]);
  const pending = localPendingPromptVotes.has(voteId);
  const merged = mergePromptSuggestions();
  const suggestion = merged.find(m => {
    const ids = getPromptGroupIds(m);
    return ids.includes(clientId);
  });
  const count = suggestion ? getPromptVoteCount(suggestion) : ((globalLikes[voteId] || 0) + (pending ? 1 : 0));
  const targetIds = suggestion
    ? Array.from(new Set([getPromptRawId(suggestion), ...getPromptGroupIds(suggestion)].filter(Boolean)))
    : [clientId];
  const buttons = targetIds.flatMap(id => Array.from(document.querySelectorAll(`.daily-prompt-vote-btn[data-prompt-vote-id="${id}"]`)));
  buttons.forEach(btn => {
    const btnVoteId = getPromptVoteId(btn.dataset.promptVoteId);
    const groupedVoted = suggestion ? isPromptVoted(suggestion) : Boolean(localPromptVotes[btnVoteId]);
    const groupedPending = suggestion ? isPromptVotePending(suggestion) : localPendingPromptVotes.has(btnVoteId);
    btn.classList.toggle('is-voted', groupedVoted);
    btn.classList.toggle('is-pending', groupedPending);
    btn.disabled = groupedVoted;
    btn.setAttribute('aria-pressed', groupedVoted ? 'true' : 'false');
    const icon = btn.querySelector('.daily-prompt-vote-icon');
    if (icon) icon.textContent = groupedVoted ? '♥' : '♡';
    const countCell = btn.querySelector('.daily-prompt-vote-count');
    if (countCell) countCell.textContent = count;
  });
  // トップの「今日のお題」メタ表示も更新
  const info = currentDailyPromptInfo;
  if (info && info.source === 'community' && targetIds.includes(info.id)) {
    info.votes = count;
    const meta = document.getElementById('dailyPromptMeta');
    if (meta) {
      const nick = (info.nickname || '匿名リスナー').replace(/[<>&]/g, '');
      const badge = info.isGacha
        ? '<span class="pill" style="background:rgba(232,67,147,0.12);color:#d63031;">🎲 ガチャ表示中</span>'
        : '<span class="pill">みんなのお題</span>';
      meta.innerHTML = `${badge}${nick} さんの提案 ・ ♡ ${count}`;
    }
  }
}

// 投票ボタンの近くに「+1」がふわっと浮上するエフェクト
function showFloatingPlusOne(anchorBtn) {
  if (!anchorBtn) return;
  const rect = anchorBtn.getBoundingClientRect();
  const span = document.createElement('span');
  span.className = 'vote-plus-one';
  span.textContent = '+1';
  span.style.left = (rect.left + rect.width / 2) + 'px';
  span.style.top = (rect.top + rect.height / 2 - 8) + 'px';
  document.body.appendChild(span);
  setTimeout(() => span.remove(), 1300);
}

// 反応の種類ごとの「押した人へのお礼バブル」。内容に合わせた言葉にする。
const REACTION_EFFECT_MESSAGES = {
  spotLike: {
    ja: ['行きたいリストに追加！', '素敵なお出かけになりますように✨', 'いつか行けますように🌸', 'メモしておきました🔖', '楽しみがひとつ増えました💖'],
    en: ['Added to your list!', 'Hope you get to go ✨', 'Saved for someday 🌸', 'Bookmarked 🔖', 'One more thing to look forward to 💖'],
  },
  reviewSeen: {
    ja: ['読んでくれてありがとう👀', '気持ち、届きました💖', '共感の輪が広がりました🌿', 'あたたかい目線をありがとう🌸', 'うれしい「見たよ」です✨'],
    en: ['Thanks for reading 👀', 'Your appreciation landed 💖', 'Sharing the warmth 🌿', 'Thanks for the kind look 🌸', 'A lovely "Seen" ✨'],
  },
  chatReaction: {
    ja: ['気持ち、届けました💐', 'やさしさが広がりました🌿', 'ありがとうのリアクション✨', 'ほっこり届きました💖', '共感の輪が広がりました🌸'],
    en: ['Your feeling was sent 💐', 'Kindness, passed on 🌿', 'A thank-you reaction ✨', 'Warmth delivered 💖', 'Sharing the empathy 🌸'],
  },
};
function reactionMessagesFor(kind) {
  const set = REACTION_EFFECT_MESSAGES[kind];
  if (!set) return null;
  return currentLanguage === 'en' ? set.en : set.ja;
}

// 粒子・バブルを button 直下ではなく画面に固定したオーバーレイで再生する。
// renderDailyPromptCandidates が innerHTML 全消ししても粒子が消えない。
function triggerReactionEffectOverlay(anchorBtn, customMessages) {
  if (!anchorBtn) return;
  const rect = anchorBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const overlay = document.createElement('div');
  overlay.className = 'reaction-overlay';
  overlay.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:0;height:0;pointer-events:none;z-index:9998;`;
  document.body.appendChild(overlay);

  const icons = ['🌸', '✨', '💖', '🦌', '🌿', '⭐'];
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('span');
    p.className = 'reaction-particle';
    p.textContent = icons[Math.floor(Math.random() * icons.length)];
    const angle = (Math.random() * 120 - 60) * (Math.PI / 180);
    const dist = 35 + Math.random() * 45;
    p.style.setProperty('--tx', Math.sin(angle) * dist + 'px');
    p.style.setProperty('--ty', -Math.cos(angle) * dist + 'px');
    p.style.setProperty('--rot', (Math.random() * 360) + 'deg');
    p.style.left = '0';
    p.style.top = '0';
    overlay.appendChild(p);
  }
  const defaultMessages = ['考えてくれてありがとう！', '素敵な一日になりますように✨', 'ほっこり届きました💖', '共感の輪が広がりました🌿', '温かい気持ちをありがとう🌸'];
  const messages = Array.isArray(customMessages) && customMessages.length ? customMessages : defaultMessages;
  const bubble = document.createElement('div');
  bubble.className = 'reaction-bubble';
  bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
  overlay.appendChild(bubble);

  setTimeout(() => overlay.remove(), 1800);
}

// 自分が提案したお題に新しい票が届いていたら、再訪時に一度だけお礼トーストで知らせる。
// メッセージ文字列を返す（実際の表示は checkMyEngagementNotifications がまとめて行う）。
function checkMyPromptVoteNotifications() {
  if (!Array.isArray(localPromptSuggestions) || localPromptSuggestions.length === 0) return null;
  const isEn = currentLanguage === 'en';
  let totalNew = 0;
  let topPrompt = null;
  let topDelta = 0;
  let touched = false;

  localPromptSuggestions.forEach(p => {
    const voteId = getPromptVoteId(p);
    if (!voteId) return;
    const current = globalLikes[voteId] || 0;
    if (current <= 0) return;
    // 初回の基準値は 1（提案者自身の自動投票分）。それ以降は前回確認時の値。
    const baseline = lastSeenPromptVotes[voteId] != null ? lastSeenPromptVotes[voteId] : 1;
    if (current > baseline) {
      const delta = current - baseline;
      totalNew += delta;
      if (delta > topDelta) {
        topDelta = delta;
        topPrompt = p;
      }
    }
    if (lastSeenPromptVotes[voteId] !== current) {
      lastSeenPromptVotes[voteId] = current;
      touched = true;
    }
  });

  if (touched) {
    try {
      localStorage.setItem(PROMPT_VOTE_LAST_SEEN_KEY, JSON.stringify(lastSeenPromptVotes));
    } catch (e) {}
  }
  if (totalNew > 0 && topPrompt) {
    const raw = String(topPrompt.text || '');
    const snippet = raw.slice(0, 22) + (raw.length > 22 ? '…' : '');
    return isEn
      ? `Your topic "${snippet}" received ${totalNew} new ${totalNew === 1 ? 'vote' : 'votes'} 🌸`
      : `あなたの「${snippet}」に新しく ${totalNew} 票届きました 🌸`;
  }
  return null;
}

// 自分が投稿したおすすめスポットに新しく「行きたい」が届いていたら知らせる
function checkMySpotLikeNotifications() {
  if (!Array.isArray(localSuggestions) || localSuggestions.length === 0) return null;
  const isEn = currentLanguage === 'en';
  let totalNew = 0;
  let topSpot = null;
  let topDelta = 0;
  let touched = false;

  localSuggestions.forEach(s => {
    const id = String(s.clientId || s.id || '');
    if (!id) return;
    const current = globalLikes[id] || 0;
    if (current <= 0) return;
    // 初回の基準値は、自分が自分のスポットに付けた「行きたい」分（あれば 1）。
    const baseline = lastSeenSpotLikes[id] != null ? lastSeenSpotLikes[id] : (localLikes[id] ? 1 : 0);
    if (current > baseline) {
      const delta = current - baseline;
      totalNew += delta;
      if (delta > topDelta) {
        topDelta = delta;
        topSpot = s;
      }
    }
    if (lastSeenSpotLikes[id] !== current) {
      lastSeenSpotLikes[id] = current;
      touched = true;
    }
  });

  if (touched) {
    try { localStorage.setItem(SPOT_LIKE_LAST_SEEN_KEY, JSON.stringify(lastSeenSpotLikes)); } catch (e) {}
  }
  if (totalNew > 0 && topSpot) {
    const raw = String(topSpot.name || '');
    const name = raw.slice(0, 20) + (raw.length > 20 ? '…' : '');
    return isEn
      ? `${totalNew} ${totalNew === 1 ? 'person wants' : 'people want'} to visit your spot "${name}" 🔖`
      : `あなたのおすすめスポット「${name}」に新しく ${totalNew} 件の「行きたい」が届きました 🔖`;
  }
  return null;
}

// 自分が投稿した感想に新しく「見たよ」が届いていたら知らせる
function checkMyReviewSeenNotifications() {
  if (!Array.isArray(localPosts) || localPosts.length === 0) return null;
  const isEn = currentLanguage === 'en';
  let totalNew = 0;
  let touched = false;

  localPosts.forEach(p => {
    const id = getReviewReactionId(p, 'listener');
    if (!id) return;
    const current = globalLikes[id] || 0;
    if (current <= 0) return;
    // 初回の基準値は、自分が自分の感想に付けた「見たよ」分（あれば 1）。
    const baseline = lastSeenReviewSeen[id] != null ? lastSeenReviewSeen[id] : (localSeenReviews[id] ? 1 : 0);
    if (current > baseline) totalNew += current - baseline;
    if (lastSeenReviewSeen[id] !== current) {
      lastSeenReviewSeen[id] = current;
      touched = true;
    }
  });

  if (touched) {
    try { localStorage.setItem(REVIEW_SEEN_LAST_SEEN_KEY, JSON.stringify(lastSeenReviewSeen)); } catch (e) {}
  }
  if (totalNew > 0) {
    return isEn
      ? `${totalNew} ${totalNew === 1 ? 'person' : 'people'} saw your review 👀`
      : `あなたの感想を新しく ${totalNew} 人が見てくれました 👀`;
  }
  return null;
}

// 自分が投稿したフリートークに新しいリアクションが届いていたら知らせる
function checkMyChatReactionNotifications() {
  if (!Array.isArray(localChats) || localChats.length === 0) return null;
  const isEn = currentLanguage === 'en';
  let totalNew = 0;
  let touched = false;

  localChats.forEach(c => {
    ['thanks', 'curious'].forEach(type => {
      const id = getChatReactionId(c, type);
      if (!id) return;
      const current = globalLikes[id] || 0;
      if (current <= 0) return;
      const baseline = lastSeenChatReactions[id] != null ? lastSeenChatReactions[id] : (localChatReactions[id] ? 1 : 0);
      if (current > baseline) totalNew += current - baseline;
      if (lastSeenChatReactions[id] !== current) {
        lastSeenChatReactions[id] = current;
        touched = true;
      }
    });
  });

  if (touched) {
    try { localStorage.setItem(CHAT_REACTION_LAST_SEEN_KEY, JSON.stringify(lastSeenChatReactions)); } catch (e) {}
  }
  if (totalNew > 0) {
    return isEn
      ? `Your free-talk post received ${totalNew} new ${totalNew === 1 ? 'reaction' : 'reactions'} 💐`
      : `あなたのフリートーク投稿に新しく ${totalNew} 件のリアクションが届きました 💐`;
  }
  return null;
}

// 自分の投稿（お題・スポット・感想・フリートーク）に届いた新しい反応を、
// 再訪時にまとめてお礼トーストで知らせる。複数あっても重ならないよう順番に表示する。
function checkMyEngagementNotifications() {
  const messages = [
    checkMyPromptVoteNotifications(),
    checkMySpotLikeNotifications(),
    checkMyReviewSeenNotifications(),
    checkMyChatReactionNotifications(),
  ].filter(Boolean);
  messages.forEach((msg, i) => setTimeout(() => showToast(msg), i * 3100));
}

function triggerReactionEffect(btnElement) {
  if (!btnElement) return;
  const icons = ['🌸', '✨', '💖', '🦌', '🌿', '⭐'];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'reaction-particle';
    p.textContent = icons[Math.floor(Math.random() * icons.length)];
    const angle = (Math.random() * 120 - 60) * (Math.PI / 180);
    const dist = 35 + Math.random() * 45;
    const tx = Math.sin(angle) * dist + 'px';
    const ty = -Math.cos(angle) * dist + 'px';
    const rot = (Math.random() * 360) + 'deg';
    p.style.setProperty('--tx', tx);
    p.style.setProperty('--ty', ty);
    p.style.setProperty('--rot', rot);
    p.style.left = '50%';
    p.style.top = '50%';
    btnElement.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }

  const messages = ['考えてくれてありがとう！', '素敵な一日になりますように✨', 'ほっこり届きました💖', '共感の輪が広がりました🌿', '温かい気持ちをありがとう🌸'];
  const bubble = document.createElement('div');
  bubble.className = 'reaction-bubble';
  bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
  btnElement.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1700);
}

// Firestoreから取得したスナップショットをパースして共通処理を行う
function _processPromptSnap(docs) {
  // ① リモートデータをパース（orderByなしなのでJS側でソート）
  latestRemotePromptSuggestions = docs
    .map(d => {
      const data = d.data ? d.data() : d;
      return {
        id: d.id || data.clientId,
        clientId: data.clientId || d.id,
        text: data.text || '',
        nickname: data.nickname || '匿名リスナー',
        timestamp: data.timestamp?.toMillis?.() || (typeof data.timestamp === 'number' ? data.timestamp : Date.now()),
      };
    })
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // JS側で降順ソート

  // ② localPromptSuggestions をリモートと同期
  const remoteClientIds = new Set(
    latestRemotePromptSuggestions.map(r => r.clientId).filter(Boolean)
  );
  const now = Date.now();
  localPromptSuggestions = localPromptSuggestions.filter(l =>
    remoteClientIds.has(l.clientId || l.id) ||
    (now - (l.timestamp || 0)) < 30000
  );
  localStorage.setItem('popopo_prompt_suggestions', JSON.stringify(localPromptSuggestions));

  renderDailyPrompt();
}

function listenPromptSuggestions() {
  if (!db) return;

  // limit 50 だと 51 件目以降が永遠に届かないので 200 に引き上げ
  const unsubscribe = db.collection('prompt_suggestions')
    .limit(200)
    .onSnapshot(
      snap => _processPromptSnap(snap.docs),
      async err => {
        console.warn('Prompt suggestion listener failed:', err);
        // エラー詳細をトーストで出す（デバッグ用）
        if (err.code === 'permission-denied') {
          showToast('Firebaseの権限エラーです。Security Rulesの設定を確認してください。');
        }
        try {
          const snap = await db.collection('prompt_suggestions').limit(200).get();
          _processPromptSnap(snap.docs);
        } catch (e2) {
          console.warn('Prompt suggestion getDocs fallback also failed:', e2);
        }
      }
    );

  return unsubscribe;
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

function buildDiscoveryQueue(items, avoidKey = '') {
  // 訪問ごとに違う並び・違う先頭にするため、セッション毎の真ランダムシャッフルに切り替え。
  const spots = shuffleItems(items.filter(item => item.kind === 'spot'));
  const reviews = shuffleItems(items.filter(item => item.kind === 'review'));
  const queue = [];
  const max = Math.max(spots.length, reviews.length);
  const startWithReview = Math.random() < 0.5;

  for (let i = 0; i < max; i += 1) {
    if (startWithReview) {
      if (reviews[i]) queue.push(reviews[i]);
      if (spots[i]) queue.push(spots[i]);
    } else {
      if (spots[i]) queue.push(spots[i]);
      if (reviews[i]) queue.push(reviews[i]);
    }
  }

  // 直前に表示していたものが先頭に来ると「変わってない」と感じるので、
  // できる限り先頭を入れ替える（候補が他に1つ以上ある場合のみ）
  if (avoidKey && queue.length > 1 && getDiscoveryItemKey(queue[0]) === avoidKey) {
    const swapIdx = queue.findIndex((item, i) => i > 0 && getDiscoveryItemKey(item) !== avoidKey);
    if (swapIdx > 0) {
      const tmp = queue[0]; queue[0] = queue[swapIdx]; queue[swapIdx] = tmp;
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
  if (typeof adjustHeroPadding === 'function') adjustHeroPadding();
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
    // 直前のアイテムが画面に出ているなら、新キューでもその項目を維持して見せる。
    // 出ていない（初回・モーダル後など）はランダム先頭を許容。
    discoveryItems = buildDiscoveryQueue(items, currentKey);
    const preservedIndex = currentKey
      ? discoveryItems.findIndex(item => getDiscoveryItemKey(item) === currentKey)
      : -1;
    discoveryIndex = preservedIndex >= 0 ? preservedIndex : 0;
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
  // キューを最後まで巡回したら、直前の項目を避けて新しいシャッフルを作り直す
  if (discoveryIndex + 1 >= discoveryItems.length) {
    const items = getDiscoveryItems();
    if (items.length) {
      const lastKey = getDiscoveryItemKey(currentDiscoveryItem);
      discoveryItems = buildDiscoveryQueue(items, lastKey);
      discoveryIndex = 0;
      showDiscoveryItem(discoveryItems[0], true);
      return;
    }
  }
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
    const isActive = tab.dataset.cat === cat;
    tab.classList.toggle('active', isActive);
    if (isActive) {
      setTimeout(() => {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 50);
    }
  });
}

function getSuggestedSpotItems() {
  const merged = mergeSuggestions();
  return merged.map(s => {
    const meta = inferLocationMeta(s);
    return {
      id: s.id || s.clientId || '',
      cat: s.cat,
      catLabel: getCatLabel(s.cat),
      name: s.name,
      area: meta.area,
      pref: meta.pref || '',
      city: meta.city || '',
      areaNote: s.areaNote || '',
      url: s.url || '',
      resources: getSuggestionResources(s),
      memo: s.reason,
      intent: s.intent || 'recommend',
      budget: s.budget || '',
      suggested: true,
      suggestedBy: s.nickname || '匿名リスナー',
      timestamp: s.timestamp || 0,
      wifi: s.wifi || false,
      power: s.power || false,
      vegan: s.vegan || false,
      card: s.card || false,
      parking: s.parking || false,
      pet: s.pet || false,
      toilet: s.toilet || false,
      toiletRating: s.toiletRating || 0,
      accessibleToilet: s.accessibleToilet || false,
      barrierFree: s.barrierFree || false,
      nursingRoom: s.nursingRoom || false
    };
  });
}

// 数値を返す決定論的なハッシュ（FNV-1a）
function numericHash(value = '') {
  const str = String(value);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// シード付き擬似乱数（Mulberry32）。同じシードなら必ず同じ列を返す。
function makeSeededRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 日替わりシード付きの決定論シャッフル（Fisher-Yates）：
// その日のうちは順序が安定し、翌日になると並びが完全に一新される。
// 全アイテムが平等に上位に来る機会を持つ。
function dailyShuffle(items, keyFn) {
  if (!Array.isArray(items) || items.length <= 1) return [...items];
  const dayIdx = getDayIndex();
  const seed = numericHash(`popopo-rotation-${dayIdx}`);
  const rng = makeSeededRng(seed);
  // 入力順への依存を排除するため、まずキーで安定ソート
  const arr = [...items].sort((a, b) =>
    String(keyFn(a) || '').localeCompare(String(keyFn(b) || ''))
  );
  // シード付きFisher-Yatesで一様シャッフル
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

// 注：以前カード一覧を日替わりシャッフルにしていましたが、
// 「新着順の方が見やすい」というご意見により、元の並び（提案＝新着順、SPOTS=配列順）に戻しています。
// 埋もれの救済は画面上部の #weeklyDiscoveryCard の日替わりローテーションで担保。
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
    <button type="button" class="gacha-result-card premium-3d-rise"${staggerStyle} data-kind="${escHtml(kind)}" data-id="${escHtml(item.id || '')}" data-cat="${escHtml(item.cat || '')}" data-spot="${escHtml(item.spotName || item.title || '')}" data-title="${escHtml(item.title || '')}">
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

  // Reset Gacha Wheel wrapper, rotation, and watercolor splash canvas
  const wrapper = document.getElementById('gachaWheelWrapper');
  if (wrapper) {
    wrapper.style.display = '';
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'scale(1)';
  }
  const wheel = document.getElementById('gachaWheel');
  if (wheel) {
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    void wheel.offsetHeight; // Force reflow to immediately reset transition
    wheel.style.transition = 'transform 3.5s cubic-bezier(0.15, 0.85, 0.35, 1)';
  }
  const splashCanvas = document.getElementById('gachaSplashCanvas');
  if (splashCanvas) {
    splashCanvas.innerHTML = '';
  }
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

  // Make sure the wheel wrapper is hidden once results are active
  const wrapper = document.getElementById('gachaWheelWrapper');
  if (wrapper) {
    wrapper.style.display = 'none';
  }

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

function triggerWatercolorSplash() {
  const canvas = document.getElementById('gachaSplashCanvas');
  if (!canvas) return;
  canvas.innerHTML = '';

  const colors = [
    'rgba(255, 229, 229, 0.85)', // Sector 1: Pink (Food)
    'rgba(229, 244, 227, 0.85)', // Sector 2: Green (Nature)
    'rgba(230, 238, 250, 0.85)', // Sector 3: Blue (Museum)
    'rgba(253, 243, 227, 0.85)', // Sector 4: Cream (Shop)
    'rgba(234, 230, 250, 0.85)', // Sector 5: Purple (Relax)
    'rgba(255, 251, 229, 0.85)', // Sector 6: Yellow (Views)
    'rgba(229, 244, 236, 0.85)', // Sector 7: Mint (Event)
    'rgba(247, 230, 250, 0.85)'  // Sector 8: Lavender (Entertainment)
  ];

  const blobCount = 8;
  for (let i = 0; i < blobCount; i++) {
    const blob = document.createElement('div');
    blob.className = 'gacha-splash-blob';
    
    const size = Math.floor(Math.random() * 40) + 50; // 50px to 90px
    const color = colors[i % colors.length];
    
    const angle = (i * (360 / blobCount)) + (Math.random() * 20 - 10);
    const rad = (angle * Math.PI) / 180;
    const distance = Math.floor(Math.random() * 50) + 70; // 70px to 120px
    const dx = Math.round(Math.cos(rad) * distance);
    const dy = Math.round(Math.sin(rad) * distance);

    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 80%)`;
    blob.style.setProperty('--splash-dx', `${dx}px`);
    blob.style.setProperty('--splash-dy', `${dy}px`);
    
    canvas.appendChild(blob);
    
    setTimeout(() => {
      blob.classList.add('animate');
    }, Math.random() * 40);
  }
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

  // Segment Alignment Math: Identify category segment and calculate exact rotation
  const selectedItem = outcome.items[0];
  const cat = selectedItem ? selectedItem.cat : 'food';
  const catAngles = {
    food: 22.5,
    mohinga: 22.5,
    nature: 67.5,
    museum: 112.5,
    book: 112.5,
    shop: 157.5,
    relax: 202.5,
    view: 247.5,
    event: 292.5,
    entertainment: 337.5
  };
  const baseAngle = catAngles[cat] || 22.5;
  const spins = 5;
  const jitter = (Math.random() * 24 - 12); // ±12 deg organic jitter
  const targetRotation = (360 * spins) - baseAngle + jitter;

  const wheel = document.getElementById('gachaWheel');
  if (wheel) {
    wheel.style.transform = `rotate(${targetRotation}deg)`;
  }

  // Ticker timer for slowly reducing category/text flickering (matching physical easing)
  const duration = 3500;
  const startTime = performance.now();

  const tick = () => {
    const elapsed = performance.now() - startTime;
    if (elapsed >= duration) {
      return;
    }

    const sample = pool[Math.floor(Math.random() * pool.length)];
    const categoryLabel = getCatLabel(sample.cat);
    spinText.textContent = getDiscoveryTitle(sample, categoryLabel);

    const p = elapsed / duration;
    // Quadratic delay mapping from 50ms up to 450ms matching the wheel's deceleration curve
    const delay = 50 + (400 * Math.pow(p, 2));
    gachaSpinTickTimer = window.setTimeout(tick, delay);
  };
  gachaSpinTickTimer = window.setTimeout(tick, 50);

  gachaSpinTimer = window.setTimeout(() => {
    if (gachaSpinTickTimer) {
      window.clearTimeout(gachaSpinTickTimer);
      gachaSpinTickTimer = null;
    }

    // Trigger watercolor splash at the center
    triggerWatercolorSplash();

    // Gracefully fade the wheel out from view
    const wrapper = document.getElementById('gachaWheelWrapper');
    if (wrapper) {
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'scale(0.85)';
    }

    // Transition to outcomes card display after fade is partially complete
    gachaSpinTimer = window.setTimeout(() => {
      showGachaResult(outcome);
      if (wrapper) {
        wrapper.style.display = 'none';
      }
      gachaSpinTimer = null;
      gachaIsSpinning = false;
      if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.removeAttribute('aria-busy');
      }
      spin.removeAttribute('aria-busy');
    }, 300);
  }, duration);
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
  const isEn = currentLanguage === 'en';
  return `
    <button type="button" class="review-seen-btn ${isSeen ? 'is-seen' : ''}" data-review-seen-id="${escHtml(reviewId)}" aria-pressed="${isSeen ? 'true' : 'false'}">
      <span class="review-seen-icon">👀</span>
      <span class="review-seen-text">${isSeen ? (isEn ? 'Seen' : '見たよ済み') : (isEn ? 'Seen' : '見たよ')}</span>
      <span class="review-seen-count" id="like-count-${escHtml(reviewId)}">${count}</span>
    </button>
  `;
}

function isDirectImageUrl(url) {
  if (typeof url === 'string' && url.startsWith('data:image/')) {
    return true;
  }
  return /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(url || '');
}

function renderChatMessage(message) {
  if (!message) return '';
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = String(message).split(urlRegex);
  return parts.map(part => {
    if (part.match(/^https?:\/\/[^\s]+$/)) {
      if (isDirectImageUrl(part)) {
        return `
          <div class="chat-attached-image-container" style="margin-top:6px;">
            <a href="${escHtml(part)}" target="_blank" rel="noopener noreferrer">
              <img class="chat-attached-image" src="${escHtml(part)}" alt="User attached image" style="max-width:100%; max-height:280px; border-radius:8px; border:1px solid var(--border); display:block; object-fit:contain;">
            </a>
          </div>
        `;
      } else {
        return `<a href="${escHtml(part)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue); text-decoration:underline; word-break:break-all;">${escHtml(part)}</a>`;
      }
    }
    return escHtml(part);
  }).join('');
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
  const isEn = currentLanguage === 'en';
  if (isEn) {
    const postLabels = { photo: 'Photo', post: 'Post', info: 'Info' };
    const spotLabels = { reference: 'Reference', photo: 'Photo', info: 'Info' };
    return context === 'post'
      ? (postLabels[kind] || postLabels.info)
      : (spotLabels[kind] || spotLabels.reference);
  }
  if (context === 'post') {
    return POST_RESOURCE_KIND_LABELS[kind] || POST_RESOURCE_KIND_LABELS.info;
  }
  return SPOT_RESOURCE_KIND_LABELS[kind] || SPOT_RESOURCE_KIND_LABELS.reference;
}

function translateResourceLabel(label, context = 'spot') {
  if (currentLanguage !== 'en') return label;
  const map = {
    参考URL: 'Reference',
    写真: 'Photo',
    情報: 'Info',
    投稿URL: 'Post',
    投稿: 'Post',
    公式サイト: 'Official Site',
    食べログ: 'Review Site'
  };
  return map[label] || label || getResourceKindLabel('', context);
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

function renderResourcePreviewButton(imageUrl, title, caption = '') {
  if (!imageUrl) return '';
  const label = currentLanguage === 'en' ? 'Open image' : '画像を開く';
  return `
    <button type="button" class="resource-preview-button" data-resource-image="${escHtml(imageUrl)}" data-resource-title="${escHtml(title || label)}" data-resource-caption="${escHtml(caption || '')}" aria-label="${escHtml(label)}">
      <img class="spot-preview-img" src="${escHtml(imageUrl)}" alt="" loading="lazy">
    </button>
  `;
}

function renderResourceLinks(resources = [], context = 'spot', className = 'spot-link') {
  if (!resources.length) return '';
  return resources.map((resource, i) => {
    const label = translateResourceLabel(resource.label || getResourceKindLabel(resource.kind, context), context);
    const suffix = resources.length > 1 ? i + 1 : '';
    const displayLabel = label + suffix;
    if (isDirectImageUrl(resource.url)) {
      return `<button type="button" class="${className} ${className}--${escHtml(resource.kind || '')} resource-image-link" data-resource-image="${escHtml(resource.url)}" data-resource-title="${escHtml(displayLabel)}" data-resource-caption="${escHtml(context === 'spot' ? 'スポット投稿の写真' : 'みんなの感想の写真')}">${getResourceIcon(resource.kind)} ${escHtml(displayLabel)}</button>`;
    }
    return `<a href="${escHtml(resource.url)}" target="_blank" rel="noopener" class="${className} ${className}--${escHtml(resource.kind || '')}">${getResourceIcon(resource.kind)} ${escHtml(displayLabel)}</a>`;
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
  const isEn = currentLanguage === 'en';
  if (total <= initialCount) {
    btn.style.display = 'none';
    return;
  }
  btn.style.display = 'inline-flex';
  if (visible >= total) {
    btn.textContent = isEn ? 'Show Less' : '表示を少なくする';
    btn.dataset.mode = 'collapse';
  } else {
    btn.textContent = isEn ? `See More (${total - visible} left)` : `もっと見る（残り${total - visible}件）`;
    btn.dataset.mode = 'more';
  }
}

function getSpotReviews(spotName) {
  const target = String(spotName || '').trim();
  if (!target) return [];
  return sortNewest(dedupePosts(allPosts).filter(p => String(p.spotName || '').trim() === target));
}

function formatVisitDate(date) {
  if (!date) return currentLanguage === 'en' ? 'Unknown Date' : '日付不明';
  const d = new Date(date);
  if (currentLanguage === 'en') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getSavedSpotIds() {
  return Object.keys(localLikes).filter(id => localLikes[id]);
}

function getActiveSpotCategory() {
  return document.querySelector('.tab.active')?.dataset.cat || 'all';
}

function normalizePrefValue(pref = '') {
  let value = String(pref || '').trim();
  if (!value) return '';

  // 1. Strip English suffixes first (e.g. "Fukuoka Prefecture" -> "Fukuoka")
  value = value.replace(/\s+(prefecture|pref)$/i, '');

  // 2. Translate case-insensitive English to Japanese key
  const lowerVal = value.toLowerCase();
  for (const [jpKey, enVal] of Object.entries(ADDRESS_TRANSLATION_MAP)) {
    if (enVal && enVal.toLowerCase() === lowerVal) {
      value = jpKey;
      break;
    }
  }

  // 3. Strip Japanese suffixes
  if (value !== '北海道') {
    value = value.replace(/[都府県]$/g, '');
  }

  const knownPrefs = [
    '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島', '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
    '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫',
    '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎',
    '熊本', '大分', '宮崎', '鹿児島', '沖縄'
  ];

  // 4. Double check against known prefectures
  if (knownPrefs.includes(value)) {
    return value;
  }

  // Fallback: check if any key in knownPrefs is included in value
  for (const key of knownPrefs) {
    if (value.includes(key)) {
      return key;
    }
  }

  return value;
}

function normalizeCityValue(city = '') {
  return String(city || '').trim().replace(/\s+/g, '');
}

function inferLocationMeta(spot = {}) {
  const rawPref = normalizePrefValue(spot.pref || spot.prefecture);
  const rawCity = normalizeCityValue(spot.city || spot.municipality || spot.areaCity || spot.areaGroup);
  const area = String(spot.area || '').trim();
  const text = [spot.name, area, spot.memo, spot.reason].filter(Boolean).join(' ');
  let pref = rawPref;
  let city = rawCity;

  if (!pref && area) {
    const prefMatch = area.match(/(北海道|東京都|京都府|大阪府|[一-龥]{2,4}県)/);
    if (prefMatch) pref = normalizePrefValue(prefMatch[1]);
  }
  if (!city && area) {
    const areaWithoutPref = pref
      ? area
        .replace(`${pref}県`, '')
        .replace(`${pref}都`, '')
        .replace(`${pref}府`, '')
      : area;
    const cityMatch = areaWithoutPref.match(/([一-龥ぁ-んァ-ヶ]+(?:市|区|町|村))/);
    if (cityMatch) city = normalizeCityValue(cityMatch[1]);
  }
  if (pref && city) {
    const knownCity = (CITY_OPTIONS_BY_PREF[pref] || []).find(option =>
      city === option || city.startsWith(option) || city.includes(option)
    );
    if (knownCity) city = knownCity;
  }

  if (!city || !pref || city === 'エリア不明') {
    const matched = AREA_ALIAS_RULES.find(rule => rule.keywords.some(keyword => text.includes(keyword)));
    if (matched) {
      const hadPref = Boolean(pref);
      if (!pref || pref === '東京ほか') pref = matched.pref;
      if (!city || city === 'エリア不明' || !hadPref) city = matched.city;
    }
  }

  if (!pref && city) {
    const optionEntry = Object.entries(CITY_OPTIONS_BY_PREF).find(([, cities]) => cities.includes(city));
    if (optionEntry) pref = optionEntry[0];
  }
  if (!pref) pref = area.includes('全国') ? '全国' : area.includes('オンライン') ? 'オンライン' : '';
  if (!city && (pref === '全国' || pref === 'オンライン')) city = pref;

  return {
    pref,
    city,
    area: area || city || pref || 'エリア不明',
    label: city || pref || area || 'エリア不明'
  };
}

function normalizeAreaGroup(area = '', spot = {}) {
  const inferred = inferLocationMeta({ ...spot, area: area || spot.area });
  if (inferred.label && inferred.label !== 'エリア不明') return inferred.label;
  const value = String(area || '').trim();
  if (!value) return 'エリア不明';
  const cleaned = value
    .replace(/[（）]/g, '')
    .replace(/県|都|府/g, '')
    .replace(/市|区|町|村/g, '')
    .replace(/エリア|周辺|方面/g, '')
    .replace(/\s+/g, '');
  const first = cleaned.split(/[・、,／/｜|()（）-]/).filter(Boolean)[0] || value;
  if (first.includes('全国') || value.includes('全国')) return '全国';
  if (first.includes('オンライン') || value.includes('オンライン')) return 'オンライン';
  return first.slice(0, 10);
}

function getAreaFilterLabels(spot = {}) {
  const meta = inferLocationMeta(spot);
  const labels = [];
  const add = label => {
    const value = String(label || '').trim();
    if (!value || value === 'エリア不明' || labels.includes(value)) return;
    labels.push(value);
  };
  add(meta.city || normalizeAreaGroup(spot.area || spot.pref, spot));
  add(meta.pref);
  add(getAreaRegionLabel(meta));
  return labels.length ? labels : ['エリア不明'];
}

function getAreaRegionLabel(meta = {}) {
  if (meta.pref === '全国' || meta.pref === 'オンライン') return meta.pref;
  return AREA_REGION_BY_PREF[meta.pref] || meta.pref || '';
}

function getAreaFilterMeta(spots = [], cat = 'all') {
  const base = cat === 'all' ? spots : spots.filter(s => s.cat === cat);
  const regionCounts = new Map();
  const childCountsByRegion = new Map();
  base.forEach(spot => {
    const meta = inferLocationMeta(spot);
    const region = getAreaRegionLabel(meta);
    if (!region || region === 'エリア不明') return;
    regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
    if (!childCountsByRegion.has(region)) childCountsByRegion.set(region, new Map());
    const childCounts = childCountsByRegion.get(region);
    [meta.pref, meta.city].forEach(label => {
      const value = String(label || '').trim();
      if (!value || value === region || value === 'エリア不明') return;
      childCounts.set(value, (childCounts.get(value) || 0) + 1);
    });
  });
  return { regionCounts, childCountsByRegion };
}

function sortAreaEntries(entries, level = 'child') {
  const regionOrder = ['関東', '関西', '中国', '九州', '中部', '東北', '四国', '北海道', '沖縄', '全国', 'オンライン'];
  return entries.sort((a, b) => {
    if (level === 'region') {
      const ai = regionOrder.indexOf(a[0]);
      const bi = regionOrder.indexOf(b[0]);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    }
    const rank = label => PREFECTURE_OPTIONS.includes(label) ? 0 : 1;
    return rank(a[0]) - rank(b[0]) || b[1] - a[1] || a[0].localeCompare(b[0], 'ja');
  });
}

function renderAreaFilter(spots = [], cat = 'all') {
  const wrap = document.getElementById('areaFilter');
  if (!wrap) return;
  const { regionCounts, childCountsByRegion } = getAreaFilterMeta(spots, cat);
  const regions = sortAreaEntries(Array.from(regionCounts.entries()), 'region');
  if (regions.length <= 1) {
    activeAreaRegion = 'all';
    activeSpotArea = 'all';
    wrap.innerHTML = '';
    wrap.hidden = true;
    return;
  }
  if (activeAreaRegion !== 'all' && !regionCounts.has(activeAreaRegion)) {
    activeAreaRegion = 'all';
    activeSpotArea = 'all';
  }
  const activeChildren = activeAreaRegion === 'all'
    ? []
    : sortAreaEntries(Array.from(childCountsByRegion.get(activeAreaRegion)?.entries() || []), 'child');
  if (activeSpotArea !== 'all') {
    const valid = activeSpotArea === activeAreaRegion ||
      regions.some(([region]) => region === activeSpotArea) ||
      activeChildren.some(([child]) => child === activeSpotArea);
    if (!valid) activeSpotArea = activeAreaRegion === 'all' ? 'all' : activeAreaRegion;
  }
  wrap.hidden = false;
  const isEn = currentLanguage === 'en';
  const regionRow = [
    `<button type="button" class="area-chip area-chip-main ${activeSpotArea === 'all' ? 'active' : ''}" data-area="all" data-region="all" data-area-level="all">${isEn ? 'All' : 'すべて'}</button>`,
    ...regions.map(([region, count]) => {
      const displayRegion = isEn ? (ADDRESS_TRANSLATION_MAP[region] || region) : region;
      return `<button type="button" class="area-chip area-chip-main ${activeAreaRegion === region ? 'active' : ''}" data-area="${escHtml(region)}" data-region="${escHtml(region)}" data-area-level="region">${escHtml(displayRegion)} <span>${count}</span></button>`;
    })
  ].join('');
  const childRow = activeChildren.length
    ? `<div class="area-filter-row area-filter-row-sub">
        <button type="button" class="area-chip area-chip-sub ${activeSpotArea === activeAreaRegion ? 'active' : ''}" data-area="${escHtml(activeAreaRegion)}" data-region="${escHtml(activeAreaRegion)}" data-area-level="region">${isEn ? `All ${ADDRESS_TRANSLATION_MAP[activeAreaRegion] || activeAreaRegion}` : `${escHtml(activeAreaRegion)}すべて`}</button>
        ${activeChildren.map(([area, count]) => {
          const displayArea = isEn ? (ADDRESS_TRANSLATION_MAP[area] || area) : area;
          return `<button type="button" class="area-chip area-chip-sub ${activeSpotArea === area ? 'active' : ''}" data-area="${escHtml(area)}" data-region="${escHtml(activeAreaRegion)}" data-area-level="child">${escHtml(displayArea)} <span>${count}</span></button>`;
        }).join('')}
      </div>`
    : '';
  wrap.innerHTML = `<div class="area-filter-row">${regionRow}</div>${childRow}`;
}

function updateWantListButton() {
  const btn = document.getElementById('wantListToggleBtn');
  if (!btn) return;
  const count = getSavedSpotIds().length;
  const isEn = currentLanguage === 'en';
  btn.classList.toggle('active', showingWantList);
  btn.setAttribute('aria-pressed', showingWantList ? 'true' : 'false');
  btn.textContent = showingWantList
    ? (isEn ? `Back to All Spots (${count})` : `すべてのスポットに戻る（${count}）`)
    : (isEn ? `🔖 Want to Go (${count})` : `🔖 行きたいリスト（${count}）`);
}

function updateWantListHint(visibleSavedCount = 0) {
  const hint = document.getElementById('wantListHint');
  if (!hint) return;
  hint.hidden = !(showingWantList && visibleSavedCount > 0);
}

function updateBarrierFreeButton() {
  const btn = document.getElementById('barrierFreeFilterBtn');
  if (!btn) return;
  const isEn = currentLanguage === 'en';
  btn.classList.toggle('active', showingBarrierFreeOnly);
  btn.setAttribute('aria-pressed', showingBarrierFreeOnly ? 'true' : 'false');
  btn.textContent = showingBarrierFreeOnly
    ? (isEn ? '♿ Back to All Spots' : '♿ すべてのスポットに戻る')
    : (isEn ? '♿ Accessible Outings' : '♿ やさしいお出かけ');
}

function getBudgetLabel(value, isEn = currentLanguage === 'en') {
  const labels = {
    free: { ja: '無料', en: 'Free' },
    'under-1000': { ja: '〜1,000円', en: 'Under ¥1,000' },
    '1000-2000': { ja: '1,000〜2,000円', en: '¥1,000-2,000' },
    '2000-3000': { ja: '2,000〜3,000円', en: '¥2,000-3,000' },
    '3000-5000': { ja: '3,000〜5,000円', en: '¥3,000-5,000' },
    'over-5000': { ja: '5,000円〜', en: '¥5,000+' },
    unknown: { ja: '不明', en: 'Unknown' }
  };
  const label = labels[value];
  return label ? (isEn ? label.en : label.ja) : '';
}

function renderSpotAmenitiesHtml(s, isEn) {
  const badges = [];
  const budgetLabel = getBudgetLabel(s.budget, isEn);
  if (budgetLabel) badges.push(`<span class="amenity-badge amenity-badge--budget" title="${isEn ? 'Average budget' : '平均予算'}">💰 ${escHtml(budgetLabel)}</span>`);
  if (s.wifi) badges.push(`<span class="amenity-badge" title="${isEn ? 'Wi-Fi Available' : 'Wi-Fiあり'}">${isEn ? '📶 Wi-Fi' : '📶 Wi-Fi'}</span>`);
  if (s.power) badges.push(`<span class="amenity-badge" title="${isEn ? 'Power Outlet Available' : '電源あり'}">${isEn ? '🔌 Power' : '🔌 電源'}</span>`);
  if (s.vegan) badges.push(`<span class="amenity-badge" title="${isEn ? 'Vegan Friendly' : 'ビーガン対応'}">${isEn ? '🌱 Vegan' : '🌱 ビーガン'}</span>`);
  if (s.card) badges.push(`<span class="amenity-badge" title="${isEn ? 'Credit Card Accepted' : 'クレカ可'}">${isEn ? '💳 Credit Card' : '💳 クレカ可'}</span>`);
  if (s.qr) badges.push(`<span class="amenity-badge" title="${isEn ? 'QR Code Payment Accepted' : 'QRコード決済可'}">${isEn ? '📱 QR Code Pay' : '📱 QRコード決済可'}</span>`);
  if (s.parking) badges.push(`<span class="amenity-badge" title="${isEn ? 'Parking Available' : '駐車場あり'}">${isEn ? '🅿️ Parking' : '🅿️ 駐車場'}</span>`);
  if (s.pet) badges.push(`<span class="amenity-badge" title="${isEn ? 'Pets Allowed' : 'ペット可'}">${isEn ? '🐾 Pet-friendly' : '🐾 ペット可'}</span>`);
  if (s.toilet) {
    let ratingStr = '';
    if (s.toiletRating && s.toiletRating > 0) {
      ratingStr = ' ' + '★'.repeat(s.toiletRating) + '☆'.repeat(5 - s.toiletRating);
    }
    badges.push(`<span class="amenity-badge" title="${isEn ? 'Toilet Available' : 'トイレあり'}">${isEn ? '🚻 Restroom' : '🚻 トイレ'}${escHtml(ratingStr)}</span>`);
  }
  if (s.accessibleToilet) badges.push(`<span class="amenity-badge" title="${isEn ? 'Accessible Restroom' : '多目的トイレあり'}">${isEn ? '🚼 Accessible Restroom' : '🚼 多目的トイレ'}</span>`);
  if (s.barrierFree) badges.push(`<span class="amenity-badge" title="${isEn ? 'Wheelchair Accessible' : 'バリアフリー対応'}">${isEn ? '♿ Barrier-free' : '♿ バリアフリー'}</span>`);
  if (s.nursingRoom) badges.push(`<span class="amenity-badge" title="${isEn ? 'Nursing Room Available' : '授乳室あり'}">${isEn ? '🍼 Nursing Room' : '🍼 授乳室'}</span>`);
  if (badges.length === 0) return '';
  return `<div class="spot-amenities">${badges.join('')}</div>`;
}

function renderSpotCards(cat = 'all') {
  const grid = document.getElementById('spotsGrid');
  const allSpots = getAllSpotItemsForDisplay();
  let filtered = cat === 'all' ? allSpots : allSpots.filter(s => s.cat === cat);
  renderAreaFilter(allSpots, cat);
  if (activeSpotArea !== 'all') {
    filtered = filtered.filter(s => getAreaFilterLabels(s).includes(activeSpotArea));
  }
  if (showingWantList) {
    filtered = filtered.filter(s => localLikes[s.id]);
  }
  if (showingBarrierFreeOnly) {
    filtered = filtered.filter(s => s.accessibleToilet || s.barrierFree || s.nursingRoom);
  }
  const visibleSpots = filtered.slice(0, visibleSpotCount);
  updateWantListButton();
  updateBarrierFreeButton();
  updateWantListHint(filtered.length);
  const isEn = currentLanguage === 'en';
  if (showingWantList && filtered.length === 0) {
    grid.innerHTML = `
      <div class="spots-empty-card">
        <strong>${isEn ? 'No spots saved yet' : 'まだ行きたいスポットがありません'}</strong>
        <span>${isEn ? "Tap 'Want to Go' on any spot to collect them here." : '気になるスポットの「🔖 行きたい」を押すと、ここに集まります。'}</span>
      </div>
    `;
    setStatText('statSpots', allSpots.length);
    updateMoreButton('spotsMoreBtn', 0, 0, INITIAL_SPOT_COUNT);
    return;
  }
  grid.innerHTML = visibleSpots.map(s => {
    const reviews = getSpotReviews(s.name);
    const reviewCount = reviews.length;
    
    // Translation logic
    const spotTrans = SPOT_TRANSLATIONS[s.id] || {};
    const displayName = isEn && spotTrans.name ? spotTrans.name : s.name;
    const displayMemo = isEn && spotTrans.memo ? spotTrans.memo : (s.memo || s.reason || '');
    const displayArea = isEn ? convertToEnglishAddress(s.area, s.pref) : `${s.area}${s.pref && s.pref !== '東京' && s.pref !== '全国' && s.pref !== 'オンライン' ? '（' + s.pref + '）' : ''}`;
    const categoryLabel = getCatLabel(s.cat);
    
    const latestReviewText = reviews[0]?.comment ? truncateText(reviews[0].comment, 46) : '';
    const resources = getSuggestionResources(s);
    const previewImage = getResourcePreviewImage(resources);
    
    // Inbound tags and google maps link
    const gmapsUrl = getGoogleMapsUrl(s);
    const gmapsText = isEn ? '🗺️ Open in Google Maps' : '🗺️ Google Mapsで開く';
    const inboundTagsHtml = renderInboundTags(s, currentLanguage);
    
    // Like button config
    const isLiked = localLikes[s.id];
    const likeLabel = isEn ? (isLiked ? 'Saved' : 'Want to Go') : (isLiked ? '行きたい済み' : '行きたい');
    const likeIcon = isLiked ? '✅' : '🔖';
    
    const suggestedByText = isEn ? `Suggested by: ${s.suggestedBy}` : `提案者：${s.suggestedBy}`;
    const reviewsBtnLabel = isEn ? `💬 Reviews (${reviewCount})` : `💬 みんなの感想（${reviewCount}件）`;
    const postBtnLabel = isEn ? "📝 I've Been Here!" : '📝 行ってみた！';
    const recentReviewLabel = isEn ? 'Recent Review' : '最近の感想';

    return `
    <div class="spot-card" data-cat="${s.cat}" data-id="${s.id}">
      <div class="spot-card-top">
        <div class="spot-card-badges">
          <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);margin-bottom:0;font-size:0.8rem;">${categoryLabel}</span>
          ${s.intent === 'want' ? `<span class="spot-intent-badge">${isEn ? '🌱 Plan to Visit' : '🌱 これから行きたい'}</span>` : ''}
        </div>
        <div class="spot-card-actions">
          ${s.suggested ? renderPostActions(s, 'suggestion') : ''}
          <button class="spot-like-btn ${isLiked ? 'liked' : ''}" data-id="${s.id}" id="like-${s.id}" aria-pressed="${isLiked ? 'true' : 'false'}">
            <span class="spot-like-icon">${likeIcon}</span>
            <span class="spot-like-label">${likeLabel}</span>
            <span class="spot-like-count" id="like-count-${s.id}">${globalLikes[s.id] || isLiked || 0}</span>
          </button>
          <button class="spot-share-btn" type="button" data-id="${s.id}" aria-label="${escHtml(isEn ? `Share ${displayName}` : `${displayName}を共有`)}">
            <span class="spot-share-icon">↗</span>
            <span class="spot-share-label">${isEn ? 'Share' : '共有'}</span>
          </button>
        </div>
      </div>
      ${previewImage ? renderResourcePreviewButton(previewImage, displayName, displayMemo) : ''}
      <div class="spot-card-info">
        <div class="spot-name">${escHtml(displayName)}</div>
        <div class="spot-area">
          <span>📍 ${escHtml(displayArea)}</span>
          ${(s.weatherId || getWeatherIdByPref(s.pref)) ? `<span class="spot-card-weather" data-weather-id="${s.weatherId || getWeatherIdByPref(s.pref)}"></span>` : ''}
        </div>
        ${renderSpotAmenitiesHtml(s, isEn)}
        ${inboundTagsHtml}
        <a href="${gmapsUrl}" target="_blank" rel="noopener" class="spot-gmaps-btn">
          ${gmapsText}
        </a>
        ${displayMemo ? `<div class="spot-memo">${escHtml(displayMemo)}</div>` : ''}
        ${s.suggested ? `<div class="spot-memo" style="font-size:0.78rem;color:var(--text-dim);">${escHtml(suggestedByText)}</div>` : ''}
        ${(() => {
          const spotTextForTrans = `【${s.name}】\n${s.memo || s.reason || ''}`;
          const showSpotTransBtn = isEn 
            ? (!spotTrans.name && !spotTrans.memo) 
            : (spotTextForTrans.trim().length > 0);
          return showSpotTransBtn ? renderTranslationButton(spotTextForTrans) : '';
        })()}
      </div>
      ${resources.length ? `<div class="spot-resources">${renderResourceLinks(resources, 'spot', 'spot-link')}</div>` : ''}
      ${latestReviewText ? `
        <button type="button" class="spot-latest-review" data-spotname="${escHtml(s.name)}" aria-label="${escHtml(displayName)}のみんなの感想を見る">
          <span>${recentReviewLabel}</span>
          <strong>${escHtml(latestReviewText)}</strong>
        </button>
      ` : ''}
      <div class="spot-footer">
        <button class="spot-reviews-btn" data-spotname="${escHtml(s.name)}">${reviewsBtnLabel}</button>
        <button class="spot-post-btn" data-spotname="${escHtml(s.name)}">${postBtnLabel}</button>
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
      if (label) label.textContent = currentLanguage === 'en' ? 'Saved' : '行きたい済み';
      // 押した人へのご褒美：「+1」とお礼の粒子演出（お題と同じ仕組み）
      showFloatingPlusOne(btn);
      triggerReactionEffectOverlay(btn, reactionMessagesFor('spotLike'));
      updateWantListButton();
    });
  });
  grid.querySelectorAll('.spot-share-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sid = btn.dataset.id;
      const spot = allSpots.find(s => String(s.id) === String(sid));
      await shareSpot(spot);
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

  setStatText('statSpots', allSpots.length);
  updateMoreButton('spotsMoreBtn', filtered.length, Math.min(visibleSpotCount, filtered.length), INITIAL_SPOT_COUNT);
  queueAutoTranslateVisibleContent();
  fetchAndRenderSpotWeather();
}

function getCatLabel(cat) {
  const isEn = currentLanguage === 'en';
  return { 
    food: isEn ? '🍴 Food & Cafe' : '🍴 飲食店', 
    mohinga: isEn ? '🍜 Must-Try' : '🍜 食べたいもの', 
    museum: isEn ? '🎨 Art & Museum' : '🎨 美術館・博物館', 
    event: isEn ? '🌿 Events' : '🌿 イベント', 
    nature: isEn ? '🌳 Nature & Walk' : '🌳 自然・よりみち',
    book: isEn ? '📚 Book & Study' : '📚 本・しらべもの',
    shop: isEn ? '🛒 Lifestyle & Goods' : '🛒 くらし・雑貨',
    view: isEn ? '✨ Lovely Views' : '✨ おきにいりの景色',
    relax: isEn ? '🛁 Relax & Bath' : '🛁 癒やし・ととのう',
    entertainment: isEn ? '🎬 Fun & Media' : '🎬 エンタメ' 
  }[cat] || (isEn ? '📍 Spot' : '📍 スポット');
}

function formatMemo(memo) {
  return `<p>${escHtml(memo)}</p>`;
}

function renderSpotReviewCards(reviews) {
  const isEn = currentLanguage === 'en';
  return reviews.map(p => {
    const areaStr = p.area 
      ? `📍 ${isEn ? (ADDRESS_TRANSLATION_MAP[p.area] || p.area) : p.area}` 
      : (isEn ? '📍 Unknown Area' : '📍 エリア不明');
    const nickname = p.nickname || (isEn ? 'Anonymous' : '匿名リスナー');
    const media = getPostMedia(p);
    const previewImage = getResourcePreviewImage(media);
    const reviewSeenId = getReviewReactionId(p, 'listener');
    const translationHtml = renderTranslationButton(p.comment);
    return `
      <article class="spot-review-card">
        <div class="spot-review-head">
          <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);">${getCatLabel(p.cat)}</span>
          <span class="spot-review-rating">${renderStars(p.rating || 0)}</span>
        </div>
        <div class="spot-review-meta">${areaStr} &nbsp; 📅 ${formatVisitDate(p.visitDate)} &nbsp; 👤 ${escHtml(nickname)}</div>
        ${previewImage ? renderResourcePreviewButton(previewImage, p.spotName || (isEn ? 'Review photo' : '感想の写真'), p.comment || '') : ''}
        <div class="spot-review-comment">"${escHtml(p.comment)}"</div>
        ${translationHtml}
        ${media.length ? `<div class="visited-photos">${renderResourceLinks(media, 'post', 'visited-photo-link')}</div>` : ''}
        <div class="review-reactions">${renderSeenReviewButton(reviewSeenId)}</div>
      </article>
    `;
  }).join('');
}

function renderListenerReviewCard(p) {
  const isEn = currentLanguage === 'en';
  const dateStr = formatVisitDate(p.visitDate);
  const areaStr = p.area 
    ? `📍 ${isEn ? (ADDRESS_TRANSLATION_MAP[p.area] || p.area) : p.area}` 
    : (isEn ? '📍 Unknown Area' : '📍 エリア不明');
  const nickname = p.nickname || (isEn ? 'Anonymous' : '匿名リスナー');
  const media = getPostMedia(p);
  const previewImage = getResourcePreviewImage(media);
  const reviewSeenId = getReviewReactionId(p, 'listener');
  const translationHtml = renderTranslationButton([p.spotName, p.comment].filter(Boolean).join('\n'));
  return `
    <div class="visited-card">
      <div class="visited-card-body">
        <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);">${getCatLabel(p.cat)}</span>
        <div class="visited-name">${escHtml(p.spotName)}</div>
        <div class="visited-area">${areaStr} &nbsp; 📅 ${dateStr} &nbsp; 👤 ${escHtml(nickname)}</div>
        <div class="visited-rating">${renderStars(p.rating || 0)}</div>
        ${previewImage ? renderResourcePreviewButton(previewImage, p.spotName || (isEn ? 'Review photo' : '感想の写真'), p.comment || '') : ''}
        <div class="visited-review">"${escHtml(p.comment)}"</div>
        ${translationHtml}
        ${media.length ? `<div class="visited-photos">${renderResourceLinks(media, 'post', 'visited-photo-link')}</div>` : ''}
        <div class="review-reactions">${renderSeenReviewButton(reviewSeenId)}</div>
        ${renderPostActions(p, 'post')}
      </div>
    </div>
  `;
}

function renderOfficialReviewCard(v) {
  const reviewSeenId = getReviewReactionId(v, 'official');
  const isEn = currentLanguage === 'en';
  const spotTrans = SPOT_TRANSLATIONS[v.id] || {};
  const displayName = isEn && spotTrans.name ? spotTrans.name : v.name;
  const displayReview = isEn && spotTrans.memo ? spotTrans.memo : v.review;
  const displayArea = isEn ? (ADDRESS_TRANSLATION_MAP[v.area] || v.area) : v.area;
  const translationHtml = isEn && spotTrans.memo ? '' : renderTranslationButton(v.review);
  return `
    <div class="visited-card">
      <div class="visited-card-body">
        <span class="visited-category-badge" style="background:var(--blue-light);color:var(--blue);">${getCatLabel(v.cat)}</span>
        <div class="visited-name">${escHtml(displayName)}</div>
        <div class="visited-area">📍 ${displayArea}</div>
        <div class="visited-rating">${renderStars(v.rating)}</div>
        <div class="visited-review">"${escHtml(displayReview)}"</div>
        ${translationHtml}
        <div class="visited-photos">
          ${v.photos.map((p, i) => `<a href="${p.url}" target="_blank" rel="noopener" class="visited-photo-link">${isEn ? `📷 Photo ${i + 1}` : p.label}</a>`).join('')}
          ${v.url ? `<a href="${v.url}" target="_blank" rel="noopener" class="visited-photo-link">${isEn ? '🔗 Link' : '🔗 食べログ'}</a>` : ''}
        </div>
        ${v.book ? `
          <div class="visited-book">
            📚 <strong>${isEn ? 'Related Book:' : '関連本：'}</strong><a href="${v.book.url}" target="_blank" rel="noopener">${v.book.title}</a><br>
            <span style="font-size:0.78rem;opacity:0.7;">${v.book.note}</span>
          </div>` : ''}
        <div class="review-reactions">${renderSeenReviewButton(reviewSeenId)}</div>
      </div>
    </div>
  `;
}

function renderVisited(posts = []) {
  const grid = document.getElementById('visitedGrid');
  const sortedPosts = sortNewest(dedupePosts(posts));
  const listenerReviewKeys = new Set(sortedPosts.map(getReviewDisplayFingerprint));

  // 注：以前は古い感想を日替わりシャッフルにしていましたが、
  // 「新着順の方が見やすい」とのご意見により元の並びに戻しました。
  const officialCards = VISITED
    .filter(v => !listenerReviewKeys.has(getReviewDisplayFingerprint(v)))
    .map(renderOfficialReviewCard);
  const listenerCards = sortedPosts.map(renderListenerReviewCard);

  const allCards = [...listenerCards, ...officialCards];
  grid.innerHTML = allCards.slice(0, visibleReviewCount).join('');
  setStatText('statVisited', allCards.length);
  updateMoreButton('visitedMoreBtn', allCards.length, Math.min(visibleReviewCount, allCards.length), INITIAL_REVIEW_COUNT);
  queueAutoTranslateVisibleContent();
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
    const isEn = currentLanguage === 'en';
    const dateStr = new Date(chat.timestamp).toLocaleString(isEn ? 'en-US' : 'ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const nick = chat.nickname || (isEn ? 'Anonymous' : '匿名リスナー');
    const initial = Array.from(nick)[0].toUpperCase();
    const thanksId = getChatReactionId(chat, 'thanks');
    const curiousId = getChatReactionId(chat, 'curious');
    const cid = getChatKey(chat);
    const parent = chat.parentId ? chatMap.get(chat.parentId) : null;
    const parentNick = parent?.nickname || chat.parentNick || (isEn ? 'Original Post' : '元の投稿');
    const replyContext = chat.parentId
      ? `<div class="chat-reply-context">${isEn ? `↳ Reply to ${escHtml(parentNick)}` : `↳ ${escHtml(parentNick)} への返信`}</div>`
      : '';

    const thanksLabel = isEn ? 'Thanks' : 'ありがとう';
    const thanksReacted = isEn ? 'Thanked' : 'ありがとう済み';
    const curiousLabel = isEn ? 'Curious' : '気になる';
    const curiousReacted = isEn ? 'Curious' : '気になる済み';
    const replyLabel = isEn ? '💬 Reply' : '💬 返信';

    const translationHtml = renderTranslationButton(chat.message);

    return `
      <div class="chat-card ${depth > 0 ? 'is-reply' : ''}" data-chat-id="${escHtml(cid)}" data-depth="${Math.min(depth, 3)}">
        <div class="chat-avatar">${escHtml(initial)}</div>
        <div class="chat-content">
          <div class="chat-head">
            <span class="chat-nick">${escHtml(nick)}</span>
            <span class="chat-date">${dateStr}</span>
          </div>
          ${replyContext}
          <div class="chat-msg">${renderChatMessage(chat.message)}</div>
          ${translationHtml}
          <div class="chat-reactions">
            ${renderChatReactionButton(thanksId, '💐', thanksLabel, thanksReacted)}
            ${renderChatReactionButton(curiousId, '👀', curiousLabel, curiousReacted)}
            <button class="btn-reply" onclick="initiateReply('${escHtml(cid)}')">${replyLabel}</button>
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
          <div class="chat-replies-label">${currentLanguage === 'en' ? `${children.length} replies` : `返信 ${children.length}件`}</div>
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
  queueAutoTranslateVisibleContent();
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
  const isEn = currentLanguage === 'en';
  const allSpots = [
    ...SPOTS.map(s => ({ ...s, catLabel: getCatLabel(s.cat) })),
    ...localSuggestions.map(s => ({ name: s.name, area: s.area, catLabel: getCatLabel(s.cat) }))
  ];
  sel.innerHTML = `<option value="">${isEn ? '-- Select a spot --' : '-- スポットを選択 --'}</option>` +
    allSpots.map(s => `<option value="${s.name}"${s.name === preselect ? ' selected' : ''}>${s.catLabel} | ${s.name}（${s.area}）</option>`).join('');
}

function populateAddSpotPrefSelect() {
  const prefSelect = document.getElementById('asPref');
  if (!prefSelect) return;
  const isEn = currentLanguage === 'en';
  prefSelect.innerHTML = `<option value="">${isEn ? 'Select prefecture / region' : '都道府県を選択'}</option>` +
    PREFECTURE_OPTIONS.map(pref => `<option value="${escHtml(pref)}">${escHtml(isEn ? (ADDRESS_TRANSLATION_MAP[pref] || pref) : pref)}</option>`).join('');
  populateAddSpotCitySelect('');
}

function populateAddSpotCitySelect(pref = '', selectedCity = '') {
  const citySelect = document.getElementById('asCity');
  const customInput = document.getElementById('asCityCustom');
  if (!citySelect) return;
  const cities = CITY_OPTIONS_BY_PREF[pref] || [];
  const isEn = currentLanguage === 'en';
  citySelect.disabled = !pref;
  citySelect.innerHTML = `<option value="">${isEn ? 'Select city / ward' : '市区町村を選択'}</option>` +
    cities.map(city => `<option value="${escHtml(city)}">${escHtml(isEn ? (ADDRESS_TRANSLATION_MAP[city] || city) : city)}</option>`).join('') +
    (pref && pref !== '全国' && pref !== 'オンライン' ? `<option value="__custom">${isEn ? 'Enter a city not listed' : '候補にない市区町村を入力'}</option>` : '');
  if (selectedCity && cities.includes(selectedCity)) {
    citySelect.value = selectedCity;
  } else if (selectedCity && pref && pref !== '全国' && pref !== 'オンライン') {
    citySelect.value = '__custom';
    if (customInput) customInput.value = selectedCity;
  } else if (pref === '全国' || pref === 'オンライン') {
    citySelect.value = pref;
  }
  updateCustomCityVisibility();
  syncAddSpotAreaField();
}

function updateCustomCityVisibility() {
  const citySelect = document.getElementById('asCity');
  const customInput = document.getElementById('asCityCustom');
  if (!citySelect || !customInput) return;
  const isCustom = citySelect.value === '__custom';
  customInput.hidden = !isCustom;
  customInput.required = isCustom;
  if (!isCustom) customInput.value = '';
}

function getAddSpotLocationInput() {
  const pref = normalizePrefValue(document.getElementById('asPref')?.value || '');
  const citySelectValue = document.getElementById('asCity')?.value || '';
  const customCity = normalizeCityValue(document.getElementById('asCityCustom')?.value || '');
  const note = String(document.getElementById('asAreaNote')?.value || '').trim();
  const city = citySelectValue === '__custom' ? customCity : normalizeCityValue(citySelectValue);
  const areaCore = city || pref;
  const area = note ? `${areaCore}・${note}` : areaCore;
  return { pref, city, areaNote: note, area };
}

function syncAddSpotAreaField() {
  const areaInput = document.getElementById('asArea');
  if (!areaInput) return;
  areaInput.value = getAddSpotLocationInput().area;
}

function setAddSpotLocationFields(spot = {}) {
  const meta = inferLocationMeta(spot);
  const prefSelect = document.getElementById('asPref');
  const noteInput = document.getElementById('asAreaNote');
  const area = String(spot.area || '').trim();
  const savedNote = String(spot.areaNote || '').trim();
  let inferredNote = meta.city && area.includes(meta.city)
    ? area.replace(meta.city, '').replace(/^・|[（）()]/g, '').trim()
    : (area && area !== meta.city && area !== meta.pref ? area : '');
  if (inferredNote && meta.pref) {
    inferredNote = inferredNote
      .replace(`${meta.pref}県`, '')
      .replace(`${meta.pref}都`, '')
      .replace(`${meta.pref}府`, '')
      .replace(meta.pref, '')
      .replace(/^・|[（）()]/g, '')
      .trim();
  }
  const note = savedNote || inferredNote;
  if (prefSelect) prefSelect.value = meta.pref && PREFECTURE_OPTIONS.includes(meta.pref) ? meta.pref : '';
  populateAddSpotCitySelect(prefSelect?.value || '', meta.city);
  if (noteInput) noteInput.value = note && note !== meta.city && note !== meta.pref ? note : '';
  syncAddSpotAreaField();
}

// ============================================================
// 6. モーダル制御
// ============================================================
function captureAddSpotFormDraftState() {
  syncAddSpotAreaField();
  return {
    name: document.getElementById('asName')?.value || '',
    area: document.getElementById('asArea')?.value || '',
    pref: document.getElementById('asPref')?.value || '',
    city: document.getElementById('asCity')?.value || '',
    cityCustom: document.getElementById('asCityCustom')?.value || '',
    areaNote: document.getElementById('asAreaNote')?.value || '',
    cat: document.getElementById('asCat')?.value || '',
    budget: document.getElementById('asBudget')?.value || '',
    intent: getAddSpotIntent(),
    reason: document.getElementById('asReason')?.value || '',
    nick: document.getElementById('asNick')?.value || '',
    kinds: [1, 2, 3].map(i => document.getElementById(`asKind${i}`)?.value || ''),
    urls: [1, 2, 3].map(i => document.getElementById(`asUrl${i}`)?.value || ''),
    wifi: document.getElementById('asWifi')?.checked || false,
    power: document.getElementById('asPower')?.checked || false,
    vegan: document.getElementById('asVegan')?.checked || false,
    card: document.getElementById('asCard')?.checked || false,
    qr: document.getElementById('asQr')?.checked || false,
    parking: document.getElementById('asParking')?.checked || false,
    pet: document.getElementById('asPet')?.checked || false,
    toilet: document.getElementById('asToilet')?.checked || false,
    toiletRating: parseInt(document.getElementById('asToiletRating')?.value || '0', 10),
    accessibleToilet: document.getElementById('asAccessibleToilet')?.checked || false,
    barrierFree: document.getElementById('asBarrierFree')?.checked || false,
    nursingRoom: document.getElementById('asNursingRoom')?.checked || false
  };
}

function addSpotDraftStateHasText(state) {
  if (!state) return false;
  const parts = [state.name, state.area, state.pref, state.city, state.cityCustom, state.areaNote, state.budget, state.reason, state.nick, ...(state.urls || [])];
  const hasText = parts.some(p => String(p || '').trim().length > 0);
  const hasAmenities = state.wifi || state.power || state.vegan || state.card || state.qr || state.parking || state.pet || state.toilet || state.accessibleToilet || state.barrierFree || state.nursingRoom;
  return hasText || hasAmenities;
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
  const setChecked = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.checked = !!v;
  };
  setVal('asName', state.name);
  if (state.pref) {
    setVal('asPref', state.pref);
    populateAddSpotCitySelect(state.pref, state.city === '__custom' ? state.cityCustom : state.city);
  } else if (state.area) {
    setAddSpotLocationFields({ area: state.area });
  }
  setVal('asCityCustom', state.cityCustom);
  setVal('asAreaNote', state.areaNote);
  syncAddSpotAreaField();
  if (state.cat) setVal('asCat', state.cat);
  if (state.budget) setVal('asBudget', state.budget);
  if (state.intent) setAddSpotIntent(state.intent);
  setVal('asReason', state.reason);
  setVal('asNick', state.nick);
  for (let i = 0; i < 3; i += 1) {
    const k = state.kinds && state.kinds[i];
    const u = state.urls && state.urls[i];
    if (k) setVal(`asKind${i + 1}`, k);
    if (u != null) setVal(`asUrl${i + 1}`, u);
  }
  setChecked('asWifi', state.wifi);
  setChecked('asPower', state.power);
  setChecked('asVegan', state.vegan);
  setChecked('asCard', state.card);
  setChecked('asQr', state.qr);
  setChecked('asParking', state.parking);
  setChecked('asPet', state.pet);
  setChecked('asToilet', state.toilet);
  setChecked('asAccessibleToilet', state.accessibleToilet);
  setChecked('asBarrierFree', state.barrierFree);
  setChecked('asNursingRoom', state.nursingRoom);

  const rating = state.toiletRating || 0;
  setVal('asToiletRating', rating);
  document.querySelectorAll('.toilet-star-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.rating, 10) <= rating);
  });
  const ratingGroup = document.getElementById('asToiletRatingGroup');
  if (ratingGroup) {
    ratingGroup.style.display = state.toilet ? 'block' : 'none';
  }

  const reasonEl = document.getElementById('asReason');
  const charNum = document.getElementById('asCharNum');
  if (charNum && reasonEl) charNum.textContent = String((reasonEl.value || '').length);
}

function setAddSpotIntent(intent = 'recommend') {
  const value = intent === 'want' ? 'want' : 'recommend';
  const input = document.querySelector(`input[name="asIntent"][value="${value}"]`);
  if (input) input.checked = true;
  updateAddSpotIntentUI();
}

function getAddSpotIntent() {
  return document.querySelector('input[name="asIntent"]:checked')?.value === 'want' ? 'want' : 'recommend';
}

function updateAddSpotIntentUI() {
  const intent = getAddSpotIntent();
  const title = document.getElementById('addSpotTitle');
  const label = document.querySelector('label[for="asReason"]');
  const reason = document.getElementById('asReason');
  const submit = document.getElementById('addSpotSubmitBtn');
  const isEn = currentLanguage === 'en';
  if (editingClientId) return;
  if (intent === 'want') {
    if (title) title.textContent = isEn ? '🌱 Add a Place You Want to Visit' : '🌱 これから行きたい場所を追加';
    if (label) label.innerHTML = isEn ? 'Why are you curious? <span class="req">Required</span>' : '気になっている理由 <span class="req">必須</span>';
    if (reason) reason.placeholder = isEn ? 'Tell us why you want to go or what kind of place it is! (up to 150 characters)' : 'なぜ行きたいか、どんな場所か教えてください！（150文字以内）';
    if (submit) submit.textContent = isEn ? 'Add Want-to-Go Spot 🌱' : '行きたい場所を追加 🌱';
  } else {
    if (title) title.textContent = isEn ? '✨ Suggest a Spot' : '✨ スポットを提案する';
    if (label) label.innerHTML = isEn ? 'Recommendation Point <span class="req">Required</span>' : 'おすすめポイント <span class="req">必須</span>';
    if (reason) reason.placeholder = isEn ? 'Tell us what kind of place it is! (up to 150 characters)' : 'どんな場所か教えて下さい！（150文字以内）';
    if (submit) submit.textContent = isEn ? 'Send Suggestion 🚀' : '提案を送る 🚀';
  }
}

function renderSpotImagePreviews() {
  const list = document.getElementById('asImagePreviewList');
  if (!list) return;
  const images = uploadedSpotImageBase64List.filter(Boolean).slice(0, MAX_SPOT_UPLOAD_IMAGES);
  if (!images.length) {
    list.innerHTML = '';
    list.style.display = 'none';
    return;
  }
  list.innerHTML = images.map((src, index) => `
    <div class="image-upload-preview-container image-upload-preview-container--spot">
      <img class="image-upload-preview" src="${escHtml(src)}" alt="プレビュー${index + 1}">
      <button type="button" class="image-upload-clear-btn spot-image-clear-btn" data-spot-image-index="${index}" aria-label="画像${index + 1}を削除">✕</button>
    </div>
  `).join('');
  list.style.display = 'grid';
}

function setUploadedSpotImages(images = []) {
  uploadedSpotImageBase64List = images.filter(Boolean).slice(0, MAX_SPOT_UPLOAD_IMAGES);
  renderSpotImagePreviews();
}

function resetSpotImageUploads() {
  uploadedSpotImageBase64List = [];
  const asFileInput = document.getElementById('asImageFile');
  if (asFileInput) asFileInput.value = '';
  renderSpotImagePreviews();
}

function applySuggestionResourcesToAddSpotRows(s) {
  const resources = getSuggestionResources(s);
  const base64Photos = resources
    .filter(r => r.kind === 'photo' && r.url && r.url.startsWith('data:image/'))
    .slice(0, MAX_SPOT_UPLOAD_IMAGES);
  setUploadedSpotImages(base64Photos.map(photo => photo.url));

  // Filter out Base64 photos from the link inputs
  const remainingResources = resources.filter(r => !(r.kind === 'photo' && r.url && r.url.startsWith('data:image/')));
  
  for (let i = 0; i < 3; i += 1) {
    const urlEl = document.getElementById(`asUrl${i + 1}`);
    const kindEl = document.getElementById(`asKind${i + 1}`);
    const entry = remainingResources[i];
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

  // Reset custom image upload states & previews
  resetSpotImageUploads();

  // Reset amenities form state
  document.querySelectorAll('.toilet-star-btn').forEach(btn => btn.classList.remove('active'));
  const ratingGroup = document.getElementById('asToiletRatingGroup');
  if (ratingGroup) ratingGroup.style.display = 'none';
  const toiletRatingInput = document.getElementById('asToiletRating');
  if (toiletRatingInput) toiletRatingInput.value = '0';

  populateAddSpotPrefSelect();
  setAddSpotIntent('recommend');
  document.getElementById('asCharNum').textContent = '0';
  clearResourceValidation('spot');

  if (editingClientId) {
    if (title) title.textContent = currentLanguage === 'en' ? '✨ Edit Spot' : '✨ スポット情報を編集';
    if (btn) btn.textContent = currentLanguage === 'en' ? 'Update 🚀' : '更新する 🚀';

    const suggs = getAllSpotItemsForDisplay().filter(s => s.suggested);
    const s = suggs.find(item => (item.clientId || item.id) === editingClientId);
    if (s) {
      document.getElementById('asName').value = s.name || '';
      setAddSpotLocationFields(s);
      document.getElementById('asCat').value = s.cat || 'food';
      document.getElementById('asBudget').value = s.budget || '';
      setAddSpotIntent(s.intent || 'recommend');
      document.getElementById('asReason').value = s.reason || '';
      document.getElementById('asNick').value = s.nickname || '';
      applySuggestionResourcesToAddSpotRows(s);

      // Restore amenities fields
      document.getElementById('asWifi').checked = !!s.wifi;
      document.getElementById('asPower').checked = !!s.power;
      document.getElementById('asVegan').checked = !!s.vegan;
      document.getElementById('asCard').checked = !!s.card;
      document.getElementById('asQr').checked = !!s.qr;
      document.getElementById('asParking').checked = !!s.parking;
      document.getElementById('asPet').checked = !!s.pet;
      document.getElementById('asToilet').checked = !!s.toilet;
      document.getElementById('asAccessibleToilet').checked = !!s.accessibleToilet;
      document.getElementById('asBarrierFree').checked = !!s.barrierFree;
      document.getElementById('asNursingRoom').checked = !!s.nursingRoom;

      const rating = s.toiletRating || 0;
      document.getElementById('asToiletRating').value = rating;
      document.querySelectorAll('.toilet-star-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.rating, 10) <= rating);
      });
      const rGroup = document.getElementById('asToiletRatingGroup');
      if (rGroup) rGroup.style.display = s.toilet ? 'block' : 'none';

      const reasonEl = document.getElementById('asReason');
      const charNum = document.getElementById('asCharNum');
      if (charNum && reasonEl) charNum.textContent = String((reasonEl.value || '').length);
    }
  } else {
    updateAddSpotIntentUI();
    fillSavedNickname('asNick');
    restoreAddSpotFormDraftIfAny();
  }
}

function openWantSpotModal() {
  openAddSpotModal();
  setAddSpotIntent('want');
  document.getElementById('asName')?.focus();
}
function closeAddSpotModal() {
  document.getElementById('addSpotModal').classList.remove('is-open');
  document.body.style.overflow = '';
  editingId = null;
  editingClientId = null;

  // Cleanup spot image upload states
  resetSpotImageUploads();
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
    if (title) title.textContent = currentLanguage === 'en' ? '💬 Edit Chat' : '💬 つぶやきを編集';
    if (btn) btn.textContent = currentLanguage === 'en' ? 'Update 🚀' : '更新する 🚀';
    
    const chat = allChats.find(c => getChatKey(c) === editingClientId);
    if (chat) {
      const nickInput = document.getElementById('cNick');
      if (nickInput) nickInput.value = chat.nickname === '匿名リスナー' ? '' : (chat.nickname || '');
    }
  } else {
    if (replyingTo) {
      if (title) title.textContent = currentLanguage === 'en' ? '💬 Reply' : '💬 返信する';
      if (btn) btn.textContent = currentLanguage === 'en' ? 'Reply 🚀' : '返信する 🚀';
    } else {
      if (title) title.textContent = currentLanguage === 'en' ? '💬 Post a Chat' : '💬 つぶやく';
      if (btn) btn.textContent = currentLanguage === 'en' ? 'Post 🚀' : '投稿する 🚀';
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

// ============================================================
// お題提案モーダル
// ============================================================
function openPromptSuggestModal() {
  const modal = document.getElementById('promptSuggestModal');
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const ta = document.getElementById('psText');
  if (ta) {
    ta.value = '';
    document.getElementById('psCharNum').textContent = '0';
  }
  fillSavedNickname('psNick');
  window.setTimeout(() => ta?.focus(), 80);
}

function closePromptSuggestModal() {
  const modal = document.getElementById('promptSuggestModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

let promptSuggestBound = false;
function bindPromptSuggestModal() {
  if (promptSuggestBound) return;
  const modal = document.getElementById('promptSuggestModal');
  if (!modal) return;
  promptSuggestBound = true;
  document.getElementById('promptSuggestClose')?.addEventListener('click', closePromptSuggestModal);
  document.getElementById('promptSuggestCancelBtn')?.addEventListener('click', closePromptSuggestModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePromptSuggestModal();
  });
  const ta = document.getElementById('psText');
  if (ta) {
    ta.addEventListener('input', () => {
      const n = ta.value.length;
      const counter = document.getElementById('psCharNum');
      if (counter) counter.textContent = n;
    });
  }
  const form = document.getElementById('promptSuggestForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = (document.getElementById('psText')?.value || '').trim();
      const nickname = (document.getElementById('psNick')?.value || '').trim();
      if (!text) {
        showToast('お題の文章を入力してください。');
        return;
      }
      const submitBtn = document.getElementById('promptSuggestSubmitBtn');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '送信中...'; }
      try {
        await submitPromptSuggestion({ text, nickname });
        saveNickname(nickname);
        showToast('お題を提案しました！みんなの ♡ で次のお題が決まります。');
        closePromptSuggestModal();
        // 候補を開いて見せる
        const toggle = document.getElementById('dailyPromptToggleBtn');
        const candidates = document.getElementById('dailyPromptCandidates');
        if (toggle && candidates && toggle.getAttribute('aria-expanded') !== 'true') {
          toggle.setAttribute('aria-expanded', 'true');
          candidates.hidden = false;
          const label = toggle.querySelector('.daily-prompt-toggle-text');
          if (label) label.textContent = '候補を閉じる';
        }
      } catch (err) {
        console.error(err);
        showToast('送信に失敗しました。時間を置いてもう一度お試しください。');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'お題を送る 🌿'; }
      }
    });
  }
}

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
  image.onerror = null;
  image.src = imageSrc;
  image.alt = alt || title || '配信で届いた作品';
  titleEl.textContent = title || '配信で届いた作品';
  captionEl.textContent = caption || '';
}

function openResourceImageModal(imageSrc, title = '', caption = '') {
  if (!imageSrc) return;
  currentGalleryIndex = -1;
  const modal = document.getElementById('galleryModal');
  const image = document.getElementById('galleryModalImage');
  const titleEl = document.getElementById('galleryModalTitle');
  const captionEl = document.getElementById('galleryModalCaption');
  const modalBox = document.querySelector('.gallery-modal-box');
  const visual = document.getElementById('galleryModalVisual');
  const pageNumEl = document.getElementById('galleryModalPageNum');
  const panelPageNumEl = document.getElementById('galleryPanelPageNum');
  if (!modal || !image || !titleEl || !captionEl) return;

  pendingGalleryUnlock = null;
  setGalleryLockState(false);
  setGalleryBaseControls(false);
  hideDictionaryThumbs();
  if (visual) visual.querySelectorAll('.modal-img-nav').forEach(el => el.remove());
  if (pageNumEl) pageNumEl.hidden = true;
  if (panelPageNumEl) { panelPageNumEl.hidden = true; panelPageNumEl.textContent = ''; }
  if (modalBox) {
    modalBox.classList.remove('is-dictionary-mode', 'is-dictionary-zoomed', 'is-focus-mode');
    modalBox.classList.add('is-resource-image-mode');
  }

  image.onerror = () => {
    captionEl.textContent = currentLanguage === 'en'
      ? 'The image could not be loaded. If this is an external image, the source may not allow embedding.'
      : '画像を読み込めませんでした。外部画像の場合、掲載元の制限で表示できないことがあります。';
  };
  image.src = imageSrc;
  image.alt = title || (currentLanguage === 'en' ? 'Posted image' : '投稿画像');
  titleEl.textContent = title || (currentLanguage === 'en' ? 'Posted image' : '投稿画像');
  captionEl.textContent = caption || '';
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  resetGalleryZoom();
  showGalleryHint(currentLanguage === 'en' ? 'Tap to zoom / Swipe down to close' : 'タップで拡大 ／ 下にスワイプで閉じる');
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
  document.querySelector('.gallery-modal-box')?.classList.remove('is-resource-image-mode');
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
  showGalleryHint(isDict ? 'ピンチ・ダブルタップで拡大。下のボタンでページ移動 ／ 下にスワイプで閉じる' : '左右スワイプで作品移動 ／ タップで拡大 ／ 下にスワイプで閉じる');
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
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const trigger = target?.closest('[data-resource-image]');
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    openResourceImageModal(
      trigger.dataset.resourceImage,
      trigger.dataset.resourceTitle || '',
      trigger.dataset.resourceCaption || ''
    );
  });

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
  image.onerror = null;
  pendingGalleryUnlock = null;
  currentGalleryIndex = -1;
  const visual = document.getElementById('galleryModalVisual');
  const pageNumEl = document.getElementById('galleryModalPageNum');
  const panelPageNumEl = document.getElementById('galleryPanelPageNum');
  const modalBox = document.querySelector('.gallery-modal-box');
  if (visual) visual.querySelectorAll('.modal-img-nav').forEach(el => el.remove());
  if (pageNumEl) pageNumEl.hidden = true;
  if (panelPageNumEl) { panelPageNumEl.hidden = true; panelPageNumEl.textContent = ''; }
  if (modalBox) modalBox.classList.remove('is-dictionary-mode', 'is-dictionary-zoomed', 'is-focus-mode', 'is-resource-image-mode');
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
  const panelPageNumEl = document.getElementById('galleryPanelPageNum');
  if (!visual) return;

  // Clean up old buttons and page num
  visual.querySelectorAll('.modal-img-nav').forEach(el => el.remove());
  if (pageNumEl) pageNumEl.hidden = true;
  if (panelPageNumEl) { panelPageNumEl.hidden = true; panelPageNumEl.textContent = ''; }

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

  // Update page number — 下部コントロールパネル内の表示に統合（作品との重なり回避）
  if (sameTypeItems.length > 1) {
    const pageText = `${currentTypeIndex + 1} / ${sameTypeItems.length}`;
    if (panelPageNumEl) {
      panelPageNumEl.textContent = pageText;
      panelPageNumEl.setAttribute('aria-label', isDict ? `用語辞典 ${pageText} ページ` : `作品 ${pageText}`);
      panelPageNumEl.hidden = false;
    }
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
      // 下方向の大きなスワイプで閉じる（縦の動きが横の1.5倍以上、かつ80px以上）
      if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX) * 1.5) {
        closeGalleryModal();
        return;
      }
      if (Math.abs(diffX) > 54 && Math.abs(diffX) > Math.abs(diffY) * 1.35) {
        if (document.querySelector('.gallery-modal-box')?.classList.contains('is-resource-image-mode')) return;
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
  const isResourceImageMode = document.querySelector('.gallery-modal-box')?.classList.contains('is-resource-image-mode');

  if (!isResourceImageMode && e.key === 'ArrowRight') {
    e.preventDefault();
    if (!moveGalleryFromCurrent('next')) showGalleryHint('最後の作品です');
    return true;
  }
  if (!isResourceImageMode && e.key === 'ArrowLeft') {
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
  const isEn = currentLanguage === 'en';

  title.textContent = isEn ? `Reviews for ${spotName}` : `${spotName} のみんなの感想`;
  body.innerHTML = reviews.length
    ? `<div class="spot-review-list">${renderSpotReviewCards(reviews)}</div>`
    : `
      <div class="spot-review-empty">
        <div class="empty-icon">💬</div>
        <p>${isEn ? 'No reviews for this spot yet.' : 'このスポットの感想はまだありません。'}<br>${isEn ? 'If you have been here, why not share the first review?' : '行ってみたら、最初の感想を投稿してみませんか？'}</p>
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
    if (title) title.textContent = currentLanguage === 'en' ? '🗺️ Edit Review' : '🗺️ 感想を編集する';
    if (btn) btn.textContent = currentLanguage === 'en' ? 'Update 🚀' : '更新する 🚀';
    
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

      // Populate media resources
      const mediaItems = getPostMedia(post);
      const base64Photo = mediaItems.find(m => m.kind === 'photo' && m.url && m.url.startsWith('data:image/'));
      if (base64Photo) {
        uploadedPostImageBase64 = base64Photo.url;
        const preview = document.getElementById('fImagePreview');
        const container = document.getElementById('fImagePreviewContainer');
        if (preview && container) {
          preview.src = base64Photo.url;
          container.style.display = 'block';
        }
      }

      // Filter out the Base64 photo from the standard link inputs
      const remainingMedia = mediaItems.filter(m => !(m.kind === 'photo' && m.url && m.url.startsWith('data:image/')));
      for (let i = 0; i < 3; i += 1) {
        const urlEl = document.getElementById(`fMediaUrl${i + 1}`);
        const kindEl = document.getElementById(`fMediaKind${i + 1}`);
        const entry = remainingMedia[i];
        if (urlEl) urlEl.value = entry?.url || '';
        if (kindEl) kindEl.value = entry?.kind || 'photo';
      }
    }
  } else {
    if (title) title.textContent = currentLanguage === 'en' ? '🗺️ Share a Place You Visited' : '🗺️ 行った場所を共有';
    if (btn) btn.textContent = currentLanguage === 'en' ? 'Post 🚀' : '投稿する 🚀';
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
  editingId = null;
  editingClientId = null;

  // Cleanup post image upload states
  uploadedPostImageBase64 = null;
  const fileInput = document.getElementById('fImageFile');
  if (fileInput) fileInput.value = '';
  const preview = document.getElementById('fImagePreview');
  const container = document.getElementById('fImagePreviewContainer');
  if (preview) preview.src = '';
  if (container) container.style.display = 'none';
}

function resetForm() {
  document.getElementById('postForm').reset();
  selectedRating = 0;
  document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('charNum').textContent = '0';
  clearResourceValidation('post');

  // Clear image upload states & previews
  uploadedPostImageBase64 = null;
  const fileInput = document.getElementById('fImageFile');
  if (fileInput) fileInput.value = '';
  const preview = document.getElementById('fImagePreview');
  const container = document.getElementById('fImagePreviewContainer');
  if (preview) preview.src = '';
  if (container) container.style.display = 'none';
}

// ============================================================
// 7. フォーム送信
// ============================================================
// スポット追加フォーム送信
document.getElementById('addSpotForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('asName').value.trim();
  syncAddSpotAreaField();
  const location = getAddSpotLocationInput();
  const area = location.area.trim();
  const reason = document.getElementById('asReason').value.trim();
  if (!name || !location.pref || !location.city || !area || !reason) {
    alert(currentLanguage === 'en' ? 'Please enter the spot name, prefecture, city/ward, and recommendation point.' : 'スポット名、都道府県、市区町村、おすすめポイントを入力してください');
    return;
  }
  const resources = validateResourceEntries('spot');
  if (!resources) return;
  if (uploadedSpotImageBase64List.length) {
    resources.unshift(...uploadedSpotImageBase64List.map(url => ({ kind: 'photo', label: '写真', url })));
  }
  const btn = document.getElementById('addSpotSubmitBtn');
  btn.disabled = true; btn.textContent = currentLanguage === 'en' ? 'Sending...' : '送信中...';
  const data = {
    name, area,
    pref: location.pref,
    city: location.city,
    areaNote: location.areaNote,
    areaGroup: location.city || location.pref,
    cat: document.getElementById('asCat').value,
    budget: document.getElementById('asBudget')?.value || '',
    intent: getAddSpotIntent(),
    reason,
    nickname: document.getElementById('asNick').value.trim(),
    wifi: document.getElementById('asWifi')?.checked || false,
    power: document.getElementById('asPower')?.checked || false,
    vegan: document.getElementById('asVegan')?.checked || false,
    card: document.getElementById('asCard')?.checked || false,
    qr: document.getElementById('asQr')?.checked || false,
    parking: document.getElementById('asParking')?.checked || false,
    pet: document.getElementById('asPet')?.checked || false,
    toilet: document.getElementById('asToilet')?.checked || false,
    toiletRating: document.getElementById('asToilet')?.checked ? parseInt(document.getElementById('asToiletRating')?.value || '0', 10) : 0,
    accessibleToilet: document.getElementById('asAccessibleToilet')?.checked || false,
    barrierFree: document.getElementById('asBarrierFree')?.checked || false,
    nursingRoom: document.getElementById('asNursingRoom')?.checked || false
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
      showToast(currentLanguage === 'en' ? 'Spot updated!' : 'スポット情報を更新しました！');
    } else {
      await saveSpotSuggestion(data);
      showToast(currentLanguage === 'en' ? 'Spot suggested! It may inspire someone’s next outing.' : 'スポットを提案しました！誰かの次の休日のヒントになります。');
      clearAddSpotFormDraft();
    }
    saveNickname(data.nickname);
    closeAddSpotModal();
    const activeTab = document.querySelector('.tab.active');
    renderSpotCards(activeTab ? activeTab.dataset.cat : 'all');
    renderWeeklyDiscovery();
  } catch(err) {
    console.error('Submit failed:', err);
    alert(currentLanguage === 'en' ? 'Something went wrong. Please try again later.' : 'エラーが発生しました。時間を置いて再度お試しください。');
  } finally {
    btn.disabled = false;
    if (editingClientId) {
      btn.textContent = currentLanguage === 'en' ? 'Update 🚀' : '更新する 🚀';
    } else {
      updateAddSpotIntentUI();
    }
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

  if (!message) { alert(currentLanguage === 'en' ? 'Please enter a message.' : 'メッセージを入力してください'); return; }

  const btn = document.getElementById('chatSubmitBtn');
  btn.disabled = true; btn.textContent = currentLanguage === 'en' ? 'Sending...' : '送信中...';

  try {
    if (editingClientId) {
      await updateChatRecord(editingId, editingClientId, { nickname, message });
      showToast(currentLanguage === 'en' ? 'Chat updated!' : 'つぶやきを更新しました！');
    } else {
      const isReply = Boolean(replyingTo);
      await saveChat({ nickname, message });
      showToast(isReply
        ? (currentLanguage === 'en' ? 'Reply posted!' : '返信しました！会話がつながりました。')
        : (currentLanguage === 'en' ? 'Chat posted! Your words may start a conversation.' : '投稿しました！あなたの一言が、会話のきっかけになります。'));
    }
    saveNickname(nickname);
    updateChatsView();
    closeChatModal();
    document.getElementById('chatForm').reset();
  } catch(err) {
    console.error('Submit failed:', err);
    alert(currentLanguage === 'en' ? 'Something went wrong. Please try again later.' : 'エラーが発生しました。時間を置いて再度お試しください。');
  } finally {
    btn.disabled = false;
    btn.textContent = editingClientId
      ? (currentLanguage === 'en' ? 'Update 🚀' : '更新する 🚀')
      : (currentLanguage === 'en' ? 'Post 🚀' : '投稿する 🚀');
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

  if (!spotName) { alert(currentLanguage === 'en' ? 'Please select or enter a spot name.' : 'スポット名を選択または入力してください'); return; }
  const comment = document.getElementById('fComment').value.trim();
  if (!comment) { alert(currentLanguage === 'en' ? 'Please enter a comment.' : 'コメントを入力してください'); return; }
  const media = validateResourceEntries('post');
  if (!media) return;
  if (uploadedPostImageBase64) {
    media.unshift({ kind: 'photo', label: '写真', url: uploadedPostImageBase64 });
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = currentLanguage === 'en' ? 'Sending...' : '送信中...';

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
      showToast(currentLanguage === 'en' ? 'Review updated!' : '感想を更新しました！');
    } else {
      await savePost(postData);
      showToast(currentLanguage === 'en' ? 'Review posted! Your experience may encourage someone else.' : '感想を投稿しました！あなたの体験が、誰かの背中を押します。');
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
    alert(currentLanguage === 'en' ? 'Something went wrong. Please try again later.' : 'エラーが発生しました。時間を置いて再度お試しください。');
  } finally {
    btn.disabled = false;
    btn.textContent = editingClientId
      ? (currentLanguage === 'en' ? 'Update 🚀' : '更新する 🚀')
      : (currentLanguage === 'en' ? 'Post 🚀' : '投稿する 🚀');
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

function compressAndEncodeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const maxW = 600;
        const maxH = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxW || height > maxH) {
          if (width > height) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          } else {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.6 (60%) quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.60);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

function getCarrotGuideElements() {
  return {
    guide: document.getElementById('carrotGuide'),
    bubble: document.getElementById('carrotGuideBubble'),
    btn: document.getElementById('carrotGuideBtn'),
    title: document.getElementById('carrotGuideTitle'),
    text: document.getElementById('carrotGuideText'),
    action: document.getElementById('carrotGuideAction')
  };
}

function getCarrotGuideContext() {
  if (document.getElementById('galleryModal')?.classList.contains('is-open') ||
      document.getElementById('fullGalleryModal')?.classList.contains('is-open')) {
    return 'gallery';
  }

  const scrollPoint = window.scrollY + Math.min(window.innerHeight * 0.46, 380);
  let context = 'hero';
  ['spots', 'visited', 'community'].forEach(id => {
    const section = document.getElementById(id);
    if (section && section.offsetTop - 60 <= scrollPoint) context = id;
  });
  return CARROT_GUIDE_HINTS[context] ? context : 'hero';
}

function updateCarrotGuide(context = getCarrotGuideContext(), advance = false) {
  const { title, text, action } = getCarrotGuideElements();
  const isEn = currentLanguage === 'en';
  const hintsDict = isEn ? CARROT_GUIDE_HINTS_EN : CARROT_GUIDE_HINTS;
  const hints = hintsDict[context] || hintsDict.hero;
  if (!title || !text || !action || !hints.length) return;

  if (advance || carrotGuideIndexByContext[context] === undefined) {
    const current = carrotGuideIndexByContext[context] || 0;
    carrotGuideIndexByContext[context] = advance ? (current + 1) % hints.length : current;
  }

  const hint = hints[carrotGuideIndexByContext[context] || 0];
  carrotGuideContext = context;
  title.textContent = hint.title;
  text.textContent = hint.text;
  action.textContent = hint.actionLabel || (isEn ? 'View' : '見てみる');
  action.setAttribute('href', hint.href || '#hero');
}

function openCarrotGuide(advance = false) {
  const { guide, bubble, btn } = getCarrotGuideElements();
  if (!guide || !bubble || !btn) return;
  updateCarrotGuide(getCarrotGuideContext(), advance);
  bubble.hidden = false;
  guide.classList.add('is-open');
  btn.setAttribute('aria-expanded', 'true');
  try {
    localStorage.setItem(CARROT_GUIDE_STORAGE_KEY, '1');
  } catch (e) {
    // localStorage が使えない環境では、その場の表示だけ行います。
  }
}

function closeCarrotGuide() {
  const { guide, bubble, btn } = getCarrotGuideElements();
  if (!guide || !bubble || !btn) return;
  bubble.hidden = true;
  guide.classList.remove('is-open');
  btn.setAttribute('aria-expanded', 'false');
}

function refreshCarrotGuideContext() {
  const { bubble } = getCarrotGuideElements();
  if (!bubble || bubble.hidden) return;
  const nextContext = getCarrotGuideContext();
  if (nextContext !== carrotGuideContext) updateCarrotGuide(nextContext);
}

function maybeShowCarrotGuideOnce() {
  const { guide } = getCarrotGuideElements();
  if (!guide) return;
  let hasSeenGuide = false;
  try {
    hasSeenGuide = localStorage.getItem(CARROT_GUIDE_STORAGE_KEY) === '1';
  } catch (e) {
    hasSeenGuide = true;
  }
  if (hasSeenGuide) return;

  window.setTimeout(() => {
    if (document.querySelector('.modal-bg.is-open')) return;
    openCarrotGuide(false);
  }, 3200);
}

function bindCarrotGuideEvents() {
  const { guide, bubble, btn, action } = getCarrotGuideElements();
  const nextBtn = document.getElementById('carrotGuideNext');
  const closeBtn = document.getElementById('carrotGuideClose');
  if (!guide || !bubble || !btn) return;

  btn.addEventListener('click', () => {
    if (bubble.hidden) openCarrotGuide(false);
    else closeCarrotGuide();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => openCarrotGuide(true));
  if (closeBtn) closeBtn.addEventListener('click', closeCarrotGuide);
  if (action) action.addEventListener('click', closeCarrotGuide);
  if (action) action.addEventListener('click', (e) => {
    if (action.getAttribute('href') === '#add-spot') {
      e.preventDefault();
      closeCarrotGuide();
      openAddSpotModal();
    }
  });
  maybeShowCarrotGuideOnce();
}

function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:32px;left:50%;transform:translate(-50%, 12px);
    background:linear-gradient(135deg, #5b8dee, #2a9d8f);color:#fff;font-weight:700;
    padding:14px 28px;border-radius:50px;
    box-shadow:0 12px 36px rgba(91,141,238,0.34);z-index:9999;
    opacity:0; transition:opacity 0.32s ease, transform 0.32s ease;
    font-size:0.92rem;max-width:min(92vw,560px);
    text-align:center;line-height:1.6;letter-spacing:0.01em;
  `;
  document.body.appendChild(t);
  // 次フレームでフェード＆スライドイン
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translate(-50%, 0)';
  });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translate(-50%, 12px)';
    setTimeout(() => t.remove(), 320);
  }, 2700);
}

// カテゴリータブの横スクロール操作性を極限まで高める（グラデーション、スクロール連動、自動センタリング、矢印操作、微小スクロールヒント）
function initTabsScrollUX() {
  const wrapper = document.getElementById('tabsOuterWrapper');
  const tabs = document.getElementById('tabs');
  const btnLeft = document.getElementById('tabsScrollLeft');
  const btnRight = document.getElementById('tabsScrollRight');

  if (!wrapper || !tabs) return;

  function updateScrollState() {
    const scrollWidth = tabs.scrollWidth;
    const clientWidth = tabs.clientWidth;
    const scrollLeft = tabs.scrollLeft;

    const hasOverflow = scrollWidth > clientWidth;

    if (hasOverflow) {
      wrapper.classList.toggle('has-overflow-left', scrollLeft > 2);
      wrapper.classList.toggle('has-overflow-right', scrollLeft < (scrollWidth - clientWidth - 2));
    } else {
      wrapper.classList.remove('has-overflow-left', 'has-overflow-right');
    }
  }

  // スクロールおよびリサイズ時の更新
  tabs.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });

  // 左右矢印ボタンのクリック処理
  if (btnLeft) {
    btnLeft.addEventListener('click', () => {
      tabs.scrollBy({ left: -220, behavior: 'smooth' });
    });
  }
  if (btnRight) {
    btnRight.addEventListener('click', () => {
      tabs.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }

  // 初期化とスクロール位置チェック
  setTimeout(() => {
    updateScrollState();
    
    // 微細なスクロール誘導アクション（セルフスクロール・ウィグル効果）
    if (tabs.scrollWidth > tabs.clientWidth) {
      tabs.scrollTo({ left: 60, behavior: 'smooth' });
      setTimeout(() => {
        tabs.scrollTo({ left: 0, behavior: 'smooth' });
      }, 600);
    }
  }, 800);
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

  // 上部ナビの自動退避（スマホで下方向スクロール時のみ隠す）
  let lastScrollY = window.scrollY;
  let scrollDir = 'up';
  let scrollAccum = 0;
  const NAV_HIDE_THRESHOLD = 14; // 連続して下方向にこれだけ動いたら隠す
  const NAV_SHOW_THRESHOLD = 8;  // 上方向にこれだけ動いたら出す

  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) scrollHint.classList.toggle('is-hidden', y > 120);

    const dy = y - lastScrollY;
    const dir = dy > 0 ? 'down' : 'up';
    if (dir !== scrollDir) { scrollDir = dir; scrollAccum = 0; }
    scrollAccum += Math.abs(dy);
    lastScrollY = y;

    // モバイル幅でだけ自動退避（PCはそのまま）
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      // モーダル開いている時、ヒーロー域、メニュー展開中はそのまま
      const modalOpen = document.querySelector('.modal-bg.is-open');
      const navOpen = document.getElementById('navMobile')?.classList.contains('open');
      if (!modalOpen && !navOpen) {
        if (dir === 'down' && y > 160 && scrollAccum > NAV_HIDE_THRESHOLD) {
          navbar.classList.add('is-stowed');
        } else if (dir === 'up' && scrollAccum > NAV_SHOW_THRESHOLD) {
          navbar.classList.remove('is-stowed');
        }
      } else {
        navbar.classList.remove('is-stowed');
      }
    } else {
      navbar.classList.remove('is-stowed');
    }

    updateBottomNavActive();
    refreshCarrotGuideContext();
  }, { passive: true });
  updateBottomNavActive(); // 初期表示でスポットをアクティブに
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navMobile').classList.toggle('open');
  });
  document.querySelectorAll('.nav-mobile-link').forEach(l => {
    l.addEventListener('click', () => document.getElementById('navMobile').classList.remove('open'));
  });
  
  // 言語切り替えトグルのバインドは i18n.js で一括処理されるため削除
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
  bindCarrotGuideEvents();
  const dailyPromptBtn = document.getElementById('dailyPromptBtn');
  if (dailyPromptBtn) dailyPromptBtn.addEventListener('click', () => {
    const info = currentDailyPromptInfo || getDailyPromptInfo();
    if (info.source === 'exhausted') {
      openPromptSuggestModal();
      return;
    }
    openChatModal(`今日のお題：${info.text}\n`);
  });
  const dailyPromptGachaBtn = document.getElementById('dailyPromptGachaBtn');
  if (dailyPromptGachaBtn) dailyPromptGachaBtn.addEventListener('click', () => {
    const currentInfo = currentDailyPromptInfo || getDailyPromptInfo();
    markDailyPromptSeen(currentInfo);
    const candidates = getUnseenPromptCandidates({ includeFallback: true, excludeId: currentInfo.seenId });
    if (!candidates.length) {
      activeGachaItem = null;
      renderDailyPrompt();
      showToast('お題をひと通り見ました。新しいお題を提案してみませんか？');
      return;
    }
    activeGachaItem = candidates[Math.floor(Math.random() * candidates.length)];
    const body = document.getElementById('dailyPromptBody');
    if (body) {
      body.classList.remove('is-flipping');
      void body.offsetWidth;
      body.classList.add('is-flipping');
      setTimeout(() => renderDailyPrompt(), 200);
    } else {
      renderDailyPrompt();
    }
  });
  const dailyPromptToggleBtn = document.getElementById('dailyPromptToggleBtn');
  const dailyPromptCandidates = document.getElementById('dailyPromptCandidates');
  if (dailyPromptToggleBtn && dailyPromptCandidates) {
    dailyPromptToggleBtn.addEventListener('click', async () => {
      const isOpen = dailyPromptToggleBtn.getAttribute('aria-expanded') === 'true';
      const next = !isOpen;
      dailyPromptToggleBtn.setAttribute('aria-expanded', next ? 'true' : 'false');
      dailyPromptCandidates.hidden = !next;
      const label = dailyPromptToggleBtn.querySelector('.daily-prompt-toggle-text');
      if (label) label.textContent = next
        ? (currentLanguage === 'en' ? 'Close Topics' : '候補を閉じる')
        : (currentLanguage === 'en' ? 'See Suggestions' : 'みんなの提案を見る');
      if (next) {
        dailyPromptArchivePage = 0;
        // まずキャッシュで即時レンダリング
        renderDailyPromptCandidates();
        // さらにFirestoreから最新データを再フェッチして再描画（端末間ラグ対策）
        if (db) {
          try {
            const snap = await db.collection('prompt_suggestions').limit(200).get();
            _processPromptSnap(snap.docs);
          } catch (e) {
            console.warn('Prompt refresh failed:', e);
          }
        }
      }
    });
  }
  const dailyPromptSuggestBtn = document.getElementById('dailyPromptSuggestBtn');
  if (dailyPromptSuggestBtn) dailyPromptSuggestBtn.addEventListener('click', () => openPromptSuggestModal());
  bindPromptSuggestModal();
  const promptPager = document.getElementById('dailyPromptPagination');
  if (promptPager) {
    promptPager.addEventListener('click', (e) => {
      const btn = e.target.closest('.daily-prompt-page-btn');
      if (!btn || btn.disabled) return;
      const totalPages = Math.max(1, Math.ceil(getPromptArchiveItems().length / PROMPT_ARCHIVE_PAGE_SIZE));
      const action = btn.dataset.promptPageAction;
      if (action === 'prev') {
        dailyPromptArchivePage = Math.max(0, dailyPromptArchivePage - 1);
      } else if (action === 'next') {
        dailyPromptArchivePage = Math.min(totalPages - 1, dailyPromptArchivePage + 1);
      } else if (btn.dataset.promptPageIndex !== undefined) {
        dailyPromptArchivePage = Math.max(0, Math.min(Number(btn.dataset.promptPageIndex), totalPages - 1));
      }
      renderDailyPromptCandidates();
    });
  }
  const promptList = document.getElementById('dailyPromptList');
  if (promptList) {
    promptList.addEventListener('click', async (e) => {
      // このお題でつぶやく
      const postBtn = e.target.closest('.prompt-post-action-btn');
      if (postBtn) {
        const text = postBtn.dataset.promptText;
        if (!text) return;
        openChatModal(`今日のお題：${text}\n`);
        return;
      }
      // 投票
      const voteBtn = e.target.closest('.daily-prompt-vote-btn');
      if (voteBtn) {
        const id = voteBtn.dataset.promptVoteId;
        if (!id) return;
        if (voteBtn.disabled) return;
        const voteId = getPromptVoteId(id);
        if (localPromptVotes[voteId]) return; // 既に投票済み（多重防止）

        // ① ローカル状態を楽観的に更新（成功前提）
        localPromptVotes[voteId] = Date.now();
        try { localStorage.setItem('popopo_prompt_votes', JSON.stringify(localPromptVotes)); } catch (e) {}
        localPendingPromptVotes.add(voteId);

        // ② ボタンの見た目を即時反映（数字も含む）。renderDailyPrompt は呼ばない。
        updatePromptVoteButton(voteId);

        // ③ ふわっと「+1」と粒子。粒子は overlay に出すので再描画でも消えない。
        showFloatingPlusOne(voteBtn);
        triggerReactionEffectOverlay(voteBtn);

        // ④ Firestore へ反映（失敗時はロールバックされる）
        votePromptSuggestion(id, /*skipOptimistic=*/true);
        return;
      }
      // 編集
      const editBtn = e.target.closest('.prompt-edit-btn');
      if (editBtn) {
        const id = editBtn.dataset.promptEditId;
        const currentText = editBtn.dataset.promptText || '';
        const newText = window.prompt('お題を編集してください（60文字以内）', currentText);
        if (newText === null) return; // キャンセル
        if (!newText.trim()) { showToast('文字を入力してください。'); return; }
        if (newText.length > 60) { showToast('60文字以内で入力してください。'); return; }
        await editPromptSuggestion(id, newText);
        return;
      }
      // 削除（ゴースト削除）
      const deleteBtn = e.target.closest('.prompt-delete-btn');
      if (deleteBtn) {
        const id = deleteBtn.dataset.promptDeleteId;
        if (!window.confirm('このお題をローカルから削除しますか？（Webには反映されていない分のみ削除されます）')) return;
        deleteLocalPromptSuggestion(id);
        return;
      }
      // 再送信
      const retryBtn = e.target.closest('.prompt-retry-btn');
      if (retryBtn) {
        const id = retryBtn.dataset.promptRetryId;
        retryBtn.disabled = true;
        retryBtn.textContent = '送信中...';
        await retrySyncPrompt(id);
        return;
      }
    });
  }
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
    if (introStoryIndex >= getIntroStorySlides().length - 1) {
      closeIntroStoryModal();
      return;
    }
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
    const reviewId = seenBtn.dataset.reviewSeenId;
    const wasSeen = Boolean(localSeenReviews[reviewId]);
    saveSeenReview(reviewId);
    // 初めて「見たよ」を押した時だけ、押した人へのお礼の粒子演出を出す
    if (!wasSeen) {
      showFloatingPlusOne(seenBtn);
      triggerReactionEffectOverlay(seenBtn, reactionMessagesFor('reviewSeen'));
    }
  });
  document.addEventListener('click', (e) => {
    const reactionBtn = e.target.closest('.chat-reaction-btn');
    if (!reactionBtn) return;
    const reactionId = reactionBtn.dataset.chatReactionId;
    const wasReacted = Boolean(localChatReactions[reactionId]);
    saveChatReaction(reactionId);
    // 初めてリアクションした時だけ、押した人へのお礼の粒子演出を出す
    if (!wasReacted) {
      showFloatingPlusOne(reactionBtn);
      triggerReactionEffectOverlay(reactionBtn, reactionMessagesFor('chatReaction'));
    }
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('postModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('postModal')) closeModal();
  });
  // スポット追加モーダル
  document.getElementById('addSpotBtn').addEventListener('click', openAddSpotModal);
  document.getElementById('wantAddSpotBtn')?.addEventListener('click', openWantSpotModal);
  document.getElementById('addSpotModalClose').addEventListener('click', closeAddSpotModal);
  document.getElementById('addSpotCancelBtn').addEventListener('click', closeAddSpotModal);
  const addSpotFormEl = document.getElementById('addSpotForm');
  if (addSpotFormEl) {
    addSpotFormEl.addEventListener('input', scheduleSaveAddSpotFormDraft);
    addSpotFormEl.addEventListener('change', scheduleSaveAddSpotFormDraft);
  }
  document.querySelectorAll('input[name="asIntent"]').forEach(input => {
    input.addEventListener('change', updateAddSpotIntentUI);
  });
  const asPref = document.getElementById('asPref');
  const asCity = document.getElementById('asCity');
  const asCityCustom = document.getElementById('asCityCustom');
  const asAreaNote = document.getElementById('asAreaNote');
  if (asPref) {
    asPref.addEventListener('change', () => {
      populateAddSpotCitySelect(asPref.value);
      scheduleSaveAddSpotFormDraft();
    });
  }
  if (asCity) {
    asCity.addEventListener('change', () => {
      updateCustomCityVisibility();
      syncAddSpotAreaField();
      scheduleSaveAddSpotFormDraft();
    });
  }
  [asCityCustom, asAreaNote].forEach(input => {
    if (input) input.addEventListener('input', syncAddSpotAreaField);
  });
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
    if (e.key === 'Escape') { closeModal(); closeAddSpotModal(); closeChatModal(); closeSpotReviews(); closeGalleryModal(); closeKiribanModal(); closeIntroStoryModal(); closeCarrotGuide(); closePromptSuggestModal(); }
  });
  document.getElementById('tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeAreaRegion = 'all';
    activeSpotArea = 'all';
    visibleSpotCount = INITIAL_SPOT_COUNT;
    renderSpotCards(tab.dataset.cat);
    
    // スムーズな中央配置スクロールを実行
    tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
  const areaFilter = document.getElementById('areaFilter');
  if (areaFilter) {
    areaFilter.addEventListener('click', (e) => {
      const chip = e.target.closest('.area-chip');
      if (!chip) return;
      const level = chip.dataset.areaLevel || 'child';
      const area = chip.dataset.area || 'all';
      if (level === 'all' || area === 'all') {
        activeAreaRegion = 'all';
        activeSpotArea = 'all';
      } else if (level === 'region') {
        const region = chip.dataset.region || area;
        if (chip.classList.contains('area-chip-main') && activeAreaRegion === region) {
          activeAreaRegion = 'all';
          activeSpotArea = 'all';
        } else {
          activeAreaRegion = region;
          activeSpotArea = area;
        }
      } else {
        activeAreaRegion = chip.dataset.region || activeAreaRegion;
        activeSpotArea = area;
      }
      visibleSpotCount = INITIAL_SPOT_COUNT;
      renderSpotCards(getActiveSpotCategory());
    });
  }
  const wantListToggleBtn = document.getElementById('wantListToggleBtn');
  if (wantListToggleBtn) {
    wantListToggleBtn.addEventListener('click', () => {
      showingWantList = !showingWantList;
      visibleSpotCount = INITIAL_SPOT_COUNT;
      renderSpotCards(getActiveSpotCategory());
    });
  }
  const barrierFreeFilterBtn = document.getElementById('barrierFreeFilterBtn');
  if (barrierFreeFilterBtn) {
    barrierFreeFilterBtn.addEventListener('click', () => {
      showingBarrierFreeOnly = !showingBarrierFreeOnly;
      barrierFreeFilterBtn.classList.toggle('active', showingBarrierFreeOnly);
      barrierFreeFilterBtn.setAttribute('aria-pressed', showingBarrierFreeOnly ? 'true' : 'false');
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

  // 日付入力欄全体をクリックしただけでカレンダーピッカーを起動するアシスト
  const dateInput = document.getElementById('fDate');
  if (dateInput) {
    dateInput.addEventListener('click', function () {
      if (typeof this.showPicker === 'function') {
        try {
          this.showPicker();
        } catch (err) {
          console.warn('showPicker error:', err);
        }
      }
    });
  }

  // お出かけマップモーダルのイベントバインド (カード全体をトリガーに)
  const heroMapCard = document.getElementById('heroMapCard');
  if (heroMapCard) {
    heroMapCard.addEventListener('click', openMapModal);
    heroMapCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMapModal();
      }
    });
  }
  const mapModalClose = document.getElementById('mapModalClose');
  if (mapModalClose) {
    mapModalClose.addEventListener('click', closeMapModal);
  }
  const mapModal = document.getElementById('mapModal');
  if (mapModal) {
    mapModal.addEventListener('click', (e) => {
      if (e.target === mapModal) closeMapModal();
    });
  }

  // アメニティ：トイレ有無と星評価のインタラクティブ制御
  const asToilet = document.getElementById('asToilet');
  const asToiletRatingGroup = document.getElementById('asToiletRatingGroup');
  const asToiletRating = document.getElementById('asToiletRating');

  if (asToilet) {
    asToilet.addEventListener('change', function() {
      if (asToiletRatingGroup) {
        asToiletRatingGroup.style.display = this.checked ? 'block' : 'none';
      }
      if (!this.checked && asToiletRating) {
        asToiletRating.value = '0';
        document.querySelectorAll('.toilet-star-btn').forEach(btn => btn.classList.remove('active'));
      }
    });
  }

  document.querySelectorAll('.toilet-star-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const rating = this.dataset.rating;
      if (asToiletRating) {
        asToiletRating.value = rating;
      }
      document.querySelectorAll('.toilet-star-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.rating, 10) <= parseInt(rating, 10));
      });
      scheduleSaveAddSpotFormDraft();
    });
  });

  // スポット追加の画像アップロードイベント
  const asImageFile = document.getElementById('asImageFile');
  if (asImageFile) {
    asImageFile.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []).filter(file => file && file.type.startsWith('image/'));
      if (!files.length) return;
      try {
        const remainingSlots = MAX_SPOT_UPLOAD_IMAGES - uploadedSpotImageBase64List.length;
        if (remainingSlots <= 0) {
          showToast(currentLanguage === 'en' ? 'You can upload up to 2 photos.' : '写真アップロードは2枚までです。');
          asImageFile.value = '';
          return;
        }
        const pickedFiles = files.slice(0, remainingSlots);
        const compressedImages = await Promise.all(pickedFiles.map(file => compressAndEncodeImage(file)));
        setUploadedSpotImages([...uploadedSpotImageBase64List, ...compressedImages]);
        asImageFile.value = '';
        if (files.length > remainingSlots) {
          showToast(currentLanguage === 'en' ? 'Only the first 2 photos were added.' : '写真は最大2枚まで追加しました。');
        }
      } catch (err) {
        console.error('Image compression failed:', err);
        alert('画像の読み込み・圧縮に失敗しました。');
      }
    });
  }
  const asImagePreviewList = document.getElementById('asImagePreviewList');
  if (asImagePreviewList) {
    asImagePreviewList.addEventListener('click', (e) => {
      const clearBtn = e.target.closest('.spot-image-clear-btn');
      if (!clearBtn) return;
      const index = parseInt(clearBtn.dataset.spotImageIndex || '-1', 10);
      if (index < 0) return;
      uploadedSpotImageBase64List.splice(index, 1);
      if (asImageFile) asImageFile.value = '';
      renderSpotImagePreviews();
    });
  }

  // 行ってみた投稿の画像アップロードイベント
  const fImageFile = document.getElementById('fImageFile');
  if (fImageFile) {
    fImageFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const compressed = await compressAndEncodeImage(file);
        uploadedPostImageBase64 = compressed;
        const preview = document.getElementById('fImagePreview');
        const container = document.getElementById('fImagePreviewContainer');
        if (preview && container) {
          preview.src = compressed;
          container.style.display = 'block';
        }
      } catch (err) {
        console.error('Image compression failed:', err);
        alert('画像の読み込み・圧縮に失敗しました。');
      }
    });
  }
  const fImageClearBtn = document.getElementById('fImageClearBtn');
  if (fImageClearBtn) {
    fImageClearBtn.addEventListener('click', () => {
      if (fImageFile) fImageFile.value = '';
      uploadedPostImageBase64 = null;
      const preview = document.getElementById('fImagePreview');
      const container = document.getElementById('fImagePreviewContainer');
      if (preview) preview.src = '';
      if (container) container.style.display = 'none';
    });
  }

  // カテゴリータブの横スクロールUX初期化
  initTabsScrollUX();
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
        return ids
          .map(id => ALL_WEATHER_CITIES.find(c => c.id === id))
          .filter(Boolean);
      }
    }
  } catch(e) {}
  return DEFAULT_WEATHER_CITY_IDS
    .map(id => ALL_WEATHER_CITIES.find(c => c.id === id))
    .filter(Boolean);
}

function getWeatherIcon(code) {
  const c = parseInt(code, 10);
  if (c >= 100 && c < 200) return '☀️';
  if (c >= 200 && c < 300) return '☁️';
  if (c >= 300 && c < 400) return '☔';
  if (c >= 400) return '⛄';
  return '☁️';
}

function getWeatherType(code) {
  const c = parseInt(code, 10);
  if (isNaN(c)) return 'sunny';
  if (c >= 100 && c < 200) return 'sunny';
  if (c >= 200 && c < 300) return 'cloudy';
  if (c >= 300 && c < 400) return 'rainy';
  if (c >= 400) return 'snowy';
  return 'sunny';
}

function updateWeatherBackdrop(type) {
  const WEATHER_CLASSES = ['weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-snowy'];

  // サイト全体（body）の水彩背景を天気に連動させる
  if (document.body) {
    document.body.classList.remove(...WEATHER_CLASSES);
    document.body.classList.add(`weather-${type}`);
  }

  const hero = document.getElementById('hero');
  const canvas = document.getElementById('heroWeatherCanvas');
  if (!hero || !canvas) return;

  hero.classList.remove(...WEATHER_CLASSES);
  hero.classList.add(`weather-${type}`);

  canvas.innerHTML = '';

  if (type === 'sunny') {
    const count = 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'weather-particle sunny-particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 12}s`;
      p.style.animationDuration = `${8 + Math.random() * 8}s`;
      p.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 80}px`);
      canvas.appendChild(p);
    }
  } else if (type === 'cloudy') {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'weather-particle cloudy-particle';
      p.style.top = `${5 + Math.random() * 60}%`;
      p.style.animationDelay = `${Math.random() * -48}s`;
      p.style.animationDuration = `${40 + Math.random() * 20}s`;
      p.style.setProperty('--drift-y', `${(Math.random() - 0.5) * 60}px`);
      canvas.appendChild(p);
    }
  } else if (type === 'rainy') {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'weather-particle rainy-particle';
      p.style.left = `${Math.random() * 110}%`;
      p.style.animationDelay = `${Math.random() * 2}s`;
      p.style.animationDuration = `${0.9 + Math.random() * 0.6}s`;
      p.style.setProperty('--drift-x', `${-40 - Math.random() * 40}px`);
      canvas.appendChild(p);
    }
  } else if (type === 'snowy') {
    const count = 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'weather-particle snowy-particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      p.style.animationDuration = `${6 + Math.random() * 5}s`;
      p.style.setProperty('--drift-x', `${20 + Math.random() * 60}px`);
      canvas.appendChild(p);
    }
  }
}

// 気象庁の警報・注意報コード → 表示ラベル（日英）と重大度
// 重大度: emergency（特別警報） > danger（土砂災害等の危険） > warning（警報） > advisory（注意報）
const JMA_WARNING_CODES = {
  // 特別警報
  '32': { ja: '暴風雪特別警報', en: 'Snowstorm Emergency', level: 'emergency' },
  '33': { ja: '大雨特別警報', en: 'Heavy Rain Emergency', level: 'emergency' },
  '35': { ja: '暴風特別警報', en: 'Storm Emergency', level: 'emergency' },
  '36': { ja: '大雪特別警報', en: 'Heavy Snow Emergency', level: 'emergency' },
  '37': { ja: '波浪特別警報', en: 'High Waves Emergency', level: 'emergency' },
  '38': { ja: '高潮特別警報', en: 'Storm Surge Emergency', level: 'emergency' },
  '39': { ja: '土砂災害特別警報', en: 'Landslide Emergency', level: 'emergency' },
  // 警報・危険警報
  '02': { ja: '暴風雪警報', en: 'Snowstorm Warning', level: 'warning' },
  '03': { ja: '大雨警報', en: 'Heavy Rain Warning', level: 'warning' },
  '04': { ja: '氾濫（洪水）警報', en: 'Flood / Overflow Warning', level: 'warning' },
  '05': { ja: '暴風警報', en: 'Storm Warning', level: 'warning' },
  '06': { ja: '大雪警報', en: 'Heavy Snow Warning', level: 'warning' },
  '07': { ja: '波浪警報', en: 'High Waves Warning', level: 'warning' },
  '08': { ja: '高潮警報', en: 'Storm Surge Warning', level: 'warning' },
  '48': { ja: '高潮危険警報', en: 'Storm Surge Danger Warning', level: 'danger' },
  '49': { ja: '土砂災害危険警報', en: 'Landslide Danger Warning', level: 'danger' },
  // 注意報
  '10': { ja: '大雨注意報', en: 'Heavy Rain Advisory', level: 'advisory' },
  '12': { ja: '大雪注意報', en: 'Heavy Snow Advisory', level: 'advisory' },
  '13': { ja: '風雪注意報', en: 'Snowstorm Advisory', level: 'advisory' },
  '14': { ja: '雷注意報', en: 'Thunderstorm Advisory', level: 'advisory' },
  '15': { ja: '強風注意報', en: 'Strong Wind Advisory', level: 'advisory' },
  '16': { ja: '波浪注意報', en: 'High Waves Advisory', level: 'advisory' },
  '17': { ja: '融雪注意報', en: 'Snowmelt Advisory', level: 'advisory' },
  '18': { ja: '氾濫（洪水）注意報', en: 'Flood / Overflow Advisory', level: 'advisory' },
  '19': { ja: '高潮注意報', en: 'Storm Surge Advisory', level: 'advisory' },
  '20': { ja: '濃霧注意報', en: 'Dense Fog Advisory', level: 'advisory' },
  '21': { ja: '乾燥注意報', en: 'Dry Air Advisory', level: 'advisory' },
  '22': { ja: 'なだれ注意報', en: 'Avalanche Advisory', level: 'advisory' },
  '23': { ja: '低温注意報', en: 'Low Temperature Advisory', level: 'advisory' },
  '24': { ja: '霜注意報', en: 'Frost Advisory', level: 'advisory' },
  '25': { ja: '着氷注意報', en: 'Icing Advisory', level: 'advisory' },
  '26': { ja: '着雪注意報', en: 'Snow Accretion Advisory', level: 'advisory' },
  '27': { ja: 'その他の注意報', en: 'Other Advisory', level: 'advisory' },
  '29': { ja: '土砂災害注意報', en: 'Landslide Advisory', level: 'advisory' },
  // 河川氾濫警報・危険警報（指定河川洪水予報のコードなど）
  '30': { ja: '氾濫警報', en: 'Flood Warning', level: 'warning' },
  '31': { ja: '氾濫警報', en: 'Flood Warning', level: 'warning' },
  '40': { ja: '氾濫危険警報', en: 'Flood Danger Warning', level: 'danger' },
  '41': { ja: '氾濫危険警報', en: 'Flood Danger Warning', level: 'danger' },
  '51': { ja: '氾濫特別警報', en: 'Flood Emergency', level: 'emergency' },
  '53': { ja: '氾濫特別警報', en: 'Flood Emergency', level: 'emergency' },
};
const WARNING_LEVEL_RANK = { emergency: 4, danger: 3, warning: 2, advisory: 1 };
const JMA_ACTIVE_WARNING_STATUSES = new Set(['発表', '継続']);
const JMA_ALERT_LEVEL_LABELS = {
  advisory: { ja: '警戒レベル2相当', en: 'Level 2 equiv.' },
  warning: { ja: '警戒レベル3相当', en: 'Level 3 equiv.' },
  danger: { ja: '警戒レベル4相当', en: 'Level 4 equiv.' },
  emergency: { ja: '警戒レベル5相当', en: 'Level 5 equiv.' }
};
const JMA_DANGER_LEVEL_BY_VALUE = {
  '10': 'advisory',
  '20': 'warning',
  '30': 'danger',
  '40': 'emergency',
  '50': 'emergency'
};
const JMA_DANGER_TYPES = [
  { keys: ['土砂災害', '土砂'], ja: '土砂災害危険度', en: 'Landslide risk' },
  { keys: ['洪水', '氾濫'], ja: '氾濫（洪水）危険度', en: 'Flood / overflow risk' },
  { keys: ['浸水害', '浸水'], ja: '浸水害危険度', en: 'Inundation risk' }
];

function getJmaAlertLevelLabel(level, isEn) {
  const label = JMA_ALERT_LEVEL_LABELS[level];
  if (!label) return '';
  return isEn ? label.en : label.ja;
}

function getJmaCurrentTimeIndex(timeDefines) {
  if (!Array.isArray(timeDefines) || timeDefines.length === 0) return 0;
  const now = Date.now();
  let currentIndex = 0;
  timeDefines.forEach((time, index) => {
    const parsed = Date.parse(time);
    if (!Number.isNaN(parsed) && parsed <= now) currentIndex = index;
  });
  return Math.min(currentIndex, timeDefines.length - 1);
}

function normalizeJmaLevelValue(value) {
  if (value == null) return '';
  if (typeof value === 'object') {
    return String(value.value || value.level || value.code || '').trim();
  }
  return String(value).trim();
}

function getJmaDangerType(typeText) {
  const text = String(typeText || '');
  return JMA_DANGER_TYPES.find(type => type.keys.some(key => text.includes(key)));
}

function getJmaDangerLevel(values, timeIndex) {
  if (!Array.isArray(values) || values.length === 0) return null;
  const value = normalizeJmaLevelValue(values[Math.min(timeIndex, values.length - 1)]);
  return JMA_DANGER_LEVEL_BY_VALUE[value] || null;
}

function extractJmaDangerWarnings(data, targetAreaCode) {
  const result = [];
  const seen = new Set();
  const series = Array.isArray(data && data.timeSeries) ? data.timeSeries : [];
  series.forEach(ts => {
    const timeIndex = getJmaCurrentTimeIndex(ts.timeDefines);
    (ts.areaTypes || []).forEach(areaType => {
      (areaType.areas || []).forEach(area => {
        if (targetAreaCode && area.code !== targetAreaCode) return;
        (area.warnings || []).forEach(warning => {
          (warning.levels || []).forEach(levelInfo => {
            const dangerType = getJmaDangerType(levelInfo.type);
            if (!dangerType) return;
            const localAreas = Array.isArray(levelInfo.localAreas) && levelInfo.localAreas.length > 0
              ? levelInfo.localAreas
              : [{ values: levelInfo.values || [] }];
            localAreas.forEach(localArea => {
              const level = getJmaDangerLevel(localArea.values, timeIndex);
              if (!level) return;
              const key = `${dangerType.ja}_${level}`;
              if (seen.has(key)) return;
              seen.add(key);
              result.push({
                ja: dangerType.ja,
                en: dangerType.en,
                level,
                source: 'danger'
              });
            });
          });
        });
      });
    });
  });
  return result;
}

// 一次細分区域コード → 区域名（日英）。気象庁 area.json の class10s から取得し長期キャッシュ。
let _jmaAreaNames = null;
async function ensureJmaAreaNames() {
  if (_jmaAreaNames) return _jmaAreaNames;
  try {
    const raw = localStorage.getItem('popopo_jma_area_names_v1');
    if (raw) { _jmaAreaNames = JSON.parse(raw); return _jmaAreaNames; }
  } catch (e) {}
  try {
    const res = await fetch('https://www.jma.go.jp/bosai/common/const/area.json');
    if (res.ok) {
      const aj = await res.json();
      const c10 = aj.class10s || {};
      const map = {};
      Object.keys(c10).forEach(code => {
        map[code] = { ja: c10[code].name || '', en: c10[code].enName || c10[code].name || '' };
      });
      _jmaAreaNames = map;
      try { localStorage.setItem('popopo_jma_area_names_v1', JSON.stringify(map)); } catch (e) {}
      return _jmaAreaNames;
    }
  } catch (e) { console.warn('area.json load failed:', e); }
  _jmaAreaNames = {};
  return _jmaAreaNames;
}

// 土砂・洪水・浸水の危険度を「区域コードを保ったまま」抽出する。
// allowedCodes（一次細分区域コードの集合）に含まれる区域だけを対象にし、細分の重複を避ける。
function extractJmaDangerWarningsByArea(data, allowedCodes) {
  const out = [];
  const seen = new Set();
  (Array.isArray(data && data.timeSeries) ? data.timeSeries : []).forEach(ts => {
    const timeIndex = getJmaCurrentTimeIndex(ts.timeDefines);
    (ts.areaTypes || []).forEach(areaType => {
      (areaType.areas || []).forEach(area => {
        if (allowedCodes && !allowedCodes.has(area.code)) return;
        (area.warnings || []).forEach(warning => {
          (warning.levels || []).forEach(levelInfo => {
            const dangerType = getJmaDangerType(levelInfo.type);
            if (!dangerType) return;
            const localAreas = Array.isArray(levelInfo.localAreas) && levelInfo.localAreas.length > 0
              ? levelInfo.localAreas
              : [{ values: levelInfo.values || [] }];
            localAreas.forEach(localArea => {
              const level = getJmaDangerLevel(localArea.values, timeIndex);
              if (!level) return;
              const key = `${area.code}_${dangerType.ja}_${level}`;
              if (seen.has(key)) return;
              seen.add(key);
              out.push({ areaCode: area.code, info: { ja: dangerType.ja, en: dangerType.en, level, source: 'danger' } });
            });
          });
        });
      });
    });
  });
  return out;
}

// 1都市分の警報・注意報を、一次細分区域ごとに分けて取得する。
// 発表中の区域だけを返す（「東京都 小笠原諸島」のように区域単位で表示するため）。
async function fetchCityWarnings(city) {
  const res = await fetch(`https://www.jma.go.jp/bosai/warning/data/r8/${city.id}.json`);
  if (!res.ok) throw new Error('Warning network error');
  const data = await res.json();

  // 新体系は警報種別のXML電文区分ごとに複数のドキュメントが含まれる配列
  const class10Codes = new Set();
  data.forEach(elem => {
    const items = elem.warning?.class10Items || [];
    items.forEach(item => {
      if (item.areaCode) class10Codes.add(item.areaCode);
    });
  });

  const perArea = new Map();
  const ensureBucket = (code) => {
    if (!perArea.has(code)) perArea.set(code, { warnings: [], seen: new Set() });
    return perArea.get(code);
  };

  data.forEach(elem => {
    const items = elem.warning?.class10Items || [];
    items.forEach(item => {
      (item.kinds || []).forEach(w => {
        if (!JMA_ACTIVE_WARNING_STATUSES.has(w.status)) return;
        if (!w.code || w.code === '00') return;
        const known = JMA_WARNING_CODES[w.code];
        if (!known) console.warn('[weather-alert] 未対応の警報コードを検出:', w.code, '区域', item.areaCode);
        const info = known || {
          ja: `警報・注意報（コード${w.code}）`,
          en: `Alert (code ${w.code})`,
          level: 'warning'
        };
        const bucket = ensureBucket(item.areaCode);
        if (bucket.seen.has(info.ja)) return;
        bucket.seen.add(info.ja);
        bucket.warnings.push({ ja: info.ja, en: info.en, level: info.level });
      });
    });
  });

  const names = await ensureJmaAreaNames();
  const areasOut = [];
  let cityTop = null, cityRank = 0;

  // 区域コード順（JMA標準）でソートして処理
  const sortedCodes = Array.from(class10Codes).sort();
  sortedCodes.forEach(code => {
    const bucket = perArea.get(code);
    if (!bucket || bucket.warnings.length === 0) return;
    let topLevel = null, topRank = 0;
    bucket.warnings.forEach(w => {
      if (WARNING_LEVEL_RANK[w.level] > topRank) {
        topRank = WARNING_LEVEL_RANK[w.level];
        topLevel = w.level;
      }
    });
    const nm = names[code] || {};
    areasOut.push({
      areaCode: code,
      areaName: nm.ja || '',
      areaNameEn: nm.en || nm.ja || '',
      warnings: bucket.warnings,
      topLevel
    });
    if (topRank > cityRank) {
      cityRank = topRank;
      cityTop = topLevel;
    }
  });

  return { cityId: city.id, cityName: city.name, areas: areasOut, topLevel: cityTop };
}

async function fetchCityWeather(city) {
  const res = await fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${city.id}.json`);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();

  const currentHour = new Date().getHours();
  const isTomorrow = (currentHour >= 18 || currentHour < 5);

  const wCodes = data[0].timeSeries[0].areas[0].weatherCodes;
  const weatherCode = (isTomorrow && wCodes.length > 1) ? wCodes[1] : wCodes[0];
  const icon = getWeatherIcon(weatherCode);

  const cities = getSelectedWeatherCities();
  const isFirstCity = cities.length > 0 && city.id === cities[0].id;
  if (isFirstCity) {
    const weatherType = getWeatherType(weatherCode);
    sessionStorage.setItem(`popopo_weather_type_${city.id}`, weatherType);
    updateWeatherBackdrop(weatherType);
  }

  const getLocalDateString = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${date}`;
  };

  const todayStr = getLocalDateString(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrow);
  const targetDateStr = isTomorrow ? tomorrowStr : todayStr;

  // Max Temp extraction
  let maxTemp = '';
  let matchingTemps = [];
  try {
    const temps = data[0].timeSeries[2].areas[0].temps;
    const timeDefines = data[0].timeSeries[2].timeDefines;
    for (let i = 0; i < timeDefines.length; i++) {
      if (timeDefines[i].startsWith(targetDateStr) && temps[i] !== undefined && temps[i] !== '') {
        matchingTemps.push(parseInt(temps[i], 10));
      }
    }
  } catch (e) {}

  if (matchingTemps.length > 0) {
    maxTemp = String(Math.max(...matchingTemps));
  } else {
    try {
      const weeklyTimes = data[1].timeSeries[1].timeDefines;
      const weeklyMaxes = data[1].timeSeries[1].areas[0].tempsMax;
      for (let i = 0; i < weeklyTimes.length; i++) {
        if (weeklyTimes[i].startsWith(targetDateStr) && weeklyMaxes[i] !== undefined && weeklyMaxes[i] !== '') {
          maxTemp = weeklyMaxes[i];
          break;
        }
      }
    } catch (e) {}
    
    if (!maxTemp) {
      try {
        const tempsMax = data[1].timeSeries[1].areas[0].tempsMax;
        const validTemp = tempsMax.find(t => t !== '');
        if (validTemp) maxTemp = validTemp;
      } catch(e) {}
    }
  }

  // PoP extraction
  let pop = '';
  let matchingPops = [];
  try {
    const pops = data[0].timeSeries[1].areas[0].pops;
    const timeDefines = data[0].timeSeries[1].timeDefines;
    for (let i = 0; i < timeDefines.length; i++) {
      if (timeDefines[i].startsWith(targetDateStr) && pops[i] !== undefined && pops[i] !== '') {
        matchingPops.push(parseInt(pops[i], 10));
      }
    }
  } catch (e) {}

  if (matchingPops.length > 0) {
    pop = String(Math.max(...matchingPops));
  } else {
    try {
      const pops = data[0].timeSeries[1].areas[0].pops;
      const validPop = pops.find(p => p !== '');
      if (validPop) pop = validPop;
    } catch(e) {}
  }

  const isEn = currentLanguage === 'en';
  const cityName = isEn ? (ADDRESS_TRANSLATION_MAP[city.name] || city.name) : city.name;

  return `
    <div class="weather-item" data-city-id="${city.id}">
      <span class="w-name">📍${cityName}</span>
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

// マーキー内の該当都市に ⚠️ バッジを付ける（map: cityId -> level）
function applyCityWarningBadges(map) {
  const isEn = currentLanguage === 'en';
  document.querySelectorAll('.weather-item[data-city-id]').forEach(item => {
    const prev = item.querySelector('.w-alert-badge');
    if (prev) prev.remove();
    const level = map.get(item.dataset.cityId);
    if (!level) return;
    const badge = document.createElement('span');
    badge.className = `w-alert-badge w-alert-badge--${level}`;
    badge.textContent = '⚠️';
    badge.title = isEn ? 'Weather alert issued' : '警報・注意報が発表中';
    item.appendChild(badge);
  });
}

function renderWeatherAlertType(info, isEn) {
  const label = isEn ? info.en : info.ja;
  const levelLabel = getJmaAlertLevelLabel(info.level, isEn);
  return (
    `<span class="weather-alert-type weather-alert-type--${escHtml(info.level)}">` +
      `<span class="weather-alert-type-name">${escHtml(label)}</span>` +
      (levelLabel ? `<span class="weather-level-chip weather-level-chip--${escHtml(info.level)}">${escHtml(levelLabel)}</span>` : '') +
    `</span>`
  );
}

// 取得結果からアラート帯を描画し、都市バッジも更新する
function applyWeatherAlertResult(data, isEn) {
  const bar = document.getElementById('weatherAlertBar');
  if (!bar) return;
  if (!data || data.length === 0) {
    bar.hidden = true;
    bar.innerHTML = '';
    applyCityWarningBadges(new Map());
    return;
  }
  const title = isEn ? 'Weather Alerts' : '気象警報・注意報';
  const map = new Map();
  let overall = 'advisory', oRank = 0;
  const chips = [];
  data.forEach(r => {
    if (!Array.isArray(r.areas) || r.areas.length === 0) return;
    map.set(r.cityId, r.topLevel);
    if (WARNING_LEVEL_RANK[r.topLevel] > oRank) { oRank = WARNING_LEVEL_RANK[r.topLevel]; overall = r.topLevel; }
    const prefName = isEn ? (ADDRESS_TRANSLATION_MAP[r.cityName] || r.cityName) : r.cityName;
    r.areas.forEach(area => {
      const labels = area.warnings.map(w => renderWeatherAlertType(w, isEn)).join('');
      const areaName = isEn ? (area.areaNameEn || area.areaName) : area.areaName;
      const place = areaName ? `${escHtml(prefName)} ${escHtml(areaName)}` : escHtml(prefName);
      chips.push(`<span class="weather-alert-city weather-alert-city--${area.topLevel}"><span class="weather-alert-city-name">📍${place}</span><span class="weather-alert-types">${labels}</span></span>`);
    });
  });
  const cityChips = chips.join('');
  bar.className = `weather-alert-bar weather-alert-bar--${overall}`;
  bar.hidden = false;
  bar.innerHTML =
    `<span class="weather-alert-icon" aria-hidden="true">⚠️</span>` +
    `<span class="weather-alert-title">${title}</span>` +
    `<span class="weather-alert-cities">${cityChips}</span>` +
    `<span class="weather-alert-note">${isEn ? 'Please check the Japan Meteorological Agency website for the latest details.' : '最新情報は気象庁ホームページをご確認ください。'}</span>` +
    `<a class="weather-alert-more" href="https://www.jma.go.jp/bosai/warning/" target="_blank" rel="noopener">${isEn ? 'Details' : '詳細'}</a>`;
  applyCityWarningBadges(map);
}

function showWeatherDataUnavailableNotice(isEn) {
  const bar = document.getElementById('weatherAlertBar');
  if (!bar) return;
  bar.className = 'weather-alert-bar weather-alert-bar--notice';
  bar.hidden = false;
  bar.innerHTML =
    `<span class="weather-alert-icon" aria-hidden="true">ℹ️</span>` +
    `<span class="weather-alert-title">${isEn ? 'Weather Data Notice' : '気象データについて'}</span>` +
    `<span class="weather-alert-note">${isEn ? 'Weather data from the Japan Meteorological Agency may be temporarily unavailable or delayed. Please check the JMA website for the latest official information.' : '気象庁データの取得が一時的に不安定、または遅れている可能性があります。最新の公式情報は気象庁ホームページをご確認ください。'}</span>` +
    `<a class="weather-alert-more" href="https://www.jma.go.jp/bosai/" target="_blank" rel="noopener">${isEn ? 'JMA website' : '気象庁を見る'}</a>`;
  applyCityWarningBadges(new Map());
}

// 選択都市の警報・注意報をまとめて取得して表示（30分キャッシュ）
async function renderWeatherAlerts() {
  const bar = document.getElementById('weatherAlertBar');
  if (!bar) return;
  const isEn = currentLanguage === 'en';
  const cities = getSelectedWeatherCities();
  const cacheKey = `popopo_weather_alert_v5_${cities.map(c => c.id).join('_')}_${currentLanguage}`;
  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj && (Date.now() - obj.ts) < 30 * 60 * 1000) {
        applyWeatherAlertResult(obj.data, isEn);
        return;
      }
    }
  } catch (e) {}
  try {
    const results = await Promise.all(cities.map(c => fetchCityWarnings(c).catch(() => null)));
    const data = results.filter(r => r && Array.isArray(r.areas) && r.areas.length > 0);
    try { sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data })); } catch (e) {}
    applyWeatherAlertResult(data, isEn);
  } catch (e) {
    console.warn('Weather alerts fetch failed:', e);
    showWeatherDataUnavailableNotice(isEn);
  }
}

async function renderWeather() {
  const container = document.getElementById('weatherItems');
  if (!container) return;

  const cities = getSelectedWeatherCities();
  const isEn = currentLanguage === 'en';

  const cacheKey = `popopo_weather_cache_${cities.map(c => c.id).join('_')}_${currentLanguage}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    container.innerHTML = cached + cached + cached;
    // キャッシュ時も背景天気を復元
    if (cities.length > 0) {
      const cachedType = sessionStorage.getItem(`popopo_weather_type_${cities[0].id}`);
      if (cachedType) {
        updateWeatherBackdrop(cachedType);
      }
    }
    // 少し待ってからアニメ開始（DOM描画完了を待つ）
    setTimeout(startWeatherMarquee, 100);
    renderWeatherAlerts();
    return;
  }

  container.innerHTML = `<span style="color:var(--text-muted); font-size:0.85rem;">${isEn ? 'Fetching weather...' : '天気を取得中...'}</span>`;

  try {
    const results = await Promise.all(cities.map(fetchCityWeather));
    const html = results.join('');
    container.innerHTML = html + html + html;
    sessionStorage.setItem(cacheKey, html);
    // DOM描画後にアニメ開始
    setTimeout(startWeatherMarquee, 100);
    renderWeatherAlerts();
  } catch (error) {
    console.error('Weather fetch failed:', error);
    container.innerHTML = `<span class="weather-unavailable">${isEn ? 'Weather data may be temporarily unavailable. Please check JMA.' : '気象データの取得が一時的に不安定です。気象庁をご確認ください。'}</span>`;
    showWeatherDataUnavailableNotice(isEn);
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

  let selectedIds = []; // 選択順序を保持する配列

  const openModal = () => {
    selectedIds = getSelectedWeatherCities().map(c => c.id);
    const isEn = currentLanguage === 'en';
    
    grid.innerHTML = ALL_WEATHER_CITIES.map(city => {
      const displayName = isEn ? (ADDRESS_TRANSLATION_MAP[city.name] || city.name) : city.name;
      return `
        <button type="button"
          class="weather-city-chip"
          data-city-id="${city.id}">
          <span class="chip-check">✓</span>${displayName}
        </button>
      `;
    }).join('');

    const updateGridUI = () => {
      grid.querySelectorAll('.weather-city-chip').forEach(chip => {
        const cityId = chip.dataset.cityId;
        const index = selectedIds.indexOf(cityId);
        const isSelected = index !== -1;
        const checkEl = chip.querySelector('.chip-check');

        if (isSelected) {
          chip.classList.add('is-selected');
          if (checkEl) {
            if (index === 0) {
              checkEl.innerHTML = '👑 1:';
              chip.title = isEn ? 'Backdrop Weather City (👑)' : '背景天気を決定する都市 (👑)';
            } else {
              checkEl.innerHTML = `${index + 1}:`;
              chip.removeAttribute('title');
            }
          }
        } else {
          chip.classList.remove('is-selected');
          chip.removeAttribute('title');
        }
      });
    };

    // 初期状態を反映
    updateGridUI();

    grid.querySelectorAll('.weather-city-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cityId = chip.dataset.cityId;
        if (selectedIds.includes(cityId)) {
          selectedIds = selectedIds.filter(id => id !== cityId);
        } else {
          selectedIds.push(cityId);
        }
        updateGridUI();
      });
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
    const isEn = currentLanguage === 'en';
    if (selectedIds.length === 0) {
      showToast(isEn ? 'Please select at least one city' : '1つ以上の都市を選択してください');
      return;
    }
    localStorage.setItem(WEATHER_CITY_STORAGE_KEY, JSON.stringify(selectedIds));
    
    // キャッシュをクリア
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('popopo_weather_cache_') || key.startsWith('popopo_weather_alert_'))) {
        sessionStorage.removeItem(key);
      }
    }

    closeModal();
    renderWeather(); // 再取得して表示更新
    showToast(isEn ? 'Saved city settings ✓' : '都市の設定を保存しました ✓');
  });
}

// ============================================================
// 10. POPOPO デジタルお出かけマップ (Leaflet)
// ============================================================
let leafletMapInstance = null;
let leafletMarkersGroup = null;
let activeMapPanelTab = 'online';

// 静的スポットの緯度経度データ (全28件)
const SPOT_COORDINATES = {
  'lion': { lat: 35.6596, lng: 139.6983 },
  'beltz': { lat: 35.651444, lng: 139.713033 },
  'torikatsu': { lat: 35.658615, lng: 139.696684 },
  'hinto': { lat: 34.7246, lng: 135.3685 },
  'comme-chinois': { lat: 34.69276, lng: 135.196312 },
  'karayaki': { lat: 35.701486, lng: 139.698134 },
  'yugi': { lat: 35.7313, lng: 139.7107 },
  'manchs': { lat: 35.651014, lng: 139.751718 },
  'kameju': { lat: 35.710685, lng: 139.796749 },
  'kamado-gohan-matsushima': { lat: 35.6835, lng: 139.7825 },
  'yamaya-ikebukuro': { lat: 35.72566, lng: 139.71700 },
  'kura-global-flagship': { lat: 35.71291, lng: 139.792845 },
  'saryo-tsujiri-daimaru': { lat: 35.68166, lng: 139.76901 },
  'leonards-japan': { lat: 35.454207, lng: 139.63847 },
  'mohinga': { lat: 35.7134, lng: 139.7042 },
  '400do-pizza': { lat: 34.3917, lng: 132.4536 },
  'yamatane': { lat: 35.65317, lng: 139.7137 },
  'nmwa': { lat: 35.71556, lng: 139.77583 },
  'edo': { lat: 35.696403, lng: 139.796103 },
  'hokusai': { lat: 35.696398, lng: 139.800457 },
  'yoyogi': { lat: 35.6715, lng: 139.6949 },
  'kagurazaka-machibutai-2026': { lat: 35.701504, lng: 139.739539 },
  'inokashira': { lat: 35.6997, lng: 139.5732 },
  'koishikawa-korakuen': { lat: 35.7056, lng: 139.7493 },
  'tsutaya': { lat: 35.6489, lng: 139.6994 },
  'kakimori': { lat: 35.7027, lng: 139.7895 },
  'shibuyasky': { lat: 35.6585, lng: 139.7018 },
  'kogane': { lat: 35.7001, lng: 139.8252 },
  'ikebukuro-jazz-festival': { lat: 35.730223, lng: 139.709228 },
  'thai-festival-tokyo': { lat: 35.6669, lng: 139.6958 },
  'lafollejournee-tokyo-2026': { lat: 35.6769, lng: 139.7644 },
  'niconico-chokaigi': { lat: 35.6484, lng: 140.0347 },
  'kasai-rinkai-crystal-view': { lat: 35.6406, lng: 139.8595 },
  'sample-yasashii-ueno-park': { lat: 35.7148, lng: 139.7732 },
  'sample-yasashii-tennoji-park': { lat: 34.6498, lng: 135.5120 },
  'sample-yasashii-oasis21': { lat: 35.1709, lng: 136.9083 },
  'sample-yasashii-odori-park': { lat: 43.0599, lng: 141.3477 },
  'sample-yasashii-fukuoka-art-museum': { lat: 33.5862, lng: 130.3797 },
  'tokyo-mitaiwara': { lat: 35.6635, lng: 139.8604 },
  'ota-memorial-museum': { lat: 35.669417, lng: 139.704889 },
  'rakusho-ramen': { lat: 33.589739, lng: 130.397435 },
  'tokin': { lat: 33.586002, lng: 130.397373 },
  'kusamakura-cafe': { lat: 35.669001, lng: 139.752824 },
  'japan-coast-guard-museum-yokohama': { lat: 35.454794, lng: 139.64406 },
  'sanin-gyokai-chuka-soba': { lat: 35.741553, lng: 139.655676 },
  'frijoles-yaesu': { lat: 35.679421, lng: 139.768907 },
  'oyama-milk-no-sato': { lat: 35.377324, lng: 133.509937 },
  'ramen-otama': { lat: 35.4325, lng: 133.3444 },
  'queen-hiroba-yokohama-customs': { lat: 35.448951, lng: 139.642525 },
  'aagan': { lat: 35.701513, lng: 139.702466 },
  'rosetsu': { lat: 35.6789, lng: 139.4922 }
};

// 日本の47都道府県の代表点座標（ダイナミック投稿のフォールバック用）
const PREFECTURE_CENTERS = {
  '北海道': { lat: 43.0642, lng: 141.3468 },
  '青森': { lat: 40.8244, lng: 140.7475 },
  '岩手': { lat: 39.7036, lng: 141.1527 },
  '宮城': { lat: 38.2682, lng: 140.8694 },
  '秋田': { lat: 39.7186, lng: 140.1023 },
  '山形': { lat: 38.2554, lng: 140.3396 },
  '福島': { lat: 37.7503, lng: 140.4676 },
  '茨城': { lat: 36.3418, lng: 140.4468 },
  '栃木': { lat: 36.5658, lng: 139.8836 },
  '群馬': { lat: 36.3895, lng: 139.0634 },
  '埼玉': { lat: 35.8570, lng: 139.6489 },
  '千葉': { lat: 35.6051, lng: 140.1233 },
  '東京': { lat: 35.6895, lng: 139.6917 },
  '神奈川': { lat: 35.4478, lng: 139.6425 },
  '新潟': { lat: 37.9022, lng: 139.0236 },
  '富山': { lat: 36.6953, lng: 137.2113 },
  '石川': { lat: 36.5947, lng: 136.6256 },
  '福井': { lat: 36.0652, lng: 136.2216 },
  '山梨': { lat: 35.6639, lng: 138.5683 },
  '長野': { lat: 36.6513, lng: 138.1810 },
  '岐阜': { lat: 35.4158, lng: 136.7601 },
  '静岡': { lat: 34.9756, lng: 138.3828 },
  '愛知': { lat: 35.1802, lng: 136.9066 },
  '三重': { lat: 34.7303, lng: 136.5086 },
  '滋賀': { lat: 35.0045, lng: 135.8686 },
  '京都': { lat: 35.0116, lng: 135.7681 },
  '大阪': { lat: 34.6863, lng: 135.5200 },
  '兵庫': { lat: 34.6901, lng: 135.1955 },
  '奈良': { lat: 34.6851, lng: 135.8327 },
  '和歌山': { lat: 34.2260, lng: 135.1675 },
  '鳥取': { lat: 35.5036, lng: 134.2383 },
  '島根': { lat: 35.4723, lng: 133.0505 },
  '岡山': { lat: 34.6618, lng: 133.9347 },
  '広島': { lat: 34.3963, lng: 132.4594 },
  '山口': { lat: 34.1860, lng: 131.4705 },
  '徳島': { lat: 34.0710, lng: 134.5593 },
  '香川': { lat: 34.3402, lng: 134.0434 },
  '愛媛': { lat: 33.8416, lng: 132.7657 },
  '高知': { lat: 33.5597, lng: 133.5311 },
  '福岡': { lat: 33.6064, lng: 130.4182 },
  '佐賀': { lat: 33.2635, lng: 130.3009 },
  '長崎': { lat: 32.7501, lng: 129.8773 },
  '熊本': { lat: 32.7898, lng: 130.7417 },
  '大分': { lat: 33.2382, lng: 131.6126 },
  '宮崎': { lat: 31.9077, lng: 131.4201 },
  '鹿児島': { lat: 31.5966, lng: 130.5578 },
  '沖縄': { lat: 26.2124, lng: 127.6809 }
};

// 有名ランドマークは都道府県・市区町村フォールバックより先に固定座標へ寄せる
const LANDMARK_CENTERS = {
  '奈良公園': { lat: 34.6850, lng: 135.8430 },
  'Nara Park': { lat: 34.6850, lng: 135.8430 },
  '東京ビッグサイト': { lat: 35.6301, lng: 139.7945 },
  'ビッグサイト': { lat: 35.6301, lng: 139.7945 },
  '有明': { lat: 35.6301, lng: 139.7945 },
  '国際展示場': { lat: 35.6301, lng: 139.7945 },
  'デザインフェスタ': { lat: 35.6301, lng: 139.7945 },
  'デザフェス': { lat: 35.6301, lng: 139.7945 },
  'Design Festa': { lat: 35.6301, lng: 139.7945 },
  '吉野家有楽町店': { lat: 35.67470, lng: 139.76344 },
  '吉野家 有楽町店': { lat: 35.67470, lng: 139.76344 },
  'Yoshinoya Yurakucho': { lat: 35.67470, lng: 139.76344 }
};

// 主要都市・地域の詳細座標 (ダイナミック投稿の近隣フォールバック用)
const CITY_CENTERS = {
  '渋谷': { lat: 35.6580, lng: 139.7016 },
  '道玄坂': { lat: 35.6580, lng: 139.7016 },
  '広尾': { lat: 35.6514, lng: 139.7130 },
  '新宿': { lat: 35.6909, lng: 139.7003 },
  '大久保': { lat: 35.7015, lng: 139.7024 },
  '百人町': { lat: 35.7014, lng: 139.6981 },
  '池袋': { lat: 35.7295, lng: 139.7109 },
  '芝': { lat: 35.6510, lng: 139.7517 },
  '港区': { lat: 35.6580, lng: 139.7517 },
  '浅草': { lat: 35.7120, lng: 139.7960 },
  '上野': { lat: 35.7155, lng: 139.7758 },
  '人形町': { lat: 35.6830, lng: 139.7750 },
  '日本橋': { lat: 35.6830, lng: 139.7750 },
  '銀座': { lat: 35.6720, lng: 139.7640 },
  '有楽町': { lat: 35.67470, lng: 139.76344 },
  '八重洲': { lat: 35.6794, lng: 139.7689 },
  '東京駅': { lat: 35.6816, lng: 139.7690 },
  '両国': { lat: 35.6964, lng: 139.7961 },
  '神楽坂': { lat: 35.7015, lng: 139.7395 },
  '後楽': { lat: 35.7056, lng: 139.7493 },
  '葛西': { lat: 35.6635, lng: 139.8604 },
  '江戸川': { lat: 35.6635, lng: 139.8604 },
  '東京ビッグサイト': { lat: 35.6301, lng: 139.7945 },
  'ビッグサイト': { lat: 35.6301, lng: 139.7945 },
  '有明': { lat: 35.6301, lng: 139.7945 },
  '国際展示場': { lat: 35.6301, lng: 139.7945 },
  'デザインフェスタ': { lat: 35.6301, lng: 139.7945 },
  'デザフェス': { lat: 35.6301, lng: 139.7945 },
  '練馬': { lat: 35.7350, lng: 139.6500 },
  '原宿': { lat: 35.6700, lng: 139.7020 },
  '三鷹': { lat: 35.7030, lng: 139.5800 },
  '武蔵野': { lat: 35.7030, lng: 139.5800 },
  '横浜': { lat: 35.4540, lng: 139.6380 },
  '三宮': { lat: 34.6920, lng: 135.1950 },
  '西宮': { lat: 34.7370, lng: 135.3400 },
  '天神': { lat: 33.5900, lng: 130.4000 },
  '今泉': { lat: 33.5860, lng: 130.3974 },
  '大山': { lat: 35.3773, lng: 133.5100 },
  '米子': { lat: 35.4325, lng: 133.3444 }
};

function isOnlineOnlySpot(spot = {}) {
  const normPref = normalizePrefValue(spot.pref);
  const areaStr = String(spot.area || '');
  const nameKey = normalizeString(spot.name || '');
  const combined = `${spot.id || ''} ${spot.name || ''} ${spot.area || ''} ${spot.pref || ''} ${spot.url || ''}`.toLowerCase();

  if (normPref === 'オンライン' || areaStr.includes('オンライン')) return true;
  if (nameKey.includes('ハズビンホテル') || nameKey.includes('ドキュメント72時間')) return true;
  if (spot.cat === 'entertainment' && (
    combined.includes('amazon prime') ||
    combined.includes('prime video') ||
    combined.includes('amazon.co.jp/gp/video') ||
    combined.includes('nhk.jp') ||
    areaStr.includes('Amazon Prime Video') ||
    areaStr.includes('NHK')
  )) {
    return true;
  }
  return false;
}

function getLandmarkCoordsForSpot(spot = {}) {
  const combinedText = `${spot.area || ''} ${spot.city || ''} ${spot.areaGroup || ''} ${spot.areaNote || ''} ${spot.name || ''} ${spot.memo || ''} ${spot.reason || ''}`;
  const normalizedCombined = normalizeString(combinedText);
  if (normalizedCombined.includes('吉野家') && normalizedCombined.includes('有楽町')) {
    return LANDMARK_CENTERS['吉野家有楽町店'];
  }
  const matchedLandmarkKey = Object.keys(LANDMARK_CENTERS).find(key => {
    return combinedText.includes(key) || normalizedCombined.includes(normalizeString(key));
  });
  return matchedLandmarkKey ? LANDMARK_CENTERS[matchedLandmarkKey] : null;
}

// カテゴリ別カラーパレット (style.cssのバッジ色と調和)
function getMarkerBorderColor(cat) {
  const colors = {
    food: '#ff7e8e',         // 飲食店 (ソフトピンク)
    mohinga: '#ffb31a',      // 食べたいもの (ゴールド)
    museum: '#7b2cbf',       // 美術館・博物館 (パープル)
    event: '#00db8b',        // イベント (グリーン)
    nature: '#48cae4',       // 自然・よりみち (スカイブルー)
    book: '#9e2a2b',         // 本・しらべもの (レンガブラウン)
    shop: '#fb8500',         // くらし・雑貨 (オレンジ)
    view: '#8338ec',         // おきにいりの景色 (バイオレット)
    relax: '#4cc9f0',        // 癒やし・ととのう (ライトブルー)
    entertainment: '#ff006e' // エンタメ (マゼンタ)
  };
  return colors[cat] || '#5b8dee';
}

function openMapModal() {
  const modal = document.getElementById('mapModal');
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // 初回表示時にマップを初期化
  if (!leafletMapInstance) {
    initLeafletMap();
  } else {
    // 2回目以降は表示サイズ更新＆マーカーの再読み込み
    setTimeout(() => {
      leafletMapInstance.invalidateSize();
      loadMapMarkers();
    }, 150);
  }
}

function closeMapModal() {
  const modal = document.getElementById('mapModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

function initLeafletMap() {
  const container = document.getElementById('leafletMap');
  if (!container) return;

  // クイックナビゲーションバーを動的に追加 (すでにない場合)
  let quickNav = container.parentNode.querySelector('.map-quick-nav');
  if (!quickNav) {
    quickNav = document.createElement('div');
    quickNav.className = 'map-quick-nav';
    quickNav.innerHTML = `
      <button type="button" class="map-nav-btn" data-nav="tokyo">🗼 東京</button>
      <button type="button" class="map-nav-btn" data-nav="kansai">🐙 関西</button>
      <button type="button" class="map-nav-btn" data-nav="hiroshima">🍋 広島</button>
      <button type="button" class="map-nav-btn" data-nav="all">🗺️ 全体</button>
    `;
    container.parentNode.appendChild(quickNav);

    quickNav.querySelectorAll('.map-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dest = btn.dataset.nav;
        if (!leafletMapInstance) return;
        if (dest === 'tokyo') {
          leafletMapInstance.setView([35.6895, 139.6917], 12);
        } else if (dest === 'kansai') {
          leafletMapInstance.setView([34.6937, 135.5023], 10);
        } else if (dest === 'hiroshima') {
          leafletMapInstance.setView([34.3963, 132.4594], 12);
        } else if (dest === 'all') {
          if (leafletMarkersGroup && leafletMarkersGroup.getLayers().length > 0) {
            leafletMapInstance.fitBounds(leafletMarkersGroup.getBounds(), { padding: [40, 40] });
          }
        }
      });
    });
  }

  // レンダリング保証のための遅延実行
  setTimeout(() => {
    leafletMapInstance = L.map('leafletMap', {
      center: [35.6895, 139.6917],
      zoom: 11,
      zoomControl: true
    });

    // CartoDB Voyager レイヤーをロード ( watercolor / 手描き風によく調和する )
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(leafletMapInstance);

    leafletMarkersGroup = L.featureGroup().addTo(leafletMapInstance);

    loadMapMarkers();
  }, 100);
}

function loadMapMarkers() {
  if (!leafletMapInstance || !leafletMarkersGroup) return;

  leafletMarkersGroup.clearLayers();
  const allSpots = getAllSpotItemsForDisplay();

  // オンラインおすすめパネルをレンダリング
  renderMapOnlinePanel();

  allSpots.forEach(spot => {
    const locationMeta = inferLocationMeta(spot);
    const normPref = normalizePrefValue(spot.pref || locationMeta.pref);
    const areaStr = String(spot.area || locationMeta.area || '');

    // オンライン・全国は地図ピン対象外
    if (normPref === '全国' || normPref === 'オンライン' || areaStr.includes('全国') || areaStr.includes('オンライン')) return;
    if (isOnlineOnlySpot(spot)) return;

    let coords = null;

    // 1. 静的定義されているスポット
    if (SPOT_COORDINATES[spot.id]) {
      coords = SPOT_COORDINATES[spot.id];
    }
    // 1b. 動的提案スポットだが、静的定義されているスポット名と一致する場合
    else {
      const matchedStaticSpot = findStaticSpotByName(spot.name);
      if (matchedStaticSpot && SPOT_COORDINATES[matchedStaticSpot.id]) {
        coords = SPOT_COORDINATES[matchedStaticSpot.id];
      }
    }

    // 1c. 有名ランドマーク名が含まれる場合は固定座標を優先する
    if (!coords) {
      coords = getLandmarkCoordsForSpot(spot);
    }

    // 2. 静的スポットとマッチしなかった場合、CITY_CENTERSでエリア・スポット名マッチを試みる
    if (!coords) {
      let matchedCityKey = null;
      const combinedText = ((spot.area || '') + ' ' + (locationMeta.area || '') + ' ' + (locationMeta.city || '') + ' ' + (spot.name || '') + ' ' + (spot.memo || '') + ' ' + (spot.reason || '')).toLowerCase();
      for (const key of Object.keys(CITY_CENTERS)) {
        if (combinedText.includes(key.toLowerCase())) {
          matchedCityKey = key;
          break;
        }
      }

      if (matchedCityKey) {
        const center = CITY_CENTERS[matchedCityKey];
        // 近隣レベルでの小さな揺らぎ(±0.005度)を追加
        const jitterLat = (Math.random() - 0.5) * 0.01;
        const jitterLng = (Math.random() - 0.5) * 0.01;
        coords = {
          lat: center.lat + jitterLat,
          lng: center.lng + jitterLng
        };
      }
    }

    // 3. 都道府県の代表点がある場合
    if (!coords && normPref && PREFECTURE_CENTERS[normPref]) {
      const center = PREFECTURE_CENTERS[normPref];
      const jitterLat = (Math.random() - 0.5) * 0.04;
      const jitterLng = (Math.random() - 0.5) * 0.04;
      coords = {
        lat: center.lat + jitterLat,
        lng: center.lng + jitterLng
      };
    }

    // 4. 完全なフォールバック
    if (!coords) {
      const center = PREFECTURE_CENTERS['東京'];
      const jitterLat = (Math.random() - 0.5) * 0.08;
      const jitterLng = (Math.random() - 0.5) * 0.08;
      coords = {
        lat: center.lat + jitterLat,
        lng: center.lng + jitterLng
      };
    }

    if (coords) {
      const iconHtml = `
        <div class="custom-marker" style="--border-color: ${getMarkerBorderColor(spot.cat)};" title="${spot.name}">
          <span>${spot.emoji || '📍'}</span>
        </div>
      `;

      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: markerIcon });

      const catLabel = spot.catLabel || getCatLabel(spot.cat) || '';
      const areaText = `📍 ${spot.area || ''}${spot.pref && spot.pref !== '東京' ? '（' + spot.pref + '）' : ''}`;
      const memoText = spot.memo || spot.reason || '';
      const uniqueId = spot.id || spot.clientId || 'temp-' + Math.random().toString(36).substr(2, 9);

      const popupHtml = `
        <div class="map-popup-card">
          <span class="map-popup-cat" style="background: ${getMarkerBorderColor(spot.cat)}1A; color: ${getMarkerBorderColor(spot.cat)};">${catLabel}</span>
          <div class="map-popup-title">${spot.name}</div>
          <div class="map-popup-area">${areaText}</div>
          ${memoText ? `<div class="map-popup-memo">${memoText.replace(/\n/g, '<br>')}</div>` : ''}
          <div class="map-popup-actions">
            <button type="button" class="map-popup-btn map-popup-btn--primary" id="popup-btn-details-${uniqueId}">📍 詳細をみる</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // ポップアップが開いたときに詳細をみるボタンにイベントを結びつける
      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-details-${uniqueId}`);
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            jumpToSpotCard(spot);
          });
        }
      });

      leafletMarkersGroup.addLayer(marker);
    }
  });

  // 初期表示範囲を調整
  if (leafletMarkersGroup.getLayers().length > 0) {
    leafletMapInstance.fitBounds(leafletMarkersGroup.getBounds(), { padding: [50, 50], maxZoom: 14 });
  } else {
    leafletMapInstance.setView([35.6895, 139.6917], 11);
  }
}

// マップから一覧のカードへ滑らかにスクロール＆ハイライト移動する
function jumpToSpotCard(spot) {
  closeMapModal();

  // フィルタの完全初期化 (すべて表示状態へ)
  activeSpotArea = 'all';
  showingWantList = false;
  setActiveSpotCategory('all');

  const allSpots = getAllSpotItemsForDisplay();
  const spotIndex = allSpots.findIndex(s => {
    return (s.id && spot.id && s.id === spot.id) || (s.name && spot.name && s.name === spot.name);
  });

  // ページネーション枠を展開
  if (spotIndex >= 0) {
    visibleSpotCount = Math.max(INITIAL_SPOT_COUNT, Math.ceil((spotIndex + 1) / INITIAL_SPOT_COUNT) * INITIAL_SPOT_COUNT);
  } else {
    visibleSpotCount = Math.max(INITIAL_SPOT_COUNT, allSpots.length);
  }

  // 一覧の再描画
  renderSpotCards('all');

  // スムーススクロール＆ハイライト
  setTimeout(() => {
    const cards = Array.from(document.querySelectorAll('.spot-card'));
    const target = cards.find(card => {
      const name = card.querySelector('.spot-name')?.textContent || '';
      return card.dataset.id === spot.id || name === spot.name;
    });

    if (target) {
      highlightDiscoveryElement(target);
    } else {
      const spotsEl = document.getElementById('spots');
      if (spotsEl) spotsEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, 120);
}

function renderMapOnlinePanel() {
  const listContainer = document.getElementById('mapOnlineList');
  if (!listContainer) return;

  listContainer.innerHTML = '';
  const isEn = currentLanguage === 'en';

  const panelTitle = document.querySelector('.map-online-title');
  const panelIcon = document.querySelector('.map-online-icon');
  if (panelTitle) {
    if (activeMapPanelTab === 'online') {
      panelTitle.textContent = isEn ? 'Online Recoms' : 'オンラインおすすめ';
      if (panelIcon) panelIcon.textContent = '🌐';
    } else {
      panelTitle.textContent = isEn ? 'Nationwide Spots' : '全国で楽しめるスポット';
      if (panelIcon) panelIcon.textContent = '🇯🇵';
    }
  }

  const allSpots = getAllSpotItemsForDisplay();
  const targetPref = activeMapPanelTab === 'online' ? 'オンライン' : '全国';
  const filteredSpots = allSpots.filter(spot => normalizePrefValue(spot.pref) === targetPref);

  if (filteredSpots.length === 0) {
    const emptyText = isEn 
      ? (activeMapPanelTab === 'online' ? 'No online spots' : 'No nationwide spots')
      : (activeMapPanelTab === 'online' ? 'オンラインスポットはありません' : '全国スポットはありません');
    listContainer.innerHTML = `<div class="map-online-empty">${emptyText}</div>`;
    return;
  }

  filteredSpots.forEach(spot => {
    const spotTrans = SPOT_TRANSLATIONS[spot.id] || {};
    const name = isEn && spotTrans.name ? spotTrans.name : spot.name;
    const memo = isEn && spotTrans.memo ? spotTrans.memo : (spot.memo || spot.reason || '');
    const area = isEn ? (ADDRESS_TRANSLATION_MAP[spot.area] || spot.area) : spot.area;
    const catLabel = spot.catLabel || getCatLabel(spot.cat) || '';

    const card = document.createElement('button');
    card.type = 'button';
    card.className = `map-online-card category-${spot.cat}`;
    card.innerHTML = `
      <div class="map-online-card-emoji">${spot.emoji || (activeMapPanelTab === 'online' ? '🌐' : '🇯🇵')}</div>
      <div class="map-online-card-content">
        <div class="map-online-card-meta">
          <span class="map-online-card-cat" style="color: ${getMarkerBorderColor(spot.cat)}">${catLabel}</span>
          <span class="map-online-card-area">📍 ${area}</span>
        </div>
        <div class="map-online-card-name">${name}</div>
        ${memo ? `<div class="map-online-card-memo">${memo}</div>` : ''}
      </div>
    `;

    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      jumpToSpotCard(spot);
    });

    listContainer.appendChild(card);
  });
}



// ============================================================
// 11. 初期化
// ============================================================
function init() {
  initFirebase();
  
  document.querySelectorAll('.map-panel-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.map-panel-tab').forEach(btn => btn.classList.remove('active'));
      tabBtn.classList.add('active');
      activeMapPanelTab = tabBtn.dataset.tab;
      renderMapOnlinePanel();
    });
  });
  
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
  listenPromptSuggestions(); // みんなのお題（投票）をリアルタイム同期

  trackPageView();
  renderDailyPrompt();
  scheduleDailyPromptRefresh();
  renderWeeklyDiscovery();
  startDiscoveryRotation();
  renderWeather();
  setupHeroGallery();
  renderHeroBackdrop();
  startHeroBackdropRotation();

  bindEvents();
  initWeatherCityPicker();
  maybeShowIntroStory();

  // 初期言語適用は i18n.js で処理されるため削除
  window.addEventListener('languageChanged', () => {
    renderDailyPrompt();
    renderWeeklyDiscovery();
    adjustHeroPadding();
  });

  window.addEventListener('focus', refreshDailyPromptIfDayChanged);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshDailyPromptIfDayChanged();
  });

  // 初期ロードとウィンドウリサイズ時にヒーローのpaddingを動的に調整
  adjustHeroPadding();
  window.addEventListener('resize', adjustHeroPadding);
  window.addEventListener('load', adjustHeroPadding);
}

function getWeatherIdByPref(pref) {
  if (!pref) return null;
  const cleanPref = pref.replace(/(都|道|府|県)$/, '').trim();
  const prefMap = {
    '北海道': '016000', '青森': '020000', '岩手': '030000', '宮城': '040000', '秋田': '050000',
    '山形': '060000', '福島': '070000', '茨城': '080000', '栃木': '090000', '群馬': '100000',
    '埼玉': '110000', '千葉': '120000', '東京': '130000', '神奈川': '140000', '新潟': '150000',
    '富山': '160000', '石川': '170000', '福井': '180000', '山梨': '190000', '長野': '200000',
    '岐阜': '210000', '静岡': '220000', '愛知': '230000', '三重': '240000', '滋賀': '250000',
    '京都': '260000', '大阪': '270000', '兵庫': '280000', '奈良': '290000', '和歌山': '300000',
    '鳥取': '310000', '島根': '320000', '岡山': '330000', '広島': '340000', '山口': '350000',
    '徳島': '360000', '香川': '370000', '愛媛': '380000', '高知': '390000', '福岡': '400000',
    '佐賀': '410000', '長崎': '420000', '熊本': '430000', '大分': '440000', '宮崎': '450000',
    '鹿児島': '460100', '沖縄': '471000'
  };
  return prefMap[cleanPref] || null;
}

function getWeatherName(code, isEn) {
  const c = parseInt(code, 10);
  if (isNaN(c)) return isEn ? 'Cloudy' : '曇り';
  if (c >= 100 && c < 200) return isEn ? 'Sunny' : '晴れ';
  if (c >= 200 && c < 300) return isEn ? 'Cloudy' : '曇り';
  if (c >= 300 && c < 400) return isEn ? 'Rainy' : '雨';
  if (c >= 400) return isEn ? 'Snowy' : '雪';
  return isEn ? 'Cloudy' : '曇り';
}

const _spotWeatherInMemoryCache = {};

async function fetchAndRenderSpotWeather() {
  const badges = document.querySelectorAll('.spot-card-weather');
  if (badges.length === 0) return;

  const weatherIds = Array.from(new Set(
    Array.from(badges)
      .map(el => el.dataset.weatherId)
      .filter(Boolean)
  ));

  const isEn = typeof currentLanguage !== 'undefined' ? currentLanguage === 'en' : false;

  // 現在時刻による「今日」または「明日」の判定（昼は今日、夜18時〜早朝5時前は明日）
  const currentHour = new Date().getHours();
  const isTomorrow = (currentHour >= 18 || currentHour < 5);

  const getLocalDateString = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${date}`;
  };

  const todayStr = getLocalDateString(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrow);
  const targetDateStr = isTomorrow ? tomorrowStr : todayStr;

  const promises = weatherIds.map(async (id) => {
    // 日付固有のキャッシュキーで別日程のデータ混在を完全に防止
    const cacheKey = `popopo_spot_weather_${id}_${targetDateStr}`;
    try {
      let cached = null;
      try {
        cached = sessionStorage.getItem(cacheKey);
      } catch (e) {
        cached = _spotWeatherInMemoryCache[cacheKey];
      }

      if (cached && cached !== 'null' && cached !== 'undefined' && cached !== 'error') {
        return { id, code: cached };
      }
      
      if (cached === 'error') {
        return { id, code: null };
      }

      const res = await fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${id}.json`);
      if (!res.ok) throw new Error(`JMA API status ${res.status}`);
      const data = await res.json();
      
      const timeSeries = data?.[0]?.timeSeries?.[0];
      const timeDefines = timeSeries?.timeDefines;
      const wCodes = timeSeries?.areas?.[0]?.weatherCodes;
      if (!wCodes || wCodes.length === 0 || !timeDefines || timeDefines.length === 0) {
        throw new Error('Invalid JSON structure or empty weather data');
      }
      
      // timeDefines の中から対象日付に前方一致するインデックスを検索
      let targetIndex = -1;
      for (let i = 0; i < timeDefines.length; i += 1) {
        if (timeDefines[i] && timeDefines[i].startsWith(targetDateStr)) {
          targetIndex = i;
          break;
        }
      }

      // 対象日付が見つからなかった場合のフォールバック（決め打ちに流れない安全弁）
      if (targetIndex === -1 || targetIndex >= wCodes.length) {
        targetIndex = isTomorrow ? Math.min(1, wCodes.length - 1) : 0;
      }

      const code = wCodes[targetIndex];
      if (code) {
        try {
          sessionStorage.setItem(cacheKey, code);
        } catch (e) {
          _spotWeatherInMemoryCache[cacheKey] = code;
        }
        return { id, code };
      }
    } catch (e) {
      console.warn(`[Spot Weather] Failed to fetch weather for area ${id}:`, e);
      try {
        sessionStorage.setItem(cacheKey, 'error');
      } catch (err) {
        _spotWeatherInMemoryCache[cacheKey] = 'error';
      }
    }
    return { id, code: null };
  });

  const results = await Promise.all(promises);
  const weatherMap = {};
  results.forEach(r => {
    if (r.code && r.code !== 'error') {
      weatherMap[r.id] = r.code;
    }
  });

  badges.forEach(badge => {
    try {
      const id = badge.dataset.weatherId;
      const code = weatherMap[id];
      if (code && code !== 'error') {
        const icon = (typeof getWeatherIcon !== 'undefined') ? getWeatherIcon(code) : '☁️';
        const name = getWeatherName(code, isEn);
        const dayLabel = isTomorrow 
          ? (isEn ? 'Tomorrow' : '明日') 
          : (isEn ? 'Today' : '今日');
        badge.innerHTML = `${dayLabel}: ${icon} ${name}`;
        badge.style.display = '';
      } else {
        badge.style.display = 'none';
      }
    } catch (e) {
      console.error('[Spot Weather] Render error for badge:', e);
      badge.style.display = 'none';
    }
  });
}

// ヒーローの上部余白をナビゲーションバーの実際の高さに合わせて動的に調整する
function adjustHeroPadding() {
  const navInner = document.querySelector('.nav-inner');
  const navDiscovery = document.getElementById('weeklyDiscoveryCard');
  const hero = document.getElementById('hero');
  if (hero) {
    let totalHeight = 0;
    if (navInner) totalHeight += navInner.offsetHeight;
    if (navDiscovery && window.getComputedStyle(navDiscovery).display !== 'none') {
      totalHeight += navDiscovery.offsetHeight;
    }
    const finalPadding = Math.max(80, totalHeight + 16);
    hero.style.paddingTop = `${finalPadding}px`;
  }
}

document.addEventListener('DOMContentLoaded', init);
