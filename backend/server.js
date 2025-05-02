// backend/server.js
const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');
const ingredientRoutes = require('./routes/ingredients'); // Importa las rutas de ingredientes
require('./firebase/firebaseConfig');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes); // Monta las rutas de ingredientes

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});