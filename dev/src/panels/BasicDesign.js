import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MuiTypography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import {Section, Table, S, P, GithubCorners} from '../lib/index.js';

const COLORS = [
    { name:'primary',          hex:'#1976d2',              desc:'主要なアクション・強調に使用' },
    { name:'secondary',        hex:'#9c27b0',              desc:'補助的な強調に使用' },
    { name:'error',            hex:'#d32f2f',              desc:'エラー状態の表示に使用' },
    { name:'warning',          hex:'#ed6c02',              desc:'警告状態の表示に使用' },
    { name:'info',             hex:'#0288d1',              desc:'情報の通知に使用' },
    { name:'success',          hex:'#2e7d32',              desc:'成功状態の表示に使用' },
    { name:'text.primary',     hex:'rgba(0, 0, 0, 0.87)',  desc:'本文などの主要テキスト色' },
    { name:'text.secondary',   hex:'rgba(0, 0, 0, 0.6)',   desc:'補助的なテキスト色' },
    { name:'divider',          hex:'rgba(0, 0, 0, 0.12)',  desc:'区切り線の色' },
    { name:'background.paper', hex:'#ffffff',              desc:'Card / Paper など表面の背景色' },
];

function ColorSection (props) {
    return (
        <Section title="カラー">
          <P>MUIの既定パレットをそのまま使用しています(tion独自のテーマ定義はありません)。</P>
          <Table columns={[
                     { code:'swatch', label:'',    val:(row)=> (
                         <Box sx={{width:24, height:24, borderRadius:'4px', border:'1px solid rgba(0,0,0,0.12)', background:row.hex}}/>
                     ) },
                     { code:'name', label:'名前', key:'name' },
                     { code:'hex',  label:'値',   key:'hex' },
                     { code:'desc', label:'説明', key:'desc' },
                 ]}
                 rows={COLORS}
                 ids={{column:(c,i)=>i, row:(r,i)=>i}}/>
        </Section>
    );
}

const TYPOGRAPHY = [
    { variant:'h1',        size:'6rem' },
    { variant:'h2',        size:'3.75rem' },
    { variant:'h3',        size:'3rem' },
    { variant:'h4',        size:'2.125rem' },
    { variant:'h5',        size:'1.5rem' },
    { variant:'h6',        size:'1.25rem' },
    { variant:'subtitle1', size:'1rem' },
    { variant:'subtitle2', size:'0.875rem' },
    { variant:'body1',     size:'1rem' },
    { variant:'body2',     size:'0.875rem' },
    { variant:'button',    size:'0.875rem' },
    { variant:'caption',   size:'0.75rem' },
    { variant:'overline',  size:'0.75rem' },
];

function TypographySection (props) {
    return (
        <Section title="タイポグラフィ">
          <P>MUIの標準タイポグラフィスケールです。tionの <S sx={{display:'inline', fontFamily:'monospace'}}>H</S> は
             <S sx={{display:'inline', fontFamily:'monospace'}}> lev</S>(1〜6)でh1〜h6に、
             <S sx={{display:'inline', fontFamily:'monospace'}}> S</S> / <S sx={{display:'inline', fontFamily:'monospace'}}>P</S> はbody1相当になります。</P>

          {TYPOGRAPHY.map((t)=> (
              <Box key={t.variant} sx={{mb:1}}>
                <MuiTypography variant={t.variant}>{t.variant} ({t.size})</MuiTypography>
              </Box>
          ))}
        </Section>
    );
}

function IconSection (props) {
    return (
        <Section title="アイコン">
          <P>tion には現時点で汎用のIconコンポーネントはありません。GithubCorners がインラインSVGでアイコンを描画している唯一の例です。</P>
          <Box sx={{position:'relative', height:120, border:'1px dashed #ccc', borderRadius:1}}>
            <GithubCorners/>
          </Box>
        </Section>
    );
}

const BREAKPOINTS = [
    { bp:'xs', px:'0px〜' },
    { bp:'sm', px:'600px〜' },
    { bp:'md', px:'900px〜' },
    { bp:'lg', px:'1200px〜' },
    { bp:'xl', px:'1536px〜' },
];

function LayoutSection (props) {
    return (
        <Section title="レイアウト">
          <P>画面全体を覆う Wall(100vw x 100vh) / 親要素いっぱいに広がる Frame(100% x 100%) と、
             Container(maxWidth)による中央寄せの2パターンを基本としています。</P>
          <P>一覧表示にはBoxのflex-wrapによる簡易グリッド(Showcaseパネルの Board)を使用しています。</P>
          <Table columns={[
                     { code:'bp', label:'ブレークポイント', key:'bp' },
                     { code:'px', label:'幅',               key:'px' },
                 ]}
                 rows={BREAKPOINTS}
                 ids={{column:(c,i)=>i, row:(r,i)=>i}}/>
        </Section>
    );
}

const LINK_TEXT_STYLE = [
    { k:'color',                    v:'rgba(0, 0, 0, 0.87)' },
    { k:'textDecorationStyle',      v:'dotted' },
    { k:'textDecorationColor',      v:'rgba(188, 188, 188, 0.88)' },
    { k:'textDecorationThickness',  v:'0.05em' },
];

function LinkTextSection (props) {
    return (
        <Section title="リンクテキスト">
          <P>LinkOutSite / LinkReactRouter に共通する、点線下線のリンクスタイルです。</P>
          <Box sx={{p:2}}>
            <a href="#"
               onClick={(e)=> e.preventDefault()}
               style={{
                   color: 'rgba(0, 0, 0, 0.87)',
                   textDecorationStyle: 'dotted',
                   textDecorationColor: 'rgba(188, 188, 188, 0.88)',
                   textDecorationThickness: '0.05em',
               }}>
              サンプルリンク
            </a>
          </Box>
          <Table columns={[
                     { code:'k', label:'プロパティ', key:'k' },
                     { code:'v', label:'値',         key:'v' },
                 ]}
                 rows={LINK_TEXT_STYLE}
                 ids={{column:(c,i)=>i, row:(r,i)=>i}}/>
        </Section>
    );
}

const SPACES = [1, 2, 3, 4, 6, 8];

function SpacingSection (props) {
    return (
        <Section title="余白">
          <P>MUIのspacing単位を使用しています(1 = 8px)。tionの P コンポーネントは既定で mb:1(8px) が付与されます。</P>
          {SPACES.map((n)=> (
              <Box key={n} sx={{display:'flex', alignItems:'center', gap:2, mb:1}}>
                <S sx={{width:60}}>{`p: ${n}`}</S>
                <Box sx={{width:n*8, height:16, background:'#1976d2'}}/>
                <S>{n*8}px</S>
              </Box>
          ))}
        </Section>
    );
}

const RADIUSES = [0, 4, 8, 16, '50%'];

function ShapeSection (props) {
    return (
        <Section title="角の形状">
          <P>MUIの既定border-radiusは4px(theme.shape.borderRadius)です。Card / Table などの外枠に使用されています。</P>
          <Box sx={{display:'flex', gap:3, flexWrap:'wrap'}}>
            {RADIUSES.map((r)=> (
                <Box key={r} sx={{textAlign:'center'}}>
                  <Box sx={{width:64, height:64, background:'#1976d2', borderRadius:r}}/>
                  <S sx={{mt:1}}>{String(r)}</S>
                </Box>
            ))}
          </Box>
        </Section>
    );
}

const ELEVATIONS = [0, 1, 2, 4, 8, 16, 24];

function ElevationSection (props) {
    return (
        <Section title="エレベーション">
          <P>MUIのelevation(影)スケールです。Card / Paper などで使用され、既定値は1です(Tableが内部で使用するPaperも同様)。</P>
          <Box sx={{display:'flex', gap:4, flexWrap:'wrap'}}>
            {ELEVATIONS.map((el)=> (
                <Paper key={el}
                       elevation={el}
                       sx={{width:80, height:80, display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <S>{el}</S>
                </Paper>
            ))}
          </Box>
        </Section>
    );
}

const ITEMS = [
    { name:'カラー',           Content: ColorSection },
    { name:'タイポグラフィ',    Content: TypographySection },
    { name:'アイコン',         Content: IconSection },
    { name:'レイアウト',       Content: LayoutSection },
    { name:'リンクテキスト',    Content: LinkTextSection },
    { name:'余白',             Content: SpacingSection },
    { name:'角の形状',         Content: ShapeSection },
    { name:'エレベーション',    Content: ElevationSection },
];

export default function BasicDesign (props) {
    const [selected, setSelected] = React.useState(ITEMS[0].name);

    const current = ITEMS.find((item)=> item.name===selected);
    const Content = current ? current.Content : null;

    return (
        <Box sx={{display:'flex', height:'100%'}}>

          <Box sx={{
              width: 240,
              flexShrink: 0,
              borderRight: '1px solid #e0e0e0',
              overflowY: 'auto',
          }}>
            <List dense disablePadding>
              {ITEMS.map((item)=> (
                  <ListItemButton key={item.name}
                                  selected={item.name===selected}
                                  onClick={()=> setSelected(item.name)}
                                  sx={{pl:4}}>
                    <ListItemText primary={item.name}/>
                  </ListItemButton>
              ))}
            </List>
          </Box>

          <Box sx={{flexGrow:1, p:3, overflowY:'auto'}}>
            {Content && <Content/>}
          </Box>

        </Box>
    );
}
