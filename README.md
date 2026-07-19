# つりつりゲーム

5さいむけの みなとまち つりゲーム（React + Vite）。

## あそびかた
1. キャラクター（いぬ・ねこ 4ひき）を えらぶ
2. マップで つりばを えらぶ（みなと → ていぼう → いりえ → いわば → おきのとうだい）
3. 「なげる」→ ピクピク まつ →「ヒット！」で ボタンを おす → れんだで ひきあげる
4. どうぐやさん で さお・えさ を かう、さかなを うる
5. おすしやさん で さかなを おすしに して たべる（にっこりポイント）
6. ずかん で つった さかなを コンプリート

## どこからでも あそぶ（こうかい URL）
**https://supernovahouse03.github.io/tsuri-tsuri/**

iPad の Safari で ひらいて、「ホームがめんに ついか」すると アプリみたいに つかえる。
`main` に push すると GitHub Actions が じどうで ビルド→デプロイ する。

## iPad・スマホから あそぶ（おなじ WiFi / Mac が ひつよう）
1. Mac で `つりつりゲーム.app` を ダブルクリック（サーバーが たちあがる）
2. Mac の タイトルがめんに でている `http://192.168.x.x:5196` を iPad の Safari に いれる
   - おなじ URL は 起動時の 通知にも でる
   - IP は WiFi を かえると かわるので、そのつど タイトルがめんを みる
3. Mac を スリープ/終了 すると つながらなくなる（Mac がサーバー）
4. セーブは たんまつごと に べつべつ（localStorage）

## うごかす
- かいはつ: `npm run dev` （http://localhost:5198）
- ビルド: `npm run build`
- かんたん起動: `start.command` をダブルクリック

## え を つくりなおす（生成AI）
`src/assets/<グループ>/<ID>.webp` が あれば その えを、なければ SVG に もどる。
グループ: `fish`(さかな33) `char`(キャラ4) `rod`(さお4) `sushi`(すし29) `plate`(さら4) `area`(けしき5) `shop`(いたまえ/レーン/カウンター)

```
npm run gen                    # まだ 無い ものだけ
npm run gen -- char rod        # その グループだけ
npm run gen -- char:wanta      # その 1まいだけ 作りなおし
npm run gen -- --all           # ぜんぶ 作りなおし
```
プロンプトは `scripts/art-manifest.mjs`（さかなは `scripts/fish-jobs.mjs`）。
OpenAI の `gpt-image-1` を つかう。`.env` に `OPENAI_API_KEY=...`（git には あがらない）。
1まい 約$0.06 / 33ひきで 約$2。プロンプトは `scripts/gen-fish.mjs` の `buildPrompt()`。
さかな・むせきついどうぶつ・じんこうぶつ で プロンプトが きりかわる。

## ファイル
- `src/App.jsx` … ぜんぶの がめん（タイトル/キャラえらび/マップ/つり/ショップ/おすし/ずかん）
- `src/Sea.jsx` … よこから みた うみ（およぐ さかな・あわ・かいそう）
- `src/data.js` … さかな33しゅるい・エリア5・キャラ4・さお4・えさ5
- `src/art.jsx` … さかな/キャラ/おすし の SVG
- `src/sound.js` … WebAudio の こうかおん

セーブは localStorage（キー `tsuri-tsuri-save-v1`）。
