import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Modal, Typography, Paper } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import {
  fetchEmissionTypeList,
  fetchCreateEmissionType,
  fetchUpdateEmissionType,
} from "redux/actions/reference";
import Swal from "sweetalert2";
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

export default function EmissionTypeManager() {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Получаем список типов эмиссий из Redux
  const emissionTypeList = useSelector(
    (state) => state.reference?.emissionTypeList || []
  );

  // Состояния для управления модальным окном, режимом редактирования и данными текущего типа эмиссии
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editEmissionTypeId, setEditEmissionTypeId] = useState(null);
  const [emissionTypeData, setEmissionTypeData] = useState({ name: "" });

  // Локальный список типов эмиссий (если нужно локальное редактирование без мгновенного рефреша из бэка)
  const [localEmissionTypeList, setLocalEmissionTypeList] =
    useState(emissionTypeList);

  // Список обязательных полей
  const requiredFields = ["name"];

  // При первом рендере загружаем список типов эмиссий
  useEffect(() => {
    dispatch(fetchEmissionTypeList());
  }, [dispatch]);

  // Синхронизируем локальный стейт со стейтом из Redux
  useEffect(() => {
    setLocalEmissionTypeList(emissionTypeList);
  }, [emissionTypeList]);

  // Заголовки для таблицы (CustomTable)
  const tableHeaders = [
    {
      Header: "Наименование",
      accessor: "name",
      sortType: "basic",
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
            onClick={() => handleEditClick(row.original)}
          >
            Изменить
          </Button>
        </Box>
      ),
    },
  ];

  // Обработчик нажатия на кнопку "Изменить"
  const handleEditClick = (emissionType) => {
    setEditMode(true);
    setEditEmissionTypeId(emissionType.id);
    setEmissionTypeData({ name: emissionType.name });
    setModalOpen(true);
  };

  // Обработчик нажатия на кнопку "Добавить"
  const handleAddClick = () => {
    setEditMode(false);
    setEmissionTypeData({ name: "" });
    setModalOpen(true);
  };

  // Обработчик изменения поля ввода (название типа эмиссии)
  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmissionTypeData({ name: value });
  };

  // Обработчик подтверждения формы (сохранение/добавление)
  const handleConfirm = async (e) => {
    e.preventDefault(); // Предотвращает перезагрузку страницы при отправке формы

    // Валидация обязательных полей
    const missingFields = requiredFields.filter(
      (field) => !emissionTypeData[field] || !emissionTypeData[field].trim()
    );
    if (missingFields.length > 0) {
      Swal.fire({
        title: "Ошибка!",
        text: `Пожалуйста, заполните обязательные поля: ${missingFields.join(
          ", "
        )}`,
        icon: "warning",
        confirmButtonText: "Ок",
      });
      return;
    }

    try {
      let response;
      if (editMode && editEmissionTypeId) {
        // Редактирование
        response = await dispatch(
          fetchUpdateEmissionType({
            id: editEmissionTypeId,
            data: emissionTypeData,
          })
        );
        setLocalEmissionTypeList((prevList) =>
          prevList.map((item) =>
            item.id === editEmissionTypeId ? { ...item, ...emissionTypeData } : item
          )
        );
      } else {
        // Создание
        response = await dispatch(fetchCreateEmissionType(emissionTypeData));
        // Если бэк возвращает объект с новым ID
        if (response && response.id) {
          setLocalEmissionTypeList((prevList) => [
            ...prevList,
            { ...emissionTypeData, id: response.id },
          ]);
        }
      }

      Swal.fire({
        title: "Успешно!",
        text: "Данные успешно отправлены",
        icon: "success",
        confirmButtonText: "Ок",
      });
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      Swal.fire({
        title: "Ошибка!",
        text:
          error.message || "Произошла ошибка при отправке данных на сервер",
        icon: "error",
        confirmButtonText: "Ок",
      });
    } finally {
      handleCloseModal();
    }
  };

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditEmissionTypeId(null);
    setEmissionTypeData({ name: "" });
  };

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button color="info" onClick={handleAddClick}>
          Добавить
        </Button>
      </Box>

      {/* Компонент таблицы с данными о типах эмиссий */}
      <CustomTable
        tableName="Типы эмиссий"
        tableHead={tableHeaders}
        tableData={localEmissionTypeList}
        searchKey="name"
      />

      {/* Модальное окно для создания/редактирования */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper className={classes.modalContainer}>
          <form onSubmit={handleConfirm}>
            <Typography variant="h6">
              {editMode ? "Изменить тип эмиссии" : "Добавить тип эмиссии"}
            </Typography>
            <TextField
              required
              label="Название типа эмиссии"
              fullWidth
              value={emissionTypeData.name}
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
