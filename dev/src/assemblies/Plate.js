import React from 'react';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import {H} from '../lib/index.js';

export default function Plate (props) {
    const title = props.title;
    const col_num = props.col_num || 3;

    const m = 11;
    const col_w = 111;
    const w = col_num * col_w + (col_num-1) * (11*2);
    const h = 555;

    return (
        <Card sx={{width:w, height: h, m: m + 'px'}}>
          <Box>
            <H>{title}</H>
          </Box>

          <Box>
          </Box>
        </Card>
    );
}
