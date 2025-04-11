import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { fetchAuthMe } from 'redux/slices/auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        // Только один запрос для проверки авторизации
        const res = await dispatch(fetchAuthMe());
        console.log(res,'tes res')
        if (res.payload && res.payload.user.id) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };

    checkToken();
  }, [dispatch]);

  // Пока идет проверка авторизации
  console.log(isAuth,'isAuth')
  if (isAuth === null) return <div>Проверка авторизации...</div>;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/auth/login-page" />
      }
    />
  );
};

export default PrivateRoute;
