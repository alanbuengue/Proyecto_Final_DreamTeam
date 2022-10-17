const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

// accept json in post request
app.use(express.json());

//fetch test
const fetch = require('node-fetch');

app.get('/hello', function(req,res) {
    return res.json("Hello World");
});

app.get('/', function(req,res) {
    return res.json("Holis");
});

app.listen(5555);

//get city information
app.get('/weather/:city', async function (req,res) {

    try {

        let city = req.params.city;

        const promise1 = new Promise((resolve, reject) => {
            resolve(getCity(city).then(data => { //A PARTIR DEL .THEN ES PARA TRAER LA INFO DEL CLIMA. SIN ESO TRAE LA INFO DE LA CIUDAD
                return getWeather(data.Key); //LE PASO LA KEY DE LA CIUDAD PARA TRAER EL CLIMA
            }));	
          });
          
          promise1.then((value) => {
            //console.log(value);
            res.status(201).json(value)

          });
        
    } catch(err){
            res.status(500).json("Error")
    } 
})

const key = "XqTo6NpoDJ97BTGhKfFc5FeAwJcZ82sa";

const getCity = async(city) => {
    
    const base = "http://dataservice.accuweather.com/locations/v1/cities/search";
    const query = `?apikey=${key}&q=${city}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0];
};

/*
getCity("manchester")
    .then(data=> console.log(data))
    .catch(err => console.log(err));

    */


//get weather information

const getWeather = async (id) => {
    
    const base ="http://dataservice.accuweather.com/currentconditions/v1/";
    const query = `${id}?apikey=${key}`

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0];

}