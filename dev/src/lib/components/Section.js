import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {headingProps} from './heading.js';

export default function Section (props) {
    const title = props.title;
    const number = props.num;
    const children = props.children;
    const sx = props.sx || {};

    const heading = headingProps(props.lev);

    const {pl, mr} = indent(heading.level);

    return (
        <Box sx={{...{p:1}, ...sx}}>
          <Box>
            <Typography variant={heading.variant}
                        component={heading.component}
                        data-lev={heading.level}
                        sx={heading.sx}>
              {number && (
                  <span style={{marginRight:mr}}>
                    {number}
                  </span>
              )}

              {title}
            </Typography>
          </Box>

          <Box sx={{p:1, pl:pl}}>
            {children}
          </Box>
        </Box>
    );
}

const INDENTS = {
    1: { pl: 7, mr: 36 },
    2: { pl: 6, mr: 28 },
    3: { pl: 5, mr: 22 },
    4: { pl: 4, mr: 11 },
    5: { pl: 3, mr:  8 },
    6: { pl: 2, mr:  6 },
};

const INDENT_DEEP = { pl: 1, mr: 4 };

function indent (level) {
    return INDENTS[level] || INDENT_DEEP;
}
