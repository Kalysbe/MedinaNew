import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Icon
} from "@material-ui/core";
import Assignment from "@material-ui/icons/Assignment";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDividends } from "redux/actions/dividend";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import Typography from '@material-ui/core/Typography';
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { NavLink } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";

const useStyles = makeStyles(styles);

export default function RegularTables() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [totalHolders, setTotalHolders] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAllEmitents, setIsAllEmitents] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  const Emitent = useSelector(state => state.emitents?.store);
  const Dividends = useSelector(state => state.dividend?.dividends);

  useEffect(() => {
    dispatch(fetchDividends(Emitent?.id));
  }, [isAllEmitents, Emitent?.id, dispatch]);

  useEffect(() => {
    const holdersCount = Dividends?.items.length;

    const calculateSums = (data) => {
      return data.reduce(
        (acc, item) => {
          acc.ordinary = (acc.ordinary || 0) + (item.ordinary ? parseFloat(item.ordinary) : 0);
          acc.privileged = (acc.privileged || 0) + (item.privileged ? parseFloat(item.privileged) : 0);
          return acc;
        },
        { ordinary: 0, privileged: 0 }
      );
    };

    const newSums = calculateSums(Dividends?.items);
    setTotalHolders(holdersCount);
  }, [Dividends]);



  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHolders = useMemo(() => {
    if (!Dividends?.items) return [];
    return Dividends.items.filter(item =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [Dividends, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: '№',
        accessor: 'id',
        sortType: 'basic'
      },
      {
        Header: 'Месяц год',
        accessor: 'month_year',
        sortType: 'basic'
      },
      {
        Header: 'Категория',
        accessor: 'dividend_type.name',
        sortType: 'basic'
      },
      {
        Header: 'Расценка',
        accessor: 'share_price',
        sortType: 'basic'
      },
    
      {
        Header: '% отчисл',
        accessor: 'percent',
        sortType: 'basic'
      },
      {
        Header: 'Кол-во акций',
        accessor: 'amount_share',
        sortType: 'basic'
      },
      {
        Header: 'Дата закрытия реестра',
        accessor: 'date_close_reestr',
        sortType: 'basic',
        Cell: ({ value }) => {
          return window.formatDate(value);
        },
      },
      {
        Header: 'Действия', // New column for the buttons
        accessor: 'actions',
        disableSortBy: true, // Disable sorting for this column
        Cell: ({ row }) => (
          <Box display="flex">
            <NavLink to={`dividend/${row.original.id}`} >
            <Button
              variant="outlined"
              color="info">
                  Открыть
            </Button>
            </NavLink>
          </Box>
        )
      }
    ],
    []
  );

  const data = useMemo(() => filteredHolders || [], [filteredHolders]);

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
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Сумма дивидендов</p>
              <h3 className={classes.cardTitle}>{totalHolders}</h3>
            </CardHeader>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Box display="flex" justifyContent="flex-end" alignItems='flex-end'>
            <NavLink to={'/admin/calculation-dividend'}>
              <Button variant="outlined" color={'info'}>
                Добавить
              </Button>
            </NavLink>
          </Box>
          <Card >
            <CardHeader color="info" icon style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '350px' }}>
                <CardIcon color="info">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Таблица расчета дивидендов</h4>
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
        </GridItem>
      </GridContainer>
    </>
  );
}
