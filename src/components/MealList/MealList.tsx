import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMeals } from '../../redux/mealSlice';
import { AppDispatch, RootState } from '../../redux/store';
import './MealList.css';

const getInitialMeals = () => {
  const width = window.innerWidth;
  if (width >= 1200) return 15; // Large screens (3 rows of 5)
  if (width >= 992) return 12; // Medium screens (3 rows of 4)
  if (width >= 768) return 9; // Small screens (3 rows of 3)
  return 6; // Mobile screens (3 rows of 2)
};

const LOAD_MORE_COUNT = 10; // Meals per scroll

const MealList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const navigate = useNavigate();
  const { meals, loading, error } = useSelector((state: RootState) => state.meals);
  
  const [displayedMeals, setDisplayedMeals] = useState<number>(0);
  const [showEndMessage, setShowEndMessage] = useState(false);
  useEffect(() => {
    dispatch(fetchMeals(''));
  }, [dispatch]);

  useEffect(() => {
    if (meals.length > 0) {
      setDisplayedMeals(getInitialMeals());
    }
  }, [meals]);

  const fetchMoreMeals = () => {
    setTimeout(() => {
      setDisplayedMeals((prev) => {
        const newCount = Math.min(prev + LOAD_MORE_COUNT, meals.length);
        if (newCount === meals.length) {
          setShowEndMessage(true);
          setTimeout(() => setShowEndMessage(false), 2000); // Hide after 2 seconds
        }
        return newCount;
      });
    }, 1000);
  };

  const handleMealClick = (mealId: string) => {
    navigate(`/meal/${mealId}`);
  };

  return (
    <div className="container">
      <h1>Meal List</h1>
      {loading && <p className="loading-error-text">Loading meals...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && meals.length === 0 && <p className="loading-error-text">No meals found</p>}

      {!loading && meals.length > 0 && (
        <InfiniteScroll
          dataLength={displayedMeals}
          next={fetchMoreMeals}
          hasMore={displayedMeals < meals.length}
          loader={<p className="scroll-loading">Loading more meals...</p>}
          endMessage={
            showEndMessage && (
              <p className="scroll-end">No more meals available.</p>
            )
          }
           style={{overflowX:'hidden'}}
        >
          <div className="meal-list">
            {meals.slice(0, displayedMeals).map((meal) => (
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
        </InfiniteScroll>
      )}
    </div>
  );
};

export default MealList;
