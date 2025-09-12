import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, NavLink, useParams } from 'react-router-dom';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";

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
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import DocumentSelectorModal from "views/Pages/Log/IncomingDocuments/DocumentModal.js";



import { fetchHolderById, fetchAddHolder, fetchUpdateHolder } from 'redux/actions/holders'
import { fetchDistrictList, fetchHolderTypeList, fetchHolderStatusList } from "redux/actions/reference";
import { fetchDocuments } from "redux/actions/documents";


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
    const HolderStatusList = useSelector((state) => state.reference?.holderStatusList || []);
    const DocumentList = useSelector((state) => state.documents?.documentList || []);
    const holderId = id
    const isEditing = Boolean(holderId);

    const [localDocs, setLocalDocs] = useState(DocumentList);

    useEffect(() => {
        setLocalDocs(DocumentList);
      }, [DocumentList]);
      

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
        holder_status: "",
        district_id: "",
        document_id: ""
    })

    useEffect(() => {
        dispatch(fetchDistrictList());
        dispatch(fetchHolderTypeList());
        dispatch(fetchHolderStatusList());
        dispatch(fetchDocuments(Emitent?.id));
        if (holderId) {
            dispatch(fetchHolderById(holderId));
        }


    }, [dispatch]);

    // Вверх компонента, рядом с другими useState
    const [openDocModal, setOpenDocModal] = useState(false);

    // Обработка выбора документа из модального окна
    const handleDocumentSelect = (doc) => {
        setFormData((prev) => ({
          ...prev,
          document_id: doc.id,
        }));
      
        // если документа ещё нет в списке, добавим его
        setLocalDocs((prevDocs) => {
          const exists = prevDocs.some((d) => d.id === doc.id);
          return exists ? prevDocs : [doc, ...prevDocs];
        });
      
        setOpenDocModal(false);
      };
      

    useEffect(() => {
        setFormData(HolderData)
    }, [HolderData])

    const findDistrictId = (districtName) => {
        const district = DistrictList.find((d) => d.name === districtName);
        return district ? district.id : null;
    };





    const onSubmit = async () => {
        try {
            let response = '';
            if (isEditing) {
                response = await dispatch(fetchUpdateHolder({ id: holderId, data: formData }));
            } else {
                response = await dispatch(fetchAddHolder({ emitent_id: Emitent?.id, ...formData }));
            }

            // Проверка на наличие ошибки
            if (response.error) {
                // Обновленная проверка на наличие payload и message
                console.log(response, 'errror')
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
                    history.push(`/admin/all-holders`);
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
                                type: 'text',
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
                                type: 'text',
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
                                Отношение к акциям
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: classes.selectMenu
                                }}
                                classes={{
                                    select: classes.select
                                }}
                                name='holder_status'
                                value={formData['holder_status']}
                                onChange={handleChange}
                            >
                                {(HolderStatusList).map(opt => (
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

                    <GridItem xs={6} sm={6} md={4}>
                        <FormControl fullWidth className={classes.selectFormControl}>
                            <InputLabel className={classes.selectLabel}>Входящий документ</InputLabel>
                            <Select
                                value={formData.document_id || ""}
                                onClick={() => setOpenDocModal(true)}
                                readOnly
                                
                                renderValue={() => {
                                    const selected = localDocs.find(doc => doc.id === formData.document_id);

                                    return selected ? selected.title : "Выбрать документ";
                                }}
                            >
                                <MenuItem disabled value="">
                                    Выбрать документ
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </GridItem>


                </GridContainer>

                <Button color="info" onClick={onSubmit}>Сохранить</Button>
                {/* <NavLink to={`/admin/holder/${id}`}>
                    <Button >Закрыть</Button>
                </NavLink> */}
            </CardBody>

            <DocumentSelectorModal
                open={openDocModal}
                onClose={() => setOpenDocModal(false)}
                onSelect={handleDocumentSelect}
                documents={DocumentList}
                emitentId={Emitent?.id}
            />


        </Card>
    );
}
