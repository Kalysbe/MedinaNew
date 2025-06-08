// EditEmitent.jsx
import React, { useEffect, useState } from "react";
import { useParams, NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Datetime from "react-datetime";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import moment from "moment";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";

import {
  fetchEmitentById,
  fetchAddEmitent,
  fetchUpdateEmitent,
} from "redux/actions/emitents";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

/* ------------------------- динамическая конфигурация ------------------------ */
const fieldsConfig = [
  { name: "full_name", label: "Наименование эмитента", component: "input", validation: { required: "Обязательное поле" }  },
  { name: "short_name", label: "Номер гос. регистрации", component: "input" },
  { name: "gov_name", label: "Орган осуществ-ший регистр", component: "input" },
  {
    name: "gov_number",
    label: "Орган регистрации выпуска ценных бумаг",
    component: "input",
  },
  { name: "legal_address", label: "Адрес", component: "input" },
  { name: "postal_address", label: "Почтовый адрес", component: "input" },
  { name: "phone_number", label: "Номер телефона", component: "input" },
  { name: "email", label: "Электронный адрес", component: "input" },
  { name: "bank_name", label: "Наименование банка эмитента", component: "input" },
  { name: "bank_account", label: "Счёт в банке", component: "input" },
  { name: "id_number", label: "Идентификационный номер", component: "input" },
  { name: "contract_date", label: "Дата заключения договора", component: "datetime" },
  { name: "capital", label: "Размер уставного капитала", component: "input" },
  { name: "accountant", label: "Ф.И.О гл. бухгалтера", component: "input" },
  { name: "director_company", label: "Ф.И.О руководителя", component: "input" },
];

/* ============================================================================
   ГЛАВНЫЙ КОМПОНЕНТ
   ========================================================================== */
export default function EditEmitent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { emitent } = useSelector((state) => state.emitents);
  const [loading, setLoading] = useState(false);

  /* ---------- React‑Hook‑Form ---------- */
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: fieldsConfig.reduce((acc, { name }) => {
      if (name === "contract_date") {
        const today = new Date();
        acc[name] = `${String(today.getDate()).padStart(2, "0")}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${today.getFullYear()}`;
      } else {
        acc[name] = "";
      }
      return acc;
    }, {}),
  });

  /* ------------------------ загрузка данных при редактировании ------------- */
  useEffect(() => {
    if (isEditing) dispatch(fetchEmitentById(id));
  }, [isEditing, id, dispatch]);

  /* ------------ когда данные эмитента пришли — заполняем форму ------------ */
  useEffect(() => {
    if (isEditing && emitent?.data) {
      const { id: _ignore, ...data } = emitent.data;
      reset({
        ...data,
        contract_date:
        data.contract_date && moment(data.contract_date, "DD-MM-YYYY").isValid()
          ? moment(data.contract_date, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
      
      });
    }
  }, [emitent, isEditing, reset]);

  /* --------------------------------- submit ------------------------------- */
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditing) {
        await dispatch(fetchUpdateEmitent({ id, data }));
      } else {
        await dispatch(fetchAddEmitent(data));
      }

      Swal.fire({
        title: "Успешно!",
        text: "Данные успешно отправлены!",
        icon: "success",
        confirmButtonText: "Ок",
      }).then(() => history.push("/admin/emitent-list"));
    } catch (err) {
      Swal.fire({
        title: "Ошибка!",
        text: err?.message || "Не удалось сохранить данные",
        icon: "error",
        confirmButtonText: "Ок",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =============================== JSX ==================================== */
  return (
    <Card>
      <CardHeader color="info" icon>
        <CardIcon color="info">
          <AssignmentIndIcon />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>
          {isEditing ? "Корректировка" : "Добавление"} эмитента
        </h4>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridContainer>
          
{fieldsConfig.map((field) => (
  <GridItem xs={12} sm={12} md={4} key={field.name}>
    {field.component === "input" && (
      <>
        <Controller
          name={field.name}
          control={control}
          render={({ field: c }) => (
            <CustomInput
              labelText={field.label}
              formControlProps={{ fullWidth: true, error: !!errors[field.name] }}
              inputProps={{
                ...c,           // value, onChange
                type: "text",
              }}
            />
          )}
          rules={field.validation}   // если нужно required и т.п.
        />
        {errors[field.name] && (
          <FormHelperText error>{errors[field.name].message}</FormHelperText>
        )}
      </>
    )}

    {field.component === "datetime" && (
      <>
        <InputLabel className={classes.label}>{field.label}</InputLabel>
        <FormControl fullWidth error={!!errors[field.name]}>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: c }) => (
              <Datetime
                {...c}
                timeFormat={false}
                dateFormat="DD-MM-YYYY"
                closeOnSelect
                onChange={(d) =>
                  c.onChange(
                    d && d.toISOString ? d.toISOString().split("T")[0] : d
                  )
                }
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
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
          <NavLink to="/admin/dashboard">
            <Button>Закрыть</Button>
          </NavLink>
        </form>
      </CardBody>
    </Card>
  );
}
