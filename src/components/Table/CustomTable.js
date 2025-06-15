import React, { useState, useMemo, useRef, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
} from "@material-ui/core";
import Assignment from "@material-ui/icons/Assignment";
import { useTable, useSortBy, usePagination } from "react-table";
import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";

// Ваши компоненты
import CustomInput from "components/CustomInput/CustomInput.js";
import ReactToPrint from 'react-to-print';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import * as XLSX from "xlsx";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(theme => ({
  noPrint: {
    '@media print': {
      display: 'none !important',
    },
  },
  ...styles,
}));

const CustomTable = forwardRef((props, ref) => {
  const componentRef = useRef();
  const classes = useStyles();
  const {
    tableName,
    tableHead,
    tableData,
    searchKey,
    filterDate,
    onFilterChange,
    stripedPairs 
  } = props;

  // Локальные состояния
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Фильтрация по поиску
  const filteredData = useMemo(() => {
    if (!tableData) return [];
    return tableData.filter((item) => {
      const value = item[searchKey];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [tableData, searchTerm, searchKey]);

  // Кнопка "Применить" для дат
  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({ startDate, endDate });
    }
  };

  // Реализация react-table
  const columns = useMemo(() => tableHead, [tableHead]);
  const data = useMemo(() => filteredData, [filteredData]);

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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <Card>
      <CardHeader
        color="info"
        icon
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {/* Заголовок */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <CardIcon color="info">
            <Assignment />
          </CardIcon>
          <h4 className={classes.cardIconTitle}>{tableName}</h4>
        </div>

        {/* Фильтры (не попадают в печать, т.к. ref будет на самой таблице) */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
     
         
       
          <CustomInput
            labelText="Поиск"
            formControlProps={{ fullWidth: false }}
            inputProps={{
              onChange: (e) => setSearchTerm(e.target.value),
              type: "text",
              value: searchTerm,
            }}
          />
          {filterDate && (
            <>
              <TextField
                label="Дата от"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Дата до"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button color="info" onClick={handleApplyFilter}>
                Применить
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {/* Важно: div ref={ref} -- печатаем только это */}
       
        <h4 className={classes.cardIconTitle}>{tableName}</h4>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell 
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{padding:'0px'}} 
                      className={typeof column.accessor === 'string' && column.accessor === 'actions' ? classes.noPrint : ''}
                    >
                      {column.render("Header")}
                      <TableSortLabel
                        active={column.isSorted}
                        direction={column.isSortedDesc ? "desc" : "asc"}
                      >
                        {column.isSorted ? (
                          column.isSortedDesc ? <BiSortUp /> : <BiSortDown />
                        ) : (
                          <BiSortAlt2 />
                        )}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);

                // pairIndex для этой строки
            const { pairIndex } = row.original;
         
            // Если нет pairIndex, это не пара — оставим как есть
            // Если есть, и striping включен, чередуем
            let rowStyle = {};
            if (stripedPairs && typeof pairIndex === "number") {
              // Например: чётные пары красим в серый,
              // нечётные — оставляем белый (или наоборот).
              // pairIndex % 2 === 0 => backgroundColor: "#f9f9f9" (пример)
              if (pairIndex % 2 === 0) {
                rowStyle = { backgroundColor: "#f0f0f0" };
              }
            }

                return (
                  <TableRow {...row.getRowProps()} style={rowStyle}>
                    {row.cells.map((cell) => (
                      <TableCell 
                        style={{padding:'0px'}} 
                        {...cell.getCellProps()} 
                        className={typeof cell.column.accessor === 'string' && cell.column.accessor === 'actions' ? classes.noPrint : ''}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
       

        <TablePagination
          component="div"
          count={data.length}
          page={pageIndex}
          onChangePage={(e, newPage) => gotoPage(newPage)}
          rowsPerPage={pageSize}
          onChangeRowsPerPage={(e) => setPageSize(Number(e.target.value))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Строк на странице:"
        />
      </CardBody>
    </Card>
  );
});

export default CustomTable;
