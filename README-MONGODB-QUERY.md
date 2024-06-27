# Esempi Query MongoDB

1. **Trovare tutti gli utenti**

```javascript
db.users.find({})
```

2. **Trovare utenti per ruolo**

```javascript
db.users.find({ role: "admin" })
```

3. **Trovare utenti validati**

```javascript
db.users.find({ validated: true })
```

4. **Contare il numero di utenti per ruolo**

```javascript
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])
```

5. **Trovare utenti con un certo dominio email**

```javascript
// NB: il $ indica "alla fine"
db.users.find({ email: /gmail.com$/ })
```

6. **Ordinare gli utenti per nome**

```javascript
// NB: il $ indica "alla fine"
db.users.find({ email: /gmail.com$/ })
```

7. **Trovare utenti il cui nome inizia con una certa lettera**

```javascript
// NB: il ^ indica "all'inizio"
db.users.find({ name: /^A/ })
```
