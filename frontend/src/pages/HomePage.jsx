import React, { useState, useEffect } from 'react';
import { getRecipesByIngredients } from '../services/recipeServices'; // Asegúrate de que la ruta sea correcta
import '../styles/HomePage.css';

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ingredientsToSearch, setIngredientsToSearch] = useState(''); // Estado para el input de búsqueda
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState(''); // Estado para el input de "lo que tienes" (sin funcionalidad ahora)
  const [filters, setFilters] = useState({ diet: '', difficulty: '', time: '', type: '' });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/recipes');
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
          setLoading(false);
        } else {
          setError(`Error al cargar recetas: ${response.status}`);
          setLoading(false);
        }
      } catch (error) {
        setError(`Error de conexión al cargar recetas: ${error.message}`);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleIngredientsToSearchChange = (e) => {
    setIngredientsToSearch(e.target.value);
    console.log('Valor de ingredientsToSearch:', e.target.value); // Log para verificar
  };

  const handleSearch = async () => {
    setSearching(true);
    setSearchResults([]);
    console.log('Intentando buscar con ingredientes:', ingredientsToSearch); // Log antes de la búsqueda
    try {
      const response = await fetch(`http://localhost:3001/api/recipes/search/ingredients?ingredients=${ingredientsToSearch}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del backend:', data); // Log de la respuesta
        setSearchResults(data);
        setSearching(false);
      } else {
        setError(`Error al buscar recetas: ${response.status}`);
        console.error(`Error al buscar recetas: ${response.status}`); // Log de error
        setSearching(false);
      }
    } catch (error) {
      setError(`Error de conexión al buscar recetas: ${error.message}`);
      console.error('Error de conexión al buscar recetas:', error); // Log de error de conexión
      setSearching(false);
    }
  };

  const handleAvailableIngredientsChange = (e) => {
    setAvailableIngredients(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  if (loading) {
    return <div>Cargando recetas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="homepage-panel">
      <header className="homepage-header-panel">
        <h1>Tu Centro de Recetas Personalizado</h1>
        <div className="user-profile-preview">
          <span>¡Hola, [Nombre de Usuario]!</span>
        </div>
      </header>

      <section className="panel-search-ingredients">
        <h2>Encuentra Recetas con lo que Tienes</h2>
        <input
          type="text"
          placeholder="Ingresa tus ingredientes..."
          value={ingredientsToSearch} // Usamos ingredientsToSearch
          onChange={handleIngredientsToSearchChange} // Usamos la función correcta
        />
        <button onClick={handleSearch} disabled={searching}>
          {searching ? 'Buscando...' : 'Buscar por Ingredientes'}
        </button>
      </section>

      {searching && <div>Buscando recetas...</div>}

      {searchResults.length > 0 && (
        <section className="panel-search-results">
          <h2>Coincidencias</h2>
          <div className="recipes-grid-panel">
            {searchResults.map((recipe) => (
              <div key={recipe.id} className="recipe-card-panel">
                <h3>{recipe.nombre}</h3>
                {recipe.imagen && <img src={recipe.imagen} alt={recipe.nombre} />}
                <p>Categoría: {recipe.categoria}</p>
                <button>Ver Detalles</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel-filters">
        <h2>Explora por Categoría y Más</h2>
        <div className="filter-buttons">
          <button>Desayunos</button>
          <button>Almuerzos</button>
          <button>Cenas</button>
          <button>Postres</button>
        </div>
        <div className="advanced-filters">
          {/* Selects de filtro */}
        </div>
      </section>

      <section className="panel-all-recipes">
        <h2>Todas las Recetas</h2>
        <div className="recipes-grid-panel">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card-panel">
              <h3>{recipe.nombre}</h3>
              {recipe.imagen && <img src={recipe.imagen} alt={recipe.nombre} />}
              <p>Categoría: {recipe.categoria}</p>
              <button>Ver Detalles</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="homepage-footer-panel">
        <nav className="footer-navigation">
          <a href="/guardadas">Recetas Guardadas</a>
          <a href="/compras">Lista de Compras</a>
          <a href="/comunidad">Comunidad</a>
        </nav>
        <p>© 2025 Tu App de Recetas</p>
      </footer>
    </div>
  );
}

export default HomePage;