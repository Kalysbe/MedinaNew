import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { NavLink } from "react-router-dom";

import { Typography } from '@material-ui/core';
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
  },
  table: {
    borderCollapse: "collapse", 
    width: "100%",
  },
  tableCell: {
    padding: "4px 8px", 
    fontSize: "0.9rem", 
  },
  tableHeaderCell: {
    padding: "6px 8px",
    fontWeight: "bold",
    backgroundColor: "#f4f4f4", 
    verticalAlign: 'top'
  },
  tableHeaderFont: {
    color: "#000",
    fontWeight: '400',
    fontSize: '16px',
  },
  fontStyle: {
    color: "#000",
    fontSize: '14px',
  },
  
  
};

const useStyles = makeStyles(styles);

export default function Report1(props) {
    const {data, emitent} = props
    const classes = useStyles();

    const totals = data.reduce(
      (acc, item) => {
        acc.ordinary += Number(item.ordinary) || 0;
        acc.ordinary_nominal += item.ordinary_nominal || 0;
        return acc;
      },
      { ordinary: 0, ordinary_nominal: 0 }
    );
    
    
  return (
  <>
    <h3 style={{color: '#000'}} className={classes.printOnly}>{emitent}</h3>
    <Typography variant="h5" component="div"><span style={{color: '#000'}}>Ресстр владельцев именных ценных бумаг</span></Typography>
    <h4 style={{color: '#000'}}>Зарегестрированных на 31/12/2023</h4>
    <h5 style={{color: '#000'}}>Простые именные все категории</h5>
    <h5 style={{color: '#000'}}>Лист: 1</h5>
            {data && (
              <Table className={classes.table}>
                <TableHead style={{ display: 'table-header-group' }}>
                  <TableRow>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>№2</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Счет</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Ф.И.О</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Простых</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Номинал простых</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Привелиг</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Номинал Привелиг</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>% от кол-во</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Паспорт</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Адрес проживания</span></TableCell>
                    <TableCell className={classes.tableHeaderCell}><span className={classes.tableHeaderFont}>Регион</span></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{index + 1}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{item.id}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                      <NavLink to={`holder/${item.id}`}><span className={classes.fontStyle}>{item.name}</span></NavLink>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{window.formatNumber(item.ordinary)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{window.formatNumber(item.ordinary_nominal)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{window.formatNumber(item.privileged)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{window.formatNumber(item.privileged_nominal)}</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{item.percentage}%</span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{item.passport} </span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{item.actual_address} </span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={classes.fontStyle}>{item.district.name} </span>
                      </TableCell>
                    </TableRow>
                  ))}
                   <TableRow>
                <TableCell colSpan={3} style={{ fontWeight: "bold" }} className={classes.tableCell}>
                  Итого
                </TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(totals.ordinary)}</TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(totals.ordinary_nominal)}</TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(totals.privileged)}</TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(totals.privileged_nominal)}</TableCell>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell className={classes.tableCell}></TableCell>
              </TableRow>
                </TableBody>
              </Table>
            )}
  </>
  );
}
