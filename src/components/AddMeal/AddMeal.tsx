import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating a unique ID

interface AddMealModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addMeal: (meal: any) => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, closeModal, addMeal }) => {
  const [newMeal, setNewMeal] = useState({
    strMeal: '',
    strCategory: '',
    strArea: '',
    strMealThumb: '',
  });
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.strMeal || !newMeal.strCategory || !newMeal.strArea || !newMeal.strMealThumb) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');
    
    const mealToAdd = {
      idMeal: uuidv4(),
      ...newMeal,
    };
    
    addMeal(mealToAdd); // Add meal to local state in parent component
    closeModal(); // Close modal after adding meal
    setNewMeal({ strMeal: '', strCategory: '', strArea: '', strMealThumb: '' }); // Reset form
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add a New Meal</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="strMeal"
            placeholder="Meal Name"
            value={newMeal.strMeal}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="strCategory"
            placeholder="Category"
            value={newMeal.strCategory}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="strArea"
            placeholder="Area"
            value={newMeal.strArea}
            onChange={handleInputChange}
            required
          />
          <input
            type="url"
            name="strMealThumb"
            placeholder="Image URL"
            value={newMeal.strMealThumb}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add Meal</button>
          {formError && <p className="error">{formError}</p>}
        </form>
        <button onClick={closeModal} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default AddMealModal;
