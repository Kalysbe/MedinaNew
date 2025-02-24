import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import moment from "moment";
import "moment/locale/ru";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import MailOutline from "@material-ui/icons/MailOutline";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";

import { fetchEmissionTypeList } from "redux/actions/reference";
import { fetchCreateDividend } from "redux/actions/dividend";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function DividendCalculation() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    // Настройка локали для moment
    moment.locale("ru");

    // Получаем данные из Redux
    const Emitent = useSelector((state) => state.emitents.store);
    const EmissionTypeList = useSelector(
        (state) => state.reference?.emissionTypeList || []
    );


    useEffect(() => {
        dispatch(fetchEmissionTypeList());
    }, [dispatch]);

    // Массив-конфигурация полей формы
    // Поля: title (необязательно, можно задать фиксированное значение), 
    // month_year, type (категория акционеров), emission_type_id, 
    // date_close_reestr, share_price, percent
    const fields = [
        {
            name: "title",
            label: "Заголовок",
            type: "text",
            component: "input",
            grid: { xs: 12, sm: 12, md: 6 },
            validation: { required: "Заголовок обязателен"},
        },
        {
            name: "month_year",
            label: "Месяц и год расчёта",
            component: "datetime",
            grid: { xs: 12, sm: 12, md: 6 },
            validation: { required: "Месяц и год расчёта обязательны" },
            // defaultValue будет устанавливаться через defaultValues в useForm
            customOnChange: (value) => moment(value).format("MM_YYYY"),
        },
        {
            name: "type",
            label: "Категория акционеров",
            component: "select",
            grid: { xs: 12, sm: 12, md: 6 },
            options: [
                { value: 1, label: "Физические нерезиденты" },
                { value: 2, label: "Юридический" },
            ],
            validation: { required: "Категория акционеров обязательна" },
            optionValueKey: "value",
            optionLabelKey: "label",
        },
        {
            name: "emission_type",
            label: "Тип эмиссии",
            component: "select",
            grid: { xs: 12, sm: 12, md: 6 },
            options: EmissionTypeList,
            validation: { required: "Тип эмиссии обязателен" },
            optionValueKey: "id",
            optionLabelKey: "name",
        },
        {
            name: "date_close_reestr",
            label: "Дата вывода",
            component: "datetime",
            grid: { xs: 12, sm: 12, md: 6 },
            validation: { required: "Дата вывода обязательна" },
            // defaultValue будет задаваться через defaultValues
        },
        {
            name: "share_price",
            label: "Расценка на одну акцию",
            type: "number",
            component: "input",
            grid: { xs: 12, sm: 12, md: 6 },
            validation: { required: "Расценка обязательна", valueAsNumber: true },
        },
        {
            name: "percent",
            label: "Процент удержания",
            type: "number",
            component: "input",
            grid: { xs: 12, sm: 12, md: 6 },
            validation: { required: "Процент обязателен", valueAsNumber: true },
        },
    ];

    // Дефолтные значения для полей
    const defaultValues = {
        month_year: moment().format("MM_YYYY"),
        type: "",
        emission_type: "",
        date_close_reestr: new Date().toISOString().split("T")[0],
        share_price: "",
        percent: "",
    };

    // Инициализируем React Hook Form
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        try {
            const response = await dispatch(
                fetchCreateDividend({ emitent_id: Emitent?.id, ...data })
            );
            if (response.error) {
                throw new Error(response.payload.message || "Неизвестная ошибка");
            }
            const newId = response.payload.dividend.id;
            Swal.fire({
                title: "Успешно!",
                text: "Данные успешно отправлены",
                icon: "success",
                confirmButtonText: "Ок",
            }).then((result) => {
                if (result.isConfirmed) {
                    history.push(`/admin/dividend/${newId}`);
                }
            });
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            Swal.fire({
                title: "Ошибка!",
                text:
                    error.message ||
                    "Произошла ошибка при отправке данных на сервер",
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
                <h4 className={classes.cardIconTitle}>Расчет дивиденда</h4>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <GridContainer>
                        {fields.map((field) => {
                            // Для input-компонентов получаем текущее значение через watch
                            const fieldValue = watch(field.name);
                            if (field.component === "input") {
                                return (
                                    <GridItem
                                        key={field.name}
                                        xs={field.grid?.xs || 12}
                                        sm={field.grid?.sm || 12}
                                        md={field.grid?.md || 12}
                                    >
                                        <CustomInput
                                            labelText={field.label}
                                            formControlProps={{
                                                fullWidth: true,
                                                error: Boolean(errors[field.name]),
                                            }}
                                            inputProps={{
                                                type: field.type || "text",
                                                ...register(field.name, field.validation),
                                            }}
                                            InputLabelProps={{ shrink: Boolean(fieldValue) }}
                                        />
                                        {errors[field.name] && (
                                            <FormHelperText error>
                                                {errors[field.name].message}
                                            </FormHelperText>
                                        )}
                                    </GridItem>
                                );
                            } else if (field.component === "select") {
                                return (
                                    <GridItem
                                        key={field.name}
                                        xs={field.grid?.xs || 12}
                                        sm={field.grid?.sm || 12}
                                        md={field.grid?.md || 12}
                                    >
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
                                                        MenuProps={{ className: classes.selectMenu }}
                                                        classes={{ select: classes.select }}
                                                        inputProps={{ id: field.name }}
                                                    >
                                                        {field.options &&
                                                            field.options.map((opt) => (
                                                                <MenuItem
                                                                    key={opt[field.optionValueKey || "id"]}
                                                                    value={opt[field.optionValueKey || "id"]}
                                                                >
                                                                    {opt[field.optionLabelKey || "name"] || opt.label || opt.title}
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
                                    </GridItem>
                                );
                            } else if (field.component === "datetime") {
                                return (
                                    <GridItem
                                        key={field.name}
                                        xs={field.grid?.xs || 12}
                                        sm={field.grid?.sm || 12}
                                        md={field.grid?.md || 12}
                                    >
                                        <InputLabel className={classes.label}>{field.label}</InputLabel>
                                        <FormControl fullWidth error={Boolean(errors[field.name])}>
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                rules={field.validation}
                                                render={({ field: controllerField }) => (
                                                    <Datetime
                                                        {...controllerField}
                                                        timeFormat={false}
                                                        dateFormat="DD-MM-YYYY"
                                                        inputProps={{ placeholder: "Нажмите, чтобы выбрать дату" }}
                                                        closeOnSelect={true}
                                                        onChange={(date) => {
                                                            // Если поле month_year, применяем кастомное форматирование
                                                            if (field.name === "month_year" && date) {
                                                                controllerField.onChange(moment(date).format("MM_YYYY"));
                                                            } else if (date && date.toISOString) {
                                                                controllerField.onChange(date.toISOString().split("T")[0]);
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
                                    </GridItem>
                                );
                            }
                            return null;
                        })}
                    </GridContainer>
                    <NavLink to={"/admin/dividends"}>
                        <Button color="rose">Закрыть</Button>
                    </NavLink>
                    <Button color="info" type="submit">
                        Расчитать
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}

