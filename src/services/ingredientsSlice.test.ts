import {
  ingredientsReducer,
  fetchIngredients
} from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredient: TIngredient = {
    _id: 'test-bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 200,
    price: 100,
    image: 'test-image.png',
    image_mobile: 'test-image-mobile.png',
    image_large: 'test-image-large.png'
  };

  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    expect(state).toEqual(initialState);
  });

  test('устанавливает isLoading при отправке запроса', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('test-request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('сохраняет ингредиенты при успешном запросе', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.fulfilled(
        [mockIngredient],
        'test-request-id',
        undefined
      )
    );

    expect(state.ingredients).toEqual([mockIngredient]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('сохраняет ошибку при неудачном запросе', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(
        new Error('Ошибка сети'),
        'test-request-id',
        undefined
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
    expect(state.ingredients).toEqual([]);
  });

  test('сбрасывает предыдущую ошибку при новом запросе', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: false,
        error: 'Ошибка сети'
      },
      fetchIngredients.pending('new-request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
});