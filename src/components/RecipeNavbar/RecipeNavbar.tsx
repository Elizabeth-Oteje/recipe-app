import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {fetchMeals } from '../../redux/mealSlice';
import { AppDispatch } from "../../redux/store";
import "./RecipeNavbar.css";
import {debounce} from 'lodash'
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddMealModal from "../AddMeal/AddMeal";
import { Meal } from "../../interfaces/mealInterfaces";
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
    <nav className="navbar">
   
      <Link to='/' className="logo">
        <span className="logo-text">My</span>
        <span className="logo-pal">Recipe</span>
      </Link>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={handleSearchChange} 
          onFocus={handleFocus} 
        />
         {searchTerm ? (
          <button className="clear-button" onClick={handleClearSearch}>
            X
          </button> 
        ) :
        <button className="search-button">
        <FaSearch/>
        </button>}
      </div>
      <div>
    
      <button onClick={() => setIsModalOpen(true)} className="navbar-btn">Add Meal</button>
      </div>
    </nav>
     <AddMealModal
     isOpen={isModalOpen}
     closeModal={() => setIsModalOpen(false)}
     
   />
   </>
  );
};

export default RecipeNavbar;
