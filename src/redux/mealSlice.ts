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
    console.log(`Fetching meals with query: "${query}"...`);

    // Fetch meals from API
    const apiMeals = await fetchMealsApi(query);
    console.log("Meals found in API:", apiMeals);

    // Fetch meals from local storage
    const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
    console.log("Meals found in Local Storage:", localMeals);

    let mergedMeals = [];

    if (query !== "") {
      // Filter local meals that match the query
      const filteredLocalMeals = localMeals.filter((meal) =>
        meal.strMeal.toLowerCase().includes(query.toLowerCase())
      );

      console.log("Filtered Local Meals:", filteredLocalMeals);

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

    console.log("Final Merged Meals:", mergedMeals);

    // If no meals are found in both sources, throw an error
    if (mergedMeals.length === 0) {
      throw new Error("No meals found.");
    }

    return mergedMeals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    throw new Error("Failed to fetch meals");
  }
});



// Fetch meal details by ID
export const fetchMealDetails = createAsyncThunk('meals/fetchMealDetails', async (mealId: string) => {
  const apiResponse = await fetchMealDetailsApi(mealId);
  console.log(apiResponse,'thunk')
  if (apiResponse && typeof apiResponse === "object" &&  Object.keys(apiResponse)?.length > 0) {
    const mealDetails = apiResponse; // Get first meal from array
    console.log("Fetched Meal from API:", mealDetails);
    return mealDetails;
  }
  else if(
    !apiResponse || // null, undefined
    typeof apiResponse === "string" ||
    (typeof apiResponse === "object" && Object.keys(apiResponse).length === 0) 
  ){
    const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
        console.log("Local Storage Meals:", localMeals);

        const mealDetails = localMeals.find((meal: Meal) => meal.idMeal === mealId) || null;
        console.log("Local Meal Found:", mealDetails);

        // If still not found, reject the request
        return mealDetails 
  }
});



export const fetchMealsByCategory = createAsyncThunk(
  "meals/fetchMealsByCategory",
  async (category: string) => {
    try {
      console.log(`Fetching meals for category: ${category} from API...`);

      // Fetch meals from API
      const apiMeals = await fetchMealsByCategoryApi(category);
      console.log("API Meals:", apiMeals);

      // Fetch meals from local storage
      const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
      console.log("Local Storage Meals:", localMeals);

      // Filter local meals that match the given category but are NOT in the API response
      const localMealsNotInApi = localMeals.filter(
        (meal: Meal) =>
          meal.strCategory.toLowerCase() === category.toLowerCase() &&
          !apiMeals.some(
            (apiMeal: Meal) => apiMeal.idMeal === meal.idMeal
          )
      );

      console.log("Local Meals Not in API:", localMealsNotInApi);

      // Merge local meals first, then API meals (ensuring no duplicates)
      const mergedMeals = [...localMealsNotInApi, ...apiMeals];

      console.log("Final Merged Meals:", mergedMeals);
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
      console.log(`Fetching meals for area: ${area} from API...`);

      // Fetch meals from API
      const apiMeals = await fetchMealsByAreaApi(area);
      console.log("API Meals:", apiMeals);

      // Fetch meals from local storage
      const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
      console.log("Local Storage Meals:", localMeals);

      // Filter local meals that match the given area but are NOT in the API response
      const localMealsNotInApi = localMeals.filter(
        (meal: Meal) =>
          meal.strArea.toLowerCase() === area.toLowerCase() &&
          !apiMeals.some(
            (apiMeal: Meal) => apiMeal.idMeal === meal.idMeal
          )
      );

      console.log("Local Meals Not in API:", localMealsNotInApi);

      // Merge local meals first, then API meals (ensuring no duplicates)
      const mergedMeals = [...localMealsNotInApi, ...apiMeals];

      console.log("Final Merged Meals:", mergedMeals);
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
      console.log("Fetching categories from API...");

      // Fetch categories from API
      const apiCategories = await fetchMealCategoriesApi();
      console.log("API Categories:", apiCategories);

      // Fetch meals from local storage
      const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
      console.log("Local Storage Meals:", localMeals);

      // Extract unique category names from local meals
      const localCategoryNames = [
        ...new Set(localMeals.map((meal: Meal) => meal.strCategory)),
      ];

      // Format local categories to match API structure (only change id for categories not in API)
      const localCategories = localCategoryNames.map((category, index) => {
        // Check if category exists in API
        const apiCategory = apiCategories.find(
          (apiCat) => apiCat.strCategory.toLowerCase() === category.toLowerCase()
        );

        if (apiCategory) {
          // If category exists in API, use the API idCategory
          return {
            ...apiCategory,
          };
        } else {
          // If category does not exist in API, generate a local ID
          return {
            idCategory: `local-${index + 1}`, // Unique local ID for non-API categories
            strCategory: category,
            strCategoryThumb: "",
            strCategoryDescription: "",
          };
        }
      });

      console.log("Local Categories:", localCategories);

      // Merge local categories first, then API categories, ensuring no duplicates
      const mergedCategories = [
        ...localCategories,
        ...apiCategories.filter(
          (apiCat) =>
            !localCategories.some(
              (localCat) =>
                localCat.strCategory.toLowerCase() === apiCat.strCategory.toLowerCase()
            )
        ),
      ];

      console.log("Final Merged Categories:", mergedCategories);
      return mergedCategories;
    } catch (error) {
      console.error("Error fetching meal categories:", error);
      throw new Error("Failed to fetch meal categories");
    }
  }
);



// export const fetchMealCategories = createAsyncThunk('meals/fetchMealCategories', async () => {
//   const categories = await fetchMealCategoriesApi();
//   return categories;
// });

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
      .addCase(fetchMeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = state.meals = action.payload;
      })
      
      .addCase(fetchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meals';
      })
      .addCase(fetchMealsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMealsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMealsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meals by category';
      })
      .addCase(fetchMealsByArea.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMealsByArea.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMealsByArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meals by area';
      })
      .addCase(fetchMealCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMealCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchMealCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meal categories';
      })
      .addCase(fetchMealDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMealDetails.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedMeal = action.payload;
        } else {
          state.error = "Meal details not found.";
        }
        state.loading = false;
      })
      
      .addCase(fetchMealDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meal details';
      });
    
  }
  
});

export const { setMeals, addMealLocally, setSelectedMeal,setSelectedCategory, setSelectedArea } = mealSlice.actions;
export default mealSlice.reducer;
