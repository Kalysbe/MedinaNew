import React, { useEffect , useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

import { Typography } from '@material-ui/core';

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
    { key: 'accountant', name: 'Ф.И.О гл. бухгалтера АО' },
    { key: 'director_company', name: 'Ф.И.О руководителя АО' }
]

export default function RegularTables() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { cardEmitent } = useSelector(state => state.prints?.prints);
    const Emitent = cardEmitent?.data?.emitent
    const Emissions = cardEmitent?.data?.emissions

    const [startTotal, setStartTotal] = useState(0);
    const [currentTotal, setCurrentTotal] = useState(0);

    useEffect(() => {
        dispatch(fetchCardEmitent(emitentId()));

     
    }, []);

    const totalStartCount = Emissions.reduce((total, item) => {
        return total + (item?.start_count || 0);
    }, 0);
    
    const totalItemCount = Emissions.reduce((total, item) => {
        return total + (item?.count || 0);
    }, 0);
    
    setStartTotal(totalStartCount);
    setCurrentTotal(totalItemCount);
    

    

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
                    {Emitent && (
                        <CardBody>



                            {formData.map((item, key) => (
                                <div key={key} style={{ display: 'flex' }}>
                                    <Typography variant="body2">

                                        {item.name}

                                    </Typography >
                                    <Typography variant="body1">

                                        : <b>{Emitent[item.key]}</b>

                                    </Typography>
                                </div>
                            ))}
                            <Typography variant="subtitle1" style={{ marginTop: 14 }}>
                                Список эмиссий акция
                            </Typography>
                            <Table>
                                <TableHead style={{ display: 'table-header-group' }}>
                                    <TableRow>
                                        <TableCell>№</TableCell>
                                        <TableCell>Дата выпуска</TableCell>
                                        <TableCell>Рег номер</TableCell>
                                        <TableCell>Номинал</TableCell>
                                        <TableCell>Начальное кол-во акций</TableCell>
                                        <TableCell>Фактичесое количество</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Emissions.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {index}
                                            </TableCell>
                                            <TableCell>
                                                {item.release_date}
                                            </TableCell>
                                            <TableCell>
                                                {item.reg_number}
                                            </TableCell>
                                            <TableCell>
                                                {item.nominal}
                                            </TableCell>
                                            <TableCell>
                                                {item.start_count}
                                            </TableCell>
                                            <TableCell>
                                                {item.count}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow >
                                           
                                            <TableCell colSpan={4}>
                                              Итого:
                                            </TableCell>
                                            <TableCell>
                                               {startTotal}
                                            </TableCell>
                                            <TableCell>
                                            5555
                                            </TableCell>
                                        </TableRow>
                                </TableBody>
                            </Table>
                        </CardBody>
                    )}
                </Card>
            </GridItem>


        </GridContainer>
    );
}
