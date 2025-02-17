import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "redux/actions/transactions";

// <-- Our custom table that has date filtering built in
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
  const Emitent = useSelector((state) => state.emitents?.store);
  const Transactions = useSelector((state) => state.transactions?.transactions);

  useEffect(() => {
    if (Emitent?.id) {
      dispatch(fetchTransactions(Emitent?.id));
    }
  }, [Emitent, dispatch]);

  // We’ll keep track of whatever is returned via onDateRangeChange, 
  // so we can see the currently filtered data or date range:
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // This callback will be passed to CustomTable and triggered 
  // whenever the date range or the filtered data changes in CustomTable.
  const handleDateRangeChange = ({ startDate, endDate, filteredData }) => {
    console.log("Selected date range:", startDate, "to", endDate);
    console.log("Filtered data:", filteredData);

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

      return resultRows;
    });
  }

  const transformed = transformData(Transactions?.items || []);

  // React Table columns
  const tableHeaders = [
    {
      Header: "№",
      // Row index
      accessor: (_, rowIndex) => rowIndex + 1,
      Cell: ({ value }) => <strong>{value}</strong>,
      sortType: "basic"
    },
    {
      Header: "Номер",
      accessor: "id",
      sortType: "basic"
    },
    {
      Header: "Дата",
      // This should match the field name you want to filter by date
      // (if you pass `dateField="contract_date"` below, 
      //  you'll want this accessor to read from `contract_date`).
      accessor: "contract_date",
      sortType: "basic",
      Cell: ({ value }) => window.formatDate(value) // if you have a window.formatDate function
    },
    {
      Header: "Наименование",
      accessor: "operation.name",
      sortType: "basic"
    },
    {
      Header: "Количество",
      accessor: "displayQuantity",
      sortType: "basic"
    },
    {
      Header: "Владелец",
      accessor: "displayHolder",
      sortType: "basic"
    },
    {
      Header: "Действия",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <NavLink to={`/admin/transaction/${row.original.id}`}>
          <Button variant="outlined" color="info">
            Открыть
          </Button>
        </NavLink>
      )
    }
  ];

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
