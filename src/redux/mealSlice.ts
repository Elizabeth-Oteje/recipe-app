import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Meal, MealDetail } from '../interfaces/mealInterfaces';
import { fetchMeals as fetchMealsApi, fetchMealDetails as fetchMealDetailsApi } from '../api/mealApi'

interface MealState {
  meals: Meal[];
  selectedMeal: MealDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: MealState = {
  meals: [],
  selectedMeal: null,
  loading: false,
  error: null,
};

// Thunk for fetching meals using the existing API function
export const fetchMeals = createAsyncThunk('meals/fetchMeals', async (query: string) => {
  const meals = await fetchMealsApi(query); // Call the API function here
  return meals;
});

// Thunk for fetching meal details by ID using the existing API function
export const fetchMealDetails = createAsyncThunk('meals/fetchMealDetails', async (mealId: string) => {
  const mealDetails = await fetchMealDetailsApi(mealId); // Call the API function here
  return mealDetails;
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
      });
  },
});

export const { setMeals, setSelectedMeal } = mealSlice.actions;
export default mealSlice.reducer;
