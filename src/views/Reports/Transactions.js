import React, { useRef, forwardRef  } from "react";
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
  { id: "amount", label: "Сумма" },
  { id: "status", label: "Статус" },
];

const TransactionsReport = forwardRef((props, ref) => {
    return (
      <div ref={ref}>
        <Paper style={{ padding: 24, margin: 24 }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.id}>{row[col.id]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  });

  export default TransactionsReport;