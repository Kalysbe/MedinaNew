import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as XLSX from "xlsx";

const styles = () => ({
  page: {
    backgroundColor: "#ffffff",
    color: "#1f2937",
    padding: "24px",
    fontFamily: '"Roboto","Segoe UI",sans-serif',
    lineHeight: 1.5,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "16px",
    marginBottom: "24px",
  },
  titleBlock: {
    maxWidth: "70%",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.95rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#6b7280",
  },
  title: {
    margin: "4px 0 0",
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  metaBlock: {
    textAlign: "right",
    fontSize: "0.9rem",
    color: "#4b5563",
  },
  metaLabel: {
    display: "block",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#9ca3af",
  },
  summary: {
    display: "flex",
    gap: "24px",
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  summaryItem: {
    minWidth: "180px",
  },
  summaryLabel: {
    fontSize: "0.85rem",
    color: "#6b7280",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#111827",
  },
  tableWrapper: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  },
  table: {
    minWidth: "100%",
    tableLayout: "fixed",
  },
  tableHeadCell: {
    backgroundColor: "#f3f4f6",
    fontWeight: 600,
    fontSize: "0.85rem",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  },
  tableCell: {
    fontSize: "0.9rem",
    color: "#111827",
    borderBottom: "1px solid #f1f5f9",
    wordBreak: "break-word",
  },
  zebraRow: {
    backgroundColor: "#fcfcfd",
  },
  totalRow: {
    backgroundColor: "#eef2ff",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 500,
  },
  printOnly: {
    display: "none",
    "@media print": {
      display: "block",
    },
  },
  "@media print": {
    page: {
      padding: 6,
      boxShadow: "none",
    },
    header: {
      marginBottom: "12px",
    },
    tableWrapper: {
      boxShadow: "none",
      border: "1px solid #9ca3af",
    },
    summary: {
      background: "transparent",
      border: "1px solid #d1d5db",
      padding: "10px 12px",
      gap: "12px",
    },
    table: {
      tableLayout: "fixed",
    },
    tableHeadCell: {
      padding: "4px 6px",
      fontSize: "0.75rem",
    },
    tableCell: {
      padding: "3px 6px",
      fontSize: "0.75rem",
    },
    link: {
      color: "#000000",
      textDecoration: "none",
    },
  },
});

const useStyles = makeStyles(styles);

const Report3 = forwardRef(({ data = [], emitent }, ref) => {
  const classes = useStyles();
  const generatedAt = new Date().toLocaleDateString("ru-RU");

  const totals = data.reduce(
    (acc, item) => {
      acc.common_quantity += Number(item.common_quantity) || 0;
      acc.common_nominal += Number(item.common_nominal) || 0;
      acc.percentage += Number(item.percentage) || 0;
      return acc;
    },
    { common_quantity: 0, common_nominal: 0, percentage: 0 }
  );

  const printContentRef = useRef();

  const exportToExcel = () => {
    const table = printContentRef.current?.querySelector("table");
    if (!table) return;

    const rows = Array.from(table.rows).map((row) =>
      Array.from(row.cells)
        .filter((cell) => !cell.classList.contains("noPrint"))
        .map((cell) => cell.innerText)
    );

    const wsData = [rows[0], []].concat(rows.slice(1).map((r) => (r.length ? r : [""])));

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
    <div ref={printContentRef} className={classes.page}>
      <div className={classes.header}>
        <div className={classes.titleBlock}>
          <p className={classes.subtitle}>Реестр владельцев именных ценных бумаг по номерам выпуска акций</p>
          <h2 className={classes.title}>{emitent || "—"}</h2>
        </div>
        <div className={classes.metaBlock}>
          <span className={classes.metaLabel}>Дата формирования</span>
          <span>{generatedAt}</span>
          <span className={classes.metaLabel}>Количество записей</span>
          <span>{data.length}</span>
        </div>
      </div>

      <div className={classes.summary}>
        <div className={classes.summaryItem}>
          <p className={classes.summaryLabel}>Простых акций</p>
          <p className={classes.summaryValue}>{window.formatNumber(totals.common_quantity)}</p>
        </div>
        <div className={classes.summaryItem}>
          <p className={classes.summaryLabel}>Номинал простых</p>
          <p className={classes.summaryValue}>{window.formatNumber(totals.common_nominal)}</p>
        </div>
        <div className={classes.summaryItem}>
          <p className={classes.summaryLabel}>Доля, %</p>
          <p className={classes.summaryValue}>{window.formatNumber(totals.percentage)} %</p>
        </div>
      </div>

      {data?.length > 0 && (
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead style={{ display: "table-header-group" }}>
              <TableRow>
                {/* <TableCell className={classes.tableHeadCell}>№</TableCell> */}
                <TableCell className={classes.tableHeadCell}>Счет</TableCell>
                <TableCell className={classes.tableHeadCell}>Наименование</TableCell>
                <TableCell className={classes.tableHeadCell}>Номер эмиссии</TableCell>
                <TableCell className={classes.tableHeadCell}>Простых</TableCell>
                <TableCell className={classes.tableHeadCell}>Номинал простых</TableCell>
                <TableCell className={classes.tableHeadCell}>% от кол-во</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} className={index % 2 ? classes.zebraRow : ""}>
                  {/* <TableCell className={classes.tableCell}>{index + 1}</TableCell> */}
                  <TableCell className={classes.tableCell}>{item.id}</TableCell>
                  <TableCell className={classes.tableCell}>
                    <NavLink to={`holder/${item.id}`} className={classes.link}>
                      {item.full_name}
                    </NavLink>
                  </TableCell>
                  <TableCell className={classes.tableCell}>{item.emission}</TableCell>
                  <TableCell className={classes.tableCell}>{window.formatNumber(item.common_quantity)}</TableCell>
                  <TableCell className={classes.tableCell}>{window.formatNumber(item.common_nominal)}</TableCell>
                  <TableCell className={classes.tableCell}>{item.percentage} %</TableCell>
                </TableRow>
              ))}
              <TableRow className={classes.totalRow}>
                <TableCell className={classes.tableCell} colSpan={3} style={{ fontWeight: 600 }}>
                  Итого
                </TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(totals.common_quantity)}</TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(totals.common_nominal)}</TableCell>
                <TableCell className={classes.tableCell}>{window.formatNumber(totals.percentage)} %</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
});

export default Report3;
