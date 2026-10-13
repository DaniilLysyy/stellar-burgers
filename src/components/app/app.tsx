import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo
} from '@components';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import type { Location } from 'react-router-dom';

import { fetchIngredients } from '../../services/ingredientsSlice';
import {
  getUser,
  selectIsAuthChecked,
  selectUser
} from '../../services/userSlice';

import {
  useDispatch,
  useSelector
} from '../../services/store';

import '../../index.css';
import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();

  const locationState = location.state as {
    background?: Location;
  } | null;

  const background = locationState?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />

        <Route path='/feed' element={<Feed />} />

        <Route
          path='/ingredients/:id'
          element={<IngredientDetails />}
        />

        <Route
          path='/feed/:number'
          element={<OrderInfo />}
        />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <ModalRoute title='Детали ингредиента'>
                <IngredientDetails />
              </ModalRoute>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <ModalRoute title='Информация о заказе'>
                <OrderInfo />
              </ModalRoute>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ModalRoute title='Информация о заказе'>
                  <OrderInfo />
                </ModalRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: {
  children: React.JSX.Element;
  onlyUnAuth?: boolean;
}): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <></>;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return (
      <Navigate
        to='/login'
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

const ModalRoute = ({
  title,
  children
}: {
  title: string;
  children: React.JSX.Element;
}): React.JSX.Element => {
  const navigate = useNavigate();

  const handleClose = (): void => {
    navigate(-1);
  };

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};

export default App;