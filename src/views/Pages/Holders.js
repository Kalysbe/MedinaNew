import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Icon from "@material-ui/core/Icon";

import Danger from "components/Typography/Danger.js";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Store from "@material-ui/icons/Store";
import Update from "@material-ui/icons/Update";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchHoldersByEmitentId } from "redux/actions/holders";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function RegularTables() {
    const classes = useStyles();
    const dispatch = useDispatch();


    const [totalHolders, setTotalHolders] = useState(0)
    const [totalOrdinary, setTotalOrdinary] = useState(0)
    const [totalPrivileged, setTotalPrivileged] = useState(0)

    const Emitent = useSelector(state => state.emitents?.store);
    const Holders = useSelector(state => state.holders?.holders);

    useEffect(() => {
        dispatch(fetchHoldersByEmitentId({ eid: Emitent?.id, type: 1 }));
    }, []);

    useEffect(() => {
        // Подсчитываем количество элементов в массиве
        const holdersCount = Holders?.items.length;
    
        // Функция для вычисления сумм значений по каждому ключу
        const calculateSums = (data) => {
          return data.reduce(
            (acc, item) => {
                acc.ordinary = (acc.ordinary || 0) + (item.ordinary ? parseFloat(item.ordinary) : 0);
            //   acc.privileged = (acc.privileged || 0) + (item.privileged || 0);
              return acc;
            },
            { ordinary: 0, privileged: 0 }
          );
        };
    
        // Вычисляем суммы и обновляем состояния
        const newSums = calculateSums(Holders?.items);
        setTotalHolders(holdersCount);
        setTotalOrdinary(newSums.ordinary);
        // setTotalPrivileged(newSums.privileged);
      }, [Holders]);

    return (<>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
              <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Количество держателей</p>
              <h3 className={classes.cardTitle}>
                {totalHolders}
              </h3>
            </CardHeader>
            <CardFooter stats>
           
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
              <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Общее кол-во простых</p>
              <h3 className={classes.cardTitle}>{window.formatNumber(totalOrdinary)}</h3>
            </CardHeader>
            <CardFooter stats>
              
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Общее кол-во привилег</p>
              <h3 className={classes.cardTitle}>{window.formatNumber(totalPrivileged)}</h3>
            </CardHeader>
            <CardFooter stats>
              
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
        <GridContainer>
            <GridItem xs={12}>
                <Card>
                    <CardHeader color="rose" icon>
                        <CardIcon color="rose">
                            <Assignment />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Реестр по фамилиям</h4>
                    </CardHeader>
                    <CardBody>
                        {Holders.items && (
                            <Table>
                                <TableHead style={{ display: 'table-header-group' }}>
                                    <TableRow>
                                        <TableCell>Счет</TableCell>
                                        <TableCell>Наименование</TableCell>
                                        <TableCell>Простых</TableCell>
                                        <TableCell>Номинал простых</TableCell>
                                        <TableCell>% от кол-во</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Holders.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {item.id}
                                            </TableCell>
                                            <TableCell>
                                                <b>{item.name}</b>
                                            </TableCell>
                                            <TableCell>
                                                {item.ordinary}
                                            </TableCell>
                                            <TableCell>
                                                {window.formatNumber(item.ordinary_nominal)}
                                            </TableCell>
                                            <TableCell>
                                                {item.percentage} %
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardBody>
                </Card>
            </GridItem>


        </GridContainer>
        </>
    );
}
