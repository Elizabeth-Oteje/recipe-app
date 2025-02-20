import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {fetchMeals } from '../../redux/mealSlice';
import { AppDispatch } from "../../redux/store";
import "./RecipeNavbar.css";
import {debounce} from 'lodash'
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddMealModal from "../AddMeal/AddMeal";
import { FaSearch } from "react-icons/fa";


const RecipeNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
   const dispatch = useDispatch<AppDispatch>();
   const debouncedFetchMeals = debounce((query: string) => {
    if (query === "") {
      dispatch(fetchMeals('')); 
    } else {
      dispatch(fetchMeals(query)); 
    }
  }, 500);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); 
    debouncedFetchMeals(value); 
  };

  const handleClearSearch = () => {
    setSearchTerm(""); 
    dispatch(fetchMeals('')); 
  };
 
  const handleFocus = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <>
    <nav className="navbar" data-testid="recipe-navbar">
        <Link to='/' className="logo" data-testid="navbar-logo">
          <span className="logo-text">My</span>
          <span className="logo-pal">Recipe</span>
        </Link>

        <div className="search-container" data-testid="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for recipes..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            data-testid="search-input"
          />
          {searchTerm ? (
            <button 
              className="clear-button" 
              onClick={handleClearSearch}
              data-testid="clear-button"
            >
              X
            </button>
          ) : (
            <button className="search-button" data-testid="search-button">
              <FaSearch />
            </button>
          )}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)} 
          className="navbar-btn"
          data-testid="add-meal-button"
        >
          Add Meal
        </button>
      </nav>
     <AddMealModal
     isOpen={isModalOpen}
     closeModal={() => setIsModalOpen(false)}
     
   />
   </>
  );
};

export default RecipeNavbar;
