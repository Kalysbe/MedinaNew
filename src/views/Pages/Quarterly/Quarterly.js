import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import {
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import GetAppIcon from "@material-ui/icons/GetApp";
import ViewWeekIcon from "@material-ui/icons/ViewWeek";
import DateRangeIcon from "@material-ui/icons/DateRange";
import PrintIcon from "@material-ui/icons/Print";
import classNames from "classnames";
import * as XLSX from "xlsx";
import ReactToPrint from "react-to-print";

import { fetchQuarterlyReport } from "redux/actions/quarterly";
import { generateMockQuarterlyData } from "../../../utils/mockQuarterly";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filtersRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    alignItems: "flex-end",
  },
  filterControl: {
    minWidth: 180,
  },
  actionsGroup: {
    marginLeft: "auto",
    display: "flex",
    gap: theme.spacing(1.5),
    alignItems: "center",
  },
  summaryBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  summaryTile: {
    padding: theme.spacing(2),
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  summaryLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
    marginTop: theme.spacing(1),
  },
  tableContainer: {
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    overflow: "hidden",
  },
  tableWrapper: {
    maxHeight: "calc(100vh - 320px)",
    overflow: "auto",
  },
  tableTopScroll: {
    overflowX: "auto",
    overflowY: "hidden",
    height: 12,
    marginBottom: theme.spacing(0.5),
    "&::-webkit-scrollbar": {
      height: 6,
    },
  },
  tableTopScrollInner: {
    height: 1,
    pointerEvents: "none",
  },
  table: {
    minWidth: 1600,
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  headCell: {
    backgroundColor: "#F3F4F6",
    fontWeight: 600,
    fontSize: 11,
    color: "#1F2937",
    borderBottom: "1px solid #E5E7EB",
    whiteSpace: "nowrap",
    padding: theme.spacing(0.75, 1),
    lineHeight: 1.2,
  },
  stickyColumn: {
    position: "sticky",
    left: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 2,
    boxShadow: "2px 0 8px rgba(15, 23, 42, 0.08)",
  },
  stickyHeader: {
    top: 0,
    zIndex: 3,
  },
  bodyCell: {
    fontSize: 10.5,
    color: "#111827",
    borderBottom: "1px solid #F1F5F9",
    backgroundColor: "#FFFFFF",
    whiteSpace: "nowrap",
    padding: theme.spacing(0.5, 1),
    lineHeight: 1.3,
  },
  doubleHeaderRow: {
    "& th": {
      borderBottom: "1px solid #D1D5DB",
    },
  },
  doubleHeaderTop: {
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontSize: 10,
    backgroundColor: "#E5E7EB",
  },
  doubleHeaderBottom: {
    fontWeight: 500,
    fontSize: 10.5,
    color: "#4B5563",
    backgroundColor: "#F9FAFB",
  },
  zebraRow: {
    "& td": {
      backgroundColor: "#F9FAFB",
    },
  },
  loaderOverlay: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: "#4B5563",
  },
  statesWrapper: {
    padding: theme.spacing(4, 0),
    textAlign: "center",
  },
  tableTools: {
    display: "flex",
    gap: theme.spacing(1),
  },
  screenOnly: {
    "@media print": {
      display: "none !important",
    },
  },
  printOnly: {
    display: "none",
    "@media print": {
      display: "block !important",
    },
  },
  printTableSection: {
    marginBottom: theme.spacing(3),
  },
  printTableTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: "#111827",
  },
  printTable: {
    width: "100%",
    borderCollapse: "collapse",
    "& th, & td": {
      border: "1px solid #D1D5DB",
      padding: theme.spacing(1),
      fontSize: 12,
    },
    "& th": {
      backgroundColor: "#F3F4F6",
      fontWeight: 600,
    },
  },
  printSummaryHeading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: "#111827",
  },
  printMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(3),
    marginBottom: theme.spacing(2),
    fontSize: 13,
    color: "#4B5563",
  },
  "@media print": {
    filtersRow: {
      display: "none",
    },
    actionsGroup: {
      display: "none",
    },
    summaryTile: {
      backgroundColor: "transparent",
      borderColor: "#D1D5DB",
    },
    tableWrapper: {
      maxHeight: "none",
      overflow: "visible",
    },
    tableContainer: {
      border: "none",
      boxShadow: "none",
    },
    printOnly: {
      display: "block !important",
    },
    screenOnly: {
      display: "none !important",
    },
    printTableSection: {
      pageBreakBefore: "auto",
    },
  },
}));

const QUARTER_OPTIONS = [
  { value: 1, label: "I квартал" },
  { value: 2, label: "II квартал" },
  { value: 3, label: "III квартал" },
  { value: 4, label: "IV квартал" },
];

const DEFAULT_COLUMN_BLUEPRINT = Array.from({ length: 28 }, (_, index) => ({
  id: `column_${String(index + 1).padStart(2, "0")}`,
  label: `Поле ${index + 1}`,
}));

const PRIMARY_HEADER_LABELS = [
  "Показатель",
  "Параметр",
  "Метрика",
  "Секция",
  "Поле отчёта",
  "Значение",
  "Объём",
  "Тип записи",
  "Код",
  "Рейтинг",
  "Категория",
  "Группа",
  "Сегмент",
  "Порог",
  "Уровень",
  "Компонент",
  "Статья",
  "Направление",
  "Статус",
  "Описание",
  "Комментарий",
  "Источник",
  "Документ",
  "Валюта",
  "Баланс",
  "Процент",
  "Дата",
  "Примечание",
  "Флаг",
  "Маркер",
];

const PRINT_COLUMNS_PER_PAGE = 13;
const PRINT_ROWS_PER_PAGE = 100;

const generateYearOptions = (range = 15) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: range }, (_, idx) => currentYear - idx);
};

const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "number") {
    if (window?.formatNumber) {
      return window.formatNumber(value);
    }
    return value.toLocaleString("ru-RU");
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("ru-RU");
  }
  if (typeof value === "boolean") {
    return value ? "Да" : "Нет";
  }
  return value;
};

const Quarterly = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const emitent = useSelector((state) => state.emitents.store);
  const report = useSelector((state) => state.quarterly.report);
  const printRef = useRef(null);
  const tableWrapperRef = useRef(null);
  const topScrollRef = useRef(null);
  const topScrollInnerRef = useRef(null);

  const [filters, setFilters] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      quarter: Math.ceil((now.getMonth() + 1) / 3),
    };
  });
  const [dense, setDense] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const [useMockData, setUseMockData] = useState(
    () => window?.__MEDINA_DEBUG__?.quarterlyMockEnabled || false
  );

  const isLoading = report.status === "loading";
  const hasError = report.status === "error";
  const rawRows = report.rows || [];
  const rawColumns = report.columns || [];

  const mockRows = useMemo(() => generateMockQuarterlyData(100), []);
  const rows = useMockData ? mockRows : rawRows;
  const columnsFromApi = useMockData
    ? mockRows.length
      ? Object.keys(mockRows[0])
          .filter((key) => key.startsWith("column_"))
          .map((key, idx) => ({
            id: key,
            label: `Поле ${idx + 1}`,
          }))
      : []
    : rawColumns;

  const derivedColumns = useMemo(() => {
    if (columnsFromApi.length) {
      return columnsFromApi.map((column, index) => ({
        id: column.id || column.key || `column_${index}`,
        label: column.label || column.title || column.key || `Колонка ${index + 1}`,
        width: column.width,
      }));
    }

    if (rows.length) {
      const firstRow = rows[0];
      return Object.keys(firstRow).map((key) => ({
        id: key,
        label: key,
      }));
    }

    return [];
  }, [columnsFromApi, rows]);

  const tableColumns = useMemo(() => {
    if (derivedColumns.length) {
      return derivedColumns;
    }
    return DEFAULT_COLUMN_BLUEPRINT;
  }, [derivedColumns]);

  const displayColumns = useMemo(
    () =>
      tableColumns.map((column, index) => ({
        ...column,
        primaryLabel:
          PRIMARY_HEADER_LABELS[index] ||
          column.label ||
          `Колонка ${index + 1}`,
        secondaryLabel:
          column.label && column.label !== column.id
            ? column.label
            : `Показатель ${index + 1}`,
      })),
    [tableColumns]
  );

  const printColumnChunks = useMemo(() => {
    if (!displayColumns.length) {
      return [];
    }
    const chunks = [];
    for (let i = 0; i < displayColumns.length; i += PRINT_COLUMNS_PER_PAGE) {
      chunks.push(displayColumns.slice(i, i + PRINT_COLUMNS_PER_PAGE));
    }
    return chunks;
  }, [displayColumns]);

  const printRowChunks = useMemo(() => {
    if (!rows.length) {
      return [];
    }
    const chunks = [];
    for (let i = 0; i < rows.length; i += PRINT_ROWS_PER_PAGE) {
      chunks.push(rows.slice(i, i + PRINT_ROWS_PER_PAGE));
    }
    return chunks;
  }, [rows]);

  useEffect(() => {
    const topScroller = topScrollRef.current;
    const tableWrapper = tableWrapperRef.current;

    if (!topScroller || !tableWrapper) {
      return undefined;
    }

    const syncFromTop = () => {
      if (tableWrapper.scrollLeft !== topScroller.scrollLeft) {
        tableWrapper.scrollLeft = topScroller.scrollLeft;
      }
    };

    const syncFromBottom = () => {
      if (topScroller.scrollLeft !== tableWrapper.scrollLeft) {
        topScroller.scrollLeft = tableWrapper.scrollLeft;
      }
    };

    const updateTopScrollWidth = () => {
      if (topScrollInnerRef.current) {
        topScrollInnerRef.current.style.width = `${tableWrapper.scrollWidth}px`;
      }
    };

    topScroller.addEventListener("scroll", syncFromTop);
    tableWrapper.addEventListener("scroll", syncFromBottom);
    updateTopScrollWidth();

    let resizeObserver;
    if (window?.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateTopScrollWidth);
      resizeObserver.observe(tableWrapper);
    } else {
      window.addEventListener("resize", updateTopScrollWidth);
    }

    return () => {
      topScroller.removeEventListener("scroll", syncFromTop);
      tableWrapper.removeEventListener("scroll", syncFromBottom);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateTopScrollWidth);
      }
    };
  }, [rows, displayColumns]);

  const quarterLabel =
    QUARTER_OPTIONS.find((option) => option.value === filters.quarter)?.label ||
    `Квартал ${filters.quarter}`;

  const handleFilterChange = (key) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const fetchReport = useCallback(() => {
    if (!emitent?.id || !filters.year || !filters.quarter) {
      return;
    }

    dispatch(
      fetchQuarterlyReport({
        emitentId: emitent.id,
        year: filters.year,
        quarter: filters.quarter,
      })
    );
  }, [dispatch, emitent, filters.year, filters.quarter]);

  useEffect(() => {
    if (emitent?.id && !isInitialized) {
      fetchReport();
      setIsInitialized(true);
    }
  }, [emitent, fetchReport, isInitialized]);

  const handleExport = () => {
    if (!rows.length || !displayColumns.length) {
      return;
    }

    const header = [
      "№",
      ...displayColumns.map((column) => column.secondaryLabel || column.label),
    ];
    const body = rows.map((row, idx) => [
      idx + 1,
      ...displayColumns.map((column) => formatCellValue(row[column.id])),
    ]);

    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
    ws["!cols"] = header.map(() => ({ wch: 20 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quarterly");
    XLSX.writeFile(
      wb,
      `quarterly_report_Q${filters.quarter}_${filters.year}.xlsx`
    );
  };

  const summaryCards = [
    {
      label: "Эмитент",
      value: emitent?.short_name || emitent?.name || "—",
    },
    {
      label: "Период",
      value: `${quarterLabel} ${filters.year}`,
    },
    {
      label: "Количество записей",
      value: rows.length,
    },
    {
      label: "Дата формирования",
      value:
        report.meta?.generated_at ||
        report.meta?.generatedAt ||
        "Будет сформировано после запроса",
    },
  ];

  return (
    <Card>
      <CardHeader color="info" icon>
        <CardIcon color="info">
          <DateRangeIcon />
        </CardIcon>
        <div className={classes.cardHeader}>
          <h4 style={{ margin: 0 }}>Квартальный отчет</h4>
          {isLoading && (
            <div className={classes.loaderOverlay}>
              <CircularProgress size={18} />
              <span>Формируем данные…</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className={classes.filtersRow}>
          <FormControl
            variant="outlined"
            size="small"
            className={classes.filterControl}
          >
            <InputLabel id="year-label">Год</InputLabel>
            <Select
              labelId="year-label"
              value={filters.year}
              onChange={handleFilterChange("year")}
              label="Год"
            >
              {generateYearOptions(20).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            size="small"
            className={classes.filterControl}
          >
            <InputLabel id="quarter-label">Квартал</InputLabel>
            <Select
              labelId="quarter-label"
              value={filters.quarter}
              onChange={handleFilterChange("quarter")}
              label="Квартал"
            >
              {QUARTER_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className={classes.actionsGroup}>
            <Tooltip title="Обновить данные">
              <span>
                <IconButton
                  color="primary"
                  onClick={fetchReport}
                  disabled={isLoading || !emitent?.id}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Экспортировать в Excel">
              <span>
                <IconButton
                  onClick={handleExport}
                  disabled={!rows.length || isLoading}
                >
                  <GetAppIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                useMockData
                  ? "Отключить тестовые данные"
                  : "Включить тестовые данные"
              }
            >
              <span>
                <IconButton
                  onClick={() => setUseMockData((prev) => !prev)}
                  color={useMockData ? "secondary" : "default"}
                >
                  {useMockData ? "MOCK" : "DEV"}
                </IconButton>
              </span>
            </Tooltip>
            <ReactToPrint
              trigger={() => (
                <span>
                  <Tooltip title="Печать отчёта">
                    <span>
                      <IconButton
                        color="primary"
                        disabled={!rows.length || isLoading}
                      >
                        <PrintIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </span>
              )}
              content={() => printRef.current}
              pageStyle={`
                @page { size: landscape; margin: 10mm; }
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                  }
                }
              `}
            />
            <Tooltip title={dense ? "Обычная высота строк" : "Компактный вид"}>
              <span>
                <IconButton onClick={() => setDense((prev) => !prev)}>
                  <ViewWeekIcon color={dense ? "primary" : "inherit"} />
                </IconButton>
              </span>
            </Tooltip>
            <Button
              color="info"
              onClick={fetchReport}
              disabled={isLoading || !emitent?.id}
            >
              Сформировать
            </Button>
          </div>
        </div>

        <div ref={printRef}>
          <div className={classNames(classes.summaryBar, classes.screenOnly)}>
            {summaryCards.map((card) => (
              <div key={card.label} className={classes.summaryTile}>
                <div className={classes.summaryLabel}>{card.label}</div>
                <div className={classes.summaryValue}>{card.value}</div>
              </div>
            ))}
          </div>

          <GridContainer className={classes.screenOnly}>
            <GridItem xs={12}>
              <div className={classes.tableTopScroll} ref={topScrollRef}>
                <div
                  className={classes.tableTopScrollInner}
                  ref={topScrollInnerRef}
                />
              </div>
              <div className={classes.tableContainer}>
                <div className={classes.tableWrapper} ref={tableWrapperRef}>
                  <Table
                    stickyHeader
                    className={classes.table}
                    size={dense ? "small" : "medium"}
                  >
                    <TableHead>
                      <TableRow className={classes.doubleHeaderRow}>
                        <TableCell
                          className={classNames(
                            classes.headCell,
                            classes.stickyColumn,
                            classes.stickyHeader,
                            classes.doubleHeaderTop
                          )}
                          rowSpan={2}
                          style={{ minWidth: 48 }}
                        >
                          №
                        </TableCell>
                        {displayColumns.map((column) => (
                          <TableCell
                            key={`${column.id}-top`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderTop
                            )}
                            style={{ minWidth: column.width || 150 }}
                          >
                            {column.primaryLabel}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow className={classes.doubleHeaderRow}>
                        {displayColumns.map((column) => (
                          <TableCell
                            key={`${column.id}-bottom`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderBottom
                            )}
                            style={{ minWidth: column.width || 150 }}
                          >
                            {column.secondaryLabel}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!rows.length && !isLoading && (
                        <TableRow>
                          <TableCell
                            colSpan={displayColumns.length + 1}
                            className={classes.bodyCell}
                            style={{ textAlign: "center" }}
                          >
                            Данные не найдены. Выберите параметры и нажмите
                            &nbsp;<strong>Сформировать</strong>.
                          </TableCell>
                        </TableRow>
                      )}
                      {rows.map((row, rowIndex) => (
                        <TableRow
                          key={`row-${rowIndex}`}
                          className={rowIndex % 2 === 0 ? classes.zebraRow : undefined}
                        >
                          <TableCell
                            className={classNames(
                              classes.bodyCell,
                              classes.stickyColumn
                            )}
                          >
                            {rowIndex + 1}
                          </TableCell>
                          {displayColumns.map((column) => (
                            <TableCell key={column.id} className={classes.bodyCell}>
                              {formatCellValue(row[column.id])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {hasError && (
                <div className={classes.statesWrapper}>
                  <Typography color="error">
                    {report.error || "Не удалось загрузить отчёт. Попробуйте снова."}
                  </Typography>
                </div>
              )}
            </GridItem>
          </GridContainer>

          <div className={classes.printOnly}>
            <div className={classes.summaryBar}>
              {summaryCards.map((card) => (
                <div key={card.label} className={classes.summaryTile}>
                  <div className={classes.summaryLabel}>{card.label}</div>
                  <div className={classes.summaryValue}>{card.value}</div>
                </div>
              ))}
            </div>

            {printRowChunks.length
              ? printRowChunks.map((rowChunk, rowChunkIndex) => {
                  const rowStart = rowChunkIndex * PRINT_ROWS_PER_PAGE + 1;
                  const rowEnd = rowStart + rowChunk.length - 1;
                  return (
                    <div key={`print-rows-${rowChunkIndex}`}>
                      <div className={classes.printTableTitle}>
                        Строки {rowStart}–{rowEnd}
                      </div>
                      {printColumnChunks.map((chunk, chunkIndex) => (
                        <div
                          key={`print-chunk-${rowChunkIndex}-${chunkIndex}`}
                          className={classes.printTableSection}
                          style={{
                            pageBreakBefore:
                              rowChunkIndex === 0 && chunkIndex === 0 ? "auto" : "always",
                          }}
                        >
                          <div style={{ fontSize: 12, marginBottom: 4 }}>
                            Столбцы{" "}
                            {chunkIndex * PRINT_COLUMNS_PER_PAGE + 1}–
                            {chunkIndex * PRINT_COLUMNS_PER_PAGE + chunk.length}
                          </div>
                          <table className={classes.printTable}>
                            <thead>
                              <tr>
                                <th>№</th>
                                {chunk.map((column) => (
                                  <th key={column.id}>
                                    {column.secondaryLabel || column.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rowChunk.map((row, rowIndex) => (
                                <tr key={`print-row-${rowChunkIndex}-${rowIndex}`}>
                                  <td>{rowStart + rowIndex}</td>
                                  {chunk.map((column) => (
                                    <td key={column.id}>
                                      {formatCellValue(row[column.id])}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  );
                })
              : (
                <div style={{ textAlign: "center", fontSize: 13 }}>
                  Данные не найдены
                </div>
              )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Quarterly;

