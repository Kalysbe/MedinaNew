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
} from "@material-ui/core";
import Assignment from "@material-ui/icons/Assignment";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { NavLink } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
    const classes = useStyles();
    const { tableName, tableHead, tableData, searchKey } = props;

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = useMemo(() => {
        if (!tableData) return [];
        return tableData.filter((item) => {
            const value = item[searchKey];
            return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [tableData, searchTerm, searchKey]);

    const columns = useMemo(() => tableHead, [tableHead]);
    const data = useMemo(() => filteredData || [], [filteredData]);

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
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <Card>
            <CardHeader color="info" icon style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "350px" }}>
                    <CardIcon color="info">
                        <Assignment />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>{tableName}</h4>
                </div>
                <div style={{ display: "flex", paddingTop: "14px" }}>
                    <CustomInput
                        labelText="Поиск"
                        formControlProps={{
                            fullWidth: false,
                        }}
                        inputProps={{
                            onChange: handleSearchChange,
                            type: "text",
                            name: "search",
                            value: searchTerm,
                        }}
                    />
                </div>
            </CardHeader>
            <CardBody>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        <TableSortLabel
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? "desc" : "asc"}
                                        >
                                            {column.isSorted ? (column.isSortedDesc ? <BiSortUp /> : <BiSortDown />) : <BiSortAlt2 />}
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
