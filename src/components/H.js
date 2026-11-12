import * as React from 'react';

import Typography from '@mui/material/Typography';

import {headingProps} from './heading.js';

export default function H (props) {
    const children = props.children;
    const sx = props.sx;

    const heading = headingProps(props.lev);

    const sx_all = heading.sx
          ? [heading.sx, ...(Array.isArray(sx) ? sx : [sx])]
          : sx;

    return (
        <Typography variant={heading.variant}
                    component={heading.component}
                    data-lev={heading.level}
                    sx={sx_all}>
          {children}
        </Typography>
    );
}
