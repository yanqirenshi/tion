import React from 'react';

import Container from '@mui/material/Container';

import {Section, Table} from '../lib/index.js';

export default function Exsample (props) {
    return (
        <Container maxWidth="md" sx={{pt:8}}>

          <Section title="title A" num="1.">
            <p>Contents....</p>
            <p>Contents....</p>
            <p>Contents....</p>
            <p>Contents....</p>
            <p>Contents....</p>

            <Section title="title A" lev="5" num="a)">
              <p>Contents....</p>
              <Table columns={columns}
                     rows={rows}
                     ids={{column: (col,i)=> i, row: (row,i)=> i}}
                     sx={{
                         head: {
                             background:'#f2f2b0',
                             row: {},
                         },
                         body: {
                             row: {},
                         },
                     }}/>
            </Section>

          </Section>

        </Container>
    );
}

const columns = [
    { code: 'a', label: 'A',  key: 'a' },
    { code: 'b', label: 'B',  val: (row)=> row.b },
    { code: 'c', label: 'C',  val: (row)=> row.b * row.c },
];

const rows = [
    { a:  1, b:  2, c:  3 },
    { a:  6, b:  7, c:  8 },
    { a: 11, b: 12, c: 13 },
];
