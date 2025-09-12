import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import {  Box } from '@material-ui/core';

// material-ui icons


// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Button from "components/CustomButtons/Button.js";



import CustomTable from "components/Table/CustomTable";


import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddEmitentEmissions } from 'redux/actions/emitents'
import { fetchEmissionsByEmitentId } from "redux/actions/emissions";




const styles = {
    customCardContentClass: {
        // paddingLeft: "0",
        // paddingRight: "0"
    },
    cardIconTitle: {
        ...cardTitle,
        // marginTop: "15px",
        // marginBottom: "0px"
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
          { Header: "Тип", accessor: "type", sortType: "basic" },
      ];

    return (
        <GridContainer>
            <GridItem xs={12}>
                <Box display='flex' justifyContent='flex-end'>
                <NavLink to={'/admin/emitent-stock/сancellation'}>
                        <Button
                            variant="outlined"
                            color={'danger'}

                            // onClick={onAdd}
                        >
                            Аннулирование
                        </Button>
                        </NavLink>
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
