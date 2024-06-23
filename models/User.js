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
