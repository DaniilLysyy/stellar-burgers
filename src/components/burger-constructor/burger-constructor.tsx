import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { TConstructorIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';

import {
  clearConstructor,
  selectConstructorItems
} from '../../services/constructorSlice';

import {
  clearOrderModalData,
  createOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/orderSlice';

import { selectUser } from '../../services/userSlice';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems);
  const user = useSelector(selectUser);

  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', {
        state: { from: location }
      });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingredient) => ingredient._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds)).then((result) => {
    if (createOrder.fulfilled.match(result)) {
     dispatch(clearConstructor());
  }
});
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun
        ? constructorItems.bun.price * 2
        : 0) +
      constructorItems.ingredients.reduce(
        (
          sum: number,
          ingredient: TConstructorIngredient
        ) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};