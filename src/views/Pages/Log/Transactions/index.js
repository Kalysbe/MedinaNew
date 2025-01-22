import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import Button from "components/CustomButtons/Button.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from "redux/actions/transactions";

import CustomTable from "components/Table/CustomTable";



const styles = {
    customCardContentClass: {
        paddingLeft: "0",
        paddingRight: "0"
    },
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
};

const useStyles = makeStyles(styles);

export default function RegularTables() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const Emitent = useSelector(state => state.emitents?.store);
    const Transactions = useSelector(state => state.transactions?.transactions);


    useEffect(() => {
        dispatch(fetchTransactions(Emitent?.id));
    }, []);


    // Функция для преобразования
    function transformData(items) {
        return items.flatMap(item => {
          // Проверяем, есть ли security и валидный quantity
          if (!item || typeof item.quantity !== 'number') {
            return []; 
            // или return [item], если нужно пропускать только в таблицу quantity
          }
      
          const quantity = item.quantity;
          const resultRows = [];
      
          // 1) Строка "отправитель" (минусовое количество):
          //    Если holder_from есть — используем его имя,
          //    Если нет — берем имя emitent.full_name (как просили).
          const fromName = item.holder_from
            ? item.holder_from.name
            : item.emitent?.full_name || ""; // на всякий случай, если emitent вдруг нет
      
          // Будем добавлять эту строку **всегда**, чтобы у нас был «минусовой» участник.
          resultRows.push({
            ...item,
            displayQuantity: -quantity,
            displayHolder: fromName
          });
      
          // 2) Строка "получатель" (плюсовое количество), только если holder_to есть
          if (item.holder_to) {
            resultRows.push({
              ...item,
              displayQuantity: quantity,
              displayHolder: item.holder_to.name
            });
          }
      
          return resultRows;
        });
      }
  
  // Применяем преобразование
  const transformed = transformData(Transactions.items);
console.log(transformed,'fds')

    const TableData = (data, keys) => {
        return data.map(item => keys.map(key => item[key]));
    }

    const tableHeaders = [
        {
            Header: '№',
            accessor: (_, rowIndex) => rowIndex + 1, // Расчет индекса строки
            Cell: ({ value }) => <strong>{value}</strong>,
            sortType: 'basic'
        },
        {
            Header: 'Номер',
            accessor: 'id',
            sortType: 'basic'
        },
        {
            Header: 'Дата',
            accessor: 'contract_date',
            sortType: 'basic',
            Cell: ({ value }) => {
              
                return window.formatDate(value);
            },
        },
        {
            Header: 'Операция',
            accessor: 'operation.name',
            sortType: 'basic'
        },
        {
            Header: 'Количество',
            accessor: 'displayQuantity',
            sortType: 'basic'
        },
        {
            Header: 'Наименование',
            accessor: 'displayHolder',
            sortType: 'basic'
        },
        {
            Header: 'Действия', // New column for the buttons
            accessor: 'actions',
            disableSortBy: true, // Disable sorting for this column
            Cell: ({ row }) => (
                    <NavLink to={`/admin/transaction/${row.original.id}`} >
                        <Button
                            variant="outlined"
                            color="info">
                            Открыть
                        </Button>
                    </NavLink>
            )
        }
    ]

    return (
                <CustomTable tableName="Транзакции" tableHead={tableHeaders} tableData={transformed} searchKey="id" />
    );
}
