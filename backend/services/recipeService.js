const { db } = require('../firebase/firebaseConfig'); // Importa la instancia de Firestore

const getRecipesByIngredients = async (ingredients) => {
  try {
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return []; // Devuelve un array vacío si no hay ingredientes
    }

    const recipesRef = db.collection('Receta');
    const matchingRecipes = [];

    // **Lógica de búsqueda (V1.0 - Coincidencia de al menos un ingrediente):**
    const snapshot = await recipesRef.get();
    snapshot.forEach(doc => {
      const recipeData = doc.data();
      const recipeIngredients = recipeData.ingredients || [];

      if (recipeIngredients.some(ing => ingredients.includes(ing))) {
        matchingRecipes.push({ id: doc.id, ...recipeData });
      }
    });

    return matchingRecipes;
  } catch (error) {
    console.error('Error al buscar recetas por ingredientes en la base de datos:', error);
    throw error;
  }
};

// Aquí puedes agregar otras funciones para interactuar con la base de datos de recetas
// como getRecipeById, createRecipe, updateRecipe, deleteRecipe, etc.

module.exports = {
  getRecipesByIngredients,
  // ... otras funciones que exportes
};