const API_URL = 'http://localhost:3001/api'; // Asegúrate de que coincida con la URL de tu backend

export const getRecipesByIngredients = async (ingredients) => {
  try {
    const response = await fetch(`${API_URL}/recipes/by-ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData?.error || 'Error desconocido'}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

// Aquí puedes agregar otras funciones para interactuar con la API de recetas
// como getRecipeById, createRecipe, etc.