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

import { fetchHolderOperation } from "redux/actions/holders";
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
        // height:'auto',
      margin: '20px',
      padding: '10px',
    //   border: '1px solid black',
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
  const {emitent, holder,operations} = useSelector(state => state.holders.holder.data);
  const { status } = useSelector(state => state.holders.holder);
  useEffect(() => {
    dispatch(fetchHolderOperation({eid: Emitent?.id,hid:id}));
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
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
                    Лицевой счет
                  </Typography>
                    <div>
                    <div>
                        <span>Эмитент: <b>{emitent?.full_name}</b></span>
                    </div>
                    <div>
                        <span>Зарегистрирован: <b>{emitent?.gov_name}</b></span>
                    </div>
                    <div>
                        <span>Номер и дата государственной регистрации: <b>{emitent?.gov_number}</b></span>
                    </div>
                    <div>
                        <span>Адрес: <b>{emitent?.legal_address}</b></span>
                    </div>
                    </div>

                    <div style={{marginTop:'18px'}}>
                    <div>
                        <span>Лицевой счет: <b>{holder?.id}</b></span>
                    </div>
                    <div>
                        <span>Ф.И.О: <b>{holder?.name}</b></span>
                    </div>
                    <div>
                        <span>Адрес: <b>{holder?.actual_address}</b></span>
                    </div>
                    <div>
                        <span>Документ: Серия: <b>{holder?.passport_type}</b> Номер: <b>{holder?.passport_number}</b> Выдан: <b>{holder?.passport_agency}</b></span>
                    </div>
                
                    </div>
                    <Typography variant="subtitle2" >
                    Список операций с акциями
                  </Typography>
                    <div>
                    <Table>
                                    <TableHead style={{ display: 'table-header-group' }}>
                                        <TableRow>
                                            <TableCell>№</TableCell>
                                            <TableCell>Дата операции</TableCell>
                                            <TableCell>Операция</TableCell>
                                            <TableCell>Кол-во акций</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {operations.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {item.id}
                                                </TableCell>
                                                <TableCell>
                                                    {window.formatDate(item.contract_date)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.operation?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {window.formatNumber(item.quantity)}
                                                </TableCell>
                                                {/* <TableCell>
                                                    {window.formatDate(item.release_date)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.reg_number}
                                                </TableCell>
                                               
                                                <TableCell>
                                                    {window.formatNumber(item.start_count)}
                                                </TableCell>
                                                <TableCell>
                                                    {window.formatNumber(item.count)}
                                                </TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                    </div>

                </Box>
              )}


           



        
            </Box>

            <Box px={3} display="flex" alignItems="center" justifyContent="flex-end">
         
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
