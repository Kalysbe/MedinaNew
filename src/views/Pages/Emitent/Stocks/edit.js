import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import MailOutline from "@material-ui/icons/MailOutline";
import Swal from "sweetalert2";

import { useForm, Controller } from "react-hook-form";
import { fetchAddEmitentEmissions } from "redux/actions/emitents";
import { fetchEmissionTypeList } from "redux/actions/reference";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function RegularForms() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const Emitent = useSelector((state) => state.emitents?.store);
  const EmissionTypeList = useSelector(
    (state) => state.reference?.emissionTypeList || []
  );

  // Загружаем список типов эмиссии
  useEffect(() => {
    dispatch(fetchEmissionTypeList());
  }, [dispatch]);

  // Устанавливаем сегодняшнюю дату в формате ISO (YYYY-MM-DD)
  const currentDate = new Date();
  const defaultReleaseDate = currentDate.toISOString().split("T")[0];

  // Определяем конфигурацию всех полей формы
  const fields = [
    {
      name: "reg_number",
      label: "Регистрационный номер",
      type: "text",
      component: "input",
      gridSize: { xs: 6, sm: 6, md: 4 },
      validation: { required: "Регистрационный номер обязателен" },
    },
    {
      name: "nominal",
      label: "Стоимость",
      type: "number",
      component: "input",
      gridSize: { xs: 6, sm: 6, md: 4 },
      validation: { required: "Стоимость обязательна", valueAsNumber: true },
    },
    {
      name: "start_count",
      label: "Количество",
      type: "number",
      component: "input",
      gridSize: { xs: 6, sm: 6, md: 4 },
      validation: { required: "Количество обязательно", valueAsNumber: true },
    },
    {
      name: "type_id",
      label: "Тип эмиссии",
      component: "select",
      gridSize: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Тип эмиссии обязателен" },
    },
    {
      name: "release_date",
      label: "Дата выпуска",
      component: "datetime",
      gridSize: { xs: 6, sm: 6, md: 4 },
      validation: { required: "Дата выпуска обязательна" },
      // Для release_date задаем значение по умолчанию
      defaultValue: defaultReleaseDate,
    },
  ];

  // Инициализируем React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reg_number: "",
      nominal: "",
      start_count: "",
      type_id: "",
      release_date: defaultReleaseDate,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        fetchAddEmitentEmissions({ emitent_id: Emitent?.id, ...data })
      );

      if (response.error) {
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
        text:
          error.message || "Произошла ошибка при отправке данных на сервер",
        icon: "error",
        confirmButtonText: "Ок",
      });
    }
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridContainer>
            {fields.map((field) => (
              <GridItem
                key={field.name}
                xs={field.gridSize?.xs || 12}
                sm={field.gridSize?.sm || 12}
                md={field.gridSize?.md || 12}
              >
                {field.component === "input" && (
                  <>
                    <CustomInput
                      labelText={field.label}
                      formControlProps={{
                        fullWidth: true,
                        error: Boolean(errors[field.name]),
                      }}
                      inputProps={{
                        ...register(field.name, field.validation),
                        type: field.type,
                      }}
                    />
                    {errors[field.name] && (
                      <FormHelperText error>
                        {errors[field.name].message}
                      </FormHelperText>
                    )}
                  </>
                )}

                {field.component === "select" && (
                  <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                    error={Boolean(errors[field.name])}
                  >
                    <InputLabel htmlFor={field.name} className={classes.selectLabel}>
                      {field.label}
                    </InputLabel>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={field.validation}
                      render={({ field: controllerField }) => (
                        <Select
                          {...controllerField}
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          inputProps={{
                            id: field.name,
                          }}
                        >
                          {EmissionTypeList.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>
                              {opt.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors[field.name] && (
                      <FormHelperText error>
                        {errors[field.name].message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}

                {field.component === "datetime" && (
                  <>
                    <InputLabel className={classes.label}>
                      {field.label}
                    </InputLabel>
                    <FormControl fullWidth error={Boolean(errors[field.name])}>

                      <Controller
                        name={field.name}
                        control={control}
                        rules={field.validation}
                        render={({ field: controllerField }) => (
                          <Datetime
                            {...controllerField}
                            timeFormat={false}
                            inputProps={{
                              placeholder: "Нажмите чтобы выбрать дату",
                            }}
                            closeOnSelect={true}
                            onChange={(date) => {
                              if (date && date.toISOString) {
                                controllerField.onChange(
                                  date.toISOString().split("T")[0]
                                );
                              } else {
                                controllerField.onChange(date);
                              }
                            }}
                            value={controllerField.value}
                          />
                        )}
                      />
                      {errors[field.name] && (
                        <FormHelperText error>
                          {errors[field.name].message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </>
                )}
              </GridItem>
            ))}
          </GridContainer>
          <Button color="info" type="submit">
            Сохранить
          </Button>
          <NavLink to={"/admin/emitent-stocks/"}>
            <Button>Закрыть</Button>
          </NavLink>
        </form>
      </CardBody>
    </Card>
  );
}
