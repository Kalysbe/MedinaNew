import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import * as XLSX from "xlsx";

const styles = {
  printOnly: {
    display: 'none',
    '@media print': {
      display: 'block'
    }
  }
};

const useStyles = makeStyles(styles);

const Report3 = forwardRef(({ data, emitent }, ref) => {
  const classes = useStyles();

  const totals = data.reduce(
    (acc, item) => {
      acc.common_quantity += Number(item.common_quantity) || 0;
      acc.common_nominal += Number(item.common_nominal) || 0;
      acc.preferred_quantity += Number(item.preferred_quantity) || 0;
      acc.preffered_nominal += Number(item.preffered_nominal) || 0;
      acc.percentage += Number(item.percentage) || 0;
      return acc;
    },
    { common_quantity: 0, common_nominal: 0, preferred_quantity: 0,preffered_nominal: 0, percentage:0 }
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
      <h3 className={classes.printOnly}>{emitent}</h3>
      <h3 className={classes.printOnly}>Реестр владельцев именных ценных бумаг по номерам выпуска акций</h3>
      {data && (
        <Table>
          <TableHead style={{ display: 'table-header-group' }}>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Счет</TableCell>
              <TableCell>Наименование</TableCell>
              <TableCell>Номер эмиссии</TableCell>
              <TableCell>Простых</TableCell>
              <TableCell>Номинал простых</TableCell>
              {/* <TableCell>Привелиг</TableCell>
              <TableCell>Номинал Привелиг</TableCell> */}
              <TableCell>% от кол-во</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <NavLink to={`holder/${item.id}`}>{item.full_name}</NavLink>
                </TableCell>
                <TableCell>{item.emission}</TableCell>
                <TableCell>{window.formatNumber(item.common_quantity)}</TableCell>
                <TableCell>{window.formatNumber(item.common_nominal)}</TableCell>
                {/* <TableCell>{window.formatNumber(item.preferred_quantity)}</TableCell>
                <TableCell>{window.formatNumber(item.preffered_nominal)}</TableCell> */}
                <TableCell>{item.percentage} %</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} style={{ fontWeight: "bold" }}>Итого</TableCell>
              <TableCell>{window.formatNumber(totals.common_quantity)}</TableCell>
              <TableCell>{window.formatNumber(totals.common_nominal)}</TableCell>
              {/* <TableCell>{window.formatNumber(totals.preferred_quantity)}</TableCell>
              <TableCell>{window.formatNumber(totals.preferred_nominal)}</TableCell> */}
               <TableCell>{window.formatNumber(totals.percentage)} %</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
});

export default Report3
