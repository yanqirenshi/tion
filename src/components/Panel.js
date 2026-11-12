import * as React from 'react';

import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

const sx_org = {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: 1,
    p: 2,
};

// kind ごとの色。background は背景、border は枠、icon はアイコンの色。
const KINDS = {
    info:    { background: '#e9f2ff', border: '#cce0ff', icon: '#1d7afc' },
    note:    { background: '#f3f0ff', border: '#dfd8fd', icon: '#8f7ee7' },
    warning: { background: '#fff7d6', border: '#f8e6a0', icon: '#b38600' },
    success: { background: '#dcfff1', border: '#baf3db', icon: '#22a06b' },
    error:   { background: '#ffeceb', border: '#ffd5d2', icon: '#e2483d' },
};

// kind の既定アイコン。MUI の SvgIcon と単純な図形(circle・path・line)で描く。
// 線の色は currentColor(SvgIcon の color)、塗りは無し。
function Strokes (props) {
    return (
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {props.children}
        </g>
    );
}

const ICONS = {
    // 丸の中に i
    info: (
        <Strokes>
          <circle cx="12" cy="12" r="9"/>
          <line x1="12" y1="11" x2="12" y2="16.5"/>
          <line x1="12" y1="7.8" x2="12" y2="7.9"/>
        </Strokes>
    ),
    // 紙(右上が折れている)とメモの行
    note: (
        <Strokes>
          <path d="M6 3.5 H14 L18 7.5 V20.5 H6 Z"/>
          <path d="M14 3.5 V7.5 H18"/>
          <line x1="9" y1="12" x2="15" y2="12"/>
          <line x1="9" y1="16" x2="15" y2="16"/>
        </Strokes>
    ),
    // 三角の中に !
    warning: (
        <Strokes>
          <path d="M12 3.5 L21.5 20 H2.5 Z"/>
          <line x1="12" y1="9.8" x2="12" y2="14.5"/>
          <line x1="12" y1="17.2" x2="12" y2="17.3"/>
        </Strokes>
    ),
    // 丸の中にチェック
    success: (
        <Strokes>
          <circle cx="12" cy="12" r="9"/>
          <path d="M8 12.5 L11 15.5 L16.5 9"/>
        </Strokes>
    ),
    // 丸の中に ×
    error: (
        <Strokes>
          <circle cx="12" cy="12" r="9"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
        </Strokes>
    ),
};

// 知らない kind(例: "foo"、"constructor")は、kind なしと同じにする。
function findKind (kind) {
    return typeof kind === 'string' && Object.prototype.hasOwnProperty.call(KINDS, kind) ? kind : null;
}

// icon: 未指定(または true)は既定のアイコン。false と null は出さない。それ以外(ReactNode)は既定の代わりにそれを出す。
function iconOf (kind, icon) {
    if (icon === false || icon === null)
        return null;

    if (icon === undefined || icon === true)
        return (
            <SvgIcon aria-hidden="true" sx={{fontSize: '20px', color: KINDS[kind].icon}}>
              {ICONS[kind]}
            </SvgIcon>
        );

    return icon;
}

export default function Panel (props) {
    const children = props.children;
    const sx = props.sx || {};
    const kind = findKind(props.kind);

    // kind なし: これまでと同じ DOM と見た目。
    if (!kind)
        return (
            <Box sx={{...sx_org, ...sx}}>
              {children}
            </Box>
        );

    const colors = {
        backgroundColor: KINDS[kind].background,
        borderColor: KINDS[kind].border,
    };

    const icon = iconOf(kind, props.icon);

    // icon={false}: 色だけ変え、flex もアイコンの枠も付けない。
    if (icon === null)
        return (
            <Box sx={{...sx_org, ...colors, ...sx}}>
              {children}
            </Box>
        );

    return (
        <Box sx={{...sx_org, ...colors, display: 'flex', gap: 1.5, alignItems: 'flex-start', ...sx}}>
          {/* 高さを本文の 1 行分(line-height 1.5)にして中央に置き、アイコンを本文の 1 行目にそろえる */}
          <Box sx={{display: 'flex', alignItems: 'center', height: '1.5em', flexShrink: 0}}>
            {icon}
          </Box>
          <Box sx={{flex: 1, minWidth: 0}}>
            {children}
          </Box>
        </Box>
    );
}
