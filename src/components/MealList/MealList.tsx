import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeals } from '../../redux/mealSlice';
import { AppDispatch, RootState } from '../../redux/store';
import './MealList.css';

const MealList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const navigate = useNavigate();
  const { meals, loading, error } = useSelector((state: RootState) => state.meals);

  // Fetch meals when the component is mounted
  useEffect(() => {
    dispatch(fetchMeals('')); // You can pass a search term here
  }, [dispatch]);

  const handleMealClick = (mealId: string) => {
    navigate(`/meal/${mealId}`);
  };

  return (
    <div className='meal-list-container'><h1>Meal List</h1>
    <div className="meal-list">
      {loading && <p>Loading meals...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && meals.length === 0 && <p>No meals found</p>}
      {meals.map((meal) => (
        <div
          key={meal.idMeal}
          className="meal-card"
          onClick={() => handleMealClick(meal.idMeal)}
        >
          <img src={meal.strMealThumb} alt={meal.strMeal} />
          <h3>{meal.strMeal}</h3>
          <p>{meal.strCategory}</p>
          <p>{meal.strArea}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default MealList;
