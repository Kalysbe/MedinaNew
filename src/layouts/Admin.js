import React, { useEffect, useState, Suspense } from "react";
import cx from "classnames";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Danger from "components/Typography/Danger.js";
import routes from "routes.js";
import { NavLink } from "react-router-dom";

import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";
import { useDispatch, useSelector } from 'react-redux';
import { loadEmitentFromLocalStorage } from "../redux/actions/emitents";
var ps;

const useStyles = makeStyles(styles);



export default function Dashboard(props) {
  const { ...rest } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
  const [image, setImage] = React.useState(require("assets/img/sidebar-2.jpg"));
  const [color, setColor] = React.useState("blue");
  const [bgColor, setBgColor] = React.useState("black");
  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo-white.svg"));
  const [savedEmitent, setSavedEmitent] = useState(null);
  // const dispath = useDispatch()
  const token = window.localStorage.getItem('token');
  const isAuth = Boolean(token);
  
  const EmitentData = useSelector(state => state.emitents.store);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/auth/login-page');
    }
  }, []);
  

console.log(isAuth,'auth')
  // styles
  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1
    });
  // ref for main panel div
  const mainPanel = React.createRef();
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  });
  // functions for changeing the states from components
  const handleImageClick = image => {
    setImage(image);
  };
  const handleColorClick = color => {
    setColor(color);
  };
  const handleBgColorClick = bgColor => {
    switch (bgColor) {
      case "white":
        setLogo(require("assets/img/logo.svg"));
        break;
      default:
        setLogo(require("assets/img/logo-white.svg"));
        break;
    }
    setBgColor(bgColor);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = routes => {
    let activeRoute = "Default Brand Text1";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  const getActivepath = routes => {
    let activeRoute = "Default Brand Text2";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].path;
        }
      }
    }
    return activeRoute;
  };

  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    dispatch(loadEmitentFromLocalStorage())
  }, []);

  if (!isAuth) {
    // history.push(`/auth/login-page`);
  }

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Medina"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        emitentName={EmitentData?.name}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              {!EmitentData && !EmitentData?.id && getActivepath(routes) !== '/emitent-list' && getActivepath(routes) !== '/dashboard' && getActivepath(routes) !== '/emitent/add' ? (
                <Card >
                  <CardBody style={{ display: 'flex', justifyContent: "center" }}>
                    <div style={{ display: 'flex', justifyContent: "center", flexDirection: 'column' }}>
                      <Danger>
                        <h3 style={{ textAlign: 'center' }}>
                          Вы не выбрали эмитента! 
                        </h3>
                      </Danger>
                      <p style={{ textAlign: 'center' }}>
                        Чтобы продолжить работу необходимо выбрать эмитента.
                      </p>
                      <div style={{ display: 'flex', justifyContent: "center", flexDirection: 'column' }}>
                        <NavLink to={'/admin/emitent-list'}>
                          <Button fullWidth round color="rose">
                            Выбрать
                          </Button>
                        </NavLink>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Suspense fallback={<div>Загрузка...</div>}>
                  <Switch>
                    {getRoutes(routes)}
                    {/* <Redirect from="/admin" to="/admin/dashboard" /> */}
                  </Switch>
                </Suspense>
              )}
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            <Suspense fallback={<div>Загрузка карты...</div>}>
              <Switch>
                {getRoutes(routes)}
                {/* <Redirect from="/admin" to="/admin/dashboard" /> */}
              </Switch>
            </Suspense>
          </div>
        )}
        {/* {getRoute() ? <Footer fluid /> : null} */}
        {/* <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          handleBgColorClick={handleBgColorClick}
          color={color}
          bgColor={bgColor}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
        /> */}
      </div>
    </div>
  );
}
