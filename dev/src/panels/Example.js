import React from 'react';

import Container from '@mui/material/Container';

import {
    Section,
    Table,
    S,
    LinkOS,
    LinkRR,
} from '../lib/index.js';

export default function Exsample (props) {
    return (
        <Container maxWidth="md" sx={{pt:8}}>

          <Section title="title A" num="1.">
            <S>Contents....</S>
            <S>Contents....</S>
            <S>Contents....</S>
            <S>Contents....</S>
            <S>Contents....</S>

            <S>
              <LinkOS href="https://mui.com/material-ui/react-link/"
                      onClick={(e)=>console.log(e)}>
                LinkOS
              </LinkOS>
            </S>

            {/* <S> */}
            {/*   <LinkRR href="/" */}
            {/*           onClick={(e)=>console.log(e)}> */}
            {/*     LinkRR */}
            {/*   </LinkRR> */}
            {/* </S> */}

            <Section title="title A" lev="5" num="a)">
              <S>Contents....</S>
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
