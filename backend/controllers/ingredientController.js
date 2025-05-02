// backend/controllers/ingredientController.js
const { getNextId } = require('../utils/counterUtils');
const { db } = require('../firebase/firebaseConfig');

exports.addIngredient = async (req, res) => {
  try {
    const { nombre, tipo, valor_nutricional } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({ error: 'El nombre y el tipo del ingrediente son obligatorios.' });
    }

    const id_ingrediente = await getNextId('contadorIngrediente');

    const newIngredient = {
      id_ingrediente: id_ingrediente,
      nombre: nombre,
      tipo: tipo,
      valor_nutricional: valor_nutricional || {} // Valor nutricional opcional
    };

    await db.collection('Ingredientes').doc(String(id_ingrediente)).set(newIngredient); // Usa .doc().set() para especificar el ID
    res.status(201).json({ message: 'Ingrediente agregado exitosamente con ID:', id_ingrediente });

  } catch (error) {
    console.error('Error al agregar ingrediente:', error);
    res.status(500).json({ error: 'Error al agregar ingrediente.' });
  }
};

exports.getAllIngredients = async (req, res) => {
  try {
    const snapshot = await db.collection('Ingredientes').get();
    const ingredientsList = [];
    snapshot.forEach(doc => {
      ingredientsList.push({ id: doc.id, ...doc.data() }); // 'doc.id' ahora será tu 'id_ingrediente' numérico
    });
    res.status(200).json(ingredientsList);
  } catch (error) {
    console.error('Error al obtener todos los ingredientes:', error);
    res.status(500).json({ error: 'Error al obtener la lista de ingredientes.' });
  }
};