import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";
import PrintIcon from '@material-ui/icons/Print';
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import ReactToPrint from 'react-to-print';
import * as XLSX from 'xlsx';

const styles = {
  actionButtons: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    justifyContent: 'flex-end',
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
    padding: '8px 16px',
    minWidth: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }
};

const useStyles = makeStyles(styles);

export const ActionButtons = ({
  onAdd,
  onEdit,
  onBlock,
  onPrint,
  printRef,
  tableData,
  fileName = 'export',
  showAdd = true,
  showEdit = true,
  showBlock = true,
  showPrint = true,
  showExport = true,
}) => {
  const classes = useStyles();

  const handleExport = () => {
    if (!tableData) return;
    
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div className={classes.actionButtons}>
      {showAdd && onAdd && (
        <Button
          color="success"
          size="sm"
          startIcon={<AddIcon />}
          className={classes.button}
          onClick={onAdd}
        >
          Добавить
        </Button>
      )}
      
      {showEdit && onEdit && (
        <Button
          color="warning"
          size="sm"
          startIcon={<EditIcon />}
          className={classes.button}
          onClick={onEdit}
        >
          Корректировка
        </Button>
      )}
      
      {showBlock && onBlock && (
        <Button
          color="danger"
          size="sm"
          startIcon={<BlockIcon />}
          className={classes.button}
          onClick={onBlock}
        >
          Блокировать
        </Button>
      )}
      
      {showPrint && printRef && (
        <ReactToPrint
          trigger={() => (
            <Button
              color="info"
              size="sm"
              startIcon={<PrintIcon />}
              className={classes.button}
            >
              Печать
            </Button>
          )}
          content={() => printRef.current}
          pageStyle="@page { size: A4; margin: 10mm; }"
        />
      )}
      
      {showExport && tableData && (
        <Button
          color="info"
          size="sm"
          startIcon={<GetAppIcon />}
          className={classes.button}
          onClick={handleExport}
        >
          Excel
        </Button>
      )}
    </div>
  );
}; 