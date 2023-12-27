import * as React from 'react';

import MaterialLink from '@mui/material/Link';

export default function LinkOutSite (props) {
    const href = props.href;
    const children = props.children;
    const style = props.style || {};

    const style_org = {
        color: 'rgba(0, 0, 0, 0.87)',
        textDecorationStyle: 'dotted',
        textDecorationColor: 'rgba(188, 188, 188, 0.88)',
        textDecorationThickness: '0.05em',
    };

    return (
        <MaterialLink href={href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                          ...style_org,
                          ...style,
                      }}>
          {children || href}
        </MaterialLink>
    );
}
