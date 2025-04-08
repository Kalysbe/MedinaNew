import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { Typography, Button } from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as XLSX from "xlsx";

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
  const { data, emitent } = props;
  const classes = useStyles();

  const totals = data.reduce(
    (acc, item) => {
      acc.ordinary += Number(item.ordinary) || 0;
      acc.ordinary_nominal += item.ordinary_nominal || 0;
      return acc;
    },
    { ordinary: 0, ordinary_nominal: 0 }
  );

  const exportToExcel = () => {
    const wsData = [
      ["№", "Счет", "Ф.И.О", "Простых", "Номинал простых", "Привелиг", "Номинал Привелиг", "% от кол-во", "Паспорт", "Адрес проживания", "Регион"],
      ...data.map((item, index) => [
        index + 1,
        item.id,
        item.name,
        item.ordinary,
        item.ordinary_nominal,
        item.privileged,
        item.privileged_nominal,
        item.percentage + " %",
        item.passport,
        item.actual_address,
        item.district.name
      ]),
      ["Итого", "", "", totals.ordinary, totals.ordinary_nominal, totals.privileged, totals.privileged_nominal, "", "", "", ""]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчет");
    XLSX.writeFile(wb, "report.xlsx");
  };

  return (
    <>
      <h3 style={{color: '#000'}} className={classes.printOnly}>{emitent}</h3>
      <Typography variant="h5" component="div"><span style={{color: '#000'}}>Реестр владельцев именных ценных бумаг</span></Typography>
      <h4 style={{color: '#000'}}>Зарегистрированных на 31/12/2023</h4>
      <h5 style={{color: '#000'}}>Простые именные все категории</h5>
      <h5 style={{color: '#000'}}>Лист: 1</h5>
      <Button variant="contained" color="primary" onClick={exportToExcel} style={{ marginBottom: "10px" }}>
        Скачать Excel
      </Button>
      {data && (
        <Table className={classes.table}>
          <TableHead style={{ display: 'table-header-group' }}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>№</TableCell>
              <TableCell className={classes.tableHeaderCell}>Счет</TableCell>
              <TableCell className={classes.tableHeaderCell}>Ф.И.О</TableCell>
              <TableCell className={classes.tableHeaderCell}>Простых</TableCell>
              <TableCell className={classes.tableHeaderCell}>Номинал простых</TableCell>
              <TableCell className={classes.tableHeaderCell}>Привелиг</TableCell>
              <TableCell className={classes.tableHeaderCell}>Номинал Привелиг</TableCell>
              <TableCell className={classes.tableHeaderCell}>% от кол-во</TableCell>
              <TableCell className={classes.tableHeaderCell}>Паспорт</TableCell>
              <TableCell className={classes.tableHeaderCell}>Адрес проживания</TableCell>
              <TableCell className={classes.tableHeaderCell}>Регион</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className={classes.tableCell}>{index + 1}</TableCell>
                <TableCell className={classes.tableCell}>{item.id}</TableCell>
                <TableCell className={classes.tableCell}><NavLink to={`holder/${item.id}`}>{item.full_name}</NavLink></TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(item.common_quantity)}</TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(item.common_nominal)}</TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(item.preferred_quantity)}</TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(item.preferred_nominal)}</TableCell>
                <TableCell className={classes.tableCell}>{item.percentage}%</TableCell>
                <TableCell className={classes.tableCell}>{item.passport}</TableCell>
                <TableCell className={classes.tableCell}>{item.address}</TableCell>
                <TableCell className={classes.tableCell}>{item.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
