const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

// accept json in post request
app.use(express.json());

app.get('/hello', function(req,res) {
    return res.json("Hello World");
});

app.get('/', function(req,res) {
    return res.json("Holis");
});

app.listen(5555);



