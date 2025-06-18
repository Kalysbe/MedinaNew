import React, { useState, useEffect, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Icon from "@material-ui/core/Icon";

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

import Menu from "@material-ui/core/Menu";
import FilterListIcon from "@material-ui/icons/FilterList";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

import Report1 from './Reestr/report1.js'
import Report2 from './Reestr/report2.js'
import Report3 from './Reestr/report3.js'


import { useDispatch, useSelector } from 'react-redux';
import { fetchHoldersByEmitentId } from "redux/actions/holders";
import { fetchEmissionsByEmitentId } from "redux/actions/emissions";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function RegularTables() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const [totalHolders, setTotalHolders] = useState(0)
  const [totalOrdinary, setTotalOrdinary] = useState(0)
  const [totalPrivileged, setTotalPrivileged] = useState(0)


const [report, setReport] = useState(1); // только тип

  const [selectedEmission, setSelectedEmission] = useState(0)

  const Emitent = useSelector(state => state.emitents?.store);
  const Holders = useSelector(state => state.holders?.holders);
  const Emissions = useSelector(state => state.emissions?.emissions);

  

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterState, setFilterState] = useState({
    reportType: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    taxType: ''
  });

  useEffect(() => {
    dispatch(fetchEmissionsByEmitentId(Emitent?.id));
  }, []);

  useEffect(() => {
    if (report === 3 && !selectedEmission) {

      // return
    }
    dispatch(fetchHoldersByEmitentId({ eid: Emitent?.id, type: report, emid: selectedEmission }));
  }, [report, selectedEmission]);

  useEffect(() => {
    const holdersCount = Holders?.items.length;
    const calculateSums = (data) => {
      return data.reduce(
        (acc, item) => {
          acc.common_quantity = (acc.common_quantity || 0) + (item.common_quantity ? parseFloat(item.common_quantity) : 0);
          acc.preferred_quantity = (acc.preferred_quantity || 0) + (item.preferred_quantity ? parseFloat(item.preferred_quantity) : 0);
          return acc;
        },
        { common_quantity: 0, preferred_quantity: 0 }
      );
    };

    const newSums = calculateSums(Holders?.items);
    setTotalHolders(holdersCount);
    setTotalOrdinary(newSums.common_quantity);
    setTotalPrivileged(newSums.preferred_quantity);
  }, [Holders]);

const handleChange = (event) => {
  setReport(event.target.value);
};


  const handleChangeEmission = (event) => {
    setSelectedEmission(event.target.value);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (field, value) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilter = () => {
    setFilterState({
      reportType: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      taxType: ''
    });
  };

  const handleApplyFilter = () => {
    // Здесь будет логика применения фильтров
    console.log('Applied filters:', filterState);
    handleFilterClose();
  };


  const handleExportClick = () => {
    if (componentRef.current?.exportToExcel) {
      componentRef.current.exportToExcel(); // вызываем метод из дочернего компонента
    }
  };

  const reportLabel = {
  1: 'Реестр акционеров',
  2: 'Реестр владельцев именных ЦБ',
  3: 'Реестр владельцев именных по номерам ЦБ'
}[report];


  const ReportViewer = ({ reportType, data, printRef }) => {

    

    switch (reportType) {
      case 1:
        return <Report1 ref={printRef} data={data} emitent={Emitent?.name} />;
      case 2:
        return <Report2 ref={printRef} data={data} emitent={Emitent?.name} />;
      case 3:
        return <Report3 ref={printRef} data={data} emitent={Emitent?.name} />;
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
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleExportClick}
          >Excel</Button>
          <ReactToPrint
            trigger={() =>
              <Button
                variant="contained"
                color="warning"
                size="small"
              >Печать</Button>
            }
            content={() => componentRef.current?.getContent()}


          />
        </div>
        <Card>
          <CardHeader color="info" icon style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%' }}>
              <CardIcon color="info">
                <Assignment />
              </CardIcon>
            <h4 className={classes.cardIconTitle}>{reportLabel}</h4>

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '50%', alignItems: 'center' }}>
              <Button
                style={{ marginLeft: '10px' }}
                variant="contained"
                color="info"
                size="small"
                onClick={handleFilterClick}
                startIcon={<FilterListIcon />}
              >
                Фильтр
              </Button>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  style: { minWidth: 400, borderRadius: 12, padding: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }
                }}
              >
                <Paper style={{ padding: 24, minWidth: 400, boxShadow: 'none' }}>
                  <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Параметры фильтрации</div>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Тип реестра</InputLabel>
                        <Select
                          value={report}
                          onChange={handleChange}
                          label="Тип реестра"
                        >
                          <MenuItem value={1}>Реестр акционеров</MenuItem>
                          <MenuItem value={2}>Реестр владельцев именных ЦБ</MenuItem>
                          <MenuItem value={3}>Реестр владельцев именных по номерам ЦБ</MenuItem>
                        </Select>

                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Дата периода с"
                        type="date"
                        fullWidth
                        size="small"
                        value={filterState.dateFrom}
                        onChange={e => handleFilterChange('dateFrom', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Дата периода по"
                        type="date"
                        fullWidth
                        size="small"
                        value={filterState.dateTo}
                        onChange={e => handleFilterChange('dateTo', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                   
                   
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                      <Button
                        variant="outlined"
                        color="default"
                        size="small"
                        onClick={handleResetFilter}
                        style={{ minWidth: 100 }}
                      >
                        Сбросить
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleApplyFilter}
                        style={{ minWidth: 100 }}
                      >
                        Найти
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Menu>
              {report === 3 && (
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
            {/* <div ref={componentRef} style={{ padding: '20px' }}> */}
           <ReportViewer reportType={report} data={Holders.items} printRef={componentRef} />
            {/* </div> */}
          </CardBody>
        </Card>
      </GridItem>


    </GridContainer>
  </>
  );
}
