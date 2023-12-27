import React from 'react';

import Container from '@mui/material/Container';

import {H} from '../lib/index.js';

import Showcase from '../assemblies/Showcase.js';
import Plate from '../assemblies/Plate.js';

export default function Showcases (props) {
    return (
        <Container maxWidth="xl" sx={{pt:8}}>

          <Showcase title="Structure">
            <Plate title="Section"/>
            <Plate title="H"/>
            <Plate title="P"/>
            <Plate title="S"/>
          </Showcase>

          <Showcase title="Link">
            <Plate title="LinkOutSite"/>
            <Plate title="LinkReactRouter"/>
          </Showcase>

          <Showcase title="Table">
            <Plate title="Table"/>
          </Showcase>

          <Showcase title="Tabs">
            <Plate title="Tabs"/>
          </Showcase>

          <Showcase title="Others">
            <Plate title="GithubCorners"/>
          </Showcase>

        </Container>
    );
}
