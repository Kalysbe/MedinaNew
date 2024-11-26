import React, { useEffect, useState, useRef } from "react";
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
import { fetchTransactionPrintById } from "redux/actions/prints";
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



/**
 * Component that displays detailed information about a transaction.
 * Fetches and displays data related to the transaction, including 
 * information about the transferring and receiving holders, the 
 * securities being transferred, and other transaction details. 
 * Provides options for printing the transaction details.
 */
export default function RegularTables() {
  const { id } = useParams();
  const classes = useStyles();
  const componentRef = useRef();
  const dispatch = useDispatch();
  const Emitent = useSelector(state => state.emitents.store);
  const EmitentData = useSelector(state => state.emitents.emitent.data);
  const { data, status } = useSelector(state => state.prints.prints.transactionPrint);

  const [transactionTitle, setTransactionTitle] = useState("Детали транзакции");

  useEffect(() => {
    dispatch(fetchEmitentById(Emitent?.id));
    dispatch(fetchTransactionPrintById(id));
  }, []);

  useEffect(() => {
    switch (data.operation?.id) {
      case 1:
        setTransactionTitle("Первоначальный ввод")
        break;
      case 31:
        setTransactionTitle("Передаточное распоряжение")
        break;
      case 3:
        alert( 'Перебор' );
        break;
      default:
        setTransactionTitle("Детали транзакции")
    }
  }, [data.operation?.id]);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Box display="flex" justifyContent="flex-end">
          <NavLink to="/admin/transactions">
            <Button size="small">
              Закрыть</Button>
          </NavLink>
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
        <Card>
          <Box py={3}>
            {/* <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
          <Box
            mx={2}
            mt={-3}
            py={1}
            px={6}
            bgcolor="info.main"
            borderRadius="borderRadius"
            boxShadow={3}
          >
            <Typography variant="h5" color="textPrimary">
              Детали транзакции
            </Typography>
          </Box>
        </Box> */}
            <Box px={3} mt={2} ref={componentRef} className={classes.printWrapper}>
              <Typography align="center" variant="h3" mr={2}></Typography>

              {status === "loading" && id ? (
                <Box py="30px" display="flex" justifyContent="center">
                  <CircularProgress color="primary" size={80} /> {status}
                </Box>
              ) : (
                <Box minWidth={275} >
                  <Typography variant="h5" component="div" align="center">
                   {transactionTitle}
                  </Typography>

                  <Typography variant="h5" component="div" align="center">
                    {EmitentData?.full_name}
                  </Typography>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>

                      {data.holder_from && (
                        <>
                          <Typography variant="h6" component="div">
                            Лицо передающее ценные бумаги
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Ф.И.О: <b> {data.holder_from.name}</b>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Лицевой счет: <b> {data.holder_from.id}</b>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Документ:  Серия: <b>{data.holder_from?.passport_type}</b> Номер: <b>{data.holder_from?.passport_number}</b> Выдан: <b>{data.holder_from?.passport_agency}</b>
                          </Typography>

                          <Typography variant="body2" color="textSecondary">
                            Адрес: <b>{data.holder_from.actual_address}</b>
                          </Typography>

                          <Typography variant="body2" color="textSecondary">
                            Телефон, факс: <b> {data.holder_from.phone_number}</b>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ИНН: <b> {data.holder_from.inn}</b>
                          </Typography>
                        </>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      {data.holder_to && (
                        <>
                          <Typography variant="h6" component="div">
                            Лицо принимающего ценные бумаги
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Ф.И.О: <b> {data.holder_to.name}</b>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Лицевой счет: <b> {data.holder_to.id}</b>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Документ:  Серия: <b>{data.holder_to?.passport_type}</b> Номер: <b>{data.holder_to?.passport_number}</b> Выдан: <b>{data.holder_to?.passport_agency}</b>
                          </Typography>

                          <Typography variant="body2" color="textSecondary">
                            Адрес: <b>{data.holder_to.actual_address}</b>
                          </Typography>

                          <Typography variant="body2" color="textSecondary">
                            Телефон, факс: <b> {data.holder_to.phone_number}</b>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ИНН: <b> {data.holder_to.inn}</b>
                          </Typography>
                        </>
                      )}
                    </Grid>
                  </Grid>

                  <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                    Передаваемые ценные бумаги
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Эмитент:  <b> {EmitentData?.full_name} </b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Эмиссия:  <b> {data.emission?.reg_number}</b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Операция: <b> {data.operation?.name} </b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Количество: <b> {data.quantity}</b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Сумма сделки: <b> {data.amount}</b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Дата сделки:
                    <b> {window.formatDate(data.contract_date)} </b>
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary">
                    Основание перехода права собственности: <b> Договор дарения </b>
                  </Typography> */}
                  {/* <Typography variant="body2" color="textSecondary">
                    <b> Передаваемые ценные бумаги не обременены обязательствами </b>
                  </Typography> */}
                </Box>
              )}

              <div className={classes.printOnly}>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '36px' }} >
                  <Typography style={{ borderTop: '1px solid #000' }}>Подпись передающего</Typography>

                  <Typography style={{ borderTop: '1px solid #000' }}>Подпись принимающего</Typography>
                </div>
              </div>

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
        </Card>
      </GridItem>


    </GridContainer>
  );
}
