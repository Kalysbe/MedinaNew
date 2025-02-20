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
    { key: 'short_name', name: 'Краткое наименование' },
    { key: 'gov_name', name: 'Орган государственной регистрации' },
    { key: 'contract_date', name: 'Дата регистрации' },
    { key: 'gov_number', name: 'Номер государственой регистрации' },
    { key: 'legal_address', name: 'Юридический адрес' },
    { key: 'postal_address', name: 'Почтовый адрес' },
    { key: 'phone_number', name: 'Номер телефона, факса' },
    { key: 'email', name: 'Электронный адрес' },
    { key: 'bank_name', name: 'Банк эмитента' },
    { key: 'bank_account', name: 'Счет в банке' },
    { key: 'id_number', name: 'Идентификационный номер' },
    // { key: 'contract_date', name: 'Номер договора с регистратором' },
    { key: null, name: 'Форма выпуска ценных бумаг' },
    { key: 'capital', name: 'Размер капитала' },
    { key: 'contract_date', name: 'Дата заключения договора с регистратором' },
    { key: 'accountant', name: 'гл. бухгалтера эмитента' },
    { key: 'director_company', name: 'Директор предприятия' },
    { key: 'director_registrar', name: 'Директор реестродержателя' }
]

const printStyles = {
    printWrapper: {
        '@media print': {
            margin: '20px',
            padding: '10px',
            border: '1px solid black',
            borderRadius: '5px'
        }
    },
    printOnly: {
        display: 'none',
        '@media print': {
            display: 'block'
        }
    },
    tableHeadStyle: {
        fontWeight: 'bold',
    },
    table: {
        borderCollapse: "collapse", 
        width: "100%",
      },
      tableCell: {
        padding: "4px 8px", 
        fontSize: "0.9rem", 
      },
      tableHeaderCell: {
        padding: "6px 8px",
        fontWeight: "bold",
        backgroundColor: "#f4f4f4", 
        verticalAlign: 'top'
      },
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
        // Нужно доработать что бы выводило сумму для количество новых и фактических
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
                    <NavLink to={`/admin/emitent/edit/${Emitent?.id}`}>
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                        >Корректировка</Button>
                    </NavLink>
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
                    <CardHeader color="info" icon>
                        <CardIcon color="info">
                            <Assignment />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Карточка эмитента</h4>
                    </CardHeader>
                    {Emitent && (
                        <CardBody>


                            <div className={classes.printWrapper} ref={componentRef} style={{ fontFamily: 'Arial, Helvetica, sans-serif ' }}>
                                <Typography variant="h5" style={{ marginBottom: '16px', fontWeight: 'bold', color: '#333' }}>

                                    Карточка эмитента

                                </Typography>

                                <Table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: "fixed" }}>
                                    <TableBody>
                                        {formData.map((item, key) => (
                                            <TableRow key={key}>
                                                <TableCell
                                                    style={{
                                                        color: '#555',
                                                        borderBottom: '1px solid #e0e0e0',
                                                        padding: '4px',
                                                        fontSize: '13px',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {item.name}
                                                </TableCell>
                                                <TableCell
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: '#000',
                                                        borderBottom: '1px solid #e0e0e0',
                                                        padding: '4px',
                                                        fontSize: '13px',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {Emitent[item.key]}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Typography variant="subtitle2" style={{ marginTop: 14 }}>
                                    <b>Список эмиссий акция</b>
                                </Typography>
                                <Table className={classes.table} style={{ marginTop: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell className={classes.tableHeaderCell}>№</TableCell>
                                            <TableCell className={classes.tableHeaderCell}>Дата выпуска</TableCell>
                                            <TableCell className={classes.tableHeaderCell}>Рег номер</TableCell>
                                            <TableCell className={classes.tableHeaderCell}>Категория(тип) ценных бумаг</TableCell>
                                            <TableCell className={classes.tableHeaderCell}>Номинал акций</TableCell>
                                            <TableCell className={classes.tableHeaderCell}>Начальное кол-во акций</TableCell>
                                            <TableCell className={classes.tableHeaderCell}>Фактическое количество</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Emissions.map((item, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell className={classes.tableCell}>
                                                    {index + 1}
                                                    {/* № */}
                                                </TableCell>
                                                <TableCell className={classes.tableCell}>
                                                    {window.formatDate(item.release_date)}
                                                    {/* Дата выпуска */}
                                                </TableCell>
                                                <TableCell className={classes.tableCell}>
                                                    {item.reg_number}
                                                    {/* Рег номер */}
                                                </TableCell>
                                                <TableCell className={classes.tableCell}>
                                                    {item.type}
                                                    {/* Категория(тип) ценных бумаг */}
                                                </TableCell>
                                                <TableCell className={classes.tableCell}>
                                                    {window.formatNumber(item.nominal)}
                                                    {/* Начальный номинал акций */}
                                                </TableCell>
                                                <TableCell className={classes.tableCell}>
                                                    {window.formatNumber(item.start_count)}
                                                    {/* Начальное кол-во акций */}
                                                </TableCell>
                                             
                                          
                                                <TableCell className={classes.tableCell}>
                                                    {/* Фактическое количество */}
                                                    {item.count}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={5} style={{ fontWeight: 'bold', borderBottom: 'none' }}>
                                                Итого:
                                            </TableCell>
                                            <TableCell style={{ borderBottom: 'none' }}>{startTotal}</TableCell>
                                            <TableCell style={{ borderBottom: 'none' }}>{currentTotal}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <hr className={classes.printOnly} />
                                <div className={classes.printOnly} style={{ marginTop: '14px' }}>
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
