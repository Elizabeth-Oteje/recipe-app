import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchMealDetails } from '../../redux/mealSlice'; 
import SimilarMealsTable from '../SimilarMeals/SimilarMeals';

const MealDetails: React.FC = () => {
  const { mealId } = useParams<{ mealId: string }>();  // Get meal ID from URL
  const dispatch = useDispatch<AppDispatch>(); 
  const selectedMeal = useSelector((state: RootState) => state.meals.selectedMeal);

  useEffect(() => {
    if (mealId) {
      dispatch(fetchMealDetails(mealId));  
    }
  }, [mealId, dispatch]);

  if (!selectedMeal) {
    return <div>Loading...</div>;
  }

  const { strMeal, strMealThumb, strCategory, strInstructions } = selectedMeal;

 
  const ingredients: string[] = [];

for (let i = 1; i <= 20; i++) {
  const ingredient = selectedMeal[`strIngredient${i}`]; 
  if (ingredient) {
    ingredients.push(ingredient);
  }
}


  return (
    <div className='container'>
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

    
      <SimilarMealsTable category={strCategory} />
    </div>
  );
};

export default MealDetails;
