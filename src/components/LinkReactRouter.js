import * as React from 'react';

import {Link as RrLink} from "react-router-dom";

export default function LinkReactRouter (props) {
    const href = props.href;
    const children = props.children;
    const style = props.style;
    const onClick = props.onClick;

    const style_org = {
        color: 'rgba(0, 0, 0, 0.87)',
        textDecorationStyle: 'dotted',
        textDecorationColor: 'rgba(188, 188, 188, 0.88)',
        textDecorationThickness: '0.05em',
    };

    return (
        <RrLink to={href}
                style={{
                    ...style_org,
                    ...style,
                }}
                onClick={onClick}>
          {children}
        </RrLink>
    );
}
