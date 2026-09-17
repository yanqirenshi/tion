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
npm install tion
```

`tion` は以下を peerDependencies として要求します。

| パッケージ | バージョン | 備考 |
|---|---|---|
| `react` | ^18.0.0 \|\| ^19.0.0 | 必須 |
| `react-dom` | ^18.0.0 \|\| ^19.0.0 | 必須 |
| `react-router-dom` | ^6.0.0 | 任意。`tion/router` を使う場合のみ |

`@mui/material` は `tion` の dependencies に含まれています。
ただし MUI 自体が `@emotion/react` と `@emotion/styled` を peerDependencies として要求するため、利用側で以下もインストールしてください。

```bash
npm install @emotion/react @emotion/styled
```

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
| `Panel` | 枠線と内側の余白を持つ囲みボックス | `children`, `sx` |

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

### レイアウト(文章)

| コンポーネント | 説明 | 主な props |
|---|---|---|
| `Section` | タイトル・番号・見出しレベルを持つセクション。レベルに応じて本文がインデントされ、ネストできる | `title`, `lev` (1〜6、既定 4), `num`, `children`, `sx` |
| `H` | 見出し。MUI Typography の h1〜h6 | `lev` (1〜6、既定 4), `children`, `sx` |
| `P` | 段落用の Box。既定で下マージン `mb: 1` が付く | `children`, `sx` |
| `S` | 汎用テキスト。MUI Typography のラッパー | `children`, `sx` |

```jsx
<Section title="はじめに" num="1.">
  <P>本文...</P>

  <Section title="詳細" lev="5" num="a)">
    <P>ネストした子セクション</P>
  </Section>
</Section>
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

## ライセンス

MIT
