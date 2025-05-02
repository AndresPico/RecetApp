const admin = require('firebase-admin');
// backend/controllers/recipeController.js
const { getNextId } = require('../utils/counterUtils');
const { db } = require('../firebase/firebaseConfig');

exports.importRecipes = async (req, res) => {
  try {
    const recipes = req.body;

    if (!Array.isArray(recipes)) {
      return res.status(400).json({ error: 'El cuerpo de la petición debe ser un array de recetas en formato JSON.' });
    }

    const importPromises = recipes.map(async (recipe) => {
      // Validar que la receta tenga los campos necesarios (similar a addRecipe)
      if (!recipe.nombre || !recipe.categoria || !recipe.pasos || !recipe.ingredientes || recipe.ingredientes.length === 0) {
        console.warn('Receta con formato incompleto, omitiendo:', recipe.nombre);
        return;
      }

      const id_receta = await getNextId('contadorReceta'); // Obtener un nuevo ID único

      const newRecipe = {
        id_receta: id_receta,
        nombre: recipe.nombre,
        categoria: recipe.categoria,
        dificultad: recipe.dificultad || 'fácil',
        tiempo_preparacion: recipe.tiempo_preparacion || '',
        pasos: recipe.pasos,
        video_tutorial: recipe.video_tutorial || '',
        imagen: recipe.imagen || '',
        ingredientes: recipe.ingredientes.map(id => parseInt(id)), // Asegurarse de que los IDs sean números
      };

      await db.collection('receta').doc(String(id_receta)).set(newRecipe);
      console.log('Receta importada:', recipe.nombre, 'con ID:', id_receta);
    });

    await Promise.all(importPromises);

    res.status(200).json({ message: `Se importaron ${recipes.length} recetas exitosamente.` });

  } catch (error) {
    console.error('Error al importar recetas:', error);
    res.status(500).json({ error: 'Error al importar recetas.' });
  }
};

exports.getAllRecipes = async (req, res) => {
    try {
      const snapshot = await db.collection('receta').get();
      const recipesList = [];
      snapshot.forEach(doc => {
        recipesList.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(recipesList);
    } catch (error) {
      console.error('Error al obtener todas las recetas:', error);
      res.status(500).json({ error: 'Error al obtener la lista de recetas.' });
    }
  };

  exports.searchRecipesByIngredients = async (req, res) => {
    const { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ error: 'Se deben proporcionar ingredientes para la búsqueda.' });
    }
  
    const searchNames = ingredients.split(',').map(ing => ing.trim().toLowerCase());
    const ingredientIds = [];
  
    try {
      // 1. Buscar los IDs de los ingredientes por nombre (case-insensitive)
      const ingredientsRef = db.collection('Ingredientes');
      const snapshotIng = await ingredientsRef.where('nombre', 'in', searchNames).get();
  
      snapshotIng.forEach(doc => {
        const ingredientData = doc.data();
        if (ingredientData && ingredientData.id_ingrediente !== undefined && ingredientData.id_ingrediente !== null) {
          console.log('ID de ingrediente encontrado:', ingredientData.id_ingrediente);
          ingredientIds.push(ingredientData.id_ingrediente); // Guardamos el ID como número
        } else {
          console.warn('Advertencia: Ingrediente sin id_ingrediente definido:', ingredientData);
        }
      });
  
      if (ingredientIds.length === 0) {
        return res.status(200).json([]); // No se encontraron ingredientes, devolver array vacío
      }
  
      // 2. Buscar las recetas que contengan al menos uno de los IDs encontrados
      const recipesRef = db.collection('receta');
      const snapshotRec = await recipesRef.get();
      const results = [];
  
      snapshotRec.forEach(doc => {
        const recipeData = doc.data();
        let recipeIngredients = [];
        if (Array.isArray(recipeData.ingredientes)) {
          recipeIngredients = recipeData.ingredientes; // Los IDs en recetas deberían ser números
        } else {
          console.warn(`Receta con ID ${doc.id} tiene un formato incorrecto en 'ingredientes':`, recipeData.ingredientes);
          return;
        }
  
        const matchesAny = ingredientIds.some(id =>
          recipeIngredients.includes(id)
        );
  
        if (matchesAny) {
          results.push({ id: doc.id, ...recipeData });
        }
      });
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Error al buscar recetas por ingredientes:', error);
      res.status(500).json({ error: 'Error al buscar recetas.' });
    }
  };