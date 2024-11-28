import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournalList } from "redux/actions/journal";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import { NavLink } from "react-router-dom";

import CustomTable from "components/Table/CustomTable";

export default function RegularTables() {
  const dispatch = useDispatch();

  const Emitent = useSelector(state => state.emitents?.store);
  const { journalList } = useSelector(state => state.journal);
  
  useEffect(() => {
    dispatch(fetchJournalList(Emitent?.id));
  }, [Emitent?.id, dispatch]);

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
        Header: 'Действия', 
        accessor: 'actions',
        disableSortBy: true,
        Cell: ({ row }) => (
          <Box display="flex">
            <NavLink to={`journal/${row.original.id}`} >
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
          <CustomTable tableName="Журнал изменений реестра" tableHead={tableHeaders} tableData={journalList} searchKey="title" />
        </GridItem>
      </GridContainer>
    </>
  );
}