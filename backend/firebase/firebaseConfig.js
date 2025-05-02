const admin = require('firebase-admin');

// **Ruta al archivo de credenciales de la cuenta de servicio**
const serviceAccount = require('./firebase.json');

// Inicializar Firebase Admin con las credenciales de la cuenta de servicio
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Obtener la instancia de Firestore
const db = admin.firestore();

// Exportar la instancia de admin y db para poder usarlas en otros archivos
module.exports = { admin, db };