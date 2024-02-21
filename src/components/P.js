import * as React from 'react';

import Box from '@mui/material/Box';

export default function P (props) {
    const children = props.children;
    const sx = props.sx;

    return (
        <Box sx={{mb:1}} sx={sx}>
          {children}
        </Box>
    );
}
