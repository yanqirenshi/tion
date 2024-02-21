import * as React from 'react';

import MuiTable from '@mui/material/Table';
import Body from '@mui/material/TableBody';
import Cell from '@mui/material/TableCell';
import Container from '@mui/material/TableContainer';
import Head from '@mui/material/TableHead';
import Row from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

export default function Table (props) {
    const columns = props.columns || [];
    const rows = props.rows || [];
    const ids = props.ids;

    const id_col = ids.column || null;
    const id_row = ids.column || null;

    return (
        <Container component={Paper}>
          <MuiTable sx={{ minWidth: 650 }}
                    size="small">

            <Head>
              <Row>
                {columns.map((column,i)=> {
                    return (
                        <Cell key={id_col ? id_col(column, i) : i}
                              align="center">
                          {column.label}
                        </Cell>
                    );
                })}
              </Row>
            </Head>

            <Body>
              {rows.map((row, i) => (
                  <Row key={id_row ? id_col(row, i) : i}
                       sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    {columns.map((column,i)=> {
                        return (
                            <Cell key={i} sx={column.sx}>
                              {value(column, row)}
                            </Cell>
                        );
                    })}
                  </Row>
              ))}
            </Body>

          </MuiTable>
        </Container>
    );
}

function value (column, row) {
    if (column.key)
        return row[column.key];

    if (column.val)
        return column.val(row);

    return null;
}
