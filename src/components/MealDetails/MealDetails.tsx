import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { fetchMealDetails } from '../../redux/mealSlice'; // Import from redux slice
import { MealDetails } from '../../interfaces/mealInterfaces'; // Assuming the MealDetails type is defined
import SimilarMealsTable from '../SimilarMeals/SimilarMeals';

const MealDetails: React.FC = () => {
  const { mealId } = useParams<{ mealId: string }>();  // Get meal ID from URL
  const dispatch = useDispatch();
  const selectedMeal = useSelector((state: RootState) => state.meals.selectedMeal);

  useEffect(() => {
    if (mealId) {
      dispatch(fetchMealDetails(mealId));  // Use the thunk from Redux slice to fetch details
    }
  }, [mealId, dispatch]);

  if (!selectedMeal) {
    return <div>Loading...</div>;
  }

  // Destructure meal details
  const { strMeal, strMealThumb, strCategory, strInstructions } = selectedMeal;

  // Generate ingredients list dynamically
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (selectedMeal[`strIngredient${i}`]) {
      ingredients.push(selectedMeal[`strIngredient${i}`]);
    }
  }

  return (
    <div>
      <h1>{strMeal}</h1>
      <img src={strMealThumb} alt={strMeal} />
      <p><strong>Category:</strong> {strCategory}</p>
      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>Instructions</h2>
      <p>{strInstructions}</p>

      {/* Similar Meals Table */}
      <SimilarMealsTable category={strCategory} />
    </div>
  );
};

export default MealDetails;
