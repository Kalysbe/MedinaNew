import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const styles = {
  printOnly: {
    display: 'none',
    '@media print': {
      display: 'block'
    }
  }
};

const useStyles = makeStyles(styles);

export default function Report1(props) {
    const {data, emitent} = props
    const classes = useStyles();
    
  return (
  <>
    <h3 className={classes.printOnly}>{emitent}</h3>
    <h3 className={classes.printOnly}> Ресстр владельцев именных ценных бумаг</h3>
            {data && (
              <Table >
                <TableHead style={{ display: 'table-header-group' }}>
                  <TableRow>
                    <TableCell>№2</TableCell>
                    <TableCell>Счет</TableCell>
                    <TableCell>Наименование</TableCell>
                    <TableCell>Простых</TableCell>
                    <TableCell>Номинал простых</TableCell>
                    <TableCell>% от кол-во</TableCell>
                    <TableCell>Паспорт</TableCell>
                    <TableCell>Адрес проживания</TableCell>
                    <TableCell>Регион</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {item.id}
                      </TableCell>
                      <TableCell>
                        <b>{item.name}</b>
                      </TableCell>
                      <TableCell>
                        {window.formatNumber(item.ordinary)}
                      </TableCell>
                      <TableCell>
                        {window.formatNumber(item.ordinary_nominal)}
                      </TableCell>
                      <TableCell>
                        {item.percentage} %
                      </TableCell>
                      <TableCell>
                        {item.passport} 
                      </TableCell>
                      <TableCell>
                        {item.actual_address} 
                      </TableCell>
                      <TableCell>
                        {item.district.name} 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
  </>
  );
}
