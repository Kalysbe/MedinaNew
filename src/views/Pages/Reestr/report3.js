import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { NavLink } from "react-router-dom";

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
  <h3 className={classes.printOnly}> Ресстр владельцев именных ценных бумаг по номерам выпуска акций</h3>
            {data && (
              <Table >
                <TableHead style={{ display: 'table-header-group' }}>
                  <TableRow>
                    <TableCell>№3</TableCell>
                    <TableCell>Счет</TableCell>
                    <TableCell>Наименование</TableCell>
                    <TableCell>Номер эмиссии</TableCell>
                    <TableCell>Простых</TableCell>
                    <TableCell>Номинал простых</TableCell>
                    <TableCell>% от кол-во</TableCell>
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
                      <NavLink to={`holder/${item.id}`}>{item.name}</NavLink>
                      </TableCell>
                      <TableCell>
                       {item.reg_number}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
  </>
  );
}
