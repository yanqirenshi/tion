import * as React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

export default function Section (props) {
    const title = props.title;
    const level = props.lev || 4;
    const number = props.num;
    const children = props.children;

    const pl = x[level].pl;
    const mr = x[level].mr;

    return (
        <Box sx={{p:1}}>
          <Box>
            <S variant={"h"+level} sx={{}}>
              {number && (
                  <span style={{marginRight:mr}}>
                    {number}
                  </span>
              )}

              {title}
            </S>
          </Box>

          <Box sx={{p:1, pl:pl}}>
            {children}
          </Box>
        </Box>
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
