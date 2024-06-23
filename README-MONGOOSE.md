# Mongoose Schema
In Mongoose, puoi utilizzare diversi tipi di dati (types) all'interno di uno schema per definire la struttura dei documenti nel tuo database MongoDB. 

I principali tipi di dati supportati da Mongoose sono i seguenti: 

### **String:** 
Utilizzato per campi di testo.

```javascript
const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  }
});
```

### **Number:** 
Utilizzato per campi numerici, il tipo `Number` può rappresentare sia numeri interi che numeri decimali. 

MongoDB memorizza i numeri in formato `double`, quindi sia gli interi che i decimali possono essere rappresentati e memorizzati nello stesso tipo di campo.

```javascript
const productSchema = new Schema({
  price: Number,
  quantity: {
    type: Number,
    default: 1
  }
});
```

Altro esempio con maggiori controlli: 

```javascript
const productSchema = new Schema({
  // Campo 'price' può essere intero o decimale
  price: {
    type: Number,
    required: true,
    min: 0 // esempio di validazione: prezzo minimo 0
  },
  // Campo 'stock' deve essere un intero
  stock: {
    type: Number,
    required: true,
    min: 0,
    validate: { // Per validate, controlla la sezione successiva di questa guida!
      validator: Number.isInteger,
      message: '{VALUE} non è un numero intero'
    }
  }
});

module.exports = mongoose.model('Product', productSchema);

```

### **Date:** 
Utilizzato per campi di data e ora
```javascript
const eventSchema = new Schema({
  startDate: Date,
  endDate: {
    type: Date,
    required: true
  }
});
```

### **Boolean:** 
Utilizzato per campi che possono essere vero o falso.
```javascript
const userSchema = new Schema({
  active: Boolean,
  isAdmin: {
    type: Boolean,
    default: false
  }
});
```

### **Array:** 
Utilizzato per campi che contengono una lista di valori dello stesso tipo.
```javascript
const postSchema = new Schema({
  tags: [String],
  comments: [{
    text: String,
    author: String
  }]
});
```

Se si tratta di array di oggetti, posso specificare il tipo di elemento che andrà a finire nell'array come in questo esempio: 

```javascript
const addressSchema = new Schema({ 
	street: String, 
	city: String, 
	country: String 
}); 

const userSchema = new Schema({ 
	name: { 
		type: String, 
		required: true 
	}, 
	addresses: { 
		type: [addressSchema], // Array di oggetti schema 'addressSchema' 
		default: []
	}
});
```

Se invece abbiamo array di tipi "misti", (*pratica sconsigliata che può portare a maggiore complessità nella gestione dei dati*), allora possiamo fare come nell'esempio seguente: 

```javascript
const userSchema = new Schema({ 
	name: { 
		type: String, 
		required: true 
	}, 
	mixedArray: { 
		type: [Schema.Types.Mixed], // Array di tipi misti 
		default: [] 
	} 
});
```


### **ObjectId:** 
Utilizzato per fare riferimento ad un documento in un'altra collezione MongoDB. Qui, ad esempio, `ref: 'Author'` indica che il campo `author` fa riferimento ai documenti della collezione 'authors'.
```javascript
const bookSchema = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  }
});
```

### **Mixed:** 
Utilizzato quando il campo può contenere dati di diversi tipi.
```javascript
const documentSchema = new Schema({
  content: Mixed
});
```


## **Validazioni Predefinite:**

Mongoose offre diverse validazioni predefinite che puoi utilizzare direttamente nei tuoi schemi per garantire che i dati rispettino determinate regole.

**required:** Assicura che un campo sia obbligatorio. Se il campo non è presente, la validazione fallisce.

```javascript
name: { 
	type: String, 
	required: true 
},
age: { 
	type: Number, 
	required: [true, 'L\'età è obbligatoria'], // errore personalizzato
}
```

**min & max:** Utilizzate per i campi di tipo `Number` o `Date` per specificare un valore minimo e massimo.

```javascript
price: { 
	type: Number, 
	min: 0, // prezzo minimo 0 
	max: 10000 // prezzo massimo 10000 
}, 
launchDate: { 
	type: Date, 
	min: '2020-01-01', // data minima
	max: '2025-12-31' // data massima
}
```

**enum:** Specifica un insieme di valori consentiti per un campo `String`.

```javascript
role: { 
	type: String, 
	enum: ['user', 'admin', 'guest'], // valori consentiti 
	default: 'user' 
}
```

**match:** Utilizzata per i campi `String` per garantire che il valore corrisponda a una determinata espressione regolare.

```javascript
email: { 
	type: String, 
	match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // REGEX
	required: true 
}
```

**`maxlength` & `minlength`:** Imposta la lunghezza massima e minima per i campi `String`.

```javascript
username: { 
	type: String, 
	minlength: 3, // lunghezza minima 3 caratteri 
	maxlength: 30 // lunghezza massima 30 caratteri 
}
```

**unique:** Assicura che ogni valore di quel campo sia unico all'interno della collezione. Questa non è una vera e propria validazione ma viene utilizzata per creare un indice unico a livello di database.

```javascript
email: { 
	type: String, 
	unique: true, // garantisce l'unicità dell'email 
	required: true 
}
```

**default:** Imposta un valore predefinito per il campo se non viene fornito.
```javascript
role: { 
	type: String, 
	default: 'user' // valore predefinito 
}
```
## **Proprietà Mongoose:**

### **Validate:**

La proprietà `validate` nello schema Mongoose viene utilizzata per aggiungere validazioni personalizzate ai campi. 

È particolarmente utile quando vuoi applicare regole specifiche che non sono coperte dalle validazioni predefinite di Mongoose come `required`, `min`, `max`, ecc.

La validazione personalizzata utilizza un oggetto con due proprietà principali:

1. `validator`: Una funzione che esegue la validazione. Deve restituire `true` se il valore è valido, altrimenti `false`.
2. `message`: Un messaggio di errore che viene restituito se la validazione fallisce. Può essere una stringa o una funzione che restituisce una stringa.

Esempio:
```javascript
const productSchema = new Schema({
  // Campo 'stock' deve essere un intero
  stock: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} non è un numero intero'
    }
  }
});

module.exports = mongoose.model('Product', productSchema);
```


### **Immutable:**

Rende il campo non modificabile dopo la sua creazione.

```javascript
const userSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // il campo non può essere modificato dopo la creazione
  }
});
```

### **Lowercase, Uppercase & Trim:**

Modificano automaticamente il valore del campo.

```javascript
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // converte in minuscolo
    trim: true // rimuove gli spazi all'inizio e alla fine
  }
});
```