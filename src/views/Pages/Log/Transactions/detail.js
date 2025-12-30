import React, { useEffect, useState, useRef, useMemo } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Paper
} from "@material-ui/core";
import { useParams, NavLink } from "react-router-dom";
import ReactToPrint from "react-to-print";

// core components (из шаблона)
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";

import { useDispatch, useSelector } from "react-redux";
import { fetchEmitentById } from "redux/actions/emitents";
import { fetchTransactionPrintById } from "redux/actions/prints";

const useStyles = makeStyles((theme) => ({
  cardIconTitle: {
    ...cardTitle,
    marginTop: 15,
    marginBottom: 0
  },
  actionsBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    padding: theme.spacing(1),
  },
  contentRoot: {
    padding: theme.spacing(2),
  },
  panel: {
    borderRadius: 8,
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
  },
  label: {
    color: theme.palette.text.secondary,
    fontSize: 13,
    marginRight: theme.spacing(1),
  },
  value: {
    fontWeight: 500,
  },
  sectionTitle: {
    margin: `${theme.spacing(2)}px 0 ${theme.spacing(1)}px`,
    fontWeight: 600,
    "@media print": {
      margin: "11px 0 6px",
    },
  },
  keyValueRow: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 6,
    "@media print": {
      marginBottom: 4,
    },
  },
  printWrapper: {
    // Экранный вид
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3),
    background: theme.palette.background.default,
    // Печать
    "@media print": {
      margin: 14,
      padding: 11,
      border: "1px solid #000",
      borderRadius: 6,
      background: "#fff",
    },
  },
  printOnly: {
    display: "none",
    "@media print": {
      display: "block",
    },
  },
  screenOnly: {
    "@media print": {
      display: "none",
    },
  },
  signatures: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 36,
    "@media print": {
      marginTop: 25,
    },
  },
  signatureLine: {
    borderTop: "1px solid #000",
    paddingTop: 6,
    minWidth: 220,
    textAlign: "center",
    "@media print": {
      paddingTop: 4,
    },
  },
  headerBlock: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
    "@media print": {
      marginBottom: 11,
      "& .MuiTypography-gutterBottom": {
        marginBottom: "0.35em !important",
      },
    },
  },
  subtle: {
    color: theme.palette.text.secondary,
  },
  divider: {
    margin: `${theme.spacing(2)}px 0`,
    "@media print": {
      margin: "11px 0",
    },
  },
  paperRow: {
    padding: theme.spacing(1.5),
    borderRadius: 8,
    "@media print": {
      padding: 8,
    },
  },
  compactSpacing: {
    "@media print": {
      margin: "-7px !important",
      width: "calc(100% + 14px)",
      "& > .MuiGrid-item": {
        padding: "7px !important",
      },
    },
  },
  compactBox: {
    "@media print": {
      marginTop: "7px !important",
    },
  },
  compactBoxSmall: {
    "@media print": {
      marginTop: "4px !important",
    },
  },
  compactSignatureMargin: {
    "@media print": {
      marginTop: "13px !important",
    },
  },
}));

const InfoRow = ({ label, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.keyValueRow}>
      <span className={classes.label}>{label}:</span>
      <span className={classes.value}>{children || "—"}</span>
    </div>
  );
};

const SectionCard = ({ title, children }) => {
  const classes = useStyles();
  return (
    <Paper elevation={0} className={classes.paperRow}>
      <Typography variant="subtitle1" className={classes.sectionTitle}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

// Карта названий операций
const OPERATION_TITLES = {
  1: "Первоначальный ввод",
  3: "Передаточное распоряжение",
  31: "Передаточное распоряжение",
};

export default function RegularTables() {
  const classes = useStyles();
  const componentRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();

  const EmitentStore = useSelector((s) => s.emitents.store);
  const EmitentData = useSelector((s) => s.emitents.emitent.data);
  const transactionState = useSelector((s) => s.prints.prints.transactionPrint);

  const data = transactionState?.data || {};
  const status = transactionState?.status || "idle";

  const transactionTitle = useMemo(() => {
    const opId = data?.operation?.id;
    return OPERATION_TITLES[opId] || "Передаточное распоряжение";
  }, [data?.operation?.id]);

  useEffect(() => {
    if (EmitentStore?.id) dispatch(fetchEmitentById(EmitentStore.id));
  }, [dispatch, EmitentStore?.id]);

  useEffect(() => {
    if (id) dispatch(fetchTransactionPrintById(id));
  }, [dispatch, id]);

  const isLoading = status === "loading" || (id && !data?.operation);

  const fmtNumber = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("ru-RU").format(n)
      : (n || "—");

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Box className={classes.actionsBar}>
          <NavLink to="/admin/transactions" className={classes.screenOnly}>
            <Button size="sm">Закрыть</Button>
          </NavLink>
          <ReactToPrint
            trigger={() => (
              <Button color="warning" size="sm">Печать</Button>
            )}
            content={() => componentRef.current}
          />
        </Box>

        <Card className={classes.contentRoot}>
          <Box ref={componentRef} className={classes.printWrapper}>
            <div className={classes.headerBlock}>
              <Typography variant="h5" gutterBottom>
                {transactionTitle}
              </Typography>
              <Typography variant="subtitle1" className={classes.subtle}>
                {EmitentData?.full_name || "Эмитент — загружается"}
              </Typography>
            </div>

            {isLoading ? (
              <Box py={6} display="flex" flexDirection="column" alignItems="center">
                <CircularProgress size={64} />
                <Box mt={2} className={classes.subtle}>Загрузка…</Box>
              </Box>
            ) : (
              <>
                <Grid container spacing={2} className={classes.compactSpacing}>
                  {data.holder_from && (
                    <Grid item xs={12} md={6}>
                      <SectionCard title="Лицо передающее ценные бумаги">
                        <InfoRow label="Ф.И.О">{data.holder_from.name}</InfoRow>
                        <InfoRow label="Лицевой счёт">{data.holder_from.id}</InfoRow>
                        <InfoRow label="Документ">
                          Серия: <b>{data.holder_from?.passport_type || "—"}</b>{" "}
                          Номер: <b>{data.holder_from?.passport_number || "—"}</b>{" "}
                          Выдан: <b>{data.holder_from?.passport_agency || "—"}</b>
                        </InfoRow>
                        <InfoRow label="Адрес">{data.holder_from.actual_address}</InfoRow>
                        <InfoRow label="Телефон, факс">{data.holder_from.phone_number}</InfoRow>
                        <InfoRow label="ИНН">{data.holder_from.inn}</InfoRow>
                      </SectionCard>
                    </Grid>
                  )}

                  {data.holder_to && (
                    <Grid item xs={12} md={6}>
                      <SectionCard title="Лицо принимающее ценные бумаги">
                        <InfoRow label="Ф.И.О">{data.holder_to.name}</InfoRow>
                        <InfoRow label="Лицевой счёт">{data.holder_to.id}</InfoRow>
                        <InfoRow label="Документ">
                          Серия: <b>{data.holder_to?.passport_type || "—"}</b>{" "}
                          Номер: <b>{data.holder_to?.passport_number || "—"}</b>{" "}
                          Выдан: <b>{data.holder_to?.passport_agency || "—"}</b>
                        </InfoRow>
                        <InfoRow label="Адрес">{data.holder_to.actual_address}</InfoRow>
                        <InfoRow label="Телефон, факс">{data.holder_to.phone_number}</InfoRow>
                        <InfoRow label="ИНН">{data.holder_to.inn}</InfoRow>
                      </SectionCard>
                    </Grid>
                  )}
                </Grid>

                <Divider className={classes.divider} />

                <SectionCard title="Передаваемые ценные бумаги">
                  <Grid container spacing={2} className={classes.compactSpacing}>
                    <Grid item xs={12} md={6}>
                      <InfoRow label="Эмитент">{EmitentData?.full_name}</InfoRow>
                      <InfoRow label="Эмиссия">{data.emission?.reg_number}</InfoRow>
                      <InfoRow label="Операция">{data.operation?.name}</InfoRow>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoRow label="Количество">{fmtNumber(data.quantity)}</InfoRow>
                      <InfoRow label="Сумма сделки">{fmtNumber(data.amount)}</InfoRow>
                      <InfoRow label="Дата сделки">{window.formatDate?.(data.contract_date)}</InfoRow>
                    </Grid>
                  </Grid>
                  {data.document_id && (
                    <Box marginTop={1} className={classes.compactBoxSmall}>
                      <NavLink to={`/admin/incoming-document/edit/${data.document_id}`}>
                        Входящий документ: {data.document_id}
                      </NavLink>
                    </Box>
                  )}
                </SectionCard>

                {/* Блок для печати (подписи, реквизиты) */}
                <div className={classes.printOnly}>
                  <div className={classes.signatures}>
                    <Typography className={classes.signatureLine}>Подпись передающего</Typography>
                    <Typography className={classes.signatureLine}>Подпись принимающего</Typography>
                  </div>

                  <Divider className={classes.divider} />

                  <Box>
                    <InfoRow label="Держатель реестра"><b>ОсОО "Реестродержатель Медина"</b></InfoRow>
                    <InfoRow label="Орган государственной регистрации"><b>Чуй-Бишкекское управление юстиции</b></InfoRow>
                    <InfoRow label="Регистрационный номер"><b>133580-3301-000 от 09.12.2013 год</b></InfoRow>
                    <InfoRow label="Лицензия"><b>№143 от 20.12.2013 г, Гос. служба регулир. и надзора за фин. рынком КР</b></InfoRow>
                    <InfoRow label="Юридический адрес"><b>720001 г. Бишкек пр. Чуй 164а, каб 202, тел 90-06-43, 31-17-65, 90-06-42</b></InfoRow>
                  </Box>

                  <Typography className={`${classes.signatureLine} ${classes.compactSignatureMargin}`} style={{ width: "70%" }}>
                    ФИО и подпись регистратора
                  </Typography>

                  <Box display="flex" justifyContent="space-between" marginTop={2} className={classes.compactBox}>
                    <Typography>
                      Номер операции: <b>{id}</b>
                    </Typography>
                    <Typography>
                      Дата операции: <b>{window.formatDate?.(data?.contract_date)}</b>
                    </Typography>
                  </Box>
                </div>
              </>
            )}
          </Box>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
