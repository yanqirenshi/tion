import * as React from 'react';

import Container from '@mui/material/Container';

import {Wall, Frame, Section, Table, Tabs} from './lib/index.js';

import Showcases from './panels/Showcases.js';
import Example from './panels/Example.js';

export default function App (props) {
    const [tabs, setTabs] = React.useState({
        selected: 'masonry',
        list: [
            { code: 'example',  label:'Example' },
            { code: 'showcase', label:'Showcase' },
        ],
    });

    return (
        <Wall>
          <Frame>
            <Tabs data={tabs}
                  onChange={v=> setTabs(v)}/>

              {'example' ===tabs.selected && <Example/>}
              {'showcase'===tabs.selected && <Showcases/>}

          </Frame>
        </Wall>
    );
}
