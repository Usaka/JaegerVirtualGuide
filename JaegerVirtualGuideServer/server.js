const express = require('express');
const mongoose = require("mongoose");

const app = express()
const port = 10010

app.use(express.json());

mongoose.connect('mongodb+srv://admin:Animal.1209:animalgeek.sytes.net:27017/JeagerVirtual',
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.get('/Login', (req, res) => {
    res.send('Hello Login!')
})

app.listen(port, () => {
    console.log(`Corriendo servidor en el puerto ${port}`)
})