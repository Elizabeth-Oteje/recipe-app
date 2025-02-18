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
  selectedMeal: MealDetail | null;
  similarMeals: Meal[];
  categories: MealCategory[];
  selectedCategory: string | null;
  selectedArea: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MealState = {
  meals: [],
  selectedMeal: null,
  similarMeals: [],
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
  const mealDetails = await fetchMealDetailsApi(mealId);
  return mealDetails;
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
      state.meals = action.payload;
    },
    setSelectedMeal: (state, action: PayloadAction<MealDetail>) => {
      state.selectedMeal = action.payload;
    },
    setSimilarMeals: (state, action: PayloadAction<Meal[]>) => {
      state.similarMeals = action.payload;
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
        state.meals = action.payload;
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
      });
  }
  
});

export const { setMeals, setSelectedMeal, setSimilarMeals, setSelectedCategory, setSelectedArea } = mealSlice.actions;
export default mealSlice.reducer;
