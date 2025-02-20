import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MealDetails from './components/MealDetails/MealDetails';
import MealList from './components/MealList/MealList';
import RecipeNavbar from './components/RecipeNavbar/RecipeNavbar';
import NotFound from './components/NotFound/NotFound';


const App: React.FC = () => {
  return (
    <Router>
      <RecipeNavbar/>
      <Routes>
        <Route path="/" element={<MealList />} />
        <Route path="/meal/:mealId" element={<MealDetails />} />
        <Route path="*" element={<NotFound />} />
      
      </Routes>
    </Router>
  );
};

export default App;
