import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Assignment from "@material-ui/icons/Assignment";
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

  // При монтировании компонента (или при изменении Emitent.id) выполняем первоначальный запрос
  useEffect(() => {
    if (Emitent?.id) {
      dispatch(fetchTransactions({eid:Emitent.id}));
    }
  }, [Emitent, dispatch]);

  // Колбэк для фильтрации по датам (по выбору в дочернем компоненте)
  const handleFilterChange = ({ startDate, endDate }) => {
    if (Emitent?.id && startDate && endDate) {
      console.log(startDate,endDate)
      // Экшен fetchTransactions должен принимать emitent.id, startDate и endDate,
      // формируя запрос вида:
      // http://localhost:5050/transactions?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
      dispatch(fetchTransactions({eid:Emitent.id, startDate: startDate,endDate: endDate}));
    }
  };

  // Преобразование полученных транзакций для отображения в таблице.
  // Например, создаём две строки: для отправителя (отрицательное количество) и для получателя (положительное).
  function transformData(items) {
    if (!items) return [];
    return items.flatMap((item) => {
      if (!item.security || typeof item.security.quantity !== "number") {
        return [];
      }

      const quantity = item.security.quantity;
      const resultRows = [];

      // Строка "отправитель" – отрицательное количество.
      const fromName = item.holder_from
        ? item.holder_from.name
        : item.emitent?.full_name || "";
      resultRows.push({
        ...item,
        displayQuantity: -quantity,
        displayHolder: fromName
      });

      // Строка "получатель" – положительное количество, если присутствует holder_to.
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

  // Трансформируем данные, полученные из Redux
  const transformed = transformData(Transactions?.items || []);

  // Определяем колонки для react-table.
  // Обратите внимание: поиск будет производиться локально по полю "id".
  const tableHeaders = [
    {
      Header: "№",
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
      accessor: "contract_date",
      sortType: "basic",
      // Пример форматирования даты (убедитесь, что window.formatDate определена)
      Cell: ({ value }) => window.formatDate(value)
    },
    {
      Header: "Операция",
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
           <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        
                   <Button
                     variant="contained"
                     color="warning"
                     size="small"
                   >Печать</Button>
     
               
             </div>
            {/* Передаём в дочерний компонент:
                - данные для таблицы (уже отфильтрованные на сервере по датам)
                - локальный поиск будет выполнен внутри CustomTable
                - колбэк для серверной фильтрации по датам */}
            <CustomTable
              tableName="Транзакции"
              tableHead={tableHeaders}
              tableData={transformed}
              searchKey="id"
              filterDate={true}
              onFilterChange={handleFilterChange}
            />
        
      </GridItem>
    </GridContainer>
  );
}
