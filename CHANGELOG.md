# 変更履歴

版ごとの主な変更です。
0.1.2 以前は、GitHub のコミット履歴を参照してください。

## 0.2.3

### 修正

- `UL` と `OL` が、記号と番号の種類を、既定で明示するようになりました。Bulma などの CSS のリセット(`ul { list-style: none; }` など)を、アプリが読み込んでいても、記号と番号が消えません。(#28)
  - これまでは `listStyleType` を指定していなかったため、リセットの `ul { list-style: none; }` がそのまま効いて、`UL` の記号が出ませんでした(リセットによっては `OL` の番号も消えました)。
  - 種類は、ブラウザの既定のスタイルシートと同じ規則です。入れ子の深さは、外側にある `UL` と `OL` を区別せずに数えます(一番外側が 1)。
    - `UL` の深さ 1 は `disc`、深さ 2 は `circle`、深さ 3 以上は `square`。
    - `OL` は、深さに関係なく `decimal`。
  - あわせて、リセットで消されやすいものを明示しました。`UL`・`OL` に `listStylePosition: 'outside'`(2 行目以降が本文の頭にそろう字下げの前提)、`LI` に `display: 'list-item'`(`li { display: block; }` のようなリセットで記号が消えるのを防ぐため)。
  - `sx` は今までどおり既定のスタイルの後に重なり、`listStyleType` を上書きできます。外側の `UL` の `sx` で `listStyleType` を変えても、入れ子の `UL` は、深さに応じた既定のままです(ブラウザの既定と同じふるまい)。
  - リセットがないときの見た目は、変わりません。余白・文字・入れ子の余白も、変えていません。
  - 深さは、`UL`・`OL` が子孫に渡す context で伝えます。`LI` の中かどうかを伝える、これまでの context は、入れ子の余白のために、そのまま残しています。

### 開発

- `test/List.test.js` に、記号と番号のテストを追加しました。CSS のリセットの `<style>` を入れた場合(tion の style より前と後)と、入れない場合の、両方で同じ値になることを確かめます。
- dev の Example パネルの「リスト」の節に、CSS のリセットを再現する例を足しました(`GlobalStyles` で `ul`・`ol` の記号を消し、素の `ul` と、tion の `UL`・`OL` を並べています)。
- dev の Components パネルの `UL`・`OL`・`LI` の説明に、記号の規則とリセットへの耐性を書き足しました。

## 0.2.2

npm に公開されているのは、0.2.0 の次が 0.2.2 です。
0.2.1(#13)の内容も、この版に含まれます。
0.3.0 として出す予定でしたが、0.2.2 として公開しました。
詳しい props は、README を参照してください。

### 追加

- 図(画像)を表示する `Figure` コンポーネントを追加しました。`tion` のメインのエントリ(`import { Figure } from 'tion'`)から使えます。react-router-dom には依存しません。(#14)
  - 外側は `<figure>`、中に `<img>` を置き、`caption` を渡したときだけ、画像の下に `<figcaption>` を置きます。
  - props は `src`(画像の URL)、`alt`(代替テキスト。省略すると `alt` 属性は付きません)、`caption`(図の説明。ReactNode)、`width`(表示幅。数値は px、文字列は `'50%'` など)、`sx`(外側の `<figure>` のスタイルの上書き)です。
  - 画像は、元の大きさで表示し、画面が狭いときだけ縮めます(`display: block`、`maxWidth: '100%'`、`height: 'auto'`)。小さい画像を引き伸ばしてぼやけさせないためです。`width` を渡したときも `maxWidth: '100%'` は残ります。
  - `<figure>` のブラウザ既定の左右の余白(40px)は消して、上下に余白(`mt: 2`、`mb: 2`)を付けます。
  - `<figcaption>` は、Typography の `body2`、色は `text.secondary`、`mt: 1` です。
- `Panel` に `kind` と `icon` を追加しました。(#17)
  - `kind` は 5 つの種類(`info`・`note`・`warning`・`success`・`error`)で、種類ごとに決まった背景色・枠の色・アイコンが付いた、色つきの囲みになります。
  - `icon` で、アイコンを消す(`false`)か、好きな要素に差し替えられます。
  - `kind` を指定しないとき(知らない値のときも)は、これまでの `Panel` と同じ見た目と DOM です。
- 箇条書きと番号つきリストの `UL`・`OL`・`LI` を追加しました。(#15)
  - `UL` は箇条書き(`ul`)、`OL` は番号つきリスト(`ol`。`start` で開始番号を指定できます)、`LI` は項目(`li`)です。
  - `LI` の中に `UL` や `OL` を置くと、入れ子にできます。
- チェック項目の `Check` を追加しました。(#16)
  - 左に `Checkbox`、右に太字の `title` と、その下に説明(`children`)を置きます。
  - `checked` でチェック済みかを指定します。`onChange` を渡したときだけ操作でき、渡さないと表示だけになります。
- 文中の強調の `E` を追加しました。(#18)
  - 文の途中に置けるインライン要素です。`bold`(既定は太字)・`underline`・`color` を指定できます。
  - `color` には、`emphasis`(強調)と `caution`(注意)の名前を使えます。MUI のテーマの色に対応するので、`ThemeProvider` で色を変えれば、`E` の色も変わります。

### 名前について

- #18 の部品は、開発中は `Em` という名前でしたが、公開前に `E` に変えました。
  `Em` という名前では公開していないので、利用者の書き換えは要りません。

### 開発

- `test/components.test.js` に、`Figure` のテストを追加しました。
- テストを部品ごとのファイルに分けました(`test/List.test.js`・`test/Panel.test.js`・`test/Check.test.js`・`test/E.test.js`)。
- dev の Example・Showcase・Components パネルに、`Figure` の例と説明を追加しました。
- dev の Components パネルに「リスト」の分類と、各部品の表示イメージを足しました。

## 0.2.1(npm には公開していません)

この版の内容は、0.2.2 に含まれています。

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
