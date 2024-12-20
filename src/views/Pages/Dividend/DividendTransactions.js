import React, { useState, useEffect, useMemo, useRef } from "react"; // Добавлен useRef для использования react-to-print
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TableContainer,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Icon
} from "@material-ui/core";
import Assignment from "@material-ui/icons/Assignment";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDividendTransactionsById } from "redux/actions/dividend";
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
import TextField from '@material-ui/core/TextField';
import { NavLink, useParams } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";
import { useReactToPrint } from "react-to-print"; // Добавлено для печати

const customStyle = {
  onlyPrint: {
    display: 'none',
    '@media print': {
      display: 'block',
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", 
      color: '#000'
    }
  },
  notForPrint: {
    '@media print': {
      display: 'none',
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", 
      color: '#000'
    },
  },
  customStyles: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", 
    color: '#000'
  },
  fontStyle: {
    color: "#000",
    fontWeight: '300',
  },
};
const useStyles = makeStyles(styles);
const customUseStyle = makeStyles(customStyle);


export default function RegularTables() {
    const { id } = useParams();
  const classes = useStyles();
  const customClasses = customUseStyle();
  const dispatch = useDispatch();

  const [totalHolders, setTotalHolders] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAllEmitents, setIsAllEmitents] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const Emitent = useSelector(state => state.emitents?.store);
  const { dividendTransactions, dividendTransactionsStatus } = useSelector(state => state.dividend.dividendTransaction);
  console.log("Дивидендные транзакции:", dividendTransactions);
  console.log("Статус транзакций:", dividendTransactionsStatus);
    console.log(id)

  useEffect(() => {
    dispatch(fetchDividendTransactionsById(id));
  }, [isAllEmitents, Emitent?.id, dispatch]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHolders = useMemo(() => {
    if (!dividendTransactions?.dividend_transactions) return [];
    return dividendTransactions.dividend_transactions.filter(item =>
      item.holder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dividendTransactions, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: 'Счет',
        accessor: 'id', // Поле данных для этого столбца
        sortType: 'basic'
      },
      {
        Header: 'Наименование',
        accessor: 'holder.name', // Поле данных для этого столбца
        sortType: 'basic'
      },
      {
        Header: 'Количество акций',
        accessor: 'share_count', // Поле данных для этого столбца
        sortType: 'basic'
      },
      {
        Header: 'Начислено',
        accessor: 'share_credited', // Поле данных для этого столбца
        sortType: 'basic'
      },

      {
        Header: 'Отчислено',
        accessor: 'share_debited', // Поле данных для этого столбца
        sortType: 'basic'
      },
      {
        Header: 'Сумма к выдаче',
        accessor: 'amount_pay', // Поле данных для этого столбца
        sortType: 'basic'
      }
    ],
    []
  );

  const data = useMemo(() => filteredHolders || [], [filteredHolders]);

  const totalShares = data.reduce((sum, row) => sum + (row.share_count || 0), 0);
  const totalCredited = data.reduce((sum, row) => sum + (row.share_credited || 0), 0);
  const totalDebited = data.reduce((sum, row) => sum + (row.share_debited || 0), 0);
  const totalAmountPay = data.reduce((sum, row) => sum + (row.amount_pay || 0), 0);

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
    setPageSize: setTablePageSize, // Переименовываем для избежания конфликта
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

  const tableRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => tableRef.current // Указываем, что печатать будем таблицу
  });

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
            <Button variant="outlined" color={'warning'} onClick={handlePrint}>
              Печать
            </Button>
          </Box>

          <Card >
            <div ref={tableRef} style={{fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", color: '#000'}}>
              <CardHeader color="info" icon style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '350px' }}>
                  <span className={customClasses.notForPrint}>
                  <CardIcon color="info" >
                    <Assignment />
                  </CardIcon>
                  </span>
                  <p className={customClasses.customStyles}>
                  <h4  className={classes.cardIconTitle}> <span className={customClasses.fontStyle}>Ведомость расчета дивидендов <br/>{dividendTransactions?.title}</span></h4>
                  </p>
                </div>
                
                <span className={customClasses.notForPrint}>
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
                  </div></span>
              </CardHeader>
              <CardBody>
                {/* <CardHeader color="info" icon style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 className={classes.cardIconTitle}>Таблица расчета дивидендов</h4>
              </CardHeader> */}
              <div style={{display: 'flex'}}>
                <div className={customClasses.onlyPrint}>
                  <p><span className={customClasses.fontStyle}>Предприятие (Емитент): {dividendTransactions?.emitent?.full_name}</span></p>
                  <p><span className={customClasses.fontStyle}>Вид акций: Простые именные</span></p>
                  <p><span className={customClasses.fontStyle}>Категория: {dividendTransactions?.dividend_type?.name}</span></p>
                  <p><span className={customClasses.fontStyle}>Расценка на одну акцию: {dividendTransactions?.share_price}</span></p>
                  <p><span className={customClasses.fontStyle}>Регион: Все регионы</span></p>
                  <p><span className={customClasses.fontStyle}>Дата: {window.formatDate(dividendTransactions?.date_close_reestr)}</span></p>
                </div>
              </div>
                <Table {...getTableProps()} >
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
                              {cell.column.id === 'holder.name' ? (
                                <NavLink to={`/admin/holder/${row.original.id}`} >
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
                  <TableRow>
                    <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>Итого по листу:</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalShares}</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalCredited}</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalDebited}</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalAmountPay}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>Всего по листам :</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalShares}</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalCredited}</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalDebited}</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{totalAmountPay}</TableCell>
                  </TableRow>
                  </TableBody>
                </Table>


              </CardBody>
            </div>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
