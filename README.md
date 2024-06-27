# Mongoose App: passaggi per ricreare il progetto

1. **Crea una nuova directory per il progetto e inizializza:**
```bash
mkdir mongoose-app
cd mongoose-app
npm init -y
```
In `package.json` inseriamo:

```javascript
  "type": "module",
```

2. **Installiamo le dipendenze:**
```bash
npm install express mongoose dotenv
```

3.  **Creazione struttura e cartelle**
```bash
mkdir models routes
touch server.js .env
```

4. **Configuriamo il DB:**
```env
// File .env
MONGO_URI=nostra_mongo_db_connection_string
PORT=5001
```

5. **Creazione del modello Mongoose**
```javascript
// models/User.js

// Importa il modulo Mongoose per la gestione del database MongoDB
import { Schema, model } from "mongoose";

// Definizione dello schema dell'utente utilizzando il costruttore Schema di Mongoose
const userSchema = new Schema(
  {
    // Campo 'name' di tipo String obbligatorio (required)
    name: {
      type: String,
      required: true,
    },
    // Campo 'email' di tipo String obbligatorio e unico (unique)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Campo 'role' di tipo String con valori consentiti ('admin' o 'user'), valore predefinito 'user'
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    // Campo 'validated' di tipo Boolean, valore predefinito false
    validated: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Opzioni dello schema:
    collection: "users", // Specifica il nome della collezione nel database MongoDB
  }
);

// Esporta il modello 'User' utilizzando il metodo model di Mongoose
// Il modello 'User' sarà basato sullo schema 'userSchema' definito sopra
const User = model("User", userSchema);
export default User;

```

6. **Creazione delle rotte**
```javascript
// routes/userRoutes.js

import express from "express"; // Importa il pacchetto Express
import User from "../models/User"; // Importa il modello User

const router = express.Router(); // Crea un router Express

// Rotta per ottenere tutti gli utenti
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}); // Trova tutti gli utenti nel database
    res.json(users); // Risponde con i dati degli utenti in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

// Rotta per ottenere un singolo utente
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Trova un utente per ID
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    }
    res.json(user); // Risponde con i dati dell'utente in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

// Rotta per creare un nuovo utente
router.post("/", async (req, res) => {
  const user = new User(req.body); // Crea un nuovo utente con i dati dal corpo della richiesta
  try {
    const newUser = await user.save(); // Salva il nuovo utente nel database
    res.status(201).json(newUser); // Risponde con i dati del nuovo utente e uno status 201 (Created)
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

// Rotta per aggiornare un utente
router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Restituisce il documento aggiornato anziché quello vecchio
    });
    res.json(updatedUser); // Risponde con i dati dell'utente aggiornato in formato JSON
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

// Rotta per eliminare un utente
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); // Elimina un utente per ID
    res.json({ message: "Utente Eliminato" }); // Risponde con un messaggio di conferma
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

export default router; // Esporta il router per l'utilizzo in altri file
```

7. **Configuriamo il server (server.js)**
```js
// server.js

// Importa i pacchetti necessari
import express from 'express';
import endpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // Importa le rotte

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
```

8. **Lanciamo il server con il seguente comando in terminale:**
```bash
node server.js
```

9. **Testiamo le API su Postman**

10. **Creazione del progetto React per gestire i dati latro Frontend**

11. **Paginazione Server-Side**

Per implementare la paginazione server-side in MongoDB utilizzando Mongoose, dovremo modificare principalmente il file `userRoutes.js`.
In particolare dobbiamo modificare la get a "/" per poter passare anche tutti i dati di paginazione!

```javascript
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "name";
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
```
Il codice originale restituiva tutti gli utenti in una singola risposta.
Il nuovo codice implementa la paginazione, l'ordinamento e fornisce metadati sulla paginazione.
Implementando queste modifiche, hai trasformato una semplice API in una soluzione più robusta e flessibile per la gestione degli utenti, adatta a scenari con grandi quantità di dati.

Controlla il file `userRoutes` di questa repository per vedere il codice commentato in ogni suo passaggio.
