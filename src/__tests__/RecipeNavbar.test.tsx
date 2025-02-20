import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import mealReducer from "../redux/mealSlice"; // Ensure fetchMeals is imported
import RecipeNavbar from "../components/RecipeNavbar/RecipeNavbar";

const setupStore = () =>
  configureStore({
    reducer: { meals: mealReducer },
  });

describe("RecipeNavbar Component", () => {
  it("renders RecipeNavbar correctly", () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RecipeNavbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
    expect(screen.getByTestId("add-meal-button")).toBeInTheDocument();
  });

  it("dispatches fetchMeals when search input changes", async () => {
    const store = setupStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
  
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RecipeNavbar />
        </MemoryRouter>
      </Provider>
    );
  
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Pizza" } });
  
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function)); // To account for thunk action
  });
 
  
  
  
  
});
