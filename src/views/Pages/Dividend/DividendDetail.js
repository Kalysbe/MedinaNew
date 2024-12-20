import React, { useEffect, useRef } from "react";
// @material-ui/core components
import { makeStyles, styled } from "@material-ui/core/styles";
import { Card, Box, Typography, Grid, CircularProgress } from '@material-ui/core';
import { useParams } from 'react-router-dom';

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

import ReactToPrint from 'react-to-print';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Table from "components/Table/Table.js";
// import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import Button from "components/CustomButtons/Button.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmitentById } from "redux/actions/emitents";
import { fetchDividendById } from "redux/actions/dividend";
import { BorderBottom } from "@material-ui/icons";
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
    signatureContainer: {
        marginTop: '20px',
        paddingTop: '10px',
    },
    signatureLine: {
        borderTop: '1px solid #000',
        marginTop: '100px'

    },
    unifiedFont: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        color: '#000'
    },
};

const useStyles = makeStyles(styles);



export default function RegularTables() {
    const { id } = useParams();
    const classes = useStyles();
    const componentRef = useRef();
    const dispatch = useDispatch();
    const Emitent = useSelector(state => state.emitents.store);
    const EmitentData = useSelector(state => state.emitents.emitent.data);
    const { data, status } = useSelector(state => state.dividend.dividend);
    useEffect(() => {
        dispatch(fetchEmitentById(Emitent?.id));
        dispatch(fetchDividendById(id));
    }, []);

    return (
        <GridContainer>
            <GridItem xs={12}>
                <Box display="flex" justifyContent="flex-end">

                    <ReactToPrint
                        trigger={() =>
                            <Button
                                // variant="contained"
                                color="warning"
                                size="small"
                            >Печать</Button>

                        }
                        content={() => componentRef.current}
                    />

                </Box>
                <Card style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif ' }}>
                    <CardBody>
                        <Box py={3}>

                            <Box px={3} mt={2} ref={componentRef} className={classes.printWrapper}>
                                <Typography align="center" variant="h3" mr={2}></Typography>

                                {status === "loading" && id ? (
                                    <Box py="30px" display="flex" justifyContent="center">
                                        <CircularProgress color="primary" size={80} /> {status}
                                    </Box>
                                ) : (
                                    <Box minWidth={275} className={classes.unifiedFont}>
                                        <Table className={classes.printOnly}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell style={{
                                                        borderBottom: '1px solid #e0e0e0',
                                                        padding: '4px 0px',
                                                        color: '#000'
                                                    }}>Предприятие</TableCell>
                                                    <TableCell style={{
                                                        color: '#000',
                                                        borderBottom: '1px solid #e0e0e0',
                                                        padding: '4px 0px',
                                                    }}>
                                                        {data?.share_price}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{
                                                        borderBottom: '1px solid #e0e0e0',
                                                        padding: '4px 0px',
                                                        color: '#000'
                                                    }}>Категория</TableCell>
                                                    <TableCell style={{
                                                        color: '#000',
                                                        borderBottom: '1px solid #e0e0e0',
                                                        padding: '4px 0px',
                                                    }}>
                                                        {data?.dividend_type?.name}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                        <br />
                                        <br />
                                        <Typography variant="h5" component="div" align="center">
                                            Ведомость расчета дивидендов
                                        </Typography>

                                        <Typography variant="h5" component="div" align="center">
                                            {data?.title}
                                        </Typography>
                                        <br />

                                        <Table>
                                            <TableBody>
                                                {[
                                                    { label: "Дата закрытия реестра", value: window.formatDate(data?.date_close_reestr) },
                                                    { label: "Расценка на акцию", value: data?.share_price },
                                                    { label: "Количество акций", value: data?.amount_share },
                                                    { label: "Сумма начислено", value: data?.amount_share_credited },
                                                    { label: "Сумма удержано", value: data?.amount_share_debited },
                                                    { label: "Сумма к выдаче", value: data?.amount_pay },
                                                ].map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell style={{
                                                            borderBottom: '1px solid #e0e0e0',
                                                            padding: '4px 0px',
                                                            color: '#000',
                                                        }}>{row.label}</TableCell>
                                                        <TableCell style={{
                                                            color: '#000',
                                                            borderBottom: '1px solid #e0e0e0',
                                                            padding: '4px 0px',
                                                        }}>
                                                            {row.value}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>

                                )}

                                <br />
                                <br />
                                <Typography className={classes.printOnly}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', textAlign: 'center' }} >

                                        <Typography style={{ width: "40%", textAlign: 'start', marginTop: '-24px', color: '#000' }}>Руководитель предприятие</Typography>

                                        <Typography style={{ borderTop: '1px solid #000', color: '#000', marginTop: '-5px' }}>Подпись</Typography>

                                        <Typography style={{ width: '40%', borderTop: '1px solid #000', color: '#000', marginTop: '-5px' }}>(Ф.И.О полностью)</Typography>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', textAlign: 'center', color: '#000' }} >
                                        <Typography style={{ width: "40%", textAlign: 'start', marginTop: '-24px' }}>Главный бухгалтер предприятие</Typography>

                                        <Typography style={{ borderTop: '1px solid #000', color: '#000' }}>Подпись</Typography>

                                        <Typography style={{ width: '40%', borderTop: '1px solid #000', color: '#000' }}>(Ф.И.О полностью)</Typography>
                                    </div>
                                    <br />
                                    <br />
                                    <p style={{ fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", color: '#000' }}>М.П.</p>
                                    <br />
                                    <br />
                                </Typography>


                                <Typography className={classes.printOnly}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', textAlign: 'center' }} >
                                        <Typography style={{ width: "40%", textAlign: 'start', marginTop: '-24px', color: '#000' }}>ОсОО "Реестродержатель Медина"</Typography>

                                        <Typography style={{ borderTop: '1px solid #000', color: '#000' }}>Подпись</Typography>

                                        <Typography style={{ width: '40%', borderTop: '1px solid #000', color: '#000' }}> <span style={{ position: "absolute", marginTop: "-25px", marginLeft: '-50px', textAlign: 'center' }}>Тентишева Гульнара Мысанова</span> (Ф.И.О полностью)</Typography>
                                    </div>
                                    <br />
                                    <br />
                                    <p style={{ fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", color: '#000' }}>М.П.</p>
                                    <br />
                                    <br />
                                </Typography>

                                <hr className={classes.printOnly} />
                                <Typography className={classes.printOnly} style={{ marginTop: '14px', fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", color: '#000', fontSize: '13px' }}>
                                    <div>
                                        <span>Держатель реестра:</span>
                                        <span>  ОсОО "Реестродержатель Медина"</span>
                                    </div>
                                    <div>
                                        <span>Орган государственной регистрации:</span>
                                        <span> Чуй-Бишкекское управление юстиции</span>
                                    </div>
                                    <div>
                                        <span>Регистрационный номер:</span>
                                        <span> 133580-3301-000 от 09.12.2013 год</span>
                                    </div>
                                    <div>
                                        <span>Лицензия:</span>
                                        <span> №143 от 20.12.2013 г, Гос. служба регулир. и надзора за фин. рынком КР</span>
                                    </div>
                                    <div>
                                        <span>Юридический адрес:</span>
                                        <span> 720001 пр. Манаса 40, каб 324, тел 90-06-43, 31-17-65, 90-06-42</span>
                                    </div>

                                </Typography>
                            </Box>


                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <NavLink to={'/admin/dividends'}>
                                <Button color="rose">Закрыть</Button>
                            </NavLink>
                            <NavLink to={`/admin/dividend-transactions/${id}`}>
                                <Button color="info">Детали</Button>
                            </NavLink>
                        </Box>
                    </CardBody>
                </Card>
            </GridItem>


        </GridContainer>
    );
}
