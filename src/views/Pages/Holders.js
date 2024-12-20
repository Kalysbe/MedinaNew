import React, { useState, useEffect, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Icon from "@material-ui/core/Icon";

import Danger from "components/Typography/Danger.js";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Store from "@material-ui/icons/Store";
import Update from "@material-ui/icons/Update";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// core components

import ReactToPrint from 'react-to-print';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Report1 from './Reestr/report1.js'
import Report2 from './Reestr/report2.js'
import Report3 from './Reestr/report3.js'

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchHoldersByEmitentId } from "redux/actions/holders";
import { fetchEmissionsByEmitentId } from "redux/actions/emissions";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

const headers = [
  { id: 1, headers: [], rows: [] }
]

export default function RegularTables() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const [totalHolders, setTotalHolders] = useState(0)
  const [totalOrdinary, setTotalOrdinary] = useState(0)
  const [totalPrivileged, setTotalPrivileged] = useState(0)


  const [report, setReport] = useState({ type: 1, label: 'Реестр акционеров' });
  const [selectedEmission, setSelectedEmission] = useState(0)

  const Emitent = useSelector(state => state.emitents?.store);
  const Holders = useSelector(state => state.holders?.holders);
  const Emissions = useSelector(state => state.emissions?.emissions);

  console.log("Emitent", Emitent);
  console.log("Holders", Holders);
  console.log("Emissions", Emissions );
  

  useEffect(() => {
    dispatch(fetchEmissionsByEmitentId(Emitent?.id));
  }, []);

  useEffect(() => {
    if (report.type === 3 && !selectedEmission) {
      // return
    }
    dispatch(fetchHoldersByEmitentId({ eid: Emitent?.id, type: report.type, emid: selectedEmission }));
  }, [report.type, selectedEmission]);

  useEffect(() => {
    const holdersCount = Holders?.items.length;
    const calculateSums = (data) => {
      return data.reduce(
        (acc, item) => {
          acc.ordinary = (acc.ordinary || 0) + (item.ordinary ? parseFloat(item.ordinary) : 0);
          return acc;
        },
        { ordinary: 0, privileged: 0 }
      );
    };

    const newSums = calculateSums(Holders?.items);
    setTotalHolders(holdersCount);
    setTotalOrdinary(newSums.ordinary);
  }, [Holders]);
  
  const handleChange = (event) => {
    const selectedReport = event.target.value;
    setReport(selectedReport);
  };

  const handleChangeEmission = (event) => {
    setSelectedEmission(event.target.value);
  };


  const ReportViewer = ({ reportType, data }) => {
    switch (reportType) {
      case 1:
        return <Report1 data={data} emitent={Emitent?.name} />;
      case 2:
        return <Report2 data={data} emitent={Emitent?.name} />;
      case 3:
        return <Report3 data={data} emitent={Emitent?.name} />;
      default:
        return <div>Invalid report type</div>;
    }
  };

  return (<>
    <GridContainer>
      <GridItem xs={12} sm={6} md={6} lg={4}>
        <Card>
          <CardHeader color="info" stats icon>
            <CardIcon color="info">
              <Icon>info_outline</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>Количество держателей</p>
            <h3 className={classes.cardTitle}>
              {totalHolders}
            </h3>
          </CardHeader>
          <CardFooter stats>

          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={6} lg={4}>
        <Card>
          <CardHeader color="info" stats icon>
            <CardIcon color="info">
              <Icon>info_outline</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>Общее кол-во простых</p>
            <h3 className={classes.cardTitle}>{window.formatNumber(totalOrdinary)}</h3>
          </CardHeader>
          <CardFooter stats>

          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={6} lg={4}>
        <Card>
          <CardHeader color="info" stats icon>
            <CardIcon color="info">
              <Icon>info_outline</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>Общее кол-во привилег</p>
            <h3 className={classes.cardTitle}>{window.formatNumber(totalPrivileged)}</h3>
          </CardHeader>
          <CardFooter stats>

          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
    <GridContainer>
      <GridItem xs={12}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ReactToPrint
            trigger={() =>
              <Button
                variant="contained"
                color="warning"
                size="small"
              >Печать</Button>

            }
            content={() => componentRef.current}
          />
        </div>
        <Card>
          <CardHeader color="info" icon style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%' }}>
              <CardIcon color="info">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>{report.label}</h4>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '50%' }}>
              <FormControl
                // fullWidth
                style={{ width: '150px' }}
              >
                <InputLabel
                  htmlFor="simple-select"
                >
                  Тип реестр
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  name='operation_id'
                  value={report}
                  onChange={handleChange}
                >
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}

                    value={{ type: 1, label: 'Реестр акционеров' }}>
                    Реестр акционеров
                  </MenuItem>

                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}

                    value={{ type: 2, label: 'Реестр владельцев именных ЦБ' }}>
                    Реестр владельцев именных ЦБ
                  </MenuItem>

                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}

                    value={{ type: 3, label: 'Реестр владельцев именных по номерам ЦБ' }}>
                    Реестр владельцев именных по номерам ЦБ
                  </MenuItem>

                </Select>
              </FormControl>
              {report.type === 3 && (
                <FormControl
                  style={{ width: '150px', marginLeft: '10px' }}
                >
                  <InputLabel
                    htmlFor="simple-select"
                  >
                    Эмиссия
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    name='operation_id'
                    value={selectedEmission}
                    onChange={handleChangeEmission}
                  >
                    {Emissions?.items.map((item, index) => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.id}>
                        {item.reg_number}
                      </MenuItem>
                    ))}


                  </Select>
                </FormControl>
              )}


            </div>
          </CardHeader>
          <CardBody >
            <div ref={componentRef} style={{ padding: '20px' }}>
              <ReportViewer reportType={report.type} data={Holders.items} />
            </div>
          </CardBody>
        </Card>
      </GridItem>


    </GridContainer>
  </>
  );
}
