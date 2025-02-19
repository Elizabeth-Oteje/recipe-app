export interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
  }
  
  export interface MealDetail {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strInstructions: string;
    [key: `strIngredient${number}`]: string | null;
  }
  
  export interface MealCategory {
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
  }