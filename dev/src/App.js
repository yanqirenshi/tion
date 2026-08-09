import * as React from 'react';

import Container from '@mui/material/Container';

import {Wall, Frame, Section, Table, TabsRR} from './lib/index.js';

import Showcases from './panels/Showcases.js';
import Example from './panels/Example.js';
import Components from './panels/Components.js';

export default function App (props) {
    const [tabs, setTabs] = React.useState({
        selected: null,
        list: [
            { code: 'example',    label:'Example' },
            { code: 'showcase',   label:'Showcase' },
            { code: 'components', label:'Components' },
        ],
    });

    return (
        <Wall>
          <Frame>
            <TabsRR data={tabs}
                    onChange={v=> setTabs(v)}/>

              {'example'   ===tabs.selected && <Example/>}
              {'showcase'  ===tabs.selected && <Showcases/>}
              {'components'===tabs.selected && <Components/>}

          </Frame>
        </Wall>
    );
}
