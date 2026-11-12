# 変更履歴

版ごとの主な変更です。
0.1.2 以前は、GitHub のコミット履歴を参照してください。

## 0.2.1

### 追加

- `Section` と `H` の `lev` に、7 以上を指定できるようになりました。上限はありません。(#13)
  - 1〜6 は今までどおり、要素も variant も `h1`〜`h6` です。
  - 7 は、要素が `h6` のまま、見た目は `subtitle1` + 太字になります。
  - 8 以上は、要素が `h6` のまま、見た目は `subtitle2` + 太字になります。
- 見出しの要素に、`lev` の数値を入れた `data-lev` 属性が付くようになりました(1〜6 にも付きます)。7 以上は要素が `h6` のままなので、目次を作る側が `data-lev` で本当の深さを読めます。
- `lev` は数値でも文字列(`lev="5"`)でも渡せます。1 以上の整数にならない値(`0`、`"abc"` など)や省略時は既定の 4 になり、小数は切り捨てます。
- `Section` のインデントは、1〜6 は今までどおりで、7 以上は `{ pl: 1, mr: 4 }` になります。
- `Section` と `H` の見出しの規則を、共通の関数(`src/components/heading.js`)にまとめました。

### 修正

- `Section` に `lev` 7 以上を渡すと、インデントの表を引けずに `TypeError` で落ちていたのを修正しました。
- `H` に `lev` 7 以上を渡すと、variant が存在しない `h7` になっていたのを修正しました。
- `Section` が、インデントの表そのものを外側の Box の `sx` に展開していて、意図しない `"1"`〜`"6"` のキーが入っていたのを取り除きました。

### 変更しないこと

- `lev` を省略して入れ子にしている既存のコードの見た目は変わりません。(親の `Section` からの深さで自動で決める案は、見た目が変わるため採用していません。)

### 開発

- `test/components.test.js` に、`Section` と `H` の見出しレベルのテストを追加しました。
- dev の Example パネルに、`lev` 7 と 8 の `Section` を入れ子にした例を追加しました。

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

### 修正

- `TabsRR` で、タブをクリックしたときに `onChange` が余分に呼ばれ、一瞬元のタブに戻る問題を修正しました(react-router-dom 7 で起きていました)。(#8)
  0.1.4 で入れた修正で、0.1.4 は npm に公開せず、この 0.2.0 にまとめて公開します。

### 開発

- `test/components.test.js` を追加しました(全コンポーネントのスモークテスト)。
- `test/TabsRR.test.js` を追加しました。react-router-dom 6 と 7 の両方で、`onChange` の回数と URL の同期を確かめます。(#8)
- devDependencies の MUI を 9、React を 19 にしました。

## 0.1.4(npm には公開していません)

0.1.4 の内容は、0.2.0 に含まれています。
npm に公開されているのは、0.1.3 の次が 0.2.0 です。

- `TabsRR` の `onChange` が余分に呼ばれる問題の修正。(#8)

## 0.1.3

- `react-router-dom` の peerDependencies を `^6.0.0 || ^7.0.0` に広げました。react-router-dom 7 のアプリで、`overrides` や `--legacy-peer-deps` が要らなくなります。(#7)
