// backend/routes/ingredients.js
const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController.js');

router.post('/', ingredientController.addIngredient);
router.get('/', ingredientController.getAllIngredients);

module.exports = router;