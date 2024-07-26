import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink, useHistory  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, Container, Typography, Button, TextField } from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Datetime from "react-datetime";
import CustomInput from "components/CustomInput/CustomInput.js";
import Swal from 'sweetalert2';

import { selectIsAuth } from 'redux/slices/auth';
import { fetchEmitentById, fetchAddEmitent, fetchUpdateEmitent } from 'redux/actions/emitents';

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

const formConfig = [
  { key: "full_name", label: "Наименование эмитента", type: "text" },
  { key: "short_name", label: "Номер гос. регистрации", type: "text" },
  { key: "gov_name", label: "Орган осуществ-ший регистр", type: "text" },
  { key: "gov_number", label: "Орган регистрации выпуска ценных бумаг", type: "text" },
  { key: "legal_address", label: "Адрес", type: "text" },
  { key: "postal_address", label: "Почтовый адрес", type: "text" },
  { key: "phone_number", label: "Номер телефона", type: "text" },
  { key: "email", label: "Электронный адрес", type: "text" },
  { key: "bank_name", label: "Наименование банка эмитента", type: "text" },
  { key: "bank_account", label: "Счет в банке", type: "text" },
  { key: "id_number", label: "Идентификационный номер", type: "text" },
  { key: "contract_date", label: "Дата заключения договора", type: "date" },
  { key: "capital", label: "Размер уставного капитала", type: "text" },
  { key: "accountant", label: "Ф.И.О гл. бухгалтера АО", type: "text" },
  { key: "director_company", label: "Ф.И.О руководителя АО", type: "text" }
];

const EditEmitent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory(); 
  const isAuth = useSelector(selectIsAuth);
  const emitent = useSelector(state => state.emitents.emitent);
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(
    formConfig.reduce((acc, { key }) => {
      acc[key] = '';
      return acc;
    }, {})
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchEmitentById(id));
    } else {
      setFormData(
        formConfig.reduce((acc, { key }) => {
          acc[key] = '';
          return acc;
        }, {})
      );
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && emitent && emitent.data) {
      const { id, ...emitentData } = emitent.data;
      setFormData(emitentData);
    }
  }, [emitent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeDate = (name, value) => {
    const newValue = value instanceof Date ? value.toISOString().split('T')[0] : value;
    setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
    }));
};

  const handleSubmit = async () => {
    setLoading(true);
    let newId = id
    try {
      if (isEditing) {
        await dispatch(fetchUpdateEmitent({ id, data: formData }));
      } else {
        const response = await dispatch(fetchAddEmitent(formData));
        newId = response.payload.id;
      }

      
      Swal.fire({
        title: 'Успешно!',
        text: 'Данные успешно отправлены',
        icon: 'success',
        confirmButtonText: 'Ок',
      }).then((result) => {
        if (result.isConfirmed) {
          history.push('/admin/emitent-list');
        }
      });
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      Swal.fire({
        title: 'Ошибка!',
        text: 'Произошла ошибка при отправке данных на сервер',
        icon: 'error',
        confirmButtonText: 'Ок',
      });
    } finally {
      setLoading(false);
    }
  };

  const classes = useStyles();

  return (

      <Card style={{ padding: 30 }}>
        <Typography variant="h5" color="textPrimary" style={{ marginBottom: 20 }}>
          {isEditing ? 'Редактирование' : 'Добавление'} эмитента
        </Typography>
        <form>
          <Grid container spacing={2}>
            {formConfig.map(({ key, label, type }) => (
              (type == 'text' ? (
                <Grid item xs={12} md={4} key={key}>
                <CustomInput
                            labelText={label}
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: key,
                                type: type,
                                value: formData[key]
                            }}
                        />
              </Grid>
              ) : (
                <Grid item xs={12} md={4} key={key}>
                <InputLabel className={classes.label}>Дата операции</InputLabel>
                            <br />
                            <FormControl fullWidth>
                                <Datetime
                                    value={formData[key]}
                                    onChange={(date) => handleChangeDate(key, date)}
                                    timeFormat={false}
                                    inputProps={{ placeholder: "Дата операции" }}
                                />
                            </FormControl>
                            </Grid>
              ) )
              
            ))}
          </Grid>
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Button
              color="secondary"
              component={NavLink}
              to={`/admin/emitent-list/`}
              style={{ marginRight: 12 }}
            >
              Назад
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              variant="contained"
              color="primary"
            >
              {isEditing ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </form>
      </Card>

  );
};

export default EditEmitent;
