# POPOPO お出かけマップ — Firebase セットアップガイド

## 現在の状態（デモモード）
Firebaseを設定するまでは、投稿がご自身のブラウザにのみ保存されます。  
以下の手順で設定すると、**全リスナーの投稿がリアルタイムで共有**されます。

---

## Firebase 設定手順（約10分）

### Step 1: Firebase プロジェクト作成
1. [Firebase Console](https://console.firebase.google.com/) を開く
2. **「プロジェクトを作成」** をクリック
3. プロジェクト名を入力（例：`popopo-outing-map`）
4. Google Analytics はオフで OK → **「プロジェクトを作成」**

### Step 2: Firestore Database を有効化
1. 左メニュー **「Firestore Database」** → **「データベースの作成」**
2. **「本番環境モードで開始」** を選択
3. ロケーション：`asia-northeast1`（東京）を選択 → **「有効にする」**

### Step 3: セキュリティルールを設定
Firestore → **「ルール」** タブ → 以下を貼り付けて **「公開」**：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{doc} {
      allow read: if true;
      allow create: if request.resource.data.comment.size() <= 200
                    && request.resource.data.comment.size() >= 1;
    }
    match /suggestions/{document=**} {
      allow read, create: if true;
    }
    match /chats/{document=**} {
      allow read, create: if true;
    }
    match /likes/{doc} {
      allow read, write: if true;
    }
  }
}
```

### Step 4: Webアプリを登録して設定をコピー
1. プロジェクト設定（歯車アイコン）→ **「マイアプリ」** → **「</> Web」**
2. アプリのニックネーム入力（例：`popopo-web`）→ **「アプリを登録」**
3. 表示される `firebaseConfig` をコピー

### Step 5: app.js に設定を貼り付ける

`app.js` の先頭（1〜10行目）の `FIREBASE_CONFIG` を書き換えてください：

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",           // ← コピーした値
  authDomain: "popopo-xxx.firebaseapp.com",
  projectId: "popopo-xxx",
  storageBucket: "popopo-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123...:web:abc..."
};
```

---

## サイトの公開方法

### GitHub Pages（無料・推奨）
```bash
# GitHubにリポジトリを作成後：
cd popopo-site
git init
git add .
git commit -m "初回コミット"
git remote add origin https://github.com/あなたのユーザー名/popopo-site.git
git push -u origin main
# リポジトリ設定 > Pages > Branch: main を選択して保存
```
→ `https://あなたのユーザー名.github.io/popopo-site/` で公開されます

### Netlify（ドラッグ＆ドロップで公開）
1. [netlify.com](https://netlify.com) でアカウント作成
2. **「Add new site」** → **「Deploy manually」**
3. `popopo-site` フォルダをそのままドラッグ＆ドロップ
4. 即座にURLが発行される（無料）

---

## 管理者による投稿削除方法
Firebase Console → Firestore → `posts` コレクションから  
直接ドキュメントを選択して削除できます。

---

最終更新：2026年4月21日
