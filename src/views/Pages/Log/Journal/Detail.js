import React, { useEffect, useRef, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Paper,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";

// core components (из шаблона)
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

import { useDispatch, useSelector } from "react-redux";
import { fetchEmitentById } from "redux/actions/emitents";
import { fetchJournalById } from "redux/actions/journal";

const titles = {
  id: "ID",
  holder_type: "Тип держателя (ID)",
  type: "Тип держателя",
  district_id: "ID района",
  district: "Район/город",
  name: "Ф.И.О.",
  actual_address: "Фактический адрес",
  legal_address: "Юридический адрес",
  email: "Электронная почта",
  status: "Отношение к акциям",
  holder_status: "Отношение к акциям (ID)",
  phone_number: "Телефон",
  passport_type: "Тип паспорта",
  passport_number: "Номер паспорта",
  passport_agency: "Кем выдан",
  inn: "ИНН",
  document_id: "Входящий документ",
};

/** Унифицированный вывод значений.
 * - null/undefined/"" -> "—"
 * - Object -> v.name (если есть), иначе v.title / v.label / v.full_name / v.id, иначе JSON
 * - Array -> элементы по тем же правилам, через ", "
 */
const display = (v) => {
  if (v === null || v === undefined || v === "") return "—";

  const objToText = (o) => {
    if (o === null || o === undefined) return "—";
    if (typeof o !== "object") return String(o);
    const candidate =
      ("name" in o && o.name) ??
      ("title" in o && o.title) ??
      ("label" in o && o.label) ??
      ("full_name" in o && o.full_name) ??
      ("id" in o ? o.id : undefined);
    return candidate !== undefined && candidate !== null && candidate !== ""
      ? String(candidate)
      : JSON.stringify(o);
  };

  if (Array.isArray(v)) return v.map(objToText).join(", ");
  if (typeof v === "object") return objToText(v);
  return String(v);
};

const useStyles = makeStyles((theme) => ({
  actionsBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    padding: theme.spacing(1),
  },
  printWrapper: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    background: theme.palette.background.default,
    padding: theme.spacing(3),
    "@media print": {
      margin: 20,
      padding: 16,
      border: "1px solid #000",
      background: "#fff",
      borderRadius: 6,
    },
  },
  printOnly: {
    display: "none",
    "@media print": { display: "block" },
  },
  screenOnly: {
    "@media print": { display: "none" },
  },
  changed: {
    background: "rgba(255, 193, 7, 0.18)",
  },
  headerBlock: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  section: { marginTop: theme.spacing(2) },
  paper: { padding: theme.spacing(2), borderRadius: 8 },
  signatureLine: {
    borderTop: "1px solid #000",
    paddingTop: 6,
    minWidth: 220,
    textAlign: "center",
  },
}));

export default function JournalDetailPrint() {
  const classes = useStyles();
  const detailsRef = useRef();
  const statementRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();

  const Emitent = useSelector((s) => s.emitents.store);
  const EmitentData = useSelector((s) => s.emitents.emitent.data);
  const journalDetail = useSelector((s) => s.journal?.journalDetail);

  useEffect(() => {
    if (Emitent?.id) dispatch(fetchEmitentById(Emitent.id));
  }, [dispatch, Emitent?.id]);

  useEffect(() => {
    if (id) dispatch(fetchJournalById(id));
  }, [dispatch, id]);

  const oldVal = journalDetail?.old_value || {};
  const newVal = journalDetail?.new_value || {};

  // Ключи: сначала действительно изменённые (после нормализации через display), затем одинаковые
  const keys = useMemo(() => {
    const k = Array.from(new Set([...(Object.keys(oldVal || {})), ...(Object.keys(newVal || {}))]));
    const changed = k.filter((key) => display(oldVal[key]) !== display(newVal[key]));
    const same = k.filter((key) => display(oldVal[key]) === display(newVal[key]));
    return [...changed, ...same];
  }, [oldVal, newVal]);

  const changedReasons = useMemo(() => {
    const reasons = [];
    const diff = (k) => display(oldVal[k]) !== display(newVal[k]);
    if (diff("actual_address") || diff("legal_address")) reasons.push("изменением адреса");
    if (diff("passport_number") || diff("passport_type") || diff("passport_agency"))
      reasons.push("изменением паспортных данных");
    if (diff("name")) reasons.push("сменой Ф.И.О.");
    if (diff("inn")) reasons.push("изменением ИНН");
    return reasons.length ? reasons.join(", ") : "необходимостью актуализации анкетных данных";
  }, [oldVal, newVal]);

  const applicantName = newVal.name || oldVal.name || "_______________";
  const applicantAddress = newVal.actual_address || oldVal.actual_address || "_______________";
  const passportType = display(newVal.passport_type ?? oldVal.passport_type);
  const passportNumber = display(newVal.passport_number ?? oldVal.passport_number);
  const passportAgency = display(newVal.passport_agency ?? oldVal.passport_agency);
  const phone = display(newVal.phone_number ?? oldVal.phone_number);
  const inn = display(newVal.inn ?? oldVal.inn);

  const createdDate = journalDetail?.createdAt ? new Date(journalDetail.createdAt) : new Date();
  const fmtDate = (d) =>
    new Intl.DateTimeFormat("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

  const isLoading = !journalDetail && !!id;

  return (
    <GridContainer>
      {/* Блок 1: Детали изменений */}
      <GridItem xs={12}>
        <Box className={classes.actionsBar}>
          <ReactToPrint
            trigger={() => (
              <Button className={classes.screenOnly} color="warning" size="sm">
                Печать таблицы изменений
              </Button>
            )}
            content={() => detailsRef.current}
          />
        </Box>
        <Card>
          <Box p={3} ref={detailsRef} className={classes.printWrapper}>
            <div className={classes.headerBlock}>
              <Typography variant="h6">Просмотр изменённых анкетных данных</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {EmitentData?.full_name || "Эмитент — загружается"}
              </Typography>
            </div>

            {isLoading ? (
              <Box py={6} display="flex" flexDirection="column" alignItems="center">
                <CircularProgress size={64} />
                <Box mt={2} color="textSecondary.main">Загрузка…</Box>
              </Box>
            ) : (
              <Paper elevation={0} className={classes.paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Параметр</TableCell>
                      <TableCell>До</TableCell>
                      <TableCell>После</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {keys.map((key) => {
                      const before = display(oldVal[key]);
                      const after = display(newVal[key]);
                      const isChanged = before !== after;
                      return (
                        <TableRow key={key} className={isChanged ? classes.changed : undefined}>
                          <TableCell>{titles[key] || key}</TableCell>
                          <TableCell>{before}</TableCell>
                          <TableCell>{after}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <Divider style={{ marginTop: 16, marginBottom: 8 }} />
                <Typography variant="caption" color="textSecondary">
                  Запись: {display(journalDetail?.title)} • Тип изменения: {display(journalDetail?.change_type)} • Дата: {fmtDate(createdDate)}
                </Typography>
              </Paper>
            )}
          </Box>
        </Card>
      </GridItem>

      {/* Блок 2: Заявление */}
      <GridItem xs={12}>
        <Box className={classes.actionsBar}>
          <ReactToPrint
            trigger={() => (
              <Button className={classes.screenOnly} color="warning" size="sm">
                Печать заявления
              </Button>
            )}
            content={() => statementRef.current}
          />
        </Box>
        <Card>
          <Box p={3} ref={statementRef} className={classes.printWrapper}>
            {isLoading ? (
              <Box py={6} display="flex" flexDirection="column" alignItems="center">
                <CircularProgress size={64} />
                <Box mt={2} color="textSecondary.main">Загрузка…</Box>
              </Box>
            ) : (
              <>
                <Box textAlign="right">
                  <Typography variant="subtitle1">
                    Директору ОсОО "Реестродержатель Медина" Тентишевой Г.М.
                  </Typography>
                  <Typography variant="subtitle1">
                    от акционера: <b>{applicantName}</b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Адрес: {display(applicantAddress)} • Тел.: {phone} • ИНН: {inn}
                  </Typography>
                </Box>

                <Box textAlign="center" className={classes.section}>
                  <Typography variant="h6">Заявление</Typography>
                </Box>

                <Box className={classes.section}>
                  <Typography variant="body1" paragraph>
                    Прошу внести изменения в реестр акционеров <b>{EmitentData?.full_name || "[Эмитент]"}</b> в связи с {changedReasons}. Изменения прошу
                    произвести на основании прилагаемых документов.
                  </Typography>

                  <Typography variant="body1" paragraph>
                    Актуальные данные заявителя:
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Ф.И.О.: <b>{applicantName}</b></Typography>
                      <Typography variant="body2">Адрес: <b>{display(applicantAddress)}</b></Typography>
                      <Typography variant="body2">Телефон: <b>{phone}</b></Typography>
                      <Typography variant="body2">ИНН: <b>{inn}</b></Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Паспорт: <b>{passportType} № {passportNumber}</b></Typography>
                      <Typography variant="body2">Кем выдан: <b>{passportAgency}</b></Typography>
                    </Grid>
                  </Grid>

                  <Divider className={classes.section} />

                  <Typography variant="body2" color="textSecondary">
                    Перечень изменённых полей:
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Параметр</TableCell>
                        <TableCell>Было</TableCell>
                        <TableCell>Стало</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {keys
                        .filter((k) => display(oldVal[k]) !== display(newVal[k]))
                        .map((k) => (
                          <TableRow key={k}>
                            <TableCell>{titles[k] || k}</TableCell>
                            <TableCell>{display(oldVal[k])}</TableCell>
                            <TableCell>{display(newVal[k])}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  <Box display="flex" justifyContent="space-between" className={classes.section}>
                    <Typography>Дата: <b>{fmtDate(createdDate)}</b></Typography>
                    <Typography>Подпись заявителя: ____________________</Typography>
                  </Box>
                </Box>

                <div className={classes.printOnly}>
                  <Divider className={classes.section} />
                  <Typography variant="caption">
                    Держатель реестра: ОсОО "Реестродержатель Медина". Юр. адрес: 720001 г. Бишкек, пр. Чуй 164а, каб. 202, тел. 90-06-43, 31-17-65, 90-06-42.
                  </Typography>
                </div>
              </>
            )}
          </Box>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
