import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SelectSearch from "react-select";
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

import { fetchAllHolders, fetchHolders, fetchBlockedSecuritiesHolders } from "redux/actions/holders";
import { fetchEmissionsByEmitentId, fetchSecuritiesByHolderIdEmitentId, fetchBlockedSecuritiesEmissions } from "redux/actions/emissions";
import { fetchCreateTransaction, fetchOperationTypes } from "redux/actions/transactions";
import { fetchDocuments } from "redux/actions/documents";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import DocumentSelectorModal from "views/Pages/Log/IncomingDocuments/DocumentModal.js";

const useStyles = makeStyles(styles);

export default function RegularForms() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // Получаем данные из Redux
  const Emitent = useSelector((state) => state.emitents.store);
  const operationTypes = useSelector((state) => {
    const ops = state.transactions?.operationTypes;
    return Array.isArray(ops) ? ops : [];
  });
  const { emissions } = useSelector((state) => state.emissions);
  const { documentList } = useSelector((state) => state.documents);
  const DocumentList = useSelector((state) => state.documents?.documentList || []);

  // Локальные состояния
  const [maxCount, setMaxCount] = useState(null);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localDocs, setLocalDocs] = useState(DocumentList);
  const [openDocModal, setOpenDocModal] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      operation_id: "",
      holder_to_id: "",
      emission_id: "",
      is_exchange: true,
      emission: "",
      quantity: "",
      amount: "",
      is_family: false,
      document_id: "",
      contract_date: new Date().toISOString().split("T")[0],
    },
  });

  const watchedOperationId = watch("operation_id");
  const watchedEmissionId = watch("emission_id");
  const watchedQuantity = watch("quantity");
  const watchedHolderToId = watch("holder_to_id");

  // Селектор для holders в зависимости от операции
  const holders = useSelector((state) =>
    watchedOperationId === 29
      ? state.holders.allholders
      : state.holders.holders
  );

  // Обновление локальных документов
  useEffect(() => {
    if (DocumentList && DocumentList.length > 0) {
      setLocalDocs(DocumentList);
    }
  }, [DocumentList]);

  // Загрузка базовых данных при монтировании
  useEffect(() => {
    if (!Emitent?.id) return;
    
    dispatch(fetchOperationTypes(1));
    dispatch(fetchDocuments(Emitent.id));
  }, [dispatch, Emitent?.id]);

  // Загрузка данных в зависимости от выбранной операции
  useEffect(() => {
    if (!Emitent?.id || !watchedOperationId) return;

    switch (watchedOperationId) {
      case 29:
        dispatch(fetchEmissionsByEmitentId(Emitent.id));
        dispatch(fetchAllHolders());
        break;
      case 28:
        dispatch(fetchHolders(Emitent.id));
        break;
      case 64:
        dispatch(fetchBlockedSecuritiesHolders(Emitent.id));
        dispatch(fetchBlockedSecuritiesEmissions(Emitent.id));
        break;
      default:
        break;
    }
  }, [watchedOperationId, dispatch, Emitent?.id]);

  // Загрузка ценных бумаг для операций 64 и 28 при выборе holder
  useEffect(() => {
    if ((watchedOperationId === 64 || watchedOperationId === 28) && watchedHolderToId && Emitent?.id) {
      dispatch(fetchSecuritiesByHolderIdEmitentId({
        hid: watchedHolderToId, 
        eid: Emitent.id
      }));
    }
  }, [watchedOperationId, watchedHolderToId, dispatch, Emitent?.id]);

  // Сброс полей формы при выборе операции 29
  useEffect(() => {
    if (watchedOperationId === 29) {
      const resetValues = {
        holder_to_id: "",
        emission_id: "",
        emission: "",
        quantity: "",
        amount: "",
        is_exchange: true,
        is_family: false,
        document_id: "",
      };
      
      Object.entries(resetValues).forEach(([key, value]) => {
        setValue(key, value);
      });
      
      setMaxCount(null);
      setPrice(null);
    }
  }, [watchedOperationId, setValue]);

  // Вспомогательная функция для получения количества
  const getQuantityByOperation = useCallback((emissionValue, operationId) => {
    if (!emissionValue) return null;
    
    switch (operationId) {
      case 11:
        return emissionValue.blocked_count;
      case 64:
        return emissionValue.blocked_shares;
      case 28:
        return emissionValue.total_shares;
      default:
        return emissionValue.count;
    }
  }, []);

  // Обновление полей формы при выборе эмиссии
  useEffect(() => {
    if (!watchedEmissionId || !emissions?.items || emissions.items.length === 0) return;

    const newEmissionValue = emissions.items.find(
      (item) => item.id === watchedEmissionId
    );
    
    if (!newEmissionValue || !newEmissionValue.reg_number) return;

    const qty = getQuantityByOperation(newEmissionValue, watchedOperationId);
    const nominal = newEmissionValue.nominal || 0;
    
    if (qty !== null && qty !== undefined) {
      setValue("emission", newEmissionValue.reg_number);
      setValue("quantity", qty);
      setValue("amount", parseFloat((qty * nominal).toFixed(2)));
      setMaxCount(qty);
    }
    
    if (nominal) {
      setPrice(nominal);
    }
  }, [watchedEmissionId, emissions?.items, watchedOperationId, setValue, getQuantityByOperation]);

  // Пересчет суммы сделки при изменении количества
  useEffect(() => {
    if (price && watchedQuantity && !isNaN(watchedQuantity) && !isNaN(price)) {
      const calculatedAmount = parseFloat((watchedQuantity * price).toFixed(2));
      if (!isNaN(calculatedAmount)) {
        setValue("amount", calculatedAmount);
      }
    }
  }, [watchedQuantity, price, setValue]);

  const handleDocumentSelect = useCallback((doc) => {
    if (!doc || !doc.id) return;
    
    setValue("document_id", doc.id);
    setLocalDocs((prevDocs) => {
      const exists = prevDocs.some((d) => d.id === doc.id);
      return exists ? prevDocs : [doc, ...prevDocs];
    });
    setOpenDocModal(false);
  }, [setValue]);

  const onSubmit = useCallback(async (data) => {
    if (!Emitent?.id) {
      Swal.fire({
        title: "Ошибка!",
        text: "Эмитент не выбран",
        icon: "error",
        confirmButtonText: "Ок",
      });
      return;
    }

    setLoading(true);
    try {
      // Преобразуем все числовые поля в числа перед отправкой
      const convertToNumber = (value) => {
        if (value === "" || value === null || value === undefined) return null;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };
      
      let updatedData = {
        ...data,
        operation_id: convertToNumber(data.operation_id),
        holder_to_id: convertToNumber(data.holder_to_id),
        emission_id: convertToNumber(data.emission_id),
        quantity: convertToNumber(data.quantity),
        amount: convertToNumber(data.amount),
        document_id: convertToNumber(data.document_id),
        // Boolean поля оставляем как есть
        is_exchange: Boolean(data.is_exchange),
        is_family: Boolean(data.is_family),
      };
      
      if (data.operation_id === 29 && data.holder_from_id) {
        const { holder_from_id, ...rest } = updatedData;
        updatedData = rest;
      }
      
      const response = await dispatch(fetchCreateTransaction({ 
        emitent_id: Number(Emitent.id), 
        ...updatedData 
      }));
      
      if (response.error) {
        throw new Error(response.payload?.message || "Неизвестная ошибка");
      }
      
      const newId = response.payload?.id;
      if (!newId) {
        throw new Error("Не получен ID созданной транзакции");
      }
      
      await Swal.fire({
        title: "Успешно!",
        text: "Данные успешно отправлены",
        icon: "success",
        confirmButtonText: "Ок",
      });
      
      history.push(`/admin/transaction/${newId}`);
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
  }, [Emitent?.id, dispatch, history]);

  // Подготовка данных для селектов
  const holdersOptions = useMemo(() => holders?.items || [], [holders?.items]);
  const stocksOptions = useMemo(() => emissions?.items || [], [emissions?.items]);
  const documentsOptions = useMemo(() => documentList || [], [documentList]);

  // Конфигурация полей формы - создается динамически с учетом текущих данных
  const fieldsConfig = useMemo(() => [
    {
      name: "operation_id",
      label: "Операция",
      component: "selectSearch",
      options: operationTypes,
      optionValueKey: "id",
      optionLabelKey: "name",
      grid: { xs: 12, sm: 12, md: 12 },
      validation: { required: "Операция обязательна" },
    },
    {
      name: "holder_to_id",
      label: "Кто принимает",
      component: "selectSearch",
      options: holdersOptions,
      optionValueKey: "id",
      optionLabelKey: "name",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Выберите получателя" },
    },
    {
      name: "emission_id",
      label: "Эмиссия",
      component: "select",
      options: stocksOptions,
      optionValueKey: "id",
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
      validation: {
        validate: (value) =>
          typeof value === "boolean" || "Выберите вид сделки",
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
      validation: { 
        required: "Количество обязательно",
        validate: (value) => {
          if (!value || value <= 0) {
            return "Количество должно быть больше 0";
          }
          if (maxCount && parseFloat(value) > parseFloat(maxCount)) {
            return `Количество не должно превышать ${maxCount}`;
          }
          return true;
        }
      },
    },
    {
      name: "amount",
      label: "Сумма сделки",
      component: "input",
      type: "number",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: {},
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
        validate: (value) =>
          typeof value === "boolean" || "Поле обязательно",
      },
    },
    {
      name: "document_id",
      label: "Входящий документ",
      component: "selectModal",
      options: documentsOptions,
      optionValueKey: "id",
      optionLabelKey: "title",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Входящий документ обязателен" },
      extraLabelKey: "provider_name",
    },
    {
      name: "contract_date",
      label: "Дата операции",
      component: "datetime",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Дата операции обязательна" },
    },
  ], [maxCount, operationTypes, holdersOptions, stocksOptions, documentsOptions]);

  return (
    <Card>
      <CardHeader color="info" icon>
        <CardIcon color="info">
          <MailOutline />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Одноместная операция</h4>
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
                        error: Boolean(errors[field.name]),
                      }}
                      inputProps={{
                        type: field.type || "text",
                        disabled: field.disabled || false,
                        ...register(field.name, field.validation),
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                    {errors[field.name] && (
                      <FormHelperText error>
                        {errors[field.name].message}
                      </FormHelperText>
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
                          {field.options?.map((opt) => {
                            const mainLabel = opt[field.optionLabelKey || "name"];
                            const extraLabel = field.extraLabelKey
                              ? opt[field.extraLabelKey]
                              : null;

                            const displayText = extraLabel
                              ? `${mainLabel} — ${extraLabel}`
                              : mainLabel;

                            return (
                              <MenuItem
                                key={opt[field.optionValueKey || "id"]}
                                value={opt[field.optionValueKey || "id"]}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected,
                                }}
                              >
                                {displayText}
                              </MenuItem>
                            );
                          })}
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
                          const selectedOption = field.options?.find(
                            option => option[field.optionValueKey || "id"] === controllerField.value
                          );
                          return (
                            <SelectSearch
                              {...controllerField}
                              options={field.options || []}
                              getOptionLabel={(option) =>
                                option[field.optionLabelKey || "name"] || option.label || option.title || ""
                              }
                              getOptionValue={(option) =>
                                option[field.optionValueKey || "id"]
                              }
                              placeholder="Выберите"
                              value={selectedOption || null}
                              onChange={(selectedOption) => {
                                controllerField.onChange(
                                  selectedOption ? selectedOption[field.optionValueKey || "id"] : ""
                                );
                              }}
                              isClearable
                              noOptionsMessage={() => "Нет доступных опций"}
                            />
                          );
                        }}
                      />
                      {errors[field.name] && (
                        <FormHelperText error>
                          {errors[field.name].message}
                        </FormHelperText>
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
