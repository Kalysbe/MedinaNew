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
  const { data, status } = useSelector(state => state.prints.prints.transactionPrint);
  useEffect(() => {
    dispatch(fetchEmitentById(Emitent?.id));
    dispatch(fetchTransactionPrintById(id));
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
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
            <Box px={3} mt={2} ref={componentRef} style={{ padding: '20px' }}>
              <Typography align="center" variant="h3" mr={2}></Typography>

              {status === "loading" && id ? (
                <Box py="30px" display="flex" justifyContent="center">
                  <CircularProgress color="primary" size={80} /> {status}
                </Box>
              ) : (
                <Box minWidth={275} margin={2}>
                  <Typography variant="h5" component="div" align="center">
                    ПЕРЕДАТОЧНОЕ РАСПОРЯЖЕНИЕ
                  </Typography>

                  <Typography variant="h5" component="div" align="center">
                    {EmitentData?.full_name}
                  </Typography>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                      <Typography variant="h6" component="div">
                        Лицо передающее ценные бумаги
                      </Typography>
                      {data.holder_from ? (
                        <>
                          <Typography variant="body2" color="textSecondary">
                            Ф.И.О: {data.holder_from.name}
                          </Typography>
                          {/* <Typography variant="body2" color="textSecondary">
                        Лицевой счет: 40
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Документ серии: ID
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Номер: 2706347, выдан: МКК 218061, 29.03.2022
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Адрес: 724800 Сокулукский р-н, с.Сокулук, ул.Больничная, 27
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Отношение к акциям: владелец акций
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Телефон, факс: 22608195910026
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ИНН:
                      </Typography> */}
                        </>
                      ) : EmitentData ? (
                        <>
                          <Typography variant="body2" color="textSecondary">
                            Ф.И.О: {EmitentData.full_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Лицевой счет: {EmitentData.id}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Адрес: {EmitentData.legal_address}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Телефон, факс: {EmitentData.phone_number}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Пусто
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      {data.holder_to && (
                        <>
                          <Typography variant="h6" component="div">
                            Лицо приобретающее ценные бумаги
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Ф.И.О: {data.holder_to.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Лицевой счет: {data.holder_to.id}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Документ серии: {data.holder_to.passport_type}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Номер: {data.holder_to.passport_number}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Выдан: <strong>{data.holder_to.passport_agency}</strong>
                          </Typography>
                          {/* <Typography variant="body2" color="textSecondary">
                        Адрес: 720015 г.Бишкек, ул.Восьмого Марта, 16
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Отношение к акциям: владелец акций
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Телефон, факс: 27-99-07
                      </Typography> */}
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
                  <Typography variant="body2" color="textSecondary">
                    Основание перехода права собственности: <b> Договор дарения </b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <b> Передаваемые ценные бумаги не обременены обязательствами </b>
                  </Typography>
                </Box>
              )}

              <div className={classes.printOnly}>
                <div style={{display:'flex',alignItems:'flex-end'}}>
                  <Typography style={{width:'50%'}}>Подпись лица передающего акции:</Typography>
                  <div style={{borderBottom:'1px solid black',width:'50%'}}></div>
                </div>
                <div style={{display:'flex',alignItems:'flex-end'}}>
                  <Typography style={{width:'50%'}}>Подпись лица принимающего акции:</Typography>
                  <div style={{borderBottom:'1px solid black',width:'50%'}}></div>
                </div>
              </div>

              <div>
                <Typography variant="body2">Передача прав на ценные бумаги осуществлена:</Typography>
                <Typography variant="body2">ОсОО "Реестродержатель Медина"</Typography>
                <Typography variant="body2">Орган государственной регистрации: Чуй-Бишкекское Управление юстиции</Typography>
                <Typography variant="body2">Регистрационный номер:</Typography>
                <Typography variant="body2">ОсОО "Реестродержатель Медина"</Typography>
              </div>
            </Box>

            <Box px={3} display="flex" alignItems="center" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                style={{ marginRight: '12px' }}
                component={NavLink}
                to={`/emitent/${id}/edit`}
              >
                Назад
              </Button>
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
          </Box>
        </Card>
      </GridItem>


    </GridContainer>
  );
}
