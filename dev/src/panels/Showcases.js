import React from 'react';

import Container from '@mui/material/Container';

import {
    H, P, S, Section,
    LinkOutSite, LinkReactRouter,
    Table, Tabs,
    GithubCorners,
} from '../lib/index.js';

import Showcase from '../assemblies/Showcase.js';
import Plate from '../assemblies/Plate.js';

export default function Showcases (props) {
    return (
        <Container maxWidth="xl" sx={{pt:8}}>

          <Showcase title="Structure">
            <Plate title="Section"><Section/></Plate>
            <Plate title="H"><H/></Plate>
            <Plate title="P"><P/></Plate>
            <Plate title="S"><S/></Plate>
          </Showcase>

          <Showcase title="Link">
            <Plate title="LinkOutSite"><LinkOutSite href=""/></Plate>
            <Plate title="LinkReactRouter"><LinkReactRouter href=""/></Plate>
          </Showcase>

          <Showcase title="Table">
            <Plate title="Table"><Table columns={[]} rows={[]} ids={{}}/></Plate>
          </Showcase>

          <Showcase title="Tabs">
            <Plate title="Tabs"><Tabs data={{list:[]}}/></Plate>
          </Showcase>

          <Showcase title="Others">
            <Plate title="GithubCorners"><GithubCorners/></Plate>
          </Showcase>

        </Container>
    );
}
