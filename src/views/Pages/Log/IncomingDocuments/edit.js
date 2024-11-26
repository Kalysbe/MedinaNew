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


import { fetchDocumentById, fetchCreateDocument, fetchUpdateDocument } from 'redux/actions/documents'


import Swal from 'sweetalert2';
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function RegularForms() {
    const { id } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const Emitent = useSelector(state => state.emitents?.store);
    const { documentDetail } = useSelector(state => state.documents)
    const documentId = id
    const isEditing = Boolean(documentId);

    const [formData, setFormData] = useState({
        title: "",
        provider_name: "",
        signer_name: "",
        receipt_date: "",
        sending_date: "",
        sending_address: "",
        reponse_number: ""
    })

    useEffect(() => {
        if (documentId) {
            dispatch(fetchDocumentById(documentId));
        }
    }, [dispatch]);

    useEffect(() => {
        setFormData(documentDetail)
    }, [documentDetail])



    const onSubmit = async () => {
        try {
            let response = '';
            if (isEditing) {
                const data = { ...formData, emitent_id: Emitent?.id, holder_id: Number(documentId) };
                response = await dispatch(fetchUpdateDocument({ id: documentId, data: data }));
            } else {
                response = await dispatch(fetchCreateDocument({ emitent_id: Emitent?.id, ...formData }));
            }

            if (response.error) {
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


    const handleChangeDate = (name, value) => {
        const newValue = value instanceof Date ? value.toISOString().split('T')[0] : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    return (
        <Card>
            <CardHeader color="info" icon>
                <CardIcon color="info">
                    <MailOutline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>{documentId ? 'Корректировка документа' : 'Новый документ'}</h4>
            </CardHeader>
            <CardBody>



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
                                    handleChange(event)
                                },
                                name: 'title',
                                type: 'text',
                                value: formData['title']
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
                                    handleChange(event)
                                },
                                name: 'provider_name',
                                type: 'text',
                                value: formData['provider_name']
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
                                    handleChange(event)
                                },
                                name: 'sending_address',
                                type: 'text',
                                value: formData['sending_address']
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
                                    handleChange(event)
                                },
                                name: 'receipt_date',
                                type: 'text',
                                value: formData['receipt_date']
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
                                    handleChange(event)
                                },
                                name: 'sending_date',
                                type: 'text',
                                value: formData['sending_date']
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
                                    handleChange(event)
                                },
                                name: 'reponse_number',
                                type: 'text',
                                value: formData['reponse_number']
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
                                    handleChange(event)
                                },
                                name: 'signer_name',
                                type: 'text',
                                value: formData['signer_name']
                            }}
                        />
                    </GridItem>
                </GridContainer>


                <Button color="info" onClick={onSubmit}>Сохранить</Button>
                <NavLink to={`/admin/holder/incoming-documents}`}>
                    <Button >Закрыть</Button>
                </NavLink>
            </CardBody>
        </Card>
    );
}
