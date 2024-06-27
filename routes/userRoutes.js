import express from "express"; // Importa il pacchetto Express
import User from "../models/User.js"; // Importa il modello User

const router = express.Router(); // Crea un router Express

// Rotta ORIGINALE per ottenere tutti gli utenti
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find({}); // Trova tutti gli utenti nel database
//     res.json(users); // Risponde con i dati degli utenti in formato JSON
//   } catch (err) {
//     res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
//   }
// });
//

// Rotta per ottenere gli utenti con PAGINAZIONE
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Estrae il numero di pagina dalla query, default a 1 se non specificato
    const limit = parseInt(req.query.limit) || 10; // Estrae il limite di risultati per pagina, default a 10
    const sort = req.query.sort || "name"; // Determina il campo per l'ordinamento, default a "name"
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1; // Determina la direzione dell'ordinamento (1 per ascendente, -1 per discendente)
    const skip = (page - 1) * limit; // Calcola quanti documenti saltare per arrivare alla pagina richiesta

    // Esegue la query al database con paginazione, ordinamento e limite
    const users = await User.find({})
      .sort({ [sort]: sortDirection }) // Ordina i risultati
      .skip(skip) // Salta i documenti delle pagine precedenti
      .limit(limit); // Limita il numero di risultati

    // Conta il numero totale di utenti nel database
    const total = await User.countDocuments();

    // Invia la risposta JSON con i dati degli utenti e tutte le informazioni di paginazione
    res.json({
      users, // Array degli utenti per la pagina corrente
      currentPage: page, // Numero della pagina corrente
      totalPages: Math.ceil(total / limit), // Calcola il numero totale di pagine
      totalUsers: total, // Numero totale di utenti nel database
    });
  } catch (err) {
    // Gestisce eventuali errori inviando un messaggio di errore
    res.status(500).json({ message: err.message });
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
