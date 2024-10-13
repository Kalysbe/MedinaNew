import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
import SelectSearch from 'react-select'
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

import { NavLink } from "react-router-dom";

import { fetchCreateDividend } from "redux/actions/dividend";


import { singleTypes } from "constants/operations.js"

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import Swal from 'sweetalert2';

const useStyles = makeStyles(styles);



export default function RegularForms() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [checked, setChecked] = React.useState([24, 22]);
    const [selectedEnabled, setSelectedEnabled] = React.useState("b");
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [loading, setLoading] = useState(null);
    const Emitent = useSelector(state => state.emitents.store);
    const holders = useSelector(state => state.holders.holders);
    const { operationTypes } = useSelector(state => state.transactions)
    const { emissions } = useSelector(state => state.emissions)

    const [maxCount, setMaxCount] = useState(null);
    const [price, setPrice] = useState(null);



    const [formData, setFormData] = useState({
        title: "за 2023 период",
        month_year: "",
        type: "",
        date_close_reestr: "",
        share_price: "",
        share_debited: ""
    });






    const handleChange = (e, isSelect = false) => {
        const { name, value, type } = isSelect === true ? { name: e.name, value: e.value, type: 'select' } : e.target;
        const newValue = type === 'number' ? Number(value) : value;
     
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

    const handleSubmit = async () => {
        setLoading(true);
        const emitent_id = 1
       
        try {
          
            const response =  await dispatch(fetchCreateDividend({ emitent_id, ...formData }));
            if (response.error) {
                throw new Error(response.payload.message || 'Неизвестная ошибка');
            }

            const newId = response.payload.id;

            Swal.fire({
                title: 'Успешно!',
                text: 'Данные успешно отправлены',
                icon: 'success',
                confirmButtonText: 'Ок',
            }).then((result) => {
                if (result.isConfirmed) {
                    history.push(`/admin/transaction/${newId}`);
                }
            });
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);

            Swal.fire({
                title: 'Ошибка!',
                text: error.message || 'Произошла ошибка при отправке данных на сервер',
                icon: 'error',
                confirmButtonText: 'Ок',
            });
        } finally {
            setLoading(false);
        }
    };

    const classes = useStyles();
    return (

        <Card>
            <CardHeader color="info" icon>
                <CardIcon color="info">
                    <MailOutline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Расчет дивиденда</h4>
            </CardHeader>
            <CardBody>
                <form>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <InputLabel className={classes.label}>Дата вывода</InputLabel>
                            <br />
                            <FormControl fullWidth>
                                <Datetime
                                    defaultValue={new Date()}
                                    value={formData['date_close_reestr']}
                                    onChange={(date) => handleChangeDate('date_close_reestr', date)}
                                    timeFormat={false}
                                    inputProps={{ placeholder: "Дата вывода" }}
                                    dateFormat="DD-MM-YYYY"
                                    closeOnSelect={true}
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <InputLabel className={classes.label}>Месяц и год расчета</InputLabel>
                            <br />
                            <FormControl fullWidth>
                                <Datetime
                                    defaultValue={new Date()}
                                    dateFormat="MMMM YYYY"
                                    value={formData['month_year']}
                                    onChange={(date) => handleChangeDate('month_year', date)}
                                    timeFormat={false}
                                    inputProps={{ placeholder: "Дата вывода" }}

                                    closeOnSelect={true}
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <CustomInput
                                labelText='Расценка на одну акцию'
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: event => {
                                        handleChange(event)
                                    },
                                    type: 'number',
                                    name: 'share_price',
                                    value: formData['share_price'],
                                }}

                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                            >
                                <InputLabel
                                    htmlFor="simple-select"
                                    className={classes.selectLabel}
                                >
                                    Категория акционеров
                                </InputLabel>
                                <Select
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    name='type'
                                    value={formData['type']}
                                    onChange={handleChange}
                                >

                                    <MenuItem
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value={1}>
                                        Физические нерезиденты
                                    </MenuItem>

                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <CustomInput
                                labelText='Процент удержание'
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: event => {
                                        handleChange(event)
                                    },
                                    type: 'number',
                                    name: 'share_debited',
                                    value: formData['share_debited'],
                                }}

                            />
                        </GridItem>
                    </GridContainer>
                    <NavLink to={'/admin/dividends'}>
                    <Button color="rose">Закрыть</Button>
                    </NavLink>
                    <Button color="info" onClick={handleSubmit}>Расчитать</Button>
                </form>
            </CardBody>
        </Card>
    );
}
