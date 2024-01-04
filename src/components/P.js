import * as React from 'react';

import Box from '@mui/material/Box';

export default function P (props) {
    const children = props.children;

    return (
        <Box>
          {children}
        </Box>
    );
}
