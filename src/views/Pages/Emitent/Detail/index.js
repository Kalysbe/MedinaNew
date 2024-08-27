import React, { useEffect, useState, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

import { Typography } from '@material-ui/core';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import Button from "components/CustomButtons/Button.js";

import ReactToPrint from 'react-to-print';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardEmitent } from "redux/actions/prints";
const styles = {
    customCardContentClass: {
        paddingLeft: "0",
        paddingRight: "0"
    },
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
};



const formData = [
    { key: 'full_name', name: 'Наименование эмитента' },
    { key: 'short_name', name: 'Номер гос. регистрации' },
    { key: 'gov_name', name: 'Орган осуществ-ший регистр' },
    { key: 'contract_date', name: 'Дата регистрации' },
    { key: 'gov_number', name: 'Орган регистрации выпуска ценных бумаг' },
    { key: 'legal_address', name: 'Адрес' },
    { key: 'phone_number', name: 'Номер телефона' },
    { key: 'email', name: 'Электронный адрес' },
    { key: 'bank_name', name: 'Наименование банка эмитента' },
    { key: 'bank_account', name: 'Счет в банке' },
    { key: 'id_number', name: 'Идентификационный номер' },
    // { key: 'contract_date', name: 'Номер договора с регистратором' },
    
    { key: 'capital', name: 'Размер уставного капитала' },
    { key: 'contract_date', name: 'Дата заключения договора' },
    { key: 'accountant', name: 'Ф.И.О гл. бухгалтера эмитента' },
    { key: 'director_company', name: 'Ф.И.О руководителя эмитента' }
]

const printStyles = {
    printWrapper: {
        '@media print': {
            margin: '20px',
            padding: '10px',
            border: '1px solid black',
            borderRadius:'5px'
        }
    },
    printOnly: {
        display: 'none',
        '@media print': {
            display: 'block'
        }
    }
};

const useStyles = makeStyles({ ...styles, ...printStyles });

export default function RegularTables() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const componentRef = useRef();
    const { cardEmitent } = useSelector(state => state.prints?.prints);
    const Emitent = cardEmitent?.data?.emitent
    const Emissions = cardEmitent?.data?.emissions

    const [startTotal, setStartTotal] = useState(0);
    const [currentTotal, setCurrentTotal] = useState(0);

    useEffect(() => {
        dispatch(fetchCardEmitent(emitentId()));



    }, []);

    useEffect(() => {
        const totalStartCount = Emissions?.reduce((total, item) => {
            return total + item?.start_count;
        }, 0);

        const totalItemCount = Emissions?.reduce((total, item) => {
            return total + item?.count
        }, 0);

        setStartTotal(totalStartCount);
        setCurrentTotal(totalItemCount);
    }, [Emissions])





    const emitentId = () => {
        const emitent = JSON.parse(localStorage.getItem('emitent'));
        return emitent?.id
    }
    return (
        <GridContainer>
            <GridItem xs={12}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ReactToPrint
                        trigger={() =>
                            <Button
                                variant="contained"
                                color="warning"
                                size="small"
                            >Печать</Button>

                        }
                        content={() => componentRef.current}
                    />
                </div>
                <Card>
                    <CardHeader color="rose" icon>
                        <CardIcon color="rose">
                            <Assignment />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Карточка эмитента</h4>
                    </CardHeader>
                    {Emitent && (
                        <CardBody>


                            <div className={classes.printWrapper} ref={componentRef} style={{ fontFamily: 'Arial, Helvetica, sans-serif ' }}>
                                <Typography className={classes.printOnly} variant="h6" align="center">

                                    Карточка эмитента

                                </Typography >
                                {formData.map((item, key) => (
                                    <div key={key} style={{ display: 'flex' }}>
                                        <Typography variant="body2">

                                            {item.name}

                                        </Typography >
                                        <Typography variant="body1">

                                            : <b>{Emitent[item.key]}</b>

                                        </Typography>
                                    </div>
                                ))}
                                <hr className={classes.printOnly}/>
                                <Typography variant="subtitle2" style={{ marginTop: 14 }}>
                                    <b>Список эмиссий акция</b>
                                </Typography>
                                <Table>
                                    <TableHead style={{ display: 'table-header-group' }}>
                                        <TableRow>
                                            <TableCell>№</TableCell>
                                            <TableCell>Дата выпуска</TableCell>
                                            <TableCell>Рег номер</TableCell>
                                            <TableCell>Номинал</TableCell>
                                            <TableCell>Начальное кол-во акций</TableCell>
                                            <TableCell>Фактичесое количество</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Emissions.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {window.formatDate(item.release_date)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.reg_number}
                                                </TableCell>
                                                <TableCell>
                                                    {window.formatNumber(item.nominal)}
                                                </TableCell>
                                                <TableCell>
                                                    {window.formatNumber(item.start_count)}
                                                </TableCell>
                                                <TableCell>
                                                    {window.formatNumber(item.count)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow >

                                            <TableCell colSpan={4} style={{borderBottom:'none'}}>
                                                Итого:
                                            </TableCell>
                                            <TableCell style={{borderBottom:'none'}}>
                                                {startTotal}
                                            </TableCell>
                                            <TableCell style={{borderBottom:'none'}}>
                                                {currentTotal}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <hr className={classes.printOnly}/>
                                <div className={classes.printOnly} style={{marginTop:'14px'}}>
                                   <div>
                                        <span>Держатель реестра:</span>
                                        <b> ОсОО "Реестродержатель Медина"</b>
                                    </div>
                                   <div>
                                        <span>Орган государственной регистрации:</span>
                                        <b> Чуй-Бишкекское управление юстиции</b>
                                    </div>
                                   <div>
                                        <span>Регистрационный номер:</span>
                                        <b> 133580-3301-000 от 09.12.2013 год</b>
                                    </div>
                                   <div>
                                        <span>Лицензия:</span>
                                        <b> №143 от 20.12.2013 г, Гос. служба регулир. и надзора за фин. рынком КР</b>
                                    </div>
                                   <div>
                                        <span>Юридический адрес:</span>
                                        <b> 720001 пр. Манаса 40, каб 324, тел 90-06-43, 31-17-65, 90-06-42</b>
                                    </div>
                                  
                                </div>
                            </div>
                        </CardBody>
                    )}
                </Card>
            </GridItem>


        </GridContainer>
    );
}
