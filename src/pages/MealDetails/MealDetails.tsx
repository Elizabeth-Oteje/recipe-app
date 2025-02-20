import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchMealDetails } from '../../redux/mealSlice'; 
import SimilarMealsTable from '../../components/SimilarMeals/SimilarMeals';
import './MealDetails.css';
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
    return <div>Meal not found</div>;
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
    
        <div className='meal-detail-container'>
        
          <div className='detail-container instruction-card'>
          <img src={strMealThumb} alt={strMeal} className='meal-detail-image' />
          <div className='meal-details'>
          <h2>{strMeal}</h2>
     
      <h3>Category: <span>{strCategory}</span></h3>
      <div>
      <h3>Ingredients</h3>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      </div>
      </div>
          </div>
       
          <div className="instruction-card">
  <h2>Instructions</h2>
  <p>{strInstructions}</p>
</div>

        </div>

        <SimilarMealsTable category={strCategory} />
      
     

    
    
    </div>
  );
};

export default MealDetails;
