import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@utils/burger-api';
import type { TIngredient } from '@utils-types';

import type { RootState } from './store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Асинхронная загрузка ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Запрос отправлен
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Ингредиенты успешно получены
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })

      // Ошибка запроса
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

// Селекторы

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;