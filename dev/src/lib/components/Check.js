import * as React from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

// sx はオブジェクトでも配列でもよいので、配列にそろえて既定値の後ろに重ねる。
function overlay (base, sx) {
    return [base, ...(Array.isArray(sx) ? sx : [sx])];
}

// チェック項目。左に Checkbox、右に title(太字)と、その下に説明(children)を置く。
//   onChange あり: 操作できる(制御されたコンポーネント。checked は親が持つ)。
//   onChange なし: 表示だけ。クリックしても変わらない。
export default function Check (props) {
    const {title, children, onChange} = props;
    const sx = props.sx;
    const checked = Boolean(props.checked);
    const interactive = typeof onChange === 'function';

    const id = React.useId();
    const hasDescription = React.Children.toArray(children).length > 0;

    // 表示だけのときは、input に aria-readonly="true" を付ける(disabled にすると色が薄くなって読みにくい)。
    // MUI の Checkbox は、input に属性を渡す props が版で違う(5〜7 は inputProps、9 は slotProps.input)。
    // 版ごとに props を出し分けると、合わない版では DOM への未知の prop として警告になるので、
    // 外側の Box から input を探して付ける。
    const boxRef = React.useRef(null);
    React.useEffect(() => {
        const input = boxRef.current ? boxRef.current.querySelector('input') : null;
        if (!input)
            return;
        if (interactive)
            input.removeAttribute('aria-readonly');
        else
            input.setAttribute('aria-readonly', 'true');
    }, [interactive]);

    // MUI は (event, checked) で呼ぶ。tion は (checked, event) の順にする。
    const handleChange = interactive
          ? (event) => onChange(event.target.checked, event)
          : undefined;

    return (
        <Box ref={boxRef}
             sx={overlay({display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5}, sx)}>
          {/* 高さを title の 1 行分(line-height 1.5)にして中央に置き、Checkbox を title の 1 行目にそろえる */}
          <Box sx={{display: 'flex', alignItems: 'center', height: '1.5em', flexShrink: 0}}>
            <Checkbox id={id}
                      size="small"
                      checked={checked}
                      onChange={handleChange}
                      disableRipple={!interactive}
                      sx={{p: 0, ...(interactive ? {} : {cursor: 'default'})}}/>
          </Box>
          <Box sx={{flex: 1, minWidth: 0}}>
            <Typography component="label"
                        htmlFor={id}
                        variant="body1"
                        sx={{display: 'block', fontWeight: 'bold'}}>
              {title}
            </Typography>
            {hasDescription && (
                <Box sx={{mt: 0.5, typography: 'body1'}}>
                  {children}
                </Box>
            )}
          </Box>
        </Box>
    );
}
