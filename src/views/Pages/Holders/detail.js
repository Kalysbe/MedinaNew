import React, { useEffect, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Card, Box, Typography, Grid, CircularProgress } from '@material-ui/core';
import { useParams } from 'react-router-dom';

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

import ReactToPrint from 'react-to-print';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Table from "components/Table/Table.js";
// import Card from "components/Card/Card.js";

import NavPills from "components/NavPills/NavPills.js";

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

import { fetchExtractReestr } from 'redux/actions/prints'

import { fetchHolderOperation } from "redux/actions/holders";
import { BorderBottom } from "@material-ui/icons";
const styles = {
  customCardContentClass: {
    paddingLeft: "0",
    paddingRight: "0"
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  printWrapper: {
    '@media print': {
      // height:'auto',
      margin: '20px',
      padding: '10px',
      //   border: '1px solid black',
      borderRadius: '5px'
    }
  },
  printOnly: {
    display: 'none',
    '@media print': {
      display: 'block'
    }
  },
  signatureContainer: {
    marginTop: '20px',
    paddingTop: '10px',
  },
  signatureLine: {
    borderTop: '1px solid #000',
    marginTop: '100px'

  }
};

const useStyles = makeStyles(styles);



export default function RegularTables() {
  const { id } = useParams();
  const classes = useStyles();
  const componentRef = useRef();
  const dispatch = useDispatch();
  const Emitent = useSelector(state => state.emitents.store);
  const { emitent, holder, operations, emissions } = useSelector(state => state.holders.holder.data);
  const { status } = useSelector(state => state.holders.holder);
  const extractData = useSelector(state => state.prints.prints.extractReestr?.data);

  useEffect(() => {
    dispatch(fetchHolderOperation({ eid: Emitent?.id, hid: id }));
    dispatch(fetchExtractReestr({ eid: Emitent?.id, hid: id }));
  }, []);


  const totalCount = extractData?.emission?.reduce((acc, item) => acc + (item.count || 0), 0);
  const totalNominal = extractData?.emission?.reduce((acc, item) => acc + (item.nominal || 0), 0);
  const totalAmount = extractData?.emission?.reduce((acc, item) => acc + (item.count || 0) * (item.nominal || 0), 0);
  const totalBlockedCount = extractData?.emission?.reduce((acc, item) => acc + (item.blocked_count || 0), 0);

  console.log(extractData,'datas')

  return (
    <Box>

      <Box display="flex" justifyContent="flex-end">
        <NavLink color="info" to={`/admin/holder/${id}/edit`}>
          <Button
            // variant="contained"
            color="warning"
            size="small"
          >Корректировка</Button>
        </NavLink>,
        <ReactToPrint
          trigger={() =>
            <Button
              // variant="contained"
              color="info"
              size="small"
            >Выписка</Button>

          }
          content={() => componentRef.current}
        />
      </Box>



      <Card>
        <Box py={3}>

          <Box px={3} mt={2} className={classes.printWrapper}>
            <Typography align="center" variant="h3" mr={2}></Typography>

            {status === "loading" && id ? (
              <Box py="30px" display="flex" justifyContent="center">
                <CircularProgress color="primary" size={80} /> {status}
              </Box>
            ) : (
              <Box minWidth={275} >
                <Typography variant="h5" component="div" align="center">
                  Лицевой счет
                </Typography>
                <div>
                  <div>
                    <span>Эмитент: <b>{emitent?.full_name}</b></span>
                  </div>
                  <div>
                    <span>Зарегистрирован: <b>{emitent?.gov_name}</b></span>
                  </div>
                  <div>
                    <span>Номер и дата государственной регистрации: <b>{emitent?.gov_number}</b></span>
                  </div>
                  <div>
                    <span>Адрес: <b>{emitent?.legal_address}</b></span>
                  </div>
                </div>

                <div style={{ marginTop: '18px' }}>
                  <div>
                    <span>Лицевой счет: <b>{holder?.id}</b></span>
                  </div>
                  <div>
                    <span>Ф.И.О: <b>{holder?.name}</b></span>
                  </div>
                  <div>
                    <span>Адрес: <b>{holder?.actual_address}</b></span>
                  </div>
                  <div>
                    <span>Документ: Серия: <b>{holder?.passport_type}</b> Номер: <b>{holder?.passport_number}</b> Выдан: <b>{holder?.passport_agency}</b></span>
                  </div>

                </div>

                <NavPills
                  color="info"
                  tabs={[
                    {
                      tabButton: "Список эмиссий с акциями",
                      tabContent: (
                        <div>
                          <Table>
                            <TableHead style={{ display: 'table-header-group' }}>
                              <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>Дата операции</TableCell>
                                <TableCell>Операция</TableCell>
                                <TableCell>Кол-во акций</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {operations?.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {item.id}
                                  </TableCell>
                                  <TableCell>
                                    {window.formatDate(item.contract_date)}
                                  </TableCell>
                                  <TableCell>
                                    {item.operation?.name}
                                  </TableCell>
                                  <TableCell>
                                    {window.formatNumber(item.quantity)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )
                    },
                    {
                      tabButton: "Список операций с акциями",
                      tabContent: (
                        <div>
                          <Table>
                            <TableHead style={{ display: 'table-header-group' }}>
                              <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>Рег. номер</TableCell>
                                <TableCell>Акций</TableCell>
                                <TableCell>Номинал</TableCell>
                                <TableCell>Сумма по номиналу</TableCell>
                                <TableCell>Блокир. акций</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {emissions?.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {index + 1}
                                  </TableCell>
                                  <TableCell>
                                    {item.reg_number}
                                  </TableCell>
                                  <TableCell>
                                    {item.count}
                                  </TableCell>
                                  <TableCell>
                                    {window.formatNumber(item.nominal)}
                                  </TableCell>
                                  <TableCell>
                                    {window.formatNumber(item.count * item.nominal)}
                                  </TableCell>
                                  <TableCell>
                                    {window.formatNumber(item.blocked_count)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )
                    }
                  ]}
                />   <div className={classes.printOnly}>
                  <Typography variant="subtitle2" >
                    Список операций с акциями
                  </Typography>

                  <Table>
                    <TableHead style={{ display: 'table-header-group' }}>
                      <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell>Дата операции</TableCell>
                        <TableCell>Операция</TableCell>
                        <TableCell>Кол-во акций</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {operations?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item.id}
                          </TableCell>
                          <TableCell>
                            {window.formatDate(item.contract_date)}
                          </TableCell>
                          <TableCell>
                            {item.operation?.name}
                          </TableCell>
                          <TableCell>
                            {window.formatNumber(item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

              </Box>
            )}







          </Box>

          <div ref={componentRef} className={classes.printOnly} style={{ fontFamily: 'Arial, sans-serif', margin: '40px', lineHeight: '1.6' }}>

            {/* Заголовок */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, padding: 0 }}>ВЫПИСКА ИЗ РЕЕСТРА</h3>
              <p style={{ margin: 0, padding: 0 }}>28.11.2024 года</p>
            </div>

            {/* Раздел: Информация об эмитенте */}
            <div style={{ marginBottom: '1em' }}>
              <p style={{ margin: '3px 0' }}><strong>Эмитент:</strong> {extractData.emitent?.full_name}</p>
              <p style={{ margin: '3px 0' }}><strong>Зарегистрирован:</strong> {extractData.emitent?.gov_name}</p>
              <p style={{ margin: '3px 0' }}><strong>Номер:</strong> {extractData.emitent?.gov_number}</p>
              <p style={{ margin: '3px 0' }}><strong>Адрес:</strong> {extractData.emitent?.postal_address}</p>
            </div>

            {/* Раздел: Информация о держателе акций */}
            <div style={{ marginBottom: '1em' }}>
              <p style={{ margin: '3px 0' }}><strong>Лицевой счет №:</strong> 21</p>
              <p style={{ margin: '3px 0' }}><strong>Ф.И.О.:</strong> Ахтямова Нина Александровна</p>
              <p style={{ margin: '3px 0' }}><strong>Адрес:</strong> г. Бишкек, пер. Геологический, 1-105</p>
              <p style={{ margin: '3px 0' }}><strong>Документ:</strong> серия П-НС №738616</p>
              <p style={{ margin: '3px 0' }}><strong>Выдан:</strong> г. Фрунзе Октябрьским РОВД 01.06.1978</p>
              <p style={{ margin: '3px 0' }}><strong>Отношение к акциям владельца:</strong> расчётный счёт</p>
            </div>

            {/* Таблица */}
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>№ эмиссии</th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>регистрационный номер</th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>вид акций</th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>наличие акций (шт.)</th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>номинал акции (СОМ)</th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>сумма по номинальной<br />стоимости акций (сом)</th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>акций в залоге</th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>акций принятых в залог</th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>блокир. акций</th>
                </tr>
              </thead>
              <tbody>
                {extractData?.emission?.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{item.id}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{item.reg_number}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{item.name}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{item.count}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{window.formatNumber(item.nominal)}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{window.formatNumber(item.count * item.nominal)}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{item.pledged_shares}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{item.accepted_in_pledge}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{item.blocked_count}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }} colSpan={3}><strong>Итого:</strong></td>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>{totalCount}</td>
                  <td style={{ border: '1px solid #333', padding: '8px' }}></td>
                  <td style={{ border: '1px solid #333', padding: '8px' }}></td>
                  <td style={{ border: '1px solid #333', padding: '8px' }} colSpan={3}></td>
                </tr>
              </tbody>
            </table>

            {/* Дополнительная информация об акциях */}
            <div style={{ marginBottom: '1em' }}>
              <p style={{ margin: '3px 0' }}><strong>% от общего количества выпущенных акций:</strong> 0.016726</p>
              <p style={{ margin: '3px 0' }}><strong>Все на 28.11.2024 (дата отчёта)</strong></p>
              <p style={{ margin: '3px 0' }}><strong>Всего простых акций:</strong> 200 (двести)</p>
              <p style={{ margin: '3px 0' }}><strong>Из них свободных акций:</strong> 22 (двадцать две)</p>
            </div>

            {/* Информация о держателе реестра */}
            <div style={{ marginBottom: '1em' }}>
              <p style={{ margin: '3px 0' }}><strong>Держатель реестра акционеров:</strong> ОсОО «Реестродержатель Медина»</p>
              <p style={{ margin: '3px 0' }}><strong>Орган государственной регистрации:</strong> Чуй-Бишкекское Управление юстиции</p>
              <p style={{ margin: '3px 0' }}><strong>Регистрационный номер:</strong> 133580-3301-ООО от 09.12.2013 г.</p>
              <p style={{ margin: '3px 0' }}><strong>Лицензия №143 от 20.12.2013 г.,</strong> Гос. служба регулир. и надзора за фин. рынком КР</p>
              <p style={{ margin: '3px 0' }}><strong>Юридический адрес:</strong> 720001, пр. Манаса 40, каб. 324</p>
              <p style={{ margin: '3px 0' }}><strong>Тел.:</strong> 90-06-43, 31-17-65, 90-06-42</p>
            </div>

            {/* Блок подписей */}
            <div style={{ marginTop: '30px' }}>
              <p style={{ margin: '3px 0' }}>
                <strong>Ф.И.О. уполномоченного лица</strong> _____________________
              </p>
              <p style={{ margin: '3px 0' }}>
                <strong>М.П.</strong> _____________________
              </p>
              <p style={{ margin: '3px 0' }}>
                <strong>Подпись</strong> _____________________
              </p>
            </div>

            {/* Примечание */}
            <div style={{ marginTop: '15px', fontSize: '0.9em' }}>
              <p style={{ margin: '3px 0' }}>
                <em>
                  Примечание: Выписка из реестра акционеров, выдаваемая регистратором —
                  это документ, подтверждающий запись в реестре. Выписка не является ценной
                  бумагой и передача её от одного лица другому не имеет силы совершения
                  сделки и не влечёт права собственности на акции.
                </em>
              </p>
            </div>

          </div>


        </Box>
      </Card>

    </Box>
  );
}
