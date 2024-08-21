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

import { fetchHolders } from "redux/actions/holders";
import { fetchSecuritiesByEmitentId, fetchEmissionsByEmitentId } from "redux/actions/emissions";
import { fetchCreateTransaction, fetchOperationTypes } from "redux/actions/transactions";

import { transferTypes } from "constants/operations.js"

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

    // const uniqueHolders = holders?.items.reduce((acc, current) => {
    //     const x = acc.find(item => item.holder_id === current.holder_id);
    //     if (!x) {
    //         return acc.concat([current]);
    //     } else {
    //         return acc;
    //     }
    // }, []);

    const optionsMap = {
        holders: holders?.items,
        stocks: emissions?.items,
        typeOperations: transferTypes,
    };

    const [formData, setFormData] = useState({
        operation_id: "",
        holder_to_id: "",
        emission_id: "",
        is_exchange: true,
        emission: "",
        quantity: 0,
        amount: 0,
        is_family: 1,
        id_number: "",
        contract_date: "2024-06-12"
    });

    useEffect(() => {
        dispatch(fetchHolders(Emitent?.id))
        dispatch(fetchOperationTypes())
    }, [])

    useEffect(() => {
        if (formData.operation_id === 1) {
            dispatch(fetchEmissionsByEmitentId(Emitent?.id))
        } else if (formData.holder_from_id) {
            dispatch(fetchSecuritiesByEmitentId(formData.holder_from_id))
        }
    }, [formData.operation_id, formData.holder_from_id])

    useEffect(() => {
        const newEmissionValue = emissions.items.find(item => item.id === formData.emission_id)
        if (newEmissionValue && newEmissionValue.reg_number) {
            setFormData(prevData => ({
                ...prevData,
                emission: newEmissionValue.reg_number,
                quantity: newEmissionValue?.quantity,
                amount: newEmissionValue?.quantity * newEmissionValue?.nominal
            }));
        }
    }, [formData.emission_id]);

    const handleChange = (e, isSelect = false) => {
        const { name, value, type } = isSelect ? { name: e.name, value: e.value, type: 'select' } : e.target;
        const newValue = type === 'number' ? Number(value) : value;
        console.log(newValue)
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };


    const handleSelectChange = (selectedOption) => {
        console.log(selectedOption)
        // setFormData((prevData) => ({
        //     ...prevData,
        //     transferType: selectedOption ? selectedOption.id : null  // Устанавливаем ID выбранного варианта
        // }));
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
                throw new Error(response.error);
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

        <Card>
            <CardHeader color="rose" icon>
                <CardIcon color="rose">
                    <MailOutline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Передача</h4>
            </CardHeader>
            <CardBody>
                <form>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                            >
                                <label

                                >
                                    Операция
                                </label>
                                <SelectSearch
                                 name="operation_id"
                                    placeholder="Выберите"
                                    options={optionsMap.typeOperations}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id} 
                                    onChange={(selectedOption) => handleChange({ name: 'operation_id', value: selectedOption ? selectedOption.id : '' }, true)}
                                    />

                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}>

                                <label>Кто отдает</label>
                                <SelectSearch
                                    name="holder_from_id"
                                    placeholder="Выберите"
                                    options={optionsMap.holders}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    onChange={(selectedOption) => handleChange({ name: 'holder_from_id', value: selectedOption ? selectedOption.id : '' }, true)}
                                />

                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}>
                                <label>
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
                                    Эмиссия для передачи
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
                                            {opt.reg_number} - {opt.quantity} шт.
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
                                labelText='Количество'
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
                                        value={1}>
                                        Да
                                    </MenuItem>
                                    < MenuItem
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value={2}>
                                        Нет
                                    </MenuItem>

                                </Select>
                            </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <InputLabel className={classes.label}>Дата операции</InputLabel>
                            <br />
                            <FormControl fullWidth>
                                <Datetime
                                    value={formData['contract_date']}
                                    onChange={(date) => handleChangeDate('contract_date', date)}
                                    timeFormat={false}
                                    inputProps={{ placeholder: "Дата операции" }}
                                />
                            </FormControl>
                        </GridItem>
                    </GridContainer>
                    <Button color="rose" onClick={handleSubmit}>Сохранить</Button>
                </form>
            </CardBody>
        </Card>
    );
}
