import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Meal, MealDetail } from '../interfaces/mealInterfaces';
import { fetchMeals as fetchMealsApi, fetchMealDetails as fetchMealDetailsApi, fetchMealsByCategory as fetchSimilarMealsApi } from '../api/mealApi';

interface MealState {
  meals: Meal[];
  selectedMeal: MealDetail | null;
  similarMeals: Meal[];
  loading: boolean;
  error: string | null;
}

const initialState: MealState = {
  meals: [],
  selectedMeal: null,
  similarMeals: [],
  loading: false,
  error: null,
};

// Thunk for fetching meals
export const fetchMeals = createAsyncThunk('meals/fetchMeals', async (query: string) => {
  const meals = await fetchMealsApi(query);
  return meals;
});

// Thunk for fetching meal details by ID
export const fetchMealDetails = createAsyncThunk('meals/fetchMealDetails', async (mealId: string) => {
  const mealDetails = await fetchMealDetailsApi(mealId);
  return mealDetails;
});

// Thunk for fetching similar meals
export const fetchSimilarMeals = createAsyncThunk(
    "meals/fetchSimilarMeals",
    async (category: string) => {
      const similarMeals = await fetchSimilarMealsApi(category); // Ensure API supports category
      return similarMeals;
    }
  )

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
      .addCase(fetchMealDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMealDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMeal = action.payload;
      })
      .addCase(fetchMealDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meal details';
      })
      .addCase(fetchSimilarMeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSimilarMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.similarMeals = action.payload;
      })
      .addCase(fetchSimilarMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch similar meals';
      });
  },
});

export const { setMeals, setSelectedMeal, setSimilarMeals } = mealSlice.actions;
export default mealSlice.reducer;
