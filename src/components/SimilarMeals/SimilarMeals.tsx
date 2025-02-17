import React, { useEffect } from "react";
import { fetchMealsByCategory } from "../../api/mealApi";
import { Meal } from "../../interfaces/mealInterfaces";

// Example of a Similar Meals Table component
const SimilarMealsTable: React.FC<{ category: string }> = ({ category }) => {
    // Fetch and display similar meals from the same category using TanStack Table (React Table)
    const [similarMeals, setSimilarMeals] = React.useState<Meal[]>([]);
  
    useEffect(() => {
      const fetchSimilarMeals = async () => {
        const meals = await fetchMealsByCategory(category);
        setSimilarMeals(meals);
      };
  
      fetchSimilarMeals();
    }, [category]);
  
    return (
      <div>
        <h3>Similar Meals</h3>
        <table>
          <thead>
            <tr>
              <th>Meal Name</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {similarMeals.map((meal) => (
              <tr key={meal.idMeal}>
                <td>{meal.strMeal}</td>
                <td>{meal.strCategory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default SimilarMealsTable;
  