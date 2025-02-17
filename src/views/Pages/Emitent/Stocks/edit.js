import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import { fetchAddEmitentEmissions } from "redux/actions/emitents";

import Swal from "sweetalert2";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function RegularForms() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const Emitent = useSelector((state) => state.emitents?.store);

  // Поля формы
  const [formData, setFormData] = useState({
    reg_number: "",
    nominal: "",
    start_count: "",
    release_date: "",
    document_id: "", // если потребуется обязательное поле, можно добавить его в список ниже
  });

  // Объект с ошибками для полей
  const [errors, setErrors] = useState({});

  // Список обязательных полей
  const requiredFields = ["reg_number", "nominal", "start_count", "release_date", "document_id"];

  // При первом рендере устанавливаем текущую дату для release_date, если оно еще не заполнено
  useEffect(() => {
    if (formData["release_date"]) return;
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${currentDate.getFullYear()}`;
    handleChangeDate("release_date", formattedDate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Обработчик изменения для обычных инпутов
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" && value === "" ? "" : type === "number" ? Number(value) : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    // Если поле стало заполненным, убираем ошибку
    if (errors[name] && newValue.toString().trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  // Обработчик для изменения даты
  const handleChangeDate = (name, value) => {
    const newValue = value instanceof Date ? value.toISOString().split("T")[0] : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    if (errors[name] && newValue && newValue.toString().trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  // Валидация формы перед отправкой
  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "Это поле обязательно";
      }
    });
    return newErrors;
  };

  const onSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        title: "Ошибка!",
        text: "Пожалуйста, заполните обязательные поля",
        icon: "warning",
        confirmButtonText: "Ок",
      });
      return;
    }
    try {
      const response = await dispatch(fetchAddEmitentEmissions({ emitent_id: Emitent?.id, ...formData }));

      if (response.error) {
        // Если произошла ошибка, выбрасываем исключение
        throw new Error(response.payload.message || "Неизвестная ошибка");
      }

      Swal.fire({
        title: "Успешно!",
        text: "Данные успешно отправлены",
        icon: "success",
        confirmButtonText: "Ок",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push(`/admin/emitent-stocks`);
        }
      });
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      Swal.fire({
        title: "Ошибка!",
        text: error.message || "Произошла ошибка при отправке данных на сервер",
        icon: "error",
        confirmButtonText: "Ок",
      });
    }
  };

  const onClose = () => {
    // Можно добавить очистку или другой функционал при закрытии
  };

  return (
    <Card>
      <CardHeader color="info" icon>
        <CardIcon color="info">
          <MailOutline />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Новая эмиссия</h4>
      </CardHeader>
      <CardBody>
        <GridContainer>
          <GridItem xs={6} sm={6} md={4}>
            <CustomInput
              labelText="Регистрационный номер"
              formControlProps={{
                fullWidth: true,
                error: Boolean(errors.reg_number),
              }}
              inputProps={{
                onChange: handleChange,
                name: "reg_number",
                type: "text",
                value: formData["reg_number"],
              }}
            />
            {errors.reg_number && (
              <FormHelperText error>{errors.reg_number}</FormHelperText>
            )}
          </GridItem>

          <GridItem xs={6} sm={6} md={4}>
            <CustomInput
              labelText="Стоимость"
              formControlProps={{
                fullWidth: true,
                error: Boolean(errors.nominal),
              }}
              inputProps={{
                onChange: handleChange,
                name: "nominal",
                type: "number",
                value: formData["nominal"],
              }}
            />
            {errors.nominal && (
              <FormHelperText error>{errors.nominal}</FormHelperText>
            )}
          </GridItem>

          <GridItem xs={6} sm={6} md={4}>
            <CustomInput
              labelText="Количество"
              formControlProps={{
                fullWidth: true,
                error: Boolean(errors.start_count),
              }}
              inputProps={{
                onChange: handleChange,
                name: "start_count",
                type: "number",
                value: formData["start_count"],
              }}
            />
            {errors.start_count && (
              <FormHelperText error>{errors.start_count}</FormHelperText>
            )}
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <FormControl fullWidth className={classes.selectFormControl} error={Boolean(errors.document_id)}>
              <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
                Входящий документ
              </InputLabel>
              <Select
                MenuProps={{
                  className: classes.selectMenu,
                }}
                classes={{
                  select: classes.select,
                }}
                name="document_id"
                value={formData["document_id"]}
                onChange={handleChange}
              >
                {/* {documentList.map(opt => (
                  <MenuItem
                    key={opt.id}
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value={opt.id}
                  >
                    {opt.title}
                  </MenuItem>
                ))} */}
              </Select>
              {errors.document_id && (
                <FormHelperText error>{errors.document_id}</FormHelperText>
              )}
            </FormControl>
          </GridItem>

          <GridItem xs={6} sm={6} md={4}>
            <InputLabel className={classes.label}>Дата выпуска</InputLabel>
            <br />
            <FormControl fullWidth error={Boolean(errors.release_date)}>
              <Datetime
                value={formData["release_date"]}
                onChange={(date) => handleChangeDate("release_date", date)}
                timeFormat={false}
                inputProps={{ placeholder: "Нажмите чтобы выбрать дату" }}
                closeOnSelect={true}
              />
              {errors.release_date && (
                <FormHelperText error>{errors.release_date}</FormHelperText>
              )}
            </FormControl>
          </GridItem>
        </GridContainer>
        <Button color="info" onClick={onSubmit}>
          Сохранить
        </Button>
        <NavLink to={"/admin/emitent-stocks/"}>
          <Button onClick={onClose}>Закрыть</Button>
        </NavLink>
      </CardBody>
    </Card>
  );
}
