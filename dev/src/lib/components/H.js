import * as React from 'react';

import Typography from '@mui/material/Typography';

export default function H (props) {
    const level = props.lev || 4;
    const children = props.children;
    const sx = props.sx;

    return (
        <Typography variant={"h"+level} sx={sx}>
          {children}
        </Typography>
    );
}
