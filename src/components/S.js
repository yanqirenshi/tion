import * as React from 'react';

import Typography from '@mui/material/Typography';

export default function S (props) {
    const children = props.children;

    return (
        <Typography>
          {children}
        </Typography>
    );
}
