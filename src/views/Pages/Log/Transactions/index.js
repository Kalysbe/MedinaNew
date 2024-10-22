import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
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
import { fetchTransactions } from "redux/actions/transactions";
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

const useStyles = makeStyles(styles);

export default function RegularTables() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const Emitent = useSelector(state => state.emitents?.store);
    const Transactions = useSelector(state => state.transactions?.transactions);


    useEffect(() => {
        dispatch(fetchTransactions(Emitent?.id));
    }, []);

 

    const TableData = (data, keys) => {
        return data.map(item => keys.map(key => item[key]));
    }
    return (
        <GridContainer>
            <GridItem xs={12}>
                <Card>
                    <CardHeader color="info" icon>
                        <CardIcon color="info">
                            <Assignment />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Транзакции</h4>
                    </CardHeader>
                    <CardBody>
                        {Transactions.items && (
                            <Table>
                                <TableHead style={{ display: 'table-header-group' }}>
                                    <TableRow>
                                    <TableCell>№</TableCell>
                                    <TableCell>Дата</TableCell>
                                        <TableCell>Наименование</TableCell>
                                        <TableCell>Действие</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Transactions.items.map((item, index) => (
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
                                            <NavLink to={`/admin/transaction/${item.id}`}>
                                                <Button
                                                    variant="outlined"
                                                    color='info'
                                                    size="sm">
                                                    Открыть
                                                </Button>
                                                </NavLink>
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
    );
}
