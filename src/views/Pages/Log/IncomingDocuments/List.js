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
import { fetchDocuments } from "redux/actions/documents";
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

import CustomTable from "components/Table/CustomTable";

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
  const Documents = useSelector(state => state.documents?.documentList);

  console.log(Documents)
  

  useEffect(() => {
    dispatch(fetchDocuments(Emitent?.id));
  }, [isAllEmitents, Emitent?.id, dispatch]);



  const tableHeaders = [
      {
        Header: '№',
        accessor: 'id',
        sortType: 'basic'
      },
      {
        Header: 'Месяц год',
        accessor: 'title',
        sortType: 'basic'
      },
      // {
      //   Header: 'Категория',
      //   accessor: 'dividend_type.name',
      //   sortType: 'basic'
      // },
      // {
      //   Header: 'Расценка',
      //   accessor: 'share_price',
      //   sortType: 'basic'
      // },
    
      // {
      //   Header: '% отчисл',
      //   accessor: 'percent',
      //   sortType: 'basic'
      // },
      // {
      //   Header: 'Кол-во акций',
      //   accessor: 'amount_share',
      //   sortType: 'basic'
      // },
      // {
      //   Header: 'Дата закрытия реестра',
      //   accessor: 'date_close_reestr',
      //   sortType: 'basic',
      //   Cell: ({ value }) => {
      //     return window.formatDate(value);
      //   },
      // },
      {
        Header: 'Действия', // New column for the buttons
        accessor: 'actions',
        disableSortBy: true, // Disable sorting for this column
        Cell: ({ row }) => (
          <Box display="flex">
            <NavLink to={`incoming-document-detail/${row.original.id}`} >
            <Button
              variant="outlined"
              color="info">
                  Открыть
            </Button>
            </NavLink>
          </Box>
        )
      }
    ]
 




  return (
    <>
      <GridContainer>
        {/* <GridItem xs={12} sm={6} md={6} lg={4}>
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
        </GridItem> */}
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Box display="flex" justifyContent="flex-end" alignItems='flex-end'>
            <NavLink to={'/admin/incoming-document/add'}>
              <Button variant="outlined" color={'info'}>
                Добавить
              </Button>
            </NavLink>
          </Box>
          <CustomTable tableName="Входящие документы" tableHead={tableHeaders} tableData={Documents} searchKey="title" />
        </GridItem>
      </GridContainer>
    </>
  );
}
