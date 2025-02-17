import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MealDetails from './components/MealDetails/MealDetails';
import MealList from './components/MealList/MealList';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MealList />} />
        <Route path="/meal/:mealId" element={<MealDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
