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

    // You can store or otherwise use the filtered data:
    // setFilteredTransactions(filteredData);
  };

  // Example function to transform the data (as you already had)
  function transformData(items) {
    if (!items) return [];
    return items.flatMap((item) => {
      if (!item.security || typeof item.security.quantity !== "number") {
        return [];
      }

      const quantity = item.security.quantity;
      const resultRows = [];

      const fromName = item.holder_from
        ? item.holder_from.name
        : item.emitent?.full_name || "";

      // Negative (from)
      resultRows.push({
        ...item,
        displayQuantity: -quantity,
        displayHolder: fromName
      });

      // Positive (to)
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

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Пример транзакций</h4>
          </CardHeader>
          <CardBody>
            {/* 
              Pass the following props to enable date filtering:
               - filterData (true or false)
               - onDateRangeChange (the callback)
               - dateField (the name of the field that holds the date in your data; here "contract_date")
            */}
            <CustomTable
              tableName="Транзакции"
              tableHead={tableHeaders}
              tableData={transformed}
              searchKey="id"
              filterData={true}
              onDateRangeChange={handleDateRangeChange}
              dateField="contract_date"
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
