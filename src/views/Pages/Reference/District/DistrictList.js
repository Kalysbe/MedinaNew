import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import CustomTable from "components/Table/CustomTable";
import { fetchDistrictList, fetchUpdateDistrict, fetchCreateDistrict } from "redux/actions/reference";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);

export default function RegionManager() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [alert, setAlert] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editDistrictId, setEditDistrictId] = useState(null);

  useEffect(() => {
    dispatch(fetchDistrictList());
  }, [dispatch]);

  const DistrictList = useSelector(state => state.reference?.districtList);

  const tableHeaders = [
    {
      Header: "Наименование",
      accessor: "name",
      sortType: "basic"
    },
    {
      Header: "Действия",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Box display="flex">
          <Button
            variant="outlined"
            color="warning"
            onClick={() => showInputAlert(row.original.id, row.original.name)}
          >
            Изменить
          </Button>
        </Box>
      )
    }
  ];

  const showInputAlert = (id = null, name = "") => {
   
    setEditMode(true); // Устанавливаем режим редактирования, если передан id
    setEditDistrictId(id); // Устанавливаем id редактируемого региона
    setInputValue(name); // Устанавливаем текущее имя региона в поле ввода
    console.log(id,'ud',editMode)
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title={editMode ? `Изменить регион ${name}` : "Добавить регион"}
        inputValue={name} // Отображаем текущее имя региона в модальном окне
        onConfirm={handleInputConfirm}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
        cancelBtnCssClass={classes.button + " " + classes.danger}
      />
    );
  };

  const handleInputConfirm = (newName) => {
    if (editMode && editDistrictId) {
      dispatch(fetchUpdateDistrict(editDistrictId, newName));
    } else {
      dispatch(fetchCreateDistrict(newName));
    }
    hideAlert();
  };

  const hideAlert = () => {
    setAlert(null);
    // setEditMode(false);
    setEditDistrictId(null);
    setInputValue("");
  };

  return (
    <div>
      {alert}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button color="info" onClick={() => showInputAlert()}>
          Добавить регион
        </Button>
      </Box>
      <CustomTable
        tableName="Регионы"
        tableHead={tableHeaders}
        tableData={DistrictList}
        searchKey="name"
      />
    </div>
  );
}
