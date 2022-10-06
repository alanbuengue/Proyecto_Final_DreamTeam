const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));

// accept json in post request
app.use(express.json());

app.get('/hello', function(req,res) {
    return res.json("Hello World");
});

// Fiware Routes

// Orion - Get Version
const fiwareRouter = require("./src/routes/fiwareRoutes");
app.get('/orion', fiwareRouter);
app.get('/orion/entities', fiwareRouter);

// IOT get / post info to device
app.post('/iot', fiwareRouter);
app.get('/iot', fiwareRouter);


app.listen(5555);
