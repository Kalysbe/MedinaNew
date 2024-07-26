import React, { useEffect } from "react";
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
import { fetchEmitentById } from "redux/actions/emitents";
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

const formData = [
    { key: 'full_name', name: 'Наименование эмитента' },
    { key: 'short_name', name: 'Номер гос. регистрации' },
    { key: 'gov_name', name: 'Орган осуществ-ший регистр' },
    { key: 'contract_date', name: 'Дата регистрации' },
    { key: 'gov_number', name: 'Орган регистрации выпуска ценных бумаг' },
    { key: 'legal_address', name: 'Адрес' },
    { key: 'phone_number', name: 'Номер телефона' },
    { key: 'email', name: 'Электронный адрес' },
    { key: 'bank_name', name: 'Наименование банка эмитента' },
    { key: 'bank_account', name: 'Счет в банке' },
    { key: 'id_number', name: 'Идентификационный номер' },
    { key: 'contract_date', name: 'Номер договора с регистратором' },
    { key: 'contract_date', name: 'Дата заключения договора' },
    { key: 'capital', name: 'Размер уставного капитала' },
    // { key: 'director_registrar', name: 'Ф.И.О директора "Медина"' },
    { key: 'accountant', name: 'Ф.И.О гл. бухгалтера АО' },
    { key: 'director_company', name: 'Ф.И.О руководителя АО' }
]

export default function RegularTables() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const Emitent = useSelector(state => state.emitents?.emitent);
    useEffect(() => {
        dispatch(fetchEmitentById(emitentId()));
    }, []);

    const emitentId = () => {
        const emitent = JSON.parse(localStorage.getItem('emitent'));
        return emitent?.id
    }
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
                    <Table>
                            <TableBody>
                                {formData.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell width={'30%'}>
                                            <h6>
                                                {item.name}
                                            </h6>
                                        </TableCell>
                                        <TableCell fullwidth="true">
                                            <h6>
                                                {Emitent?.data[item.key]}
                                            </h6>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </GridItem>


        </GridContainer>
    );
}
