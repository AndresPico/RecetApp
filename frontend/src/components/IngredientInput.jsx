import React, { useState } from 'react';

function IngredientInput({ onIngredientsSubmit }) {
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [currentIngredients, setCurrentIngredients] = useState([]);

  const handleInputChange = (event) => {
    setIngredientsInput(event.target.value);
    // Aquí podrías implementar lógica de autocompletado futuro
  };

  const handleAddIngredient = () => {
    if (ingredientsInput.trim()) {
      setCurrentIngredients([...currentIngredients, ingredientsInput.trim()]);
      setIngredientsInput('');
    }
  };

  const handleSubmit = () => {
    if (currentIngredients.length > 0) {
      onIngredientsSubmit(currentIngredients); // Llama a la función prop con la lista de ingredientes
    } else {
      alert('Por favor, ingresa al menos un ingrediente.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Ingresa tus ingredientes"
        value={ingredientsInput}
        onChange={handleInputChange}
      />
      <button onClick={handleAddIngredient}>Agregar</button>
      <div>
        {currentIngredients.map((ingredient, index) => (
          <span key={index}>{ingredient} </span>
        ))}
      </div>
      <button onClick={handleSubmit}>Buscar Recetas</button>
    </div>
  );
}

export default IngredientInput;