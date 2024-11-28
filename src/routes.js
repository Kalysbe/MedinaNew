import Buttons from "views/Components/Buttons.js";
import Calendar from "views/Calendar/Calendar.js";
import Charts from "views/Charts/Charts.js";
import Dashboard from "views/Dashboard/Dashboard.js";
import ErrorPage from "views/Pages/ErrorPage.js";
import ExtendedForms from "views/Forms/ExtendedForms.js";
import ExtendedTables from "views/Tables/ExtendedTables.js";
import FullScreenMap from "views/Maps/FullScreenMap.js";
import GoogleMaps from "views/Maps/GoogleMaps.js";
import GridSystem from "views/Components/GridSystem.js";
import Icons from "views/Components/Icons.js";
import LockScreenPage from "views/Pages/LockScreenPage.js";
import LoginPage from "views/Pages/LoginPage.js";
import Notifications from "views/Components/Notifications.js";
import Panels from "views/Components/Panels.js";
import PricingPage from "views/Pages/PricingPage.js";
import RTLSupport from "views/Pages/RTLSupport.js";
import ReactTables from "views/Tables/ReactTables.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import RegularForms from "views/Forms/RegularForms.js";
import RegularTables from "views/Tables/RegularTables.js";
import SweetAlert from "views/Components/SweetAlert.js";
import TimelinePage from "views/Pages/Timeline.js";
import Typography from "views/Components/Typography.js";
import UserProfile from "views/Pages/UserProfile.js";
import ValidationForms from "views/Forms/ValidationForms.js";
import VectorMap from "views/Maps/VectorMap.js";
import Widgets from "views/Widgets/Widgets.js";
import Wizard from "views/Forms/Wizard.js";

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";
//
import EmitentList from "views/Pages/EmitentList.js";
import EditEmitent from "views/Pages/EditEmitent.js"

//Start Reference
import ReferenceList from "views/Pages/Reference/ReferenceList.js"
import DistrictList from "views/Pages/Reference/DistrictList"
import HolderTypeList from "views/Pages/Reference/HolderTypeList"
//Emitent
import EmitentDetail from "views/Pages/Emitent/Detail/index.js"
import EmitentStocks from "views/Pages/Emitent/Stocks/index.js"
import EmitentStockEdit from "views/Pages/Emitent/Stocks/edit.js"


import Transactions from "views/Pages/Log/Transactions/index"
import TransactionDetail from "views/Pages/Log/Transactions/detail.js"

import IncomingDocuments from "views/Pages/Log/IncomingDocuments/List.js"
import IncomingDocumentDetail from "views/Pages/Log/IncomingDocuments/IncomingDocumentDetail.js"
import IncomingDocumentEdit from "views/Pages/Log/IncomingDocuments/edit.js"

import Journal from "views/Pages/Log/Journal/List.js"
import JournalDetail from "views/Pages/Log/Journal/Detail"


import Holders from "views/Pages/Holders.js"
import HolderDetail from "views/Pages/Holders/detail.js"
import EmitentHolders from "views/Pages/EmitentHolders.js"
import EditHolder from "views/Pages/EditHolder.js"
import OperationTransfer from "views/Pages/Operation/transfer/index.js"
import OperationSingle from "views/Pages/Operation/single/index.js"

import Dividends from "views/Pages/Dividend/List.js"
import CalculationDividend from "views/Pages/Dividend/Calculation.js"
import DividendDetail from "views/Pages/Dividend/DividendDetail.js"
import DividendTransactions from "views/Pages/Dividend/DividendTransactions.js"

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
        // mini: "B",
        rtlMini: "ب",
        component: Transactions,
        layout: "/admin",
        dashboard: true
      },
      {
        path: "/incoming-documents",
        name: "Входящие документы",
        rtlName: "وصفت",
        // mini: "BД",
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
        // mini: "ЖИ",
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
