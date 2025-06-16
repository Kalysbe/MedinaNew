import React, { useState, useRef,forwardRef , useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import ReactToPrint from "react-to-print";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "redux/actions/transactions";
import CustomTable from "components/Table/CustomTable";
import TransactionsReport from "views/Reports/Transactions";
const styles = {
  customCardContentClass: {
    paddingLeft: "0",
    paddingRight: "0",
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

export default function RegularTables() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const Emitent = useSelector((state) => state.emitents?.store);
  const Transactions = useSelector((state) => state.transactions?.transactions);

  const printRef = useRef();

  useEffect(() => {
    if (Emitent?.id) {
      dispatch(fetchTransactions({ eid: Emitent.id }));
    }
  }, [Emitent, dispatch]);

  const handleFilterChange = ({ startDate, endDate }) => {
    if (Emitent?.id && startDate && endDate) {
      dispatch(fetchTransactions({
        eid: Emitent.id,
        startDate: startDate,
        endDate: endDate
      }));
    }
  };

  function transformData(items) {
    if (!items) return [];

    let pairCounter = 0; // счётчик пар

    return items.flatMap((item) => {
      if (!item || typeof item.quantity !== "number") {
        return [];
      }

      const quantity = item.quantity;
      const fromName = item.holder_from
        ? item.holder_from.name
        : item.emitent?.full_name || "";

      // Каждая транзакция => +1 к счётчику пар
      const currentPairIndex = pairCounter;
      pairCounter += 1;

      // 1) Строка «отправитель»
      const fromRow = {
        ...item,
        displayQuantity: -quantity,
        displayHolder: fromName,
        pairIndex: currentPairIndex, // обе строки одной транзакции = один pairIndex
      };

      // 2) Строка «получатель» (если есть)
      if (item.holder_to) {
        const toRow = {
          ...item,
          displayQuantity: quantity,
          displayHolder: item.holder_to.name,
          pairIndex: currentPairIndex,
        };
        return [fromRow, toRow];
      }

      // Если holder_to нет, возвращаем только 1 строку
      return [fromRow];
    });
  }

  const transformed = transformData(Transactions?.items || []);

  // Исходные колонки (на экране)
  const tableHeaders = [
    {
      Header: "№",
      accessor: (_, rowIndex) => rowIndex + 1,
      Cell: ({ value }) => <strong>{value}</strong>,
      sortType: "basic",
    },
    {
      Header: "Номер",
      accessor: "id",
      sortType: "basic",
    },
    {
      Header: "Дата",
      accessor: "contract_date",
      sortType: "basic",
      Cell: ({ value }) => (window.formatDate ? window.formatDate(value) : value),
    },
    {
      Header: "Операция",
      accessor: "operation.name",
      sortType: "basic",
    },
    {
      Header: "Количество",
      accessor: "displayQuantity",
      sortType: "basic",
    },
    {
      Header: "Владелец",
      accessor: "displayHolder",
      sortType: "basic",
    },
    {
      Header: "Действия", // То, что нужно убрать при печати
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <NavLink to={`/admin/transaction/${row.original.id}`}>
          <Button variant="outlined" color="info">
            Открыть
          </Button>
        </NavLink>
      ),
    },
  ];

  // Колонки для печати (убираем "Действия")
  const tableHeadersPrint = tableHeaders.filter(
    (col) => col.Header !== "Действия"
  );

  // State, чтобы переключать колонки
  const [currentHeaders, setCurrentHeaders] = useState(tableHeaders);

  // Перед печатью: подменяем колонки на "печатные"
  const onBeforeGetContent = () => {
    setCurrentHeaders(tableHeadersPrint);
    return Promise.resolve();
  };


  // После печати: возвращаем исходные
  const onAfterPrint = () => {
    setCurrentHeaders(tableHeaders);
  };

  const handleExportClick = () => {
    if (printRef.current?.exportToExcel) {
      printRef.current.exportToExcel(); // вызываем метод из дочернего компонента
    }
  };



  return (
    <GridContainer>
      <GridItem xs={12}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
              style={{ display: "flex", gap: "1rem",height:'40px' }}
                variant="contained"
                color="success"
                size="small"
                onClick={handleExportClick}
              >Excel</Button>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="warning" size="small">
                Печать
              </Button>
            )}
            content={() => printRef.current?.getContent()}
            onBeforeGetContent={onBeforeGetContent}
            onAfterPrint={onAfterPrint}
          />
        </div>
          {/* <div  ref={printRef}>1</div> */}
        {/* ВАЖНО: ref={printRef} и передаём currentHeaders вместо tableHeaders */}
        <div className="print-only">
        <TransactionsReport  
          ref={printRef}   
          tableHead={currentHeaders}  
          tableData={transformed}
          // exportToExcel={exportToExcel}
          />
        </div>

        <CustomTable
          // ref={printRef}
          tableName="Транзакции"
          tableHead={currentHeaders}  
          tableData={transformed}
          searchKey="id"
          filterDate={true}
          onFilterChange={handleFilterChange}
          stripedPairs={true}
        />
      </GridItem>
    </GridContainer>
  );
}
