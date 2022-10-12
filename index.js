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
app.post('/orion/entities', fiwareRouter);
app.delete('/orion/entities', fiwareRouter);


// IOT get / post info to device
app.get('/iot', fiwareRouter);
app.post('/iot', fiwareRouter);
app.get('/iot/services',fiwareRouter);

// create a IoT service
app.post('/iot/services',fiwareRouter);



app.listen(5555);
