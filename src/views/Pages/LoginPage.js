import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

import { fetchAuth, fetchAuthMe } from "redux/slices/auth";

const useStyles = makeStyles(styles);

export default function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ login: '', password: '' });
  const { data } = useSelector(state => state.auth);

  
  const [isMounted, setIsMounted] = useState(true);
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();



 console.log(data)
 useEffect(() => {
  dispatch(fetchAuthMe());
}, []);

  useEffect(() => {
    if (data && data.id) {
      console.log('done')
      history.push('/admin/dashboard');
    }
  }, [data, history]);
  

  useEffect(() => {
    return () => {
      setIsMounted(false); // Устанавливаем isMounted в false при размонтировании компонента
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError({ login: '', password: '' }); // Сброс ошибок

    if (!login) {
      setError(prevState => ({ ...prevState, login: 'Введите логин' }));
      return;
    }

    if (!password) {
      setError(prevState => ({ ...prevState, password: 'Введите пароль' }));
      return;
    }

    try {
      console.log(1)
      const data = await dispatch(fetchAuth({ login, password })) // Используйте unwrap() для получения payload
      // const { token } = data.paylaod

      if (data.payload) {
        if ('token' in data.payload) {
          window.localStorage.setItem('token', data.payload.token);
          
        } else {
          setError({ login: 'Неверный логин или пароль', password: 'Неверный логин или пароль' });
        }
      }
      

    } catch (err) {

      setError({ login: 'Неверный логин или пароль', password: 'Неверный логин или пароль' });

    }
  };

  
  
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form onSubmit={handleSubmit}>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Авторизация</h4>
                {/* <div className={classes.socialLine}>
                  {[
                    "fab fa-facebook-square",
                    "fab fa-twitter",
                    "fab fa-google-plus"
                  ].map((prop, key) => {
                    return (
                      <Button
                        color="transparent"
                        justIcon
                        key={key}
                        className={classes.customButtonClass}
                      >
                        <i className={prop} />
                      </Button>
                    );
                  })}
                </div> */}
              </CardHeader>
              <CardBody>
                <CustomInput
                  labelText="Логин..."
                  id="login"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: login,
                    onChange: (e) => setLogin(e.target.value),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email />
                      </InputAdornment>
                    ),
                    // helperText: error.login,
                    error: !!error.login
                  }}
                />
                <CustomInput
                  labelText="Пароль"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    type: "password",
                    autoComplete: "off",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon>lock_outline</Icon>
                      </InputAdornment>
                    ),
                    // helperText: error.password,
                    error: !!error.password
                  }}
                />
              </CardBody>
              <CardFooter>
                <Button color="rose" simple size="lg" block type="submit">
                  Войти
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
