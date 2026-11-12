import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ブラウザ既定の <figure> の左右 40px の余白を消し、上下だけ空ける
const sx_org = {
    m: 0,
    mt: 2,
    mb: 2,
};

// 元の大きさで表示し、画面が狭いときだけ縮める(小さい画像を引き伸ばさない)
const sx_img_org = {
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
};

export default function Figure (props) {
    const src = props.src;
    const alt = props.alt;
    const caption = props.caption;
    const width = props.width;
    const sx = props.sx || {};

    const has_caption = !(caption===undefined || caption===null
                          || caption===false || caption==='');

    // sx の width は 1 以下の数値を割合(%)として扱うので、数値は px の文字列にする
    const sx_img = width===undefined || width===null
          ? sx_img_org
          : {...sx_img_org, width: typeof width==='number' ? `${width}px` : width};

    return (
        <Box component="figure" sx={{...sx_org, ...sx}}>
          <Box component="img" src={src} alt={alt} sx={sx_img}/>

          {has_caption && (
              <Typography component="figcaption"
                          variant="body2"
                          sx={{color:'text.secondary', mt:1}}>
                {caption}
              </Typography>
          )}
        </Box>
    );
}
