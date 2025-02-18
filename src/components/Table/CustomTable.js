import React, { useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField
} from "@material-ui/core";
import Assignment from "@material-ui/icons/Assignment";
import { NavLink } from "react-router-dom";
import { useTable, useSortBy, usePagination } from "react-table";
import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";

// Компоненты из вашего проекта
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const {
    tableName,
    tableHead,
    tableData,
    searchKey,         // ключ для локального поиска (например, "id")
    onFilterChange,    // колбэк для передачи выбранного диапазона дат родителю
  } = props;

  // Состояния для локального поиска и выбора дат
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Локальная фильтрация по поисковому запросу
  const filteredData = useMemo(() => {
    if (!tableData) return [];
    return tableData.filter((item) => {
      const value = item[searchKey];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [tableData, searchTerm, searchKey]);

  // Обработка клика на кнопку "Применить фильтр" для дат
  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({ startDate, endDate });
    }
  };

  // Определяем колонки и данные для таблицы с помощью react-table
  const columns = useMemo(() => tableHead, [tableHead]);
  const data = useMemo(() => filteredData, [filteredData]);

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
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap"
        }}
      >
        {/* Левая часть: Заголовок */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <CardIcon color="info">
            <Assignment />
          </CardIcon>
          <h4 className={classes.cardIconTitle}>{tableName}</h4>
        </div>
        {/* Правая часть: Панель фильтров */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem"
          }}
        >
          {/* Локальный поиск */}
          <CustomInput
            labelText="Поиск"
            formControlProps={{ fullWidth: false }}
            inputProps={{
              onChange: (e) => setSearchTerm(e.target.value),
              type: "text",
              name: "search",
              value: searchTerm,
            }}
          />
          {/* Выбор дат */}
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
          {/* Кнопка для передачи выбранных дат родителю */}
          <Button onClick={handleApplyFilter} color="primary">
            Применить фильтр
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(
                      column.getSortByToggleProps()
                    )}
                  >
                    {column.render("Header")}
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? "desc" : "asc"}
                    >
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <BiSortUp />
                        ) : (
                          <BiSortDown />
                        )
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
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell {...cell.getCellProps()}>
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
          onChangePage={(event, newPage) => gotoPage(newPage)}
          rowsPerPage={pageSize}
          onChangeRowsPerPage={(event) =>
            setPageSize(Number(event.target.value))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Строк на странице:"
        />
      </CardBody>
    </Card>
  );
}
