import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

// Fetch meals based on a search term
export const fetchMeals = async (searchTerm: string = '') => {
  const response = await axios.get(`${API_URL}/search.php?s=${searchTerm}`);
  return response.data.meals || [];
};

// Fetch meal details by ID
export const fetchMealDetails = async (mealId: string) => {
  const response = await axios.get(`${API_URL}/lookup.php?i=${mealId}`);
  return response.data.meals ? response.data.meals[0] : null;
};


// Fetch meals by category
export const fetchMealsByCategory = async (category: string) => {
  const response = await axios.get(`${API_URL}/filter.php?c=${category}`);
  return response.data.meals || [];
};

// Fetch meals by area (optional filter)
export const fetchMealsByArea = async (area: string) => {
  const response = await axios.get(`${API_URL}/filter.php?a=${area}`);
  return response.data.meals || [];
};

// **Fetch meal categories**
export const fetchMealCategories = async () => {
  const response = await axios.get(`${API_URL}/categories.php`);
  return response.data.categories || [];
};
