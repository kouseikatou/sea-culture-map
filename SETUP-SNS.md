# SNS機能（Google Maps ＋ Tips共有）の有効化手順

このサイトは **鍵を設定しなくても動きます**（地図＝無料のLeaflet、Tips＝端末ローカル保存）。
下記を設定すると **地図がGoogle Maps** に、**Tipsが全員で共有** に切り替わります。
すべて無料枠＋上限設定で、**月¥100を超えない** ようにします。

---

## A. Google Maps を有効化（¥100を超えない設定つき）

### 1. API を有効化 & キー作成（GCP Console）
1. [console.cloud.google.com](https://console.cloud.google.com) → 対象プロジェクトを選択
2. 「APIとサービス」→「ライブラリ」→ **Maps JavaScript API** を有効化
3. 「APIとサービス」→「認証情報」→「認証情報を作成」→ **APIキー**

### 2. キーを制限（超重要・これで盗用されても課金されない）
作ったキーの編集画面で:
- **アプリケーションの制限** → 「HTTPリファラー」→ 次を追加
  - `https://kouseikatou.github.io/*`
- **APIの制限** → 「キーを制限」→ **Maps JavaScript API** だけを選択

### 3. Map ID を作成（AdvancedMarkerに必要）
- 「Google Maps Platform」→「マップ管理(Map Management)」→ **Map IDを作成**
- タイプ = JavaScript（Vector 推奨）→ 作成 → **Map ID をコピー**

### 4. ¥100を超えない上限（必須）
- 「APIとサービス」→ Maps JavaScript API →「割り当て(Quotas)」
  - **Map loads per day を 300 程度に設定**（月約9,000回。無料枠内なので実質¥0、超えても頭打ち）
- 「お支払い」→「予算とアラート」→ **予算¥100** を作成し、50%/100%でメール通知

> 目安: 地図表示は無料枠が月1万回ほど。個人サイト規模なら¥0の見込み。上限で万一のバズも遮断。

---

## B. Firebase / Firestore を有効化（Tips共有）

1. [console.firebase.google.com](https://console.firebase.google.com) → 上のGCPと同じプロジェクトを追加/選択
2. **Firestore Database** → データベースを作成 → 本番モード → リージョンは `asia-northeast1`（東京）
3. **Authentication** → ログイン方法 → **Google** を有効化
4. Authentication →「設定」→「承認済みドメイン」に `kouseikatou.github.io` を追加
5. プロジェクト設定 → 全般 → マイアプリ →「ウェブアプリを追加」→ 登録 → **firebaseConfig をコピー**
6. Firestore →「ルール」に下記を貼って公開:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tips/{tip} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.authorId == request.auth.uid
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 400;
      allow update: if false;
      allow delete: if request.auth != null
        && resource.data.authorId == request.auth.uid;
    }
  }
}
```

> Firestoreの無料枠（Sparkプラン）内なら¥0。読み書きが無料枠を超えそうなら通知が来ます。

---

## C. GitHub に鍵を登録して反映

リポジトリ → **Settings → Secrets and variables → Actions → New repository secret** で以下を登録:

| Secret 名 | 値 |
|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | Aで作ったAPIキー |
| `VITE_GOOGLE_MAPS_MAP_ID` | Aで作ったMap ID |
| `VITE_FIREBASE_API_KEY` | firebaseConfig.apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | firebaseConfig.authDomain |
| `VITE_FIREBASE_PROJECT_ID` | firebaseConfig.projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | firebaseConfig.storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | firebaseConfig.messagingSenderId |
| `VITE_FIREBASE_APP_ID` | firebaseConfig.appId |

登録後、`main` に何かpush するか **Actions → Deploy → Run workflow** で再ビルド → 反映。

> 注: これらの鍵はビルドでクライアントに埋め込まれます（Firebase/Mapsのウェブ鍵は元々公開前提）。守りは
> **ドメイン制限・Firestoreルール・日次上限** です。鍵は `.env`（gitignore済）やGitHub Secretsに置き、コミットしないこと。

---

## ローカルで試す場合
`.env.example` を `.env` にコピーして値を入れれば、ローカルでもGoogle Maps/Firestoreが有効になります（`.env` はコミットされません）。
