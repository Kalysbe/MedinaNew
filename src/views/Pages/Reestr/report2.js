import React, { useRef, useImperativeHandle, forwardRef } from "react";
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

const Report2 = forwardRef(({ data, emitent }, ref) => {

  const classes = useStyles();

  const totals = data.reduce(
    (acc, item) => {
      acc.common_quantity += Number(item.common_quantity) || 0;
      acc.common_nominal += Number(item.common_nominal) || 0;
      acc.preferred_quantity += Number(item.preferred_quantity) || 0;
      acc.preferred_nominal += Number(item.preferred_nominal) || 0;
            acc.percentage += Number(item.percentage) || 0;
      return acc;
    },
    { common_quantity: 0, common_nominal: 0, preferred_quantity: 0,preferred_nominal: 0, percentage:0 }
  );

  const printContentRef = useRef();

  const exportToExcel = () => {
    const table = printContentRef.current?.querySelector("table");
    if (!table) return;

    const rows = Array.from(table.rows).map(row =>
      Array.from(row.cells)
        .filter(cell => !cell.classList.contains("noPrint"))
        .map(cell => cell.innerText)
    );

    const wsData = [rows[0], []].concat(rows.slice(1).map(r => (r.length ? r : [""])));

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = wsData[0].map(() => ({ wch: 20 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчёт");
    XLSX.writeFile(wb, "report.xlsx");
  };

useImperativeHandle(ref, () => ({
    exportToExcel,
    getContent: () => printContentRef.current,
  }));

  return (
<div ref={printContentRef}>
      <h5 style={{color: '#000'}} className={classes.printOnly}>{emitent}</h5>
      <Typography variant="h5" component="div"><span style={{color: '#000'}}>Реестр владельцев именных ценных бумаг</span></Typography>
      <h4 style={{color: '#000'}}>Зарегистрированных на 31/12/2023</h4>
      <h5 style={{color: '#000'}}>Простые именные все категории</h5>
      <h5 style={{color: '#000'}}>Лист: 1</h5>
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
              <TableRow>
              <TableCell colSpan={3} style={{ fontWeight: "bold" }}>Итого</TableCell>
              <TableCell>{window.formatNumber(totals.common_quantity)}</TableCell>
              <TableCell>{window.formatNumber(totals.common_nominal)}</TableCell>
              <TableCell>{window.formatNumber(totals.preferred_quantity)}</TableCell>
              <TableCell>{window.formatNumber(totals.preferred_nominal)}</TableCell>
                  <TableCell>{window.formatNumber(totals.percentage)} %</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
});

export default Report2

