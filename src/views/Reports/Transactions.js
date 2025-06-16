import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Table, TableBody, td, TableHead, tr } from "@material-ui/core";
import * as XLSX from "xlsx";

const TransactionsReport = forwardRef(({ tableHead, tableData }, ref) => {
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
    <div ref={printContentRef} style={{ padding: 24, marginTop: 24 }}>
      <h4>Операции с ценными бумагами</h4>
      <Table>
        <TableHead>
          <tr>
            {tableHead.map((col, index) => (
              <td key={index} style={{ fontWeight: "bold" }}>
                {col.Header}
              </td>
            ))}
          </tr>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => {
            const { pairIndex } = row;
            const rowStyle =
              typeof pairIndex === "number" && pairIndex % 2 === 0
                ? { backgroundColor: "#f0f0f0" }
                : {};
            return (
              <tr key={index} style={rowStyle}>
                <td>{index + 1} )</td>
                <td>{row.id}</td>
                <td>{window.formatDate?.(row.contract_date)}</td>
                <td>{row.operation?.name}</td>
                <td style={{textAlign: 'right'}}>{row.displayQuantity}</td>
                <td>{row.displayHolder}</td>
              </tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});

export default TransactionsReport;
