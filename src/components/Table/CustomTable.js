import React, { useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@material-ui/core";
import Assignment from "@material-ui/icons/Assignment";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import Card from "components/Card/Card.js";
import Typography from '@material-ui/core/Typography';
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { NavLink } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";

const useStyles = makeStyles(styles);

/*************  ✨ Codeium Command ⭐  *************/
/**
 * CustomTable
 *
 * This component renders a table with a list of dividend calculations.
 * The user can search for dividend calculations by name and sort the table by columns.
 * The component also displays the total number of dividend calculations.
 *
 * @returns {JSX.Element}
 */
/******  e2607f33-03e2-4f89-9193-24e64401028d  *******/
export default function CustomTable(props) {
    const classes = useStyles();

    const {
        tableName,
        tableHead,
        tableData,
        searchKey,
      } = props;

    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);



    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = useMemo(() => {
        if (!tableData) return [];
        return tableData.filter(item => {
            const value = item[searchKey];
            // Преобразуем значение в строку, если это число, чтобы поддерживать includes и toLowerCase
            return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [tableData, searchTerm, searchKey]);
    

    const columns = useMemo(
        () => tableHead,
        []
    );

    const data = useMemo(() => filteredData || [], [filteredData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize: setTablePageSize,
        state: { pageIndex: tablePageIndex, pageSize: tablePageSize }
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex, pageSize: rowsPerPage }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <>
            <Card >
                <CardHeader color="info" icon style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '350px' }}>
                        <CardIcon color="info">
                            <Assignment />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>{tableName}</h4>
                    </div>
                    <div style={{ display: 'flex', paddingTop: '14px' }}>
                        <CustomInput
                            labelText='Поиск'
                            formControlProps={{
                                fullWidth: false,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleSearchChange(event)
                                },
                                type: 'text',
                                name: 'emission',
                                value: searchTerm
                            }}
                        />
                    </div>

                </CardHeader>
                <CardBody>
                    <Table {...getTableProps()}>
                        <TableHead>
                            {headerGroups.map(headerGroup => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            <TableSortLabel
                                                active={column.isSorted}
                                                direction={column.isSortedDesc ? 'desc' : 'asc'}
                                            >
                                                {column.isSorted ? (column.isSortedDesc ? <BiSortUp /> : <BiSortDown />) : <BiSortAlt2 />}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <TableRow {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <TableCell {...cell.getCellProps()}>
                                                {cell.column.id === 'share_price' ? (
                                                    <NavLink to={`dividend/${row.original.id}`} >
                                                        <Typography color="primary">
                                                            {cell.render('Cell')}
                                                        </Typography>

                                                    </NavLink>
                                                ) : (
                                                    cell.render('Cell')
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

        </>
    );
}
