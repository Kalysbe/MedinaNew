import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SelectSearch from "react-select"; // Используем react-select для selectSearch
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

import { fetchAllHolders } from "redux/actions/holders";
import { fetchSecuritiesByEmitentId, fetchEmissionsByEmitentId } from "redux/actions/emissions";
import { fetchCreateTransaction, fetchOperationTypes } from "redux/actions/transactions";
import { fetchDocuments } from "redux/actions/documents";
import { transferTypes } from "constants/operations.js";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import DocumentSelectorModal from "views/Pages/Log/IncomingDocuments/DocumentModal.js";

const useStyles = makeStyles(styles);

export default function RegularForms() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // Получаем данные из Redux
  const Emitent = useSelector((state) => state.emitents.store);
  const holders = useSelector((state) => state.holders.holders);
  const { operationTypes } = useSelector((state) => state.transactions);
  const { emissions } = useSelector((state) => state.emissions);
  const { documentList } = useSelector((state) => state.documents);
  const DocumentList = useSelector((state) => state.documents?.documentList || []);

  // Локальные состояния для вычисляемых значений
  const [maxCount, setMaxCount] = useState(null);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localDocs, setLocalDocs] = useState(DocumentList);

  const [openDocModal, setOpenDocModal] = useState(false);

  useEffect(() => {
    setLocalDocs(DocumentList);
  }, [DocumentList]);

  // Карта опций для селектов
  const optionsMap = {
    holders: holders?.items || [],
    stocks: emissions?.items || [],
    typeOperations: operationTypes || [],
    documents: documentList || [],
  };

  // Массив-конфигурация обязательных полей
  const fieldsConfig = [
    {
      name: "operation_id",
      label: "Операция",
      component: "selectSearch",
      options: optionsMap.typeOperations,
      optionValueKey: "id",
      optionLabelKey: "name",
      grid: { xs: 12, sm: 12, md: 12 },
      validation: { required: "Операция обязательна" },
    },
    {
      name: "holder_from_id",
      label: "Кто отдает",
      component: "selectSearch",
      options: optionsMap.holders,
      optionValueKey: "id",
      optionLabelKey: "name",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Выберите отправителя" },
    },
    {
      name: "holder_to_id",
      label: "Кто принимает",
      component: "selectSearch",
      options: optionsMap.holders,
      optionValueKey: "id",
      optionLabelKey: "name",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Выберите получателя" },
    },
    {
      name: "emission_id",
      label: "Эмиссия",
      component: "select",
      options: optionsMap.stocks,
      optionValueKey: "id",
      // Для отображения используем свойство reg_number
      optionLabelKey: "reg_number",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Эмиссия обязательна" },
    },
    {
      name: "is_exchange",
      label: "Вид сделки",
      component: "select",
      options: [
        { value: true, label: "Биржевая" },
        { value: false, label: "Не биржевая" },
      ],
      optionValueKey: "value",
      optionLabelKey: "label",
      grid: { xs: 12, sm: 12, md: 6 },
      // Используем кастомную валидацию для boolean
      validation: {
        validate: value =>
          typeof value === "boolean" ? true : "Выберите вид сделки"
      },
    },
    {
      name: "emission",
      label: "Эмиссия (номер)",
      component: "input",
      type: "text",
      disabled: true,
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Эмиссия обязательна" },
    },
    {
      name: "quantity",
      label: "Количество" + (maxCount ? ` (Макс. ${maxCount})` : ""),
      component: "input",
      type: "number",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Количество обязательно" },
    },
    {
      name: "amount",
      label: "Сумма сделки",
      component: "input",
      type: "string",
      grid: { xs: 12, sm: 12, md: 6 },
      //   validation: {},
    },
    {
      name: "is_family",
      label: "Признак родственника",
      component: "select",
      options: [
        { value: true, label: "Да" },
        { value: false, label: "Нет" },
      ],
      optionValueKey: "value",
      optionLabelKey: "label",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: {
        validate: value =>
          typeof value === "boolean" ? true : "Поле обязательно"
      },
    },
    {
      name: "document_id",
      label: "Входящий документ",
      component: "selectModal",
      options: optionsMap.documents,
      optionValueKey: "id",
      optionLabelKey: "title",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Входящий документ обязателен" },
    },
    {
      name: "contract_date",
      label: "Дата операции",
      component: "datetime",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Дата операции обязательна" },
    },
  ];

  // Инициализация React Hook Form с дефолтными значениями (для boolean установим правильные типы)
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      operation_id: "",
      holder_from_id: "",
      holder_to_id: "",
      emission_id: "",
      is_exchange: true, // дефолтное значение
      emission: "",
      quantity: "",
      amount: "",
      is_family: false,  // дефолтное значение
      document_id: "",
      contract_date: new Date().toISOString().split("T")[0],
    },
  });

  // Отслеживаем изменения для динамической логики
  const watchedOperationId = watch("operation_id");
  const watchedEmissionId = watch("emission_id");
  const watchedQuantity = watch("quantity");
  const watchedHolderFromId = watch("holder_from_id");

  // Загрузка базовых данных при монтировании
  useEffect(() => {
    dispatch(fetchAllHolders());
    dispatch(fetchOperationTypes());
    dispatch(fetchDocuments(Emitent?.id));
  }, [dispatch, Emitent]);

  // Если выбрана операция 1 – запрашиваем эмиссии; иначе, если выбран отправитель – запрашиваем ценные бумаги
  useEffect(() => {
    if (watchedOperationId === 1) {
      dispatch(fetchEmissionsByEmitentId(Emitent?.id));
    } else if (watchedHolderFromId) {
      dispatch(fetchSecuritiesByEmitentId(watchedHolderFromId));
    }
  }, [watchedOperationId, watchedHolderFromId, dispatch, Emitent]);

  // При выборе эмиссии обновляем связанные поля: номер эмиссии, количество, сумму сделки, макс. количество и цену
  useEffect(() => {
    const newEmissionValue = emissions.items.find(
      (item) => item.id === watchedEmissionId
    );
    if (newEmissionValue && newEmissionValue.reg_number) {
      setValue("emission", newEmissionValue.reg_number);
      const qty = watchedOperationId === 11 ? newEmissionValue.blocked_count : newEmissionValue.count;
      setValue("quantity", qty);
      setValue("amount", qty * newEmissionValue.nominal);
      setMaxCount(watchedOperationId === 11 ? newEmissionValue.blocked_count : newEmissionValue.count);
      setPrice(newEmissionValue.nominal);
    }
  }, [watchedEmissionId, emissions, watchedOperationId, setValue]);

  // Пересчитываем сумму сделки при изменении количества
  useEffect(() => {
    if (price && watchedQuantity) {
      const newAmount = parseFloat((watchedQuantity * price).toFixed(2));
      setValue("amount", newAmount);
    }
  }, [watchedQuantity, price, setValue]);

  const handleDocumentSelect = (doc) => {
    setValue("document_id", doc.id);

    setLocalDocs((prevDocs) => {
      const exists = prevDocs.some((d) => d.id === doc.id);
      return exists ? prevDocs : [doc, ...prevDocs];
    });

    setOpenDocModal(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const emitent_id = Emitent?.id;
      let updatedData = { ...data };
      if (data.operation_id === 1 && data.holder_from_id) {
        const { holder_from_id, ...rest } = data;
        updatedData = rest;
      }
      const response = await dispatch(fetchCreateTransaction({ emitent_id, ...updatedData }));
      if (response.error) {
        throw new Error(response.payload.message || "Неизвестная ошибка");
      }
      const newId = response.payload.id;
      Swal.fire({
        title: "Успешно!",
        text: "Данные успешно отправлены",
        icon: "success",
        confirmButtonText: "Ок",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push(`/admin/transaction/${newId}`);
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Ошибка!",
        text: error.message || "Произошла ошибка при отправке данных на сервер",
        icon: "error",
        confirmButtonText: "Ок",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader color="info" icon>
        <CardIcon color="info">
          <MailOutline />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Передача</h4>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridContainer>
            {fieldsConfig.map(field => (
              <GridItem
                key={field.name}
                xs={field.grid?.xs || 12}
                sm={field.grid?.sm || 12}
                md={field.grid?.md || 12}
              >
                {field.component === "input" && (
                  <>
                    <CustomInput
                      labelText={field.label}
                      formControlProps={{
                        fullWidth: true,
                        error: Boolean(errors[field.name])
                      }}
                      inputProps={{
                        type: field.type || "text",
                        disabled: field.disabled || false,
                        ...register(field.name, field.validation)
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors[field.name] && (
                      <FormHelperText error>{errors[field.name].message}</FormHelperText>
                    )}
                  </>
                )}

                {field.component === "selectModal" && field.name === "document_id" && (
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel className={classes.selectLabel}>Входящий документ</InputLabel>
                    <Select
                      value={watch("document_id") || ""}
                      onClick={() => setOpenDocModal(true)}
                      readOnly
                      renderValue={() => {
                        const selected = localDocs.find(doc => doc.id === watch("document_id"));
                        return selected ? selected.title : "Выбрать документ";
                      }}
                    >
                      <MenuItem disabled value="">
                        Выбрать документ
                      </MenuItem>
                    </Select>

                    {errors[field.name] && (
                      <FormHelperText error>
                        {errors[field.name].message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}

                {field.component === "select" && (
                  <FormControl fullWidth className={classes.selectFormControl} error={Boolean(errors[field.name])}>
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
                          {field.options && field.options.map(opt => (
                            <MenuItem
                              key={opt[field.optionValueKey || "id"]}
                              value={opt[field.optionValueKey || "id"]}
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                            >
                              {opt[field.optionLabelKey || "name"] || opt.label || opt.title}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors[field.name] && (
                      <FormHelperText error>{errors[field.name].message}</FormHelperText>
                    )}
                  </FormControl>
                )}
                {field.component === "selectSearch" && (
                  <>
                    <InputLabel htmlFor={field.name} className={classes.selectLabel}>
                      {field.label}
                    </InputLabel>
                    <FormControl fullWidth className={classes.selectFormControl} error={Boolean(errors[field.name])}>
                      <Controller
                        name={field.name}
                        control={control}
                        rules={field.validation}
                        render={({ field: controllerField }) => {
                          const selectedOption = field.options.find(
                            option => option[field.optionValueKey || "id"] === controllerField.value
                          );
                          return (
                            <SelectSearch
                              {...controllerField}
                              options={field.options}
                              getOptionLabel={(option) =>
                                option[field.optionLabelKey || "name"] || option.label || option.title
                              }
                              getOptionValue={(option) =>
                                option[field.optionValueKey || "id"]
                              }
                              placeholder="Выберите"
                              value={selectedOption}
                              onChange={(selectedOption) => {
                                console.log("Выбранная опция: ", selectedOption);
                                controllerField.onChange(
                                  selectedOption ? selectedOption[field.optionValueKey || "id"] : ""
                                );
                              }}
                            />
                          );
                        }}
                      />
                      {errors[field.name] && (
                        <FormHelperText error>{errors[field.name].message}</FormHelperText>
                      )}
                    </FormControl>
                  </>
                )}
                {field.component === "datetime" && (
                  <>
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
                            inputProps={{ placeholder: field.label }}
                            closeOnSelect={true}
                            onChange={(date) => {
                              if (date && date.toISOString) {
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
                        <FormHelperText error>{errors[field.name].message}</FormHelperText>
                      )}
                    </FormControl>
                  </>
                )}
              </GridItem>
            ))}
          </GridContainer>
          <Button color="info" type="submit">
            {loading ? "Загрузка..." : "Сохранить"}
          </Button>
          <NavLink to={"/admin/dashboard"}>
            <Button>Закрыть</Button>
          </NavLink>
        </form>
      </CardBody>

      <DocumentSelectorModal
        open={openDocModal}
        onClose={() => setOpenDocModal(false)}
        onSelect={handleDocumentSelect}
        documents={DocumentList}
        emitentId={Emitent?.id}
      />
    </Card>
  );
}
