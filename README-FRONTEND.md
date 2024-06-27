# Creazione del Progetto Frontend React con Vite

Prima di creare la parte relativa al frontend, installiamo cors e modifichiamo il file `server.js` per permetterne l'utilizzo.

1. **Lanciamo in terminale il seguente comando:** 

```bash
npm install cors
```

2. **Configuriamo cors nel nostro server Express, modificando il file `server.js`:**

```javascript
import cors from 'cors';
// resto del codice
app.use(cors());
```