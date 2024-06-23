import express from "express"; // Importa il pacchetto Express
import User from "../models/User.js"; // Importa il modello User

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
