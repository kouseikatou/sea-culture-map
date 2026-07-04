# 東南アジア文化マップ

東南アジア11か国の**文化・歴史・世界遺産**を、操作できる地図から探せるインタラクティブサイト。
国のピンをクリックすると、その国の基本情報（首都・人口・言語・宗教・通貨）＋世界遺産リスト＋文化/歴史の解説がパネルで開きます。地図を拡大すると、世界遺産そのものの場所が種別ごとの色つきピンで表示されます。

対象国: タイ / ベトナム / カンボジア / ラオス / ミャンマー / マレーシア / シンガポール / インドネシア / フィリピン / ブルネイ / 東ティモール

## 技術

- Vite + React + TypeScript
- Leaflet + react-leaflet（地図タイル: CARTO Basemaps / OpenStreetMap）
- GitHub Pages で静的公開

## ローカル開発

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果をプレビュー
```

- 国・世界遺産のデータは [`src/data/countries.ts`](src/data/countries.ts) に集約。ここを編集すれば内容を追加・修正できます。
- 色・タイポなどのデザイントークンは [`src/styles.css`](src/styles.css) の `:root` で一元管理。

## GitHub Pages で公開する手順

1. GitHub でリポジトリ `sea-culture-map` を作成。
2. このフォルダを push（`main` ブランチ）。
3. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定。
4. push すると [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) が自動でビルド＆デプロイ。
5. 公開 URL: `https://<ユーザ名>.github.io/sea-culture-map/`

> 本番ビルドはサブパス `/sea-culture-map/` で配信されます（[`vite.config.ts`](vite.config.ts) の `base`）。
> リポジトリ名を変える場合は `base` も合わせて変更してください。

## データについて

首都・宗教・通貨・世界遺産は公知の事実に基づいています。人口は概数（約）表記です。
内容の追記・修正は `src/data/countries.ts` の型（`Country` / `HeritageSite`）に沿って行ってください。
