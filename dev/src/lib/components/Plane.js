import * as React from 'react';

import Box from '@mui/material/Box';

// 整形済みテキスト(<pre>)用の既定スタイル
const sx_org = {
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    background: '#f5f5f5',
    borderRadius: 1,
    p: 1,
    m: 0,
    overflowX: 'auto',
};

export default function Plane (props) {
    const children = props.children;
    const sx = props.sx || {};

    return (
        <Box component="pre" sx={{...sx_org, ...sx}}>
          {children}
        </Box>
    );
}
