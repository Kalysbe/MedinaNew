import React, { useState, useMemo, useEffect } from "react";
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
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";
// --- Your project-specific components
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const {
    tableName,
    tableHead,
    tableData,
    searchKey,
    filterData,              // <-- New: indicates if date filter should be shown
    onDateRangeChange,       // <-- New: callback to pass filtered data or date range to parent
    dateField = "date"       // <-- New: name of the date field in `tableData` items
  } = props;

  const [searchTerm, setSearchTerm] = useState("");
  // Date range states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handle text search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter by search term
  // Then, if filterData is enabled and date range is provided, filter by date
  const finalFilteredData = useMemo(() => {
    if (!tableData) return [];

    let tempData = tableData.filter((item) => {
      const value = item[searchKey] ?? "";
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });

    // If date filtering is enabled, apply that as well
    if (filterData && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      tempData = tempData.filter((item) => {
        const itemDate = new Date(item[dateField]);
        // Inclusive filtering: from startDate to endDate
        return itemDate >= start && itemDate <= end;
      });
    }
    return tempData;
  }, [tableData, searchTerm, searchKey, filterData, startDate, endDate, dateField]);

  // Pass filtered data (or date range) to parent whenever it changes
  useEffect(() => {
    if (filterData && typeof onDateRangeChange === "function") {
      // You can pass just the selected date range, or the entire finalFilteredData
      onDateRangeChange({
        startDate,
        endDate,
        filteredData: finalFilteredData
      });
    }
  }, [filterData, startDate, endDate, finalFilteredData, onDateRangeChange]);

  // Columns & data for react-table
  const columns = useMemo(() => tableHead, [tableHead]);
  const data = useMemo(() => finalFilteredData || [], [finalFilteredData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    gotoPage,
    pageOptions,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useGlobalFilter,
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
        <div style={{ width: "350px" }}>
          <CardIcon color="info">
            <Assignment />
          </CardIcon>
          <h4 className={classes.cardIconTitle}>{tableName}</h4>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Search input */}
          <CustomInput
            labelText="Поиск"
            formControlProps={{
              fullWidth: false
            }}
            inputProps={{
              onChange: handleSearchChange,
              type: "text",
              name: "search",
              value: searchTerm
            }}
          />

          {/* Conditionally render date pickers if filterData is provided */}
          {filterData && (
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
            </>
          )}
        </div>
      </CardHeader>

      <CardBody>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
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
                      {/* Example: If the column is `share_price`, wrap its cell in a NavLink */}
                      {cell.column.id === "share_price" ? (
                        <NavLink to={`dividend/${row.original.id}`}>
                          {cell.render("Cell")}
                        </NavLink>
                      ) : (
                        cell.render("Cell")
                      )}
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
          onChangeRowsPerPage={(event) => setPageSize(Number(event.target.value))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Строк на странице:"
        />
      </CardBody>
    </Card>
  );
}
