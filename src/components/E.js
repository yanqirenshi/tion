import * as React from 'react';

import Box from '@mui/material/Box';

// 色の名前 → MUI のテーマのパレット(ThemeProvider で変えれば、E の色も変わる)
const COLORS = {
    emphasis: 'primary.main',
    caution:  'error.main',
};

function colorOf (color) {
    if (color===undefined || color===null || color==='')
        return null;

    // 名前以外の値('#c00' や 'text.secondary' など)は、そのまま sx の color に渡す
    if (typeof color==='string' && Object.prototype.hasOwnProperty.call(COLORS, color))
        return COLORS[color];

    return color;
}

// 文の途中に置ける強調(インライン)。display は指定しない。
export default function E (props) {
    const bold = props.bold===undefined ? true : Boolean(props.bold);
    const underline = Boolean(props.underline);
    const color = colorOf(props.color);
    const children = props.children;
    const sx = props.sx || {};

    const sx_org = {};

    if (bold)
        sx_org.fontWeight = 'bold';

    if (underline) {
        sx_org.textDecoration = 'underline';
        sx_org.textUnderlineOffset = '0.2em';
    }

    if (color!==null)
        sx_org.color = color;

    return (
        <Box component={bold ? 'strong' : 'span'} sx={{...sx_org, ...sx}}>
          {children}
        </Box>
    );
}
