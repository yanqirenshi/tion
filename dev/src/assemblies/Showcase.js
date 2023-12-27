import React from 'react';

import Box from '@mui/material/Box';

import {H} from '../lib/index.js';

import Board from './Board.js';

export default function Showcase (props) {
    const title = props.title;
    const children = props.children;

    return (
        <Box sx={{p:2, m:1}}>
          <H>{title}</H>

            <Board>
              {children}
            </Board>
        </Box>
    );
}
