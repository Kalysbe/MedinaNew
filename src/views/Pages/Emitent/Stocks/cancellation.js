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
import SelectSearch from "react-select"; // для selectSearch
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


import { fetchEmissionsByEmitentId, fetchEmissionCancellation } from "redux/actions/emissions";
import { fetchDocuments } from "redux/actions/documents";
import { singleTypes } from "constants/operations.js";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";


import DocumentSelectorModal from "views/Pages/Log/IncomingDocuments/DocumentModal.js"

const useStyles = makeStyles(styles);

export default function RegularForms() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // Получаем данные из Redux
  const Emitent = useSelector((state) => state.emitents.store);
  const holders = useSelector((state) => state.holders.holders);
  const { emissions } = useSelector((state) => state.emissions);
  const { documentList } = useSelector((state) => state.documents);
  const DocumentList = useSelector((state) => state.documents?.documentList || []);

  // Локальные состояния для вычисляемых значений
  const [maxCount, setMaxCount] = useState(null);
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
    // Для одноместной операции используем singleTypes, если требуется
    typeOperations: singleTypes || [],
    documents: documentList || [],
  };

  // Массив-конфигурация обязательных полей (без поля "Кто отдает")
  const fieldsConfig = [
    {
      name: "emission_id",
      label: "Эмиссия",
      component: "select",
      options: optionsMap.stocks,
      optionValueKey: "id",
      optionLabelKey: "reg_number", // отображается reg_number
      grid: { xs: 12, sm: 12, md: 12 },
      validation: { required: "Эмиссия обязательна" },
      extraLabelKey: "count",
    },
    {
      name: "count",
      label: "Количество" + (maxCount ? ` (Макс. ${maxCount})` : ""),
      component: "input",
      type: "number",
      grid: { xs: 12, sm: 12, md: 6 },
      validation: { required: "Количество обязательно" },
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
      extraLabelKey: "provider_name",
    },

  ];

  // Инициализация React Hook Form с дефолтными значениями
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      emission_id: "",
      count: "",
      document_id: "",
      contract_date: new Date().toISOString().split("T")[0],
    },
  });



  useEffect(() => {
    dispatch(fetchEmissionsByEmitentId(Emitent?.id));
    dispatch(fetchDocuments(Emitent?.id));
  }, [dispatch, Emitent]);

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
      const emission_id = data.emission_id
      let response;
      response = await dispatch(fetchEmissionCancellation({ id: emission_id, data: data }));
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
          history.push(`/admin/emitent-stocks/`);
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
      <CardHeader color="danger" icon>
        <CardIcon color="danger">
          <MailOutline />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Аннулирование</h4>
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
                          {field.options?.map((opt) => {
                            const mainLabel = opt[field.optionLabelKey || "name"];
                            const extraLabel = field.extraLabelKey
                              ? opt[field.extraLabelKey]
                              : null;

                            // Если extraLabelKey указано, собираем строку с дополнительным полем
                            // Иначе выводим только основное
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
          <Button color="danger" type="submit">
            {loading ? "Загрузка..." : "Аннулировать"}
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
