import React from "react";
// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";
// lazy views
const Buttons = React.lazy(() => import("views/Components/Buttons.js"));
const Calendar = React.lazy(() => import("views/Calendar/Calendar.js"));
const Charts = React.lazy(() => import("views/Charts/Charts.js"));
const Dashboard = React.lazy(() => import("views/Dashboard/Dashboard.js"));
const ErrorPage = React.lazy(() => import("views/Pages/ErrorPage.js"));
const ExtendedForms = React.lazy(() => import("views/Forms/ExtendedForms.js"));
const ExtendedTables = React.lazy(() => import("views/Tables/ExtendedTables.js"));
const FullScreenMap = React.lazy(() => import("views/Maps/FullScreenMap.js"));
const GoogleMaps = React.lazy(() => import("views/Maps/GoogleMaps.js"));
const GridSystem = React.lazy(() => import("views/Components/GridSystem.js"));
const Icons = React.lazy(() => import("views/Components/Icons.js"));
const LockScreenPage = React.lazy(() => import("views/Pages/LockScreenPage.js"));
const LoginPage = React.lazy(() => import("views/Pages/LoginPage.js"));
const Notifications = React.lazy(() => import("views/Components/Notifications.js"));
const Panels = React.lazy(() => import("views/Components/Panels.js"));
const PricingPage = React.lazy(() => import("views/Pages/PricingPage.js"));
const RTLSupport = React.lazy(() => import("views/Pages/RTLSupport.js"));
const ReactTables = React.lazy(() => import("views/Tables/ReactTables.js"));
const RegisterPage = React.lazy(() => import("views/Pages/RegisterPage.js"));
const RegularForms = React.lazy(() => import("views/Forms/RegularForms.js"));
const RegularTables = React.lazy(() => import("views/Tables/RegularTables.js"));
const SweetAlert = React.lazy(() => import("views/Components/SweetAlert.js"));
const TimelinePage = React.lazy(() => import("views/Pages/Timeline.js"));
const Typography = React.lazy(() => import("views/Components/Typography.js"));
const UserProfile = React.lazy(() => import("views/Pages/UserProfile.js"));
const ValidationForms = React.lazy(() => import("views/Forms/ValidationForms.js"));
const VectorMap = React.lazy(() => import("views/Maps/VectorMap.js"));
const Widgets = React.lazy(() => import("views/Widgets/Widgets.js"));
const Wizard = React.lazy(() => import("views/Forms/Wizard.js"));
const EmitentList = React.lazy(() => import("views/Pages/EmitentList.js"));
const EditEmitent = React.lazy(() => import("views/Pages/EditEmitent.js"));

//Start Reference
const ReferenceList = React.lazy(() => import("views/Pages/Reference/ReferenceList.js"));
const DistrictList = React.lazy(() => import("views/Pages/Reference/DistrictList"));
const HolderTypeList = React.lazy(() => import("views/Pages/Reference/HolderTypeList"));
const HolderStatusList = React.lazy(() => import("views/Pages/Reference/HolderStatusList"));
const EmissionTypesList = React.lazy(() => import("views/Pages/Reference/EmissionTypesList"));
//Emitent
const EmitentDetail = React.lazy(() => import("views/Pages/Emitent/Detail/index.js"));
const EmitentStocks = React.lazy(() => import("views/Pages/Emitent/Stocks/index.js"));
const EmitentStockEdit = React.lazy(() => import("views/Pages/Emitent/Stocks/edit.js"));
const CancellationStocks = React.lazy(() => import("views/Pages/Emitent/Stocks/cancellation.js"));


const Transactions = React.lazy(() => import("views/Pages/Log/Transactions/index"));
const TransactionDetail = React.lazy(() => import("views/Pages/Log/Transactions/detail.js"));

const IncomingDocuments = React.lazy(() => import("views/Pages/Log/IncomingDocuments/List.js"));
const IncomingDocumentDetail = React.lazy(() => import("views/Pages/Log/IncomingDocuments/IncomingDocumentDetail.js"));
const IncomingDocumentEdit = React.lazy(() => import("views/Pages/Log/IncomingDocuments/edit.js"));

const Journal = React.lazy(() => import("views/Pages/Log/Journal/List.js"));
const JournalDetail = React.lazy(() => import("views/Pages/Log/Journal/Detail"));


const Holders = React.lazy(() => import("views/Pages/Holders.js"));
const HolderDetail = React.lazy(() => import("views/Pages/Holders/detail.js"));
const EmitentHolders = React.lazy(() => import("views/Pages/EmitentHolders.js"));
const EditHolder = React.lazy(() => import("views/Pages/EditHolder.js"));
const OperationTransfer = React.lazy(() => import("views/Pages/Operation/transfer/index.js"));
const OperationSingle = React.lazy(() => import("views/Pages/Operation/single/index.js"));

const Dividends = React.lazy(() => import("views/Pages/Dividend/List.js"));
const CalculationDividend = React.lazy(() => import("views/Pages/Dividend/Calculation.js"));
const DividendDetail = React.lazy(() => import("views/Pages/Dividend/DividendDetail.js"));
const DividendTransactions = React.lazy(() => import("views/Pages/Dividend/DividendTransactions.js"));

const QuarterlyReport = React.lazy(() => import("views/Pages/Quarterly/Quarterly.js"));

var dashRoutes = [

  {

    path: "/dashboard",
    name: "Главная",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
    dashboard: true
  },
  {
    path: "/emitent-list",
    name: "Список эмитентов",
    icon: DashboardIcon,
    component: EmitentList,
    layout: "/admin"
  },
  {
    path: "/emitent/add",
    name: "Новый эмитент",
    component: EditEmitent,
    layout: "/admin"
  },
  {
    path: "/emitent/edit/:id",
    name: "Корректировка эмитента",
    component: EditEmitent,
    layout: "/admin"
  },
  //Start Reference
  {
    path: "/reference-list",
    name: "Справочник",
    icon: DashboardIcon,
    component: ReferenceList,
    layout: "/admin"
  },
  {
    path: "/district-list",
    name: "Список регионов",
    icon: DashboardIcon,
    component: DistrictList,
    layout: "/admin"
  },
  {
    path: "/holder-types-list",
    name: "Категории акционеров",
    icon: DashboardIcon,
    component: HolderTypeList,
    layout: "/admin"
  },
  {
    path: "/emission-types-list",
    name: "Типы эмиссий",
    icon: DashboardIcon,
    component: EmissionTypesList,
    layout: "/admin"
  },
  {
    path: "/holder-status-list",
    name: "Отношения к акциям",
    icon: DashboardIcon,
    component: HolderStatusList,
    layout: "/admin"
  },
  //End Reference
  {
    path: "/holder/add",
    name: "Новый акционер",
    component: EditHolder,
    layout: "/admin"
  },
  {
    path: "/holder/:id/edit",
    name: "Редактирование акционера",
    component: EditHolder,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Эмитент",
    rtlName: "صفحات",
    icon: Image,
    state: "pageCollapse",
    views: [
      {
        path: "/emitent-detail/",
        name: "Анкетные данные",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: EmitentDetail,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/emitent-stocks/",
        name: "Ценные бумаги",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: EmitentStocks,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/emitent-stock/add/",
        name: "Новая бумага",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: EmitentStockEdit,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/emitent-stock/сancellation/",
        name: "Аннулирование бумаги",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: CancellationStocks,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/rtl-support-page",
        name: "Ценные бумаги",
        rtlName: "صودعم رتل",
        mini: "RS",
        rtlMini: "صو",
        component: RTLSupport,
        layout: "/admin"
      },
      {
        path: "/statistics",
        name: "Статистика",
        rtlName: "تيالجدول الزمني",
        mini: "T",
        rtlMini: "تي",
        component: TimelinePage,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/login-page",
        name: "Login Page",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: LoginPage,
        layout: "/auth"
      },
      {
        path: "/register-page",
        name: "Register Page",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: RegisterPage,
        layout: "/auth"
      },
      {
        path: "/lock-screen-page",
        name: "Lock Screen Page",
        rtlName: "اقفل الشاشة",
        mini: "LS",
        rtlMini: "هذاع",
        component: LockScreenPage,
        layout: "/auth"
      },
      {
        path: "/user-page",
        name: "User Profile",
        rtlName: "ملف تعريفي للمستخدم",
        mini: "UP",
        rtlMini: "شع",
        component: UserProfile,
        layout: "/admin"
      },
      {
        path: "/error-page",
        name: "Error Page",
        rtlName: "صفحة الخطأ",
        mini: "E",
        rtlMini: "البريد",
        component: ErrorPage,
        layout: "/auth"
      }
    ]
  },
  {
    collapse: true,
    name: "Журналы",
    rtlName: "المكونات",
    icon: Apps,
    state: "componentsCollapse",
    views: [
      // {
      //   collapse: true,
      //   name: "Multi Level Collapse",
      //   rtlName: "انهيار متعدد المستويات",
      //   mini: "MC",
      //   rtlMini: "ر",
      //   state: "multiCollapse",
      //   views: [
      //     {
      //       path: "/buttons",
      //       name: "Buttons",
      //       rtlName: "وصفت",
      //       mini: "B",
      //       rtlMini: "ب",
      //       component: Buttons,
      //       layout: "/admin"
      //     }
      //   ]
      // },
      {
        path: "/transactions",
        name: "Операции с акциями",
        rtlName: "وصفت",
        mini: "B",
        rtlMini: "ب",
        component: Transactions,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/incoming-documents",
        name: "Входящие документы",
        rtlName: "وصفت",
        mini: "BД",
        rtlMini: "ب",
        component: IncomingDocuments,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/incoming-document-detail/:id",
        name: "Детали входящего документа",
        rtlName: "وصفت",
        mini: "B",
        rtlMini: "ب",
        component: IncomingDocumentDetail,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/incoming-document/add",
        name: "Новый входящий документ",
        rtlName: "وصفت",
        mini: "B",
        rtlMini: "ب",
        component: IncomingDocumentEdit,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/incoming-document/edit/:id",
        name: "Корректировка входящего документа",
        rtlName: "وصفت",
        mini: "B",
        rtlMini: "ب",
        component: IncomingDocumentEdit,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/journals",
        name: "Журнал изменений реестра",
        rtlName: "وصفت",
        mini: "ЖИ",
        rtlMini: "ب",
        component: Journal,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/journal/:id",
        name: "Детали изменений реестра",
        rtlName: "وصفت",
        mini: "B",
        rtlMini: "ب",
        component: JournalDetail,
        layout: "/admin",
        dashboard: false
      },


      {
        path: "/grid-system",
        name: "Grid System",
        rtlName: "نظام الشبكة",
        mini: "GS",
        rtlMini: "زو",
        component: GridSystem,
        layout: "/admin"
      },
      {
        path: "/panels",
        name: "Panels",
        rtlName: "لوحات",
        mini: "P",
        rtlMini: "ع",
        component: Panels,
        layout: "/admin"
      },
      {
        path: "/sweet-alert",
        name: "Sweet Alert",
        rtlName: "الحلو تنبيه",
        mini: "SA",
        rtlMini: "ومن",
        component: SweetAlert,
        layout: "/admin"
      },
      {
        path: "/notifications",
        name: "Notifications",
        rtlName: "إخطارات",
        mini: "N",
        rtlMini: "ن",
        component: Notifications,
        layout: "/admin"
      },
      {
        path: "/icons",
        name: "Icons",
        rtlName: "الرموز",
        mini: "I",
        rtlMini: "و",
        component: Icons,
        layout: "/admin"
      },
      {
        path: "/typography",
        name: "Typography",
        rtlName: "طباعة",
        mini: "T",
        rtlMini: "ر",
        component: Typography,
        layout: "/admin"
      }
    ]
  },
  {
    path: "/holders",
    name: "Реестр",
    rtlName: "الحاجيات",
    icon: WidgetsIcon,
    component: Holders,
    layout: "/admin",
    dashboard: true
  },
  {
    collapse: true,
    name: "Операции",
    rtlName: "إستمارات",
    icon: "content_paste",
    state: "formsCollapse",
    views: [
      {
        path: "/operation-transfer",
        name: "Передача",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: OperationTransfer,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/regular-forms",
        name: "Залог",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: RegularForms,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/extended-forms",
        name: "Высвобождение из залога",
        rtlName: "نماذج موسعة",
        mini: "EF",
        rtlMini: "هوو",
        component: ExtendedForms,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/validation-forms",
        name: "Конвертация",
        rtlName: "نماذج التحقق من الصحة",
        mini: "VF",
        rtlMini: "تو",
        component: ValidationForms,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/operation-single",
        name: "Одноместная операция",
        rtlName: "ساحر",
        mini: "W",
        rtlMini: "ث",
        component: OperationSingle,
        layout: "/admin",
        dashboard: true
      }
    ]
  },
  {
    collapse: true,
    name: "Дивиденды ",
    rtlName: "إستمارات",
    icon: "money",
    state: "dividends",
    views: [
      {
        path: "/dividends",
        name: "Расчет",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: Dividends,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/dividend/:id",
        name: "Детали дивиденда",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: DividendDetail,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/dividend-transactions/:id",
        name: "Детали дивиденда",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: DividendTransactions,
        layout: "/admin",
        dashboard: false
      },
      {
        path: "/calculation-dividend",
        name: "Дивиденды",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: CalculationDividend,
        layout: "/admin",
        dashboard: false
      },

    ]
  },
  {
    collapse: true,
    name: "Отчеты ",
    rtlName: "إستمارات",
    icon: "book",
    state: "reports",
    views: [
      {
        path: "/reports",
        name: "Годовой отчет",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: Dividends,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/quartely-report",
        name: "Ежеквартальный отчет",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: QuarterlyReport,
        layout: "/admin",
        dashboard: true
      },


    ]
  },
  // {
  //   collapse: true,
  //   name: "Tables",
  //   rtlName: "الجداول",
  //   icon: GridOn,
  //   state: "tablesCollapse",
  //   views: [
  //     {
  //       path: "/regular-tables",
  //       name: "Regular Tables",
  //       rtlName: "طاولات عادية",
  //       mini: "RT",
  //       rtlMini: "صر",
  //       component: RegularTables,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/extended-tables",
  //       name: "Extended Tables",
  //       rtlName: "جداول ممتدة",
  //       mini: "ET",
  //       rtlMini: "هور",
  //       component: ExtendedTables,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/react-tables",
  //       name: "React Tables",
  //       rtlName: "رد فعل الطاولة",
  //       mini: "RT",
  //       rtlMini: "در",
  //       component: ReactTables,
  //       layout: "/admin"
  //     }
  //   ]
  // },
  // {
  //   collapse: true,
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: Place,
  //   state: "mapsCollapse",
  //   views: [
  //     {
  //       path: "/google-maps",
  //       name: "Google Maps",
  //       rtlName: "خرائط جوجل",
  //       mini: "GM",
  //       rtlMini: "زم",
  //       component: GoogleMaps,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/full-screen-maps",
  //       name: "Full Screen Map",
  //       rtlName: "خريطة كاملة الشاشة",
  //       mini: "FSM",
  //       rtlMini: "ووم",
  //       component: FullScreenMap,
  //       layout: "/admin"
  //     },
  //     {
  //       path: "/vector-maps",
  //       name: "Vector Map",
  //       rtlName: "خريطة المتجه",
  //       mini: "VM",
  //       rtlMini: "تم",
  //       component: VectorMap,
  //       layout: "/admin"
  //     }
  //   ]
  // },
  {
    path: "/widgets",
    name: "Widgets",
    rtlName: "الحاجيات",
    icon: WidgetsIcon,
    component: Widgets,
    layout: "/admin"
  },
  {
    path: "/charts",
    name: "Charts",
    rtlName: "الرسوم البيانية",
    icon: Timeline,
    component: Charts,
    layout: "/admin"
  },
  {
    path: "/calendar",
    name: "Calendar",
    rtlName: "التقويم",
    icon: DateRange,
    component: Calendar,
    layout: "/admin",
    dashboard: false
  },
  {
    path: "/widgets",
    name: "widgets",
    rtlName: "الحاجيات",
    icon: WidgetsIcon,
    component: Widgets,
    layout: "/admin",
    dashboard: false
  },
  {
    path: "/all-holders",
    name: "Акционеры",
    rtlName: "الحاجيات",
    icon: WidgetsIcon,
    component: EmitentHolders,
    layout: "/admin",
    dashboard: false
  },

  {
    path: "/holder/:id",
    name: "Лицевой счет",
    rtlName: "وصفت",
    mini: "B",
    rtlMini: "ب",
    component: HolderDetail,
    layout: "/admin",
    dashboard: false
  },

  {
    path: "/transaction/:id",
    name: "Детали транзакции",
    rtlName: "وصفت",
    mini: "B",
    rtlMini: "ب",
    component: TransactionDetail,
    layout: "/admin",
    dashboard: false
  },
];
export default dashRoutes;
