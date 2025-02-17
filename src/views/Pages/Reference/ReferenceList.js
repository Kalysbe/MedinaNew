import React from "react";

import CustomTable from "components/Table/CustomTable";
import {Box} from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import { NavLink } from "react-router-dom";



export default function RegularTables() {
    const tableHeaders = [
        {
            Header: 'Наименование',
            accessor: 'title',
            sortType: 'basic'
        },
        {
            Header: 'Действия', // New column for the buttons
            accessor: 'actions',
            disableSortBy: true, // Disable sorting for this column
            Cell: ({ row }) => (
                <Box display="flex">
                    <NavLink to={`${row.original.link}`} >
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

    const tableData = [
        {
            title: 'Районы',
            link: 'district-list'
        },
        {
            title: 'Категории акционеров',
            link: 'holder-types-list'
        },
        {
            title: 'Типы эмиссий',
            link: 'emission-types-list'
        }
    ]


    return (
        <>
            <CustomTable tableName="Справочник" tableHead={tableHeaders} tableData={tableData} searchKey="title" />
        </>
    );
}
