import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, NavLink, useParams } from 'react-router-dom';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";


import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
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
        receipt_date: ""
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

    useEffect(() => {
        if (formData['receipt_date']) {return}
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        handleChangeDate('receipt_date', formattedDate);
      }, [])

   
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
                        <InputLabel className={classes.label}>Дата получение документа</InputLabel>
                        <br />
                        <FormControl fullWidth>
                            <Datetime
                                defaultValue={new Date()}
                                value={formData['receipt_date']}
                                onChange={(date) => handleChangeDate('receipt_date', date)}
                                timeFormat={false}
                                inputProps={{ placeholder: "Дата получение документа" }}
                                dateFormat="DD-MM-YYYY"
                                closeOnSelect={true}
                            />
                        </FormControl>
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
                <NavLink to={`/admin/incoming-documents`}>
                    <Button >Закрыть</Button>
                </NavLink>
            </CardBody>
        </Card>
    );
}
