// backend/utils/counterUtils.js
const { db } = require('../firebase/firebaseConfig');

const getNextId = async (counterName) => {
  const counterRef = db.collection('counters').doc(counterName);

  try {
    const transactionResult = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(counterRef);

      let newId;
      if (!snapshot.exists) {
        newId = 1;
        transaction.set(counterRef, { value: newId });
      } else {
        const previousValue = snapshot.data().value;
        newId = previousValue + 1;
        transaction.update(counterRef, { value: newId });
      }
      return newId;
    });

    return transactionResult;

  } catch (error) {
    console.error(`Error al obtener el siguiente ID para ${counterName} usando transacción:`, error);
    throw error;
  }
};

module.exports = { getNextId };