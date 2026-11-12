import * as React from 'react';

import Box from '@mui/material/Box';

// LI の中にいるかどうか。LI の中に置いた UL・OL は、入れ子用の余白にする。
// CSS の子孫セレクタではなく context で伝えるのは、UL・OL 自身の sx を
// 入れ子用の既定値より優先させるため(セレクタだと親の LI の規則が勝ってしまう)。
const NestedContext = React.createContext(false);

// sx はオブジェクトでも配列でもよいので、配列にそろえて既定値の後ろに重ねる。
function overlay (base, sx) {
    return [base, ...(Array.isArray(sx) ? sx : [sx])];
}

function listSx (nested) {
    return {
        m: 0,
        mb: 1,
        pl: 3,
        typography: 'body1',
        ...(nested ? {mt: 0.5, mb: 0} : {}),
    };
}

export function UL (props) {
    const nested = React.useContext(NestedContext);

    return (
        <Box component="ul" sx={overlay(listSx(nested), props.sx)}>
          {props.children}
        </Box>
    );
}

export function OL (props) {
    const nested = React.useContext(NestedContext);

    return (
        <Box component="ol" start={props.start} sx={overlay(listSx(nested), props.sx)}>
          {props.children}
        </Box>
    );
}

export function LI (props) {
    return (
        <Box component="li" sx={overlay({mb: 0.5}, props.sx)}>
          <NestedContext.Provider value={true}>
            {props.children}
          </NestedContext.Provider>
        </Box>
    );
}
