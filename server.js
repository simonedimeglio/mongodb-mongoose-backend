// Importa i pacchetti necessari
import express from 'express';
import endpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'; // Importa le rotte

// Carica le variabili d'ambiente
dotenv.config();

// Inizializza l'app Express
const app = express();

// Middleware per il parsing del corpo delle richieste JSON
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch((err) => console.error('MongoDB: errore di connessione.', err));

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 5000;

// Endpoint di base per testare il server
app.get('/', (req, res) => {
  res.send('Ciao Mondo!');
});

// Usa le rotte per gli utenti
app.use('/api/users', userRoutes);

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server acceso sulla porta ${PORT}`);
  console.log("Sono disponibili i seguenti endpoints:");
  console.table(endpoints(app));
});
