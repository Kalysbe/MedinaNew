import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Modal, Typography, Paper } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import { fetchHolderTypeList, fetchUpdateHolderType, fetchCreateHolderType } from "redux/actions/reference";
import Swal from 'sweetalert2';
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
  const DistrictList = useSelector((state) => state.reference?.holderTypeList || []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDistrictId, setEditDistrictId] = useState(null);
  const [regionData, setRegionData] = useState({ name: "" });
  const [localDistrictList, setLocalDistrictList] = useState(DistrictList);

  useEffect(() => {
    dispatch(fetchHolderTypeList());
  }, [dispatch]);

  useEffect(() => {
    setLocalDistrictList(DistrictList);
  }, [DistrictList]);

  const tableHeaders = [
    { Header: "Наименование", accessor: "name", sortType: "basic" },
    {
      Header: "Действия",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Box display="flex">
          <Button variant="outlined" color="warning" onClick={() => handleEditClick(row.original)}>
            Изменить
          </Button>
        </Box>
      ),
    },
  ];

  const handleEditClick = (region) => {
    setEditMode(true);
    setEditDistrictId(region.id);
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

  const handleConfirm = async (e) => {
    e.preventDefault(); // Предотвращает перезагрузку страницы при отправке формы
    try {
      let response;
      if (editMode && editDistrictId) {
        response = await dispatch(fetchUpdateHolderType({ id: editDistrictId, data: regionData }));
        setLocalDistrictList((prevList) =>
          prevList.map((district) =>
            district.id === editDistrictId ? { ...district, ...regionData } : district
          )
        );
      } else {
        response = await dispatch(fetchCreateHolderType(regionData));
        setLocalDistrictList((prevList) => [...prevList, { ...regionData, id: response.id }]);
      }

      if (response.error) {
      
        throw new Error(response.payload.message || 'Неизвестная ошибка');
    }

      Swal.fire({
        title: 'Успешно!',
        text: 'Данные успешно отправлены',
        icon: 'success',
        confirmButtonText: 'Ок',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('success');
        }
      });
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);

      Swal.fire({
        title: 'Ошибка!',
        text: error.message || 'Произошла ошибка при отправке данных на сервер',
        icon: 'error',
        confirmButtonText: 'Ок',
      });
    } finally {
      handleCloseModal();
    }
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
        <Button color="info" onClick={handleAddClick}>
          Добавить
        </Button>
      </Box>
      <CustomTable tableName="Категории акционеров" tableHead={tableHeaders} tableData={localDistrictList} searchKey="name" />

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper className={classes.modalContainer}>
          <form onSubmit={handleConfirm}>
            <Typography variant="h6">
              {editMode ? "Изменить категорию" : "Добавить категорию"}
            </Typography>
            <TextField
              label="Название категории"
              fullWidth
              value={regionData.name}
              onChange={handleInputChange}
              margin="normal"
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseModal} color="rose">
                Отмена
              </Button>
              <Button type="submit" color="info">
                {editMode ? "Сохранить" : "Добавить"}
              </Button>
         
            </Box>
          </form>
        </Paper>
      </Modal>
    </div>
  );
}
