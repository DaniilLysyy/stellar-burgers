import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

import {
  useDispatch,
  useSelector
} from '../../services/store';

import {
  selectIngredients
} from '../../services/ingredientsSlice';

import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectFeedOrders
} from '../../services/feedSlice';

import {
  selectProfileOrders
} from '../../services/profileOrdersSlice';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngredients);

  const orderNumber = Number(number);

  const orderData =
    orders.find((order) => order.number === orderNumber) ??
    profileOrders.find((order) => order.number === orderNumber) ??
    (currentOrder?.number === orderNumber
      ? currentOrder
      : undefined);

  useEffect(() => {
    if (!orderData && Number.isFinite(orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<
      string,
      TIngredient & { count: number }
    >;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing) => ing._id === item
          );

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};