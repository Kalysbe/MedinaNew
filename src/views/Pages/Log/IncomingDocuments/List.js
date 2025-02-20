import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from "redux/actions/documents";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import { NavLink } from "react-router-dom";
import CustomTable from "components/Table/CustomTable";

export default function RegularTables() {
  const dispatch = useDispatch()

  const Emitent = useSelector(state => state.emitents?.store);
  const Documents = useSelector(state => state.documents?.documentList);

  useEffect(() => {
    dispatch(fetchDocuments(Emitent?.id));
  }, [ Emitent?.id, dispatch]);

  const tableHeaders = [
      {
        Header: '№',
        accessor: 'id',
        sortType: 'basic'
      },
      {
        Header: 'Наименование',
        accessor: 'title',
        sortType: 'basic'
      },
      {
        Header: 'ФИО предост документ',
        accessor: 'provider_name',
        sortType: 'basic'
      },
      {
        Header: 'Действия', // New column for the buttons
        accessor: 'actions',
        disableSortBy: true, // Disable sorting for this column
        Cell: ({ row }) => (
          <Box display="flex">
            <NavLink to={`incoming-document/edit/${row.original.id}`} >
            <Button
              variant="outlined"
              color="info">
                  Открыть
            </Button>
            </NavLink>
          </Box>
        )
      }
    ]
 
  return (
    <>
      <GridContainer>
        <GridItem xs={12}>
          <Box display="flex" justifyContent="flex-end" alignItems='flex-end'>
            <NavLink to={'/admin/incoming-document/add'}>
              <Button variant="outlined" color={'info'}>
                Добавить
              </Button>
            </NavLink>
          </Box>
          <CustomTable tableName="Входящие документы" tableHead={tableHeaders} tableData={Documents} searchKey="title" />
        </GridItem>
      </GridContainer>
    </>
  );
}
