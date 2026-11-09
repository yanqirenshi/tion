# 変更履歴

版ごとの主な変更です。
0.1.2 以前は、GitHub のコミット履歴を参照してください。

## 0.2.0

### 破壊的な変更

- `@mui/material` を dependencies から peerDependencies に移しました。範囲は `^5.14.0 || ^6.0.0 || ^7.0.0 || ^9.0.0` です。
- `@emotion/react`(`^11.5.0`)と `@emotion/styled`(`^11.3.0`)を peerDependencies に追加しました。MUI が要求するものです。
- 利用側で `@mui/material` と emotion を自分で install する必要があります(0.1.x では `npm install tion` だけで MUI も入りました)。

```bash
npm install tion @mui/material @emotion/react @emotion/styled
```

### 効果

- `tion` のための MUI が重複して入らなくなります。MUI 9 のアプリに、`tion` の MUI 5 が別に入ることはありません。
- アプリの `ThemeProvider` が、`tion` のコンポーネントにも効きます。
- React 19 のアプリでも、MUI の重複や peerDependencies の不一致なしに install できます。

### 確認したこと

- MUI 5.14.0 / 5.18.0 / 6.5.0 / 7.3.11 / 9.5.0 と、React 18 / 19 の組み合わせで、`npm pack` した `tion` を `overrides` も `--legacy-peer-deps` も無しで install でき、`@mui/material` の実体が 1 つだけになることを確かめました。
- 同じ組み合わせで、全コンポーネント(`tion/router` の `LinkReactRouter` と `TabsRR` を含む)が警告なしに描画できることを確かめました。
- コンポーネントの見た目や API の変更はありません。MUI 9 と React 19 で動かすための修正も、要りませんでした。

### 開発

- `test/components.test.js` を追加しました(全コンポーネントのスモークテスト)。
- devDependencies の MUI を 9、React を 19 にしました。

## 0.1.4

- `TabsRR` で、タブをクリックしたときに `onChange` が余分に呼ばれ、一瞬元のタブに戻る問題を修正しました(react-router-dom 7 で起きていました)。(#8)
- `test/TabsRR.test.js` を追加しました。react-router-dom 6 と 7 の両方で、`onChange` の回数と URL の同期を確かめます。

## 0.1.3

- `react-router-dom` の peerDependencies を `^6.0.0 || ^7.0.0` に広げました。react-router-dom 7 のアプリで、`overrides` や `--legacy-peer-deps` が要らなくなります。(#7)
