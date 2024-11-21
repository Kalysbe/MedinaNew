import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, NavLink, useParams } from 'react-router-dom';

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


import { fetchHolderById, fetchAddHolder, fetchUpdateHolder } from 'redux/actions/holders'
import { fetchDistrictList, fetchHolderTypeList } from "redux/actions/reference";


import Swal from 'sweetalert2';
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function RegularForms() {
    const { id } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const Emitent = useSelector(state => state.emitents?.store);
    const HolderData = useSelector(state => state.holders.holder.data)
    const DistrictList = useSelector((state) => state.reference?.districtList || []);
    const HolderTypeList = useSelector((state) => state.reference?.holderTypeList || []);
    const holderId = id
    const isEditing = Boolean(holderId);

    const [formData, setFormData] = useState({
        name: "",
        actual_address: "",
        email: "",
        phone_number: "",
        passport_type: "",
        passport_number: "",
        passport_agency: "",
        inn: "",
        holder_type: "",
        district_id: ""
    })

    const [documentData, setDocumentData] = useState({
        title: "",
        provider_name: "",
        signer_name: "",
        receipt_date: "",
        sending_date: "",
        sending_address: "",
        reponse_number: ""
    })

    useEffect(() => {
        dispatch(fetchDistrictList());
        dispatch(fetchHolderTypeList());
        if (holderId) {
            dispatch(fetchHolderById(holderId));
        }


    }, [dispatch]);

    useEffect(() => {
        setFormData(HolderData)
    }, [HolderData])



    const onSubmit = async () => {
        try {
            let response = '';
            if (isEditing) {
                const data = { holder_data: formData, holder_document: { ...documentData, emitent_id: Emitent?.id, holder_id: Number(holderId) } };
                response = await dispatch(fetchUpdateHolder({ id: holderId, data: data }));
            } else {
                response = await dispatch(fetchAddHolder({ emitent_id: Emitent?.id, ...formData }));
            }
    
            // Проверка на наличие ошибки
            if (response.error) {
                // Обновленная проверка на наличие payload и message
                console.log(response,'errror')
                const errorMessage = response.payload?.message || response.error.message || 'Неизвестная ошибка';
                throw new Error(errorMessage);
            }
    
            Swal.fire({
                title: 'Успешно!',
                text: 'Данные успешно отправлены',
                icon: 'success',
                confirmButtonText: 'Ок',
            }).then((result) => {
                if (result.isConfirmed) {
                    history.push(`/admin/incoming-documents`);
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
            // Здесь можно добавить код, который будет выполнен в любом случае
        }
    };
    

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? Number(value) : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const handleChangeDocument = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? Number(value) : value;
        setDocumentData((prevData) => ({
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
                <h4 className={classes.cardIconTitle}>{holderId ? 'Редактирование акционера' : 'Новый акционер'}</h4>
            </CardHeader>
            <CardBody>

                <GridContainer>
                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Наименование'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'name',
                                type: 'text',
                                value: formData['name']
                            }}
                        />
                    </GridItem>

                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Фактический адрес'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'actual_address',
                                type: 'text',
                                value: formData['actual_address']
                            }}
                        />
                    </GridItem>

                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Почта'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'email',
                                type: 'text',
                                value: formData['email']
                            }}
                        />
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='ИНН'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'inn',
                                type: 'number',
                                value: formData['inn']
                            }}
                        />
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Орган выдачи'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'passport_agency',
                                type: 'text',
                                value: formData['passport_agency']
                            }}
                        />
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Номер паспорта'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'passport_number',
                                type: 'number',
                                value: formData['passport_number']
                            }}
                        />
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Серия паспорта'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'passport_type',
                                type: 'text',
                                value: formData['passport_type']
                            }}
                        />
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4}>
                        <CustomInput
                            labelText='Номер телефона'
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                onChange: event => {
                                    handleChange(event)
                                },
                                name: 'phone_number',
                                type: 'number',
                                value: formData['phone_number']
                            }}
                        />
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4}>
                        <FormControl
                            fullWidth
                            className={classes.selectFormControl}>
                            <InputLabel
                                htmlFor="simple-select"
                                className={classes.selectLabel}>
                                Тип акционера
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: classes.selectMenu
                                }}
                                classes={{
                                    select: classes.select
                                }}
                                name='holder_type'
                                value={formData['holder_type']}
                                onChange={handleChange}
                            >
                                {(HolderTypeList).map(opt => (
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
                    <GridItem xs={6} sm={6} md={4}>
                        <FormControl
                            fullWidth
                            className={classes.selectFormControl}>
                            <InputLabel
                                htmlFor="simple-select"
                                className={classes.selectLabel}>
                                Регион
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: classes.selectMenu
                                }}
                                classes={{
                                    select: classes.select
                                }}
                                name='district_id'
                                value={formData['district_id']}
                                onChange={handleChange}
                            >
                                {(DistrictList).map(opt => (
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

                </GridContainer>
                {isEditing && (
                    <>
                        <h4 className={classes.cardIconTitle}>Входящий документ</h4>
                        <GridContainer>
                            <GridItem xs={6} sm={6} md={4}>
                                <CustomInput
                                    labelText='Наименование документа'
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: event => {
                                            handleChangeDocument(event)
                                        },
                                        name: 'title',
                                        type: 'text',
                                        value: documentData['title']
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={6} sm={6} md={4}>
                                <CustomInput
                                    labelText='ФИО предост документ'
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: event => {
                                            handleChangeDocument(event)
                                        },
                                        name: 'provider_name',
                                        type: 'text',
                                        value: documentData['provider_name']
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={6} sm={6} md={4}>
                                <CustomInput
                                    labelText='Почтовый адрес отправки'
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: event => {
                                            handleChangeDocument(event)
                                        },
                                        name: 'sending_address',
                                        type: 'text',
                                        value: documentData['sending_address']
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={6} sm={6} md={4}>
                                <CustomInput
                                    labelText='Дата получение документа'
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: event => {
                                            handleChangeDocument(event)
                                        },
                                        name: 'receipt_date',
                                        type: 'text',
                                        value: documentData['receipt_date']
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={6} sm={6} md={4}>
                                <CustomInput
                                    labelText='Дата отправки ответа'
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: event => {
                                            handleChangeDocument(event)
                                        },
                                        name: 'sending_date',
                                        type: 'text',
                                        value: documentData['sending_date']
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={6} sm={6} md={4}>
                                <CustomInput
                                    labelText='Исходящий номер ответа'
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: event => {
                                            handleChangeDocument(event)
                                        },
                                        name: 'reponse_number',
                                        type: 'text',
                                        value: documentData['reponse_number']
                                    }}
                                />
                            </GridItem>

                            <GridItem xs={6} sm={6} md={4}>
                                <CustomInput
                                    labelText='ФИО подписавший документ'
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: event => {
                                            handleChangeDocument(event)
                                        },
                                        name: 'signer_name',
                                        type: 'text',
                                        value: documentData['signer_name']
                                    }}
                                />
                            </GridItem>
                        </GridContainer>
                    </>
                )}
                <Button color="info" onClick={onSubmit}>Сохранить</Button>
                {/* <NavLink to={`/admin/holder/${id}`}>
                    <Button >Закрыть</Button>
                </NavLink> */}
            </CardBody>
        </Card>
    );
}
