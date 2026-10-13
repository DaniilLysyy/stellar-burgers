import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './ingredientsSlice';
import { feedReducer } from './feedSlice';
import { constructorReducer } from './constructorSlice';
import { userReducer } from './userSlice';
import { profileOrdersReducer } from './profileOrdersSlice';
import { orderReducer } from './orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  profileOrders: profileOrdersReducer,
  order: orderReducer
});