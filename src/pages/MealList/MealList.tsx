import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMeals, fetchMealCategories, setSelectedArea, setSelectedCategory, fetchMealsByCategory, fetchMealsByArea } from '../../redux/mealSlice';
import { AppDispatch, RootState } from '../../redux/store';
import './MealList.css';
import AddMealModal from '../../components/AddMeal/AddMeal';
import { Meal } from '../../interfaces/mealInterfaces';

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
  const { meals, mealsError, mealsLoading, categories,categoriesLoading,categoriesError, selectedCategory, selectedArea, mealsByAreaError,mealsByAreaLoading,mealsByCategoryError,mealsByCategoryLoading,searchLoading } = useSelector((state: RootState) => state.meals);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);

   const [isModalOpen, setIsModalOpen] = useState(false);

  const [displayedMeals, setDisplayedMeals] = useState<number>(0);
  const [showEndMessage, setShowEndMessage] = useState(false);

  
  useEffect(() => {


    dispatch(fetchMeals('')).then((response) => {
      if (response.payload) {
        if (Array.isArray(response.payload)) {
          setAllMeals(response.payload);
        } 
      }
    });
  
    dispatch(fetchMealCategories());
  }, [dispatch]);
  

  useEffect(() => {
    if (meals.length > 0) {
      
      setDisplayedMeals(getInitialMeals());
    }
  }, [meals]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchMealsByCategory(selectedCategory)); 
    } 
    if (selectedArea) {
      dispatch(fetchMealsByArea(selectedArea)); 
    }
  }, [selectedCategory, selectedArea, dispatch]);
  
  

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

  const uniqueAreas = React.useMemo(() => [...new Set(allMeals.map((meal) => meal.strArea))], [allMeals]);



  const handleMealClick = (mealId: string) => {
    navigate(`/meal/${mealId}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    if (category === "") {
      dispatch(setSelectedCategory(""));
       dispatch(fetchMeals(""))
    } else {
      dispatch(setSelectedCategory(category));
      dispatch(setSelectedArea("")); 
    }
  };
  
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    if (area === "") {
      dispatch(setSelectedArea(""));
       dispatch(fetchMeals(""))
    } else {
      dispatch(setSelectedArea(area));
      dispatch(setSelectedCategory("")); 
    }
  };
  


  return (
    <div className="container">
      <div className='meal-list-container'>
        <div className='add-meal-container'>
      <button onClick={() => setIsModalOpen(true)} className="">Add Meal</button>
      </div>
        <div className="filter-container">
          <h3>Filter By:</h3>
          {/* Category Filter */}
          <select onChange={handleCategoryChange} value={selectedCategory || ''}>
            <option value="">All Categories</option>
            {categoriesLoading && <option>Loading Categories...</option>}
            {categoriesError && <option>{categoriesError}</option>}
            {!categoriesLoading && categories.map((category) => (
              <option key={category.idCategory} value={category.strCategory}>
                {category.strCategory}
              </option>
            ))}
          </select>

          {/* Area Filter */}
          <select onChange={handleAreaChange} value={selectedArea || ''}>
            <option value="">All Areas</option>
            {uniqueAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h1>Meal List</h1>
          {mealsLoading && !selectedCategory && !selectedArea && (
    <p className="loading-error-text">Loading meals...</p>
  )}
  {mealsError && meals.length === 0 && !selectedCategory && !selectedArea && (
    <p className="loading-error-text">{mealsError}</p>
  )}
{searchLoading && <p className="loading-error-text">Loading search results...</p>}

  {/* Filtering by Category */}
  {selectedCategory && mealsByCategoryLoading && (
    <p className="loading-error-text">Loading meals by category...</p>
  )}
  {selectedCategory && mealsByCategoryError && (
    <p className="loading-error-text">{mealsByCategoryError}</p>
  )}

  {/* Filtering by Area */}
  {selectedArea && mealsByAreaLoading && (
    <p className="loading-error-text">Loading meals by area...</p>
  )}
  {selectedArea && mealsByAreaError && (
    <p className="loading-error-text">{mealsByAreaError}</p>
  )}

  {/* No Meals Found */}
  {!mealsLoading &&
    !mealsError &&
    !mealsByCategoryLoading &&
    !mealsByAreaLoading && !searchLoading &&
    meals.length === 0 && (
      <p className="loading-error-text">No meals found</p>
  )}
         
          {!mealsLoading && !categoriesLoading && !mealsByAreaLoading && !mealsByCategoryLoading && !searchLoading && meals.length > 0 && (
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
              style={{ overflowX: 'hidden' }}
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
      </div>
      <AddMealModal
     isOpen={isModalOpen}
     closeModal={() => setIsModalOpen(false)}
     
   />
    </div>
  );
};

export default MealList;
