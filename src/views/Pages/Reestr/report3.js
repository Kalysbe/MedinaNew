import React from "react";
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
      ["№", "Счет", "Наименование", "Номер эмиссии", "Простых", "Номинал простых", "% от кол-во"],
      ...data.map((item, index) => [
        index + 1,
        item.id,
        item.name,
        item.reg_number,
        item.ordinary,
        item.ordinary_nominal,
        item.percentage + " %"
      ]),
      ["Итого", "", "", "", totals.ordinary, totals.ordinary_nominal, ""]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчет");
    XLSX.writeFile(wb, "report.xlsx");
  };

  return (
    <>
      <h3 className={classes.printOnly}>{emitent}</h3>
      <h3 className={classes.printOnly}>Реестр владельцев именных ценных бумаг по номерам выпуска акций</h3>
      <Button variant="contained" color="primary" onClick={exportToExcel} style={{ marginBottom: "10px" }}>
        Скачать Excel
      </Button>
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
              <TableCell>% от кол-во</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <NavLink to={`holder/${item.id}`}>{item.name}</NavLink>
                </TableCell>
                <TableCell>{item.reg_number}</TableCell>
                <TableCell>{window.formatNumber(item.ordinary)}</TableCell>
                <TableCell>{window.formatNumber(item.ordinary_nominal)}</TableCell>
                <TableCell>{item.percentage} %</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} style={{ fontWeight: "bold" }}>Итого</TableCell>
              <TableCell>{window.formatNumber(totals.ordinary)}</TableCell>
              <TableCell>{window.formatNumber(totals.ordinary_nominal)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </>
  );
}
