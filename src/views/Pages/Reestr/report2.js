import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export default function Report1(props) {
    const {data} = props
  return (
  <>
            {data && (
              <Table >
                <TableHead style={{ display: 'table-header-group' }}>
                  <TableRow>
                    <TableCell>№2</TableCell>
                    <TableCell>Счет</TableCell>
                    <TableCell>Наименование</TableCell>
                    <TableCell>Простых</TableCell>
                    <TableCell>Номинал простых</TableCell>
                    <TableCell>% от кол-во</TableCell>
                    <TableCell>Паспорт</TableCell>
                    <TableCell>Адрес проживания</TableCell>
                    <TableCell>Регион</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {item.id}
                      </TableCell>
                      <TableCell>
                        <b>{item.name}</b>
                      </TableCell>
                      <TableCell>
                        {window.formatNumber(item.ordinary)}
                      </TableCell>
                      <TableCell>
                        {window.formatNumber(item.ordinary_nominal)}
                      </TableCell>
                      <TableCell>
                        {item.percentage} %
                      </TableCell>
                      <TableCell>
                        {item.passport} 
                      </TableCell>
                      <TableCell>
                        {item.actual_address} 
                      </TableCell>
                      <TableCell>
                        {item.district} 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
  </>
  );
}
