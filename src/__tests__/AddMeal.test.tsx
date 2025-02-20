import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import mealReducer from "../redux/mealSlice"; // Adjust path as needed
import AddMealModal from "../components/AddMeal/AddMeal";

const setupStore = () =>
  configureStore({
    reducer: { meals: mealReducer }, // Add more reducers if needed
  });

describe("AddMealModal Component", () => {
  it("renders modal when isOpen is true", () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AddMealModal isOpen={true} closeModal={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("modal-container")).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AddMealModal isOpen={false} closeModal={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId("modal-container")).toBeNull();
  });

  it("calls closeModal when close button is clicked", () => {
    const closeModalMock = jest.fn();
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AddMealModal isOpen={true} closeModal={closeModalMock} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId("close-button"));
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
