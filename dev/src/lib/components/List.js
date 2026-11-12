import * as React from 'react';

import Box from '@mui/material/Box';

// LI の中にいるかどうか。LI の中に置いた UL・OL は、入れ子用の余白にする。
// CSS の子孫セレクタではなく context で伝えるのは、UL・OL 自身の sx を
// 入れ子用の既定値より優先させるため(セレクタだと親の LI の規則が勝ってしまう)。
const NestedContext = React.createContext(false);

// UL・OL の入れ子の深さ(一番外側が 1。外側にある UL と OL を区別せずに数える)。
// UL・OL が自分の深さを子孫に渡す。LI は深さを変えない。
const DepthContext = React.createContext(0);

// sx はオブジェクトでも配列でもよいので、配列にそろえて既定値の後ろに重ねる。
function overlay (base, sx) {
    return [base, ...(Array.isArray(sx) ? sx : [sx])];
}

// 記号と番号の種類。ブラウザの既定のスタイルシートと同じ規則にする。
// Bulma などの CSS のリセット(ul { list-style: none; } など)で記号が消えないよう、
// 既定のままにせず明示する。
function markerOf (tag, depth) {
    if (tag==='ol')
        return 'decimal';

    if (depth===1)
        return 'disc';

    if (depth===2)
        return 'circle';

    return 'square';
}

function listSx (tag, depth, nested) {
    return {
        m: 0,
        mb: 1,
        pl: 3,
        typography: 'body1',
        listStyleType: markerOf(tag, depth),
        // 記号を行の外に出す(2 行目以降が本文の頭にそろう字下げの前提)。リセットで消されやすいので明示する。
        listStylePosition: 'outside',
        ...(nested ? {mt: 0.5, mb: 0} : {}),
    };
}

function List (props) {
    const nested = React.useContext(NestedContext);
    const depth = React.useContext(DepthContext) + 1;

    return (
        <Box component={props.tag}
             start={props.start}
             sx={overlay(listSx(props.tag, depth, nested), props.sx)}>
          <DepthContext.Provider value={depth}>
            {props.children}
          </DepthContext.Provider>
        </Box>
    );
}

export function UL (props) {
    return (
        <List tag="ul" sx={props.sx}>
          {props.children}
        </List>
    );
}

export function OL (props) {
    return (
        <List tag="ol" start={props.start} sx={props.sx}>
          {props.children}
        </List>
    );
}

export function LI (props) {
    return (
        // li { display: block } などのリセットで記号が消えないよう、display を明示する。
        <Box component="li" sx={overlay({display: 'list-item', mb: 0.5}, props.sx)}>
          <NestedContext.Provider value={true}>
            {props.children}
          </NestedContext.Provider>
        </Box>
    );
}
