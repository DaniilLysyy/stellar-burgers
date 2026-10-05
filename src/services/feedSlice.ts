import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getFeedsApi,
  getOrderByNumberApi
} from '@utils/burger-api';
import type { TOrder } from '@utils-types';

import type { RootState } from './store';

type TFeedState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  orderLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  currentOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  orderLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  getFeedsApi
);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  getOrderByNumberApi
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить ленту заказов';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderLoading = true;
        state.currentOrder = null;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.currentOrder = action.payload.orders[0] ?? null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить заказ';
      });
  }
});

export const feedReducer = feedSlice.reducer;

export const selectFeedOrders = (state: RootState) =>
  state.feed.orders;

export const selectCurrentOrder = (state: RootState) =>
  state.feed.currentOrder;

export const selectFeedTotal = (state: RootState) =>
  state.feed.total;

export const selectFeedTotalToday = (state: RootState) =>
  state.feed.totalToday;

export const selectFeedLoading = (state: RootState) =>
  state.feed.isLoading;

export const selectOrderLoading = (state: RootState) =>
  state.feed.orderLoading;

export const selectFeedError = (state: RootState) =>
  state.feed.error;