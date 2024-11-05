import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Box, Card } from '@material-ui/core';
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

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
import { fetchEmitents, saveEmitentToLocalStorage } from "redux/actions/emitents";
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
    const [savedEmitent, setSavedEmitent] = useState(null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const Emitents = useSelector(state => state.emitents?.emitents);

    useEffect(() => {
        const savedEmitentData = JSON.parse(localStorage.getItem('emitent'));
        if (savedEmitentData) {
            setSavedEmitent(savedEmitentData);
        }
    }, []);

    useEffect(() => {
        dispatch(fetchEmitents());
    }, []);

    const selectEmitent = (id, name) => {
        const emitentData = { id, name };
        dispatch(saveEmitentToLocalStorage(emitentData))
        setSavedEmitent(emitentData);
        console.log(savedEmitent)
    }

    const TableData = (data, keys) => {
        return data.map(item => keys.map(key => item[key]));
    }
    return (
        <GridContainer>
            <GridItem xs={12}>
                <Box display='flex' justifyContent='flex-end'>
                    <NavLink to={'/admin/emitent/add'}>
                        <Button color='info'>
                            Добавить
                        </Button>
                    </NavLink>
                </Box>
                <Card>
                    <CardHeader color="rose" icon>



                    </CardHeader>
                    <CardBody>
                        {Emitents.items && (
                            <Table>
                                <TableHead style={{ display: 'table-header-group' }}>
                                    <TableRow>
                                        <TableCell>Номер</TableCell>
                                        <TableCell>Наименование</TableCell>
                                        <TableCell>Действие</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Emitents.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {item.id}
                                            </TableCell>
                                            <TableCell>
                                                {item.full_name}
                                            </TableCell>
                                            <TableCell>

                                                <Button
                                                    variant="outlined"
                                                    color={savedEmitent && savedEmitent.id === item.id ? 'warning' : 'info'}
                                                    size="small"
                                                    onClick={() => selectEmitent(item.id, item.full_name)}
                                                    disabled={savedEmitent && savedEmitent.id === item.id}>
                                                    {savedEmitent && savedEmitent.id === item.id ? 'Выбрано' : 'Выбрать'}
                                                </Button>

                                                {/* <MDButton variant="outlined" color="error" size="small" style={{ marginLeft: '8px' }} onClick={() => onDelete(item.id)}>
                   Удалить
                 </MDButton> */}

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
