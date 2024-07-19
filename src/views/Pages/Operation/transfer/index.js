import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
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

import { fetchHolders } from "redux/actions/holders";
import { fetchEmissionsByHolderId, fetchEmissionsByEmitentId } from "redux/actions/emissions";
import { fetchCreateTransaction, fetchOperationTypes } from "redux/actions/transactions";

import { transferTypes } from "constants/operations.js"

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

let formConfig = [
    { key: "operation_id", label: "Операция", type: "list", option: 'typeOperations', size: 12, disabled: false },
    { key: "holder_from_id", label: "Кто отдает ", type: "list", option: 'holders', size: 6, disabled: false },
    { key: "holder_to_id", label: "Кто принимает", type: "list", option: 'holders', size: 6, disabled: false },
    { key: "emission_id", label: "Эмиссия для передачи", type: "list", option: 'stocks', size: 12, disabled: true },
    { key: "is_exchange", label: "Вид сделки", type: "list", option: 'typesOrder', size: 4, disabled: false },
    { key: "emission", label: "Эмиссия", type: "text", size: 4, disabled: true },
    // { key: "postal_address", label: "Вид акций", type: "text", size: 4, disabled: true },
    { key: "quantity", label: "Количество", type: "number", size: 4, disabled: false },
    { key: "amount", label: "Сумма сделки", type: "number", size: 4, disabled: false },
    { key: "is_family", label: "Признак родственника", type: "list", option: 'typesFamily', size: 4, disabled: false },
    { key: "id_number", label: "Документ", type: "text", size: 4, disabled: false },
    { key: "contract_date", label: "Дата операции", type: "date", size: 4, disabled: false },
];

const typesOrder = [
    { id: 1, name: 'Биржевая', value: true },
    { id: 2, name: 'Не биржевая', value: false }
]

const typesFamily = [
    { id: 1, name: 'Да', value: true },
    { id: 2, name: 'Нет', value: false }
]


export default function RegularForms() {
    const dispatch = useDispatch();
    const [checked, setChecked] = React.useState([24, 22]);
    const [selectedEnabled, setSelectedEnabled] = React.useState("b");
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [config, setConfig] = useState(formConfig)
    const Emitent = useSelector(state => state.emitents.store);
    const holders = useSelector(state => state.holders.holders);
    const { operationTypes } = useSelector(state => state.transactions)
    const { emissions } = useSelector(state => state.emissions)
  
    const optionsMap = {
        holders: holders?.items,
        stocks: emissions?.items,
        typesOrder: typesOrder,
        typeOperations: transferTypes,
        typesFamily: typesFamily
    };

    const [formData, setFormData] = useState({
        "operation_id": "",
        "holder_from_id": "",
        "holder_to_id": "",
        "emission_id": "",
        "is_exchange": false,
        "emission": "",
        "quantity": 0,
        "amount": 0,
        "is_family": "",
        "id_number": "",
        "contract_date": "2024-06-12"
    });

    useEffect(() => {
        dispatch(fetchHolders())
        dispatch(fetchOperationTypes())
    }, [])

    useEffect(() => {
        setConfig(prevConfig =>
            prevConfig.map(item =>
                item.key === 'holder_from_id' ? { ...item, disabled: formData.operation_id === 1 } : item
            )
        );

        if (formData.operation_id === 1) {
            setFormData(prevData => ({
                ...prevData,
                holder_from_id: ''
            }));
        }
    }, [formData.operation_id]);

    useEffect(() => {
        if (formData.operation_id === 1) {
            dispatch(fetchEmissionsByEmitentId(Emitent?.id))
        } else if (formData.holder_from_id) {
            dispatch(fetchEmissionsByHolderId(formData.holder_from_id))
        }
        setConfig(prevConfig =>
            prevConfig.map(item =>
                item.key === 'emission_id' ? { ...item, disabled: false } : item
            )
        );

    }, [formData.operation_id, formData.holder_from_id])

    useEffect(() => {
        const newEmissionValue = emissions.items.find(item => item.id === formData.emission_id)
        console.log(newEmissionValue, '1212')
        if (newEmissionValue && newEmissionValue.reg_number) {
            setFormData(prevData => ({
                ...prevData,
                emission: newEmissionValue.reg_number
            }));
        }
        console.log(formData)

    }, [formData.emission_id]);

    const handleChange = (e) => {
        console.log(e.target)
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? Number(value) : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));

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
                        {config.map(({ key, label, type, option, size, disabled }) => (
                            <GridItem xs={12} sm={12} md={size} key={key}>
                                {type === 'list' ? (
                                    <FormControl
                                        fullWidth
                                        className={classes.selectFormControl}
                                    >
                                        <InputLabel
                                            htmlFor="simple-select"
                                            className={classes.selectLabel}
                                        >
                                            {label}
                                        </InputLabel>
                                        <Select
                                            MenuProps={{
                                                className: classes.selectMenu
                                            }}
                                            classes={{
                                                select: classes.select
                                            }}
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}

                                        >
                                            {(optionsMap[option] || []).map(opt => (
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    key={opt.id} value={key == 'is_exchange' || key == 'is_family' ? opt.value : opt.id}>
                                                    {key == 'emission_id' ? opt.reg_number : opt.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : type === 'date' ? (
                                    <>
                                        <InputLabel className={classes.label}>{label}</InputLabel>
                                        <br />
                                        <FormControl fullWidth>
                                            <Datetime
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChange}
                                                timeFormat={false}
                                                inputProps={{ placeholder: "Дата операции" }}
                                            />
                                        </FormControl>
                                    </>
                                ) : (
                                    <CustomInput
                                        labelText={label}
                                        type={type}
                                        name={key}

                                        onChange={handleChange}
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            value: formData[key]
                                        }}

                                    />
                                )}
                            </GridItem>
                        ))}
                    </GridContainer>
                    <Button color="rose">Сохранить</Button>
                </form>
            </CardBody>
        </Card>
    );
}
