import React from 'react';

import Box from '@mui/material/Box';

export default function Board (props) {
    const children = props.children;

    return (
        <Box sx={{display:'flex', flexWrap:'wrap'}}>
          {children}
        </Box>
    );
}
