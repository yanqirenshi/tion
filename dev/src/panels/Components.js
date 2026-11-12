import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {UL, OL, LI} from '../lib/index.js';
import {Check} from '../lib/index.js';

import {Section, Table, S, P, Plane, Panel, Figure, Em} from '../lib/index.js';

function Props (props) {
    const rows = props.rows || [];

    return (
        <Table columns={[
                   { code:'name', label:'Prop',  key:'name' },
                   { code:'type', label:'Type',  key:'type' },
                   { code:'desc', label:'説明',  key:'desc' },
               ]}
               rows={rows}
               ids={{column:(c,i)=>i, row:(r,i)=>i}}/>
    );
}

function Code (props) {
    const children = props.children;

    return (
        <S sx={{
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontSize: '0.85rem',
            background: '#f5f5f5',
            p: 1,
            mt: 1,
            borderRadius: 1,
        }}>
          {children}
        </S>
    );
}

// Check の表示イメージ。操作できる項目は、クリックで切り替わるように state を持つ。
function CheckDemo () {
    const [a, setA] = React.useState(false);
    const [b, setB] = React.useState(true);

    return (
        <>
          <Check title="表示だけ(チェック済み)" checked>
            作業の前日までに、全データのバックアップを取る。
          </Check>
          <Check title="表示だけ(未チェック)">
            onChange を渡さないと表示だけになり、クリックしても変わらない。
          </Check>
          <Check title="説明なし(表示だけ・チェック済み)" checked/>
          <Check title="説明なし(表示だけ・未チェック)"/>
          <Check title="操作できる項目(説明つき)" checked={a} onChange={(v)=> setA(v)}>
            onChange を渡すと、クリックで切り替わる。title をクリックしても切り替わる。
          </Check>
          <Check title="操作できる項目(説明なし)" checked={b} onChange={(v)=> setB(v)}/>
        </>
    );
}

const CATEGORIES = [
    {
        title: 'レイアウト(画面)',
        items: [
            {
                name: '概要',
                desc: '画面全体を構成するための土台となるコンポーネント群です。以下の構成での利用を前提とします。',
                diagram: `Wall
 |
 +-- Frame / FrameTabs
       |
       +-- Panel`,
                desc2: 'Wall・Frame(またはFrameTabs)が持つ情報を Panel に props として連携するところまでを tion の機能とします。Panel に渡した後の表示内容(props の具体的な使い方)はアプリ側の責務です。',
            },
            {
                name: 'Wall',
                desc: '画面全体(100vw x 100vh)を覆うレイアウト用のBox。アプリの最外殻に使う。',
                props: [
                    { name:'children', type:'ReactNode', desc:'画面いっぱい(100vw x 100vh)に表示する内容' },
                ],
                code: `<Wall>
  <Frame>...</Frame>
</Wall>`,
            },
            {
                name: 'Frame',
                desc: '親要素いっぱい(100% x 100%)に広がるBox。Wallの内側など、領域を埋めるのに使う。',
                props: [
                    { name:'children', type:'ReactNode', desc:'親要素いっぱい(100% x 100%)に表示する内容' },
                ],
                code: `<Frame>
  <Tabs data={tabs} onChange={setTabs}/>
</Frame>`,
            },
            {
                name: 'FrameTabs',
                desc: '上部にタブバー、その下に残り高さいっぱいのコンテンツ領域を持つフレーム。タブバーの高さを自動計測して本体の高さを調整する。',
                props: [
                    { name:'tabs',         type:'{selected, list:[{code,label}]}', desc:'タブの状態' },
                    { name:'onChangeTabs', type:'(newTabs) => void',               desc:'タブ切り替え時に呼ばれるコールバック' },
                    { name:'children',     type:'ReactNode',                       desc:'タブバーの下、残り高さいっぱいに表示する内容' },
                ],
                code: `<FrameTabs tabs={tabs} onChangeTabs={setTabs}>
  {tabs.selected==='a' && <PanelA/>}
  {tabs.selected==='b' && <PanelB/>}
</FrameTabs>`,
            },
            {
                name: 'Panel',
                desc: '枠線と内側の余白を持つ、シンプルな囲みボックス。コンテンツをひとまとまりに見せたい場合に使う。kind を指定すると、情報・メモ・注意などの色とアイコンが付く。',
                props: [
                    { name:'children', type:'ReactNode', desc:'囲む内容' },
                    { name:'kind',     type:'"info" | "note" | "warning" | "success" | "error"', desc:'囲みの種類。種類ごとに背景色・枠の色・左上のアイコン(20px)が決まる。省略時、または知らない値のときは、kind なしと同じ見た目と DOM(アイコンも flex も付かない。警告も出ない)' },
                    { name:'icon',     type:'ReactNode | false', desc:'kind があるときだけ効く。省略すると種類ごとの既定のアイコン。false(null も)で消す(色だけ変わり、並べ方の flex も付かない)。ReactNode を渡すと既定の代わりにそれを出す' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き(既定で border・borderRadius・p:2 が付与される)。最後に重ねるので、kind の色より優先される' },
                ],
                code: `<Panel>
  <P>ひとまとまりのコンテンツ</P>
</Panel>

<Panel kind="info">情報</Panel>
<Panel kind="note">メモ</Panel>
<Panel kind="warning">注意</Panel>
<Panel kind="success">成功</Panel>
<Panel kind="error">エラー</Panel>

<Panel kind="note" icon={false}>アイコンなし</Panel>
<Panel kind="success" icon={<MyIcon />}>好きなアイコン</Panel>`,
                demo: (
                    <Box>
                      <Panel sx={{mb:1}}><P sx={{mb:0}}>kind なし。今までの Panel と同じ。</P></Panel>
                      <Panel kind="info" sx={{mb:1}}><P sx={{mb:0}}>info: 情報。設定は、保存すると全員に反映されます。</P></Panel>
                      <Panel kind="note" sx={{mb:1}}><P sx={{mb:0}}>note: メモ。この手順は、あとで見直します。</P></Panel>
                      <Panel kind="warning" sx={{mb:1}}><P sx={{mb:0}}>warning: 注意。この操作は元に戻せません。</P></Panel>
                      <Panel kind="success" sx={{mb:1}}><P sx={{mb:0}}>success: 成功。保存しました。</P></Panel>
                      <Panel kind="error" sx={{mb:1}}><P sx={{mb:0}}>error: エラー。保存に失敗しました。</P></Panel>
                      <Panel kind="note" icon={false} sx={{mb:1}}><P sx={{mb:0}}>icon={'{false}'}: アイコンなし。色だけ変わる。</P></Panel>
                      <Panel kind="success" icon={<S sx={{fontWeight:'bold'}}>★</S>} sx={{mb:1}}><P sx={{mb:0}}>icon に要素を渡すと、既定のアイコンの代わりに出る。</P></Panel>
                      <Panel kind="info" sx={{mb:1}}>
                        <P>本文が複数行でも、アイコンは 1 行目にそろう。長い文は、アイコンの右の幅で折り返される。長い文は、アイコンの右の幅で折り返される。長い文は、アイコンの右の幅で折り返される。長い文は、アイコンの右の幅で折り返される。</P>
                        <P sx={{mb:0}}>2 つ目の段落。</P>
                      </Panel>
                      <Panel kind="warning">
                        <Table columns={[
                                   { code:'a', label:'項目', key:'a' },
                                   { code:'b', label:'内容', key:'b' },
                               ]}
                               rows={[{a:'表', b:'表を入れても、アイコンの右の幅に収まる'}]}
                               ids={{column:(c,i)=>i, row:(r,i)=>i}}/>
                      </Panel>
                    </Box>
                ),
            },
        ],
    },
    {
        title: 'レイアウト(文章)',
        items: [
            {
                name: 'Section',
                desc: 'タイトル・番号・見出しレベルを持つ、階層的にインデントできるセクション。',
                props: [
                    { name:'title',    type:'string',            desc:'セクションのタイトル' },
                    { name:'lev',      type:'number | string (既定値: 4)', desc:'見出しレベル。1〜6 は h1〜h6。7 以上は要素が h6 のまま、見た目が小さい太字になる(7 は subtitle1、8 以上は subtitle2。上限なし)。見出しの要素には lev の数値が data-lev 属性で付く(目次用)。文字列("5")も可。1 以上の整数にならない値や省略時は 4、小数は切り捨て。インデント幅もこの値で変わる(7 以上は同じ幅)' },
                    { name:'num',      type:'string',            desc:'セクション番号(例: "1." "a)")。省略可' },
                    { name:'children', type:'ReactNode',         desc:'セクション本文。ネストして子セクションも置ける' },
                    { name:'sx',       type:'object',            desc:'スタイルの上書き' },
                ],
                code: `<Section title="はじめに" num="1.">
  <P>本文...</P>

  <Section title="詳細" lev="5" num="a)">
    <P>ネストした子セクション</P>

    <Section title="小見出し" lev="7" num="(1)">
      <P>7 以上は h6 要素のまま、小さい太字の見出し</P>
    </Section>
  </Section>
</Section>`,
            },
            {
                name: 'H',
                desc: '見出し。levプロパティで見出しレベルを指定できる。1〜6 は h1〜h6、7 以上は小さい太字の見出し(Section と同じ規則)。',
                props: [
                    { name:'lev',      type:'number | string (既定値: 4)', desc:'見出しレベル。1〜6 は h1〜h6。7 以上は要素が h6 のまま、見た目が小さい太字になる(7 は subtitle1、8 以上は subtitle2。上限なし)。見出しの要素には lev の数値が data-lev 属性で付く(目次用)。文字列("5")も可。1 以上の整数にならない値や省略時は 4、小数は切り捨て' },
                    { name:'children', type:'ReactNode',         desc:'見出しテキスト' },
                    { name:'sx',       type:'object',            desc:'スタイルの上書き' },
                ],
                code: `<H lev={2}>見出し</H>`,
            },
            {
                name: 'P',
                desc: '段落用のBox。既定で下マージン(mb:1)が付く。',
                props: [
                    { name:'children', type:'ReactNode', desc:'段落の内容' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き(既定で mb:1 が付与される)' },
                ],
                code: `<P>段落のテキスト</P>`,
            },
            {
                name: 'S',
                desc: '汎用テキスト用のコンポーネント(MUI Typographyのラッパー)。',
                props: [
                    { name:'children', type:'ReactNode', desc:'表示するテキスト等' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き' },
                ],
                code: `<S sx={{color:'gray'}}>補足テキスト</S>`,
            },
            {
                name: 'Plane',
                desc: '整形済みテキスト用のコンポーネント。<pre> 要素を返し、改行や空白をそのまま表示する。',
                props: [
                    { name:'children', type:'ReactNode', desc:'そのまま表示するテキスト' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き(既定で等幅フォント・背景色・lineHeight:1.2・py:1・px:22px・m:0 が付与される)' },
                ],
                code: `<Plane>{\`Wall
 |
 +-- Frame\`}</Plane>`,
                demo: (
                    <Plane>{`Wall
 |
 +-- Frame`}</Plane>
                ),
            },
            {
                name: 'Figure',
                desc: '図(画像)用のコンポーネント。<figure> の中に <img> を置き、caption があれば <figcaption> で説明を表示する。元の大きさで表示し、画面が狭いときだけ縮める。',
                props: [
                    { name:'src',     type:'string',            desc:'画像の URL。img にそのまま渡す' },
                    { name:'alt',     type:'string',            desc:'代替テキスト。img にそのまま渡す。省略すると alt 属性は付かない(画像の内容が伝わる文の指定を勧める。装飾だけの画像は "" にする)' },
                    { name:'caption', type:'ReactNode',         desc:'図の説明。省略すると figcaption は出ない' },
                    { name:'width',   type:'number | string',   desc:'画像の表示幅。数値は px、文字列は \'50%\' などの CSS の値。省略すると画像の元の大きさ。画面が狭いときは maxWidth: 100% で縮む' },
                    { name:'sx',      type:'object',            desc:'外側の figure のスタイルの上書き(既定で m:0・mt:2・mb:2 が付与される)' },
                ],
                code: `<Figure src="/logo192.png"
        alt="tion のロゴ"
        caption="図 1: tion のロゴ"/>

<Figure src="/logo192.png"
        alt="tion のロゴ"
        width={96}/>`,
                demo: (
                    <Box>
                      <Figure src="/logo192.png"
                              alt="tion のロゴ"
                              caption="図 1: tion のロゴ"/>

                      <Figure src="/logo192.png"
                              alt="tion のロゴ"
                              width={96}
                              caption="図 2: width={96}(キャプション付き)"/>
                    </Box>
                ),
            },
            {
                name: 'Em',
                desc: '文中の強調(太字・下線・文字色)用のコンポーネント。P や S の中の、文の途中に置けるインライン要素(display は指定しない)。太字のときは strong、太字でないときは span 要素になる。',
                props: [
                    { name:'bold',      type:'boolean (既定値: true)',  desc:'太字にするか。bold={false} で太字をやめる(fontWeight: bold)' },
                    { name:'underline', type:'boolean (既定値: false)', desc:'下線を引くか(textDecoration: underline、textUnderlineOffset: 0.2em。下線の色は文字色と同じ)' },
                    { name:'color',     type:'string',                  desc:'文字色。"emphasis"(強調 = テーマの primary.main)、"caution"(注意 = テーマの error.main)。それ以外の値(\'#c00\'、\'text.secondary\' など)はそのまま sx の color に渡す。省略すると色は変えない。ThemeProvider でパレットを変えると、名前の色も変わる' },
                    { name:'children',  type:'ReactNode',               desc:'強調する文字' },
                    { name:'sx',        type:'object',                  desc:'スタイルの上書き(既定のスタイルの後に重ねる)' },
                ],
                code: `<P>…は、<Em color="caution">必ず事前に確認する</Em>。</P>

<P>…、<Em bold={false} underline color="caution">ただし</Em>、…</P>`,
                demo: (
                    <Box>
                      <P>既定(太字): 文の途中に<Em>強調したい語</Em>を置けます。</P>
                      <P>太字をやめる: 文の途中に<Em bold={false}>強調しない語</Em>を置けます。(span 要素)</P>
                      <P>下線: <Em underline>下線を引いた語</Em>、<Em bold={false} underline>太字でない下線</Em>。</P>
                      <P>色の名前: <Em color="emphasis">強調(emphasis = primary.main)</Em>、<Em color="caution">注意(caution = error.main)</Em>。</P>
                      <P>色の値: <Em color="#c00">'#c00'</Em>、<Em color="text.secondary">'text.secondary'</Em>。</P>
                      <P>組み合わせ: …は、<Em color="caution">必ず事前に確認する</Em>。…、<Em bold={false} underline color="caution">ただし</Em>、…</P>
                    </Box>
                ),
            },
        ],
    },
    {
        title: 'リンク',
        items: [
            {
                name: 'LinkReactRouter',
                desc: 'react-router-domのLinkをラップしたアプリ内リンク。点線下線スタイルが付く。',
                props: [
                    { name:'href',     type:'string',      desc:'遷移先のパス(react-router-domで解決)' },
                    { name:'children', type:'ReactNode',   desc:'リンクのテキスト' },
                    { name:'style',    type:'object',      desc:'スタイルの上書き' },
                    { name:'onClick',  type:'(e) => void', desc:'クリック時のコールバック' },
                ],
                code: `<LinkReactRouter href="/about">About</LinkReactRouter>`,
            },
            {
                name: 'LinkRR',
                desc: 'LinkReactRouter の別名(エイリアス)。',
                props: [
                    { name:'(props)', type:'-', desc:'LinkReactRouter の別名。propsも同一' },
                ],
                code: `<LinkRR href="/about">About</LinkRR>`,
            },
            {
                name: 'LinkOutSite',
                desc: '外部サイトへのリンク。target="_blank"で開き、点線下線スタイルが付く。',
                props: [
                    { name:'href',     type:'string',      desc:'外部サイトのURL' },
                    { name:'children', type:'ReactNode',   desc:'リンクのテキスト(省略時は href がそのまま表示される)' },
                    { name:'style',    type:'object',      desc:'スタイルの上書き' },
                    { name:'onClick',  type:'(e) => void', desc:'クリック時のコールバック' },
                ],
                code: `<LinkOutSite href="https://example.com">Example</LinkOutSite>`,
            },
            {
                name: 'LinkOS',
                desc: 'LinkOutSite の別名(エイリアス)。',
                props: [
                    { name:'(props)', type:'-', desc:'LinkOutSite の別名。propsも同一' },
                ],
                code: `<LinkOS href="https://example.com">Example</LinkOS>`,
            },
        ],
    },
    {
        title: 'リスト',
        items: [
            {
                name: 'UL',
                desc: '箇条書き。ul 要素を返す。項目は children に LI を並べて書き、LI の中に UL や OL を置くと入れ子にできる。',
                props: [
                    { name:'children', type:'ReactNode', desc:'リストの項目(LI)' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き。既定で m:0・mb:1・pl:3・typography:body1 が付与される(LI の中では mt:0.5・mb:0)。記号の形は sx の listStyleType で変える' },
                ],
                code: `<UL>
  <LI>項目</LI>
  <LI>親の項目
    <UL>
      <LI>子の項目</LI>
    </UL>
  </LI>
</UL>`,
                demo: (
                    <UL>
                      <LI>項目</LI>
                      <LI>親の項目
                        <UL>
                          <LI>子の項目</LI>
                        </UL>
                      </LI>
                    </UL>
                ),
            },
            {
                name: 'OL',
                desc: '番号つきリスト。ol 要素を返し、番号はブラウザが自動で振る。項目は children に LI を並べて書く。',
                props: [
                    { name:'start',    type:'number',    desc:'開始番号。ol の start 属性にそのまま渡す。省略時は 1 から' },
                    { name:'children', type:'ReactNode', desc:'リストの項目(LI)' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き。既定で m:0・mb:1・pl:3・typography:body1 が付与される(LI の中では mt:0.5・mb:0)。番号の形は sx の listStyleType で変える' },
                ],
                code: `<OL start={3}>
  <LI>3 番目の項目</LI>
  <LI>4 番目の項目
    <OL>
      <LI>入れ子の 1 番目</LI>
    </OL>
  </LI>
</OL>`,
                demo: (
                    <OL start={3}>
                      <LI>3 番目の項目</LI>
                      <LI>4 番目の項目
                        <OL>
                          <LI>入れ子の 1 番目</LI>
                        </OL>
                      </LI>
                    </OL>
                ),
            },
            {
                name: 'LI',
                desc: 'リストの項目。li 要素を返す。UL・OL の中に置く。',
                props: [
                    { name:'children', type:'ReactNode', desc:'項目の内容。UL や OL を置くと入れ子にできる' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き(既定で mb:0.5 が付与される)' },
                ],
                code: `<LI sx={{color:'gray'}}>項目</LI>`,
            },
            {
                name: 'Check',
                desc: 'チェック項目(☐)。左に MUI の Checkbox、右に太字の title と、その下に説明(children)を置く。onChange を渡すと操作でき、渡さないと表示だけになる。',
                props: [
                    { name:'title',    type:'ReactNode',                     desc:'項目名。label 要素で描き、Checkbox と結びつけるので、クリックでも切り替わる。太字の body1' },
                    { name:'children', type:'ReactNode',                     desc:'説明。省略可。title の下に置く。文字は body1' },
                    { name:'checked',  type:'boolean (既定値: false)',       desc:'チェック済みか' },
                    { name:'onChange', type:'(checked, event) => void',      desc:'渡すとチェックを操作できる(制御されたコンポーネント。checked は呼び出し側が持つ)。渡さないと表示だけになり、クリックしても変わらない(ripple なし・カーソルは default・input に aria-readonly="true"。disabled にはしない)' },
                    { name:'sx',       type:'object',                        desc:'外側のスタイルの上書き(既定で display:flex・alignItems:flex-start・gap:1・mb:1.5 が付与される)' },
                ],
                code: `<Check title="バックアップを取った" checked>
  作業の前日までに、全データのバックアップを取る。
</Check>
<Check title="関係者に連絡した"
       checked={done}
       onChange={(v)=> setDone(v)}/>`,
                demo: <CheckDemo/>,
            },
        ],
    },
    {
        title: '他',
        items: [
            {
                name: 'Tabs',
                desc: 'MUIのTabsをラップしたシンプルなタブ切り替えUI。',
                props: [
                    { name:'data',     type:'{selected, list:[{code,label}]}', desc:'タブの状態' },
                    { name:'onChange', type:'(newData) => void',               desc:'タブ切り替え時に呼ばれるコールバック' },
                ],
                code: `<Tabs data={tabs} onChange={setTabs}/>`,
            },
            {
                name: 'Table',
                desc: '列定義(columns)と行データ(rows)を渡して表を描画するテーブル。',
                props: [
                    { name:'columns', type:'[{code, label, key|val, sx}]',            desc:'列定義。値は key(行のプロパティ名) か val(row=>値の関数)で指定' },
                    { name:'rows',    type:'[object]',                                desc:'行データ' },
                    { name:'ids',     type:'{column:(col,i)=>key, row:(row,i)=>key}', desc:'React key を生成する関数' },
                ],
                code: `<Table columns={[
    { code:'a', label:'A', key:'a' },
    { code:'b', label:'B', val:(row)=> row.b*2 },
]}
       rows={[{a:1, b:2}]}
       ids={{column:(c,i)=>i, row:(r,i)=>i}}/>`,
            },
            {
                name: 'GithubCorners',
                desc: '画面右上に表示するGitHubリボン風のSVGリンク。',
                props: [
                    { name:'(なし)', type:'-', desc:'propsは使用しない。画面右上に固定URLへのGitHubリボンを表示する' },
                ],
                code: `<GithubCorners/>`,
            },
        ],
    },
];

export default function Components (props) {
    const [selected, setSelected] = React.useState(CATEGORIES[0].items[0].name);

    const current = CATEGORIES
          .flatMap((cat)=> cat.items)
          .find((item)=> item.name===selected);

    return (
        <Box sx={{display:'flex', height:'100%'}}>

          <Box sx={{
              width: 240,
              flexShrink: 0,
              borderRight: '1px solid #e0e0e0',
              overflowY: 'auto',
          }}>
            <List dense disablePadding>
              {CATEGORIES.map((cat)=> (
                  <Box key={cat.title}>
                    <ListSubheader>{cat.title}</ListSubheader>
                    {cat.items.map((item)=> (
                        <ListItemButton key={item.name}
                                        selected={item.name===selected}
                                        onClick={()=> setSelected(item.name)}
                                        sx={{pl:4}}>
                          <ListItemText primary={item.name}/>
                        </ListItemButton>
                    ))}
                  </Box>
              ))}
            </List>
          </Box>

          <Box sx={{flexGrow:1, p:3, overflowY:'auto'}}>
            {current && (
                <Section title={current.name}>

                  <Section title="概要" lev="5">
                    <P>{current.desc}</P>
                    {current.diagram && <Code>{current.diagram}</Code>}
                    {current.desc2 && <P sx={{mt:2}}>{current.desc2}</P>}
                  </Section>

                  {current.props && (
                      <Section title="Props" lev="5">
                        <Props rows={current.props}/>
                      </Section>
                  )}

                  {current.code && (
                      <Section title="サンプルコード" lev="5">
                        <Code>{current.code}</Code>
                      </Section>
                  )}

                  {current.demo && (
                      <Section title="表示イメージ" lev="5">
                        {current.demo}
                      </Section>
                  )}

                </Section>
            )}
          </Box>

        </Box>
    );
}
