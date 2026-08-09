import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

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

const CATEGORIES = [
    {
        title: 'レイアウト(画面)',
        items: [
            {
                name: 'Wall',
                props: [
                    { name:'children', type:'ReactNode', desc:'画面いっぱい(100vw x 100vh)に表示する内容' },
                ],
                code: `<Wall>
  <Frame>...</Frame>
</Wall>`,
            },
            {
                name: 'Frame',
                props: [
                    { name:'children', type:'ReactNode', desc:'親要素いっぱい(100% x 100%)に表示する内容' },
                ],
                code: `<Frame>
  <Tabs data={tabs} onChange={setTabs}/>
</Frame>`,
            },
            {
                name: 'FrameTabs',
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
        ],
    },
    {
        title: 'レイアウト(文章)',
        items: [
            {
                name: 'Section',
                props: [
                    { name:'title',    type:'string',            desc:'セクションのタイトル' },
                    { name:'lev',      type:'number (既定値: 4)', desc:'見出しレベル(h1〜h6)。インデント幅もこの値で変わる' },
                    { name:'num',      type:'string',            desc:'セクション番号(例: "1." "a)")。省略可' },
                    { name:'children', type:'ReactNode',         desc:'セクション本文。ネストして子セクションも置ける' },
                    { name:'sx',       type:'object',            desc:'スタイルの上書き' },
                ],
                code: `<Section title="はじめに" num="1.">
  <P>本文...</P>

  <Section title="詳細" lev="5" num="a)">
    <P>ネストした子セクション</P>
  </Section>
</Section>`,
            },
            {
                name: 'H',
                props: [
                    { name:'lev',      type:'number (既定値: 4)', desc:'見出しレベル(h1〜h6相当)' },
                    { name:'children', type:'ReactNode',         desc:'見出しテキスト' },
                    { name:'sx',       type:'object',            desc:'スタイルの上書き' },
                ],
                code: `<H lev={2}>見出し</H>`,
            },
            {
                name: 'P',
                props: [
                    { name:'children', type:'ReactNode', desc:'段落の内容' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き(既定で mb:1 が付与される)' },
                ],
                code: `<P>段落のテキスト</P>`,
            },
            {
                name: 'S',
                props: [
                    { name:'children', type:'ReactNode', desc:'表示するテキスト等' },
                    { name:'sx',       type:'object',    desc:'スタイルの上書き' },
                ],
                code: `<S sx={{color:'gray'}}>補足テキスト</S>`,
            },
        ],
    },
    {
        title: 'リンク',
        items: [
            {
                name: 'LinkReactRouter',
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
                props: [
                    { name:'(props)', type:'-', desc:'LinkReactRouter の別名。propsも同一' },
                ],
                code: `<LinkRR href="/about">About</LinkRR>`,
            },
            {
                name: 'LinkOutSite',
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
                props: [
                    { name:'(props)', type:'-', desc:'LinkOutSite の別名。propsも同一' },
                ],
                code: `<LinkOS href="https://example.com">Example</LinkOS>`,
            },
        ],
    },
    {
        title: '他',
        items: [
            {
                name: 'Tabs',
                props: [
                    { name:'data',     type:'{selected, list:[{code,label}]}', desc:'タブの状態' },
                    { name:'onChange', type:'(newData) => void',               desc:'タブ切り替え時に呼ばれるコールバック' },
                ],
                code: `<Tabs data={tabs} onChange={setTabs}/>`,
            },
            {
                name: 'Table',
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
                  <Props rows={current.props}/>
                  <Code>{current.code}</Code>
                </Section>
            )}
          </Box>

        </Box>
    );
}
