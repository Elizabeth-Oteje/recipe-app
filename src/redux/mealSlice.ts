import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Meal, MealDetail, MealCategory } from '../interfaces/mealInterfaces';
import { 
  fetchMeals as fetchMealsApi, 
  fetchMealDetails as fetchMealDetailsApi, 
  fetchMealsByCategory as fetchMealsByCategoryApi, 
  fetchMealCategories as fetchMealCategoriesApi, fetchMealsByArea as  fetchMealsByAreaApi
} from '../api/mealApi';

interface MealState {
  meals: Meal[];
  selectedMeal: MealDetail | null;
  categories: MealCategory[];
  selectedCategory: string | null;
  selectedArea: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MealState = {
  meals: [],
  selectedMeal: null,
  categories: [],
  selectedCategory: null,
  selectedArea: null,
  loading: false,
  error: null,
};

// Fetch meals
export const fetchMeals = createAsyncThunk("meals/fetchMeals", async (query: string) => {
  try {
   
    const apiMeals = await fetchMealsApi(query);

    // Fetch meals from local storage
    const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
  
    let mergedMeals = [];

    if (query !== "") {
      // Filter local meals that match the query
      const filteredLocalMeals = localMeals.filter((meal: { strMeal: string; }) =>
        meal.strMeal.toLowerCase().includes(query.toLowerCase())
      );

      // Merge filtered local meals with API meals, ensuring no duplicates
      mergedMeals = [...filteredLocalMeals, ...apiMeals].filter(
        (meal, index, self) => index === self.findIndex((m) => m.idMeal === meal.idMeal)
      );
    } else {
      // If no query, merge all local and API meals, ensuring no duplicates
      mergedMeals = [...localMeals, ...apiMeals].filter(
        (meal, index, self) => index === self.findIndex((m) => m.idMeal === meal.idMeal)
      );
    }

   
    // if (mergedMeals.length === 0) {
    //   throw new Error("No meals found.");
    // }

    return mergedMeals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    throw new Error("Failed to fetch meals");
  }
});



// Fetch meal details by ID
export const fetchMealDetails = createAsyncThunk('meals/fetchMealDetails', async (mealId: string) => {
  const apiResponse = await fetchMealDetailsApi(mealId);
  if (apiResponse && typeof apiResponse === "object" &&  Object.keys(apiResponse)?.length > 0) {
    const mealDetails = apiResponse; 
    return mealDetails;
  }
  else if(
    !apiResponse || 
    typeof apiResponse === "string" ||
    (typeof apiResponse === "object" && Object.keys(apiResponse).length === 0) 
  ){
    const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
       
        const mealDetails = localMeals.find((meal: Meal) => meal.idMeal === mealId) || null;
        
        return mealDetails 
  }
});



export const fetchMealsByCategory = createAsyncThunk(
  "meals/fetchMealsByCategory",
  async (category: string) => {
    try {
     
      // Fetch meals from API
      const apiMeals = await fetchMealsByCategoryApi(category);
    
      // Fetch meals from local storage
      const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
    
      // Filter local meals that match the given category but are NOT in the API response
      const localMealsNotInApi = localMeals.filter(
        (meal: Meal) =>
          meal.strCategory.toLowerCase() === category.toLowerCase() &&
          !apiMeals.some(
            (apiMeal: Meal) => apiMeal.idMeal === meal.idMeal
          )
      );

     
      // Merge local meals first, then API meals (ensuring no duplicates)
      const mergedMeals = [...localMealsNotInApi, ...apiMeals];

      return mergedMeals;
    } catch (error) {
      console.error(`Error fetching meals for category ${category}:`, error);
      throw new Error(`Failed to fetch meals for category ${category}`);
    }
  }
);


export const fetchMealsByArea = createAsyncThunk(
  "meals/fetchMealsByArea",
  async (area: string) => {
    try {
     
      const apiMeals = await fetchMealsByAreaApi(area);

      // Fetch meals from local storage
      const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");

      // Filter local meals that match the given area but are NOT in the API response
      const localMealsNotInApi = localMeals.filter(
        (meal: Meal) =>
          meal.strArea.toLowerCase() === area.toLowerCase() &&
          !apiMeals.some(
            (apiMeal: Meal) => apiMeal.idMeal === meal.idMeal
          )
      );

     

      
      const mergedMeals = [...localMealsNotInApi, ...apiMeals];
      return mergedMeals;
    } catch (error) {
      console.error(`Error fetching meals for area ${area}:`, error);
      throw new Error(`Failed to fetch meals for area ${area}`);
    }
  }
);

// Fetch meal categories
export const fetchMealCategories = createAsyncThunk(
  "meals/fetchMealCategories",
  async () => {
    try {
      
      const apiCategories = await fetchMealCategoriesApi();
     
      const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
   
      const localCategoryNames = [
        ...new Set(localMeals.map((meal: Meal) => meal.strCategory)),
      ];

      // Format local categories to match API structure (only change id for categories not in API)
      const localCategories = localCategoryNames.map((category, index) => {
        // Check if category exists in API
        const apiCategory = apiCategories.find(
          (apiCat: { strCategory: string }) => apiCat.strCategory.toLowerCase() === (category as string).toLowerCase()
        );
        

        if (apiCategory) {
         
          return {
            ...apiCategory,
          };
        } else {
         return {
            idCategory: `local-${index + 1}`, // Unique local ID for non-API categories
            strCategory: category,
            strCategoryThumb: "",
            strCategoryDescription: "",
          };
        }
      });

      const mergedCategories = [
        ...localCategories,
        ...apiCategories.filter(
          (apiCat: { strCategory: string; }) =>
            !localCategories.some(
              (localCat) =>
                localCat.strCategory.toLowerCase() === apiCat.strCategory.toLowerCase()
            )
        ),
      ];
      return mergedCategories;
    } catch (error) {
      console.error("Error fetching meal categories:", error);
      throw new Error("Failed to fetch meal categories");
    }
  }
);


const mealSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setMeals: (state, action: PayloadAction<Meal[]>) => {
      state.meals = action.payload
    },
    addMealLocally: (state, action: PayloadAction<Meal>) => {
      const existingMeal = state.meals.find(meal => meal.idMeal === action.payload.idMeal);
      if (!existingMeal) {
        const newMeal = { ...action.payload, timestamp: Date.now() };
        state.meals.unshift(newMeal); // Add new meal at the top
        localStorage.setItem('meals', JSON.stringify(state.meals)); // Save updated meals
      }
    },
    
    setSelectedMeal: (state, action: PayloadAction<MealDetail>) => {
      state.selectedMeal = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedArea: (state, action: PayloadAction<string | null>) => {
      state.selectedArea = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Meals
      .addCase(fetchMeals.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when fetching starts
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
        if (action.payload.length === 0) {
          state.error = "No meals found.";
        }
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meals';
      })
  
      // Fetch Meals by Category
      .addCase(fetchMealsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMealsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = `Failed to fetch meals for category: ${action.error.message}`;
      })
  
      // Fetch Meals by Area
      .addCase(fetchMealsByArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealsByArea.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMealsByArea.rejected, (state, action) => {
        state.loading = false;
        state.error = `Failed to fetch meals for area: ${action.error.message}`;
      })
  
      // Fetch Meal Details
      .addCase(fetchMealDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMeal = action.payload;
      })
      .addCase(fetchMealDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = `Failed to fetch meal details: ${action.error.message}`;
      })
  
      // Fetch Meal Categories
      .addCase(fetchMealCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchMealCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = `Failed to fetch meal categories: ${action.error.message}`;
      });
  }
  
  
});

export const { setMeals, addMealLocally, setSelectedMeal,setSelectedCategory, setSelectedArea } = mealSlice.actions;
export default mealSlice.reducer;
