import * as React from 'react';

import Typography from '@mui/material/Typography';

export default function H (props) {
    const level = props.lev || 4;
    const children = props.children;

    return (
        <Typography variant={"h"+level}>
          {children}
        </Typography>
    );
}

const x ={
    1: { pl: 7, mr: 36 },
    2: { pl: 6, mr: 28 },
    3: { pl: 5, mr: 22 },
    4: { pl: 4, mr: 11 },
    5: { pl: 3, mr:  8 },
    6: { pl: 2, mr:  6 },
};
