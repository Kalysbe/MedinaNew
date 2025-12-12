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
  const [selectedOperations, setSelectedOperations] = useState(new Set());
  const [operationsSelectorOpen, setOperationsSelectorOpen] = useState(true);

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
      return { rows: [], columns: [], allOperationsList: [] };
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

    // Объединяем все колонки для отображения
    const allColumns = [...baseColumns, ...operationColumns];

    // Создаем строки
    const rows = rawData.map((item) => {
      const row = {
        emitent: item.emitent || "",
        emission: item.emission || "",
        emission_id: item.emission_id || "",
      };

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

      return row;
    });

    return { rows, columns: allColumns, baseColumns, operationColumns, allOperationsList: operationsList };
  }, [rawData]);

  const rows = transformedData.rows;

  // Инициализируем выбранные операции при первом загрузке данных
  useEffect(() => {
    if (transformedData.allOperationsList?.length > 0 && selectedOperations.size === 0) {
      // По умолчанию выбираем все операции
      setSelectedOperations(new Set(transformedData.allOperationsList));
    }
  }, [transformedData.allOperationsList]);

  // Фильтруем операции на основе выбранных и создаем столбец "Другие"
  const filteredTransformedData = useMemo(() => {
    if (!transformedData.operationColumns) {
      return transformedData;
    }

    const selectedOpsSet = selectedOperations.size > 0 ? selectedOperations : new Set(transformedData.allOperationsList || []);
    
    // Фильтруем операции - показываем только выбранные
    const filteredOperationColumns = transformedData.operationColumns.filter((opCol) =>
      selectedOpsSet.has(opCol.label)
    );

    // Находим не выбранные операции
    const unselectedOperations = transformedData.allOperationsList?.filter(
      (opName) => !selectedOpsSet.has(opName)
    ) || [];

    // Добавляем столбец "Другие" если есть не выбранные операции
    let otherColumn = null;
    if (unselectedOperations.length > 0) {
      otherColumn = {
        id: "other",
        label: "Другие",
        isOperation: true,
        isOther: true,
        subColumns: [
          { id: "other_count", label: "сделки", type: "count" },
          { id: "other_quantity", label: "кол-во", type: "quantity" },
          { id: "other_volume", label: "объем", type: "volume" },
        ],
      };
    }

    return {
      ...transformedData,
      operationColumns: otherColumn ? [...filteredOperationColumns, otherColumn] : filteredOperationColumns,
      unselectedOperations,
    };
  }, [transformedData, selectedOperations]);

  // Обновляем строки для добавления значений столбца "Другие"
  const rowsWithOther = useMemo(() => {
    if (!filteredTransformedData.unselectedOperations?.length) {
      return rows;
    }

    const unselectedOps = filteredTransformedData.unselectedOperations;
    
    return rows.map((row) => {
      const newRow = { ...row };
      
      // Суммируем значения не выбранных операций
      let otherCount = 0;
      let otherQuantity = 0;
      let otherVolume = 0;

      unselectedOps.forEach((opName) => {
        otherCount += row[`${opName}_count`] || 0;
        otherQuantity += row[`${opName}_quantity`] || 0;
        otherVolume += row[`${opName}_volume`] || 0;
      });

      newRow.other_count = otherCount;
      newRow.other_quantity = otherQuantity;
      newRow.other_volume = otherVolume;

      return newRow;
    });
  }, [rows, filteredTransformedData.unselectedOperations]);

  // Для новой структуры с операциями создаем плоский список всех колонок для отображения
  const flatColumns = useMemo(() => {
    // Для реальных данных используем новую структуру
    const flat = [];
    
    // Базовые колонки
    if (filteredTransformedData.baseColumns) {
      filteredTransformedData.baseColumns.forEach((col) => {
        flat.push({ ...col, isBase: true });
      });
    }
    
    // Колонки операций с подстолбцами
    if (filteredTransformedData.operationColumns) {
      filteredTransformedData.operationColumns.forEach((opCol) => {
        opCol.subColumns.forEach((subCol) => {
          flat.push({
            id: subCol.id,
            label: subCol.label,
            operationName: opCol.label,
            type: subCol.type,
            isOperation: true,
            isOther: opCol.isOther || false,
          });
        });
      });
    }
    
    return flat;
  }, [filteredTransformedData]);

  const displayColumns = useMemo(() => {
    // Для новой структуры создаем отображение с группировкой
    const result = [];
    
    // Базовые колонки
    if (filteredTransformedData.baseColumns) {
      filteredTransformedData.baseColumns.forEach((col) => {
        result.push({
          ...col,
          primaryLabel: col.label,
          secondaryLabel: col.label,
          isBase: true,
        });
      });
    }
    
    // Колонки операций
    if (filteredTransformedData.operationColumns) {
      filteredTransformedData.operationColumns.forEach((opCol) => {
        opCol.subColumns.forEach((subCol) => {
          result.push({
            id: subCol.id,
            primaryLabel: opCol.label,
            secondaryLabel: subCol.label,
            operationName: opCol.label,
            type: subCol.type,
            isOperation: true,
            isOther: opCol.isOther || false,
          });
        });
      });
    }
    
    return result;
  }, [flatColumns, filteredTransformedData]);

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

  const handleOperationToggle = (operationName) => {
    setSelectedOperations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(operationName)) {
        newSet.delete(operationName);
      } else {
        newSet.add(operationName);
      }
      return newSet;
    });
  };

  const handleSelectAllOperations = () => {
    if (transformedData.allOperationsList) {
      setSelectedOperations(new Set(transformedData.allOperationsList));
    }
  };

  const handleDeselectAllOperations = () => {
    setSelectedOperations(new Set());
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

          {transformedData.allOperationsList?.length > 0 && (
            <Paper className={classes.operationsSelector}>
              <div
                className={classes.operationsSelectorHeader}
                onClick={() => setOperationsSelectorOpen(!operationsSelectorOpen)}
              >
                <Typography className={classes.operationsSelectorTitle}>
                  Выбор операций ({selectedOperations.size || transformedData.allOperationsList.length} / {transformedData.allOperationsList.length})
                </Typography>
                {operationsSelectorOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={operationsSelectorOpen}>
                <Box className={classes.operationsCheckboxGroup}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          transformedData.allOperationsList?.length > 0 &&
                          selectedOperations.size === transformedData.allOperationsList.length
                        }
                        indeterminate={
                          selectedOperations.size > 0 &&
                          transformedData.allOperationsList?.length > 0 &&
                          selectedOperations.size < transformedData.allOperationsList.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleSelectAllOperations();
                          } else {
                            handleDeselectAllOperations();
                          }
                        }}
                        color="primary"
                      />
                    }
                    label="Выбрать все"
                  />
                  {transformedData.allOperationsList.map((opName) => (
                    <FormControlLabel
                      key={opName}
                      control={
                        <Checkbox
                          checked={selectedOperations.has(opName)}
                          onChange={() => handleOperationToggle(opName)}
                          color="primary"
                        />
                      }
                      label={opName}
                      className={classes.operationsCheckbox}
                    />
                  ))}
                </Box>
              </Collapse>
            </Paper>
          )}

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
                @page { size: landscape; margin: 10mm; }
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
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
                            classes.stickyColumn,
                            classes.stickyHeader,
                            classes.doubleHeaderTop
                          )}
                          rowSpan={2}
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
                              rowSpan={2}
                              style={{ minWidth: column.width || 150 }}
                            >
                              {column.primaryLabel}
                            </TableCell>
                          ))}
                        {/* Колонки операций - верхний уровень */}
                        {filteredTransformedData.operationColumns?.map((opCol) => (
                          <TableCell
                            key={`${opCol.id}-top`}
                            className={classNames(
                              classes.headCell,
                              classes.stickyHeader,
                              classes.doubleHeaderTop,
                              classes.operationBorder,
                              opCol.isOther && classes.doubleHeaderTop
                            )}
                            colSpan={3}
                            style={{ minWidth: 200 }}
                          >
                            {opCol.label}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow className={classes.doubleHeaderRow}>
                        {/* Подзаголовки для операций */}
                        {filteredTransformedData.operationColumns?.map((opCol) =>
                          opCol.subColumns.map((subCol, subIndex) => (
                            <TableCell
                              key={`${subCol.id}-bottom`}
                              className={classNames(
                                classes.headCell,
                                classes.stickyHeader,
                                classes.doubleHeaderBottom,
                                subIndex === 0 && classes.operationBorder
                              )}
                              style={{ minWidth: 100 }}
                            >
                              {subCol.label}
                            </TableCell>
                          ))
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!rowsWithOther.length && !isLoading && (
                        <TableRow>
                          <TableCell
                            colSpan={
                              1 +
                              (filteredTransformedData.baseColumns?.length || 0) +
                              (filteredTransformedData.operationColumns?.reduce(
                                (sum, op) => sum + op.subColumns.length,
                                0
                              ) || 0)
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
                            className={classNames(
                              classes.bodyCell,
                              classes.stickyColumn
                            )}
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
                          {/* Колонки операций */}
                          {filteredTransformedData.operationColumns?.map((opCol) =>
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
                                <th rowSpan={2}>№</th>
                                {/* Базовые колонки */}
                                {chunk
                                  .filter((col) => col.isBase)
                                  .map((column, index, array) => (
                                    <th
                                      key={column.id}
                                      rowSpan={2}
                                      className={
                                        index === array.length - 1
                                          ? classes.printBaseColumnsBorder
                                          : ""
                                      }
                                    >
                                      {column.primaryLabel || column.label}
                                    </th>
                                  ))}
                                {/* Группируем операции по названиям */}
                                {filteredTransformedData.operationColumns &&
                                  (() => {
                                    const operationGroups = {};
                                    chunk
                                      .filter((col) => col.isOperation)
                                      .forEach((col) => {
                                        const opName = col.operationName;
                                        if (!operationGroups[opName]) {
                                          operationGroups[opName] = [];
                                        }
                                        operationGroups[opName].push(col);
                                      });

                                    return Object.entries(operationGroups).map(
                                      ([opName, opColumns]) => (
                                        <React.Fragment key={opName}>
                                          <th
                                            colSpan={opColumns.length}
                                            className={classes.printOperationBorder}
                                          >
                                            {opName}
                                          </th>
                                        </React.Fragment>
                                      )
                                    );
                                  })()}
                              </tr>
                              <tr>
                                {/* Подзаголовки операций */}
                                {(() => {
                                  const operationCols = chunk.filter((col) => col.isOperation);
                                  const processedOps = new Set();
                                  return operationCols.map((column) => {
                                    const opName = column.operationName;
                                    const opCol = filteredTransformedData.operationColumns?.find(
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
                                  {/* Колонки операций */}
                                  {chunk
                                    .filter((col) => col.isOperation)
                                    .map((column) => {
                                      const opCol = filteredTransformedData.operationColumns?.find(
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

