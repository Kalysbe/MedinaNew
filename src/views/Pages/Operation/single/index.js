import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
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

import { fetchAllHolders } from "redux/actions/holders";
import { fetchSecuritiesByEmitentId, fetchEmissionsByEmitentId } from "redux/actions/emissions";
import { fetchCreateTransaction, fetchOperationTypes } from "redux/actions/transactions";


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
    const { documentList } = useSelector(state => state.documents)

    const [maxCount, setMaxCount] = useState(null);
    const [price, setPrice] = useState(null);

    const optionsMap = {
        holders: holders?.items,
        stocks: emissions?.items,
        typeOperations: singleTypes,
    };

    const [formData, setFormData] = useState({
        operation_id: "",
        holder_to_id: "",
        emission_id: "",
        is_exchange: true,
        emission: "",
        quantity: "",
        amount: "",
        is_family: true,
        id_number: "",
        document_id: "",
        contract_date: ""
    });

    useEffect(() => {
        dispatch(fetchAllHolders())
        dispatch(fetchOperationTypes())
    }, [])

    useEffect(() => {
        if (formData.operation_id === 1) {
            dispatch(fetchEmissionsByEmitentId(Emitent?.id))
        } else if (formData.holder_to_id) {
            dispatch(fetchSecuritiesByEmitentId(formData.holder_to_id))
        }
    }, [formData.operation_id, formData.holder_to_id])

    useEffect(() => {
        const newEmissionValue = emissions.items.find(item => item.id === formData.emission_id)
        if (newEmissionValue && newEmissionValue.reg_number) {
            setFormData(prevData => ({
                ...prevData,
                emission: newEmissionValue.reg_number,
                quantity: formData.operation_id === 11 ? newEmissionValue?.blocked_count : newEmissionValue?.count,
                amount: newEmissionValue?.count * newEmissionValue?.nominal
            }));
            setMaxCount(formData.operation_id === 11 ? newEmissionValue?.blocked_count : newEmissionValue?.count)

            setPrice(newEmissionValue?.nominal)
        }

    }, [formData.emission_id]);


    //Автоматом считаем сумму сделки
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,

            amount: formData.quantity * price
        }));
    }, [formData.quantity]);


    //Установливаем сегодняшнюю дату по умолчанию
    useEffect(() => {
        if (formData['contract_date']) { return }
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        handleChangeDate('contract_date', formattedDate);
    }, [])




    const handleChange = (e, isSelect = false) => {
        const { name, value, type } = isSelect === true ? { name: e.name, value: e.value, type: 'select' } : e.target;
        const newValue = type === 'number' && value === '' ? '' : (type === 'number' ? Number(value) : value);
        console.log(newValue)
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
        const emitent_id = Emitent?.id;
        try {
            let updatedFormData = formData;

            if (formData.operation_id === 1) {
                const { holder_from_id, ...newFormData } = formData;
                updatedFormData = newFormData;
                await setFormData(newFormData);
            }

            const response = await dispatch(fetchCreateTransaction({ emitent_id, ...updatedFormData }));
            if (response.error) {
                // Получаем ошибку, если она была отклонена с `rejectWithValue`
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
                <h4 className={classes.cardIconTitle}>Одноместная операция</h4>
            </CardHeader>
            <CardBody>
                <form>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                            >
                                <InputLabel
                                    htmlFor="simple-select"
                                    className={classes.selectLabel}
                                >
                                    Операция
                                </InputLabel>
                                <Select
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    name='operation_id'
                                    value={formData['operation_id']}
                                    onChange={handleChange}
                                >
                                    {(optionsMap.typeOperations).map(opt => (
                                        <MenuItem key={opt.id}
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value={opt.id}>
                                            {opt.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}>
                                <label
                                    htmlFor="simple-select"
                                    className={classes.selectLabel}>
                                    Кто принимает
                                </label>

                                <SelectSearch
                                    name="holder_to_id"
                                    placeholder="Выберите"
                                    options={optionsMap.holders}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    onChange={(selectedOption) => handleChange({ name: 'holder_to_id', value: selectedOption ? selectedOption.id : '' }, true)}
                                />

                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}>
                                <InputLabel
                                    htmlFor="simple-select"
                                    className={classes.selectLabel}>
                                    Эмиссия
                                </InputLabel>
                                <Select
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    name='emission_id'
                                    value={formData['emission_id']}
                                    onChange={handleChange}
                                >
                                    {(optionsMap.stocks).map(opt => (
                                        <MenuItem key={opt.id}
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value={opt.id}>
                                            {opt.reg_number} -  {formData.operation_id === 11 ? opt.blocked_count : opt.count} шт.
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}>
                                <InputLabel
                                    htmlFor="simple-select"
                                    className={classes.selectLabel}>
                                    Вид сделки
                                </InputLabel>
                                <Select
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    name='is_exchange'
                                    value={formData['is_exchange']}
                                    onChange={handleChange}>
                                    <MenuItem
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value={true}>
                                        Биржевая
                                    </MenuItem>
                                    < MenuItem
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value={false}>
                                        Не биржевая
                                    </MenuItem>

                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <CustomInput
                                labelText='Эмиссия'
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    disabled: true,
                                    type: 'text',
                                    name: 'emission',
                                    value: formData['emission'],
                                }}

                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <CustomInput
                                labelText={`Количество  ${maxCount}`}
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: event => {
                                        handleChange(event)
                                    },
                                    type: 'number',
                                    name: 'quantity',
                                    value: formData['quantity'],
                                }}

                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <CustomInput
                                labelText='Сумма сделки'
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: event => {
                                        handleChange(event)
                                    },
                                    type: 'number',
                                    name: 'amount',
                                    value: formData['amount'],
                                }}

                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}>
                                <InputLabel
                                    htmlFor="simple-select"
                                    className={classes.selectLabel}>
                                    Признак родственника
                                </InputLabel>
                                <Select
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    name='is_family'
                                    value={formData['is_family']}
                                    onChange={handleChange}>
                                    <MenuItem
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value={true}>
                                        Да
                                    </MenuItem>
                                    < MenuItem
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value={false}>
                                        Нет
                                    </MenuItem>

                                </Select>
                            </FormControl>
                        </GridItem>

                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}>
                                <InputLabel
                                    htmlFor="simple-select"
                                    className={classes.selectLabel}>
                                    Входящий документ
                                </InputLabel>
                                <Select
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    name='document_id'
                                    value={formData['document_id']}
                                    onChange={handleChange}
                                >
                                    {(documentList).map(opt => (
                                        <MenuItem key={opt.id}
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value={opt.id}>
                                            {opt.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>

                        <GridItem xs={12} sm={12} md={6}>
                            <InputLabel className={classes.label}>Дата операции</InputLabel>
                            <br />
                            <FormControl fullWidth>
                                <Datetime
                                    defaultValue={new Date()}
                                    value={formData['contract_date']}
                                    onChange={(date) => handleChangeDate('contract_date', date)}
                                    timeFormat={false}
                                    inputProps={{ placeholder: "Дата операции" }}
                                    dateFormat="DD-MM-YYYY"
                                    closeOnSelect={true}
                                />
                            </FormControl>
                        </GridItem>
                    </GridContainer>
                    <Button color="info" onClick={handleSubmit}>Сохранить</Button>
                    <NavLink to={'/admin/dashboard'}>
                        <Button >Закрыть</Button>
                    </NavLink>
                </form>
            </CardBody>
        </Card>
    );
}
