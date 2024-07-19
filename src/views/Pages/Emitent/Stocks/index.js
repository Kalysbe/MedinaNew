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
import { fetchEmissionsByEmitentId } from "redux/actions/emissions";
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
    const Emissions = useSelector(state => state.emissions?.emissions);

    useEffect(() => {
        dispatch(fetchEmissionsByEmitentId(Emitent?.id));
    }, []);


    return (
        <GridContainer>
            <GridItem xs={12}>
                <Card>
                    <CardHeader color="rose" icon>
                        <CardIcon color="rose">
                            <Assignment />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Эмитенты</h4>
                    </CardHeader>
                    <CardBody>
                        {Emissions.items && (
                            <Table>
                                <TableHead style={{ display: 'table-header-group' }}>
                                    <TableRow>
                                        <TableCell>Наименование</TableCell>
                                        <TableCell>Цена</TableCell>
                                        <TableCell>Выпущено</TableCell>
                                        <TableCell>Количество</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Emissions.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <b>{item.reg_number}</b>
                                            </TableCell>
                                            <TableCell>
                                                {item.nominal}
                                            </TableCell>
                                            <TableCell>
                                                {window.formatNumber(item.start_count)}
                                            </TableCell>
                                            <TableCell>
                                                {window.formatNumber(item.count)}
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
