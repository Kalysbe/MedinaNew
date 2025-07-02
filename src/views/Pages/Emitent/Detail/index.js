import React, { useEffect, useState, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import PrintIcon from "@material-ui/icons/Print";
import EditIcon from "@material-ui/icons/Edit";

import { Typography, Paper, Box } from '@material-ui/core';

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
    },
    actionButtons: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
    },
    pageHeader: {
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        '@media print': {
            marginBottom: '8px',
            padding: '8px',
            boxShadow: 'none',
            backgroundColor: 'transparent'
        }
    },
    infoTable: {
        marginBottom: '24px',
        '& .MuiTableCell-root': {
            padding: '8px 12px',
            fontSize: '14px',
            borderBottom: '1px solid #e0e0e0'
        },
        '@media print': {
            marginBottom: '12px',
            '& .MuiTableCell-root': {
                padding: '2px 4px',
                fontSize: '9pt'
            }
        }
    },
    emissionsTable: {
        marginTop: '24px',
        '& .MuiTableCell-root': {
            padding: '8px 12px',
            fontSize: '14px'
        },
        '& .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: '#f8f9fa',
            fontWeight: 600,
            color: '#333'
        },
        '@media print': {
            marginTop: '12px',
            '& .MuiTableCell-root': {
                padding: '2px 4px',
                fontSize: '9pt'
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
                backgroundColor: 'transparent'
            }
        }
    },
    totalRow: {
        backgroundColor: '#f8f9fa',
        '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#333'
        }
    },
    printInfo: {
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        '& div': {
            marginBottom: '6px',
            fontSize: '14px'
        },
        '@media print': {
            marginTop: '12px',
            padding: '8px',
            backgroundColor: 'transparent',
            '& div': {
                marginBottom: '2px',
                fontSize: '9pt'
            }
        }
    },
    printWrapper: {
        '@media print': {
            margin: '10px',
            padding: '10px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#fff',
            fontSize: '10pt',
            '& .MuiTypography-h4': {
                fontSize: '14pt',
                marginBottom: '8px'
            },
            '& .MuiTypography-h6': {
                fontSize: '12pt',
                marginTop: '16px',
                marginBottom: '8px'
            },
            '& .MuiTableCell-root': {
                padding: '4px 8px',
                fontSize: '9pt'
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
                padding: '4px 8px',
                fontSize: '9pt'
            }
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
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff'
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
                <div className={classes.actionButtons}>
                    <NavLink to={`/admin/emitent/edit/${Emitent?.id}`}>
                        <Button
                            color="warning"
                            size="sm"
                            startIcon={<EditIcon />}
                        >
                            Корректировка
                        </Button>
                    </NavLink>
                    <ReactToPrint
                        trigger={() =>
                            <Button
                                color="info"
                                size="sm"
                                startIcon={<PrintIcon />}
                            >
                                Печать
                            </Button>
                        }
                        content={() => componentRef.current}
                        pageStyle="@page { size: A4; margin: 10mm; }"
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
                            <div className={classes.printWrapper} ref={componentRef}>
                                <Box className={classes.pageHeader}>
                                    <Typography variant="h4" style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                                        Карточка эмитента
                                    </Typography>
                                </Box>

                                <Table className={classes.infoTable} size="small">
                                    <TableBody>
                                        {formData.map((item, key) => (
                                            <TableRow key={key}>
                                                <TableCell style={{ width: '40%', color: '#666' }}>
                                                    {item.name}
                                                </TableCell>
                                                <TableCell style={{ width: '60%', fontWeight: 500 }}>
                                                    {Emitent[item.key]}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Typography variant="h6" style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 'bold' }}>
                                    Список эмиссий акций
                                </Typography>

                                <Table className={classes.emissionsTable} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>№</TableCell>
                                            <TableCell>Дата выпуска</TableCell>
                                            <TableCell>Рег номер</TableCell>
                                            <TableCell>Категория(тип) ценных бумаг</TableCell>
                                            <TableCell>Номинал акций</TableCell>
                                            <TableCell>Начальное кол-во акций</TableCell>
                                            <TableCell>Фактическое количество</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Emissions.map((item, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{window.formatDate(item.release_date)}</TableCell>
                                                <TableCell>{item.reg_number}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>{window.formatNumber(item.nominal)}</TableCell>
                                                <TableCell>{window.formatNumber(item.start_count)}</TableCell>
                                                <TableCell>{item.count}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className={classes.totalRow}>
                                            <TableCell colSpan={5}>Итого:</TableCell>
                                            <TableCell>{startTotal}</TableCell>
                                            <TableCell>{currentTotal}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                <div className={classes.printOnly}>
                                    <Box className={classes.printInfo}>
                                        <div>
                                            <span>Держатель реестра: </span>
                                            <b>ОсОО "Реестродержатель Медина"</b>
                                        </div>
                                        <div>
                                            <span>Орган государственной регистрации: </span>
                                            <b>Чуй-Бишкекское управление юстиции</b>
                                        </div>
                                        <div>
                                            <span>Регистрационный номер: </span>
                                            <b>133580-3301-000 от 09.12.2013 год</b>
                                        </div>
                                        <div>
                                            <span>Лицензия: </span>
                                            <b>№143 от 20.12.2013 г, Гос. служба регулир. и надзора за фин. рынком КР</b>
                                        </div>
                                        <div>
                                            <span>Юридический адрес: </span>
                                            <b>720001 г. Бишкек пр. Чуй 164а, каб 202, тел 90-06-43, 31-17-65, 90-06-42</b>
                                        </div>
                                    </Box>
                                </div>
                            </div>
                        </CardBody>
                    )}
                </Card>
            </GridItem>


        </GridContainer>
    );
}
