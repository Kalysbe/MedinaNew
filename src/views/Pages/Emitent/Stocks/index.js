import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import {  Box , Card} from '@material-ui/core';

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

import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputLabel from "@material-ui/core/InputLabel";
import Datetime from "react-datetime";
import Button from "components/CustomButtons/Button.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import CustomTable from "components/Table/CustomTable";


import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Swal from 'sweetalert2';

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddEmitentEmissions } from 'redux/actions/emitents'
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


    const tableHeaders = [
        { Header: "Наименование", accessor: "reg_number", sortType: "basic" },
        { Header: "Дата выпуска", accessor: "release_date", sortType: "basic" },
        { Header: "Цена", accessor: "nominal", sortType: "basic" },
        {
            Header: 'Выпущено',
            accessor: 'start_count',
            sortType: 'basic',
            Cell: ({ value }) => {
              return window.formatNumber(value);
            },
          },
          {
            Header: 'Количество',
            accessor: 'count',
            sortType: 'basic',
            Cell: ({ value }) => {
              return window.formatNumber(value);
            },
          },
      ];

    return (
        <GridContainer>
            <GridItem xs={12}>
                <Box display='flex' justifyContent='flex-end'>
                <NavLink to={'/admin/emitent-stock/add'}>
                        <Button
                            variant="outlined"
                            color={'info'}

                            // onClick={onAdd}
                        >
                            Добавить
                        </Button>
                        </NavLink>
                </Box>
             
                  
                            <CustomTable tableName="Ценные бумаги" tableHead={tableHeaders} tableData={Emissions.items} searchKey="reg_number" />
                            
                            {/* <Table>
                                <TableHead style={{ display: 'table-header-group' }}> */}
                                    {/* <TableRow>
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
                            </Table> */}
                  
               
            </GridItem>


        </GridContainer>
    );
}
