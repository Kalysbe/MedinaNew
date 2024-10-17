import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Modal, Button, Typography, Paper } from "@material-ui/core";
import { fetchDistrictList, fetchUpdateDistrict, fetchCreateDistrict } from "redux/actions/reference";
import CustomTable from "components/Table/CustomTable";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles((theme) => ({
  ...styles,
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    borderRadius: 8,
  },
}));

export default function RegionManager() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const DistrictList = useSelector((state) => state.reference?.districtList);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDistrictId, setEditDistrictId] = useState(null);
  const [regionData, setRegionData] = useState({ name: "" });

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
          <Button variant="outlined" color="info" onClick={() => handleEditClick(row.original)}>
            Изменить
          </Button>
        </Box>
      ),
    },
  ];

  const handleEditClick = (region) => {
    console.log(region.id)
    setEditMode(true);
    setEditDistrictId(region.id);
    console.log(editDistrictId,'id')
    setRegionData({ name: region.name });
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditMode(false);
    setRegionData({ name: "" });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setRegionData({ name: value });
  };

  const handleConfirm = () => {
    if (editMode && editDistrictId) {
      dispatch(fetchUpdateDistrict(editDistrictId, regionData));
    } else {
      dispatch(fetchCreateDistrict(regionData));
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditDistrictId(null);
    setRegionData({ name: "" });
  };

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button color="success" onClick={handleAddClick}>
          Добавить регион
        </Button>
      </Box>
      <CustomTable tableName="Регионы" tableHead={tableHeaders} tableData={DistrictList} searchKey="name" />
      
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper className={classes.modalContainer}>
          <Typography variant="h6">
            {editMode ? "Изменить регион" : "Добавить регион"}
          </Typography>
          <TextField
            label="Название региона"
            fullWidth
            value={regionData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleConfirm} color="primary">
              {editMode ? "Сохранить" : "Добавить"}
            </Button>
            <Button onClick={handleCloseModal} color="secondary">
              Отмена
            </Button>
          </Box>
        </Paper>
      </Modal>
    </div>
  );
}
