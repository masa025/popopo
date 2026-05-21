// ============================================================
// POPOPO お出かけマップ — i18n.js
// 言語切り替えロジックと翻訳辞書データ（全ページ共通）
// ============================================================
let currentLanguage = localStorage.getItem('popopo_language');
if (!currentLanguage) {
  const pathName = location.pathname.split('/').pop() || 'index.html';
  if (pathName === 'index-en.html') {
    currentLanguage = 'en';
  } else {
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('en') || !browserLang.startsWith('ja')) {
      currentLanguage = 'en';
    } else {
      currentLanguage = 'jp';
    }
  }
}

const HERO_IMAGE_BY_LANG = {
  jp: 'assets/popopo-map-visual-20260518.png',
  en: 'assets/popopo-map-visual-en.jpg'
};

const TRANSLATIONS = {
  jp: {
    logo_sub: "お出かけマップ",
    nav_spots: "📍 おすすめスポット",
    nav_visited: "💬 みんなの感想",
    nav_talk: "💬 フリートーク掲示板",
    nav_about: "🌿 この場所を作った理由",
    nav_howto: "💡 使い方",
    nav_howto_mobile: "💡 使い方を見る",
    hero_view_map: "地図を見る",
    hero_view_gallery: "🖼️ すべての作品・辞典を見る",
    hero_quick_spots: "📍 おすすめスポットを見る",
    hero_quick_visited: "💬 みんなの感想を見る",
    hero_gacha_full: "✨ ポポッと選ぶ",
    hero_gacha_compact: "✨ ポポッと",
    hero_game_full: "🎮 POPOOSHIで遊ぶ",
    hero_game_compact: "🎮 ゲーム",
    loading: "読み込み中",
    stats_spots: "スポット",
    stats_posts: "つぶやき",
    stats_visited: "感想",
    stats_views: "👀 訪問",
    sec_spots: "🗺️ おすすめスポット",
    sec_spots_sub: "『これ良かったよ』の気持ちをみんなでシェア。あなたの好きも、ぜひ教えてください。",
    btn_add_spot: "スポットを追加する",
    add_spot_hint: "「ここ気になる」「行ってみたい」そんな一言からで大丈夫！",
    get weather_hint() {
      const hours = new Date().getHours();
      return (hours >= 18 || hours < 5) ? "🌤️ あしたのお出かけヒント" : "🌤️ 今日のお出かけヒント";
    },
    get weather_city_hint() {
      const hours = new Date().getHours();
      return (hours >= 18 || hours < 5) ? "選んだ都市の天気が「あしたのお出かけヒント」に表示されます（次回も記憶します）" : "選んだ都市の天気が「今日のお出かけヒント」に表示されます（次回も記憶します）";
    },
    weather_loading: "天気を取得中...",
    tab_all: "すべて",
    tab_food: "🍴 飲食店",
    tab_mohinga: "🍜 食べたいもの",
    tab_museum: "🎨 美術館・博物館",
    tab_event: "🌿 イベント",
    tab_nature: "🌳 自然・よりみち",
    tab_book: "📚 本・しらべもの",
    tab_shop: "🛒 くらし・雑貨",
    tab_view: "✨ おきにいりの景色",
    tab_relax: "🛁 癒やし・ととのう",
    tab_entertainment: "🎬 エンタメ",
    btn_want_list: "🔖 行きたいリスト（0）",
    btn_add_want: "🌱 これから行きたい場所を追加",
    want_hint_text: "行ってみた場所があれば、感想を残してみませんか？",
    btn_post_review: "感想を投稿する",
    btn_more: "もっと見る",
    sec_visited: "💬 みんなの感想",
    sec_visited_sub: "実際に訪れたスポットの感想を集めています",
    sec_talk: "💬 フリートーク掲示板",
    sec_talk_sub: "お出かけの予定、POPOPOの感想、サイトへのご意見など自由に語り合いましょう！",
    btn_post_chat: "✏️ つぶやく",
    prompt_kicker: "今日のお題",
    prompt_default: "最近気になっている場所はありますか？",
    btn_prompt_post: "このお題でつぶやく",
    btn_prompt_gacha: "🎲 ガチャを回す",
    btn_prompt_view_all: "みんなの提案を見る",
    prompt_candidates_lead: "みんなが提案してくれたお題を順番に「今日のお題」として表示しています。<br>心が動いたお題や共感したものには、ぜひ ♡ を押して応援してみてください✨",
    btn_prompt_suggest: "お題を提案する",
    prompt_suggest_hint: "ふと思いついた問いかけで大丈夫。だれかの一日にそっと届きます。",
    prompt_empty: "まだ提案はありません。最初のひとつ目、書いてみませんか？",
    footer_desc: "POPOPOで紹介された場所を、みんなで楽しもう。",
    footer_spots_link: "スポット一覧",
    footer_admin: "お手入れ係",
    footer_contact: "🦋 masa0a へ連絡する / Bluesky",
    upload_disclaimer: "※画像は自動的に最適化（縮小・圧縮）して保存されます。",
    
    // about.html 用追加テキスト
    about_story: "STORY",
    about_h1: "人から人へ伝わる、<br>ちいさな発見を<br class=\"about-title-mobile-break\">集める場所。",
    about_lead: "POPOPO お出かけマップは、アルゴリズムから少し離れて、リスナーから生まれるおすすめや感想を残していくための場所です。<br>詳しいレビューだけでなく、「ここ気になる」「行ってみたい」そんな一言から。あなたの小さな発見を、誰かの休日のきっかけに。",
    about_video_label: "STORY FILM",
    about_video_title: "人から人へ — 30秒のストーリー",
    about_eyebrow: "A HUMAN ROUTE",
    about_eyebrow_desc: "検索でもAIでもなく、誰かの言葉から始まった場所。",
    about_ch1_title: "会話が連れていった場所",
    about_ch1_desc: "検索やAIでは見つからなかった場所に、POPOPOリスナーとの会話が連れていってくれました。",
    about_ch2_title: "情報以上の感動",
    about_ch2_desc: "人から人へ伝えられるおすすめには、情報だけでは生まれない感動があります。誰かが実際に見て、感じて、話してくれたからこそ、行ってみたくなる。そんな体験に、私は本当に心を動かされました。",
    about_ch3_title: "アルゴリズムから少し離れて",
    about_ch3_desc: "このサイトは、アルゴリズムから少し離れて、人と人のあいだで生まれる発見を集めるための場所です。POPOPOを聴いている人たちが、気軽におすすめや感想を持ち寄れる、コミュニティでありたいと思っています。",
    about_ch4_title: "もっと多くの人へ",
    about_ch4_desc: "もっと多くの人に、その感覚を味わってほしい。そんな思いで、このコミュニティサイトを作りました。",
    about_closing: "人から人へ。小さな発見が、次の休日を少し楽しくしてくれますように。",
    
    // how-to.html 用追加テキスト
    howto_kicker: "はじめての方向け",
    howto_title: "POPOPO お出かけマップの使い方",
    howto_lead: "POPOPO お出かけマップは、詳しいレビューを書くためだけの場所ではありません。<br>「ここ気になる」「行ってみたい」「ちょっと良かった」そんな一言から参加できます。<br>あなたの小さな発見が、誰かのお出かけのきっかけになります。",
    howto_btn_spots: "スポットを探す →",
    howto_btn_visited: "みんなの感想を見る",
    howto_step1_title: "今日の発見を見る",
    howto_step1_desc: "ページ上部には、おすすめスポットやみんなの感想がゆっくり入れ替わって表示されます。気になる名前を押すと、該当のスポットや感想を開けます。",
    howto_step2_title: "ポポッと選ぶ",
    howto_step2_desc: "トップの「ポポッと選ぶ」や、ナビのピックアップ行のスパークル（スマホではアイコンのみ）から、おすすめスポットとみんなの感想の中から案内を受け取れます。多めに並ぶこともありますが、基本はひとつずつ。気になるカードをタップすると、そのスポットや感想の詳細が開きます。迷ったときの、ささやかなきっかけとして使えます。",
    howto_step3_title: "リスナー作品を楽しむ",
    howto_step3_desc: "トップの小さな作品アイコンは、配信中に届いた作品です。右から左へ流れるアイコンを押すと大きく表示されます。「すべての作品・辞典を見る」から一覧でも楽しめます。",
    howto_step4_title: "スポットを探す",
    howto_step4_desc: "POPOPOで紹介された場所や、リスナーおすすめの場所をカテゴリ別に見られます。気になる場所は「行きたい」を押すと、同じ端末の「行きたいリスト」に集められます。",
    howto_step5_title: "感想を見る・投稿する",
    howto_step5_desc: "スポットカードの「みんなの感想」から、その場所の感想一覧を見られます。読んだ感想には「見たよ」でリアクションできます。行ってみた場所は「行ってみた！」から評価やコメントを投稿できます。",
    howto_step6_title: "スポットを追加する",
    howto_step6_desc: "おすすめしたい場所や気になっている場所があれば、「スポットを追加する」から提案できます。参考URL・写真・情報を3件まで種類つきで登録でき、画像URLならカードにプレビューも表示されます。入力中に他の画面へ移動しても、同じ端末のブラウザでは下書きが残るようになっています（送信完了までは送信されません）。",
    howto_step7_title: "フリートークで話す",
    howto_step7_desc: "POPOPOの感想、サイトへのご意見、今度行きたい場所、ちょっとしたお出かけメモなどを自由に投稿できます。返信のあったスレッドは、掲示板の上の方に近づきやすくなっています。必要な分だけ「もっと見る」で広げられます。",
    howto_note: "投稿内容は公開されます。個人情報の取り扱い等には十分に注意してください。スポット・感想・つぶやきは、同じ端末のブラウザでは投稿後に編集できます。スポット追加フォームは、未送信の内容を端末内に一時保存します（別のタブで開き直したときなどに復元できます）。写真は画像ファイルを直接アップロードする形式ではなく、SNSや共有リンクのURLを貼る形です。「行きたいリスト」はログイン不要で使えるよう、同じ端末のブラウザに保存されます。"
  },
  en: {
    logo_sub: "Outing Map",
    nav_spots: "📍 Recommended Spots",
    nav_visited: "💬 Guest Reviews",
    nav_talk: "💬 Free Talk Board",
    nav_about: "🌿 Why We Built This",
    nav_howto: "💡 Guide",
    nav_howto_mobile: "💡 Open Guide",
    hero_view_map: "View Map",
    hero_view_gallery: "🖼️ View Art & Dictionary",
    hero_quick_spots: "📍 Browse Spots",
    hero_quick_visited: "💬 Read Reviews",
    hero_gacha_full: "✨ Pop & Pick!",
    hero_gacha_compact: "✨ Pop Pick",
    hero_game_full: "🎮 Play POPOOSHI",
    hero_game_compact: "🎮 Game",
    loading: "Loading...",
    stats_spots: "Spots",
    stats_posts: "Chats",
    stats_visited: "Reviews",
    stats_views: "👀 Visits",
    sec_spots: "🗺️ Recommended Spots",
    sec_spots_sub: "Share your 'I loved this place' moments with everyone. Tell us your favorites!",
    btn_add_spot: "Add a Spot",
    add_spot_hint: "Just a small recommendation or 'I want to go here' is perfect!",
    get weather_hint() {
      const hours = new Date().getHours();
      return (hours >= 18 || hours < 5) ? "🌤️ Tomorrow's Outing Hint" : "🌤️ Today's Outing Hint";
    },
    get weather_city_hint() {
      const hours = new Date().getHours();
      return (hours >= 18 || hours < 5) ? "Weather of selected cities will show in \"Tomorrow's Outing Hint\" (remembered)" : "Weather of selected cities will show in \"Today's Outing Hint\" (remembered)";
    },
    weather_loading: "Fetching weather...",
    tab_all: "All",
    tab_food: "🍴 Food & Cafe",
    tab_mohinga: "🍜 Must-Try",
    tab_museum: "🎨 Art & Museum",
    tab_event: "🌿 Events",
    tab_nature: "🌳 Nature & Walk",
    tab_book: "📚 Book & Study",
    tab_shop: "🛒 Lifestyle & Goods",
    tab_view: "✨ Lovely Views",
    tab_relax: "🛁 Relax & Bath",
    tab_entertainment: "🎬 Fun & Media",
    btn_want_list: "🔖 Want to Go (0)",
    btn_add_want: "🌱 Add a Spot You Want to Visit",
    want_hint_text: "Visited some spots? Share your impressions!",
    btn_post_review: "Write a Review",
    btn_more: "See More",
    sec_visited: "💬 Guest Reviews",
    sec_visited_sub: "Real reviews and impressions from guests who visited the spots",
    sec_talk: "💬 Free Talk Board",
    sec_talk_sub: "Feel free to talk about your plans, thoughts on POPOPO, feedback, or anything!",
    btn_post_chat: "✏️ Post Chat",
    prompt_kicker: "Today's Topic",
    prompt_default: "Are there any places you are curious about lately?",
    btn_prompt_post: "Chat on This Topic",
    btn_prompt_gacha: "🎲 Roll Topic Gacha",
    btn_prompt_view_all: "View All Topics",
    prompt_candidates_lead: "We show topics suggested by everyone as 'Today\'s Topic' in turn.<br>Press ♡ to support topics that touch your heart or make you relate✨",
    btn_prompt_suggest: "Suggest a Topic",
    prompt_suggest_hint: "Any casual question is fine! It will reach someone's day gently.",
    prompt_empty: "No suggestions yet. Why not write the first one?",
    footer_desc: "Let's explore and enjoy spots introduced in POPOPO together.",
    footer_spots_link: "Spots Directory",
    footer_admin: "Curator",
    footer_contact: "🦋 Contact masa0a / Bluesky",
    upload_disclaimer: "*Images will be optimized (shrunk/compressed) and saved automatically.",
    
    // about.html 用追加テキスト
    about_story: "STORY",
    about_h1: "A place to gather<br>little discoveries,<br class=\"about-title-mobile-break\">passed from person to person.",
    about_lead: "POPOPO Outing Map is a place to step away from algorithms and preserve recommendations and impressions born from listeners.<br>Not just detailed reviews, but simple words like 'I'm curious about this' or 'I want to go'. May your small discovery be the start of someone else's holiday.",
    about_video_label: "STORY FILM",
    about_video_title: "From person to person — A 30s Story",
    about_eyebrow: "A HUMAN ROUTE",
    about_eyebrow_desc: "A place started by someone's words, not search or AI.",
    about_ch1_title: "Places led by conversations",
    about_ch1_desc: "Conversations with POPOPO listeners have taken me to places I never would have found through search or AI.",
    about_ch2_title: "Emotion beyond information",
    about_ch2_desc: "Recommendations shared from person to person can move us in ways information alone cannot. They carry someone’s experience, curiosity, and feeling. That moved me more than I expected.",
    about_ch3_title: "Stepping away from algorithms",
    about_ch3_desc: "This site was created as a place to step away from algorithms for a while, and to gather the discoveries that happen between people. I hope it becomes a genuine human-to-human community where POPOPO listeners can share places, memories, and impressions freely.",
    about_ch4_title: "To more people",
    about_ch4_desc: "I want more people to experience that feeling. That is why I created this community site.",
    about_closing: "From person to person. May small discoveries make your next holiday a little brighter.",
    
    // how-to.html 用追加テキスト
    howto_kicker: "FOR BEGINNERS",
    howto_title: "How to use POPOPO Outing Map",
    howto_lead: "POPOPO Outing Map is not just a place for writing detailed reviews.<br>You can participate with a simple 'I'm curious about this', 'I want to go', or 'It was nice'.<br>Your small discovery can be the start of someone else's outing.",
    howto_btn_spots: "Find Spots →",
    howto_btn_visited: "Read Guest Reviews",
    howto_step1_title: "See Today's Discoveries",
    howto_step1_desc: "Recommended spots and reviews slowly cycle at the top of the page. Tap a name to open that spot or review.",
    howto_step2_title: "Pop & Pick",
    howto_step2_desc: "Tap 'Pop & Pick' to get a random suggestion from recommended spots and reviews. Tap the card to open details. Great for when you can't decide where to go.",
    howto_step3_title: "Enjoy Listener Art",
    howto_step3_desc: "The small art icons at the top are works received during the stream. Tap the flowing icons to enlarge them. You can also view them all from the gallery.",
    howto_step4_title: "Find Spots",
    howto_step4_desc: "Browse spots introduced on POPOPO or recommended by listeners by category. Tap 'Want to Go' to save them to your device's list.",
    howto_step5_title: "Read & Post Reviews",
    howto_step5_desc: "Check out the guest reviews for each spot. Leave a 'Seen' reaction if you read one. If you've visited, post your own rating and comment!",
    howto_step6_title: "Add a Spot",
    howto_step6_desc: "Suggest a spot you want to recommend or are curious about. You can add up to 3 links, photos, or info. Drafts are temporarily saved in your browser.",
    howto_step7_title: "Talk in Free Talk",
    howto_step7_desc: "Freely post your thoughts on POPOPO, site feedback, or outing plans. Threads with replies stay near the top. Tap 'See More' to expand.",
    howto_note: "Posts are public. Please be careful with personal information. Spots, reviews, and chats can be edited from the same browser. Spot drafts are saved locally in the browser. Photos are added via SNS or shared links, not direct file uploads. The 'Want to Go' list is saved locally without requiring a login."
  }
};

const STATIC_TEXT_TRANSLATIONS = [
  ['キャンセル', 'Cancel'],
  ['保存する ✓', 'Save ✓'],
  ['🌤️ 表示する都市を選択', '🌤️ Select Cities to Display'],
  ['選んだ都市の天気が「今日のお出かけヒント」に表示されます（次回も記憶します）', 'Weather of selected cities will show in "Today\'s Outing Hint" (remembered)'],
  ['閉じる', 'Close'],
  ['投稿する 🚀', 'Post 🚀'],
  ['更新する 🚀', 'Update 🚀'],
  ['スポットを追加 🗺️', 'Add Spot 🗺️'],
  ['提案を送る 🚀', 'Send Suggestion 🚀'],
  ['行きたい場所を追加 🌱', 'Add Want-to-Go Spot 🌱'],
  ['📝 感想を投稿する', '📝 Write a Review'],
  ['ニックネーム（任意）', 'Nickname (optional)'],
  ['匿名リスナー', 'Anonymous Listener'],
  ['感想を書きたいスポット 必須', 'Spot to review Required'],
  ['感想を書きたいスポット', 'Spot to review'],
  ['リストにない場合は自由入力', 'Type manually if it is not listed'],
  ['行った日', 'Visit Date'],
  ['評価', 'Rating'],
  ['コメント 必須', 'Comment Required'],
  ['コメント', 'Comment'],
  ['写真アップロード（任意）', 'Photo Upload (optional)'],
  ['写真・投稿URL（任意・最大3件）', 'Photo / Post URLs (optional, up to 3)'],
  ['✨ スポットを追加する', '✨ Add a Spot'],
  ['追加する内容', 'What would you like to add?'],
  ['おすすめしたい', 'Recommend'],
  ['これから行きたい', 'Want to Visit'],
  ['スポット名 必須', 'Spot Name Required'],
  ['スポット名', 'Spot Name'],
  ['エリア・場所 必須', 'Area / Location Required'],
  ['エリア・場所', 'Area / Location'],
  ['カテゴリ', 'Category'],
  ['おすすめポイント 必須', 'Recommendation Point Required'],
  ['おすすめポイント', 'Recommendation Point'],
  ['参考URL（任意・最大3件）', 'Reference URLs (optional, up to 3)'],
  ['✏️ つぶやきを投稿', '✏️ Post a Chat'],
  ['メッセージ 必須', 'Message Required'],
  ['メッセージ', 'Message'],
  ['✨ ポポッと選ぶ', '✨ Pop & Pick'],
  ['えらんでみる', 'Pick for me'],
  ['すこしだけ待ってください…', 'Please wait a moment...'],
  ['もう一度、ポポッと', 'Pop & Pick Again'],
  ['🖼️ ギャラリー＆用語辞典', '🖼️ Gallery & Dictionary'],
  ['答えを入力', 'Enter the answer'],
  ['スキップ', 'Skip'],
  ['次へ', 'Next'],
  ['サイトへ', 'Enter Site'],
  ['全文を読む', 'Read the Full Story'],
  ['サイトを見る', 'Enter Site'],
  ['💡 サイトの使い方', '💡 How to Use This Site'],
  ['✨ お題を提案する', '✨ Suggest a Topic'],
  ['お題の問いかけ 必須', 'Topic Question Required'],
  ['お題の問いかけ', 'Topic Question'],
  ['お題を送る 🌿', 'Send Topic 🌿'],
  ['🗺️POPOPOお出かけマップ', '🗺️ POPOPO Outing Map'],
  ['スポット', 'Spots'],
  ['感想', 'Reviews'],
  ['つぶやく', 'Chat'],
  ['掲示板', 'Board'],
  ['画像を選択', 'Choose Image'],
  ['アップロード済み', 'Uploaded'],
  ['追加する内容', 'Type'],
  ['都道府県を選択', 'Select prefecture / region'],
  ['市区町村を選択', 'Select city / ward'],
  ['候補にない市区町村を入力', 'Enter a city not listed'],
  ['必須', 'Required'],
  ['このスポットの感想を投稿', 'Write a Review for This Spot'],
  ['💬 みんなの感想', '💬 Guest Reviews'],
  ['掲示板に報告する 💬', 'Post to the Board 💬'],
  ['おめでとうございます！', 'Congratulations!'],
  ['ギャラリーを閉じる', 'Close Gallery'],
  ['前の作品へ', 'Previous Art'],
  ['次の作品へ', 'Next Art'],
  ['拡大を戻す', 'Reset Zoom'],
  ['画像を拡大する', 'Zoom Image']
];

const STATIC_ATTR_TRANSLATIONS = [
  ['フリートーク掲示板へ', 'Open the Free Talk Board'],
  ['表示する都市を設定', 'Set weather city'],
  ['閉じる', 'Close'],
  ['前の作品へ', 'Previous art'],
  ['次の作品へ', 'Next art'],
  ['拡大を戻す', 'Reset zoom'],
  ['画像を拡大する', 'Zoom image'],
  ['ギャラリーを閉じる', 'Close gallery'],
  ['画像を削除', 'Remove image'],
  ['フリートークでつぶやく', 'Post to Free Talk'],
  ['人参鹿さんの使い方ヒントを見る', 'Open Carrot Deer tips'],
  ['ランダムで別のお題をめくります', 'Roll a random topic'],
  ['おすすめや感想から、ポポッと選びます', 'Pop & Pick from spots and reviews'],
  ['POPOOSHIで遊ぶ', 'Play POPOOSHI']
];

const PLACEHOLDER_TRANSLATIONS = [
  ['匿名リスナー', 'Anonymous Listener'],
  ['スポット名を入力', 'Enter a spot name'],
  ['感想を教えてください！（200文字以内）', 'Share your impressions! (up to 200 characters)'],
  ['InstagramやXの投稿URLなど', 'Instagram, X, or other post URL'],
  ['写真や投稿のURL', 'Photo or post URL'],
  ['補足情報のURL', 'Additional info URL'],
  ['例：○○カフェ、△△公園', 'Example: a cafe, park, shop, or museum'],
  ['市区町村を入力', 'Enter city / ward / town'],
  ['駅名・街名・建物名など（任意） 例：道玄坂、東京駅、大丸東京店', 'Station, neighborhood, or building (optional)'],
  ['どんな場所か教えて下さい！（150文字以内）', 'Tell us what kind of place it is! (up to 150 characters)'],
  ['公式サイト・食べログなど', 'Official site, review site, etc.'],
  ['画像のURLや記事URL', 'Image URL or article URL'],
  ['POPOPOの感想、サイトへのご意見、お出かけについて自由につぶやいてください！（200文字以内）', 'Share POPOPO thoughts, site feedback, or outing notes! (up to 200 characters)'],
  ['例：誰かにそっと教えたくなった景色はありますか？（60文字以内）', 'Example: What scenery made you want to quietly tell someone? (up to 60 characters)'],
  ['答えを入力', 'Enter the answer']
];

function translatePairValue(value, pairs, lang) {
  const text = String(value || '').trim();
  if (!text) return null;
  const pair = pairs.find(([jp, en]) => text === jp || text === en);
  if (!pair) return null;
  return lang === 'en' ? pair[1] : pair[0];
}

function applyStaticTextTranslations(lang) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const translated = translatePairValue(node.nodeValue, STATIC_TEXT_TRANSLATIONS, lang);
    if (translated) node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), translated);
  });

  document.querySelectorAll('[placeholder]').forEach(el => {
    const translated = translatePairValue(el.getAttribute('placeholder'), PLACEHOLDER_TRANSLATIONS, lang);
    if (translated) el.setAttribute('placeholder', translated);
  });

  document.querySelectorAll('[aria-label], [title]').forEach(el => {
    ['aria-label', 'title'].forEach(attr => {
      if (!el.hasAttribute(attr)) return;
      const translated = translatePairValue(el.getAttribute(attr), STATIC_ATTR_TRANSLATIONS, lang);
      if (translated) el.setAttribute(attr, translated);
    });
  });
}

function applyDocumentMetaTranslations(lang) {
  const path = location.pathname.split('/').pop() || 'index.html';
  const isEn = lang === 'en';
  const metaByPage = {
    'index.html': {
      title: isEn ? 'POPOPO Outing Map | A Human Route' : 'POPOPO お出かけマップ | みんなで作るお出かけマップ',
      description: isEn
        ? 'POPOPO Outing Map is a listener community where people share recommended spots, reviews, and free talk beyond search and algorithms.'
        : 'POPOPO お出かけマップで、リスナーおすすめスポット、みんなの感想、フリートークを共有。検索やAIではなく、誰かの言葉から次のお出かけを見つけるコミュニティです。'
    },
    'about.html': {
      title: isEn ? 'Story | POPOPO Outing Map' : 'この場所を作った理由 | POPOPO お出かけマップ',
      description: isEn
        ? 'The story behind POPOPO Outing Map: a place for discoveries passed from person to person, beyond search and AI.'
        : 'POPOPO お出かけマップを作った理由。検索やAIだけでは出会えない、人から人へ伝わるおすすめや感想を集めるリスナーコミュニティについて紹介します。'
    },
    'how-to.html': {
      title: isEn ? 'Guide | POPOPO Outing Map' : '使い方 | POPOPO お出かけマップ',
      description: isEn
        ? 'How to use POPOPO Outing Map: browse spots, read reviews, save places, enjoy listener art, and post free talk.'
        : 'POPOPO お出かけマップの使い方。今日の発見、リスナー作品、行きたいリスト、おすすめスポット、みんなの感想、フリートーク、スポット追加の流れを紹介します。'
    }
  };
  const meta = metaByPage[path] || metaByPage['index.html'];
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', isEn ? 'en_US' : 'ja_JP');
}

function escHtml(str) {
  if (!str) return '';
  return str.replace(/[&'`"<>]/g, function(match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match];
  });
}

function applyLanguage(lang) {
  const path = location.pathname.split('/').pop() || 'index.html';
  if (lang === 'jp' && path === 'index-en.html') {
    localStorage.setItem('popopo_language', 'jp');
    location.href = 'index.html';
    return;
  }
  if (lang === 'en' && path === 'index.html') {
    localStorage.setItem('popopo_language', 'en');
    location.href = 'index-en.html';
    return;
  }

  currentLanguage = lang;
  localStorage.setItem('popopo_language', lang);
  document.documentElement.lang = lang === 'en' ? 'en' : 'ja';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      if (TRANSLATIONS[lang][key].includes('<') && TRANSLATIONS[lang][key].includes('>')) {
        el.innerHTML = TRANSLATIONS[lang][key];
      } else {
        el.textContent = TRANSLATIONS[lang][key];
      }
    }
  });

  const toggleBtnLabel = document.querySelector('#langToggleBtn .lang-label');
  if (toggleBtnLabel) {
    toggleBtnLabel.textContent = lang === 'en' ? 'EN' : 'JP';
  }
  const toggleBtnMobileLabel = document.querySelector('#langToggleBtnMobile .lang-label-mobile');
  if (toggleBtnMobileLabel) {
    toggleBtnMobileLabel.textContent = lang === 'en' ? 'EN' : 'JP';
  }

  const heroImage = document.getElementById('heroImage');
  if (heroImage) {
    heroImage.src = HERO_IMAGE_BY_LANG[lang] || HERO_IMAGE_BY_LANG.jp;
    heroImage.alt = lang === 'en'
      ? 'Watercolor illustration of the POPOPO Outing Map, where small discoveries are shared from person to person'
      : '人から人へ伝わる小さな発見を描いたPOPOPO お出かけマップの水彩イラスト';
  }

  applyStaticTextTranslations(lang);
  applyDocumentMetaTranslations(lang);

  // 自動翻訳用のイベント発火 (app.js で受け取って投稿を自動翻訳する)
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function setupI18n() {
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLanguage === 'en' ? 'jp' : 'en';
      applyLanguage(newLang);
    });
  }

  const langToggleBtnMobile = document.getElementById('langToggleBtnMobile');
  if (langToggleBtnMobile) {
    langToggleBtnMobile.addEventListener('click', () => {
      const newLang = currentLanguage === 'en' ? 'jp' : 'en';
      applyLanguage(newLang);
    });
  }

  // Redirect on initial load if language preference conflicts with page
  const path = location.pathname.split('/').pop() || 'index.html';
  if (currentLanguage === 'en' && path === 'index.html') {
    location.replace('index-en.html');
    return;
  }
  if (currentLanguage === 'jp' && path === 'index-en.html') {
    location.replace('index.html');
    return;
  }

  // 初期ロード時の言語適用
  applyLanguage(currentLanguage);
}

document.addEventListener('DOMContentLoaded', setupI18n);
