import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'; // For generating a unique ID
import { Meal } from '../../interfaces/mealInterfaces';
import { addMealLocally } from '../../redux/mealSlice';
import './AddMeal.css';
import { AppDispatch } from '../../redux/store';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


interface AddMealModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, closeModal }) => {
   const dispatch = useDispatch<AppDispatch>();;
  const navigate = useNavigate();


  const [newMeal, setNewMeal] = useState({
    strMeal: '',
    strCategory: '',
    strArea: '',
    strMealThumb: '',
    ingredients: [''], // To store ingredients
    strInstructions: '', // To store instructions
  });
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  const handleAddIngredient = () => {
    setNewMeal((prevState) => ({
      ...prevState,
      ingredients: [...prevState.ingredients, ''],
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...newMeal.ingredients];
    updatedIngredients[index] = value;
    setNewMeal({ ...newMeal, ingredients: updatedIngredients });
  };

  const handleIngredientDelete = (index: number) => {
    const updatedIngredients = newMeal.ingredients.filter((_, i) => i !== index);
    setNewMeal({ ...newMeal, ingredients: updatedIngredients });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewMeal({ ...newMeal, strMealThumb: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.strMeal || !newMeal.strCategory || !newMeal.strArea || !newMeal.strMealThumb || !newMeal.strInstructions) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');
  
    // Map the ingredients to the expected strIngredient format
    const ingredients = newMeal.ingredients.reduce((acc: { [key: string]: string }, ingredient, index) => {
      if (ingredient) {
        acc[`strIngredient${index + 1}`] = ingredient;
      }
      return acc;
    }, {});
  
    const mealToAdd: Meal = {
      idMeal: uuidv4(),
      strMeal: newMeal.strMeal,
      strCategory: newMeal.strCategory,
      strArea: newMeal.strArea,
      strMealThumb: newMeal.strMealThumb,
      strInstructions: newMeal.strInstructions,
      ...ingredients, 
    };

        
      
    dispatch(addMealLocally(mealToAdd));

    
    setNewMeal({
      strMeal: '',
      strCategory: '',
      strArea: '',
      strMealThumb: '',
      ingredients: [''],
      strInstructions: '',
    });
    closeModal(); // Close modal after adding meal
     // Reset form
    navigate('/')
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-testid="modal-container">
    <div className="modal">
      <div className="modal-header">
      <h2>Add a New Meal</h2>
      <button onClick={closeModal} className="close-icon" data-testid="close-button">&times;</button>
    
      </div>
      
      <div className="modal-body">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-row">
          <div className="form-col">
            <label>Meal Name</label>
            <input
              type="text"
              name="strMeal"
              placeholder="Meal Name"
              value={newMeal.strMeal}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-col">
            <label>Category</label>
            <input
              type="text"
              name="strCategory"
              placeholder="Category"
              value={newMeal.strCategory}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
  
        <div className="form-row">
          <div className="form-col">
            <label>Area</label>
            <input
              type="text"
              name="strArea"
              placeholder="Area"
              value={newMeal.strArea}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-col">
            <label>Upload Image</label>
            <input
              type="file"
              name="strMealThumb"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
             {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Image Preview" />
          </div>
        )}
  
          </div>
        </div>
  
       
        <div className="form-col">
          <label>Instructions</label>
          <textarea
            name="strInstructions"
            placeholder="Instructions"
            value={newMeal.strInstructions}
            onChange={(e) => setNewMeal({ ...newMeal, strInstructions: e.target.value })}
            required
          />
        </div>
  
        <div className="form-col">
          <label>Ingredients</label>
          <div className="ingredients">
          {newMeal.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder={`Ingredient ${index + 1}`}
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                required
              />
              {newMeal.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleIngredientDelete(index)}
                  className="clear-button"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          </div>  
          <div>
          <button type="button" onClick={handleAddIngredient} className="add-btn">
            <FaPlus/> Add More Ingredients
          </button>
          </div>
        </div>
  <div className="submit-container">
        <button type="submit" className="submit-btn">Add Meal</button>
        </div>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  </div>
  </div>
  
  );
};

export default AddMealModal;
