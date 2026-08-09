import React from 'react';

import Container from '@mui/material/Container';

import {Section, Table, S} from '../lib/index.js';

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

export default function Components (props) {
    return (
        <Container maxWidth="md" sx={{pt:8}}>

          <Section title="レイアウト(画面)" num="1.">

            <Section title="Wall" lev="5" num="a)">
              <Props rows={[
                         { name:'children', type:'ReactNode', desc:'画面いっぱい(100vw x 100vh)に表示する内容' },
                     ]}/>
              <Code>{`<Wall>
  <Frame>...</Frame>
</Wall>`}</Code>
            </Section>

            <Section title="Frame" lev="5" num="b)">
              <Props rows={[
                         { name:'children', type:'ReactNode', desc:'親要素いっぱい(100% x 100%)に表示する内容' },
                     ]}/>
              <Code>{`<Frame>
  <Tabs data={tabs} onChange={setTabs}/>
</Frame>`}</Code>
            </Section>

            <Section title="FrameTabs" lev="5" num="c)">
              <Props rows={[
                         { name:'tabs',         type:'{selected, list:[{code,label}]}', desc:'タブの状態' },
                         { name:'onChangeTabs', type:'(newTabs) => void',               desc:'タブ切り替え時に呼ばれるコールバック' },
                         { name:'children',     type:'ReactNode',                       desc:'タブバーの下、残り高さいっぱいに表示する内容' },
                     ]}/>
              <Code>{`<FrameTabs tabs={tabs} onChangeTabs={setTabs}>
  {tabs.selected==='a' && <PanelA/>}
  {tabs.selected==='b' && <PanelB/>}
</FrameTabs>`}</Code>
            </Section>

          </Section>

          <Section title="レイアウト(文章)" num="2.">

            <Section title="Section" lev="5" num="a)">
              <Props rows={[
                         { name:'title',    type:'string',          desc:'セクションのタイトル' },
                         { name:'lev',      type:'number (既定値: 4)', desc:'見出しレベル(h1〜h6)。インデント幅もこの値で変わる' },
                         { name:'num',      type:'string',          desc:'セクション番号(例: "1." "a)")。省略可' },
                         { name:'children', type:'ReactNode',       desc:'セクション本文。ネストして子セクションも置ける' },
                         { name:'sx',       type:'object',          desc:'スタイルの上書き' },
                     ]}/>
              <Code>{`<Section title="はじめに" num="1.">
  <P>本文...</P>

  <Section title="詳細" lev="5" num="a)">
    <P>ネストした子セクション</P>
  </Section>
</Section>`}</Code>
            </Section>

            <Section title="H" lev="5" num="b)">
              <Props rows={[
                         { name:'lev',      type:'number (既定値: 4)', desc:'見出しレベル(h1〜h6相当)' },
                         { name:'children', type:'ReactNode',       desc:'見出しテキスト' },
                         { name:'sx',       type:'object',          desc:'スタイルの上書き' },
                     ]}/>
              <Code>{`<H lev={2}>見出し</H>`}</Code>
            </Section>

            <Section title="P" lev="5" num="c)">
              <Props rows={[
                         { name:'children', type:'ReactNode', desc:'段落の内容' },
                         { name:'sx',       type:'object',    desc:'スタイルの上書き(既定で mb:1 が付与される)' },
                     ]}/>
              <Code>{`<P>段落のテキスト</P>`}</Code>
            </Section>

            <Section title="S" lev="5" num="d)">
              <Props rows={[
                         { name:'children', type:'ReactNode', desc:'表示するテキスト等' },
                         { name:'sx',       type:'object',    desc:'スタイルの上書き' },
                     ]}/>
              <Code>{`<S sx={{color:'gray'}}>補足テキスト</S>`}</Code>
            </Section>

          </Section>

          <Section title="リンク" num="3.">

            <Section title="LinkReactRouter" lev="5" num="a)">
              <Props rows={[
                         { name:'href',     type:'string',        desc:'遷移先のパス(react-router-domで解決)' },
                         { name:'children', type:'ReactNode',     desc:'リンクのテキスト' },
                         { name:'style',    type:'object',        desc:'スタイルの上書き' },
                         { name:'onClick',  type:'(e) => void',   desc:'クリック時のコールバック' },
                     ]}/>
              <Code>{`<LinkReactRouter href="/about">About</LinkReactRouter>`}</Code>
            </Section>

            <Section title="LinkRR" lev="5" num="b)">
              <Props rows={[
                         { name:'(props)', type:'-', desc:'LinkReactRouter の別名。propsも同一' },
                     ]}/>
              <Code>{`<LinkRR href="/about">About</LinkRR>`}</Code>
            </Section>

            <Section title="LinkOutSite" lev="5" num="c)">
              <Props rows={[
                         { name:'href',     type:'string',      desc:'外部サイトのURL' },
                         { name:'children', type:'ReactNode',   desc:'リンクのテキスト(省略時は href がそのまま表示される)' },
                         { name:'style',    type:'object',      desc:'スタイルの上書き' },
                         { name:'onClick',  type:'(e) => void', desc:'クリック時のコールバック' },
                     ]}/>
              <Code>{`<LinkOutSite href="https://example.com">Example</LinkOutSite>`}</Code>
            </Section>

            <Section title="LinkOS" lev="5" num="d)">
              <Props rows={[
                         { name:'(props)', type:'-', desc:'LinkOutSite の別名。propsも同一' },
                     ]}/>
              <Code>{`<LinkOS href="https://example.com">Example</LinkOS>`}</Code>
            </Section>

          </Section>

          <Section title="他" num="4.">

            <Section title="Tabs" lev="5" num="a)">
              <Props rows={[
                         { name:'data',     type:'{selected, list:[{code,label}]}', desc:'タブの状態' },
                         { name:'onChange', type:'(newData) => void',               desc:'タブ切り替え時に呼ばれるコールバック' },
                     ]}/>
              <Code>{`<Tabs data={tabs} onChange={setTabs}/>`}</Code>
            </Section>

            <Section title="Table" lev="5" num="b)">
              <Props rows={[
                         { name:'columns', type:'[{code, label, key|val, sx}]',         desc:'列定義。値は key(行のプロパティ名) か val(row=>値の関数)で指定' },
                         { name:'rows',    type:'[object]',                             desc:'行データ' },
                         { name:'ids',     type:'{column:(col,i)=>key, row:(row,i)=>key}', desc:'React key を生成する関数' },
                     ]}/>
              <Code>{`<Table columns={[
    { code:'a', label:'A', key:'a' },
    { code:'b', label:'B', val:(row)=> row.b*2 },
]}
       rows={[{a:1, b:2}]}
       ids={{column:(c,i)=>i, row:(r,i)=>i}}/>`}</Code>
            </Section>

            <Section title="GithubCorners" lev="5" num="c)">
              <Props rows={[
                         { name:'(なし)', type:'-', desc:'propsは使用しない。画面右上に固定URLへのGitHubリボンを表示する' },
                     ]}/>
              <Code>{`<GithubCorners/>`}</Code>
            </Section>

          </Section>

        </Container>
    );
}
