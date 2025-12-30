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
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Collapse,
  Box,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import GetAppIcon from "@material-ui/icons/GetApp";
import DateRangeIcon from "@material-ui/icons/DateRange";
import PrintIcon from "@material-ui/icons/Print";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import classNames from "classnames";
import * as XLSX from "xlsx";
import ReactToPrint from "react-to-print";

import { fetchQuarterlyPrint } from "redux/actions/prints";

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
    minWidth: 1200,
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  headCell: {
    backgroundColor: "#F3F4F6",
    fontWeight: 600,
    fontSize: 10,
    color: "#1F2937",
    borderBottom: "1px solid #E5E7EB",
    whiteSpace: "nowrap",
    padding: theme.spacing(0.5, 0.75),
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
    fontSize: 9.5,
    color: "#111827",
    borderBottom: "1px solid #F1F5F9",
    backgroundColor: "#FFFFFF",
    whiteSpace: "nowrap",
    padding: theme.spacing(0.4, 0.75),
    lineHeight: 1.2,
  },
  operationBorder: {
    borderLeft: "2px solid #D1D5DB",
  },
  baseColumnsBorder: {
    borderRight: "2px solid #D1D5DB",
  },
  doubleHeaderRow: {
    "& th": {
      borderBottom: "1px solid #D1D5DB",
    },
  },
  doubleHeaderTop: {
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontSize: 9,
    backgroundColor: "#E5E7EB",
  },
  doubleHeaderBottom: {
    fontWeight: 500,
    fontSize: 9,
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
      padding: theme.spacing(0.3, 0.5),
      fontSize: 8,
      lineHeight: 1.1,
    },
    "& th": {
      backgroundColor: "#F3F4F6",
      fontWeight: 600,
      fontSize: 8,
    },
  },
  printOperationBorder: {
    borderLeft: "2px solid #D1D5DB !important",
  },
  printBaseColumnsBorder: {
    borderRight: "2px solid #D1D5DB !important",
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
  operationsSelector: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
  },
  operationsSelectorHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#F3F4F6",
      borderRadius: 4,
    },
  },
  operationsSelectorTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: "#111827",
  },
  operationsCheckboxGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    padding: theme.spacing(2, 1, 1, 1),
    maxHeight: 200,
    overflowY: "auto",
  },
  operationsCheckbox: {
    minWidth: 200,
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
    printTable: {
      "& th, & td": {
        padding: "2px 4px !important",
        fontSize: "7px !important",
        lineHeight: "1.1 !important",
      },
      "& th": {
        fontSize: "7px !important",
        fontWeight: 600,
      },
    },
    table: {
      minWidth: "auto !important",
    },
    headCell: {
      padding: "2px 4px !important",
      fontSize: "7px !important",
    },
    bodyCell: {
      padding: "2px 4px !important",
      fontSize: "7px !important",
    },
  },
}));

const QUARTER_OPTIONS = [
  { value: 0, label: "Годовой" },
  { value: 1, label: "1 квартал" },
  { value: 2, label: "2 квартал" },
  { value: 3, label: "3 квартал" },
  { value: 4, label: "4 квартал" },
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

const PRINT_COLUMNS_PER_PAGE = 25;
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
  const quarterlyPrint = useSelector((state) => state.prints?.prints?.quarterlyPrint) || {
    data: {},
    status: "idle",
  };
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
  const [isInitialized, setIsInitialized] = useState(false);

  const isLoading = quarterlyPrint?.status === "loading";
  const hasError = quarterlyPrint?.status === "error";
  
  // Извлекаем данные из quarterlyPrint.data
  const printData = quarterlyPrint?.data || {};
  const isArrayData = Array.isArray(printData);
  const rawData = isArrayData ? printData : (printData.rows || printData.data || printData.items || []);
  const metaData = isArrayData ? {} : (printData.meta || {});

  // Преобразуем данные из API в формат таблицы
  const transformedData = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { rows: [], baseColumns: [], exchangeColumn: null, nonExchangeColumn: null };
    }

    // Собираем все уникальные операции из всех эмиссий
    const allOperations = new Set();
    rawData.forEach((item) => {
      if (Array.isArray(item.operations)) {
        item.operations.forEach((op) => {
          if (op.name) {
            allOperations.add(op.name);
          }
        });
      }
    });

    const operationsList = Array.from(allOperations).sort();

    // Создаем колонки с многоуровневой структурой
    const baseColumns = [
      { id: "emitent", label: "Эмитент", isBase: true },
      { id: "emission", label: "Эмиссия", isBase: true },
      // { id: "emission_id", label: "Emission ID", isBase: true },
    ];

    // Создаем колонку для биржевых данных
    const exchangeColumn = {
      id: "exchange",
      label: "Биржевые",
      isExchange: true,
      subColumns: [
        { id: "exchange_count", label: "сделки", type: "count" },
        { id: "exchange_quantity", label: "кол-во", type: "quantity" },
        { id: "exchange_volume", label: "объем", type: "volume" },
      ],
    };

    // Создаем колонки для операций (каждая операция имеет 3 подстолбца)
    const operationColumns = operationsList.map((opName) => ({
      id: opName,
      label: opName,
      isOperation: true,
      subColumns: [
        { id: `${opName}_count`, label: "сделки", type: "count" },
        { id: `${opName}_quantity`, label: "кол-во", type: "quantity" },
        { id: `${opName}_volume`, label: "объем", type: "volume" },
      ],
    }));

    // Создаем колонку для "Другие"
    const othersColumn = {
      id: "others",
      label: "Другие",
      isOthers: true,
      subColumns: [
        { id: "others_count", label: "сделки", type: "count" },
        { id: "others_quantity", label: "кол-во", type: "quantity" },
        { id: "others_volume", label: "объем", type: "volume" },
      ],
    };

    // Объединяем все операции и others в одну секцию "Небиржевые"
    const nonExchangeColumn = {
      id: "nonExchange",
      label: "Небиржевые",
      isNonExchange: true,
      operationColumns: operationColumns,
      othersColumn: othersColumn,
    };

    // Создаем строки
    const rows = rawData.map((item) => {
      const row = {
        emitent: item.emitent || "",
        emission: item.emission || "",
        emission_id: item.emission_id || "",
      };

      // Заполняем биржевые данные
      if (item.exchange) {
        row.exchange_count = item.exchange.count ?? 0;
        row.exchange_quantity = item.exchange.quantity ?? 0;
        row.exchange_volume = item.exchange.volume ?? 0;
      } else {
        row.exchange_count = 0;
        row.exchange_quantity = 0;
        row.exchange_volume = 0;
      }

      // Создаем объект для быстрого поиска операций
      const operationsMap = {};
      if (Array.isArray(item.operations)) {
        item.operations.forEach((op) => {
          if (op.name) {
            operationsMap[op.name] = op;
          }
        });
      }

      // Заполняем значения для каждой операции
      operationsList.forEach((opName) => {
        const op = operationsMap[opName] || {};
        row[`${opName}_count`] = op.count ?? 0;
        row[`${opName}_quantity`] = op.quantity ?? 0;
        row[`${opName}_volume`] = op.volume ?? 0;
      });

      // Заполняем данные "Другие"
      if (item.others) {
        row.others_count = item.others.count ?? 0;
        row.others_quantity = item.others.quantity ?? 0;
        row.others_volume = item.others.volume ?? 0;
      } else {
        row.others_count = 0;
        row.others_quantity = 0;
        row.others_volume = 0;
      }

      return row;
    });

    return { 
      rows, 
      baseColumns, 
      exchangeColumn, 
      nonExchangeColumn,
    };
  }, [rawData]);

  const rows = transformedData.rows;
  const rowsWithOther = rows;

  // Для новой структуры с операциями создаем плоский список всех колонок для отображения
  const flatColumns = useMemo(() => {
    // Для реальных данных используем новую структуру
    const flat = [];
    
    // Базовые колонки
    if (transformedData.baseColumns) {
      transformedData.baseColumns.forEach((col) => {
        flat.push({ ...col, isBase: true });
      });
    }
    
    // Колонка биржевых данных
    if (transformedData.exchangeColumn) {
      transformedData.exchangeColumn.subColumns.forEach((subCol) => {
        flat.push({
          id: subCol.id,
          label: subCol.label,
          operationName: transformedData.exchangeColumn.label,
          type: subCol.type,
          isExchange: true,
        });
      });
    }
    
    // Колонки операций с подстолбцами (небиржевые)
    if (transformedData.nonExchangeColumn) {
      if (transformedData.nonExchangeColumn.operationColumns) {
        transformedData.nonExchangeColumn.operationColumns.forEach((opCol) => {
          opCol.subColumns.forEach((subCol) => {
            flat.push({
              id: subCol.id,
              label: subCol.label,
              operationName: opCol.label,
              type: subCol.type,
              isOperation: true,
              isNonExchange: true,
            });
          });
        });
      }
      
      // Колонка "Другие"
      if (transformedData.nonExchangeColumn.othersColumn) {
        transformedData.nonExchangeColumn.othersColumn.subColumns.forEach((subCol) => {
          flat.push({
            id: subCol.id,
            label: subCol.label,
            operationName: transformedData.nonExchangeColumn.othersColumn.label,
            type: subCol.type,
            isOthers: true,
            isNonExchange: true,
          });
        });
      }
    }
    
    return flat;
  }, [transformedData]);

  const displayColumns = useMemo(() => {
    // Для новой структуры создаем отображение с группировкой
    const result = [];
    
    // Базовые колонки
    if (transformedData.baseColumns) {
      transformedData.baseColumns.forEach((col) => {
        result.push({
          ...col,
          primaryLabel: col.label,
          secondaryLabel: col.label,
          isBase: true,
        });
      });
    }
    
    // Колонка биржевых данных
    if (transformedData.exchangeColumn) {
      transformedData.exchangeColumn.subColumns.forEach((subCol) => {
        result.push({
          id: subCol.id,
          primaryLabel: transformedData.exchangeColumn.label,
          secondaryLabel: subCol.label,
          operationName: transformedData.exchangeColumn.label,
          type: subCol.type,
          isExchange: true,
        });
      });
    }
    
    // Колонки операций (небиржевые)
    if (transformedData.nonExchangeColumn) {
      if (transformedData.nonExchangeColumn.operationColumns) {
        transformedData.nonExchangeColumn.operationColumns.forEach((opCol) => {
          opCol.subColumns.forEach((subCol) => {
            result.push({
              id: subCol.id,
              primaryLabel: opCol.label,
              secondaryLabel: subCol.label,
              operationName: opCol.label,
              type: subCol.type,
              isOperation: true,
              isNonExchange: true,
            });
          });
        });
      }
      
      // Колонка "Другие"
      if (transformedData.nonExchangeColumn.othersColumn) {
        transformedData.nonExchangeColumn.othersColumn.subColumns.forEach((subCol) => {
          result.push({
            id: subCol.id,
            primaryLabel: transformedData.nonExchangeColumn.othersColumn.label,
            secondaryLabel: subCol.label,
            operationName: transformedData.nonExchangeColumn.othersColumn.label,
            type: subCol.type,
            isOthers: true,
            isNonExchange: true,
          });
        });
      }
    }
    
    return result;
  }, [flatColumns, transformedData]);

  const printColumnChunks = useMemo(() => {
    if (!displayColumns.length) {
      return [];
    }
    
    // Разделяем колонки на базовые и остальные
    const baseColumns = displayColumns.filter((col) => col.isBase);
    const otherColumns = displayColumns.filter((col) => !col.isBase);
    
    // Если колонок мало, возвращаем все на одной странице
    if (displayColumns.length <= PRINT_COLUMNS_PER_PAGE) {
      return [displayColumns];
    }
    
    // Распределяем пропорционально на максимум 2 страницы
    const totalOtherColumns = otherColumns.length;
    const columnsPerPage = Math.ceil(totalOtherColumns / 2);
    
    const chunks = [];
    
    // Первая страница: базовые + первая половина остальных
    chunks.push([
      ...baseColumns,
      ...otherColumns.slice(0, columnsPerPage)
    ]);
    
    // Вторая страница: базовые + вторая половина остальных (если есть)
    if (otherColumns.length > columnsPerPage) {
      chunks.push([
        ...baseColumns,
        ...otherColumns.slice(columnsPerPage)
      ]);
    }
    
    return chunks;
  }, [displayColumns]);

  const printRowChunks = useMemo(() => {
    if (!rowsWithOther.length) {
      return [];
    }
    const chunks = [];
    for (let i = 0; i < rowsWithOther.length; i += PRINT_ROWS_PER_PAGE) {
      chunks.push(rowsWithOther.slice(i, i + PRINT_ROWS_PER_PAGE));
    }
    return chunks;
  }, [rowsWithOther]);

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
  }, [rowsWithOther, displayColumns]);

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
    if (!filters.year || filters.quarter == null) {
      return;
    }

    dispatch(
      fetchQuarterlyPrint({
        quarter: filters.quarter,
        year: filters.year,
      })
    );
  }, [dispatch, filters.year, filters.quarter]);

  useEffect(() => {
    if (!isInitialized) {
      fetchReport();
      setIsInitialized(true);
    }
  }, [fetchReport, isInitialized]);

  // Автоматически загружаем данные при изменении фильтров
  useEffect(() => {
    if (isInitialized && filters.year && filters.quarter != null) {
      fetchReport();
    }
  }, [filters.year, filters.quarter, isInitialized, fetchReport]);

  const handleExport = () => {
    if (!rowsWithOther.length || !displayColumns.length) {
      return;
    }

    const header = [
      "№",
      ...displayColumns.map((column) => column.secondaryLabel || column.label),
    ];
    const body = rowsWithOther.map((row, idx) => [
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
      label: "Период",
      value: `${quarterLabel} ${filters.year}`,
    },
    {
      label: "Количество записей",
      value: rowsWithOther.length,
    },
    {
      label: "Дата формирования",
      value:
        metaData.generated_at ||
        metaData.generatedAt ||
        new Date().toLocaleDateString("ru-RU") ||
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
                  disabled={isLoading}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Экспортировать в Excel">
              <span>
                <IconButton
                  onClick={handleExport}
                  disabled={!rowsWithOther.length || isLoading}
                >
                  <GetAppIcon />
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
                        disabled={!rowsWithOther.length || isLoading}
                      >
                        <PrintIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </span>
              )}
              content={() => printRef.current}
              pageStyle={`
                @page { 
                  size: landscape; 
                  margin: 5mm; 
                }
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                  }
                  * {
                    font-size: 7px !important;
                  }
                  table {
                    font-size: 7px !important;
                  }
                  th, td {
                    padding: 2px 4px !important;
                    font-size: 7px !important;
                  }
                }
              `}
            />
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
                    size="small"
                  >
                    <TableHead>
                      <TableRow className={classes.doubleHeaderRow}>
                        <TableCell
                          className={classNames(
                            classes.headCell,
                            classes.stickyHeader,
                            classes.doubleHeaderTop
                          )}
                          rowSpan={3}
                          style={{ minWidth: 48 }}
                        >
                          №
                        </TableCell>
                        {/* Базовые колонки */}
                        {displayColumns
                          .filter((col) => col.isBase)
                          .map((column, index, array) => (
                            <TableCell
                              key={`${column.id}-base`}
                              className={classNames(
                                classes.headCell,
                                classes.stickyHeader,
                                classes.doubleHeaderTop,
                                index === array.length - 1 && classes.baseColumnsBorder
                              )}
                              rowSpan={3}
                              style={{ minWidth: column.width || 100 }}
                            >
                              {column.primaryLabel}
                            </TableCell>
                          ))}
                        {/* Колонка биржевых данных - верхний уровень */}
                        {transformedData.exchangeColumn && (
                          <TableCell
                            key={`${transformedData.exchangeColumn.id}-top`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderTop,
                              classes.operationBorder
                            )}
                            colSpan={3}
                            rowSpan={2}
                            style={{ minWidth: 120 }}
                          >
                            {transformedData.exchangeColumn.label}
                          </TableCell>
                        )}
                        {/* Колонка небиржевых данных - верхний уровень */}
                        {transformedData.nonExchangeColumn && (
                          <TableCell
                            key={`${transformedData.nonExchangeColumn.id}-top`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderTop,
                              classes.operationBorder
                            )}
                            rowSpan={1}
                            colSpan={
                              (transformedData.nonExchangeColumn.operationColumns?.reduce(
                                (sum, op) => sum + op.subColumns.length,
                                0
                              ) || 0) +
                              (transformedData.nonExchangeColumn.othersColumn?.subColumns.length || 0)
                            }
                            style={{ minWidth: 120 }}
                          >
                            {transformedData.nonExchangeColumn.label}
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className={classes.doubleHeaderRow}>
                        {/* Типы операций внутри небиржевых - средний уровень */}
                        {/* Типы операций внутри небиржевых - средний уровень */}
                        {transformedData.nonExchangeColumn?.operationColumns?.map((opCol) => (
                          <TableCell
                            key={`${opCol.id}-middle`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderTop,
                              classes.operationBorder
                            )}
                            colSpan={3}
                            style={{ minWidth: 120 }}
                          >
                            {opCol.label}
                          </TableCell>
                        ))}
                        {/* "Другие" внутри небиржевых - средний уровень */}
                        {transformedData.nonExchangeColumn?.othersColumn && (
                          <TableCell
                            key={`${transformedData.nonExchangeColumn.othersColumn.id}-middle`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderTop,
                              classes.operationBorder
                            )}
                            colSpan={3}
                            style={{ minWidth: 120 }}
                          >
                            {transformedData.nonExchangeColumn.othersColumn.label}
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className={classes.doubleHeaderRow}>
                        {/* Подзаголовки для биржевых данных - нижний уровень */}
                        {transformedData.exchangeColumn?.subColumns.map((subCol, subIndex) => (
                          <TableCell
                            key={`${subCol.id}-bottom`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderBottom,
                              subIndex === 0 && classes.operationBorder
                            )}
                            style={{ minWidth: 60 }}
                          >
                            {subCol.label}
                          </TableCell>
                        ))}
                        {/* Подзаголовки для операций (небиржевые) - нижний уровень */}
                        {transformedData.nonExchangeColumn?.operationColumns?.map((opCol) =>
                          opCol.subColumns.map((subCol, subIndex) => (
                            <TableCell
                              key={`${subCol.id}-bottom`}
                              className={classNames(
                                classes.headCell,
                                classes.stickyHeader,
                                classes.doubleHeaderBottom,
                                subIndex === 0 && classes.operationBorder
                              )}
                              style={{ minWidth: 60 }}
                            >
                              {subCol.label}
                            </TableCell>
                          ))
                        )}
                        {/* Подзаголовки для "Другие" - нижний уровень */}
                        {transformedData.nonExchangeColumn?.othersColumn?.subColumns.map((subCol, subIndex) => (
                          <TableCell
                            key={`${subCol.id}-bottom`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderBottom,
                              subIndex === 0 && classes.operationBorder
                            )}
                            style={{ minWidth: 60 }}
                          >
                            {subCol.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!rowsWithOther.length && !isLoading && (
                        <TableRow>
                          <TableCell
                            colSpan={
                              1 +
                              (transformedData.baseColumns?.length || 0) +
                              (transformedData.exchangeColumn?.subColumns.length || 0) +
                              (transformedData.nonExchangeColumn?.operationColumns?.reduce(
                                (sum, op) => sum + op.subColumns.length,
                                0
                              ) || 0) +
                              (transformedData.nonExchangeColumn?.othersColumn?.subColumns.length || 0)
                            }
                            className={classes.bodyCell}
                            style={{ textAlign: "center" }}
                          >
                            Данные не найдены. Выберите параметры и нажмите
                            &nbsp;<strong>Обновить</strong>.
                          </TableCell>
                        </TableRow>
                      )}
                      {rowsWithOther.map((row, rowIndex) => (
                        <TableRow
                          key={`row-${rowIndex}`}
                          className={rowIndex % 2 === 0 ? classes.zebraRow : undefined}
                        >
                          <TableCell
                            className={classes.bodyCell}
                          >
                            {rowIndex + 1}
                          </TableCell>
                          {/* Базовые колонки */}
                          {displayColumns
                            .filter((col) => col.isBase)
                            .map((column, index, array) => (
                              <TableCell
                                key={column.id}
                                className={classNames(
                                  classes.bodyCell,
                                  index === array.length - 1 && classes.baseColumnsBorder
                                )}
                              >
                                {formatCellValue(row[column.id])}
                              </TableCell>
                            ))}
                          {/* Колонка биржевых данных */}
                          {transformedData.exchangeColumn?.subColumns.map((subCol, subIndex) => (
                            <TableCell
                              key={subCol.id}
                              className={classNames(
                                classes.bodyCell,
                                subIndex === 0 && classes.operationBorder
                              )}
                            >
                              {formatCellValue(row[subCol.id])}
                            </TableCell>
                          ))}
                          {/* Колонки операций (небиржевые) */}
                          {transformedData.nonExchangeColumn?.operationColumns?.map((opCol) =>
                            opCol.subColumns.map((subCol, subIndex) => (
                              <TableCell
                                key={subCol.id}
                                className={classNames(
                                  classes.bodyCell,
                                  subIndex === 0 && classes.operationBorder
                                )}
                              >
                                {formatCellValue(row[subCol.id])}
                              </TableCell>
                            ))
                          )}
                          {/* Колонка "Другие" */}
                          {transformedData.nonExchangeColumn?.othersColumn?.subColumns.map((subCol, subIndex) => (
                            <TableCell
                              key={subCol.id}
                              className={classNames(
                                classes.bodyCell,
                                subIndex === 0 && classes.operationBorder
                              )}
                            >
                              {formatCellValue(row[subCol.id])}
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
                    {"Не удалось загрузить отчёт. Попробуйте снова."}
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
                                <th rowSpan={3}>№</th>
                                {/* Базовые колонки */}
                                {chunk
                                  .filter((col) => col.isBase)
                                  .map((column, index, array) => (
                                    <th
                                      key={column.id}
                                      rowSpan={3}
                                      className={
                                        index === array.length - 1
                                          ? classes.printBaseColumnsBorder
                                          : ""
                                      }
                                    >
                                      {column.primaryLabel || column.label}
                                    </th>
                                  ))}
                                {/* Биржевые данные */}
                                {(() => {
                                  const exchangeCols = chunk.filter((col) => col.isExchange);
                                  if (exchangeCols.length > 0) {
                                    return (
                                      <th
                                        colSpan={exchangeCols.length}
                                        rowSpan={2}
                                        className={classes.printOperationBorder}
                                      >
                                        {transformedData.exchangeColumn?.label || "Биржевые"}
                                      </th>
                                    );
                                  }
                                  return null;
                                })()}
                                {/* Небиржевые данные - верхний уровень */}
                                {(() => {
                                  const nonExchangeCols = chunk.filter((col) => col.isNonExchange);
                                  if (nonExchangeCols.length > 0) {
                                    return (
                                      <th
                                        colSpan={nonExchangeCols.length}
                                        rowSpan={1}
                                        className={classes.printOperationBorder}
                                      >
                                        {transformedData.nonExchangeColumn?.label || "Небиржевые"}
                                      </th>
                                    );
                                  }
                                  return null;
                                })()}
                              </tr>
                              <tr>
                                {/* Типы операций внутри небиржевых - средний уровень */}
                                {(() => {
                                  const operationGroups = {};
                                  chunk
                                    .filter((col) => col.isOperation && col.isNonExchange)
                                    .forEach((col) => {
                                      const opName = col.operationName;
                                      if (!operationGroups[opName]) {
                                        operationGroups[opName] = [];
                                      }
                                      operationGroups[opName].push(col);
                                    });

                                  return Object.entries(operationGroups).map(
                                    ([opName, opColumns]) => (
                                      <th
                                        key={opName}
                                        colSpan={opColumns.length}
                                        className={classes.printOperationBorder}
                                      >
                                        {opName}
                                      </th>
                                    )
                                  );
                                })()}
                                {/* "Другие" внутри небиржевых - средний уровень */}
                                {(() => {
                                  const othersCols = chunk.filter((col) => col.isOthers && col.isNonExchange);
                                  if (othersCols.length > 0) {
                                    return (
                                      <th
                                        colSpan={othersCols.length}
                                        className={classes.printOperationBorder}
                                      >
                                        {transformedData.nonExchangeColumn?.othersColumn?.label || "Другие"}
                                      </th>
                                    );
                                  }
                                  return null;
                                })()}
                              </tr>
                              <tr>
                                {/* Подзаголовки биржевых данных */}
                                {chunk
                                  .filter((col) => col.isExchange)
                                  .map((column, index) => {
                                    const subIndex = transformedData.exchangeColumn?.subColumns.findIndex(
                                      (sub) => sub.id === column.id
                                    );
                                    return (
                                      <th
                                        key={column.id}
                                        className={
                                          subIndex === 0 ? classes.printOperationBorder : ""
                                        }
                                      >
                                        {column.secondaryLabel || column.label}
                                      </th>
                                    );
                                  })}
                                {/* Подзаголовки операций (небиржевые) */}
                                {(() => {
                                  const operationCols = chunk.filter((col) => col.isOperation && col.isNonExchange);
                                  const processedOps = new Set();
                                  return operationCols.map((column) => {
                                    const opName = column.operationName;
                                    const opCol = transformedData.nonExchangeColumn?.operationColumns?.find(
                                      (op) => op.label === opName
                                    );
                                    const subIndex = opCol?.subColumns.findIndex(
                                      (sub) => sub.id === column.id
                                    );
                                    const isFirstInOp = subIndex === 0;
                                    if (isFirstInOp) processedOps.add(opName);

                                    return (
                                      <th
                                        key={column.id}
                                        className={
                                          isFirstInOp ? classes.printOperationBorder : ""
                                        }
                                      >
                                        {column.secondaryLabel || column.label}
                                      </th>
                                    );
                                  });
                                })()}
                                {/* Подзаголовки "Другие" */}
                                {chunk
                                  .filter((col) => col.isOthers && col.isNonExchange)
                                  .map((column, index) => {
                                    const subIndex = transformedData.nonExchangeColumn?.othersColumn?.subColumns.findIndex(
                                      (sub) => sub.id === column.id
                                    );
                                    return (
                                      <th
                                        key={column.id}
                                        className={
                                          subIndex === 0 ? classes.printOperationBorder : ""
                                        }
                                      >
                                        {column.secondaryLabel || column.label}
                                      </th>
                                    );
                                  })}
                              </tr>
                            </thead>
                            <tbody>
                              {rowChunk.map((row, rowIndex) => (
                                <tr key={`print-row-${rowChunkIndex}-${rowIndex}`}>
                                  <td>{rowStart + rowIndex}</td>
                                  {/* Базовые колонки */}
                                  {chunk
                                    .filter((col) => col.isBase)
                                    .map((column, index, array) => (
                                      <td
                                        key={column.id}
                                        className={
                                          index === array.length - 1
                                            ? classes.printBaseColumnsBorder
                                            : ""
                                        }
                                      >
                                        {formatCellValue(row[column.id])}
                                      </td>
                                    ))}
                                  {/* Колонка биржевых данных */}
                                  {chunk
                                    .filter((col) => col.isExchange)
                                    .map((column, index) => {
                                      const subIndex = transformedData.exchangeColumn?.subColumns.findIndex(
                                        (sub) => sub.id === column.id
                                      );
                                      return (
                                        <td
                                          key={column.id}
                                          className={
                                            subIndex === 0
                                              ? classes.printOperationBorder
                                              : ""
                                          }
                                        >
                                          {formatCellValue(row[column.id])}
                                        </td>
                                      );
                                    })}
                                  {/* Колонки операций (небиржевые) */}
                                  {chunk
                                    .filter((col) => col.isOperation && col.isNonExchange)
                                    .map((column) => {
                                      const opCol = transformedData.nonExchangeColumn?.operationColumns?.find(
                                        (op) => op.label === column.operationName
                                      );
                                      const subIndex = opCol?.subColumns.findIndex(
                                        (sub) => sub.id === column.id
                                      );
                                      return (
                                        <td
                                          key={column.id}
                                          className={
                                            subIndex === 0
                                              ? classes.printOperationBorder
                                              : ""
                                          }
                                        >
                                          {formatCellValue(row[column.id])}
                                        </td>
                                      );
                                    })}
                                  {/* Колонка "Другие" */}
                                  {chunk
                                    .filter((col) => col.isOthers && col.isNonExchange)
                                    .map((column, index) => {
                                      const subIndex = transformedData.nonExchangeColumn?.othersColumn?.subColumns.findIndex(
                                        (sub) => sub.id === column.id
                                      );
                                      return (
                                        <td
                                          key={column.id}
                                          className={
                                            subIndex === 0
                                              ? classes.printOperationBorder
                                              : ""
                                          }
                                        >
                                          {formatCellValue(row[column.id])}
                                        </td>
                                      );
                                    })}
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

