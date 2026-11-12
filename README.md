# tion

[![npm version](https://img.shields.io/npm/v/tion.svg)](https://www.npmjs.com/package/tion)
[![license](https://img.shields.io/npm/l/tion.svg)](https://opensource.org/licenses/MIT)

[MUI (Material UI)](https://mui.com/) を薄くラップした、小さな React コンポーネントライブラリです。
画面全体のレイアウト、文章の階層構造、リンク、タブ、テーブルといった「どのアプリでも毎回書くもの」を、短い名前のコンポーネントとして提供します。

npm: https://www.npmjs.com/package/tion

## 特徴

- MUI の Box / Typography / Tabs / Table などをそのまま下敷きにしています。独自のテーマ定義はありません。
- `Wall > Frame / FrameTabs > Panel` という画面レイアウトの骨格を提供します。
- `Section` / `H` / `P` / `S` で、見出しレベルに応じてインデントされる文章構造を書けます。
- react-router-dom に依存するコンポーネントは `tion/router` サブパスに分離しています。react-router-dom を使わないアプリでも本体を import できます。

## インストール

```bash
npm install tion @mui/material @emotion/react @emotion/styled
```

`tion` は以下を peerDependencies として要求します。
すべて利用側のアプリで install してください(`@mui/material` は 0.2.0 から peerDependencies です)。

| パッケージ | バージョン | 備考 |
|---|---|---|
| `@mui/material` | ^5.14.0 \|\| ^6.0.0 \|\| ^7.0.0 \|\| ^9.0.0 | 必須 |
| `@emotion/react` | ^11.5.0 | 必須(MUI が要求する) |
| `@emotion/styled` | ^11.3.0 | 必須(MUI が要求する) |
| `react` | ^18.0.0 \|\| ^19.0.0 | 必須 |
| `react-dom` | ^18.0.0 \|\| ^19.0.0 | 必須 |
| `react-router-dom` | ^6.0.0 \|\| ^7.0.0 | 任意。`tion/router` を使う場合のみ |

react-router-dom を使う場合は、あわせて install します。

```bash
npm install react-router-dom
```

### 0.1.x からの移行

0.1.x では `@mui/material` が `tion` の dependencies に含まれていたため、`npm install tion` だけで MUI も入りました。
0.2.0 からは `@mui/material` が peerDependencies になったので、利用側で自分の MUI を install してください(すでに MUI を使っているアプリは、そのまま使えます)。

- アプリの `ThemeProvider` が、`tion` のコンポーネントにも効きます。
- `tion` のための MUI が重複して入らなくなります(MUI 9 のアプリに、`tion` の MUI 5 が別に入ることがなくなります)。
- MUI を入れていないアプリは、`npm install` が peerDependencies の不足を知らせます。上の `npm install` のコマンドで入れてください。

コンポーネントの見た目や API は変わりません。
版ごとの変更は [CHANGELOG.md](CHANGELOG.md) を参照してください。

## 使い方

```jsx
import { Wall, Frame, Section, P, LinkOS } from 'tion';

export default function App () {
    return (
        <Wall>
          <Frame>
            <Section title="はじめに" num="1.">
              <P>本文です。</P>
              <P>
                <LinkOS href="https://mui.com/">MUI</LinkOS>
              </P>
            </Section>
          </Frame>
        </Wall>
    );
}
```

react-router-dom を使う場合は、ルーター依存のコンポーネントを `tion/router` から import します。

```jsx
import { LinkRR, TabsRR } from 'tion/router';
```

## コンポーネント一覧

### レイアウト(画面)

画面全体を構成するための土台となるコンポーネント群です。
以下の構成での利用を前提とします。

```
Wall
 |
 +-- Frame / FrameTabs
       |
       +-- Panel
```

Wall・Frame(または FrameTabs)が持つ情報を Panel に props として連携するところまでを tion の機能とします。
Panel に渡した後の表示内容はアプリ側の責務です。

| コンポーネント | 説明 | 主な props |
|---|---|---|
| `Wall` | 画面全体(100vw x 100vh)を覆う Box。アプリの最外殻に使う | `children` |
| `Frame` | 親要素いっぱい(100% x 100%)に広がる Box | `children` |
| `FrameTabs` | 上部にタブバー、その下に残り高さいっぱいのコンテンツ領域を持つフレーム。タブバーの高さを自動計測する | `tabs`, `onChangeTabs`, `children` |
| `Panel` | 枠線と内側の余白を持つ囲みボックス。`kind` で、情報・メモ・注意などの色とアイコンを付けられる | `children`, `kind`, `icon`, `sx` |

```jsx
import { Wall, FrameTabs, Panel } from 'tion';

const [tabs, setTabs] = React.useState({
    selected: 'a',
    list: [
        { code: 'a', label: 'A' },
        { code: 'b', label: 'B' },
    ],
});

<Wall>
  <FrameTabs tabs={tabs} onChangeTabs={setTabs}>
    {tabs.selected === 'a' && <Panel>A の内容</Panel>}
    {tabs.selected === 'b' && <Panel>B の内容</Panel>}
  </FrameTabs>
</Wall>
```

#### Panel の種類(`kind`)

`Panel` に `kind` を渡すと、種類ごとに決まった背景色・枠の色・アイコンが付いた、色つきの囲みになります。
Confluence などの文書にある「情報」「メモ」「注意」の囲みを表すときに使います。

| `kind` | 使いどころ | 背景 | 枠 | アイコン(色) |
|---|---|---|---|---|
| `info` | 情報 | `#e9f2ff` | `#cce0ff` | 丸の中に i (`#1d7afc`) |
| `note` | メモ | `#f3f0ff` | `#dfd8fd` | 紙 (`#8f7ee7`) |
| `warning` | 注意 | `#fff7d6` | `#f8e6a0` | 三角の中に ! (`#b38600`) |
| `success` | 成功 | `#dcfff1` | `#baf3db` | 丸の中にチェック (`#22a06b`) |
| `error` | エラー | `#ffeceb` | `#ffd5d2` | 丸の中に × (`#e2483d`) |

```jsx
<Panel kind="info">設定は、保存すると全員に反映されます。</Panel>
<Panel kind="warning">元に戻せません。</Panel>

{/* アイコンを出さない(色だけ変わる) */}
<Panel kind="note" icon={false}>アイコンなしのメモ</Panel>

{/* 既定のアイコンの代わりに、好きな要素を出す */}
<Panel kind="success" icon={<MyIcon />}>保存しました。</Panel>

{/* sx は kind の色より優先される */}
<Panel kind="error" sx={{ mt: 3, borderColor: 'red' }}>失敗しました。</Panel>
```

- アイコンは左上に置き、本文はその右に並びます。
  アイコンの縦位置は、本文の 1 行目にそろいます。
  長い文や表も、はみ出さずに本文の幅に収まります。
- アイコンは tion の中で、MUI の `SvgIcon` と単純な図形で描いています。
  `@mui/icons-material` は要りません。
  大きさは 20px で、色は上の表のとおりです。
  `aria-hidden` が付くので、スクリーンリーダーは読み上げません。
- `icon={false}`(`null` も同じ)でアイコンを消せます。
  このとき変わるのは色だけで、アイコンの枠も並べ方(flex)も付きません。
- `icon` に要素(ReactNode)を渡すと、既定のアイコンの代わりにそれを出します。
- `kind` を指定しないとき、または知らない値(`"foo"` など)を渡したときは、これまでの `Panel` と同じ見た目と DOM になります。
  警告は出ません。
  このとき `icon` は効きません。
- `sx` は最後に重ねるので、`kind` の色より優先されます。

### レイアウト(文章)

| コンポーネント | 説明 | 主な props |
|---|---|---|
| `Section` | タイトル・番号・見出しレベルを持つセクション。レベルに応じて本文がインデントされ、ネストできる | `title`, `lev` (1 以上の整数、既定 4。7 以上は小さい太字の見出し)、`num`, `children`, `sx` |
| `H` | 見出し。MUI Typography の h1〜h6。`lev` の規則は `Section` と同じ | `lev` (1 以上の整数、既定 4。7 以上は小さい太字の見出し)、`children`, `sx` |
| `P` | 段落用の Box。既定で下マージン `mb: 1` が付く | `children`, `sx` |
| `S` | 汎用テキスト。MUI Typography のラッパー | `children`, `sx` |
| `Em` | 文中の強調(太字・下線・文字色)。文の途中に置けるインライン要素。色は「強調」「注意」の名前で、MUI のテーマの色を指定できる | `bold`, `underline`, `color`, `children`, `sx` |
| `Plane` | 整形済みテキスト。`<pre>` 要素を返し、改行や空白をそのまま表示する。既定で等幅フォントと背景色が付く | `children`, `sx` |
| `Figure` | 図(画像)。`<figure>` の中に `<img>` を置き、`caption` があれば `<figcaption>` で説明を表示する。元の大きさで表示し、画面が狭いときだけ縮める | `src`, `alt`, `caption`, `width`, `sx` |

```jsx
<Section title="はじめに" num="1.">
  <P>本文...</P>

  <Section title="詳細" lev="5" num="a)">
    <P>ネストした子セクション</P>
  </Section>
</Section>
```

#### 見出しのレベル(`lev`)

`Section` と `H` の `lev` は、同じ規則で見出しの要素と見た目を決めます。
上限はありません。

| `lev` | 要素 | 見た目(Typography の variant) |
|---|---|---|
| 1〜6 | `h1`〜`h6` | `h1`〜`h6` |
| 7 | `h6` | `subtitle1` + 太字 |
| 8 以上 | `h6` | `subtitle2` + 太字 |

- `lev` は数値でも文字列(`lev="5"`)でも渡せます。
- 1 以上の整数にならない値(`0`、`"abc"` など)や省略時は、既定の 4 になります。小数は切り捨てます。
- 見出しの要素には、`lev` の数値が `data-lev` 属性として付きます(1〜6 にも付きます)。
  7 以上は要素が `h6` のままなので、目次を作るときは、要素ではなく `data-lev` で本当の深さを読んでください。
- `Section` のインデントは、1〜6 は今までどおりで、7 以上は同じ幅(小さめ)になります。

```jsx
<Section title="項" lev="6" num="i)">
  <Section title="小見出し" lev="7" num="(1)">
    <Section title="さらに小さい見出し" lev="8" num="(a)">
      <P>本文...</P>
    </Section>
  </Section>
</Section>
```

#### 図(`Figure`)

スクリーンショットや構成図などの画像を、本文の間に入れるための部品です。
HTML の `<figure>` 要素の中に `<img>` を置き、`caption` を渡したときだけ、画像の下に `<figcaption>` で説明を表示します。

| props | 型 | 説明 |
|---|---|---|
| `src` | string | 画像の URL。`<img>` にそのまま渡します |
| `alt` | string | 代替テキスト。`<img>` にそのまま渡します。省略すると `alt` 属性は付きません |
| `caption` | ReactNode | 図の説明。省略すると `<figcaption>` は出ません |
| `width` | number \| string | 画像の表示幅。数値は px、文字列は `'50%'` のように CSS の値で指定します。省略すると画像の元の大きさです |
| `sx` | object | 外側の `<figure>` のスタイルの上書き |

```jsx
import { Figure } from 'tion';

<Figure src="/images/architecture.png"
        alt="システムの構成図"
        caption="図 1: システムの構成"/>

<Figure src="/images/screenshot.png"
        alt="ログイン画面"
        width={480}/>
```

- `alt` は、画像の内容が伝わる文を指定することを勧めます(画像が見えない人や、画像の読み込みに失敗したときに使われます)。
  `caption` が画像の内容を十分に説明している図では、省略もできます。装飾だけの画像は `alt=""` にします。
- 画像は、元の大きさで表示し、画面が狭いときだけ縮めます(`display: block`、`maxWidth: '100%'`、`height: 'auto'`)。小さい画像を引き伸ばしてぼやけさせないためです。`width` を渡したときも `maxWidth: '100%'` は残るので、画面が狭ければ縮みます。
- `<figure>` のブラウザ既定の左右の余白(40px)は消して、上下に余白(`mt: 2`、`mb: 2`)を付けています。
- `<figcaption>` は、MUI Typography の `body2`、色は `text.secondary` です。

#### 文中の強調(`Em`)

文の一部だけを強調するための部品です。
`P` や `S` の中の、文の途中に置けます(`display` は指定しないので、インラインのままです)。
`S` は MUI の `Typography` で段落になるため、文の途中には使えませんが、`Em` は使えます。

| props | 型 | 説明 |
|---|---|---|
| `bold` | boolean | 太字にするか。既定は `true`。`bold={false}` で太字をやめる |
| `underline` | boolean | 下線を引くか。既定は `false` |
| `color` | string | 文字色。下の「色の名前」か、`sx` の `color` に渡せる値。省略すると色は変えない |
| `children` | ReactNode | 強調する文字 |
| `sx` | object | スタイルの上書き。既定のスタイルの後に重ねる |

- 太字のときは `<strong>` 要素、太字でないときは `<span>` 要素になります。
- 太字は `fontWeight: 'bold'` です。
- 下線は `textDecoration: 'underline'` と `textUnderlineOffset: '0.2em'` です。下線の色は、文字色と同じです。

色の名前は、MUI のテーマのパレットに対応しています。
アプリの `ThemeProvider` でパレットの色を変えれば、`Em` の色も変わるので、ページ間で色をそろえやすくなります。

| `color` | 意味 | テーマのパレット |
|---|---|---|
| `"emphasis"` | 強調 | `primary.main` |
| `"caution"` | 注意 | `error.main` |
| それ以外の値(`'#c00'`、`'text.secondary'` など) | | そのまま `sx` の `color` に渡す |

```jsx
import { P, Em } from 'tion';

<P>…は、<Em color="caution">必ず事前に確認する</Em>。</P>

<P>…、<Em bold={false} underline color="caution">ただし</Em>、…</P>

<P>…は<Em color="emphasis">重要</Em>です。<Em underline>下線だけ(太字のまま)</Em>や、<Em color="#c00">任意の色</Em>も使えます。</P>
```

### リンク

`LinkOutSite` と `LinkReactRouter` は、点線の下線が付いた共通のリンクスタイルを持ちます。

| コンポーネント | import 元 | 説明 | 主な props |
|---|---|---|---|
| `LinkOutSite` / `LinkOS` | `tion` | 外部サイトへのリンク。`target="_blank"` で開く。`children` を省略すると `href` がそのまま表示される | `href`, `children`, `style`, `onClick` |
| `LinkReactRouter` / `LinkRR` | `tion/router` | react-router-dom の `Link` をラップしたアプリ内リンク | `href`, `children`, `style`, `onClick` |

`LinkOS` と `LinkRR` はそれぞれの別名です。

### タブ

タブの状態は `{ selected, list: [{ code, label }] }` という形のオブジェクトで扱います。
`onChange` には `selected` を差し替えた新しいオブジェクトが渡されます。

| コンポーネント | import 元 | 説明 | 主な props |
|---|---|---|---|
| `Tabs` | `tion` | MUI Tabs をラップしたタブ切り替え UI | `data`, `onChange` |
| `TabsRR` | `tion/router` | `Tabs` に加えて、URL の `?tab=` クエリと選択状態を双方向に同期する | `data`, `onChange` |

```jsx
import { Tabs } from 'tion';

<Tabs data={tabs} onChange={setTabs}/>
```

### テーブル

| コンポーネント | 説明 | 主な props |
|---|---|---|
| `Table` | 列定義と行データから表を描画する | `columns`, `rows`, `ids` |

`columns` の各要素は `{ code, label, key | val, sx }` です。
セルの値は `key`(行オブジェクトのプロパティ名)か `val`(`row => 値` の関数)で指定します。
`ids` は React の key を生成する関数の組で、`{ column: (col, i) => key, row: (row, i) => key }` の形で渡します。
省略した場合は配列のインデックスが key になります。

```jsx
<Table columns={[
           { code: 'a', label: 'A', key: 'a' },
           { code: 'b', label: 'B', val: (row) => row.b * 2 },
       ]}
       rows={[{ a: 1, b: 2 }, { a: 3, b: 4 }]}
       ids={{ column: (c, i) => c.code, row: (r, i) => i }}/>
```

### リスト

箇条書きと番号つきリストの部品です。
名前は `H`・`P`・`S` に合わせて大文字にしてあり、MUI の `List` とも重なりません。

| コンポーネント | 要素 | 説明 | 主な props |
|---|---|---|---|
| `UL` | `ul` | 箇条書き | `children`, `sx` |
| `OL` | `ol` | 番号つきリスト。番号はブラウザが自動で振る | `start`, `children`, `sx` |
| `LI` | `li` | リストの項目 | `children`, `sx` |

項目は `children` に `LI` を並べて書きます。
`LI` の中に `UL` や `OL` を置くと、入れ子にできます。

```jsx
import { UL, OL, LI } from 'tion';

<UL>
  <LI>項目</LI>
  <LI>親の項目
    <OL>
      <LI>子の項目</LI>
    </OL>
  </LI>
</UL>
```

- `UL`・`OL`・`LI` はすべて `children` と `sx` を受け取ります。
  `sx` は既定のスタイルの後に重なるので、既定の値を上書きできます。
- `OL` は `start`(開始番号)を受け取り、`ol` の `start` 属性にそのまま渡します。
  `<OL start={5}>` なら、番号は 5 から始まります。
- 上記以外の props はありません。
  記号や番号の形を変えたいときは、`sx` の `listStyleType` で変えます(例: `<UL sx={{ listStyleType: 'square' }}>`)。
- 既定のスタイルは次のとおりです。
  - `UL`・`OL`: ブラウザ既定の余白を消し、`m: 0`、`mb: 1`、`pl: 3` にします。`mb: 1` は `P` に合わせてあります。
  - `UL`・`OL`: `typography: 'body1'` が付き、文字は `S` と同じ見た目になります。
  - `UL`・`OL`: 記号と番号はブラウザ既定どおり行の外に出るので、2 行目以降は本文の頭にそろいます。
  - `LI`: 項目どうしの間は `mb: 0.5` です。
  - `LI` の中に入れた `UL`・`OL`: `mt: 0.5`、`mb: 0` になります。この値は、入れ子にした `UL`・`OL` 自身の `sx` で上書きできます。

### チェック項目(Check)

チェック項目(☐)を表す部品です。
左に MUI の `Checkbox`、右に太字の `title` と、その下に説明(`children`)を置きます。
`Checkbox` は、`title` の 1 行目の高さにそろいます。
説明の左端は、`title` の左端にそろいます。

| props | 型 | 既定値 | 説明 |
|---|---|---|---|
| `title` | `ReactNode` | | 項目名。`label` 要素で描き、`Checkbox` と結びつけます。見た目は `body1` の太字です |
| `children` | `ReactNode` | | 説明。省略できます。`title` の下に `mt: 0.5` で置きます。文字は `body1` です |
| `checked` | `boolean` | `false` | チェック済みか |
| `onChange` | `(checked, event) => void` | | 渡すと、チェックを操作できます。渡さないと表示だけになります |
| `sx` | `object` | | 外側の `Box` のスタイルの上書き。既定は `display: 'flex'`、`alignItems: 'flex-start'`、`gap: 1`、`mb: 1.5` です |

```jsx
import { Check } from 'tion';

<Check title="バックアップを取った" checked>
  作業の前日までに、全データのバックアップを取る。
</Check>
<Check title="関係者に連絡した" checked={done} onChange={(v) => setDone(v)}/>
```

- `onChange` を渡すと、制御されたコンポーネントになります。
  `checked` は呼び出し側が持ち、クリックされたら新しい値が `onChange` に渡されます。
  渡される値は、今の `checked` の反対です。
  呼び出し側が `checked` を変えるまで、表示は変わりません。
- `title` の `label` をクリックしても、チェックが切り替わります(`label` の `htmlFor` と `Checkbox` の `id` は、`React.useId` で作ります)。
- `onChange` を渡さないと、表示だけになります。
  - `Checkbox` は `checked` のとおりに表示され、クリックしても変わりません。
  - ripple を無効にし、カーソルは `default` にします。クリックできそうに見せないためです。
  - `input` に `aria-readonly="true"` が付きます。
    `disabled` にはしません。`disabled` だと色が薄くなって、読みにくいためです。
- チェック済みでも、`title` や説明の見た目(取り消し線など)は変わりません。
- 項目を並べる入れ物の部品はありません。`Check` を並べて使います。
  項目の間は、各 `Check` の `mb: 1.5` です。

### その他

| コンポーネント | 説明 |
|---|---|
| `GithubCorners` | 画面右上に表示する GitHub リボン風の SVG リンク。現状リンク先は固定で、props は受け取りません |

## 開発

### ディレクトリ構成

```
src/            ライブラリ本体(JSX)
  index.js      tion のエントリポイント
  router.js     tion/router のエントリポイント
  components/   各コンポーネント
dist/           Babel で変換した公開用コード(コミットに含める)
dev/            Create React App 製のデモ兼ドキュメントアプリ
  src/lib/      src/ のコピー(デモアプリが直接 import する)
test/           dist/ に対するテスト(jsdom。npm には含めない)
```

`src/components/` と `dev/src/lib/components/` は同一内容のコピーです。
コンポーネントを修正したときは両方に反映してください。

### デモアプリの起動

```bash
cd dev
npm install
npm start
```

http://localhost:3000 で以下のタブが確認できます。

- **Example**: Section / Table / リンクの実使用例
- **Showcase**: 各コンポーネントを並べた一覧
- **Components**: 各コンポーネントの概要・props・サンプルコード
- **Basic Design**: 下敷きになっている MUI のカラー・タイポグラフィ・余白などのトークン一覧

### ビルド

```bash
npm run transpile
```

`src/` を Babel で変換して `dist/` に出力します。
`npm publish` 時には `prepublishOnly` で自動的に実行されます。

### テスト

```bash
npm install
npm test
```

`npm run transpile` で `dist/` を作り直してから、`test/` のテストを実行します。

- `test/TabsRR.test.js`: `tion/router` の `TabsRR` を、react-router-dom 6 と 7 の両方(devDependencies に別名 `react-router-dom-6` / `react-router-dom-7` で入れています)で動かし、`onChange` の呼ばれ方と URL の `?tab=` の同期を確かめます。
- `test/components.test.js`: 全コンポーネントを jsdom で描画するスモークテストです。React / MUI の警告が出ないことと、MUI の実体が 1 つだけ読み込まれていることも確かめます。

devDependencies に入れているのは、MUI 9 と React 19 の組み合わせです。
peerDependencies の範囲にある別の組み合わせ(MUI 5 / 6 / 7、React 18 など)で確かめるときは、一時フォルダのアプリに `npm pack` した `tion` を入れて、`components.test.js` を次のように実行します。

```bash
TION_DIST=node_modules/tion/dist TION_ROUTER_PKG=react-router-dom node --test components.test.js
```

## ライセンス

MIT
