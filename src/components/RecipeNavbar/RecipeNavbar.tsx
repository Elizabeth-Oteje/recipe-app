import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMeals } from '../../redux/mealSlice';
import { AppDispatch } from "../../redux/store";
import "./RecipeNavbar.css";


const RecipeNavbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
   const dispatch = useDispatch<AppDispatch>();

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      dispatch(fetchMeals(searchTerm));
    } else {
      dispatch(fetchMeals('')); // Fetch all meals when the search term is empty
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-text">My</span>
        <span className="logo-pal">Recipe</span>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearchSubmit}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.414-1.414l-3.85-3.85a1.007 1.007 0 0 0-.116-.1zM12 6.5A5.5 5.5 0 1 1 1 6.5a5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>
      <button>Add Meal</button>
    </nav>
  );
};

export default RecipeNavbar;
