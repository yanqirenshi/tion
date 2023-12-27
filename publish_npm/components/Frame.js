import * as React from 'react';

import Box from '@mui/material/Box';

const sx = {
    maxWidth: '100vw',
    height: '100vh',
};

export default function Frame (props) {
    const children = props.children;

    return (
        <Box sx={sx}>
          {children}
        </Box>
    );
}
