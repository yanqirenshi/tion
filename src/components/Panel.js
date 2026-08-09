import * as React from 'react';

import Box from '@mui/material/Box';

const sx_org = {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: 1,
    p: 2,
};

export default function Panel (props) {
    const children = props.children;
    const sx = props.sx || {};

    return (
        <Box sx={{...sx_org, ...sx}}>
          {children}
        </Box>
    );
}
