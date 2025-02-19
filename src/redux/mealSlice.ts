import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Meal, MealDetail, MealCategory } from '../interfaces/mealInterfaces';
import { 
  fetchMeals as fetchMealsApi, 
  fetchMealDetails as fetchMealDetailsApi, 
  fetchMealsByCategory as fetchSimilarMealsApi, 
  fetchMealCategories as fetchMealCategoriesApi, fetchMealsByArea as  fetchMealsByAreaApi
} from '../api/mealApi';

interface MealState {
  meals: Meal[];
  allMeals: Meal[];
  selectedMeal: MealDetail | null;
  categories: MealCategory[];
  selectedCategory: string | null;
  selectedArea: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MealState = {
  meals: [],
  allMeals:[],
  selectedMeal: null,
  categories: [],
  selectedCategory: null,
  selectedArea: null,
  loading: false,
  error: null,
};

// Fetch meals
export const fetchMeals = createAsyncThunk('meals/fetchMeals', async (query: string) => {
  const meals = await fetchMealsApi(query);
  return meals;
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





// Fetch similar meals by category
export const fetchMealsByCategory = createAsyncThunk(
  'meals/fetchMealsByCategory',
  async (category: string) => {
    const meals = await fetchSimilarMealsApi(category); 
    return meals;
  }
);

export const fetchMealsByArea = createAsyncThunk(
  'meals/fetchMealsByArea',
  async (area: string) => {
    const meals = await fetchMealsByAreaApi(area); 
    return meals;
  }
);


// Fetch meal categories
export const fetchMealCategories = createAsyncThunk('meals/fetchMealCategories', async () => {
  const categories = await fetchMealCategoriesApi();
  return categories;
});

const mealSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setMeals: (state, action: PayloadAction<Meal[]>) => {
      state.meals = [...state.meals, ...action.payload];
    },
    addMealLocally: (state, action: PayloadAction<Meal>) => {
      const existingMeal = state.meals.find(meal => meal.idMeal === action.payload.idMeal);
      if (!existingMeal) {
        const newMeal = { ...action.payload, timestamp: Date.now() };
        state.meals.unshift(newMeal); // Add new meal at the top
        localStorage.setItem('meals', JSON.stringify(state.meals)); // Save updated meals
      }
    },
    
    
    
    mergeMeals: (state, action: PayloadAction<Meal[]>) => {
      const localMeals = JSON.parse(localStorage.getItem('meals') || '[]');
    
      // Place local meals first, then API meals
      const mergedMeals = [...localMeals, ...action.payload].filter(
        (meal, index, self) =>
          index === self.findIndex(m => m.idMeal === meal.idMeal) // Remove duplicates
      );
    state.allMeals = mergedMeals;
      state.meals = mergedMeals;
      localStorage.setItem('meals', JSON.stringify(mergedMeals));
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
        state.meals = [...state.meals, ...action.payload].filter(
          (meal, index, self) => index === self.findIndex(m => m.idMeal === meal.idMeal) 
        );
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

export const { setMeals, addMealLocally, mergeMeals, setSelectedMeal,setSelectedCategory, setSelectedArea } = mealSlice.actions;
export default mealSlice.reducer;
