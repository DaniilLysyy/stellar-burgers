import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';

import type {
  TIngredient,
  TConstructorIngredient
} from '@utils-types';

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 200,
    price: 100,
    image: 'bun.png',
    image_mobile: 'bun-mobile.png',
    image_large: 'bun-large.png'
  };

  const mockMain: TIngredient = {
    _id: 'main-1',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 15,
    fat: 10,
    carbohydrates: 5,
    calories: 150,
    price: 80,
    image: 'main.png',
    image_mobile: 'main-mobile.png',
    image_large: 'main-large.png'
  };

  const mockSauce: TIngredient = {
    ...mockMain,
    _id: 'sauce-1',
    name: 'Тестовый соус',
    type: 'sauce'
  };

  const constructorMain: TConstructorIngredient = {
    ...mockMain,
    id: 'main-instance-1'
  };

  const constructorSauce: TConstructorIngredient = {
    ...mockSauce,
    id: 'sauce-instance-1'
  };

  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    expect(state).toEqual(initialState);
  });

  test('добавляет булку в конструктор', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockBun)
    );

    expect(state.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });

    expect(state.ingredients).toEqual([]);
  });

  test('заменяет предыдущую булку новой', () => {
    const firstBun = {
      ...mockBun,
      id: 'old-bun-id'
    };

    const newBun = {
      ...mockBun,
      _id: 'bun-2',
      name: 'Новая булка'
    };

    const state = constructorReducer(
      {
        bun: firstBun,
        ingredients: []
      },
      addIngredient(newBun)
    );

    expect(state.bun).toEqual({
      ...newBun,
      id: expect.any(String)
    });

    expect(state.bun?._id).toBe('bun-2');
  });

  test('добавляет начинку в конструктор', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockMain)
    );

    expect(state.bun).toBeNull();

    expect(state.ingredients).toEqual([
      {
        ...mockMain,
        id: expect.any(String)
      }
    ]);
  });

  
  test('добавляет несколько ингредиентов в нужном порядке с уникальными id', () => {
    const stateAfterMain = constructorReducer(
      initialState,
      addIngredient(mockMain)
    );

    const stateAfterSauce = constructorReducer(
      stateAfterMain,
      addIngredient(mockSauce)
    );

    const stateAfterSecondMain = constructorReducer(
      stateAfterSauce,
      addIngredient(mockMain)
    );

    expect(
      stateAfterSecondMain.ingredients.map((ingredient) => ingredient._id)
    ).toEqual(['main-1', 'sauce-1', 'main-1']);

    const firstMainId = stateAfterSecondMain.ingredients[0].id;
    const secondMainId = stateAfterSecondMain.ingredients[2].id;

    expect(firstMainId).toEqual(expect.any(String));
    expect(secondMainId).toEqual(expect.any(String));

    expect(firstMainId).not.toBe(secondMainId);
  });


  test('удаляет ингредиент по его уникальному id', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [constructorMain, constructorSauce]
      },
      removeIngredient('main-instance-1')
    );

    expect(state.ingredients).toEqual([constructorSauce]);
  });

  test('перемещает ингредиент в конструкторе', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [constructorMain, constructorSauce]
      },
      moveIngredient({
        fromIndex: 0,
        toIndex: 1
      })
    );

    expect(state.ingredients).toEqual([
      constructorSauce,
      constructorMain
    ]);
  });

  test('очищает конструктор', () => {
    const state = constructorReducer(
      {
        bun: {
          ...mockBun,
          id: 'bun-instance-1'
        },
        ingredients: [constructorMain, constructorSauce]
      },
      clearConstructor()
    );

    expect(state).toEqual(initialState);
  });
});