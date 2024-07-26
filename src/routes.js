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
//Emitent
import EmitentDetail from "views/Pages/Emitent/Detail/index.js"
import EmitentStocks from "views/Pages/Emitent/Stocks/index.js"
import EmitentStockEdit from "views/Pages/Emitent/Stocks/edit.js"


import Transactions from "views/Pages/Log/Transactions/index"
import TransactionDetail from "views/Pages/Log/Transactions/detail.js"
import Holders from "views/Pages/Holders.js"
import EmitentHolders from "views/Pages/EmitentHolders.js"
import EditHolder from "views/Pages/EditHolder.js"
import OperationTransfer from "views/Pages/Operation/transfer/index.js"
import OperationSingle from "views/Pages/Operation/single/index.js"
var dashRoutes = [

  {

    path: "/dashboard",
    name: "Главная",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
    dashboard:true
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
    path: "/holder/add",
    name: "Новый акционер",
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
        dashboard:true
      },
      {
        path: "/emitent-stocks/",
        name: "Ценные бумаги",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: EmitentStocks,
        layout: "/admin",
        dashboard:true
      },
      {
        path: "/emitent-stock/add/",
        name: "Новая бумага",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: EmitentStockEdit,
        layout: "/admin",
        dashboard:false
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
        path: "/timeline-page",
        name: "Timeline Page",
        rtlName: "تيالجدول الزمني",
        mini: "T",
        rtlMini: "تي",
        component: TimelinePage,
        layout: "/admin"
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
        dashboard:true
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
    dashboard:true
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
        dashboard:true
      },
      {
        path: "/regular-forms",
        name: "Залог",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: RegularForms,
        layout: "/admin",
        dashboard:false
      },
      {
        path: "/extended-forms",
        name: "Высвобождение из залога",
        rtlName: "نماذج موسعة",
        mini: "EF",
        rtlMini: "هوو",
        component: ExtendedForms,
        layout: "/admin",
        dashboard:false
      },
      {
        path: "/validation-forms",
        name: "Конвертация",
        rtlName: "نماذج التحقق من الصحة",
        mini: "VF",
        rtlMini: "تو",
        component: ValidationForms,
        layout: "/admin",
        dashboard:false
      },
      {
        path: "/operation-single",
        name: "Одноместная операция",
        rtlName: "ساحر",
        mini: "W",
        rtlMini: "ث",
        component: OperationSingle,
        layout: "/admin",
        dashboard:true
      }
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
    dashboard:false
  },
  {
    path: "/widgets",
    name: "widgets",
    rtlName: "الحاجيات",
    icon: WidgetsIcon,
    component: Widgets,
    layout: "/admin",
    dashboard:false
  },
  {
    path: "/all-holders",
    name: "Все акционеры",
    rtlName: "الحاجيات",
    icon: WidgetsIcon,
    component: EmitentHolders,
    layout: "/admin",
    dashboard:true
  },

  {
    path: "/transaction/:id",
    name: "Детали транзакции",
    rtlName: "وصفت",
    mini: "B",
    rtlMini: "ب",
    component: TransactionDetail,
    layout: "/admin",
    dashboard:false
    },
];
export default dashRoutes;
