import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import CustomTable from "components/Table/CustomTable";
import CustomInput from "components/CustomInput/CustomInput.js";
import { fetchDistrictList, fetchUpdateDistrict, fetchCreateDistrict } from "redux/actions/reference";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);

export default function RegionManager() {
  const classes = useStyles();
  const dispatch = useDispatch();

  
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDistrictId, setEditDistrictId] = useState(null);
  const [regionData, setRegionData] = useState({ name: ""});

  const DistrictList = useSelector((state) => state.reference?.districtList);

  useEffect(() => {
    dispatch(fetchDistrictList());
  }, [dispatch]);

  const tableHeaders = [
    { Header: "Наименование", accessor: "name", sortType: "basic" },
    {
      Header: "Действия",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Box display="flex">
          <Button variant="outlined" color="info" onClick={() => showInputAlert(row.original)}>
            Изменить
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    if(editMode) {
      setAlert(
        <SweetAlert
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title={editMode ? "Изменить регион" : "Добавить регион"}
          onConfirm={handleInputConfirm}
          onCancel={hideAlert}
          confirmBtnCssClass={`${classes.button} ${classes.info}`}
          cancelBtnCssClass={`${classes.button} ${classes.danger}`}
        >
          <Box>
           
               <CustomInput
                                labelText='Название региона'
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: event => {
                                      handleInputChange(event)
                                    },
                                    type: 'text',
                                    name: 'name',
                                    value: regionData['name'],
                                }}

                            />
          </Box>
        </SweetAlert>
      );
    }
  }, [editMode]);

  const showInputAlert = (region = {}) => {
    const isEditMode = !!region.id;
    setEditMode(isEditMode);
    setEditDistrictId(isEditMode ? region.id : null);

    if(isEditMode) {
     
      setRegionData(region)
      console.log(regionData)
    }


  };

  const handleInputChange = (e) => {
    

    const { name, value, type } = e.target;
    console.log(name,value)
  
    const newValue = type === 'number' ? Number(value) : value;
    console.log(newValue)
    setRegionData((prevData) => ({
        ...prevData,
        [name]: newValue,
    }));
  };

  const handleInputConfirm = () => {
    if (editMode && editDistrictId) {
      dispatch(fetchUpdateDistrict(editDistrictId, regionData));
    } else {
      dispatch(fetchCreateDistrict(regionData));
    }
    hideAlert();
  };

  const hideAlert = () => {
    setAlert(null);
    setEditMode(false);
    setEditDistrictId(null);
    setRegionData({ name: "" });
  };

  return (
    <div>
      {alert}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button color="success" onClick={() => showInputAlert()}>
          Добавить регион
        </Button>
      </Box>
      <CustomTable tableName="Регионы" tableHead={tableHeaders} tableData={DistrictList} searchKey="name" />
    </div>
  );
}
