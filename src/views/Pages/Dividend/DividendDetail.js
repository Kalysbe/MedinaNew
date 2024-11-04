import React, { useEffect, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
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

    }
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
                <Card style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <CardBody>
                        <Box py={3}>

                            <Box px={3} mt={2} ref={componentRef} className={classes.printWrapper}>
                                <Typography align="center" variant="h3" mr={2}></Typography>

                                {status === "loading" && id ? (
                                    <Box py="30px" display="flex" justifyContent="center">
                                        <CircularProgress color="primary" size={80} /> {status}
                                    </Box>
                                ) : (
                                    <Box minWidth={275} >
                                        <Typography variant="h5" component="div" align="center">
                                            Ведомость расчета дивидендов
                                        </Typography>

                                        <Typography variant="h5" component="div" align="center">
                                            {data?.title}
                                        </Typography>

                                        <Typography variant="body2" color="textSecondary">
                                            Предприятие:  <b> {data?.share_price}</b>
                                        </Typography>

                                        <Typography variant="body2" color="textSecondary">
                                            Категория:  <b> {data?.dividend_type?.name}</b>
                                        </Typography>

                                        <Typography variant="body2" color="textSecondary">
                                            Дата закрытия реестра:  <b> {window.formatDate(data?.date_close_reestr)} </b>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Расценка на акцию:  <b> {data?.share_price}</b>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Количество акций: <b> {data?.amount_share} </b>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Сумма начислено: <b> {data?.amount_share_credited}</b>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Сумма ударжано: <b> {data.amount_share_debited}</b>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Сумма к выдаче:  <b> {data.amount_pay}</b>
                                        </Typography>

                                    </Box>
                                )}

                                {/* <div >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', textAlign:'center' }} >
                                        <Typography style={{marginTop:'-24px'}}>Руководитель предприятие</Typography>

                                        <Typography style={{ borderTop: '1px solid #000' }}>Подпись</Typography>

                                        <Typography style={{width: '40%', borderTop: '1px solid #000' }}>ФИО</Typography>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', textAlign:'center' }} >
                                        <Typography style={{marginTop:'-24px'}}>Главный бухгалтер предприятие</Typography>

                                        <Typography style={{ borderTop: '1px solid #000' }}>Подпись</Typography>

                                        <Typography style={{width: '40%', borderTop: '1px solid #000' }}>ФИО</Typography>
                                    </div>
                                </div> */}

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



                                <Typography className={classes.printOnly} style={{ borderTop: '1px solid #000', marginTop: '18px', width: '70%' }}>ФИО и подпись регистратора</Typography>

                                <div className={classes.printOnly}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }} >
                                        <Typography>Номер операции: <b>{id}</b></Typography>
                                        <Typography>Дата операции: <b>{window.formatDate(data?.contract_date)}</b></Typography>
                                    </div>
                                </div>
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
