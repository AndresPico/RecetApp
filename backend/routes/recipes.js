const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.post('/admin/import-recipes', recipeController.importRecipes);
router.get('/', recipeController.getAllRecipes);
router.get('/search/ingredients', recipeController.searchRecipesByIngredients);

module.exports = router;