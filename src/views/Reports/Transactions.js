import React, { useRef,useImperativeHandle, forwardRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Paper } from "@material-ui/core";
import * as XLSX from "xlsx";

const data = [
  { id: 1, name: "Иванов", amount: 1000, status: "Успешно" },
  { id: 2, name: "Петров", amount: 2000, status: "Ошибка" },
  { id: 3, name: "Сидоров", amount: 1500, status: "Успешно" },
];

const columns = [
  { id: "id", label: "ID" },
  { id: "name", label: "Имя" },
  { id: "amount", label: "Сумма" }
];

const TransactionsReport = forwardRef((props, ref) => {

  const exportToExcel = () => {
    const table = document.querySelector('table');
    if (!table) return;

    // Собираем строки, исключая ячейки с классом noPrint
    const rows = Array.from(table.rows).map(row =>
      Array.from(row.cells)
        .filter(cell => !cell.classList.contains('noPrint'))
        .map(cell => cell.innerText)
    );

    // Добавим пустую строку между заголовком и данными для читаемости
    const wsData = [rows[0], []].concat(rows.slice(1).map(r => r.length ? r : [""]));

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Добавим автоширину столбцов
    const colWidths = wsData[0].map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "table_export.xlsx");
  };

  // Указываем, какие функции доступны через ref
  useImperativeHandle(ref, () => ({
    exportToExcel,
  }));

  return (
    <div ref={ref} style={{ padding: 24, margin: 24, border: "1px solid #000" }}>
      <h4>Операции с ценными бумагами</h4>
        <Table>
          <TableHead>
            <tr>
              {props.tableHead.map((col, index) => (
                <td style={{fontWeight: "bold" }} key={index}>{col.Header}</td>
              ))}
            </tr>
          </TableHead>
          <TableBody>
            {props.tableData.map((row, index) => {
              const { pairIndex } = row
              let rowStyle = {};
              if (typeof pairIndex === "number") {
                if (pairIndex % 2 === 0) {
                  rowStyle = { backgroundColor: "#f0f0f0" };
                }
              }
              return (
                <tr key={index} style={rowStyle}>
                  <td>{index}</td>
                  <td>{row.id}</td>
                  <td>{window.formatDate(row.contract_date)}</td>
                  <td>{window.formatDate(row.operation?.name)}</td>
                  <td>{window.formatDate(row.displayQuantity)}</td>
                  <td>{window.formatDate(row.displayHolder)}</td>

                </tr>
              )
            })}
          </TableBody>
        </Table>
    </div>
  );
});

export default TransactionsReport;