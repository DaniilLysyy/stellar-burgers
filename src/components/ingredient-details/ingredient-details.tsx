import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/ingredientsSlice';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(selectIngredients);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};