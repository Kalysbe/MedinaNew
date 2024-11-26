import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory , NavLink} from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";


import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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


import { fetchAddEmitentEmissions } from 'redux/actions/emitents'


import Swal from 'sweetalert2';
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function RegularForms() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const Emitent = useSelector(state => state.emitents?.store);

    const [formData, setFormData] = useState({
        reg_number: '',
        nominal: '',
        start_count: '',
        release_date: ''
    })


    useEffect(() => {
        if (formData['release_date' ]) {return}
        const currentDate = new Date();
        const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
        handleChangeDate('release_date', formattedDate)
      }, [])



    const onSubmit = async () => {
        try {
          const response = await dispatch(fetchAddEmitentEmissions({emitent_id: Emitent?.id, ...formData}));

            if (response.error) {
                // Получаем ошибку, если она была отклонена с `rejectWithValue`
                throw new Error(response.payload.message || 'Неизвестная ошибка');
            }

            Swal.fire({
                title: 'Успешно!',
                text: 'Данные успешно отправлены',
                icon: 'success',
                confirmButtonText: 'Ок',
            }).then((result) => {
                if (result.isConfirmed) {
                    history.push(`/admin/emitent-stocks`);
                }
            });
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
    
            Swal.fire({
                title: 'Ошибка!',
                text: error.message || 'Произошла ошиб`ка при отправке данных на сервер',
                icon: 'error',
                confirmButtonText: 'Ок',
            });
        } finally {
          
        }

          

    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' && value === '' ? '' : (type === 'number' ? Number(value) : value);
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const handleChangeDate = (name, value) => {
        const newValue = value instanceof Date ? value.toISOString().split('T')[0] : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const onClose = () => {

    }

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
                            labelText='Регистрационный номер'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'reg_number',
                                type: 'text',
                                value: formData['reg_number']
                            }}
                        />
                    </GridItem>

                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Стоимость'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'nominal',
                                type: 'number',
                                value: formData['nominal']
                            }}
                        />
                    </GridItem>

                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Количество'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'start_count',
                                type: 'number',
                                value: formData['start_count']
                            }}
                        />
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4}>
                            <InputLabel className={classes.label}>Дата выпуска</InputLabel>
                            <br />
                            <FormControl fullWidth>
                                <Datetime
                                    value={formData['release_date']}
                                    onChange={(date) => handleChangeDate('release_date', date)}
                                    timeFormat={false}
                                    inputProps={{ placeholder: "Нажмите чтобы выбрать дату" }}
                                    closeOnSelect={true} 
                                />
                            </FormControl>
                        </GridItem>
                </GridContainer>
                <Button color="info" onClick={onSubmit}>Сохранить</Button>
                <NavLink to={'/admin/emitent-stocks/'}>
                <Button  onClick={onClose}>Закрыть</Button>
                </NavLink>
            </CardBody>
        </Card>
    );
}
