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
import { fetchAllHolders, fetchHolders } from "redux/actions/holders";
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
  const [totalOrdinary, setTotalOrdinary] = useState(0);
  const [totalPrivileged, setTotalPrivileged] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAllEmitents, setIsAllEmitents] = useState(true);

  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const Emitent = useSelector(state => state.emitents?.store);
  const Holders = useSelector(state => state.holders?.holders);

  useEffect(() => {
    if (isAllEmitents) {
      dispatch(fetchAllHolders(Emitent?.id));
    } else {
      dispatch(fetchHolders(Emitent?.id));
    }
  }, [isAllEmitents, Emitent?.id, dispatch]);

  useEffect(() => {
    const holdersCount = Holders?.items.length;

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

    const newSums = calculateSums(Holders?.items);
    setTotalHolders(holdersCount);
    setTotalOrdinary(newSums.ordinary);
    setTotalPrivileged(newSums.privileged);
  }, [Holders]);

  const handleCheckboxChange = (event) => {
    setIsAllEmitents(event.target.checked);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHolders = useMemo(() => {
    if (!Holders?.items) return [];
    return Holders.items.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [Holders, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: 'Счет',
        accessor: 'id', // Поле данных для этого столбца
        sortType: 'basic'
      },
      {
        Header: 'Наименование',
        accessor: 'name', // Поле данных для этого столбца
        sortType: 'basic'
      },
      // {
      //   Header: "Действия",
      //   accessor: "actions",
      //   disableSortBy: true,
      //   Cell: ({ row }) => (
      //     <Box>
      //     <CustomDropdown
      //     buttonText="Открыть"
      //     hoverColor="info"
      //     buttonProps={{
      //       round: true,
      //       block: false,
      //       color: "info"
      //     }}
      //     dropPlacement="bottom"
      //     dropdownList={[
      //      <NavLink color="info" to={`holder/${row.original.id}/edit`}>Корректировка</NavLink>,
      //      <NavLink to={'/holders'}>Лиц Счет</NavLink>,
      //      <NavLink to={'/holders'}>Выписка</NavLink>,
      //     ]}
      //   />
      //   </Box>
      //   ),
      // },
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

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={4}>

          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Количество акционеров</p>
              <h3 className={classes.cardTitle}>{totalHolders}</h3>
            </CardHeader>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Box display="flex" justifyContent="flex-end" alignItems='flex-end'>
          <NavLink to={'/admin/holder/add'}>
                  <Button variant="outlined" color={'info'}>
                    Добавить
                  </Button>
                </NavLink>
          </Box>
          <Card >
    
            <CardHeader color="rose" icon style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '300px' }}>
                <CardIcon color="info">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Акционеры</h4>
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
                            {cell.column.id === 'name' ? (
                              <NavLink to={`holder/${row.original.id}`} >
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
