import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({  });
  const [newRecipe, setNewRecipe] = useState({  });

  // Estados para la importación JSON
  const [jsonText, setJsonText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [importStatus, setImportStatus] = useState('');
  const [importError, setImportError] = useState('');

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/ingredients');
        if (response.ok) {
          const data = await response.json();
          setIngredients(data);
        } else {
          console.error('Error al cargar ingredientes:', response.status);
        }
      } catch (error) {
        console.error('Error de conexión al cargar ingredientes:', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleInputChangeIngredient = (e) => {
    setNewIngredient({ ...newIngredient, [e.target.name]: e.target.value });
  };

  const handleAddIngredient = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIngredient),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message + ' ' + data.id_ingrediente);
        setNewIngredient({ nombre: '', tipo: '', valor_nutricional: '' });
        // Aquí podrías recargar la lista de ingredientes si la implementas
      } else {
        const errorData = await response.json();
        alert('Error al agregar ingrediente: ' + (errorData?.error || 'Desconocido'));
      }
    } catch (error) {
      console.error('Error al enviar la petición para agregar ingrediente:', error);
      alert('Error de conexión al servidor.');
    }
  };

  const handleJsonTextChange = (event) => {
    setJsonText(event.target.value);
    setImportStatus('');
    setImportError('');
  };

  const handleJsonFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImportStatus('');
    setImportError('');
  };

  const handleImportRecipesFromJsonText = async () => {
    setImportStatus('Importando desde texto...');
    setImportError('');
    try {
      const recipesData = JSON.parse(jsonText);
      await sendImportRequest(recipesData);
    } catch (err) {
      setImportError('Error al procesar el JSON: ' + err.message);
      setImportStatus('');
    }
  };

  const handleImportRecipesFromJsonFile = async () => {
    setImportStatus('Importando desde archivo...');
    setImportError('');
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const fileContent = event.target.result;
          const recipesData = JSON.parse(fileContent);
          await sendImportRequest(recipesData);
        } catch (err) {
          setImportError('Error al procesar el archivo JSON: ' + err.message);
          setImportStatus('');
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setImportError('Por favor, selecciona un archivo JSON.');
      setImportStatus('');
    }
  };

  const sendImportRequest = async (recipesData) => {
    try {
      const response = await fetch('/api/admin/import-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipesData),
      });

      if (response.ok) {
        const result = await response.json();
        setImportStatus(result.message || 'Recetas importadas exitosamente.');
      } else {
        const errorResult = await response.json();
        setImportError(errorResult.error || 'Error al importar recetas.');
        setImportStatus('');
      }
    } catch (err) {
      setImportError('Error al enviar datos al backend: ' + err.message);
      setImportStatus('');
    }
  };


  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Panel de Administración</h1>

      <div>
        <h2>Agregar Ingrediente</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del ingrediente"
          value={newIngredient.nombre}
          onChange={handleInputChangeIngredient}
        />
        <input
          type="text"
          name="tipo"
          placeholder="Tipo (carne, verdura, etc.)"
          value={newIngredient.tipo}
          onChange={handleInputChangeIngredient}
        />
        <input
          type="text"
          name="valor_nutricional"
          placeholder="Valor nutricional (opcional)"
          value={newIngredient.valor_nutricional}
          onChange={handleInputChangeIngredient}
        />
        <button onClick={handleAddIngredient}>Agregar Ingrediente</button>
      </div>

      <hr />

      <div>
        <h2>Importar Recetas desde JSON</h2>

        <div>
          <h3>Desde Texto</h3>
          <p>Pega aquí el contenido del archivo JSON con las recetas:</p>
          <textarea
            rows="10"
            cols="80"
            placeholder="[{ &quot;nombre&quot;: &quot;Receta 1&quot;, ... }, { &quot;nombre&quot;: &quot;Receta 2&quot;, ... }]"
            value={jsonText}
            onChange={handleJsonTextChange}
            className="admin-textarea" // Puedes usar clases CSS existentes o crear nuevas
          ></textarea>
          <button onClick={handleImportRecipesFromJsonText} className="admin-button">Importar desde Texto</button>
        </div>

        <hr />

        <div>
          <h3>Desde Archivo</h3>
          <p>Selecciona un archivo JSON con las recetas:</p>
          <input type="file" accept=".json" onChange={handleJsonFileChange} className="admin-file-input" />
          <button onClick={handleImportRecipesFromJsonFile} disabled={!selectedFile} className="admin-button">Importar desde Archivo</button>
          {selectedFile && <p className="admin-selected-file">Archivo seleccionado: {selectedFile.name}</p>}
        </div>

        {importStatus && <p className="admin-status">{importStatus}</p>}
        {importError && <p className="admin-error">{importError}</p>}
      </div>

      <hr />

      <button onClick={navigateToHome}>Volver a la Vista de Usuario</button>
    </div>
  );
}

export default AdminPanel;